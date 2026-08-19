import { dashboards } from "./dashboards";
import { menuaccessmanagement } from "./menuaccessmanagement";
// import { studentsmanagement } from "./studentsmanagement";
import { usermanagement } from "./usermanagementNavigation";
import { expensesmanagement } from "./expensesmanagement";
import { categorymanagement } from "./categorymangement";
import { companymanagement } from "./companymanagement";
import { masters } from "./mastersmanagement";
import { advancemanagement } from "./advancemanagement";


export const navigation = [
  dashboards,
  categorymanagement,
  companymanagement,
  advancemanagement,
  expensesmanagement,
  masters,
  usermanagement,
  menuaccessmanagement,
].filter(Boolean);
export { baseNavigation } from "./baseNavigation";
