import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { resetPasswordAPI } from "../../api/users.api";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../hooks/useToast";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordTab() {

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePassword = (field: "current" | "new" | "confirm") => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const {
        mutate: mutateResetPassword,
    } = useMutation({
        mutationFn: (payload: { old_password: string; new_password: string }) =>
            resetPasswordAPI(payload),
    });

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },

        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Current password is required"),
            newPassword: Yup.string().required("New password is required"),
            confirmPassword: Yup.string()
                .required("Confirm password is required")
                .oneOf([Yup.ref("newPassword")], "Passwords must match"),
        }),

        onSubmit: (values, { resetForm }) => {
            const payload = {
                old_password: values.currentPassword,
                new_password: values.newPassword,
            };

            mutateResetPassword(payload, {
                onSuccess: (res: any) => {
                    resetForm();
                    UseToast(res?.message || "Password updated successfully", "success");
                },
                onError: (error: any) => {
                    UseToast(error?.message || "Failed to update password", "error");
                },
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-md">

            <div>
                <label className="font-medium text-sm text-gray-700">Current Password</label>
                <div className="relative">
                    <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.currentPassword}
                        className="w-full mt-1 border rounded-md px-3 py-2 bg-[#F9FAFB]"
                        placeholder="Enter current password"
                    />

                    <span
                        onClick={() => togglePassword("current")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600"
                    >
                        {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>

                {formik.touched.currentPassword && formik.errors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.currentPassword}</p>
                )}
            </div>

            <div>
                <label className="font-medium text-sm text-gray-700">New Password</label>
                <div className="relative">
                    <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                        className="w-full mt-1 border rounded-md px-3 py-2 bg-[#F9FAFB]"
                        placeholder="Enter new password"
                    />

                    <span
                        onClick={() => togglePassword("new")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600"
                    >
                        {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>

                {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</p>
                )}
            </div>

            <div>
                <label className="font-medium text-sm text-gray-700">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        className="w-full mt-1 border rounded-md px-3 py-2 bg-[#F9FAFB]"
                        placeholder="Confirm new password"
                    />

                    <span
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600"
                    >
                        {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>

                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                )}
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white rounded-md px-6 py-2 text-sm hover:bg-blue-700"
            >
                Update Password
            </button>
        </form>
    );
}
