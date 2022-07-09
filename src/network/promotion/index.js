import request from "@/network/request";
const testAPI = require("@/apis")

// 基于总价的促销策略
const getAllTotalPricePromotion = config => request._get(testAPI.TOTAL_PRICE_PROMOTION_ALL, config)
const createTotalPricePromotion = config => request._post(testAPI.TOTAL_PRICE_PROMOTION_CREATE, config)
const deleteTotalPricePromotion = config => request._post(testAPI.TOTAL_PRICE_PROMOTION_DELETE, config)
const findTotalPricePromotionById = config => request._get(testAPI.TOTAL_PRICE_PROMOTION_FIND_BY_ID, config)

// 基于组合的促销策略
const getAllCombinatorialPromotion = config => request._get(testAPI.COMBINATORIAL_PROMOTION_ALL, config)
const createCombinatorialPromotion = config => request._post(testAPI.COMBINATORIAL_PROMOTION_CREATE, config)
const deleteCombinatorialPromotion = config => request._get(testAPI.COMBINATORIAL_PROMOTION_DELETE, config)
const updateCombinatorialPromotion = config => request._post(testAPI.COMBINATORIAL_PROMOTION_UPDATE, config)
const findCombinatorialPromotionByPair = config => request._get(testAPI.COMBINATORIAL_PROMOTION_FIND_BY_PAIR, config)

// 基于用户级别的促销策略
const getAllLevelPromotion = config => request._get(testAPI.LEVEL_PROMOTION_ALL, config)
const updateLevelPromotion = config => request._post(testAPI.LEVEL_PROMOTION_UPDATE, config)
const findLevelPromotionByLevel = config => request._get(testAPI.LEVEL_PROMOTION_FIND_BY_LEVEL, config)
