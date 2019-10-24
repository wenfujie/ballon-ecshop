/*
* createTime：2018/10/9
* author：en.chen
* description: 
*/

import http from '../../util/http'

/**
 * 订单支付
 * @param config
 * var param = {
    usrId: 用户id,
    paymentCode: "D_WEIXIN",
    tradeTypeCode: "JSAPI",
    paymentTypeCode: "D_FULL",
    domainName: info.domainName,
    shopCode: 店铺code,
    orderList: 订单号,
    openId: 微信用户openid,
    orderType: '订单类型' (D_CARDORD会员卡购买订单,D_COUPONSORD优惠券购买订单,D_MASORD商品购买订单  ,D_MSRORD预约量体订单)
    }
 * @returns {*}
 */

export const payOrder = (config) => {return http.post('payment/orderPayment',config); }