import { Command } from "@src/lib/types";
import { Message } from "telegramsjs";
import Messages from "@src/lib/messages";
import Client from "@src/classes/Client";

const command: Command = {
  name: "/tasks",
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

    await message.chat.send(Messages.TASKS.GETTING_TASKS);

    const tasks = await wrapper.GetStudentTasks();
    const text = Messages.TASKS.TASKS_LIST(tasks.entity.pageItems);

    await message.reply(text, { parseMode: "HTML" });
  },
};

export default command;
