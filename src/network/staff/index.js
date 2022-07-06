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