/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 会员模块-发票功能模块用于处理前端请求的中间层接口
 */

const invoice = require('../controller/invoice');

module.exports = {
    "POST/putInvoice": invoice.putInvoice,  //  提交发票
    "GET/getInvoiceType": invoice.getInvoiceInfo,  //  发票类型
    "GET/getCanSetInvoice": invoice.canSetInvoice,  //  发票设置
    "GET/getInvoiceDetail": invoice.getDetail,  //  获取发票详情
    "PUT/cancelInvoice": invoice.cancelInvoice,  // 取消发票
};
