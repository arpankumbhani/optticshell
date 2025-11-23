import { request } from "./request";

export const getDeleteRequestedUsersAPI = async (): Promise<any> => {
  const response = await request({
    url: `users/getDeleteRequestedUsers`,
    method: "GET",
  });

  return response;
};

export const approveDeleteRequestedUserAPI = async (
  id: string,
  body: { delete_status: number }
): Promise<any> => {
  const response = await request({
    url: `users/updateDeleteStatus/${id}`,
    method: "PUT",
    body,
  });
  return response;
};

export const rejectDeleteRequestedUserAPI = async (
  id: string,
  body: { delete_status: number }
): Promise<any> => {
  const response = await request({
    url: `users/updateDeleteStatus/${id}`,
    method: "PUT",
    body,
  });
  return response;
};

export const getUserProfileAPI = async (): Promise<any> => {
  const response = await request({
    url: `users/getUserProfile`,
    method: "GET",
  });

  return response;
};

export const resetPasswordAPI = async (body: {
  old_password: string;
  new_password: string;
}) => {
  const response = await request({
    url: `admin/reset_password`,
    method: "POST",
    body,
  });
  return response;
};
