import { Command } from "@src/lib/types";
import { Message } from "telegramsjs";
import Messages from "@src/lib/messages";
import Client from "@src/classes/Client";

const command: Command = {
  name: "/curators",
  async execute(message: Message, client: Client) {
    const { author } = message;
    if (!author) return;

    const user = await client.database.user.findUnique({
      where: { userId: author.id },
    });

    if (!user || !user.setup) {
      await message.reply(Messages.INFO.NOT_LOGGED_IN);
      return;
    }

    const wrapper = await client.getWrapper(author.id);
    if (!wrapper) {
      await message.reply(Messages.INFO.WRAPPER_ERROR);
      return;
    }

    await message.chat.send(Messages.CURATORS.GETTING_CURATORS);

    const curators = await wrapper.GetCurators();
    const text = Messages.CURATORS.CURATORS_LIST(curators.entity.groupCurators);

    await message.reply(text, { parseMode: "HTML" });
  },
};

export default command;
