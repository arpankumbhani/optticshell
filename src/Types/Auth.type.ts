import type { ApiResponse } from "./Api.type";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  user_type: number;
  profile_logo?: string;
  auth_token: string;
  refresh_token: string;
}

export type LoginResponse = ApiResponse<AuthUser>;
