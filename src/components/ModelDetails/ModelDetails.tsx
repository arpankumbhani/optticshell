import React, { useEffect, useState } from "react";
import { addDispatchDetailsAPI, getDispatchDetailsAPI } from "../../api/order.api";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import UseToast from "../../hooks/useToast";

export default function ModelDetails() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { data: dispatchData, isLoading } = useQuery({
        queryKey: ["orderDetailsAPI", id],
        queryFn: () => getDispatchDetailsAPI(id!),
        enabled: !!id,
    });

    const addDispatchMutation = useMutation({
        mutationFn: (payload: any) => addDispatchDetailsAPI(payload),
        onSuccess: (res: any) => {
            UseToast(res?.message || "Dispatch details added successfully", "success");
            queryClient.invalidateQueries({ queryKey: ["orderDetailsAPI", id] });
        },
        onError: (err: any) => {
            console.error("Update Error:", err);
            UseToast(err?.message || "Failed to add dispatch details", "error");
        },
    });

    const products: any[] = dispatchData?.data?.products || [];
    const [qtyValues, setQtyValues] = useState<{ [key: string]: number }>({});

    const totalDispatchAmount = Object.keys(qtyValues).reduce((sum, prodId) => {
        const product = products.find((p: any) => p.id === prodId);
        return sum + (qtyValues[prodId] || 0) * (product?.price || 0);
    }, 0);


    const formik = useFormik({
        initialValues: {
            dispatch_date: "",
            challan_no: "",
            total_price: "",
            transport: "",
            lr_no: "",
        },
        validationSchema: Yup.object({
            dispatch_date: Yup.date().required("Date is Required"),
            challan_no: Yup.string().required("Challan No is Required"),
            total_price: Yup.number().required("Total Price is Required"),
            transport: Yup.string().required("Transport is Required"),
            lr_no: Yup.string().required("LR No is Required"),
        }),
        onSubmit: (values) => {
            const dispatchedProducts = Object.keys(qtyValues)
                .map((prodId) => {
                    const qty = qtyValues[prodId];
                    if (qty <= 0) return null;
                    const product = products.find((p: any) => p.id === prodId);
                    if (!product) return null;
                    if (qty > product.pen_qty) {
                        UseToast(`Quantity for ${product.name} exceeds pending quantity`, "warning");
                        return null;
                    }
                    return {
                        order_product_id: prodId,
                        dispatched_quantity: qty,
                    };
                })
                .filter(Boolean);

            if (dispatchedProducts.length === 0) {
                UseToast("Please enter at least one quantity", "warning");
                return;
            }
            const payload = {
                order_id: id,
                dispatch_date: values.dispatch_date,
                challan_no: values.challan_no,
                total_parcel: dispatchedProducts.reduce((sum, p: any) => sum + p.dispatched_quantity, 0),
                total_price: totalDispatchAmount,
                transporter: values.transport,
                lr_no: values.lr_no,
                products: dispatchedProducts,
            };

            addDispatchMutation.mutate(payload);

        },
    });

    useEffect(() => {
        formik.setFieldValue("total_price", totalDispatchAmount || "");
    }, [totalDispatchAmount]);

    const handleQtyChange = (productId: string, value: string) => {
        const qty = Math.max(0, Number(value) || 0);
        setQtyValues((prev) => ({ ...prev, [productId]: qty }));
    };

    const handleAddAllPending = () => {
        const updated: Record<string, number> = {};
        products.forEach((p: any) => {
            updated[p.id] = p.pen_qty || 0;
        });
        setQtyValues(updated);
    };
    if (isLoading) return <div className="p-4 text-center">Loading...</div>;

    return (
        <div className="p-4 ml-2">
            <div className="text-[#191B1C] font-medium py-2">Model Details</div>

            <div className="p-6">

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-[#E5E7EA] text-[#262626]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">NAME</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">COLOR</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">DIS QTY</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">AMOUNT</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">PEN QTY</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">PRICE</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">DISPATCHED</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">DATE</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">CHALLAN</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">PARCEL</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">TRANSPORT</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">LR NO.</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {products.map((p: any) => {
                                    const currentQty = qtyValues[p.id] || 0;
                                    const currentAmount = currentQty * p.price;
                                    const dispatchCount = p.dispatch_details?.length || 0;

                                    // Case 1: No dispatch history yet
                                    if (dispatchCount === 0) {
                                        return (
                                            <tr key={p.id} className="bg-white hover:bg-gray-50">
                                                <td className="px-4 py-3 border-b border-gray-300 font-medium">{p.name}</td>
                                                <td className="px-4 py-3 border-b border-gray-300">{p.color}</td>
                                                <td className="px-4 py-3 border-b border-gray-300 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={p.pen_qty}
                                                        className="w-20 px-2 py-1 border rounded text-center"
                                                        value={currentQty}
                                                        onChange={(e) => handleQtyChange(p.id, e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 border-b border-gray-300 text-center font-medium">
                                                    {currentAmount || "-"}
                                                </td>
                                                <td className="px-4 py-3 border-b border-gray-300 text-center">{p.pen_qty}</td>
                                                <td className="px-4 py-3 border-b border-gray-300 text-center">{p.price}</td>
                                                <td className="px-4 py-3 border-b border-gray-300 text-center">{p.dis_qty}</td>
                                                <td colSpan={5} className="px-4 py-3 border-b border-gray-300 text-center text-gray-400 italic">
                                                    No dispatch history
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // Case 2: Has dispatch history → show multiple rows
                                    return p.dispatch_details.map((d: any, idx: number) => {
                                        const isLast = idx === dispatchCount - 1;
                                        const borderClass = isLast ? "group border-b border-gray-300" : "";

                                        return (
                                            <tr key={`${p.id}-dispatch-${idx}`} className="hover:bg-gray-50">
                                                {/* Show product info only on the first row */}
                                                {idx === 0 && (
                                                    <>
                                                        <td rowSpan={dispatchCount} className="px-4 border-b border-gray-300 py-3 align-middle font-medium">
                                                            {p.name}
                                                        </td>
                                                        <td rowSpan={dispatchCount} className="px-4 border-b border-gray-300 py-3 align-middle">
                                                            {p.color}
                                                        </td>
                                                        <td rowSpan={dispatchCount} className="px-4 border-b border-gray-300 py-3 text-center align-middle">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={p.pen_qty}
                                                                className="w-20 px-2 py-1 border rounded text-center"
                                                                value={currentQty}
                                                                onChange={(e) => handleQtyChange(p.id, e.target.value)}
                                                            />
                                                        </td>
                                                        <td rowSpan={dispatchCount} className="px-4 border-b border-gray-300 py-3 text-center align-middle font-medium">
                                                            {currentAmount || "-"}
                                                        </td>
                                                        <td rowSpan={dispatchCount} className="px-4 border-b border-gray-300 py-3 text-center align-middle">
                                                            {p.pen_qty}
                                                        </td>
                                                        <td rowSpan={dispatchCount} className="px-4 border-b border-gray-300 py-3 text-center align-middle">
                                                            {p.price}
                                                        </td>
                                                    </>
                                                )}

                                                {/* Dispatch Details Columns */}
                                                <td className={`px-4 py-3 text-center ${borderClass}`}>{d.dis_qty}</td>
                                                <td className={`px-4 py-3 text-center ${borderClass}`}>{d.dis_date}</td>
                                                <td className={`px-4 py-3 text-center ${borderClass}`}>{d.challan}</td>
                                                <td className={`px-4 py-3 text-center ${borderClass}`}>{d.total_parcel}</td>
                                                <td className={`px-4 py-3 ${borderClass}`}>{d.transport}</td>
                                                <td className={`px-4 py-3 text-center ${borderClass}`}>{d.lr_no}</td>
                                            </tr>
                                        );
                                    });
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-start mt-4">
                    <button
                        onClick={handleAddAllPending}
                        className="border px-6 py-2 bg-blue-50 cursor-pointer rounded text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                        Add All Pending Quantity
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="mt-5">
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-[#E5E7EA] text-[#262626]">
                                    <tr>
                                        <th className="px-4 py-3 text-left">DISPATCH DATE</th>
                                        <th className="px-4 py-3 text-left">CHALLAN NO</th>
                                        <th className="px-4 py-3 text-left">TOTAL PRICE</th>
                                        <th className="px-4 py-3 text-left">TRANSPORT</th>
                                        <th className="px-4 py-3 text-left">LR NO</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-700">
                                    <tr className="bg-white">
                                        <td className="px-4 py-2">
                                            <input
                                                type="date"
                                                name="dispatch_date"
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                value={formik.values.dispatch_date}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.touched.dispatch_date && formik.errors.dispatch_date && (
                                                <p className="text-red-500 text-xs">{formik.errors.dispatch_date}</p>
                                            )}
                                        </td>

                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                name="challan_no"
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                value={formik.values.challan_no}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.touched.challan_no && formik.errors.challan_no && (
                                                <p className="text-red-500 text-xs">{formik.errors.challan_no}</p>
                                            )}
                                        </td>

                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                name="total_price"
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                value={formik.values.total_price}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.touched.total_price && formik.errors.total_price && (
                                                <p className="text-red-500 text-xs">{formik.errors.total_price}</p>
                                            )}
                                        </td>

                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                name="transport"
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                value={formik.values.transport}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.touched.transport && formik.errors.transport && (
                                                <p className="text-red-500 text-xs">{formik.errors.transport}</p>
                                            )}
                                        </td>

                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                name="lr_no"
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                value={formik.values.lr_no}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.touched.lr_no && formik.errors.lr_no && (
                                                <p className="text-red-500 text-xs">{formik.errors.lr_no}</p>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-start mt-4">
                        <button
                            type="submit"
                            className="border px-6 py-2 bg-blue-50 cursor-pointer rounded text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                            Add Dispatch Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
