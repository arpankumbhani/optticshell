import { useMutation } from "@tanstack/react-query";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { createProductAPI } from "../../api/product.api";
import UseToast from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { CreateProductColorInput } from "../../Types/Product.type";

type CreateProductValues = {
    name: string;
    standard_quantity: string;
    sku: string;
    image: File | null;
    product_colors: CreateProductColorInput[];
};

export default function CreateProduct() {
    const colorOptions = ["Met", "Shine", "R.Met", "NRB", "W/C", "R/B"];

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const createProductMutation = useMutation({
        mutationFn: createProductAPI,
        onSuccess: (res) => {
            UseToast(res?.message || "Product created successfully", "success");
            // formik.resetForm();
            navigate("/products");
            queryClient.invalidateQueries({ queryKey: ["productsList"] });
        },
        onError: (error) => {
            console.error("Product Creation Error:", error);
            // formik.resetForm();
            navigate("/products");
            UseToast(error?.message || "Failed to create product", "error");
        },
    });

    const formik = useFormik<CreateProductValues>({
        initialValues: {
            name: "",
            standard_quantity: "",
            sku: "",
            image: null as File | null,
            product_colors: [{ name: "", price: "" }],
        },

        validationSchema: Yup.object({
            name: Yup.string().required("Product name is required"),
            standard_quantity: Yup.number()
                .required("Standard quantity is required")
                .positive("Must be positive"),
            product_colors: Yup.array()
                .of(
                    Yup.object({
                        name: Yup.string().required("Color is required"),
                        price: Yup.number()
                            .required("Price is required")
                            .positive("Price must be positive"),
                    })
                )
                .min(1, "At least one color is required"),
        }),

        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("standard_quantity", values.standard_quantity);
            formData.append("sku", values.sku);
            if (values.image instanceof File) {
                formData.append("image", values.image);
            }
            values.product_colors.forEach((m, index: number) => {
                formData.append(`product_colors[${index}][name]`, m.name);
                formData.append(`product_colors[${index}][price]`, m.price);
            });
            createProductMutation.mutate(formData);
        },
    });

    const { values, errors, touched, handleChange, setFieldValue } = formik;

    // Get already selected colors to hide them from dropdown
    const usedColors = values.product_colors.map((c) => c.name);
    const availableColors = colorOptions.filter((c) => !usedColors.includes(c));

    return (
        <div className="p-6 bg-white rounded-md shadow-sm max-w-5xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Create Product</h1>
            <FormikProvider value={formik}>
                <form onSubmit={formik.handleSubmit}>
                    <div className="space-y-6">
                        <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                            BASIC
                        </h2>
                        <div className="pl-5">
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="col-span-1">
                                    <label className="text-[#131927] font-medium text-sm">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40"
                                    />
                                    {touched.name && errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <label className="text-[#131927] font-medium text-sm">
                                        Standard Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="standard_quantity"
                                        value={values.standard_quantity}
                                        onChange={handleChange}
                                        placeholder="Enter quantity"
                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40"
                                    />
                                    {touched.standard_quantity && errors.standard_quantity && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.standard_quantity}
                                        </p>
                                    )}
                                </div>

                                {/* <div className="col-span-1">
                                <label className="text-[#131927] font-medium text-sm">
                                    SKU <span className="text-gray-400 text-xs">(Optional)</span>
                                </label>
                                <input
                                    name="sku"
                                    value={values.sku}
                                    onChange={handleChange}
                                    placeholder="Enter SKU code"
                                    className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40"
                                />
                            </div> */}

                                <div className="col-span-1">
                                    <label className="text-[#131927] font-medium text-sm">
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFieldValue("image", e.target.files?.[0])}
                                        className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm disabled:opacity-40 cursor-pointer"
                                    />

                                </div>
                            </div>
                        </div>

                        {/* <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Product Colors & Pricing
                            </h3>
                            {typeof errors.product_colors === 'string' && (
                                <p className="text-red-500 text-sm">{errors.product_colors}</p>
                            )}
                        </div> */}
                        <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                            COLOR & PRICE
                        </h2>
                        <div className="pl-5">
                            <FieldArray
                                name="product_colors"
                                render={(arrayHelpers) => (
                                    <div className="rounded p-3 bg-[#F9FAFB]">
                                        {values.product_colors.map((item, index) => {
                                            const colorTouched =
                                                touched.product_colors?.[index] &&
                                                typeof touched.product_colors[index] !== "boolean"
                                                    ? touched.product_colors[index]?.name
                                                    : false;
                                            const priceTouched =
                                                touched.product_colors?.[index] &&
                                                typeof touched.product_colors[index] !== "boolean"
                                                    ? touched.product_colors[index]?.price
                                                    : false;
                                            const colorError =
                                                colorTouched &&
                                                errors.product_colors?.[index] &&
                                                typeof errors.product_colors[index] !== "string"
                                                    ? errors.product_colors[index]?.name
                                                    : undefined;
                                            const priceError =
                                                priceTouched &&
                                                errors.product_colors?.[index] &&
                                                typeof errors.product_colors[index] !== "string"
                                                    ? errors.product_colors[index]?.price
                                                    : undefined;

                                            return (
                                                <div
                                                    key={index}
                                                    className="mb-4"
                                                >
                                                    <div className="grid grid-cols-9 gap-3 items-end">
                                                        {/* Color Dropdown */}
                                                        <div className="col-span-4">
                                                            <label className="text-[#131927] font-medium text-sm">
                                                                Color <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                name={`product_colors.${index}.name`}
                                                                value={item.name}
                                                                onChange={handleChange}
                                                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                            >
                                                                <option value="">Select Color</option>
                                                                {/* Show currently selected color + available colors */}
                                                                {[item.name, ...availableColors]
                                                                    .filter(Boolean)
                                                                    .map((color) => (
                                                                        <option key={color} value={color}>
                                                                            {color}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                            {colorError && (
                                                                <p className="text-red-500 text-xs">{colorError}</p>
                                                            )}
                                                        </div>

                                                        {/* Price Input */}
                                                        <div className="col-span-4">
                                                            <label className="text-[#131927] font-medium text-sm">
                                                                Price <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name={`product_colors.${index}.price`}
                                                                value={item.price}
                                                                onChange={handleChange}
                                                                placeholder="Enter price"
                                                                className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                                            />
                                                            {priceError && (
                                                                <p className="text-red-500 text-xs">{priceError}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-span-1 mb-1 flex justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                                disabled={values.product_colors.length === 1}
                                                                className="px-3 py-1 text-sm border rounded bg-red-50 cursor-pointer text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Add Color Button */}
                                        {availableColors.length > 0 && (
                                            <>
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => arrayHelpers.push({ name: "", price: "" })}
                                                        className="px-3 py-1 text-sm border rounded bg-blue-50 cursor-pointer text-blue-600"
                                                    >
                                                        + Add Color
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                    </div>
                                )}
                            />
                        </div>

                        <div className="flex gap-3 justify-end">

                            <button
                                type="submit"
                                disabled={createProductMutation.isPending}
                                className="border px-6 py-2 bg-blue-50 cursor-pointer  rounded text-blue-600 hover:bg-blue-600 disabled:bg-blue-400 hover:text-white"
                            >
                                {createProductMutation.isPending ? "Submitting..." : "Create Product"}
                            </button>
                        </div>
                    </div>
                </form>
            </FormikProvider>
        </div>
    );
}
