import { request } from "./request";
import type { ApiMessageResponse } from "../Types/Api.type";
import type {
  DeleteRequestedUsersResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  UserProfileResponse,
  UsersForOrderDropdownResponse,
} from "../Types/User.type";

export const getDeleteRequestedUsersAPI = async (): Promise<DeleteRequestedUsersResponse> => {
  const response = await request<DeleteRequestedUsersResponse>({
    url: `users/getDeleteRequestedUsers`,
    method: "GET",
  });

  return response;
};

export const approveDeleteRequestedUserAPI = async (
  id: string,
  body: { delete_status: number }
): Promise<ApiMessageResponse> => {
  const response = await request<ApiMessageResponse, undefined, { delete_status: number }>({
    url: `users/updateDeleteStatus/${id}`,
    method: "PUT",
    body,
  });
  return response;
};

export const rejectDeleteRequestedUserAPI = async (
  id: string,
  body: { delete_status: number }
): Promise<ApiMessageResponse> => {
  const response = await request<ApiMessageResponse, undefined, { delete_status: number }>({
    url: `users/updateDeleteStatus/${id}`,
    method: "PUT",
    body,
  });
  return response;
};

export const getUserProfileAPI = async (): Promise<UserProfileResponse> => {
  const response = await request<UserProfileResponse>({
    url: `users/getUserProfile`,
    method: "GET",
  });

  return response;
};

export const resetPasswordAPI = async (
  body: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const response = await request<ResetPasswordResponse, undefined, ResetPasswordPayload>({
    url: `admin/reset_password`,
    method: "POST",
    body,
  });
  return response;
};

export const getUsersForOrderDropdown = async (): Promise<UsersForOrderDropdownResponse> => {
  const response = await request<UsersForOrderDropdownResponse>({
    url: `users/getUsersForOrderDropdown`,
    method: "GET",
  });

  return response;
};
