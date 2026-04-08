import { Action } from "@src/lib/types";
import Messages from "@src/lib/messages";

const action: Action = {
  name: "complete",
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

    await query.send(Messages.COMPLETE.COMPLETING);

    const response = await wrapper.MarkActivityAsPassed(activityId);
    if (!response?.isSuccess) {
      await query.message.reply(Messages.COMPLETE.FAILED);
      return;
    }

    await query.message.reply(Messages.COMPLETE.SUCCESS);
  },
};

export default action;
