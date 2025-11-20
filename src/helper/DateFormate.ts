import dayjs from "dayjs";

export const formatDate = (dateString: string) => {
  return dayjs(dateString).format("DD MMM, YYYY hh:mma");
};

export const formatDateTime = (iso: string) => {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
