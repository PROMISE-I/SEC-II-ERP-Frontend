import request from "@/network/request";
const testAPI = require("@/apis");

// 收款单
export const getAllReceiveMoney = config => request._get(testAPI.RECEIVE_MONEY_ALL, config);
export const findReceiveMoneyByState = config => request._get(testAPI.RECEIVE_MONEY_FIND_BY_STATE, config);
export const createReceiveMoney = config => request._post(testAPI.RECEIVE_MONEY_CREATE, config);
export const firstApprovalReceiveMoney = config => request._get(testAPI.RECEIVE_MONEY_FIRST_APPROVAL, config);
export const secondApprovalReceiveMoney = config => request._get(testAPI.RECEIVE_MONEY_SECOND_APPROVAL, config);

// 付款单
export const getAllPayMoney = config => request._get(testAPI.PAY_MONEY_ALL, config);
export const findPayMoneyByState = config => request._get(testAPI.PAY_MONEY_FIND_BY_STATE, config);
export const createPayMoney = config => request._post(testAPI.PAY_MONEY_CREATE, config);
export const firstApprovalPayMoney = config => request._get(testAPI.PAY_MONEY_FIRST_APPROVAL, config);
export const secondApprovalPayMoney = config => request._get(testAPI.PAY_MONEY_SECOND_APPROVAL, config);

// 工资单
export const getAllSalary = config => request._get(testAPI.SALARY_ALL, config);
export const findSalaryByState = config => request._get(testAPI.SALARY_FIND_BY_STATE, config);
export const getSalaryAmountByStaffId = config => request._get(testAPI.SALARY_AMOUNT_GET_BY_ID, config);
export const createSalary = config => request._get(testAPI.SALARY_CREATE, config);
export const firstApprovalSalary = config => request._get(testAPI.SALARY_FIRST_APPROVAL, config);
export const secondApprovalSalary = config => request._get(testAPI.SALARY_SECOND_APPROVAL, config);

// 经营历程表
export const showOperateSheet = config => request._get(testAPI.OPERATE_SHEET_SHOW, config);
