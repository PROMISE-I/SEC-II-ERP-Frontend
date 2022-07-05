import request from "@/network/request";
const testAPI = require("@/apis");

// 收款单
export const findReceiveMoneyByState = config => request._post(testAPI.RECEIVE_MONEY_FIND_BY_STATE, config);
export const createReceiveMoney = config => request._post(testAPI.RECEIVE_MONEY_CREATE, config);
export const firstApprovalReceiveMoney = config => request._post(testAPI.RECEIVE_MONEY_FIRST_APPROVAL, config);
export const secondApprovalReceiveMoney = config => request._post(testAPI.RECEIVE_MONEY_SECOND_APPROVAL, config);

// 付款单
export const findPayMoneyByState = config => request._post(testAPI.PAY_MONEY_FIND_BY_STATE, config);
export const createPayMoney = config => request._post(testAPI.PAY_MONEY_CREATE, config);
export const firstApprovalPayMoney = config => request._post(testAPI.PAY_MONEY_FIRST_APPROVAL, config);
export const secondApprovalPayMoney = config => request._post(testAPI.PAY_MONEY_SECOND_APPROVAL, config);

// TODO

