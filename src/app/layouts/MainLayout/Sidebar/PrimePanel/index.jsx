// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Button } from "components/ui";
import { Menu } from "./Menu";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

// ... (Imports wahi rahenge)

export function PrimePanel({ pathname, close, nav }) {
  const { cardSkin } = useThemeContext();
  const { role } = useAuthContext();

  const flatNav = nav
    .filter((n) => role.includes(n.role))
    .flatMap((n) =>
      n.childs
        ? [n, ...n.childs.filter((c) => role.includes(c.role))]
        : [n]
    );

  return (
    <div
      className={clsx(
        "prime-panel flex h-full flex-col transition-all duration-300",
        cardSkin === "shadow"
          ? "shadow-[20px_0_40px_rgba(0,0,0,0.3)]"
          : "border-r border-white/[0.05]"
      )}
    >
      {/* 🌌 MAIN BACKGROUND: Using your specific #111C44 color */}
      <div className="flex h-full grow flex-col bg-[#111C44]">

        {/* ⭐ ULTRA-PREMIUM LOGO SECTION */}
        <div className="relative flex h-28 items-center px-6 overflow-hidden group/header">

          {/* Subtle Red Ambient Glow (Top Left) */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#F11D1F]/15 rounded-full blur-[60px] pointer-events-none transition-opacity duration-700 group-hover/header:opacity-100 opacity-60" />

          {/* Subtle Deep Blue Bottom Glow */}
          <div className="absolute -bottom-10 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[50px] pointer-events-none" />

          <Link
            to="/"
            className="relative z-10 flex items-center gap-4 active:scale-95 transition-transform"
          >
            {/* ✅ LOGO BOX: Refined with Glassmorphism */}
            <div className="relative">
              {/* Outer Neon Border Effect on Hover */}
              <div className="absolute -inset-[2px] bg-gradient-to-tr from-[#F11D1F] to-transparent rounded-[18px] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500" />

              <div className="relative h-14 w-14 flex items-center justify-center bg-[#1a234a] rounded-[16px] border border-white/10 shadow-2xl overflow-hidden">
                {/* Internal Reflection Layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                <img
                  src="/srlogo.png"
                  alt="logo"
                  className="h-9 w-auto object-contain relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(241,29,31,0.5)]"
                />
              </div>
            </div>

            {/* ✅ TYPOGRAPHY: High Contrast & Professional */}
            <div className="flex flex-col border-l border-white/10 pl-4 py-1">
              <h2 className="text-[17px] font-black text-white tracking-tighter leading-[1.05] flex flex-col">
                <span>INVOICE</span>
                <span className="text-white/80 font-semibold text-[15px] tracking-normal">PROCUREMENT</span>
              </h2>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-bold text-[#F11D1F] uppercase tracking-[0.4em] drop-shadow-[0_0_5px_rgba(241,29,31,0.4)]">
                  SYSTEM
                </span>
                {/* Live Indicator Dot */}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F11D1F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F11D1F]"></span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Separator with Gradient - High Visibility */}
        <div className="px-6 mb-6">
          <div className="relative h-[1px] w-full">
            {/* Base Line: white/20 for better visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Center Glow: Isse line "shining" lagegi */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F11D1F]/40 to-transparent blur-[1px]" />
          </div>
        </div>

        {/* ⭐ MENU SECTION */}
        <div className="grow overflow-y-auto no-scrollbar">
          <Menu
            nav={flatNav}
            pathname={pathname}
            textColor="#94A3B8"      // Muted Slate for non-active
            iconColor="#475569"      // Muted Icon color
            hoverTextColor="#FFFFFF" // Pure White on hover
            hoverIconColor="#F11D1F" // Red on hover
          />
        </div>

        {/* ⭐ MOBILE CLOSE BUTTON */}
        <div className="absolute top-4 right-4 xl:hidden">
          <Button
            onClick={close}
            isIcon
            variant="flat"
            className="size-8 rounded-xl bg-white/5 text-white/50 hover:bg-[#F11D1F]/10 hover:text-[#F11D1F] transition-all"
          >
            <ChevronLeftIcon className="size-6 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

PrimePanel.propTypes = {
  close: PropTypes.func,
  pathname: PropTypes.string,
  nav: PropTypes.array,
};