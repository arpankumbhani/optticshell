import { request } from "./request";
import type {
  OrdersListResponse,
  OrderDetailsResponse,
  DeletedOrdersListResponse,
  GeneratePdfResponse,
} from "../Types/Order.type";
import { buildQueryString } from "../helper/buildQueryString";

export interface AdminOrderListParams {
  page: number;
  limit: number;
  order_type: number | null;
  main_category: string | null;
  sub_category: string | null;
  category_type: number | null;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  search_text?: string | null;
}

export interface DeletedOrderListParams {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  search_text?: string | null;
}

export const getAdminOrderListAPI = async (
  params: AdminOrderListParams
): Promise<OrdersListResponse> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    order_type: params.order_type,
    main_category: params.main_category,
    sub_category: params.sub_category,
    category_type: params.category_type,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    search_text: params.search_text,
  });
  const url = `order/adminOrderList${queryString}`;

  const response = await request({
    url,
    method: "GET",
  });

  return response as unknown as OrdersListResponse;
};

export const getOrderDetailsAPI = async (
  id: string
): Promise<OrderDetailsResponse> => {
  const response = await request({
    url: `order/getOrderDetails/${id}`,
    method: "GET",
  });

  return response as unknown as OrderDetailsResponse;
};

export const getDeletedOrderListAPI = async (
  params: DeletedOrderListParams
): Promise<DeletedOrdersListResponse> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    search_text: params.search_text,
  });
  const url = `order/deletedOrderList${queryString}`;

  const response = await request({
    url,
    method: "GET",
  });

  return response as unknown as DeletedOrdersListResponse;
};

export const recoverDeletedOrderAPI = async (
  id: string
): Promise<OrderDetailsResponse> => {
  const response = await request({
    url: `order/recoverDeletedOrder/${id}`,
    method: "PUT",
  });

  return response as unknown as OrderDetailsResponse;
};

export const generatePdfAPI = async (
  id: string
): Promise<GeneratePdfResponse> => {
  const response = await request({
    url: `order/generateOrderPdf/${id}`,
    method: "GET",
  });

  return response as unknown as GeneratePdfResponse;
};

export const createAdminOrderAPI = async (payload: any): Promise<any> => {
  const response = await request({
    url: `order/createAdminOrder`,
    method: "POST",
    body: payload,
  });

  return response;
};

export const bulkDeleteOrdersAPI = async (payload: any): Promise<any> => {
  const response = await request({
    url: `order/bulkDeleteOrders`,
    method: "POST",
    body: payload,
  });

  return response;
};

export const updateAdminOrderAPI = async (
  id: string,
  payload: any
): Promise<any> => {
  const response = await request({
    url: `order/updateAdminOrder/${id}`,
    method: "PUT",
    body: payload,
  });

  return response;
};

export const getDispatchDetailsAPI = async (id: string): Promise<any> => {
  const response = await request({
    url: `order/getDispatchDetails/${id}`,
    method: "GET",
  });

  return response;
};

export const addDispatchDetailsAPI = async (payload: any): Promise<any> => {
  const response = await request({
    url: `order/addDispatchDetails`,
    method: "POST",
    body: payload,
  });

  return response;
};
