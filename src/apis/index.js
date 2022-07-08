//TEST
const TEST_GET = "/api/test/get";
const TEST_POST = "/api/test/post";

const AUTH = "/api/user/auth"
const LOGIN = "/api/user/login"
const REGISTER = '/api/user/register'

// 商品分类管理
const COMMODITY_CLASSIFICATION_ALL = '/api/category/queryAll'
const COMMODITY_CLASSIFICATION_CREATE = '/api/category/create'
const COMMODITY_CLASSIFICATION_UPDATE = '/api/category/update'
const COMMODITY_CLASSIFICATION_DELETE = '/api/category/delete'

// 商品管理
const COMMODITY_ALL = '/api/product/queryAll';
const COMMODITY_CREATE = '/api/product/create';
const COMMODITY_UPDATE = '/api/product/update';
const COMMODITY_DELETE = '/api/product/delete';

const WAREHOUSE_INPUT = '/api/warehouse/input';
const WAREHOUSE_OUTPUT_PRE = '/api/warehouse/product/count';
const WAREHOUSE_OUTPUT = '/api/warehouse/output';
const WAREHOUSE_GET_INPUTSHEET = '/api/warehouse/inputSheet/state';
const WAREHOUSE_GET_OUTPUTSHEET = '/api/warehouse/outputSheet/state';
const WAREHOUSE_IO_DEATIL_BY_TIME = '/api/warehouse/sheetContent/time';
const WAREHOUSE_IPQ_BY_TIME = '/api/warehouse/inputSheet/time/quantity';
const WAREHOUSE_OPQ_BY_TIME = '/api/warehouse/outputSheet/time/quantity';
const WAREHOUSE_OUTPUTSHEET_APPROVE = '/api/warehouse/outputSheet/approve';
const WAREHOUSE_INPUTSHEET_APPROVE = '/api/warehouse/inputSheet/approve';
const WAREHOUSE_DAILY_COUNT = '/api/warehouse/warehouse/counting';

// 账户管理 / 银行账户管理
const BANK_ACCOUNT_ALL = '/api/bankAccount/findAllAccount';
const BANK_ACCOUNT_CREATE = '/api/bankAccount/add'; // 注意：别的地方一般都是 create ，只有这里是 add
const BANK_ACCOUNT_DELETE = '/api/bankAccount/delete';
const BANK_ACCOUNT_UPDATE = '/api/bankAccount/update';
const BANK_ACCOUNT_FIND_BY_AMBIGUOUS_NAME = 'api/bankAccount/findByAmbiguousName';
const BANK_ACCOUNT_FIND_BY_ID = 'api/bankAccount/findAccountById';

// 销售管理
// 进货管理
const PURCHASE_ALL = '/api/purchase/sheet-show';
const PURCHASE_FIND_SHEET_BY_ID = '/api/purchase/find-sheet';
const PURCHASE_CREATE = '/api/purchase/sheet-make';
const PURCHASE_FIRST_APPROVAL = '/api/purchase/first-approval';
const PURCHASE_SECOND_APPROVAL = '/api/purchase/second-approval';
// 进货退货管理
const PURCHASE_RETURN_ALL = '/api/purchase-returns/sheet-show';
const PURCHASE_RETURN_CREATE = '/api/purchase-returns/sheet-make';
const PURCHASE_RETURN_FIRST_APPROVAL = '/api/purchase-returns/first-approval';
const PURCHASE_RETURN_SECOND_APPROVAL = '/api/purchase-returns/second-approval';
// 销售管理
const SALE_ALL = '/api/sale/sheet-show';
const SALE_CREATE = '/api/sale/sheet-make';
const SALE_FIRST_APPROVAL = '/api/sale/first-approval';
const SALE_SECOND_APPROVAL = '/api/sale/second-approval';
const SALE_FIND_SHEET_BY_ID = '/api/sale/find-sheet';
const SALE_RETURN_FIRST_APPROVAL = '/api/sale-returns/first-approval';
const SALE_RETURN_SECOND_APPROVAL = '/api/sale-returns/second-approval';
const SALE_RETURN_ALL = '/api/sale-returns/sheet-show';
const SALE_RETURN_CREATE = '/api/sale-returns/sheet-make';
// 客户管理
const CUSTOMER_QUERY = '/api/customer/findByType';
const CUSTOMER_CREATE = '/api/customer/addCustomer';
const CUSTOMER_FIND_BY_ID = '/api/customer/findById';
const CUSTOMER_UPDATE = 'api/customer/update';
const CUSTOMER_DELETE = 'api/customer/delete';
const SALE_PURCHASE_ALL = '/api/purchase/sheet-show';
const SALE_PURCHASE_CREATE = '/api/purchase/sheet-make';
const SALE_CUSTOMER_QUERY = '/api/customer/findByType';
const SALE_CUSTOMER_MAX = '/api/sale/maxAmountCustomer';

// 员工管理
const STAFF_CREATE = '/api/staff/create';
const STAFF_ALL = '/api/staff/findAll';
const STAFF_UPDATE = '/api/staff/update';
const STAFF_DELETE = '/api/staff/delete';
const STAFF_FIND_BY_ID = '/api/staff/findById'

// 岗位管理
const POSITION_ALL = '/api/position/findAll';
const POSITION_UPDATE = '/api/position/update';
const POSITION_FIND_BY_TITLE = '/api/position/findByTitle';

// 打卡
const ATTENDANCE_CLOCK_IN = '/api/attendance/clockIn';
const ATTENDANCE_CHECK = '/api/attendance/check';

// 收款单
const RECEIVE_MONEY_ALL = '/api/receiveMoney/find-all-sheets';
const RECEIVE_MONEY_FIND_BY_STATE = '/api/receiveMoney/sheet-show';
const RECEIVE_MONEY_CREATE = '/api/receiveMoney/sheet-make';
const RECEIVE_MONEY_FIRST_APPROVAL = '/api/receiveMoney/first-approval';
const RECEIVE_MONEY_SECOND_APPROVAL = '/api/receiveMoney/second-approval';

// 付款单
const PAY_MONEY_ALL = '/api/payMoney/find-all-sheets';
const PAY_MONEY_FIND_BY_STATE = '/api/payMoney/sheet-show';
const PAY_MONEY_CREATE = '/api/payMoney/sheet-make';
const PAY_MONEY_FIRST_APPROVAL = '/api/payMoney/first-approval';
const PAY_MONEY_SECOND_APPROVAL = '/api/payMoney/second-approval';

// 工资单
const SALARY_ALL = '/api/salary/get-all-salary-sheets';
const SALARY_FIND_BY_STATE = '/api/salary/sheet-show';
const SALARY_AMOUNT_GET_BY_ID = '/api/salary/get-salary';
const SALARY_CREATE = '/api/salary/sheet-make';
const SALARY_FIRST_APPROVAL = '/api/salary/first-approval';
const SALARY_SECOND_APPROVAL = '/api/salary/second-approval';

// 查看销售明细表
const SALE_DETAIL_SHOW = '/api/sale/saleDetail-byRange';
const SALE_DETAIL_FIND_BY_CONDITION = '/api/sale/saleDetail';
const SALE_RETURN_DETAIL_SHOW = '/api/sale-returns/saleReturnsDetail-byRange';
const SALE_RETURN_DETAIL_FIND_BY_CONDITION = '/api/sale-returns/saleReturnsDetail';

// 查看经营历程表
const BUSINESS_HISTORY_SHOW = '/api/business-history/show';

// 查看经营历程表
const OPERATE_SHEET_SHOW = '/api/operate-sheet/show';

// 年终奖
const YEAR_END_BONUS_ALL = '/api/year-end-awards/find-all';
const YEAR_END_BONUS_CREATE = '/api/year-end-awards/awards-make';
const YEAR_END_BONUS_UPDATE = '/api/year-end-awards/awards-update';
const YEAR_END_BONUS_FIND_BY_STAFF_ID = '/api/year-end-awards/find-by-staffId-year';
const STAFF_ALL_EXCEPT_GM = '/api/staff/findAllExceptGM';
const SALARY_FIND_TOTAL_AMOUNT_BY_STAFF_ID = '/api/salary/get-total-amount';

module.exports = {
  TEST_GET,
  TEST_POST,

  AUTH,
  LOGIN,
  REGISTER,

  COMMODITY_CLASSIFICATION_ALL,
  COMMODITY_CLASSIFICATION_CREATE,
  COMMODITY_CLASSIFICATION_UPDATE,
  COMMODITY_CLASSIFICATION_DELETE,

  COMMODITY_ALL,
  COMMODITY_CREATE,
  COMMODITY_UPDATE,
  COMMODITY_DELETE,

  WAREHOUSE_INPUT,
  WAREHOUSE_OUTPUT_PRE,
  WAREHOUSE_OUTPUT,
  WAREHOUSE_GET_INPUTSHEET,
  WAREHOUSE_GET_OUTPUTSHEET,
  WAREHOUSE_IO_DEATIL_BY_TIME,
  WAREHOUSE_IPQ_BY_TIME,
  WAREHOUSE_OPQ_BY_TIME,
  WAREHOUSE_OUTPUTSHEET_APPROVE,
  WAREHOUSE_INPUTSHEET_APPROVE,
  WAREHOUSE_DAILY_COUNT,

  PURCHASE_ALL,
  PURCHASE_CREATE,
  PURCHASE_FIRST_APPROVAL,
  PURCHASE_SECOND_APPROVAL,
  PURCHASE_RETURN_ALL,
  PURCHASE_RETURN_CREATE,
  PURCHASE_RETURN_FIRST_APPROVAL,
  PURCHASE_RETURN_SECOND_APPROVAL,
  PURCHASE_FIND_SHEET_BY_ID,

  SALE_ALL,
  SALE_CREATE,
  SALE_RETURN_FIRST_APPROVAL,
  SALE_RETURN_SECOND_APPROVAL,
  SALE_RETURN_ALL,
  SALE_RETURN_CREATE,
  SALE_FIRST_APPROVAL,
  SALE_SECOND_APPROVAL,
  SALE_CUSTOMER_QUERY,
  SALE_CUSTOMER_MAX,
  SALE_FIND_SHEET_BY_ID,
  CUSTOMER_QUERY,
  CUSTOMER_CREATE,
  CUSTOMER_FIND_BY_ID,
  CUSTOMER_UPDATE,
  CUSTOMER_DELETE,

  BANK_ACCOUNT_ALL,
  BANK_ACCOUNT_CREATE,
  BANK_ACCOUNT_DELETE,
  BANK_ACCOUNT_UPDATE,
  BANK_ACCOUNT_FIND_BY_AMBIGUOUS_NAME,
  BANK_ACCOUNT_FIND_BY_ID,

  STAFF_ALL,
  STAFF_CREATE,
  STAFF_DELETE,
  STAFF_UPDATE,
  STAFF_FIND_BY_ID,

  POSITION_ALL,
  POSITION_FIND_BY_TITLE,
  POSITION_UPDATE,

  ATTENDANCE_CLOCK_IN,
  ATTENDANCE_CHECK,

  RECEIVE_MONEY_ALL,
  RECEIVE_MONEY_FIND_BY_STATE,
  RECEIVE_MONEY_CREATE,
  RECEIVE_MONEY_FIRST_APPROVAL,
  RECEIVE_MONEY_SECOND_APPROVAL,

  PAY_MONEY_ALL,
  PAY_MONEY_FIND_BY_STATE,
  PAY_MONEY_CREATE,
  PAY_MONEY_FIRST_APPROVAL,
  PAY_MONEY_SECOND_APPROVAL,

  SALARY_ALL,
  SALARY_FIND_BY_STATE,
  SALARY_AMOUNT_GET_BY_ID,
  SALARY_CREATE,
  SALARY_FIRST_APPROVAL,
  SALARY_SECOND_APPROVAL,

  SALE_DETAIL_SHOW,
  SALE_DETAIL_FIND_BY_CONDITION,
  SALE_RETURN_DETAIL_SHOW,
  SALE_RETURN_DETAIL_FIND_BY_CONDITION,

  BUSINESS_HISTORY_SHOW,

  OPERATE_SHEET_SHOW,

  YEAR_END_BONUS_ALL,
  YEAR_END_BONUS_CREATE,
  YEAR_END_BONUS_UPDATE,
  YEAR_END_BONUS_FIND_BY_STAFF_ID,
  STAFF_ALL_EXCEPT_GM,
  SALARY_FIND_TOTAL_AMOUNT_BY_STAFF_ID
};
