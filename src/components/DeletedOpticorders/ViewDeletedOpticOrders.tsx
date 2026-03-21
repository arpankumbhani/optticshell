import { useQuery } from '@tanstack/react-query';
import { getDeletedOrderDetailsAPI } from '../../api/order.api';
import { useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { DeletedOrderModel } from '../../Types/Order.type';

export default function ViewDeletedOpticOrders() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isError, error } = useQuery({
        queryKey: ["getDeletedOrderDetailsAPI"],
        queryFn: () => getDeletedOrderDetailsAPI(id!),
        enabled: !!id,
    });
    if (isError || !data || !data.data) {
        return (
            <div className="p-4 ml-2 text-red-500">
                {error?.message ?? "Failed to load order details"}
            </div>
        );
    }

    const deletedOrderDetails = data?.data;

    return (
        <>
            <div className="p-4 ml-2">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 border border-[#0E5FD9] text-[#0E5FD9] rounded-full px-2 cursor-pointer hover:text-[#0037ff] hover:border-[#0037ff]">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="mb-1"> Go Back</span>
                </button>
                <div className="text-[#191B1C] font-medium text-lg py-2">Deleted Order Details</div>
                <div className="p-6 bg-white rounded-md shadow-sm mx-auto">
                    <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                        Deleted Order Details
                    </h2>
                    <div className="pl-5">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-8 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[#131927] font-medium text-sm mb-1">Order Number</label>
                                    <input
                                        type="text"
                                        value={deletedOrderDetails.order_number}
                                        disabled
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[#131927] font-medium text-sm mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={deletedOrderDetails.name}
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
                                        <option>{deletedOrderDetails.billing_contact}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[#131927] font-medium text-sm mb-1">
                                        Billing Email
                                    </label>
                                    <input
                                        type="email"
                                        value={deletedOrderDetails.billing_email}
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
                                        value={deletedOrderDetails.main_category}
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
                                        value={deletedOrderDetails.sub_category}
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
                                        value={deletedOrderDetails.sub_customer_name}
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
                                        value={deletedOrderDetails.sub_customer_detail}
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
                                        value={deletedOrderDetails.order_remark}
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
                                        value={deletedOrderDetails.total_pending_price}
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
                                        value={deletedOrderDetails.total_pending_qty}
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
                                        value={deletedOrderDetails.total_dispatch_price}
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
                                        value={deletedOrderDetails.total_dispatch_qty}
                                        disabled
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[#131927] font-medium text-sm mb-1">Total Price</label>
                                    <input
                                        type="text"
                                        value={deletedOrderDetails.total_price}
                                        disabled
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-[#131927] font-medium text-sm mb-1">Total Qty</label>
                                    <input
                                        type="text"
                                        value={deletedOrderDetails.total_qty}
                                        disabled
                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-gray-200 bg-white rounded-lg mt-4">

                    <div className="overflow-x-auto border rounded-lg border-gray-200">
                        <table className="min-w-full rounded-lg text-sm text-left">
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
                                {deletedOrderDetails.order_models.map((item: DeletedOrderModel) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-3">{item.name}</td>
                                        <td className="px-6 py-3">{item.color_name}</td>
                                        <td className="px-6 py-3">{item.quantity}</td>
                                        <td className="px-6 py-3">{item.price}</td>
                                        <td className="px-6 py-3">{item.remark || "-"}</td>
                                        <td className="px-6 py-3">{item.total_price}</td>
                                    </tr>
                                ))}
                                {deletedOrderDetails.order_models.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">
                                            No deleted order models found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
