import { readdirSync } from "node:fs";
import { BotEvent } from "@src/lib/types";
import { join } from "node:path";
import Client from "@src/classes/Client";
import Logger from "@src/lib/logger";

export async function loadEvents(client: Client): Promise<void> {
  const eventsPath = join(__dirname, "..", "events");
  const files = readdirSync(eventsPath).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".js"),
  );

  for (const file of files) {
    const mod = require(join(eventsPath, file));
    const event: BotEvent = mod.default ?? mod;

    client.on(event.name, (...args: any[]) => event.execute(client, ...args));
    Logger.success(`[EventHandler] Загружено событие: ${event.name}`);
  }
}
