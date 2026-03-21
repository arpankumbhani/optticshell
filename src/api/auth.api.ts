import { request } from "./request";
import type { LoginResponse } from "../Types/Auth.type";
import type { ApiMessageResponse } from "../Types/Api.type";

export const loginAPI = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await request<LoginResponse, undefined, { username: string; password: string }>({
    url: "admin/login",
    method: "POST",
    body: { username, password },
  });

  return response;
};

export const logoutAPI = async (): Promise<ApiMessageResponse> => {
  const response = await request<ApiMessageResponse>({
    url: "admin/logout",
    method: "POST",
  });

  return response;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
