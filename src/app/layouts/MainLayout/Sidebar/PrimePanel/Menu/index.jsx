import PropTypes from "prop-types";
import { useMemo, useState, useRef, useEffect } from "react";
import SimpleBar from "simplebar-react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { isRouteActive } from "utils/isRouteActive";
import {
  useDataScrollOverflow,
  useDidUpdate,
  useIsomorphicEffect,
} from "hooks";
import { MenuItem } from "./MenuItem";

export function Menu({ nav, pathname }) {
  const initialActivePath = useMemo(() => {
    return nav
      .filter((item) => item.type === "root")
      .map((root) => root.id)
      .filter((id) =>
        nav.find(
          (item) =>
            isRouteActive(item.path, pathname) && item.id.startsWith(id),
        ),
      );
  }, [nav, pathname]);

  const { ref, recalculate } = useDataScrollOverflow();
  const [openRoots, setOpenRoots] = useState(initialActivePath || []);

  useDidUpdate(recalculate, [nav]);

  useDidUpdate(() => {
    const activeRoots = nav
      .filter((item) => item.type === "root")
      .map((root) => root.id)
      .filter((id) =>
        nav.find(
          (child) =>
            child.type === "item" &&
            isRouteActive(child.path, pathname) &&
            child.id.startsWith(id),
        ),
      );

    if (activeRoots.length > 0) {
      setOpenRoots(activeRoots);
    }
  }, [nav, pathname]);

  useIsomorphicEffect(() => {
    const activeItem = ref?.current.querySelector("[data-menu-active=true]");
    activeItem?.scrollIntoView({ block: "center" });
  }, []);

  const toggleRoot = (rootId) => {
    setOpenRoots((prev) =>
      prev.includes(rootId)
        ? prev.filter((id) => id !== rootId)
        : [...prev, rootId],
    );
  };

  return (
    /* ⭐ Background changed to Deep Navy (#111C44) */
    <div className="flex h-full flex-col overflow-hidden mt-0 bg-[#111C44] text-[#A3AED0]">
      <SimpleBar
        scrollableNodeProps={{ ref }}
        className="h-full overflow-x-hidden pb-6"
        style={{ "--scroll-shadow-size": "32px" }}
      >
        <div className="mt-2 flex h-full flex-1 flex-col px-2">
          {nav
            .filter((item) => item.type === "root")
            .map((root) => {
              const children = nav.filter(
                (child) =>
                  child.id.startsWith(root.id + ".") && child.type === "item",
              );

              const isOpen = openRoots.includes(root.id);
              const contentRef = useRef(null);
              const [maxHeight, setMaxHeight] = useState(0);

              useEffect(() => {
                if (contentRef.current) {
                  setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0);
                }
              }, [isOpen, children]);

              const isChildActive = children.some((child) =>
                isRouteActive(child.path, pathname),
              );

              return (
                <div key={root.id} className="mb-2 w-full">
                  {children.length === 0 ? (
                    <MenuItem
                      data={root}
                      /* ⭐ Hover background updated to a lighter Navy variant */
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium uppercase hover:bg-white/5 hover:text-white transition-colors duration-200"
                      isRoot
                      textColor="#A3AED0"
                      hoverTextColor="#FFFFFF"
                      iconColor="#A3AED0"
                      /* ⭐ Icon Hover color changed to SREXPENSE Red (#F11D1F) */
                      hoverIconColor="#F11D1F"
                    />
                  ) : (
                    <>
                      {/* Root heading collapsible */}
                      <div
                        className={clsx(
                          "group flex cursor-pointer items-center justify-between rounded-md px-4 py-2 text-sm font-medium uppercase transition-colors duration-200",
                          isChildActive
                            ? "bg-white/5 text-white"
                            : "hover:bg-white/5",
                        )}
                        onClick={() => toggleRoot(root.id)}
                      >
                        <div className="flex items-center space-x-2 text-[12px]">
                          {root.Icon && (
                            <root.Icon
                              className={clsx(
                                "h-5 w-5 shrink-0 transition-colors duration-200",
                                isChildActive
                                  ? "text-[#F11D1F]" /* ⭐ Active Root Icon Red */
                                  : "text-[#A3AED0] group-hover:text-[#F11D1F]", /* ⭐ Hover Icon Red */
                              )}
                            />
                          )}
                          <span
                            className={clsx(
                              isChildActive
                                ? "text-white font-bold"
                                : "text-[#A3AED0] group-hover:text-white",
                            )}
                          >
                            {root.title}
                          </span>
                        </div>

                        <ChevronDownIcon
                          className={clsx(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            isOpen ? "rotate-180" : "",
                            isChildActive
                              ? "text-[#F11D1F]"
                              : "text-[#A3AED0] group-hover:text-[#F11D1F]",
                          )}
                        />
                      </div>

                      {/* Children collapse */}
                      <div
                        ref={contentRef}
                        style={{
                          maxHeight: maxHeight,
                          transition: "max-height 0.3s ease",
                          overflow: "hidden",
                        }}
                      >
                        {/* ⭐ Added subtle border to the left of child items for structure */}
                        <div className="mt-1 flex flex-col space-y-1 ml-4 border-l border-white/10 pl-2">
                          {children.map((child) => (
                            <MenuItem
                              key={child.id}
                              data={child}
                              /* ⭐ Hover and Active states for Sub-menu items */
                              className="rounded-md py-2 pr-4 pl-4 text-[13px] hover:bg-white/5 hover:text-white transition-all duration-200"
                              hideIcon
                              prefix
                              textColor="#A3AED0"
                              hoverTextColor="#FFFFFF"
                              iconColor="#A3AED0"
                              hoverIconColor="#F11D1F"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </SimpleBar>
    </div>
  );
}

Menu.propTypes = {
  nav: PropTypes.array,
  pathname: PropTypes.string,
};