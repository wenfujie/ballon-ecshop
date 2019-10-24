/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的优惠券模块api
 */

const vouchers = require('../controller/vouchers');

module.exports = {
    "GET/getVouchersList": vouchers.vouchersList,  // 获取领取优惠券列表
    "GET/getUserVouchersList": vouchers.userVouchersList,  // 获取我的优惠券列表
    "POST/saveCoupons": vouchers.saveCoupons,  // 领取优惠券
    "POST/buyCoupons": vouchers.buyCoupons,  // 购买优惠券
    "PUT/deleteCoupons": vouchers.deleteCoupons,  // 清空优惠券
    "GET/getSettlementDiscount": vouchers.getSettlementDiscount,  // 获取结算可用优惠券信息 (超鸿)
    "GET/getOrderCouponsList": vouchers.getCouponsList,  // 获取结算可用优惠券信息 (季老师)
    "GET/getOrderPromotion": vouchers.getOrderPromotion,  // 获取订单结算页面促销赠品信息
    "GET/getGoodsPromotion": vouchers.getGoodsPromotion,  // 获取商品促销活动
    "GET/getGoodsPmFlag": vouchers.getGoodspmFlag,  // 获取促销标识
    "GET/getPromotionGoodsSku": vouchers.getPromotionGoodsku,  // 获取促销赠品sku
    "GET/getPromotionGoodsInventory": vouchers.promotionGoodsInventory,  // 获取促销赠品库存
    "GET/getCanUseCouponsList": vouchers.getCanUseCouponsList,  // 选券后获取可用券id列表 (季老师)
    "POST/getOrderDiscountPoint": vouchers.getOrderDiscount,  //结算页面优惠金额
    "POST/getWxConfig": vouchers.getWxConfig,  // 优惠券加入微信卡包
    "PUT/sendCardCoupons": vouchers.sendCardCoupons  // 登陆送券
};
