import { request } from "./request";

export const getOrderDetailsAPI = async (id: string): Promise<any> => {
  const response = await request({
    url: `dispatch/getOrderDetails/${id}`,
    method: "GET",
  });

  return response;
};
