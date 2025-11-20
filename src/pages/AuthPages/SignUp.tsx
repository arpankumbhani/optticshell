// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Eye, EyeOff, User, Lock } from "lucide-react";

// const SignUp: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Username is required"),
//       password: Yup.string().required("Password is required"),
//     }),
//     onSubmit: (values) => {
//       console.log("Form submitted:", values);
//     },
//   });

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <form
//         onSubmit={formik.handleSubmit}
//         className="w-[320px] bg-white p-6 rounded-2xl shadow-md"
//       >
//         {/* Username */}
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-medium mb-1">
//             Username
//           </label>
//           <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
//             <User className="text-gray-400 mr-2" size={18} />
//             <input
//               type="text"
//               id="username"
//               name="username"
//               placeholder="Enter your Username"
//               className="w-full bg-gray-50 outline-none text-sm text-gray-700"
//               value={formik.values.username}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//           </div>
//           {formik.touched.username && formik.errors.username && (
//             <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
//           )}
//         </div>

//         {/* Password */}
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-medium mb-1">
//             Password
//           </label>
//           <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
//             <Lock className="text-gray-400 mr-2" size={18} />
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               name="password"
//               placeholder="Enter your password"
//               className="w-full bg-gray-50 outline-none text-sm text-gray-700"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="focus:outline-none"
//             >
//               {showPassword ? (
//                 <EyeOff className="text-gray-400" size={18} />
//               ) : (
//                 <Eye className="text-gray-400" size={18} />
//               )}
//             </button>
//           </div>
//           {formik.touched.password && formik.errors.password && (
//             <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;
