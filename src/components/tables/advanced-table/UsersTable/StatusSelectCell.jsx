// components/tables/StatusSelectCell.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { Tag } from "components/ui";

export function StatusSelectCell({
  getValue,
  row,
  column,
  table,
  disabled = false,
}) {
  const val = getValue();
  const [loading, setLoading] = useState(false);

  const statusOptions = column?.columnDef?.meta?.statusOptions || [];

  const option = statusOptions.find((o) => o.value === val) || statusOptions[0];

  const colorClasses = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200",
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-100 text-red-700 border-red-200",
  };

  const onChange = async (status) => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      const id =
        row.original.id ||
        row.original._id ||
        row.original.user_id ||
        row.original.ProductID ||
        row.original.serviceid;

      const metaKey = column?.columnDef?.meta?.updateFnKey || "updateStatus";
      const updateFn = table.options.meta?.[metaKey];

      if (typeof updateFn === "function") {
        await updateFn(id, status, row.index, column.id);
      } else {
        console.warn(`Update function "${metaKey}" not found`);
      }
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!option) return null;

  // ──────────────────────────────────────────────
  // Disabled → render plain div → 100% control over color
  // ──────────────────────────────────────────────
  if (disabled || loading) {
    return (
      <div
        className={clsx(
          "inline-flex items-center justify-center gap-1.5 min-w-[90px] px-3 py-0.5 text-sm font-medium rounded-md border",
          loading
            ? "bg-gray-50 text-gray-500 border-gray-200 animate-pulse cursor-wait"
            : clsx(
              colorClasses[option.color],   // ✅ yaha main fix hai
              "cursor-not-allowed opacity-80"
            ),
          "dark:bg-gray-800 dark:border-gray-700"
        )}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {option.icon && <option.icon className="h-4 w-4 opacity-60" />}
            <span>{option.label}</span>
          </>
        )}
      </div>
    );
  }

  // Normal / interactive state → use Tag
  return (
    <Listbox value={val} onChange={onChange} disabled={false}>
      <ListboxButton
        as={Tag}
        component="button"
        color={option.color}
        className={clsx(
          "relative flex items-center gap-1.5 min-w-[90px] justify-center text-sm font-medium",
          "cursor-pointer hover:shadow-sm active:scale-[0.98] transition-all duration-150",
        )}
      >
        {option.icon && <option.icon className="h-4 w-4" />}
        <span>{option.label}</span>
      </ListboxButton>

      <Transition
        as={ListboxOptions}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-1 scale-95"
        anchor={{ to: "bottom start", gap: "6px" }}
        className="z-50 w-44 rounded-xl border border-gray-200 bg-white py-1.5 text-sm shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        {statusOptions.map((item) => (
          <ListboxOption
            key={item.value}
            value={item.value}
            className={({ active }) =>
              clsx(
                "relative cursor-pointer select-none py-2.5 px-4 flex items-center justify-between text-sm",
                active
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200",
              )
            }
          >
            {({ selected }) => (
              <>
                <div className="flex items-center gap-2.5">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="font-medium">{item.label}</span>
                </div>
                {selected && (
                  <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </>
            )}
          </ListboxOption>
        ))}
      </Transition>
    </Listbox>
  );
}

StatusSelectCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  disabled: PropTypes.bool,
};