import type { ApiMessageResponse, ApiResponse } from "./Api.type";

export interface UserDropdownItem {
  id: string;
  name: string;
  email: string;
}

export type UsersForOrderDropdownResponse = ApiResponse<UserDropdownItem[]>;

export interface DeleteRequestedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_logo: string | null;
  username: string;
  city: string;
  state: string;
  address: string | null;
  pincode: string | null;
}

export type DeleteRequestedUsersResponse = ApiResponse<DeleteRequestedUser[]>;

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gst_number: string;
  profile_logo: string | null;
}

export type UserProfileResponse = ApiResponse<UserProfile>;

export interface ResetPasswordPayload {
  old_password: string;
  new_password: string;
}

export type ResetPasswordResponse = ApiMessageResponse;
