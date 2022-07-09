import request from "@/network/request";
const testAPI = require("@/apis")

// 基于总价的促销策略
export const getAllTotalPricePromotion = config => request._get(testAPI.TOTAL_PRICE_PROMOTION_ALL, config)
export const createTotalPricePromotion = config => request._post(testAPI.TOTAL_PRICE_PROMOTION_CREATE, config)
export const deleteTotalPricePromotion = config => request._get(testAPI.TOTAL_PRICE_PROMOTION_DELETE, config)
export const findTotalPricePromotionById = config => request._get(testAPI.TOTAL_PRICE_PROMOTION_FIND_BY_ID, config)

// 基于组合的促销策略
export const getAllCombinatorialPromotion = config => request._get(testAPI.COMBINATORIAL_PROMOTION_ALL, config)
export const createCombinatorialPromotion = config => request._post(testAPI.COMBINATORIAL_PROMOTION_CREATE, config)
export const deleteCombinatorialPromotion = config => request._get(testAPI.COMBINATORIAL_PROMOTION_DELETE, config)
export const updateCombinatorialPromotion = config => request._post(testAPI.COMBINATORIAL_PROMOTION_UPDATE, config)
export const findCombinatorialPromotionByPair = config => request._get(testAPI.COMBINATORIAL_PROMOTION_FIND_BY_PAIR, config)

// 基于用户级别的促销策略
export const getAllLevelPromotion = config => request._get(testAPI.LEVEL_PROMOTION_ALL, config)
export const updateLevelPromotion = config => request._post(testAPI.LEVEL_PROMOTION_UPDATE, config)
export const findLevelPromotionByLevel = config => request._get(testAPI.LEVEL_PROMOTION_FIND_BY_LEVEL, config)
