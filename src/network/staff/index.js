import request from "@/network/request";
const testAPI = require("@/apis")

export const getAllPosition = config => request._get(testAPI.POSITION_ALL, config);
export const updatePosition = config => request._post(testAPI.POSITION_UPDATE, config);
export const findPositionByTitle = config => request._get(testAPI.POSITION_FIND_BY_TITLE, config);

export const getAllStaff = config => request._get(testAPI.STAFF_ALL, config);
export const createStaff = config => request._post(testAPI.STAFF_CREATE, config);
export const updateStaff = config => request._post(testAPI.STAFF_UPDATE, config);
export const deleteStaff = config => request._get(testAPI.STAFF_DELETE, config);
export const findStaffById = config => request._get(testAPI.STAFF_FIND_BY_ID, config);

// 工资单
export const getAllSalary = config => request._get(testAPI.SALARY_ALL, config);
export const findSalaryByState = config => request._get(testAPI.SALARY_FIND_BY_STATE, config);
export const getSalaryAmountByStaffId = config => request._get(testAPI.SALARY_AMOUNT_GET_BY_ID, config);
export const createSalary = config => request._get(testAPI.SALARY_CREATE, config);
export const firstApprovalSalary = config => request._get(testAPI.SALARY_FIRST_APPROVAL, config);
export const secondApprovalSalary = config => request._get(testAPI.SALARY_SECOND_APPROVAL, config);
export const createSalaryByContent = config => request._post(testAPI.SALARY_CREATE_, config);