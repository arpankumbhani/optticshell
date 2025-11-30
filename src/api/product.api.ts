import { buildQueryString } from "../helper/buildQueryString";
import { request } from "./request";

export const getProductListAPI = async ({
  page = 1,
  pageSize = 200,
  category_type = 1,
} = {}): Promise<any> => {
  const response = await request({
    url: `products/productList?page=${page}&pageSize=${pageSize}&category_type=${category_type}`,
    method: "GET",
  });

  return response;
};

export const productColorReportAPI = async (params: any): Promise<any> => {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    search_text: params.search_text,
  });
  const url = `products/productColorReport${queryString}`;
  const response = await request({
    url,
    method: "GET",
  });

  return response;
};

export const createProductAPI = async (params: any): Promise<any> => {
  const response = await request({
    url: `products/createProduct`,
    method: "POST",
    body: params,
  });
  return response;
};
