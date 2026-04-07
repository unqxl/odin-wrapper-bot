import { ActivityListWithStatusEntity } from "@/src/lib/types";
import { Command, Action } from "@/src/lib/types";
import { TelegramClient } from "telegramsjs";
import { Database } from "@/src/lib/prisma";
import OdinWrapper from "@/src/classes/Odin";

class Client extends TelegramClient {
  public database: typeof Database = Database;
  public commands = new Map<string, Command>();
  public actions = new Map<string, Action>();

  private wrappers = new Map<string, OdinWrapper>();
  private activityCache = new Map<string, ActivityListWithStatusEntity[]>();

  constructor(token: string) {
    super(token);
  }

  async getWrapper(userId: string): Promise<OdinWrapper | null> {
    if (this.wrappers.has(userId)) {
      return this.wrappers.get(userId)!;
    }

    const user = await this.database.user.findUnique({ where: { userId } });
    if (!user?.cookies) return null;

    const wrapper = new OdinWrapper(user.cookies, user.token ?? undefined);
    this.wrappers.set(userId, wrapper);

    return wrapper;
  }

  setWrapper(userId: string, wrapper: OdinWrapper) {
    this.wrappers.set(userId, wrapper);
  }

  getActivityCache(userId: string, disciplineId: number) {
    return this.activityCache.get(`${userId}:${disciplineId}`) ?? null;
  }

  setActivityCache(
    userId: string,
    disciplineId: number,
    data: ActivityListWithStatusEntity[],
  ) {
    this.activityCache.set(`${userId}:${disciplineId}`, data);
  }
}

export default Client;
