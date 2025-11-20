import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import OpticordersList from "../../components/Opticorders/ViewOpticordersList";
import { getAdminOrderListAPI } from "../../api/order.api";
import type { Order, OrdersListResponse, OpticorderRow } from "../../Types/Order.type";
import ViewOpticordersList from "../../components/Opticorders/ViewOpticordersList";

export default function ViewOpticOrders() {
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 10;

    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

    const params = useMemo(() => ({
        page: pageIndex,
        limit: pageSize,
        order_type: null,
        main_category: "",
        sub_category: "",
        category_type: null,
        sort_by: sortBy,
        sort_order: sortOrder,
        search_text: "",
    }), [pageIndex, sortBy, sortOrder]);

    const { data, isLoading, isError } = useQuery<OrdersListResponse>({
        queryKey: ["getAdminOrderListAPI", params],
        queryFn: () => getAdminOrderListAPI(params),
        placeholderData: (prev) => prev,
    });

    const total = data?.data?.total ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    const rows: OpticorderRow[] = useMemo(() => {
        return (data?.data?.orders ?? []).map((o) => ({
            id: o.id,
            order_no: String(o.order_number),
            contacts: o.contact_name,
            main_category: o.main_category,
            sub_category: o.sub_category,
            sub_customer: o.sub_customer_name,
            order_type: String(o.order_type),
            date_created: new Date(o.date_created).toLocaleString(),
        }));
    }, [data]);

    const handleSortChange = (column: string, order: "ASC" | "DESC") => {
        setSortBy(column);
        setSortOrder(order);
        setPageIndex(1);
    };

    return (
        <div className="p-4 ml-2">
            <div className="text-[#191B1C] font-medium py-2">Opticorders</div>

            <ViewOpticordersList
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
