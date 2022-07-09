import request from "@/network/request"
const testAPI = require("@/apis")


export const getAllCustomer = config => request._get(testAPI.SALE_CUSTOMER_QUERY, config)
export const getMaxAmountCustomerOfSalesmanByTime = config => request._get(testAPI.SALE_CUSTOMER_MAX, config)

export const getAllSale = config => request._get(testAPI.SALE_ALL, config);
export const createSale = config => request._post(testAPI.SALE_CREATE, config);
export const firstApproval = config => request._get(testAPI.SALE_FIRST_APPROVAL, config);
export const secondApproval = config => request._get(testAPI.SALE_SECOND_APPROVAL, config);
export const returnFirstApproval = config => request._get(testAPI.SALE_RETURN_FIRST_APPROVAL, config);
export const returnSecondApproval = config => request._get(testAPI.SALE_RETURN_SECOND_APPROVAL, config);
export const getSaleBySheetId = config => request._get(testAPI.SALE_FIND_SHEET_BY_ID, config);
export const getAllSaleReturn = config => request._get(testAPI.SALE_RETURN_ALL, config);
export const createSaleReturn = config => request._post(testAPI.SALE_RETURN_CREATE, config);

// 赠送单的部分
export const getAllGiveAway = config => request._get(testAPI.GIVE_AWAY_ALL, config);
export const createGiveAway = config => request._post(testAPI.GIVE_AWAY_CREATE, config);
export const firstApprovalGiveAway = config => request._get(testAPI.GIVE_AWAY_FIRST_APPROVAL, config);
export const secondApprovalGiveAway = config => request._get(testAPI.GIVE_AWAY_SECOND_APPROVAL, config);
