import type { ApiMessageResponse, ApiResponse } from "./Api.type";

export interface ProductColor {
  id: string;
  color_name: string;
  price: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  standard_quantity: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  image: string | null;
  sku: string;
  productColors: ProductColor[];
  is_in_cart: boolean;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  category_type?: number;
}

export type ProductListResponse = ApiResponse<{
  productList: ProductListItem[];
  count: number;
  cart_category_type: number | null;
  category_type: number;
}>;

export interface ProductColorReportParams {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  search_text?: string;
}

export interface ProductColorReportItem {
  product_id: string;
  product_name: string;
  product_color_id: string;
  color_name: string;
  total_amount: number;
  total_quantity: number;
  dispatch_quantity: number;
  pending_quantity: number;
}

export type ProductColorReportResponse = ApiResponse<{
  total: number;
  items: ProductColorReportItem[];
}>;

export interface CreateProductColorInput {
  name: string;
  price: string;
}

export type CreateProductResponse = ApiMessageResponse;
