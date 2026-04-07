import type { CallbackQuery, EventHandlers, Message } from "telegramsjs";
import type Client from "@src/classes/Client";

export interface Command {
  name: string;
  execute(message: Message, client: Client): Promise<void>;
}

export interface Action {
  name: string;
  execute(client: Client, query: CallbackQuery, args: string[]): Promise<void>;
}

export interface BotEvent {
  name: keyof EventHandlers;
  execute(client: Client, ...args: any[]): Promise<void>;
}

export type OdinError = {
  key: string;
  value: string;
};

export type BaseResponse<T> = {
  entity: T;
  errors: OdinError[];
  httpStatusCode: number;
  isSuccess: boolean;
};

export type BasePagedResponse<T> = BaseResponse<{
  pageItems: T[];
  pagedMetaData: {
    pageCount: number;
    totalItemCount: number;
    pageNumber: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    firstItemOnPage: number;
    lastItemOnPage: number;
  };
}>;

export type LoginResponse = BaseResponse<{ token: string }>;
export type CurrentInfoResponse = BaseResponse<CurrentInfoEntity>;
export type CurrentUserInfoResponse = BaseResponse<CurrentUserInfoEntity>;
export type CuratorsResponse = BaseResponse<{ groupCurators: CuratorsEntity[] }>; // prettier-ignore
export type NearestActivityResponse = BaseResponse<{ items: NearestActivityEntity[] }>; // prettier-ignore
export type StudentTasksResponse = BasePagedResponse<StudentTaskEntity>;
export type DisciplinesResponse = BaseResponse<{ items: DisciplineEntity[] }>;
export type DisciplineActivitiesResponse = BaseResponse<DisciplineActivityEntity>; // prettier-ignore

export type CurrentInfoEntity = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isEmailConfirmed: boolean;
  isFirstVisit: boolean;
  supportEmail: string;
  libraryId: number;
  roles: string[];
  rolesOfString: string[];
  canSendNotifications: boolean;
  isPushEnabled: boolean;
  isBlocked: boolean;
  timeZoneOffsetMinutes: number;
  language: number;
  myselfChatId: number;
  isVisibleUniversitiesMenuPage: boolean;
  canUseQrScanner: boolean;
};

export type UniversityConnection = {
  id: number;
  name: string;
  shortName: string;
};

export type CurrentUserInfoEntity = {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;

  rolesModel: {
    userRoles: string;
    userRolesArray: string[];
    isSuperAdministrator: boolean;
    isDemo: boolean;
    isAuditor: boolean;
    isStudent: boolean;
    isTeacher: boolean;
    isEducationalProgramAdministrator: boolean;
    isDivisionAdministrator: boolean;
    isUniversityContentManager: boolean;
    isUniversityAdministrator: boolean;
    isGroupCurator: boolean;
    isCohortAdministrator: boolean;
    isUniversityEmployee: boolean;
  };

  timeZoneOffsetMinutes: number;
  universitiesThreeConnected: UniversityConnection[];
};

export type CuratorsEntity = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
};

export type NearestActivityEntity = {
  id: number;
  name: string;
  type: number;
  typeOfString: string;
  startDateTime: string;
  endDateTime: string;
  isOnline: boolean;
  isAsynchronous: boolean;
  isHybrid: boolean;
  curatorGroups: any[];
  duration: number;
};

export type StudentTaskEntity = {
  activityStatus: number;
  activityStatusOfSting: string;
  activityId: number;
  activityName: string;
  activityType: number;
  activityTypeOfString: string;
};

export type DisciplineEntity = {
  allActivityCount: number;
  breadcrumbs: string[];
  id: number;
  logo: string;
  name: string;
  progressPassed: number;
};

export type ActivityListEntity = {
  id: number;
  name: string;
  order: number;
  type: string;
  typeId: number;
  duration: number;
  startDate: string;
  endDate?: string;
  canView: boolean;
  meetingType: number;
};

export type ActivityListWithStatusEntity = ActivityListEntity & {
  status?: number;
  statusLocalized?: string;
};

export type ModuleListEntity = {
  id: number;
  name: string;
  description: string;
  order: number;
  activities: ActivityListWithStatusEntity[];
  themes: any[];
  xApiId: string;
};

export type DisciplineActivityEntity = {
  activityList: ActivityListEntity[];
  themeList: any[];
  moduleList: ModuleListEntity[];
};
