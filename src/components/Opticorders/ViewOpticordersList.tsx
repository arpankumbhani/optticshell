import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import CommonTable, { type CustomColumnDef } from "../../common/CommonTable";
import type { OpticorderRow } from "../../Types/Order.type";
import { formatDate } from "../../helper/DateFormate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseToast from "../../hooks/useToast";
import { generatePdfAPI } from "../../api/order.api";

interface OpticordersListProps {
    rows: OpticorderRow[];
    pageIndex: number;
    pageSize: number;
    totalEntries: number;
    pageCount: number;
    onPageChange: (pageIndex: number) => void;

    sortBy: string;
    sortOrder: "ASC" | "DESC";
    onSortChange: (col: string, order: "ASC" | "DESC") => void;
}

export default function ViewOpticordersList({
    rows,
    pageIndex,
    pageSize,
    totalEntries,
    pageCount,
    onPageChange,
    sortBy,
    sortOrder,
    onSortChange,
}: OpticordersListProps) {
    const navigate = useNavigate();

    const handleViewOrder = (id: string) => {
        navigate(`/view-opticorders/${id}`);
    };

    const queryClient = useQueryClient();
    const generatePdfMutation = useMutation({
        mutationFn: (id: string) => generatePdfAPI(id),
        onSuccess: (res) => {
            const pdfUrl = res?.data?.pdf_url;
            if (pdfUrl) {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.target = "_blank";
                link.download = pdfUrl.split("/").pop() || "order.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
                UseToast(res?.message || "Order PDF generated successfully", "success");
                queryClient.invalidateQueries({ queryKey: ["getOpticorderListAPI"] });
            }
        },
        onError: (error: any) => {
            console.error("Failed to generate PDF:", error);
            UseToast(error?.message || "Failed to generate PDF", "error");
        }
    });

    const handlePrint = (orderId: string) => {
        generatePdfMutation.mutate(orderId);
    };

    const columns: CustomColumnDef<OpticorderRow>[] = [
        {
            accessorKey: "order_no",
            id: "order_number",
            header: "ORDER NO.",
            cell: ({ row }) => (
                <button
                    className="text-[#4E61F6] font-semibold hover:underline text-underline-[#4E61F6]"
                    onClick={() => handleViewOrder(row.original.id)}
                >
                    {row.original.order_no}
                </button>
            ),
            sortable: true,
        },
        { accessorKey: "contacts", id: "contact_name", header: "CONTACTS", sortable: false },
        { accessorKey: "main_category", header: "MAIN CATEGORY", sortable: false },
        { accessorKey: "sub_category", header: "SUB CATEGORY", sortable: false },
        { accessorKey: "sub_customer", header: "SUB CUSTOMER", sortable: false },
        { accessorKey: "order_type", header: "ORDER TYPE", sortable: true },
        { accessorKey: "date_created", id: "created_at", header: "DATE CREATED", cell: ({ row }) => formatDate(row.original.date_created), sortable: true },
        {
            id: "actions",
            header: "PRINT",
            cell: ({ row }) => (
                <button
                    onClick={() => handlePrint(row.original.id)}
                    className="px-3 py-1.5 text-sm font-semibold cursor-pointer bg-[#EDEFFE] group-hover:bg-[#4E61F6] text-[#4E61F6] group-hover:text-white rounded-full transition"
                >
                    Print View
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
            />
        </div>
    );
}
