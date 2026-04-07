import { InlineKeyboardBuilder } from "telegramsjs";
import { Action } from "@src/lib/types";
import Messages from "@src/lib/messages";

const action: Action = {
  name: "activity",
  async execute(client, query, args) {
    if (!query.message) return;

    const activityId = parseInt(args[0], 10);
    if (isNaN(activityId)) return;

    const disciplineId = parseInt(args[1], 10);
    if (isNaN(disciplineId)) return;

    const page = parseInt(args[2] ?? "1", 10);

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

    const response = await wrapper.GetActivityBaseInfo(activityId);
    if (!response?.isSuccess) {
      await query.message.reply(
        "Не удалось получить информацию об активности.",
      );
      return;
    }

    const activity = response.entity;
    const text = Messages.DISCIPLINES.ACTIVITY_INFO(activity);

    const keyboard = new InlineKeyboardBuilder();

    if (activity.isShowQrGenerator) {
      keyboard.row(
        InlineKeyboardBuilder.text("Получить QR-код", `qr_${activityId}`),
      );
    }

    keyboard.row(
      InlineKeyboardBuilder.text(
        "К списку активностей",
        `discipline_${disciplineId}_${page}`,
      ),
    );

    await query.send("");
    await query.message.edit(text, {
      parseMode: "HTML",
      replyMarkup: keyboard,
    });
  },
};

export default action;
