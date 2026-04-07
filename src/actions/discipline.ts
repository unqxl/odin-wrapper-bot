import { InlineKeyboardBuilder } from "telegramsjs";
import { Action } from "@src/lib/types";
import Messages from "@src/lib/messages";

const action: Action = {
  name: "discipline",
  async execute(client, query, args) {
    if (!query.message) return;

    const id = args[0];
    if (!id) return;

    const disciplineId = parseInt(id, 10);
    if (isNaN(disciplineId)) return;

    const page = parseInt(args[1] ?? "1", 10);

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

    let activityList = client.getActivityCache(author.id, disciplineId);
    if (!activityList) {
      const activities = await wrapper.GetDisciplineActivities(disciplineId);
      activityList = activities.entity.moduleList.flatMap((m) => m.activities);
      client.setActivityCache(author.id, disciplineId, activityList);
    }

    const { text, totalPages, currentPage } =
      Messages.DISCIPLINES.ACTIVITIES_LIST(activityList, page, disciplineId);

    const keyboard = new InlineKeyboardBuilder();

    const navButtons: ReturnType<typeof InlineKeyboardBuilder.text>[] = [];
    if (currentPage > 1) {
      navButtons.push(
        InlineKeyboardBuilder.text(
          "Назад",
          `discipline_${disciplineId}_${currentPage - 1}`,
        ),
      );
    }

    if (currentPage < totalPages) {
      navButtons.push(
        InlineKeyboardBuilder.text(
          "Вперёд",
          `discipline_${disciplineId}_${currentPage + 1}`,
        ),
      );
    }

    if (navButtons.length) keyboard.row(...navButtons);

    keyboard.row(InlineKeyboardBuilder.text("К дисциплинам", "disciplines"));

    await query.send("");
    await query.message.edit(text, {
      parseMode: "HTML",
      replyMarkup: keyboard,
    });
  },
};

export default action;
