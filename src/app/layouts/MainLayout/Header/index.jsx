// Import Dependencies
import {  ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { SidebarToggleBtn } from "components/shared/SidebarToggleBtn";
import { useThemeContext } from "app/contexts/theme/context";
import Cookies from "js-cookie";
import { useEffect, useState, Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import { UserIcon } from "lucide-react";
import { useAuthContext } from "app/contexts/auth/context";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useSidebarContext } from "app/contexts/sidebar/context";

export function Header() {
  const { cardSkin } = useThemeContext();
  const { logout } = useAuthContext();

  const { isExpanded, close } = useSidebarContext();

  const [name, setName] = useState(Cookies.get("name") || "");
  const [role, setRole] = useState(Cookies.get("rolename") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const cookieName = Cookies.get("name") || "";
      const cookieRole = Cookies.get("rolename") || "";
      if (cookieName !== name) setName(cookieName);
      if (cookieRole !== role) setRole(cookieRole);
    }, 500);

    return () => clearInterval(interval);
  }, [name, role]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderInitials = () => {
    if (!name) return <UserIcon className="h-4 w-4 text-gray-400" />;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={clsx(
        ` sticky top-0 z-30 flex h-[64px] shrink-0 items-center justify-between border-b-2 border-gray-200 bg-white px-6 transition-all ${isExpanded ? "lg:ps-[280px] ps-0" : "lg:ps-24 ps-4"} duration-300`,
        cardSkin === "shadow" ? "dark:bg-dark-750/90" : "dark:bg-dark-900",
      )}
    >
      {/* Left Section */}
      
      <div className="flex items-center gap-1">
        <SidebarToggleBtn />

        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-all duration-200 group"
          title="Go Back"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-[#E73335] transition-colors" />
        </button>
      </div>

      {/* Right Section: Sharp Profile Badge */}
      <div className="flex items-center gap-4">
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                as={motion.button}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={clsx(
                  "group flex cursor-pointer items-center gap-3 rounded-full border-2 border-gray-200 bg-white p-1 pr-4 shadow-sm transition-all duration-200 outline-none",
                  open ? "ring-4 ring-red-500/10 border-[#E73335]" : "hover:border-gray-400"
                )}
              >
                {/* Avatar with Sharp Ring */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2559] to-[#2F3C5F] text-[13px] font-bold text-white shadow-md ring-1 ring-white">
                  {renderInitials()}
                </div>

                {/* Name & Role */}
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-sm font-extrabold text-[#1B2559] capitalize transition-colors group-hover:text-[#E73335]">
                    {name || "Guest"}
                  </span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                    {role || "User"}
                  </span>
                </div>

                <ChevronDownIcon
                  className={clsx(
                    "h-4 w-4 text-gray-400 transition-transform duration-300",
                    open && "rotate-180 text-[#E73335]"
                  )}
                />
              </PopoverButton>

              <Transition
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 translate-y-2 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition duration-150 ease-in"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-2 scale-95"
              >
                <PopoverPanel className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-2xl border-2 border-gray-200 bg-white p-2 shadow-[0_15px_35px_rgba(0,0,0,0.15)] outline-none">
                  <div className="flex flex-col">
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-1 border border-gray-200">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B2559] text-xs font-bold text-white shadow-md">
                        {renderInitials()}
                      </div>
                      <div className="overflow-hidden">
                        <Link
                          className="block text-sm font-bold text-[#1B2559] hover:text-[#E73335] truncate transition-colors"
                          to="/settings/general"
                        >
                          {name}
                        </Link>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{role}</p>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="px-1 py-1">
                      <Link
                        to="/settings/general"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-[#1B2559] transition-all border border-transparent hover:border-gray-200"
                      >
                        <UserIcon className="h-4 w-4" />
                        My Profile
                      </Link>
                    </div>

                    {/* Sharp Divider */}
                    <div className="my-1 h-0.5 bg-gray-200 mx-1" />

                    {/* Logout Button */}
                    <button
                      onClick={logout}
                      className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-red-50 hover:text-[#E73335] border border-transparent hover:border-red-100"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 transition-colors group-hover:bg-red-100 group-hover:shadow-sm">
                        <ArrowLeftStartOnRectangleIcon className="h-4.5 w-4.5 text-gray-600 group-hover:text-[#E73335]" />
                      </div>
                      <span>Logout </span>
                    </button>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </header>
  );
}