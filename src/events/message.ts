import { BotEvent } from "@src/lib/types";
import { Message } from "telegramsjs";
import Client from "@src/classes/Client";

const event: BotEvent = {
  name: "message",
  async execute(client: Client, message: Message) {
    if (!message.author || !message.content) return;

    const command = client.commands.get(message.content);
    if (!command) return;

    await command.execute(message, client);
  },
};

export default event;
