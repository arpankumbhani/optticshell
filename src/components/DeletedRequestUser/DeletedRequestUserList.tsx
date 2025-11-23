import type { CustomColumnDef } from '../../common/CommonTable';
import CommonTable from '../../common/CommonTable';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UseToast from "../../hooks/useToast";
import { approveDeleteRequestedUserAPI, rejectDeleteRequestedUserAPI } from '../../api/users.api';

export default function DeletedRequestUserList({
    rows,
}: {
    rows: any[];
}) {
    const queryClient = useQueryClient();
    const approveMutation = useMutation({
        mutationFn: (id: string) => approveDeleteRequestedUserAPI(id, { delete_status: 1 }),
        onSuccess: (res) => {
            UseToast(res?.message || "User approved successfully", "success");
            queryClient.invalidateQueries({ queryKey: ["getDeleteRequestedUsersAPI"] });
        },
        onError: (error: any) => {
            console.error("Failed to approve user:", error);
            UseToast(error?.message || "Failed to approve user", "error");
        }
    });

    const rejectMutation = useMutation({
        mutationFn: (id: string) => rejectDeleteRequestedUserAPI(id, { delete_status: 2 }),
        onSuccess: (res) => {
            UseToast(res?.message || "User rejected successfully", "success");
            queryClient.invalidateQueries({ queryKey: ["getDeleteRequestedUsersAPI"] });
        },
        onError: (error: any) => {
            console.error("Failed to reject user:", error);
            UseToast(error?.message || "Failed to reject user", "error");
        }
    });

    const handleApprove = (id: string) => {
        approveMutation.mutate(id);
    };
    const handleReject = (id: string) => {
        rejectMutation.mutate(id);
    };

    const columns: CustomColumnDef<any>[] = [
        { accessorKey: "name", header: "NAME", sortable: false },
        { accessorKey: "email", header: "EMAIL", sortable: false },
        { accessorKey: "username", header: "USERNAME", sortable: false },
        {
            id: "approveActions",
            header: "APPROVE",
            cell: ({ row }) => (
                <button
                    onClick={() => handleApprove(row.original.id)}
                    className="px-3 py-1.5 text-sm font-semibold cursor-pointer bg-[#EDEFFE] hover:bg-[#4E61F6] text-[#4E61F6] hover:text-white rounded-full transition"
                >
                    Approve
                </button>
            ),
            sortable: false,
        },
        {
            id: "rejectActions",
            header: "REJECT",
            cell: ({ row }) => (
                <button
                    onClick={() => handleReject(row.original.id)}
                    className="px-3 py-1.5 text-sm font-semibold cursor-pointer bg-[#EDEFFE] hover:bg-[#F64E4E] text-[#F64E4E] hover:text-white rounded-full transition"
                >
                    Reject
                </button>
            ),
            sortable: false,
        },
    ];
    return (
        <div>
            <CommonTable data={rows} columns={columns} />
        </div>
    )
}
