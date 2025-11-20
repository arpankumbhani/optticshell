import { request } from "./request";

export const loginAPI = async (
  username: string,
  password: string
): Promise<any> => {
  const response = await request({
    url: "admin/login",
    method: "POST",
    body: { username, password },
  });

  return response;
};

export const logoutAPI = async (): Promise<any> => {
  const response = await request({
    url: "admin/logout",
    method: "POST",
  });
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
