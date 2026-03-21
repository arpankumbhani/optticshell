


import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UserCircle from "../../assets/svg/user-circle.svg?react";
import { getUserProfileAPI } from "../../api/users.api";
import { useQuery } from "@tanstack/react-query";

type UserProfileFormValues = {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    is_active: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    gst_number: string;
    photo: File | null;
};

export default function UserProfileTab() {
    const [preview, setPreview] = useState<string | null>(null);

    const { data: userProfileData } = useQuery({
        queryKey: ["getUserProfileAPI"],
        queryFn: getUserProfileAPI,
    });

    const getTextValue = (value: UserProfileFormValues[keyof UserProfileFormValues]) =>
        typeof value === "string" ? value : "";

    const formik = useFormik<UserProfileFormValues>({
        initialValues: {
            fullName: "",
            username: "",
            email: "",
            phone: "",
            is_active: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            gst_number: "",
            photo: null as File | null,
        },

        validationSchema: Yup.object({
            fullName: Yup.string().required("Full Name is required"),
            username: Yup.string().required("Username is required"),
            email: Yup.string().required("Email is required"),
            phone: Yup.string().required("Phone number is required"),
            address: Yup.string().required("Address is required"),
            city: Yup.string().required("City is required"),
            state: Yup.string().required("State is required"),
            postalCode: Yup.string().required("Postal Code is required"),
            gst_number: Yup.string().required("GST Number is required"),
        }),

        onSubmit: (values) => {
            console.log("Form Data:", values);
        },
    });

    useEffect(() => {
        if (userProfileData?.data) {
            const u = userProfileData.data;

            formik.setValues({
                fullName: u.name || "",
                username: u.username || "",
                email: u.email || "",
                phone: u.phone || "",
                is_active: u.is_active ? "Active" : "Inactive",
                address: u.address || "",
                city: u.city || "",
                state: u.state || "",
                postalCode: u.pincode || "",
                gst_number: u.gst_number || "",
                photo: null,
            });

            if (u.profile_logo) setPreview(u.profile_logo);
        }
    }, [userProfileData]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">

            {/* User Profile Header */}
            <div>
                <h2 className="font-semibold text-xl mb-4">User Profile</h2>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-2 bg-[#F9FAFB] h-fit mt-2">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-50 h-50 rounded-lg"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg py-8 ">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                                    <UserCircle className="w-40 h-40 text-gray-400" />
                                </div>
                                <p className="mt-4 text-[#6D717F] font-medium">
                                    Upload Disabled
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="col-span-6 grid grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", name: "fullName" },
                            { label: "Username", name: "username" },
                            { label: "Email", name: "email" },
                            { label: "Phone", name: "phone" },
                            { label: "Active Status", name: "is_active" },
                        ].map((f) => (
                            <div key={f.name}>
                                <label className="text-[#131927] font-medium text-sm">
                                    {f.label}
                                </label>

                                <input
                                    type="text"
                                    name={f.name}
                                    disabled
                                    value={getTextValue(formik.values[f.name as keyof UserProfileFormValues])}
                                    className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm cursor-not-allowed"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Address Section */}
            <div className="pt-6">
                <h2 className="text-gray-800 font-semibold mb-4 bg-[#F9FAFB] p-2 rounded-md pl-5">
                    Address Information
                </h2>

                <div className="pl-5">
                    <div className="grid grid-cols-2 gap-4">

                        {[
                            { label: "Address", name: "address" },
                            { label: "City", name: "city" },
                            { label: "State", name: "state" },
                            { label: "Postal Code", name: "postalCode" },
                            { label: "GST Number", name: "gst_number" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="text-[#131927] font-medium text-sm capitalize">
                                    {field.label}
                                </label>

                                <input
                                    type="text"
                                    name={field.name}
                                    disabled
                                    value={getTextValue(formik.values[field.name as keyof UserProfileFormValues])}
                                    className="mt-1 w-full border border-gray-200 bg-[#F9FAFB] rounded-md px-3 py-2 text-sm cursor-not-allowed"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* <div className="flex justify-start gap-3 mt-6 pl-5">
                    <button
                        type="button"
                        disabled
                        className="border-[1.5px] border-[#4E61F6] rounded-md px-6 py-2 text-sm font-semibold text-[#4E61F6] opacity-50 cursor-not-allowed"
                    >
                        Save as Draft
                    </button>

                    <button
                        type="submit"
                        disabled
                        className="bg-blue-600 text-white rounded-md px-14 py-2 text-sm opacity-50 cursor-not-allowed"
                    >
                        Save
                    </button>
                </div> */}
            </div>
        </form>
    );
}
