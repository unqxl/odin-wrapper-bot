import { BotEvent } from "@src/lib/types";
import Client from "@src/classes/Client";
import Logger from "@src/lib/logger";

const event: BotEvent = {
  name: "ready",
  async execute(client: Client) {
    Logger.success(`Logged in as ${client.user?.username}!`);

    await client.user.setCommands([
      { command: "/start", description: "Стартовая команда" },
      { command: "/setup", description: "Настройка аккаунта" },
      {
        command: "/info",
        description: "Получить информацию о текущем аккаунте",
      },
      {
        command: "/curators",
        description:
          "Получить список кураторов (для авторизованных пользователей)",
      },
      {
        command: "/activities",
        description:
          "Получить список ближайших активностей (для авторизованных пользователей)",
      },
      {
        command: "/tasks",
        description:
          "Получить статус отправленных задач (для авторизованных пользователей)",
      },
      {
        command: "/disciplines",
        description:
          "Получить список дисциплин (для авторизованных пользователей)",
      },
    ]);
  },
};

export default event;
