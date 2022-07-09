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

// 销售明细表
export const getSaleDetailByRange = config => request._get(testAPI.SALE_DETAIL_SHOW, config);
export const findSaleDetailByCondition = config => request._post(testAPI.SALE_DETAIL_FIND_BY_CONDITION, config);
export const getSaleReturnDetailByRange = config => request._get(testAPI.SALE_RETURN_DETAIL_SHOW, config);
export const findSaleReturnDetailByCondition = config => request._post(testAPI.SALE_RETURN_DETAIL_FIND_BY_CONDITION, config);

// 经营历程表
export const showBusinessHistory = config => request._post(testAPI.BUSINESS_HISTORY_SHOW, config);
export const querySheetIdExist = config => request._get(testAPI.SHEET_QUERY_EXIST_BY_ID, config); // 查询某个单号是不是存在，用于判断能否进行红冲操作

// 经营历程表
export const showOperateSheet = config => request._get(testAPI.OPERATE_SHEET_SHOW, config);
