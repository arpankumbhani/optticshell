import { useFormik } from "formik";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import React, { useState } from "react";
import * as Yup from "yup";
import signinPageImg from "../../assets/Img/signInPage.png";
import logo from "../../assets/svg/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";

const SignInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();


  const {
    mutate: mutateLogin,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginAPI(username, password),
  });

  const formik = useFormik({
    initialValues: {
      username: "Superadmin",
      password: "Test@123",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      mutateLogin(values, {
        onSuccess: (res) => {
          if (res?.status == "SUCCESS" && res?.code == 1) {
            const userData = res.data;
            login(userData);
            navigate("/opticorders");
          } else {
            console.error("Login failed: unexpected response", res);
          }
        },
        onError: (err: any) => {
          console.error("Login failed:", err);
        },
      });
    },
  });

  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row">
      {/* Left Image Section */}
      <div className="flex p-5 md:w-[45%] bg-white">
        <img
          src={signinPageImg}
          alt="Login"
          className="w-3/4 h-auto object-contain rounded-lg"
        />
      </div>

      <div className="flex flex-1 justify-center items-center bg-white p-6 sm:p-10">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl ">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Company Logo" className="w-55 h-auto" />

          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Username
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                <User className="text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your Username"
                  className="w-full bg-gray-50 outline-none text-sm text-gray-700"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.username}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
                <Lock className="text-gray-400 mr-2" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full bg-gray-50 outline-none text-sm text-gray-700"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400" size={18} />
                  ) : (
                    <Eye className="text-gray-400" size={18} />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            {isError && (
              <p className="text-red-500 text-xs mt-2">
                {(error as any)?.response?.data?.message || "Login failed"}
              </p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className={`w-full cursor-pointer ${isPending ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                } text-white font-medium py-2 rounded-lg transition`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
