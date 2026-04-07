import { readdirSync } from "node:fs";
import { Command } from "@src/lib/types";
import { join } from "node:path";
import Client from "@src/classes/Client";
import Logger from "@src/lib/logger";

export async function loadCommands(client: Client): Promise<void> {
  const commandsPath = join(__dirname, "..", "commands");
  const files = readdirSync(commandsPath).filter(
    (f) => f.endsWith(".ts") || f.endsWith(".js"),
  );

  for (const file of files) {
    const mod = require(join(commandsPath, file));
    const command: Command = mod.default ?? mod;

    client.commands.set(command.name, command);
    Logger.success(`[CommandHandler] Загружена команда: ${command.name}`);
  }
}
