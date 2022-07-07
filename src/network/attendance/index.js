import request from "@/network/request";
const testAPI = require("@/apis")

export const clockIn = config => request._post(testAPI.ATTENDANCE_CLOCK_IN, config);
export const check = config => request._post(testAPI.ATTENDANCE_CHECK, config);