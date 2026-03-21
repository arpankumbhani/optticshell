import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productColorReportAPI } from "../../api/product.api";
import ProductsList from "../../components/Products/ProductsList";
import type { ProductColorReportItem } from "../../Types/Product.type";

export interface ProductReportRow {
    id: string;
    name: string;
    color_name: string;
    total_amount: number;
    total_quantity: number;
    dispatch_quantity: number;
    pending_quantity: number;
}

export default function Products() {
    const [pageIndex, setPageIndex] = useState(1);
    const pageSize = 20;

    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

    const params = useMemo(() => ({
        page: pageIndex,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
        search_text: "",
    }), [pageIndex, sortBy, sortOrder]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["productColorReportAPI", params],
        queryFn: () => productColorReportAPI(params),
        placeholderData: (prev) => prev,
    });

    const total = data?.data?.total ?? 0;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    const rows: ProductReportRow[] = useMemo(() => {
        return (data?.data?.items ?? []).map((o: ProductColorReportItem) => ({
            id: o.product_id,
            name: o.product_name,
            color_name: o.color_name,
            total_amount: o.total_amount,
            total_quantity: o.total_quantity,
            dispatch_quantity: o.dispatch_quantity,
            pending_quantity: o.pending_quantity,
        }));
    }, [data]);

    const handleSortChange = (column: string, order: "ASC" | "DESC") => {
        setSortBy(column);
        setSortOrder(order);
        setPageIndex(1);
    };

    return (
        <div className="p-4 ml-2">
            <ProductsList
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

