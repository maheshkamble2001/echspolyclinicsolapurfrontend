import PropTypes from "prop-types";
 
// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  Select,
} from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
 
// ----------------------------------------------------------------------
 
export function PaginationSection({
  table,
  totalCount,
  limit,
  activePage,
  setLimit,
  setActivePage,
}) {
  const paginationState = table.getState().pagination;
  const { isXl, is2xl } = useBreakpointsContext();

  const totalPages = limit > 0 ? Math.ceil(totalCount / limit) : 0;
 
  return (
    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div className="text-xs-plus flex items-center space-x-2">
        <span>Show</span>
        <Select
          data={[1, 3, 10, 20, 30, 40, 50, 100]}
          value={limit}
          onChange={(e) => {
            setActivePage(1);
            setLimit(Number(e.target.value));
          }}
          classNames={{
            root: "w-fit",
            select: "h-7 rounded-full py-1 text-xs ltr:pr-7! rtl:pl-7! focus:border-red-500 focus:ring-red-500",
          }}
        />
        <span>entries</span>
      </div>
      <div>
        {
          (totalCount > limit && (
            <Pagination
              total={Math.ceil(totalCount / limit)}
              value={activePage}
              onChange={(page) => setActivePage(page)}
              siblings={isXl ? 2 : is2xl ? 3 : 1}
              boundaries={isXl ? 2 : 1}
              color="red" // Agar UI library prop support karti hai
              className="[&_.active]:bg-red-600 [&_.active]:text-white [&_button:hover]:text-red-600" // Tailwind override for active and hover states
            >
              {/* First Page Button */}
              <button
                type="button"
                className="px-2 py-1 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-red-600 transition-colors"
                onClick={() => setActivePage(1)}
                disabled={activePage === 1}
              >
                &laquo;
              </button>

              <PaginationPrevious className="hover:text-red-600" />
              <PaginationItems className="[&_[data-active]]:bg-red-600 [&_[data-active]]:text-white" />
              <PaginationNext className="hover:text-red-600" />

              {/* Last Page Button */}
              <button
                type="button"
                className="px-2 py-1 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:text-red-600 transition-colors"
                onClick={() => setActivePage(totalPages)}
                disabled={activePage === totalPages}
              >
                &raquo;
              </button>
            </Pagination>
          ))
        }
      </div>
      <div className="text-xs-plus truncate">
        {(() => {
          const page = Number(activePage) || 1;
          const size = Number(limit) || 0;
          const total = Number(totalCount) || 0;
 
          if (total === 0 || size === 0) return "0 entries";
 
          const start = (page - 1) * size + 1;
          const end = Math.min(page * size, total);
 
          return `${start} - ${end} of ${total} entries`;
        })()}
      </div>
    </div>
  );
}
 
PaginationSection.propTypes = {
  table: PropTypes.object,
};