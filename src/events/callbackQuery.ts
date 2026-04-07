import { CallbackQuery } from "telegramsjs";
import { BotEvent } from "@src/lib/types";
import Client from "@src/classes/Client";
import Logger from "@src/lib/logger";

const event: BotEvent = {
  name: "callbackQuery",
  async execute(client: Client, query: CallbackQuery) {
    if (!query.data) return;

    const [name, ...args] = query.data.split("_");
    const action = client.actions.get(name);

    if (!action) {
      Logger.warn(`[callbackQuery] Неизвестный экшн: ${name}`);
      return;
    }

    await action.execute(client, query, args);
  },
};

export default event;
