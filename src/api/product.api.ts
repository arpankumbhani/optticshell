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
