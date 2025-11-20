import type { AxiosResponse } from "./Axios";

export interface Order {
  id: string;
  order_number: number;
  contact_name: string;
  main_category: string;
  sub_category: string;
  sub_customer_name: string;
  order_type: number;
  date_created: string;
}

export interface OrdersListResponse {
  code: number;
  status: string;
  message: string;
  data: {
    total: number;
    orders: Order[];
  };
}

export interface OrderModel {
  id: string;
  name: string;
  color_name: string;
  qty: number;
  price: number;
  remark: string;
  total_price: number;
  modify_details: any[];
}

export interface OrderDetailsData {
  id: string;
  order_number: number;
  name: string;
  status: number;
  user_id: string;
  billing_contact: string;
  billing_email: string;
  billing_state: string;
  billing_city: string;
  category_type: number;
  main_category: string;
  sub_category: string;
  order_type: number;
  sub_customer_name: string;
  sub_customer_detail: string;
  order_remark: string;
  order_image: string;
  total_pending_qty: number;
  total_pending_price: number;
  total_dispatch_qty: number;
  total_dispatch_price: number;
  total_qty: number;
  total_price: number;
  order_models: OrderModel[];
}

export type OrderDetailsResponse = AxiosResponse<OrderDetailsData>;

export interface AdminOrderListParams {
  page: number;
  limit: number;
  order_type: number;
  main_category: string;
  sub_category: string;
  category_type: number;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  search_text?: string;
}

export interface OpticorderRow {
  id: string;
  order_no: string;
  contacts: string;
  main_category: string;
  sub_category: string;
  sub_customer: string;
  order_type: string;
  date_created: string;
}

// DeletedOrders

export interface DeletedOpticorderRow {
  id: string;
  order_no: string;
  contacts: string;
  main_category: string;
  sub_category: string;
  date_created: string;
}

export interface DeletedOrders {
  id: string;
  order_number: string;
  contact_name: string;
  main_category: string;
  sub_category: string;
  date_created: string;
}

export interface DeletedOrdersListResponse {
  code: number;
  status: string;
  message: string;
  data: {
    total: number;
    deletedOrders: DeletedOrders[];
  };
}

// GeneratePdf
export interface GeneratePdfResponse {
  code: number;
  status: string;
  message: string;
  data: {
    pdf_url: string;
  };
}
