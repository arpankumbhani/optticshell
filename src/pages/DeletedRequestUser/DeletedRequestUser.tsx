import { useQuery } from "@tanstack/react-query";
import { getDeleteRequestedUsersAPI } from "../../api/users.api";
import DeletedRequestUserList from "../../components/DeletedRequestUser/DeletedRequestUserList";
import { useMemo } from "react";
import type { DeleteRequestedUser } from "../../Types/User.type";

export interface DeletedRequestUserRow {
    id: string;
    name: string;
    email: string;
    username: string;
}

export default function DeletedRequestUser() {


    const { data, isLoading, isError } = useQuery({
        queryKey: ["getDeleteRequestedUsersAPI",],
        queryFn: () => getDeleteRequestedUsersAPI(),
        placeholderData: (prev) => prev,
    });


    const rows: DeletedRequestUserRow[] = useMemo(() => {
        return (data?.data ?? []).map((o: DeleteRequestedUser) => ({
            id: o.id,
            name: String(o.name),
            email: o.email,
            username: o.username,
        }));
    }, [data]);
    return (
        <div className="p-4 ml-2">
            <div className="text-[#191B1C] font-medium text-lg pb-4">Deleted Request User</div>

            <DeletedRequestUserList
                rows={rows}
            />

            {isLoading && <div className="p-2 text-sm text-gray-500">Loading...</div>}
            {isError && <div className="p-2 text-sm text-red-600">Failed to load orders.</div>}
        </div>
    );
}
