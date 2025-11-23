import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "../store/sidebarStore";
import { useAuthStore } from "../store/authStore";
import { Dropdown } from "../common/Dropdown";
import { useMutation } from "@tanstack/react-query";
import { logoutAPI } from "../api/auth.api";

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebarStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  const { mutate: logoutUser, isPending } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      logout();
      navigate("/signin");
    },
    onError: () => {
      logout();
      navigate("/signin");
    },
  });

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logoutUser();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-9999 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full px-3 py-3 border-b border-gray-200 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4">
          {/* Search Input */}
          <div className="flex items-center gap-4 w-full max-w-lg bg-gray-50 border border-gray-200 rounded-md px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm text-gray-700 w-full"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Notification */}
            <button className="relative text-gray-600 hover:text-gray-800">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium uppercase">
                  {user?.username?.[0] || user?.email?.[0]}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
                <div className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200">
                  {user?.username || user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={16} /> Logout
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
