import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useSidebarContext } from "app/contexts/sidebar/context";
import { Badge } from "components/ui";

export function MenuItem({ data, className, hideIcon, isRoot, prefix, isActiveParent }) {
  const { path, transKey, Icon } = data;
  const { t } = useTranslation();
  const { lgAndDown } = useBreakpointsContext();
  const { close } = useSidebarContext();

  const title = t(transKey) || data.title;

  const handleMenuItemClick = () => lgAndDown && close();

  return (
    <NavLink
      to={path}
      onClick={handleMenuItemClick}
      className={({ isActive }) =>
        clsx(
          /* ⭐ Background: Normal state (#111C44) | Active state (white/10 glass) */
          "group flex items-center justify-between w-full rounded-md transition-all duration-300 ease-in-out px-4 py-2 bg-[#111C44]",
          (isActive || isActiveParent)
            ? "text-white bg-white/10 font-bold"
            : "text-[#A3AED0] hover:text-white hover:bg-white/5",
          className
        )
      }
    >
      {({ isActive }) => (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center truncate space-x-3">
            {/* Prefix Circle (only for children) */}
            {prefix && (
              <span
                title={prefix?.toString()}
                className={clsx(
                  "flex-shrink-0 w-2 h-2 rounded-full border-[1.5px] transition-colors duration-200",
                  (isActive || isActiveParent)
                    ? "border-[#F11D1F] bg-[#F11D1F]" /* ⭐ SREXPENSE Red */
                    : "border-[#494B74]"
                )}
              />
            )}

            {/* Icon */}
            {!hideIcon && Icon && (
              <Icon
                className={clsx(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  (isActive || isActiveParent)
                    ? "text-[#F11D1F]" /* ⭐ SREXPENSE Red */
                    : "text-[#494B74] group-hover:text-[#F11D1F]"
                )}
              />
            )}

            {/* Title */}
            <span
              className={clsx(
                "text-[12px]",
                (isActive || isActiveParent)
                  ? "text-white"
                  : "text-[#A3AED0] group-hover:text-white"
              )}
            >
              {title}
            </span>
          </div>

          {/* Optional Badge */}
          {data.info?.val && (
            <Badge
              /* ⭐ Badge color set to Red for consistency */
              className="h-4.5 min-w-[1rem] shrink-0 p-[5px] text-tiny-plus bg-[#F11D1F] text-white border-none"
            >
              {data.info.val}
            </Badge>
          )}
        </div>
      )}
    </NavLink>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
  hideIcon: PropTypes.bool,
  isRoot: PropTypes.bool,
  prefix: PropTypes.string,
  isActiveParent: PropTypes.bool,
};