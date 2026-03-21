export interface ApiResponse<TData> {
  code: number;
  status: string;
  message: string;
  data: TData;
}

export interface ApiMessageResponse {
  code: number;
  status: string;
  message: string;
}

export interface ApiError {
  message: string;
}
