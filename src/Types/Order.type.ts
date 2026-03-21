import type { ApiMessageResponse, ApiResponse } from "./Api.type";

export interface OrderModifyDetail {
  modify_by: string;
  modify_date: string;
  modify_qty: number;
  prev_qty: number;
}

export interface Order {
  id: string;
  order_number: number;
  order_name: string;
  user_id: string;
  contact_name: string;
  main_category: string;
  sub_category: string;
  sub_customer_name: string;
  order_type: number;
  is_edited: boolean;
  date_created: string;
  order_date: string;
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
  product_id?: string;
  product_color_id?: string;
  qty: number;
  price: number;
  remark: string;
  total_price: number;
  modify_details: OrderModifyDetail[];
}

export interface DeletedOrderModel {
  id: string;
  product_id: string;
  product_color_id: string;
  name: string;
  color_name: string;
  quantity: number;
  price: number;
  remark: string;
  total_price: number;
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

export type OrderDetailsResponse = ApiResponse<OrderDetailsData>;

export interface DeletedOrderDetailsData {
  id: string;
  order_number: number;
  name: string;
  billing_contact: string;
  billing_email: string;
  main_category: string;
  sub_category: string;
  sub_customer_name: string;
  sub_customer_detail: string;
  order_remark: string;
  total_pending_price: number;
  total_pending_qty: number;
  total_dispatch_price: number;
  total_dispatch_qty: number;
  total_price: number;
  total_qty: number;
  order_models: DeletedOrderModel[];
}

export type DeletedOrderDetailsResponse = ApiResponse<DeletedOrderDetailsData>;

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

export interface BulkDeleteOrdersPayload {
  order_ids: string[];
}

export interface DispatchHistoryItem {
  dis_qty: number;
  dis_date: string;
  challan: string;
  total_parcel: number;
  transport: string;
  lr_no: string;
}

export interface DispatchProduct {
  id: string;
  name: string;
  color: string;
  price: number;
  pen_qty: number;
  dis_qty: number;
  dispatch_details: DispatchHistoryItem[];
}

export type DispatchDetailsResponse = ApiResponse<{
  products: DispatchProduct[];
  count: number;
}>;

export interface AddDispatchProductInput {
  order_product_id: string;
  dispatched_quantity: number;
}

export interface AddDispatchDetailsPayload {
  order_id: string;
  dispatch_date: string;
  challan_no: string;
  total_parcel: number;
  transporter: string;
  lr_no: string;
  products: AddDispatchProductInput[];
}

export type OrderMutationResponse = ApiMessageResponse;

export interface DeletedOrderListParams {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  search_text?: string | null;
}
