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
const BANK_ACCOUNT_ALL = '/api/bankAccount/'; // TODO: TBD
const BANK_ACCOUNT_CREATE = '/api/bankAccount/create';
const BANK_ACCOUNT_DELETE = '/api/bankAccount/delete';
const BANK_ACCOUNT_UPDATE = '/api/bankAccount/update';
const BANK_ACCOUNT_FIND_BY_AMBIGUOUS_NAME = 'api/bankAccount/findByAmbiguousName';
const BANK_ACCOUNT_FIND_BY_ID = 'api/bankAccount/findById';

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

// 岗位管理
const POSITION_ALL = '/api/position/findAll';
const POSITION_UPDATE = 'api/position/update';
const POSITION_FIND_BY_TITLE = 'api/position/findByTitle';

module.exports = {
  TEST_GET,
  TEST_POST,

  AUTH,
  LOGIN,
  REGISTER,

  BANK_ACCOUNT_ALL,
  BANK_ACCOUNT_CREATE,
  BANK_ACCOUNT_DELETE,
  BANK_ACCOUNT_UPDATE,
  BANK_ACCOUNT_FIND_BY_AMBIGUOUS_NAME,
  BANK_ACCOUNT_FIND_BY_ID,

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

  STAFF_ALL,
  STAFF_CREATE,
  STAFF_DELETE,
  STAFF_UPDATE,

  POSITION_ALL,
  POSITION_FIND_BY_TITLE,
  POSITION_UPDATE
};
