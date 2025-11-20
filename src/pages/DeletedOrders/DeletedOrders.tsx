import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DeletedOpticorderRow, DeletedOrdersListResponse } from "../../Types/Order.type";
import { getDeletedOrderListAPI } from "../../api/order.api";
import DeletedOpticordersList from "../../components/DeletedOpticorders/DeletedOpticordersList";

export default function DeletedOrders() {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const params = useMemo(() => ({
    page: pageIndex,
    limit: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
  }), [pageIndex, sortBy, sortOrder]);

  const { data, isLoading, isError } = useQuery<DeletedOrdersListResponse>({
    queryKey: ["getDeletedOrderListAPI", params],
    queryFn: () => getDeletedOrderListAPI(params),
    placeholderData: (prev) => prev,
  });

  const total = data?.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));


  const rows: DeletedOpticorderRow[] = useMemo(() => {
    return (data?.data?.deletedOrders ?? []).map((o) => ({
      id: o.id,
      order_no: String(o.order_number),
      contacts: o.contact_name,
      main_category: o.main_category,
      sub_category: o.sub_category,
      date_created: o.date_created,
    }));
  }, [data]);

  const handleSortChange = (column: string, order: "ASC" | "DESC") => {
    setSortBy(column);
    setSortOrder(order);
    setPageIndex(1);
  };

  return (
    <div className="p-4 ml-2">
      <div className="text-[#191B1C] font-medium py-2">DeletedOrders</div>

      <DeletedOpticordersList
        rows={rows}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalEntries={total}
        pageCount={pageCount}
        onPageChange={setPageIndex}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {isLoading && <div className="p-2 text-sm text-gray-500">Loading...</div>}
      {isError && <div className="p-2 text-sm text-red-600">Failed to load orders.</div>}
    </div>
  );
}
