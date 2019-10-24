/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 中间层提供给前端的支付模块api
 */

const payment = require('../model/payment');

class paymentController {

    // 订单支付
    static async orderPayment(ctx) {
        let res = await payment.orderPayment(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = paymentController;
