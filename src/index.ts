//? Setup
console.clear();
import "dotenv/config";

import { addAlias } from "module-alias";
import { join } from "node:path";

addAlias("@src", __dirname);
addAlias("@", join(__dirname, ".."));

//? Main
import { loadCommands } from "@src/handlers/commandHandler";
import { loadActions } from "@src/handlers/actionHandler";
import { loadEvents } from "@src/handlers/eventHandler";

import Client from "@/src/classes/Client";
const client = new Client(process.env.BOT_TOKEN!);

(async () => {
  await loadCommands(client);
  await loadActions(client);
  await loadEvents(client);
  client.login();
})();
