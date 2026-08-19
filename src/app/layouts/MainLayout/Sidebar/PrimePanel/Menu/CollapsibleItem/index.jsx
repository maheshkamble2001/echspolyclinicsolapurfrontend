import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MenuItem } from "./MenuItem";

export function CollapsibleItem({ data }) {
  const { childs, transKey, title: fallbackTitle } = data;
  const { t } = useTranslation();
  const title = t(transKey) || fallbackTitle;

  return (
    <div className="flex flex-col w-full">
      {/* Title */}
      <div className="text-xs-plus font-semibold text-gray-800 dark:text-dark-50 py-2 px-2 truncate">
        {title}
      </div>

      {/* Children */}
      <div className="ml-4 flex flex-col gap-1">
        {childs?.map((item) => (
          <MenuItem key={item.path} data={item} />
        ))}
      </div>
    </div>
  );
}

CollapsibleItem.propTypes = {
  data: PropTypes.object.isRequired,
};
