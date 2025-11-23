import { useQuery } from "@tanstack/react-query";
import { getDeleteRequestedUsersAPI } from "../../api/users.api";
import DeletedRequestUserList from "../../components/DeletedRequestUser/DeletedRequestUserList";
import { useMemo } from "react";

export default function DeletedRequestUser() {


    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ["getDeleteRequestedUsersAPI",],
        queryFn: () => getDeleteRequestedUsersAPI(),
        placeholderData: (prev) => prev,
    });


    const rows: any[] = useMemo(() => {
        return (data?.data ?? []).map((o) => ({
            id: o.id,
            name: String(o.name),
            email: o.email,
            username: o.username,
        }));
    }, [data]);
    return (
        <div className="p-4 ml-2">
            <div className="text-[#191B1C] font-medium py-2">Deleted Request User</div>

            <DeletedRequestUserList
                rows={rows}
            />

            {isLoading && <div className="p-2 text-sm text-gray-500">Loading...</div>}
            {isError && <div className="p-2 text-sm text-red-600">Failed to load orders.</div>}
        </div>
    );
}
