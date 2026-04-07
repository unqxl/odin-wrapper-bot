import { InlineKeyboardBuilder } from "telegramsjs";
import { Action } from "@src/lib/types";
import Messages from "@src/lib/messages";

const action: Action = {
  name: "disciplines",
  async execute(client, query) {
    if (!query.message) return;

    const author = query.author;
    if (!author) return;

    const user = await client.database.user.findUnique({
      where: { userId: author.id },
    });

    if (!user || !user.setup) {
      await query.message.reply(Messages.INFO.NOT_LOGGED_IN);
      return;
    }

    const wrapper = await client.getWrapper(author.id);
    if (!wrapper) {
      await query.message.reply(Messages.INFO.WRAPPER_ERROR);
      return;
    }

    const disciplines = await wrapper.GetDisciplines();
    const text = Messages.DISCIPLINES.DISCIPLINES_LIST(disciplines.entity.items);

    const keyboard = new InlineKeyboardBuilder();
    for (const discipline of disciplines.entity.items) {
      keyboard.row(
        InlineKeyboardBuilder.text(discipline.name, `discipline_${discipline.id}_1`),
      );
    }

    await query.send("");
    await query.message.edit(text, { parseMode: "HTML", replyMarkup: keyboard });
  },
};

export default action;
