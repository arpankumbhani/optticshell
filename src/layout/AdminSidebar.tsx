/// <reference types="vite-plugin-svgr/client" />
import { Link, useLocation } from "react-router-dom";
import { useSidebarStore } from "../store/sidebarStore";
import logo from "../assets/svg/Logo.svg";
import OpticOrders from "../assets/svg/new-tab.svg?react";
import ViewOpticOrders from "../assets/svg/iris-scan.svg?react";
import DeletedOrder from "../assets/svg/trash.svg?react";
import UserIcon from "../assets/svg/user.svg?react";
import FileIcon from "../assets/svg/file.svg?react";
import NoteIcon from "../assets/svg/note.svg?react";
import ListIcon from "../assets/svg/list.svg?react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  { icon: <OpticOrders />, name: "Create OpticOrders", path: "/create-opticorders" },
  { icon: <OpticOrders />, name: "Optitcorders", path: "/opticorders" },
  { icon: <ViewOpticOrders />, name: "View OpticOrders", path: "/view-opticorders" },
  { icon: <DeletedOrder />, name: "Deleted Order", path: "/deleted-order" },
];

const listItems: NavItem[] = [
  { icon: <UserIcon />, name: "UmiyPlast", path: "/umiyaplast" },
  { icon: <FileIcon />, name: "Plain Order", path: "/plain-order" },
  { icon: <ListIcon />, name: "Old Block Format", path: "/old-block-format" },
  { icon: <NoteIcon />, name: "New Block Size", path: "/new-block-size" },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebarStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 bg-white transition-all duration-300 
        ${isExpanded || isHovered ? "w-[250px]" : "w-20"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-center py-5">
        <img
          src={logo}
          alt="Opticshell"
          className={`transition-all duration-300 ${isExpanded || isHovered ? "w-40" : "w-10"
            }`}
        />
      </div>

      <nav className="flex flex-col gap-1 mt-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all
                ${active
                  ? "bg-[#EDEFFE] border-l-4 border-[#0E5FD9] text-[#0E5FD9]"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 ${active ? "text-[#4E61F6]" : "text-[#9EA2AE]"
                  }`}
              >
                {item.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="text-[#6D717F]">{item.name}</span>
              )}
            </Link>
          );
        })}

        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-3 px-3 text-xs uppercase text-[#9EA2AE] tracking-wide font-semibold">
            List
          </div>
        )}

        {listItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-all group
                ${active
                  ? "bg-[#EDEFFE] border-l-4 border-[#0E5FD9] text-[#0E5FD9]"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-6 h-6 ${active ? "text-[#4E61F6]" : "text-[#9EA2AE]"
                    }`}
                >
                  {item.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-[#6D717F]">{item.name}</span>
                )}
              </div>

              {(isExpanded || isHovered || isMobileOpen) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#9EA2AE] opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M4 13.5V20h6.5L20 10.5l-6.5-6.5L4 13.5z" />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
