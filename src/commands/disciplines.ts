import { Message, InlineKeyboardBuilder } from "telegramsjs";
import { Command } from "@src/lib/types";
import Messages from "@src/lib/messages";
import Client from "@src/classes/Client";

const command: Command = {
  name: "/disciplines",
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

    await message.chat.send(Messages.DISCIPLINES.GETTING_DISCIPLINES);

    const disciplines = await wrapper.GetDisciplines();
    const text = Messages.DISCIPLINES.DISCIPLINES_LIST(
      disciplines.entity.items,
    );

    const keyboard = new InlineKeyboardBuilder();
    for (const discipline of disciplines.entity.items) {
      const value = `discipline_${discipline.id}`;
      keyboard.row(InlineKeyboardBuilder.text(discipline.name, value));
    }

    await message.reply(text, { parseMode: "HTML", replyMarkup: keyboard });
  },
};

export default command;
