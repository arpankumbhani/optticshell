// utils/buildQueryString.ts
export const buildQueryString = (params: Record<string, any>): string => {
  const query = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return query ? `?${query}` : "";
};
