/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的支付模块api
 */

const payment = require('../controller/payment');

module.exports = {
    "POST/orderPayment": payment.orderPayment,  // 订单支付
};
