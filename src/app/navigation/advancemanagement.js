import Cookies from "js-cookie";
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from "constants/app.constant";
import { ChartBarIcon } from "lucide-react";
import { isAdvanceAccess } from "utils/isSupplierAccess";

const roleId = Number(Cookies.get("roleid") || 0);
const advanceAccess = Number(Cookies.get("advanceAccess") || 0);

export const advancemanagement =
  roleId === 10 && advanceAccess === 0
    ? null
    : {
      id: "advancemanagement",
      type: NAV_TYPE_ROOT,
      role: 110000,
      path: "/advancemanagement",
      title: "Advance",
      Icon: ChartBarIcon,

      childs: [
        ...(isAdvanceAccess()
          ? [
            {
              id: "advancemanagement.myadvance",
              path: "/advancemanagement/advance",
              type: NAV_TYPE_ITEM,
              role: 110001,
              title: "My Advance",
              Icon: ChartBarIcon,
            },
          ]
          : []),

          {
            id: "advancemanagement.index",
          path: "/advancemanagement/advanceuserlist",
          type: NAV_TYPE_ITEM,
          role: 110005,
          title: "Pending Advance Request",
          Icon: ChartBarIcon,
        },

        {
          id: "advancemanagement.index",
          path: "/advancemanagement/useradvances",
          type: NAV_TYPE_ITEM,
          role: 110007,
          title: "Approved Advance Request",
          Icon: ChartBarIcon,
        },

        {
          id: "advancemanagement.index",
          path: "/advancemanagement/paidadvance",
          type: NAV_TYPE_ITEM,
          role: 110011,
          title: "Paid Advance",
          Icon: ChartBarIcon,
        },
        
        {
          id: "advancemanagement.index",
          path: "/advancemanagement/advancereport",
          type: NAV_TYPE_ITEM,
          role: 110010,
          title: "Advance Report",
          Icon: ChartBarIcon,
        },
        {
          id: "advancemanagement.vendor",
          path: "/advancemanagement/supplier-advances",
          type: NAV_TYPE_ITEM,
          role: 110012,
          title: "Supplier Advances",
          Icon: ChartBarIcon,
        },
      ],
    };