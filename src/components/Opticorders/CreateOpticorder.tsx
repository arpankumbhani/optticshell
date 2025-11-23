

import { useMemo } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductListAPI } from "../../api/product.api";
import { createAdminOrderAPI } from "../../api/order.api";
import UseToast from "../../hooks/useToast";
import { useAuthStore } from "../../store/authStore";
import { convertFileToBase64 } from "../../helper/ImageTobase64";
import { useNavigate } from "react-router-dom";

type ProductColor = { id: string; color_name: string; price: number };
type Product = {
    id: string;
    name: string;
    productColors: ProductColor[];
};

const mapCategoryType = (mainCategory: string, subCategory?: string) => {
    if (mainCategory === "1") return 1;
    if (subCategory === "2") return 2;
    if (subCategory === "3") return 3;
    if (subCategory === "4") return 4;
    return 1;
};

export default function CreateOpticorder() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const createOrderMutation = useMutation({
        mutationFn: createAdminOrderAPI,
        onSuccess: (res) => {
            UseToast(res?.message || "Order created successfully", "success");
            formik.resetForm();
            navigate("/opticorders");
            queryClient.invalidateQueries({ queryKey: ["ordersList"] });
        },
        onError: (error) => {
            console.error("Order Creation Error:", error);
            formik.resetForm();
            navigate("/opticorders");
            UseToast(error?.message || "Failed to create order", "error");
        },
    });

    const formik = useFormik({
        initialValues: {
            orderNo: "",
            status: "0",
            billingContact: "",
            mainCategory: "1",
            subCategory: "",
            orderType: "",
            subCustomerDetail: "",
            subCustomerName: "",
            orderRemark: "",
            orderImage: null as File | null,
            models: [
                {
                    productId: "",
                    colorId: "",
                    qty: 0,
                    price: 0,
                    remark: "",
                    total: 0,
                },
            ],
        },

        validationSchema: Yup.object().shape({
            billingContact: Yup.string().required("Billing contact is required"),
            mainCategory: Yup.string().required("Main Category is required"),

            subCategory: Yup.string().when("mainCategory", {
                is: "2",
                then: (schema) => schema.required("Sub Category is required"),
                otherwise: (schema) => schema.nullable(),
            }),

            orderType: Yup.string().when("mainCategory", {
                is: "2",
                then: (schema) => schema.required("Order Type is required"),
                otherwise: (schema) => schema.nullable(),
            }),

            models: Yup.array()
                .of(
                    Yup.object().shape({
                        productId: Yup.string().required("Product is required"),
                        colorId: Yup.string().required("Color is required"),
                        qty: Yup.number().min(1, "Qty >= 1").required("Qty is required"),
                        price: Yup.number().min(0).required("Price is required"),
                        remark: Yup.string().nullable(),
                        total: Yup.number().min(0).required(),
                    })
                )
                .min(1, "Add at least one Order Model"),
        }),

        onSubmit: async (values) => {
            const user_id = user?.id;

            const category_type =
                values.mainCategory === "1"
                    ? 1
                    : Number(values.subCategory);


            const base64Image = await convertFileToBase64(values.orderImage);

            const payload = {
                user_id: user_id,
                order_status: Number(values.status),
                category_type: category_type,
                order_type: Number(values.orderType || 0),
                sub_customer_name: values.subCustomerName,
                sub_customer_detail: values.subCustomerDetail,
                order_remark: values.orderRemark,

                order_image: base64Image,

                order_models: values.models.map((m) => ({
                    product_id: m.productId,
                    product_color_id: m.colorId,
                    quantity: m.qty,
                    price: m.price,
                    remark: m.remark,
                })),
            };
            console.log("Submit payload:", payload);
            createOrderMutation.mutate(payload);

        },
    });

    const { values, setFieldValue, setFieldTouched, touched, errors } = formik;

    const currentCategoryType = useMemo(
        () => mapCategoryType(values.mainCategory, values.subCategory),
        [values.mainCategory, values.subCategory]
    );

    const { data: productResp } = useQuery({
        queryKey: ["productList", currentCategoryType],
        queryFn: () => getProductListAPI({ category_type: currentCategoryType }),
        enabled: !!currentCategoryType,
    });

    const products: Product[] = productResp?.data?.productList || [];
    const findProduct = (id?: string) => products.find((p) => p.id === id);

    const onModelChange = (index: number, field: string, value: any) => {
        setFieldValue(`models[${index}].${field}`, value);

        if (field === "productId") {
            setFieldValue(`models[${index}].colorId`, "");
            setFieldValue(`models[${index}].price`, 0);
            setFieldValue(`models[${index}].qty`, 0);
            setFieldValue(`models[${index}].total`, 0);
            return;
        }
        if (field === "colorId") {
            const productId = (values.models[index] as any).productId;
            const prod = findProduct(productId);
            const color = prod?.productColors.find((c) => c.id === value);
            const price = color?.price ?? 0;
            setFieldValue(`models[${index}].price`, price);
            const qty = Number((values.models[index] as any).qty || 0);
            setFieldValue(`models[${index}].total`, qty * price);
            return;
        }
        if (field === "qty") {
            const price = Number((values.models[index] as any).price || 0);
            const qty = Number(value || 0);
            setFieldValue(`models[${index}].total`, qty * price);
            return;
        }
    };

    const totals = useMemo(() => {
        const totalPrice = values.models.reduce((s, m) => s + Number(m.total || 0), 0);
        const totalQty = values.models.reduce((s, m) => s + Number(m.qty || 0), 0);
        return { totalPendingPrice: totalPrice, totalPrice, totalPendingQty: totalQty, totalQty };
    }, [values.models]);

    const isPlain = values.mainCategory === "1";
    const isPrint = values.mainCategory === "2";
    const orderImageEnabled = isPrint && (values.orderType === "2" || values.orderType === "3");

    return (
        <div className="p-6 bg-white rounded-md shadow-sm max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Create Opttic Order</h1>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                    BASIC
                </h2>
                <div className="pl-5">
                    <div className="grid grid-cols-2 gap-4 items-end">
                        {/* <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Order No</label>
                            <input
                                name="orderNo"
                                value={values.orderNo}
                                onChange={formik.handleChange}
                                className="mmt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                            />
                            {touched.orderNo && errors.orderNo && (
                                <div className="text-xs text-red-500 mt-1">{errors.orderNo as string}</div>
                            )}
                        </div> */}
                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Status</label>
                            <select
                                name="status"
                                value={values.status}
                                onChange={formik.handleChange}
                                className="mmt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                            >
                                <option value="0">Pending</option>
                                <option value="1">Partial Dispatch</option>
                                <option value="2">Dispatch</option>
                                <option value="3">Cancelled</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Billing Contact</label>
                            <input
                                name="billingContact"
                                value={values.billingContact}
                                onChange={formik.handleChange}
                                className="mmt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                            />
                            {touched.billingContact && errors.billingContact && (
                                <div className="text-xs text-red-500 mt-1">{errors.billingContact as string}</div>
                            )}
                        </div>
                    </div>
                </div>

                <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                    NEW PANEL 1
                </h2>
                <div className="pl-5">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Main Category</label>
                            <select
                                name="mainCategory"
                                value={values.mainCategory}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFieldValue("mainCategory", val);

                                    if (val === "1") {
                                        setFieldValue("subCategory", "");
                                        setFieldValue("orderType", "");
                                        setFieldValue("subCustomerDetail", "");
                                        setFieldValue("subCustomerName", "");
                                        setFieldValue("orderImage", null);
                                        setFieldTouched("subCategory", false);
                                        setFieldTouched("orderType", false);
                                    }
                                }}
                            >
                                <option value="1">Plain Order</option>
                                <option value="2">Print Order</option>
                            </select>
                            {errors.mainCategory && (
                                <div className="text-xs text-red-500 mt-1">{errors.mainCategory as string}</div>
                            )}
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Sub Category</label>
                            <select
                                name="subCategory"
                                value={values.subCategory}
                                onChange={(e) => setFieldValue("subCategory", e.target.value)}
                                disabled={isPlain}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Sub Category</option>
                                <option value="2">Foil Print Order</option>
                                <option value="3">One Color Ink Print Order</option>
                                <option value="4">Two Color Ink Print Order</option>
                            </select>
                            {errors.subCategory && isPrint && (
                                <div className="text-xs text-red-500 mt-1">{errors.subCategory as string}</div>
                            )}
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Order Type</label>
                            <select
                                name="orderType"
                                value={values.orderType}
                                onChange={(e) => {
                                    setFieldValue("orderType", e.target.value);
                                    if (!(e.target.value === "2" || e.target.value === "3")) {
                                        setFieldValue("orderImage", null);
                                    }
                                }}
                                disabled={isPlain}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Order Type</option>
                                <option value="1">Old Block</option>
                                <option value="2">New Block</option>
                                <option value="3">Correction Old Block</option>
                            </select>
                            {errors.orderType && isPrint && (
                                <div className="text-xs text-red-500 mt-1">{errors.orderType as string}</div>
                            )}
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Sub Customer Detail</label>
                            <input
                                name="subCustomerDetail"
                                value={values.subCustomerDetail}
                                onChange={formik.handleChange}
                                disabled={isPlain}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Sub Customer Name</label>
                            <input
                                name="subCustomerName"
                                value={values.subCustomerName}
                                onChange={formik.handleChange}
                                disabled={isPlain}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                placeholder="Sub customer name"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Order Remark</label>
                            <input
                                name="orderRemark"
                                value={values.orderRemark}
                                onChange={formik.handleChange}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                placeholder="Order remark"
                            />
                        </div>

                        <div className="col-span-1">
                            <label className="text-[#131927] font-medium text-sm">Order Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] ?? null;
                                    setFieldValue("orderImage", f);
                                }}
                                disabled={!orderImageEnabled}
                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
                <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                    NEW PANEL 1
                </h2>
                <div className="pl-5">
                    <FormikProvider value={formik}>
                        <FieldArray
                            name="models"
                            render={(arrayHelpers) => (
                                <div className="rounded p-3 bg-[#F9FAFB]">
                                    {(values.models || []).map((model: any, idx: number) => (
                                        <div key={idx} className="mb-4">
                                            <div className="grid grid-cols-13 gap-3 items-end">
                                                <div className="col-span-3">
                                                    <label className="text-[#131927] font-medium text-sm">Name</label>
                                                    <select
                                                        name={`models[${idx}].productId`}
                                                        value={model.productId}
                                                        onChange={(e) =>
                                                            onModelChange(idx, "productId", e.target.value)
                                                        }
                                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                    >
                                                        <option value="">Select product</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="text-[#131927] font-medium text-sm">Color</label>
                                                    <select
                                                        name={`models[${idx}].colorId`}
                                                        value={model.colorId}
                                                        onChange={(e) =>
                                                            onModelChange(idx, "colorId", e.target.value)
                                                        }
                                                        disabled={!model.productId}
                                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                    >
                                                        <option value="">Select color</option>
                                                        {findProduct(model.productId)?.productColors?.map((c) => (
                                                            <option key={c.id} value={c.id}>
                                                                {c.color_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="text-[#131927] font-medium text-sm">Qty</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        name={`models[${idx}].qty`}
                                                        value={model.qty}
                                                        onChange={(e) =>
                                                            onModelChange(idx, "qty", Number(e.target.value))
                                                        }
                                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="text-[#131927] font-medium text-sm">Price</label>
                                                    <input
                                                        type="number"
                                                        name={`models[${idx}].price`}
                                                        value={model.price}
                                                        disabled
                                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 cursor-not-allowed"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="text-[#131927] font-medium text-sm">Remark</label>
                                                    <input
                                                        name={`models[${idx}].remark`}
                                                        value={model.remark}
                                                        onChange={(e) =>
                                                            setFieldValue(
                                                                `models[${idx}].remark`,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-1">
                                                    <label className="text-[#131927] font-medium text-sm">Total</label>
                                                    <input
                                                        name={`models[${idx}].total`}
                                                        value={model.total}
                                                        readOnly
                                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-1 mb-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => arrayHelpers.remove(idx)}
                                                        disabled={values.models.length === 1}
                                                        className="px-3 py-1 text-sm border rounded bg-red-50 cursor-pointer text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                arrayHelpers.push({
                                                    productId: "",
                                                    colorId: "",
                                                    qty: 0,
                                                    price: 0,
                                                    remark: "",
                                                    total: 0,
                                                })
                                            }
                                            className="px-3 py-1 text-sm border rounded bg-blue-50 cursor-pointer text-blue-600"
                                        >
                                            Add New Model
                                        </button>
                                    </div>
                                </div>
                            )}
                        />
                    </FormikProvider>
                </div>

                <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                    Summary
                </h2>
                <div className="pl-5">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-3 bg-[#F9FAFB] rounded-md">
                            <div className="text-xs text-gray-500">Total Pending Price</div>
                            <div className="text-lg font-semibold">{totals.totalPendingPrice}</div>
                        </div>

                        <div className="p-3 bg-[#F9FAFB] rounded-md">
                            <div className="text-xs text-gray-500">Total Price</div>
                            <div className="text-lg font-semibold">{totals.totalPrice}</div>
                        </div>

                        <div className="p-3 bg-[#F9FAFB] rounded-md">
                            <div className="text-xs text-gray-500">Total Pending Qty</div>
                            <div className="text-lg font-semibold">{totals.totalPendingQty}</div>
                        </div>

                        <div className="p-3 bg-[#F9FAFB] rounded-md">
                            <div className="text-xs text-gray-500">Total Qty</div>
                            <div className="text-lg font-semibold">{totals.totalQty}</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        type="submit"
                        disabled={createOrderMutation.isPending}
                        className="border px-6 py-2 bg-blue-50 cursor-pointer  rounded text-blue-600 hover:bg-blue-600 disabled:bg-blue-400 hover:text-white"
                    >
                        {createOrderMutation.isPending ? "Submitting..." : "Create Order"}
                    </button>


                    <button
                        type="button"
                        disabled={createOrderMutation.isPending}
                        onClick={() => navigate("/opticorders")}
                        className="border px-4 py-2 rounded bg-red-50 cursor-pointer text-red-600 hover:bg-red-600 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={createOrderMutation.isPending}
                        onClick={() => formik.resetForm()}
                        className="border px-4 py-2 rounded cursor-pointer"
                    >
                        Reset
                    </button>
                </div>

            </form>
        </div>
    );
}
