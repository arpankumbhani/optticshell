// CommonTable;
// import React from "react";
// import {
//     flexRender,
//     getCoreRowModel,
//     getPaginationRowModel,
//     useReactTable,
//     type ColumnDef,
// } from "@tanstack/react-table";
// import ArrowLeft from "../assets/svg/ArrowLeft.svg?react";
// import ArrowRight from "../assets/svg/ArrowRight.svg?react";
// import ArrowUp from "../assets/svg/ArrowUp.svg?react";
// import ArrowDown from "../assets/svg/ArrowDown.svg?react";

// export const SortIcon = ({
//     active,
//     direction,
// }: {
//     active: boolean;
//     direction: "ASC" | "DESC" | null | undefined;
// }) => {
//     if (!active) {
//         return (
//             <span className="opacity-30">
//                 <div className="mb-1"><ArrowDown /></div>
//                 <div className="mt-1"><ArrowUp /></div>
//             </span>
//         );
//     }

//     return (
//         <span>
//             {direction === "ASC" ? (
//                 <div className="mt-1"><ArrowUp /></div>
//             ) : (
//                 <div className="mb-1"><ArrowDown /></div>
//             )}
//         </span>
//     );
// };

// export type CustomColumnDef<TData> = ColumnDef<TData> & {
//     sortable?: boolean;
// };
// interface CommonTableProps<TData> {
//     data: TData[];
//     columns: CustomColumnDef<TData>[];
//     pageCount?: number;
//     totalEntries?: number;
//     pageIndex: number;
//     pageSize: number;
//     onPageChange?: (pageIndex: number) => void;
//     sortBy?: string;
//     sortOrder?: "ASC" | "DESC";
//     onSortChange?: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
//     showCheckbox?: boolean;
// }

// export default function CommonTable<TData>({
//     data,
//     columns,
//     pageCount = 1,
//     totalEntries = 0,
//     pageIndex,
//     pageSize,
//     onPageChange,
//     sortBy,
//     sortOrder,
//     onSortChange,
//     showCheckbox = true,
// }: CommonTableProps<TData>) {
//     const table = useReactTable({
//         data,
//         columns,
//         pageCount,
//         getCoreRowModel: getCoreRowModel(),
//         getPaginationRowModel: getPaginationRowModel(),
//         manualPagination: true,
//     });

//     const toggleSort = (colId: string) => {
//         if (!onSortChange) return;

//         if (sortBy !== colId) {
//             onSortChange(colId, "ASC");
//         } else if (sortOrder === "ASC") {
//             onSortChange(colId, "DESC");
//         } else {
//             onSortChange(colId, "ASC");
//         }
//     };

//     const visiblePages = Array.from({ length: pageCount }, (_, i) => i + 1);

//     return (
//         <div className="bg-white rounded-xl border border-gray-200">
//             <div className="overflow-x-auto rounded-xl">
//                 <table className="min-w-full border-collapse text-sm">
//                     <thead className="bg-[#E5E7EA] text-[#262626]">
//                         {table.getHeaderGroups().map((headerGroup) => (
//                             <tr key={headerGroup.id}>
//                                 {/* Checkbox */}
//                                 {showCheckbox && (
//                                     <th className="px-4 py-3 text-left">
//                                         <input
//                                             type="checkbox"
//                                             className="accent-indigo-600 cursor-pointer"
//                                             checked={table.getIsAllPageRowsSelected()}
//                                             onChange={table.getToggleAllPageRowsSelectedHandler()}
//                                         />
//                                     </th>
//                                 )}
//                                 {headerGroup.headers.map((header) => {
//                                     const colId = header.column.id;
//                                     const col = header.column.columnDef as CustomColumnDef<any>;
//                                     const isSortable = col.sortable;

//                                     return (
//                                         <th
//                                             key={header.id}
//                                             className="px-4 py-3 text-left text-xs text-[#686868] font-semibold uppercase tracking-wider"
//                                             onClick={() => {
//                                                 if (isSortable && onSortChange) toggleSort(colId);
//                                             }}
//                                         >
//                                             <div className="flex items-center gap-1">
//                                                 {flexRender(
//                                                     header.column.columnDef.header,
//                                                     header.getContext()
//                                                 )}

//                                                 {/* Sort indicator */}
//                                                 {/* {isSortable && sortBy === colId && (
//                                                     <span>{sortOrder === "ASC" ? <ArrowUp /> : <ArrowDown />}</span>
//                                                 )} */}
//                                                 {isSortable && (
//                                                     <SortIcon
//                                                         active={sortBy === colId}
//                                                         direction={sortBy === colId ? sortOrder : null}
//                                                     />
//                                                 )}
//                                             </div>
//                                         </th>
//                                     );
//                                 })}
//                             </tr>
//                         ))}
//                     </thead>

//                     <tbody className="text-gray-700">
//                         {table.getRowModel().rows.map((row) => (
//                             <tr
//                                 key={row.id}
//                                 className="bg-white group hover:bg-[#EDEFFE] transition-colors duration-150"
//                             >
//                                 {showCheckbox && (
//                                     <td className="px-4 py-3 border-b border-[#E5E7E8]">
//                                         <input
//                                             type="checkbox"
//                                             className="accent-indigo-600 cursor-pointer peer relative "
//                                             checked={row.getIsSelected()}
//                                             onChange={row.getToggleSelectedHandler()}
//                                         />
//                                     </td>
//                                 )}
//                                 {row.getVisibleCells().map((cell) => (
//                                     <td
//                                         key={cell.id}
//                                         className="px-4 py-3 border-b text-[#4A5154] border-[#E5E7E8]"
//                                     >
//                                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))}

//                         {data.length === 0 && (
//                             <tr>
//                                 <td
//                                     colSpan={columns.length + 1}
//                                     className="text-center py-6 text-gray-500"
//                                 >
//                                     No data available
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
//                 <div>
//                     Showing{" "}
//                     <span className="font-semibold">
//                         {data.length > 0 ? (pageIndex - 1) * pageSize + 1 : 0}
//                     </span>{" "}
//                     to{" "}
//                     <span className="font-semibold">
//                         {(pageIndex - 1) * pageSize + data.length}
//                     </span>{" "}
//                     of <span className="font-semibold">{totalEntries} entries</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                     <button
//                         disabled={pageIndex === 1}
//                         onClick={() => onPageChange?.(pageIndex - 1)}
//                         className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EDEFFE] hover:bg-gray-200 disabled:opacity-50"
//                     >
//                         <ArrowLeft className="text-[#4E61F6]" />
//                     </button>

//                     {visiblePages.map((page) => (
//                         <button
//                             key={page}
//                             onClick={() => onPageChange?.(page)}
//                             className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${page === pageIndex
//                                 ? "bg-[#4E61F6] text-white"
//                                 : "bg-gray-100 text-[#6D717F] hover:bg-gray-200"
//                                 }`}
//                         >
//                             {page.toString().padStart(2, "0")}
//                         </button>
//                     ))}

//                     <button
//                         disabled={pageIndex === pageCount}
//                         onClick={() => onPageChange?.(pageIndex + 1)}
//                         className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EDEFFE] hover:bg-gray-200 disabled:opacity-50"
//                     >
//                         <ArrowRight className="text-[#4E61F6]" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import ArrowLeft from "../assets/svg/ArrowLeft.svg?react";
import ArrowRight from "../assets/svg/ArrowRight.svg?react";
import ArrowUp from "../assets/svg/ArrowUp.svg?react";
import ArrowDown from "../assets/svg/ArrowDown.svg?react";

export const SortIcon = ({
    active,
    direction,
}: {
    active: boolean;
    direction: "ASC" | "DESC" | null | undefined;
}) => {
    if (!active) {
        return (
            <span className="opacity-30">
                <div className="mb-1"><ArrowDown /></div>
                <div className="mt-1"><ArrowUp /></div>
            </span>
        );
    }

    return (
        <span>
            {direction === "ASC" ? (
                <div className="mt-1"><ArrowUp /></div>
            ) : (
                <div className="mb-1"><ArrowDown /></div>
            )}
        </span>
    );
};

export type CustomColumnDef<TData> = ColumnDef<TData> & {
    sortable?: boolean;
};

interface CommonTableProps<TData> {
    data: TData[];
    columns: CustomColumnDef<TData>[];

    /** OPTIONAL PROPS */
    pageCount?: number;
    totalEntries?: number;
    pageIndex?: number;
    pageSize?: number;
    onPageChange?: (pageIndex: number) => void;

    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    onSortChange?: (sortBy: string, sortOrder: "ASC" | "DESC") => void;


    showCheckbox?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;

    idAccessor?: (row: TData) => string;
    showDeleteButton?: boolean;
    onDeleteSelected?: (ids: string[]) => void;
}

export default function CommonTable<TData>({
    data,
    columns,
    pageCount,
    totalEntries,
    pageIndex,
    pageSize,
    onPageChange,
    sortBy,
    sortOrder,
    onSortChange,
    showCheckbox = true,
    onSelectionChange,
    idAccessor,
    showDeleteButton,
    onDeleteSelected,
}: CommonTableProps<TData>) {

    /** Detect if pagination is enabled */
    const paginationEnabled =
        pageIndex !== undefined &&
        pageSize !== undefined &&
        pageCount !== undefined &&
        totalEntries !== undefined &&
        typeof onPageChange === "function";

    /** Detect if sorting is enabled */
    const sortingEnabled = typeof onSortChange === "function";
    const [rowSelection, setRowSelection] = useState({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);


    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        pageCount: paginationEnabled ? pageCount : undefined,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: paginationEnabled ? getPaginationRowModel() : undefined,
        manualPagination: paginationEnabled,
    });

    useEffect(() => {
        if (!onSelectionChange) return;

        const selectedRows = table
            .getSelectedRowModel()
            .flatRows.map((row) =>
                idAccessor ? idAccessor(row.original) : (row.original as any).id
            );

        onSelectionChange(selectedRows);
        setSelectedIds(selectedRows);
    }, [rowSelection]);

    const toggleSort = (colId: string) => {
        if (!sortingEnabled) return;

        if (sortBy !== colId) {
            onSortChange!(colId, "ASC");
        } else if (sortOrder === "ASC") {
            onSortChange!(colId, "DESC");
        } else {
            onSortChange!(colId, "ASC");
        }
    };

    const visiblePages =
        paginationEnabled ? Array.from({ length: pageCount! }, (_, i) => i + 1) : [];

    const safeValue = (value: any) => {
        return value == null || value === undefined || value === "" ? "-" : value;
    };


    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-[#E5E7EA] text-[#262626]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>

                                {showCheckbox && (
                                    <th className="px-4 py-3 text-left">
                                        <div className="flex">
                                            <input
                                                type="checkbox"
                                                className="accent-indigo-600 cursor-pointer"
                                                checked={table.getIsAllPageRowsSelected()}
                                                onChange={table.getToggleAllPageRowsSelectedHandler()}
                                            />
                                            {showDeleteButton && selectedIds.length > 0 && (
                                                <div className="flex justify-end pl-2">
                                                    <button
                                                        onClick={() => {
                                                            onDeleteSelected?.(selectedIds);
                                                            table.resetRowSelection();
                                                            setSelectedIds([]);
                                                        }}
                                                        className="bg-[#ffcdcd] text-red-600 text-xs px-2 py-2 rounded-md border border-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
                                                    >
                                                        Delete Selected ({selectedIds.length})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                )}


                                {headerGroup.headers.map((header) => {
                                    const colId = header.column.id;
                                    const col = header.column.columnDef as CustomColumnDef<any>;
                                    const isSortable = sortingEnabled && col.sortable;

                                    return (
                                        <th
                                            key={header.id}
                                            className="px-4 py-3 text-left text-xs text-[#686868] font-semibold uppercase tracking-wider"
                                            onClick={() => {
                                                if (isSortable) toggleSort(colId);
                                            }}
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                                {isSortable && (
                                                    <SortIcon
                                                        active={sortBy === colId}
                                                        direction={sortBy === colId ? sortOrder : null}
                                                    />
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="text-gray-700">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="bg-white group hover:bg-[#EDEFFE] transition-colors duration-150"
                            >
                                {showCheckbox && (
                                    <td className="px-4 py-3 border-b border-[#E5E7E8]">
                                        <input
                                            type="checkbox"
                                            className="accent-indigo-600 cursor-pointer"
                                            checked={row.getIsSelected()}
                                            onChange={row.getToggleSelectedHandler()}
                                        />
                                    </td>
                                )}

                                {row.getVisibleCells().map((cell) => {
                                    const rawValue = flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    );

                                    return (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 border-b text-[#4A5154] border-[#E5E7E8]"
                                        >
                                            {safeValue(rawValue)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}

                        {data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + (showCheckbox ? 1 : 0)}
                                    className="text-center py-6 text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION ONLY IF ENABLED */}
            {paginationEnabled && (
                <div className="flex items-center justify-between px-6 py-4 text-sm text-gray-600">
                    <div>
                        Showing{" "}
                        <span className="font-semibold">
                            {data.length > 0 ? (pageIndex! - 1) * pageSize! + 1 : 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                            {(pageIndex! - 1) * pageSize! + data.length}
                        </span>{" "}
                        of <span className="font-semibold">{totalEntries}</span> entries
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={pageIndex === 1}
                            onClick={() => onPageChange!(pageIndex! - 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EDEFFE] hover:bg-gray-200 disabled:opacity-50"
                        >
                            <ArrowLeft className="text-[#4E61F6]" />
                        </button>

                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange!(page)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${page === pageIndex
                                    ? "bg-[#4E61F6] text-white"
                                    : "bg-gray-100 text-[#6D717F] hover:bg-gray-200"
                                    }`}
                            >
                                {page.toString().padStart(2, "0")}
                            </button>
                        ))}

                        <button
                            disabled={pageIndex === pageCount}
                            onClick={() => onPageChange!(pageIndex! + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EDEFFE] hover:bg-gray-200 disabled:opacity-50"
                        >
                            <ArrowRight className="text-[#4E61F6]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
