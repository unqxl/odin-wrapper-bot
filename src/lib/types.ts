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
export type ActivityBaseInfoResponse = BaseResponse<ActivityBaseInfoEntity>;
export type ActivityQrCodeResponse = BaseResponse<{ value: string }>;

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

export type ActivityBaseInfoEntity = {
  id: number;
  name: string;
  cohortId: number;
  cohortStartEducationDateTime: string;
  disciplineId: number;
  disciplineName: string;
  type: number;
  typeName: string;
  activityDataViewPermissionInfo: {
    canViewDetail: number;
    isCanViewSummary: boolean;
    isTemporaryDenied: boolean;
    deniedReasonText: string[];
  };
  canViewDataAccess: number;
  startDateTime: string;
  endDateTime: string;
  disciplineStartDateTime: string;
  duration: number;
  description: string;
  meetingType: number;
  permissions: {
    currentIsActivityStudent: boolean;
    canStudentLearnContent: boolean;
    currentCanEditActivity: boolean;
    currentIsSuperAdministrator: boolean;
    showActivityStatusBlock: boolean;
    canViewSolutions: boolean;
    canCreatePlan: boolean;
    canViewCompletion: boolean;
    isActivityCompletionAllowed: boolean;
    currentCanManageUavExtensionsReport: boolean;
    currentCanViewUavExtensionsReport: boolean;
    canDoTask: boolean;
  };
  teachers: {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    photoUrl?: string;
  }[];
  defaultChatId: number;
  isDisabledChat: boolean;
  breadcrumbs: {
    routePage: number;
    entityId: number;
    text: string;
  }[];
  isCallsEnabled: boolean;
  isCallInOdin: boolean;
  activeCallId: number;
  allStudentSolutions: number;
  studentsInTotal: number;
  studentHasSolution: boolean;
  isCriterionAssessment: boolean;
  isHiddenInMarksTable: boolean;
  knowledgeTags: unknown[];
  rating: {
    currentMark: number;
    rating: number;
    canRate: boolean;
    marksCount: number;
  };
  isFinalAttestation: boolean;
  isUavFinalAttestation: boolean;
  addresses: unknown[];
  isLinearAccessEnabled: boolean;
  isNeedSaveContentStatistics: boolean;
  isInMigrationExam: boolean;
  isUavProject: boolean;
  isExtracurricularCourse: boolean;
  isNeedStatistic: boolean;
  canHaveUavPracticalReport: boolean;
  canHaveUavExtensionsReport: boolean;
  uavMaxTaskDurationSeconds: number;
  isShowQrGenerator: boolean;
  isCodeOfFuture2025WithAdaptationTheme: boolean;
  isWaitingToVisitForFinishActivity: boolean;
  isRequiredU2035Activity: boolean;
};
