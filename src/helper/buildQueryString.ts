// utils/buildQueryString.ts
export const buildQueryString = (
  params: Record<string, string | number | boolean | null | undefined>
): string => {
  const query = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return query ? `?${query}` : "";
};
