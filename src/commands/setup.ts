import { createCollector, hashText } from "@src/lib/utils";
import { Command } from "@src/lib/types";
import { Message } from "telegramsjs";
import OdinWrapper from "@src/classes/Odin";
import Messages from "@src/lib/messages";
import Client from "@src/classes/Client";

const command: Command = {
  name: "/setup",
  async execute(message: Message, client: Client) {
    const { author } = message;
    if (!author) return;

    const user = await client.database.user.findUnique({
      where: { userId: author.id },
    });

    if (!user) {
      await message.reply(Messages.USE_START);
      return;
    }

    if (user.setup) {
      await message.reply(Messages.ACCOUNT_ALREADY_SETUP, {
        parseMode: "HTML",
      });

      return;
    }

    const filter = (m: Message) => m.author?.id === author.id;

    const email_msg = await message.reply(Messages.SETUP.EMAIL_PROMPT);
    const email_res = await createCollector(email_msg, filter);
    if (!email_res) return void email_msg.reply(Messages.SETUP.TIMEOUT);

    const pass_msg = await email_res.reply(Messages.SETUP.PASSWORD_PROMPT);
    const pass_res = await createCollector(pass_msg, filter);
    if (!pass_res) return void pass_msg.reply(Messages.SETUP.TIMEOUT);

    const email = email_res.content;
    const password = pass_res.content;

    await message.chat.send(Messages.SETUP.LOGIN_PENDING);

    const userWrapper = new OdinWrapper();
    await userWrapper.RetrieveBaseCookies();

    const login_result = await userWrapper.TryLogin(email, password);
    if (!login_result.isSuccess) {
      await pass_res.reply(Messages.SETUP.LOGIN_FAILED);
      return;
    }

    await message.chat.send(Messages.SETUP.LOGIN_SUCCESS);

    await client.database.user.update({
      where: { userId: author.id },
      data: {
        setup: true,
        email,
        password: hashText(password),
        token: login_result.entity.token,
        cookies: userWrapper.serializeCookies(),
      },
    });

    client.setWrapper(author.id, userWrapper);
    userWrapper.setToken(login_result.entity.token);

    const user_info = await userWrapper.GetCurrentInfo();
    await message.chat.send(
      Messages.SETUP.LOGIN_WELCOME(user_info.entity.firstName),
    );
  },
};

export default command;
