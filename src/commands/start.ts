import { Message } from "telegramsjs";
import Client from "@src/classes/Client";
import Messages from "@src/lib/messages";
import { Command } from "@src/lib/types";

const command: Command = {
  name: "/start",
  async execute(message: Message, client: Client) {
    const { author } = message;
    if (!author) return;

    const user = await client.database.user.findUnique({
      where: { userId: author.id },
    });

    if (!user) {
      await client.database.user.create({ data: { userId: author.id } });
      await message.reply(Messages.WELCOME, { parseMode: "HTML" });
    }
  },
};

export default command;
