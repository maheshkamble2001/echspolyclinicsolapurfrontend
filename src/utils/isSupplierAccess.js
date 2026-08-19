import Cookies from "js-cookie";

/**
 * Cookies se supplierAccess ki raw value nikalne ke liye function
 * @returns {number}
 */
export const getSupplierAccess = () => {
    return Number(Cookies.get("supplierAccess") || 0);
};

/**
 * Direct boolean check karne ke liye function (True/False)
 * @returns {boolean}
 */
export const isSupplierAccess = () => {
    return getSupplierAccess() !== 0;
};



export const getAdvanceAccess = () => {
  return Number(Cookies.get("advanceAccess") || 0);
};

export const isAdvanceAccess = () => {
  return getAdvanceAccess() !== 0;
};