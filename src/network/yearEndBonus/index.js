import request from "@/network/request";
const testAPI = require("@/apis")

export const getAllYearEndBonus = config => request._get(testAPI.YEAR_END_BONUS_ALL, config)
export const createYearEndBonus = config => request._post(testAPI.YEAR_END_BONUS_CREATE, config)
export const updateYearEndBonus = config => request._post(testAPI.YEAR_END_BONUS_UPDATE, config)
export const findYearEndBonusByStaffId = config => request._get(testAPI.YEAR_END_BONUS_FIND_BY_STAFF_ID, config)
export const getAllStaffExceptGM = config => request._get(testAPI.STAFF_ALL_EXCEPT_GM, config)
export const getTotalAmountByStaffId = config => request._get(testAPI.SALARY_FIND_TOTAL_AMOUNT_BY_STAFF_ID, config)