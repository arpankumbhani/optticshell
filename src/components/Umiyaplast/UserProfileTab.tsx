import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserCircle from "../../assets/svg/user-circle.svg?react";


export default function UserProfileTab() {
    const [preview, setPreview] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            fullName: "",
            username: "",
            userType: "",
            status: "",
            title: "",
            department: "",
            employeeStatus: "",
            displayRecord: "",
            workPhone: "",
            mobile: "",
            otherPhone: "",
            homePhone: "",
            fax: "",
            reportTo: "",
            imType: "",
            imName: "",
            description: "",
            street: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            photo: null as File | null,
        },

        validationSchema: Yup.object({
            fullName: Yup.string().required("Full Name is required"),
            username: Yup.string().required("Username is required"),
            userType: Yup.string().required("User Type is required"),
            status: Yup.string().required("Status is required"),
            title: Yup.string().required("Title is required"),
            department: Yup.string().required("Department is required"),
            employeeStatus: Yup.string().required("Employee Status is required"),
            displayRecord: Yup.string().required("Display Record is required"),
            workPhone: Yup.string().required("Work Phone is required"),
            mobile: Yup.string().required("Mobile number is required"),
            street: Yup.string().required("Street is required"),
            city: Yup.string().required("City is required"),
            state: Yup.string().required("State is required"),
            country: Yup.string().required("Country is required"),
            postalCode: Yup.string().required("Postal Code is required"),
        }),

        onSubmit: (values) => {
            console.log("Form Data:", values);
            alert("Form submitted successfully!");
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            formik.setFieldValue("photo", file);
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* User Profile Section */}
            <div>
                <h2 className="font-semibold text-xl mb-4">User Profile</h2>
                <div className="grid grid-cols-12 gap-6">
                    {/* Upload photo */}
                    {/* <div className="col-span-2 flex flex-col items-center border rounded-lg py-6">
                        <div className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-10 h-10 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 11c.5304 0 1.0391-.2107 1.4142-.5858C13.7893 10.0391 14 9.5304 14 9s-.2107-1.0391-.5858-1.4142C13.0391 7.2107 12.5304 7 12 7s-1.0391.2107-1.4142.5858C10.2107 7.9609 10 8.4696 10 9s.2107 1.0391.5858 1.4142C10.9609 10.7893 11.4696 11 12 11z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 20c0-2.2091 1.7909-4 4-4h8c2.2091 0 4 1.7909 4 4"
                                    />
                                </svg>
                            )}
                        </div>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <label
                            htmlFor="photo"
                            className="mt-3 text-blue-600 text-sm font-medium cursor-pointer"
                        >
                            Browse
                        </label>
                        {formik.errors.photo && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.photo}</p>
                        )}
                    </div> */}

                    <div className="col-span-2 bg-[#F9FAFB]">
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        <label
                            htmlFor="photo"
                            className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-8 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profile Preview"
                                        className="object-cover w-full h-full rounded-full"
                                    />
                                ) : (
                                    // <svg
                                    //     xmlns="http://www.w3.org/2000/svg"
                                    //     className="w-10 h-10 text-gray-400"
                                    //     fill="none"
                                    //     viewBox="0 0 24 24"
                                    //     stroke="currentColor"
                                    // >
                                    //     <path
                                    //         strokeLinecap="round"
                                    //         strokeLinejoin="round"
                                    //         strokeWidth={2}
                                    //         d="M12 11c.53 0 1.04-.21 1.41-.59.38-.37.59-.88.59-1.41s-.21-1.04-.59-1.41A2.004 2.004 0 0012 7a2.004 2.004 0 00-1.41.59c-.38.37-.59.88-.59 1.41s.21 1.04.59 1.41c.37.38.88.59 1.41.59z"
                                    //     />
                                    //     <path
                                    //         strokeLinecap="round"
                                    //         strokeLinejoin="round"
                                    //         strokeWidth={2}
                                    //         d="M4 20c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4"
                                    //     />
                                    // </svg>
                                    <UserCircle className="w-40 h-40 text-gray-400" />
                                )}
                            </div>

                            <p className="mt-4 text-[#6D717F] font-medium">Upload Photo</p>
                            <p className="text-[#4E61F6] text-sm font-medium mt-1">Browse</p>
                        </label>

                        {formik.errors.photo && (
                            <p className="text-red-500 text-xs mt-2 text-center">
                                {formik.errors.photo}
                            </p>
                        )}
                    </div>


                    {/* User info */}
                    <div className="col-span-6 grid grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", name: "fullName", placeholder: "Enter your name" },
                            { label: "Username", name: "username", placeholder: "Enter username" },
                            { label: "User Type", name: "userType", placeholder: "Type" },
                        ].map((f) => (
                            <div key={f.name}>
                                <label className="text-[#131927] font-medium text-sm">{f.label}</label>
                                <input
                                    type="text"
                                    name={f.name}
                                    placeholder={f.placeholder}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={(formik.values as any)[f.name]}
                                    className="mt-1 w-full border-[1.5px] border-[rgba(229,231,234,1)] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                />
                                {formik.touched[f.name as keyof typeof formik.touched] &&
                                    formik.errors[f.name as keyof typeof formik.errors] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {formik.errors[f.name as keyof typeof formik.errors]}
                                        </p>
                                    )}
                            </div>
                        ))}

                        <div>
                            <label className="text-[#131927] font-medium text-sm">Status</label>
                            <select
                                name="status"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.status}
                                className="mt-1 w-full border-[1.5px] border-[rgba(229,231,234,1)] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Select status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.status}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Info Section */}
            <div className="pt-6">
                <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">Employee Information</h2>
                <div className="pl-5">

                    <div className="text-[#6D717F] font-medium text-sm pb-4">Employee Info</div>
                    <div className="grid grid-cols-12 gap-6">

                        <div className="col-span-8 grid grid-cols-2 gap-4">
                            {[
                                "title",
                                "department",
                                "employeeStatus",
                                "displayRecord",
                                "workPhone",
                                "mobile",
                                "otherPhone",
                                "homePhone",
                                "fax",
                                "reportTo",
                                "imType",
                                "imName",
                                "description",
                                "street",
                                "city",
                                "state",
                                "country",
                                "postalCode",
                            ].map((field) => (
                                <div key={field}>
                                    <label className="text-[#131927] font-medium text-sm capitalize">
                                        {field.replace(/([A-Z])/g, " $1")}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        placeholder={field.replace(/([A-Z])/g, " $1")}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={(formik.values as any)[field]}
                                        className="mt-1 w-full border-[1.5px] border-[rgba(229,231,234,1)] bg-[#F9FAFB] rounded-md px-3 py-2 text-sm"
                                    />
                                    {formik.touched[field as keyof typeof formik.touched] &&
                                        formik.errors[field as keyof typeof formik.errors] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {formik.errors[field as keyof typeof formik.errors]}
                                            </p>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                <div className="flex justify-start gap-3 mt-6 pl-5">
                    <button
                        type="button"
                        className="border-[1.5px] border-[#4E61F6] rounded-md px-6 py-2 text-sm font-semibold text-[#4E61F6] hover:bg-gray-100"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-md px-14 py-2 text-sm hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
}
