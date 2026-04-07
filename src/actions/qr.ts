import { Action } from "@src/lib/types";
import Messages from "@src/lib/messages";

const action: Action = {
  name: "qr",
  async execute(client, query, args) {
    if (!query.message) return;

    const activityId = parseInt(args[0], 10);
    if (isNaN(activityId)) return;

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

    const response = await wrapper.GetActivityQrCode(activityId);
    if (!response?.isSuccess) {
      await query.message.reply("Не удалось получить QR-код.");
      return;
    }

    const base64Data = response.entity.value.replace(
      /^data:image\/\w+;base64,/,
      "",
    );
    const buffer = Buffer.from(base64Data, "base64");

    await query.send("");
    await client.sendPhoto({
      chatId: query.message.chat.id,
      photo: buffer,
    });
  },
};

export default action;
