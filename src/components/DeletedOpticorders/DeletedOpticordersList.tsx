import type { DeletedOpticorderRow } from '../../Types/Order.type';
import type { ColumnDef } from '@tanstack/react-table';
import CommonTable, { type CustomColumnDef } from '../../common/CommonTable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recoverDeletedOrderAPI } from '../../api/order.api';
import UseToast from '../../hooks/useToast';
import { formatDate } from '../../helper/DateFormate';

interface DeletedOpticordersListProps {
    rows: DeletedOpticorderRow[];
    pageIndex: number;
    pageSize: number;
    totalEntries: number;
    pageCount: number;
    onPageChange: (pageIndex: number) => void;
    sortBy: string;
    sortOrder: "ASC" | "DESC";
    onSortChange: (col: string, order: "ASC" | "DESC") => void;
}

export default function DeletedOpticordersList({
    rows,
    pageIndex,
    pageSize,
    totalEntries,
    pageCount,
    onPageChange,
    sortBy,
    sortOrder,
    onSortChange,
}: DeletedOpticordersListProps) {
    // const navigate = useNavigate();
    // const handleViewOrder = (id: string) => {
    //     navigate(`/view-opticorders/${id}`);
    // };
    const queryClient = useQueryClient();
    const recoverMutation = useMutation({
        mutationFn: (id: string) => recoverDeletedOrderAPI(id),
        onSuccess: (res) => {
            UseToast(res?.message || "Order Recovered successfully", "success");
            queryClient.invalidateQueries({ queryKey: ["getDeletedOrderListAPI"] });
        },
        onError: (error: any) => {
            console.error("Recover failed:", error);
            UseToast(error?.message || "Failed to recover", "error");
        }
    });
    const handleRecover = (orderId: string) => {
        recoverMutation.mutate(orderId);
    };
    const columns: CustomColumnDef<DeletedOpticorderRow>[] = [
        {
            accessorKey: "order_no",
            id: "order_number",
            header: "ORDER NO.",
            sortable: true,
            // cell: ({ row }) => (
            //     <button
            //         className="text-[#4E61F6] font-semibold hover:underline text-underline-[#4E61F6]"
            //         onClick={() => handleViewOrder(row.original.id)}
            //     >
            //         {row.original.order_no}
            //     </button>
            // ),
        },
        { accessorKey: "contacts", id: "contact_name", header: "CONTACTS", sortable: false },
        { accessorKey: "main_category", header: "MAIN CATEGORY", sortable: false },
        { accessorKey: "sub_category", header: "SUB CATEGORY", sortable: false },
        {
            accessorKey: "date_created",
            id: "created_at",
            header: "DATE CREATED",
            cell: ({ row }) => formatDate(row.original.date_created), sortable: true
        },
        {
            id: "actions",
            header: "RECOVER",
            cell: ({ row }) => (
                <button
                    onClick={() => handleRecover(row.original.id)}
                    className="px-3 py-1.5 text-sm font-semibold cursor-pointer bg-[#EDEFFE] group-hover:bg-[#4E61F6] text-[#4E61F6] group-hover:text-white rounded-full transition"
                >
                    Order Recover
                </button>
            ),
            sortable: false,

        },
    ];

    return (
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
    )
}
