// 部署url
export const REQUEST_BASE_URL_PROD = "http://ismzl.com/";
// 开发url （mock的地址
export const REQUEST_BASE_URL_DEV = "http://localhost:8080";

export const ROLE = {
  INVENTORY_MANAGER: "INVENTORY_MANAGER", //库存管理人员
  SALE_STAFF: "SALE_STAFF", // 进货销售人员
  SALE_MANAGER: "SALE_MANAGER", //销售经理
  FINANCIAL_STAFF: "FINANCIAL_STAFF", // 财务人员
  HR: "HR", // 人力资源人员
  GM: "GM", // 总经理
  ADMIN: "ADMIN" // 最高权限
};


export const PATH = {
  // INVENTORY_MANAGER
  COMMODITY_CLASSIFICATION: {
    path: '/commodityClassification',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  COMMODITY_MANAGEMENT: {
    path: '/commodityManagement',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_MANAGEMENT: {
    path: '/inventoryManagement',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_OPERATION: {
    path: '/inventoryOperation',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_CHECK: {
    path: '/inventoryCheck',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_IN: {
    path: '/inventoryIn',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_OUT: {
    path: '/inventoryOut',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_LOSS: {
    path: '/inventoryLoss',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_WARNING: {
    path: '/inventoryWarning',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_OVERFLOW: {
    path: '/inventoryOverflow',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_PRESENT: {
    path: '/inventoryPresent',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },
  INVENTORY_VIEW: {
    path: '/inventoryView',
    requiresAuth: [ROLE.INVENTORY_MANAGER,ROLE.ADMIN]
  },

  // SALE_STAFF & SALE_MANAGER
  PURCHASE_VIEW: {
    path: '/purchaseView',
    requiresAuth: [ROLE.SALE_STAFF,ROLE.SALE_MANAGER,ROLE.GM,ROLE.ADMIN]
  },
  PURCHASE_RETURN_VIEW: {
    path: '/purchaseReturnView',
    requiresAuth: [ROLE.SALE_STAFF,ROLE.SALE_MANAGER,ROLE.GM,ROLE.ADMIN]
  },
  SALE_VIEW: {
    path: '/saleView',
    requiresAuth: [ROLE.SALE_STAFF,ROLE.SALE_MANAGER,ROLE.GM,ROLE.ADMIN]
  },
  SALE_RETURN_VIEW: {
    path: '/saleReturnView',
    requiresAuth: [ROLE.SALE_STAFF,ROLE.SALE_MANAGER,ROLE.GM,ROLE.ADMIN]
  },
  CUSTOMER_VIEW: {
    path: '/customerView',
    requiresAuth: [ROLE.SALE_STAFF,ROLE.SALE_MANAGER,ROLE.GM,ROLE.ADMIN]
  },
  GIVE_AWAY_VIEW: {
    path: '/giveAwayView',
    requiresAuth: [ROLE.SALE_STAFF, ROLE.SALE_MANAGER, ROLE.GM, ROLE.ADMIN]
  }, // 赠送单

  // FINANCIAL_STAFF 财务管理人员
  BANK_ACCOUNT_MANAGEMENT: {
    path: '/bankAccountManagement',
    requiresAuth: [ROLE.FINANCIAL_STAFF, ROLE.GM, ROLE.ADMIN]
  },
  RECEIVE_MONEY_SHEET_MANAGEMENT: {
    path: '/receiveMoneySheetManagement',
    requiresAuth: [ROLE.FINANCIAL_STAFF, ROLE.GM, ROLE.ADMIN]
  },
  PAY_MONEY_SHEET_MANAGEMENT: {
    path: '/payMoneySheetManagement',
    requiresAuth: [ROLE.FINANCIAL_STAFF, ROLE.GM, ROLE.ADMIN]
  },

  SALE_DETAIL_VIEW: {
    path: '/saleDetailView',
    requiresAuth: [ROLE.FINANCIAL_STAFF, ROLE.GM, ROLE.ADMIN]
  }, // 查看销售明细表
  BUSINESS_HISTORY_VIEW: {
    path: '/businessHistoryView',
    requiresAuth: [ROLE.FINANCIAL_STAFF, ROLE.GM, ROLE.ADMIN]
  }, // 查看经营历程表
  OPERATE_SHEET_VIEW: {
    path: '/operateSheetView',
    requiresAuth: [ROLE.FINANCIAL_STAFF, ROLE.GM, ROLE.ADMIN]
  }, // 查看经营情况表

  // HR 人力资源人员
  STAFF_MANAGEMENT: {
    path: '/staffManagement',
    requiresAuth: [ROLE.HR, ROLE.ADMIN]
  },
  POSITION_MANAGEMENT: {
    path: '/positionManagement',
    requiresAuth: [ROLE.HR, ROLE.ADMIN]
  },
  SALARY_SHEET_MANAGEMENT: {
    path: '/salarySheetManagement',
    requiresAuth: [ROLE.HR, ROLE.GM, ROLE.ADMIN]
  },

  ATTENDANCE: {
    path: '/attendance',
    requiresAuth: [ROLE.HR, ROLE.SALE_MANAGER, ROLE.INVENTORY_MANAGER, ROLE.FINANCIAL_STAFF, ROLE.SALE_STAFF, ROLE.ADMIN]
  }, // 打卡

  // GM
  GM_APPROVAL: {
    path: '/approval',
    requiresAuth: [ROLE.GM, ROLE.ADMIN]
  }, // 审批的页面现在被弃用
  YEAR_END_BONUS_MANAGEMENT: {
    path: '/yearEndBonusManagement',
    requiresAuth: [ROLE.GM, ROLE.ADMIN]
  }, // 年终奖制定
  PROMOTION_MANAGEMENT: {
    path: '/promotionManagement',
    requiresAuth: [ROLE.GM, ROLE.ADMIN]
  }, // 促销策略管理,
  TOTAL_PRICE_PROMOTION_MANAGEMENT: {
    path: '/totalPricePromotionManagement',
    requiresAuth: [ROLE.GM, ROLE.ADMIN]
  },
  COMBINATORIAL_PROMOTION_MANAGEMENT: {
    path: '/combinatorialPromotionManagement',
    requiresAuth: [ROLE.GM, ROLE.ADMIN]
  },
  LEVEL_PROMOTION_MANAGEMENT: {
    path: '/levelPromotionManagement',
    requiresAuth: [ROLE.GM, ROLE.ADMIN]
  }
}
