// Import Dependencies
import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react"; // NEW CODE: added useState
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { useDisclosure } from "hooks";
import { Button, Input } from "components/ui";

// ----------------------------------------------------------------------

export function CollapsibleSearch({
  defaultState,
  className,
  buttonProps,
  // NEW CODE: API Search callback
  onSearch,
  ...props
}) {
  const [isExpanded, { toggle }] = useDisclosure(defaultState);
  const inputRef = useRef();

  // NEW CODE: store search text locally
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (isExpanded) inputRef.current.focus();
  }, [isExpanded]);

  return (
    <div className="flex items-center" {...{ "data-collapsed": !isExpanded }}>
      {/* ---------- OLD CODE (Frontend search handled here) ---------- */}
      {/*
      <Input
        autoComplete="off"
        unstyled
        ref={inputRef}
        classNames={{
          root: clsx(
            "text-end transition-[width] duration-100",
            isExpanded ? "w-32 lg:w-48" : "w-0",
          ),
          input: [
            "text-end placeholder:font-light placeholder:text-gray-600 dark:placeholder:text-dark-200",
            className,
          ],
        }}
        {...props}
      />
      */}
      {/* -------------------------------------------------------------- */}

      {/* ---------- NEW CODE (Trigger API search on button click) ---------- */}
      <form
        className="max-w-md mx-auto flex w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (onSearch) onSearch(searchValue);
        }}
      >
        <label
          htmlFor="collapsible-search-input"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>

        {/* Group wrapper for shared focus shadow */}
        <div className="flex group w-fit">
          {/* Input */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="collapsible-search-input"
              className="block w-50 p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-l-lg b
                         focus:outline-none focus:border-transparent group-focus-within:shadow-[0_0_6px_rgba(47,60,94,0.6)]
                         dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value === "" && onSearch) {
                  onSearch("");
                }
              }}
              // required
              {...props}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-22 bg-[#2F3C5F] hover:bg-[#222c47] text-white cursor-pointer
                       focus:outline-none font-medium rounded-r-lg text-sm px-4 py-2
                       dark:bg-blue-600 dark:hover:bg-blue-700
                      group-focus-within:shadow-[0_0_6px_rgba(47,60,94,0.6)]"
          >
            Search
          </button>
        </div>
      </form>
      {/* ------------------------------------------------------------------- */}
    </div>
  );
}

CollapsibleSearch.propTypes = {
  defaultState: PropTypes.bool,
  buttonProps: PropTypes.object,
  className: PropTypes.string,
  // NEW CODE: prop type for API search
  onSearch: PropTypes.func,
};
