import { readdirSync } from "node:fs";
import { Action } from "@src/lib/types";
import { join } from "node:path";
import Client from "@src/classes/Client";
import Logger from "@src/lib/logger";

export async function loadActions(client: Client): Promise<void> {
  const actionsPath = join(__dirname, "..", "actions");
  const files = readdirSync(actionsPath).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".js"),
  );

  for (const file of files) {
    const mod = require(join(actionsPath, file));
    const action: Action = mod.default ?? mod;

    client.actions.set(action.name, action);
    Logger.success(`[ActionHandler] Загружен экшн: ${action.name}`);
  }
}
