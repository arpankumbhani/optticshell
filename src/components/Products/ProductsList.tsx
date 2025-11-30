import { useNavigate } from "react-router-dom";
import CommonTable, { type CustomColumnDef } from "../../common/CommonTable";
import { formatDate } from "../../helper/DateFormate";

interface ProductsListProps {
    rows: any[];
    pageIndex: number;
    pageSize: number;
    totalEntries: number;
    pageCount: number;
    onPageChange: (pageIndex: number) => void;

    sortBy: string;
    sortOrder: "ASC" | "DESC" | undefined;
    onSortChange: (col: string, order: "ASC" | "DESC") => void;
}

export default function ProductsList({
    rows,
    pageIndex,
    pageSize,
    totalEntries,
    pageCount,
    onPageChange,
    sortBy,
    sortOrder,
    onSortChange,
}: ProductsListProps) {
    const navigate = useNavigate();



    const columns: CustomColumnDef<any>[] = [
        { accessorKey: "name", header: "PRODUCT NAME", sortable: true },
        { accessorKey: "color_name", header: "COLOR NAME", sortable: true },
        { accessorKey: "total_amount", header: "TOTAL AMOUNT", sortable: true },
        { accessorKey: "total_quantity", header: "TOTAL QUANTITY", sortable: true },
        { accessorKey: "dispatch_quantity", header: "DISPATCH QUANTITY", sortable: true },
        { accessorKey: "pending_quantity", header: "PENDING QUANTITY", sortable: true },

    ];

    return (
        <><div className="flex justify-end w-full">
            <button
                type="button"
                className="border px-6 py-2 bg-blue-50 cursor-pointer  rounded text-blue-600 hover:bg-blue-600 disabled:bg-blue-400 hover:text-white"
                onClick={() => navigate("/products/create")}
            >
                Create Product
            </button>
        </div>
            <div className="p-6">
                <CommonTable
                    data={rows}
                    columns={columns}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalEntries={totalEntries}
                    pageCount={pageCount}
                    onPageChange={onPageChange}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={onSortChange}
                    showCheckbox={false}
                />
            </div>
        </>
    );
}
