import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generatePdfAPI, getOrderDetailsAPI } from "../../api/order.api";
import type { OrderModel, OrderDetailsResponse } from "../../Types/Order.type";
import UseToast from "../../hooks/useToast";
import { FileText, Pencil, Printer } from "lucide-react";
import { formatDateTime } from "../../helper/DateFormate";

export default function ViewOpticorders() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);

    const { data, isLoading, isError, error } = useQuery<OrderDetailsResponse>({
        queryKey: ["orderDetailsAPI", id],
        queryFn: () => getOrderDetailsAPI(id!),
        enabled: !!id,
    });


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
    if (isLoading) {
        return <div className="p-4 ml-2">Loading order details...</div>;
    }

    if (isError || !data || !data.data) {
        return (
            <div className="p-4 ml-2 text-red-500">
                {error?.message ?? "Failed to load order details"}
            </div>
        );
    }

    const order = data?.data;


    return (
        <div className="p-4 ml-2">
            <div className="flex justify-items-start mb-2 gap-4 items-center">
                <div className="text-[#191B1C] font-medium py-2">
                    Order Overview
                </div>

                <div className="relative">
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className="px-3 py-1.5 border-[1.5px] border-[#0E5FD9] text-[#0E5FD9] rounded-md bg-[#ffff] shadow-sm hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                    >
                        Actions
                        <svg
                            className={`w-4 h-4 transition-transform ${openMenu ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    {openMenu && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 animate-fadeIn">

                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => navigate(`/edit-opticorders/${id}`)}
                            >
                                <Pencil size={16} className="text-[#0E5FD9]" />
                                Edit
                            </button>

                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => navigate(`/model-details/${id}`)}
                            >
                                <FileText size={16} className="text-[#0E5FD9]" />
                                Model Details
                            </button>

                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handlePrint(id as string)}
                            >
                                <Printer size={16} className="text-[#0E5FD9]" />
                                Print as PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="">
                <div className="border border-gray-200 bg-white rounded-lg">
                    <div className="flex items-center mt-4 mx-4 justify-between bg-[#F9FAFB] p-3 pl-5 rounded-lg">
                        <h2 className="text-gray-800 font-semibold">Order Details</h2>
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="p-6 pl-10 col-span-8 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">Order No</label>
                                <input
                                    type="text"
                                    value={order?.order_number}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">Name</label>
                                <input
                                    type="text"
                                    value={order?.name}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Billing Contact
                                </label>
                                <select
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                >
                                    <option>{order?.billing_contact}</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Billing Email
                                </label>
                                <input
                                    type="email"
                                    value={order?.billing_email}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Main Category
                                </label>
                                <input
                                    type="text"
                                    value={order?.main_category}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Sub Category
                                </label>
                                <input
                                    type="text"
                                    value={order?.sub_category}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Sub Customer Name
                                </label>
                                <input
                                    type="text"
                                    value={order?.sub_customer_name}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Sub Customer Details
                                </label>
                                <input
                                    type="text"
                                    value={order?.sub_customer_detail}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Order Remark
                                </label>
                                <input
                                    type="text"
                                    value={order?.order_remark}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Total Pending Price
                                </label>
                                <input
                                    type="text"
                                    value={order?.total_pending_price}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Total Pending Qty
                                </label>
                                <input
                                    type="text"
                                    value={order?.total_pending_qty}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Total Dispatch Price
                                </label>
                                <input
                                    type="text"
                                    value={order?.total_dispatch_price}
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">
                                    Total Dispatch Qty
                                </label>
                                <input
                                    type="text"
                                    value="0"
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">Total Price</label>
                                <input
                                    type="text"
                                    value="23040"
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="text-[#131927] font-medium text-sm mb-1">Total Qty</label>
                                <input
                                    type="text"
                                    value="1920"
                                    disabled
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto border-t border-gray-200">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-[#F9FAFB] text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Color</th>
                                    <th className="px-6 py-3 font-medium">Quantity</th>
                                    <th className="px-6 py-3 font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">Remark</th>
                                    <th className="px-6 py-3 font-medium">Total Price</th>
                                    <th className="px-6 py-3 font-medium">Modify Details</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {order?.order_models.map((item: OrderModel) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-3">{item.name}</td>
                                        <td className="px-6 py-3">{item.color_name}</td>
                                        <td className="px-6 py-3">{item.qty}</td>
                                        <td className="px-6 py-3">{item.price}</td>
                                        <td className="px-6 py-3">{item.remark || "-"}</td>
                                        <td className="px-6 py-3">{item.total_price}</td>

                                        <td className="px-6 py-3">
                                            {item.modify_details && item.modify_details.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {item.modify_details.map((md, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-3 border rounded-lg bg-[#F9FAFB] shadow-sm"
                                                        >
                                                            <div className="text-xs flex gap-1">
                                                                <span className="font-semibold text-gray-800">By:</span>
                                                                <span>{md.modify_by}</span>
                                                            </div>

                                                            <div className="text-xs flex gap-1">
                                                                <span className="font-semibold text-gray-800">Date:</span>
                                                                <span>{formatDateTime(md.modify_date)}</span>
                                                            </div>

                                                            <div className="text-xs flex gap-1">
                                                                <span className="font-semibold text-gray-800">Modify Qty:</span>
                                                                <span
                                                                    className={
                                                                        md.modify_qty < 0
                                                                            ? "text-red-600"
                                                                            : md.modify_qty > 0
                                                                                ? "text-green-600"
                                                                                : "text-gray-700"
                                                                    }
                                                                >
                                                                    {md.modify_qty}
                                                                </span>
                                                            </div>

                                                            <div className="text-xs flex gap-1">
                                                                <span className="font-semibold text-gray-800">Prev Qty:</span>
                                                                <span>{md.prev_qty}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No modifications</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* <div className="overflow-x-auto border-t border-gray-200">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-[#F9FAFB] text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Color</th>
                                    <th className="px-6 py-3 font-medium">Quantity</th>
                                    <th className="px-6 py-3 font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">Remark</th>
                                    <th className="px-6 py-3 font-medium">Total Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {order?.order_models.map((item: OrderModel) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-3">{item.name}</td>
                                        <td className="px-6 py-3">{item.color_name}</td>
                                        <td className="px-6 py-3">{item.qty}</td>
                                        <td className="px-6 py-3">{item.price}</td>
                                        <td className="px-6 py-3">{item.remark || "-"}</td>
                                        <td className="px-6 py-3">{item.total_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
