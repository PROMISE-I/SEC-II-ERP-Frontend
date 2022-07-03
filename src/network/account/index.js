import request from "@/network/request"
const testAPI = require("@/apis")

export const getAllBankAccount = config => request._get(testAPI.BANK_ACCOUNT_ALL, config);
export const createBankAccount = config => request._post(testAPI.BANK_ACCOUNT_CREATE, config);
export const deleteBankAccount = config => request._post(testAPI.BANK_ACCOUNT_DELETE, config);
export const updateBankAccount = config => request._post(testAPI.BANK_ACCOUNT_UPDATE, config);
export const findBankAccountByAmbiguousName = config => request._get(testAPI.BANK_ACCOUNT_FIND_BY_AMBIGUOUS_NAME, config);
export const findBankAccountById = config => request._get(testAPI.BANK_ACCOUNT_FIND_BY_ID, config);