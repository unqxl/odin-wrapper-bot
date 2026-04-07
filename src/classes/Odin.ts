import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import Axios from "axios";

//? Types
import {
  DisciplineActivitiesResponse,
  CurrentUserInfoResponse,
  NearestActivityResponse,
  StudentTasksResponse,
  CurrentInfoResponse,
  DisciplinesResponse,
  CuratorsResponse,
  LoginResponse,
  ActivityBaseInfoResponse,
  ActivityQrCodeResponse,
} from "@src/lib/types";
import { AxiosInstance, AxiosResponse } from "axios";

class OdinWrapper {
  public client: AxiosInstance;
  private jar: CookieJar;

  constructor(serializedCookies?: string, token?: string) {
    this.jar = serializedCookies
      ? CookieJar.deserializeSync(JSON.parse(serializedCookies))
      : new CookieJar();

    this.client = wrapper(
      Axios.create({
        jar: this.jar,
        baseURL: "https://odin.study",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    );
  }

  setToken(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async RetrieveBaseCookies() {
    try {
      await this.client.get("/auth/login");
      console.log("Cookies retrieved successfully");
    } catch (error) {
      console.error("Error retrieving cookies:", error);
    }
  }

  serializeCookies(): string {
    return JSON.stringify(this.jar.serializeSync());
  }

  async TryLogin(email: string, password: string) {
    var response: AxiosResponse<LoginResponse, any, {}>;
    try {
      response = await this.client.post<LoginResponse>("/api/Account/Login", {
        email,
        password,
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }

    return response?.data;
  }

  async GetCurrentInfo() {
    var response: AxiosResponse<CurrentInfoResponse, any, {}>;
    try {
      response = await this.client.get<CurrentInfoResponse>(
        "/api/Account/CurrentInfo",
      );
    } catch (error) {
      console.error("Error fetching current info:", error);
    }

    return response?.data;
  }

  async GetCurrentUserInfo() {
    var response: AxiosResponse<CurrentUserInfoResponse, any, {}>;
    try {
      response = await this.client.get<CurrentUserInfoResponse>(
        "/api/User/CurrentUserInfo",
      );
    } catch (error) {
      console.error("Error fetching current info:", error);
    }

    return response?.data;
  }

  async GetCurators() {
    var response: AxiosResponse<CuratorsResponse, any, {}>;
    try {
      response = await this.client.get<CuratorsResponse>(
        "/api/Dashboard/Curators",
      );
    } catch (error) {
      console.error("Error fetching curators:", error);
    }

    return response?.data;
  }

  async GetNearestActivities() {
    var response: AxiosResponse<NearestActivityResponse, any, {}>;
    try {
      response = await this.client.get<NearestActivityResponse>(
        "/api/Dashboard/NearestActivities",
      );
    } catch (error) {
      console.error("Error fetching nearest activities:", error);
    }

    return response?.data;
  }

  async GetStudentTasks(page: number = 1) {
    var response: AxiosResponse<StudentTasksResponse, any, {}>;
    try {
      response = await this.client.get<StudentTasksResponse>(
        `/api/Dashboard/StudentTasks?page=${page}`,
      );
    } catch (error) {
      console.error("Error fetching student tasks:", error);
    }

    return response?.data;
  }

  async GetDisciplines() {
    var response: AxiosResponse<DisciplinesResponse, any, {}>;
    try {
      response = await this.client.get<DisciplinesResponse>(
        "/api/Dashboard/Disciplines",
      );
    } catch (error) {
      console.error("Error fetching disciplines:", error);
    }

    return response?.data;
  }

  async GetDisciplineActivities(disciplineId: number) {
    var response: AxiosResponse<DisciplineActivitiesResponse, any, {}>;
    try {
      response = await this.client.get<DisciplineActivitiesResponse>(
        `/api/Discipline/GetDisciplineActivities`,
        {
          params: { disciplineId },
        },
      );
    } catch (error) {
      console.error("Error fetching discipline activities:", error);
    }

    return response?.data;
  }

  async GetActivityBaseInfo(activityId: number) {
    var response: AxiosResponse<ActivityBaseInfoResponse, any, {}>;
    try {
      response = await this.client.get<ActivityBaseInfoResponse>(
        `/api/Activity/BaseInfo`,
        {
          params: { activityId },
        },
      );
    } catch (error) {
      console.error("Error fetching activity base info:", error);
    }

    return response?.data;
  }

  async GetActivityQrCode(activityId: number) {
    var response: AxiosResponse<ActivityQrCodeResponse, any, {}>;
    try {
      response = await this.client.get<ActivityQrCodeResponse>(
        `/api/Activity/GetQrCode`,
        {
          params: { activityId },
        },
      );
    } catch (error) {
      console.error("Error fetching activity QR code:", error);
    }

    return response?.data;
  }
}

export default OdinWrapper;
