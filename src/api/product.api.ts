import { buildQueryString } from "../helper/buildQueryString";
import { request } from "./request";
import type {
  CreateProductResponse,
  ProductColorReportParams,
  ProductColorReportResponse,
  ProductListParams,
  ProductListResponse,
} from "../Types/Product.type";

export const getProductListAPI = async ({
  page = 1,
  pageSize = 200,
  category_type = 1,
}: ProductListParams = {}): Promise<ProductListResponse> => {
  const response = await request<ProductListResponse>({
    url: `products/productList?page=${page}&pageSize=${pageSize}&category_type=${category_type}`,
    method: "GET",
  });

  return response;
};

export const productColorReportAPI = async (
  params: ProductColorReportParams
): Promise<ProductColorReportResponse> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    search_text: params.search_text,
  });
  const url = `products/productColorReport${queryString}`;
  const response = await request<ProductColorReportResponse>({
    url,
    method: "GET",
  });

  return response;
};

export const createProductAPI = async (params: FormData): Promise<CreateProductResponse> => {
  const response = await request<CreateProductResponse, undefined, FormData>({
    url: `products/createProduct`,
    method: "POST",
    body: params,
  });
  return response;
};
