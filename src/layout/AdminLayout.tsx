// import AdminSidebar from "./AdminSidebar";
// import AdminHeader from "./AdminHeader";
// import { Outlet } from "react-router-dom";
// import { useEffect } from "react";
// import { useSidebarStore } from "../store/sidebarStore";

// const AdminLayout: React.FC = () => {
//   const {
//     isExpanded,
//     isHovered,
//     isMobileOpen,
//     setIsMobile,
//     setIsMobileOpen,
//   } = useSidebarStore();

//   // Handle responsive behavior (like your old useEffect)
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       if (!mobile) {
//         setIsMobileOpen(false);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [setIsMobile, setIsMobileOpen]);

//   return (
//     <div className="min-h-screen xl:flex">
//       <div>
//         <AdminSidebar />
//       </div>
//       <div
//         className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
//           } ${isMobileOpen ? "ml-0" : ""}`}
//       >
//         <AdminHeader />
//         <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;

import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSidebarStore } from "../store/sidebarStore";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen, setIsMobile, setIsMobileOpen } =
    useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile, setIsMobileOpen]);

  return (
    <div className="bg-gray-50 min-h-screen xl:flex">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[250px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AdminHeader />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
