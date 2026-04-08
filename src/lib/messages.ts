import {
  ActivityListWithStatusEntity,
  ActivityBaseInfoEntity,
  CurrentUserInfoEntity,
  NearestActivityEntity,
  CurrentInfoEntity,
  StudentTaskEntity,
  DisciplineEntity,
  CuratorsEntity,
} from "@src/lib/types";
import { stripIndent } from "common-tags";

function yesOrNo(value: boolean): string {
  return value
    ? `<tg-emoji emoji-id="5868687869245132157">👍</tg-emoji>`
    : `<tg-emoji emoji-id="6035154762914073481">❌</tg-emoji>`;
}

const Messages = {
  WELCOME:
    "Добро пожаловать в <strong>Odin Wrapper Bot</strong>!\n\nПожалуйста, используйте команду /setup для настройки вашего аккаунта.",

  ACCOUNT_ALREADY_SETUP:
    "Ваш аккаунт уже настроен!\n\nЕсли вы хотите изменить настройки, пожалуйста, обратитесь в поддержку.",

  USE_START:
    "Пожалуйста, используйте команду /start для начала работы с ботом.",

  SETUP: {
    EMAIL_PROMPT: "Пожалуйста, введите вашу почту от Odin.",
    PASSWORD_PROMPT: "Пожалуйста, введите пароль от аккаунта Odin.",
    TIMEOUT: "Время ответа истекло.\n\nПожалуйста, начните настройку заново.",

    LOGIN_PENDING: "Проверка данных, пожалуйста, подождите...",
    LOGIN_SUCCESS: "Успешный вход! Сохранение данных...",
    LOGIN_FAILED: stripIndent`
      <strong>Ошибка входа!</strong>
      Не удалось войти в аккаунт с предоставленными данными!
    
      Пожалуйста, проверьте вашу почту и пароль и попробуйте снова.
      Также убедитесь, что у вас установлен пароль на аккаунте Odin, так как вход через университеты не поддерживается ботом.
    `,

    LOGIN_WELCOME: (firstName: string) =>
      `Добро пожаловать, ${firstName}!\n\nВаши данные были сохранены в базу данных!`,
  },

  INFO: {
    NOT_LOGGED_IN:
      "Вы не вошли в аккаунт Odin.\n\nПожалуйста, используйте команду /setup для настройки вашего аккаунта.",

    WRAPPER_ERROR:
      "Произошла ошибка при загрузке ваших данных. Пожалуйста, попробуйте снова или обратитесь в поддержку.",

    GETTING_INFO: "Получение информации об аккаунте, пожалуйста, подождите...",
    CURRENT_INFO: (info: CurrentInfoEntity, user: CurrentUserInfoEntity) => {
      const fullName = user.fullName || `${info.firstName} ${info.lastName}`;
      const email = info.email;
      const isVerified = info.isEmailConfirmed
        ? "Подтверждена"
        : "Не подтверждена";

      const roles = user.rolesModel;
      const rolesString =
        user.rolesModel.userRolesArray.join(", ") || "Нет ролей";

      const isSuperAdmin = yesOrNo(roles.isSuperAdministrator);
      const isDemoUser = yesOrNo(roles.isDemo);
      const isAuditor = yesOrNo(roles.isAuditor);
      const isStudent = yesOrNo(roles.isStudent);
      const isTeacher = yesOrNo(roles.isTeacher);
      const isEPAdmin = yesOrNo(roles.isEducationalProgramAdministrator);
      const isDivisionAdmin = yesOrNo(roles.isDivisionAdministrator);
      const isContentManager = yesOrNo(roles.isUniversityContentManager);
      const isUniversityAdmin = yesOrNo(roles.isUniversityAdministrator);
      const isGroupCurator = yesOrNo(roles.isGroupCurator);
      const isCohortAdmin = yesOrNo(roles.isCohortAdministrator);
      const isUniversityEmployee = yesOrNo(roles.isUniversityEmployee);

      const connections =
        user.universitiesThreeConnected
          .map((conn) => `<strong>${conn.name}</strong>`)
          .join(", ") || "Нет подключенных университетов";

      return stripIndent`
        <strong>Информация об аккаунте:</strong>

        Имя: ${fullName}
        Почта: ${email}
        Статус почты: ${isVerified}

        <strong>Роли:</strong>
        → <strong>Присвоенные роли:</strong> ${rolesString}
        → <strong>Супер администратор</strong>: ${isSuperAdmin}
        → <strong>Демо пользователь</strong>: ${isDemoUser}
        → <strong>Аудитор</strong>: ${isAuditor}
        → <strong>Студент</strong>: ${isStudent}
        → <strong>Преподаватель</strong>: ${isTeacher}
        → <strong>Администратор обр. программы</strong>: ${isEPAdmin}
        → <strong>Администратор подразделения</strong>: ${isDivisionAdmin}
        → <strong>Контент-менеджер университета</strong>: ${isContentManager}
        → <strong>Администратор университета</strong>: ${isUniversityAdmin}
        → <strong>Куратор группы</strong>: ${isGroupCurator}
        → <strong>Администратор когорты</strong>: ${isCohortAdmin}
        → <strong>Сотрудник университета</strong>: ${isUniversityEmployee}

        <strong>Подключенные университеты:</strong>
        ${connections}
      `;
    },
  },

  CURATORS: {
    GETTING_CURATORS: "Получение списка кураторов, пожалуйста, подождите...",

    CURATORS_LIST: (curators: CuratorsEntity[]) => {
      if (!curators.length) {
        return "У вас нет кураторов.";
      }

      const curatorsList = curators
        .map(
          (curator, i) =>
            `${i + 1}. <strong>${curator.firstName} ${curator.middleName} ${curator.lastName}</strong>`,
        )
        .join("\n");

      return `<strong>Ваши кураторы:</strong>\n${curatorsList}`;
    },
  },

  ACTIVITIES: {
    GETTING_ACTIVITIES:
      "Получение списка ближайших активностей, пожалуйста, подождите...",

    ACTIVITIES_LIST: (activities: NearestActivityEntity[]) => {
      if (!activities.length) {
        return "У вас нет ближайших активностей.";
      }

      const activitiesList = activities
        .map((activity, i) => {
          const duration = activity.duration;
          const type = activity.typeOfString;
          const name = activity.name.replaceAll("_", "");

          const date_end = new Date(activity.endDateTime).toLocaleDateString(
            "ru-RU",
          );
          const date_start = new Date(
            activity.startDateTime,
          ).toLocaleDateString("ru-RU");

          const date =
            date_start === date_end
              ? date_start
              : `${date_start} - ${date_end}`;

          return [
            `${i + 1}. <strong>${name}</strong>:`,
            `   → Тип активности: <strong>${type}</strong>`,
            `   → Длительность: <strong>${duration} ч.</strong>`,
            `   → Диапазон дат: <strong>${date}</strong>`,
          ].join("\n");
        })
        .join("\n\n");

      return `<strong>Ваши ближайшие активности:</strong>\n\n${activitiesList}`;
    },
  },

  TASKS: {
    GETTING_TASKS: "Получение статуса задач, пожалуйста, подождите...",

    TASKS_LIST: (tasks: StudentTaskEntity[]) => {
      if (!tasks.length) {
        return "У вас нет отправленных задач.";
      }

      const tasksList = tasks
        .map((task, i) => {
          const name = task.activityName.replaceAll("_", "");
          const type = task.activityTypeOfString;
          const status = task.activityStatusOfSting;

          return `${i + 1}. <strong>${name}</strong>\n   → Тип активности: <strong>${type}</strong>\n   → Статус: <strong>${status}</strong>`;
        })
        .join("\n\n");

      return `<strong>Статус ваших задач:</strong>\n\n${tasksList}`;
    },
  },

  DISCIPLINES: {
    GETTING_DISCIPLINES: "Получение списка дисциплин, пожалуйста, подождите...",
    GETTING_ACTIVITIES:
      "Получение списка активностей, пожалуйста, подождите...",

    DISCIPLINES_LIST: (disciplines: DisciplineEntity[]) => {
      if (!disciplines.length) {
        return "У вас нет активных дисциплин.";
      }

      const disciplinesList = disciplines
        .map((discipline, i) => {
          const name = discipline.name.replaceAll("_", "");
          const progress = discipline.progressPassed;
          const allActivities = discipline.allActivityCount;
          const link = `https://www.odin.study/ru/Discipline/Info/${discipline.id}`;

          return `${i + 1}. <strong>${name}</strong>\n   → Пройдено активностей: <strong>${progress}/${allActivities}</strong>\n   → <a href="${link}">Подробнее</a>`;
        })
        .join("\n\n");

      return `<strong>Ваши дисциплины:</strong>\n\n${disciplinesList}\n\nНажмите на дисциплину, чтобы узнать подробности.`;
    },

    ACTIVITIES_LIST: (
      activities: ActivityListWithStatusEntity[],
      page: number,
    ) => {
      const PAGE_SIZE = 5;
      const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      const slice = activities.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      );

      if (!slice.length) {
        return {
          text: "У этой дисциплины нет активностей.",
          totalPages: 1,
          currentPage: 1,
        };
      }

      const offset = (currentPage - 1) * PAGE_SIZE;
      const activitiesList = slice
        .map((activity, i) => {
          const name = activity.name.replaceAll("_", "");
          const type = activity.type;
          const status = activity.statusLocalized ?? "Нет статуса";

          const startDate = new Date(activity.startDate).toLocaleDateString(
            "ru-RU",
          );
          const endDate = activity.endDate
            ? new Date(activity.endDate).toLocaleDateString("ru-RU")
            : null;

          const dates = endDate ? `${startDate} - ${endDate}` : startDate;

          return `${offset + i + 1}. <strong>${name}</strong>\n   → Тип активности: <strong>${type}</strong>\n   → Статус: <strong>${status}</strong>\n   → Даты проведения: <strong>${dates}</strong>`;
        })
        .join("\n\n");

      const text = `<strong>Активности дисциплины</strong> (стр. ${currentPage}/${totalPages}):\n\n${activitiesList}`;

      return { text, totalPages, currentPage, slice };
    },

    ACTIVITY_INFO: (activity: ActivityBaseInfoEntity) => {
      const name = activity.name.replaceAll("_", "");

      const fmt = (dt: string) =>
        new Date(dt).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      return stripIndent`
        <strong>${name}</strong>

        → Начало: <strong>${fmt(activity.startDateTime)}</strong>
        → Конец: <strong>${fmt(activity.endDateTime)}</strong>
      `;
    },
  },

  ACTIVITY: {
    GETTING_INFO:
      "Получение информации об активности, пожалуйста, подождите...",
  },

  QR: {
    GETTING_QR: "Получение QR-кода, пожалуйста, подождите...",
  },
};

export default Messages;
