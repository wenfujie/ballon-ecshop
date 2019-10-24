/*
* createTime：2018/10/9
* author：en.chen
* description:  中间层提供给前端的支付模块api
*/

class paymentModel {

    //  订单支付
    static async orderPayment(ctx, params) {
		return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.payment + ctx.optimizeFlag +  '/order-pay', params ).then((res) => {
			return res
		});
    }

}

module.exports = paymentModel
