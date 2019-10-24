
/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 订单模块用于处理前端请求的中间层接口
 */

const order = require('../controller/order');

module.exports = {
    "GET/getFreight": order.getFreight, //  运费
    "GET/getOrderDiscount": order.getOrderDiscount, //  订单优惠信息
    "GET/getWxOrderList": order.getWxOrderList, // 获取订单列表数据 ---------移动端才有（移动端的controller层处理方式不一样）
    "GET/getOrderDetail": order.getOrderDetail, // 获取订单详情
    "GET/getWxOrderDetailInfo": order.getWxOrderDetailInfo, //获取订单详情新接口 ---------移动端才有（移动端的controller层处理方式不一样）
    "GET/getCustomList": order.getCustomList, //获取定制清单数据
    "GET/getOrderEvaluateList": order.getOrderEvaluateList, // 获取订单待评价商品列表
    "GET/getVolumedList": order.getVolumedList, // 获取已量体数据
    "GET/getOrderSettlementInfo": order.getOrderSettlementInfo, //  获取订单结算页信息
    "GET/getShipType": order.getShipType, //  获取配送方式
    "GET/getShareItem": order.getShareItem, //订单分享信息查询
    "GET/orderPreferCal": order.orderPreferCal,  //订单促销优惠计算
    "GET/clearAllCache": order.clearAllCache,  //清楚缓存
    "POST/getWxSignature": order.getWxSignature,// 订单分享
    "POST/saveCartTemp": order.saveCartTemp, //  保存更新结算
    "POST/saveOrderOld": order.saveOrderOld, //提交订单,老的---------移动端才有（pc是会员整合新增,pc多个（比pc多个vipInfoHdId））
    "POST/ordCommentWx": order.ordCommentWx, //提交订单评价（微信）---------移动端才有（model不一样）
    "POST/ordAddComment": order.ordAddComment, //提交订单追评
    "POST/saveShareInfo": order.saveShareInfo, //订单分享信息保存
    "POST/getOrdReapplyStatus": order.getOrdReapplyStatus, //根据订单编码获取售后单状态 ---------移动端才有
    "PUT/confirmRcievedWx": order.confirmRcievedWx, //确认收货---------移动端才有（移动端的controller层处理方式不一样）
    "PUT/cancelOrderWx": order.cancelOrderWx, //取消订单---------移动端才有（移动端的controller层处理方式不一样）
    "PUT/beforeSignUpWx": order.beforeSignUpWx, //确认收货前判断该订单是否存在售后申请单子---------移动端才有（移动端的controller层处理方式不一样）
    "PUT/saveShareItemWx": order.saveShareItemWx, //订单分享信息更新（比pc多个vipInfoHdId）---------移动端才有
    "PUT/lockZero": order.lockZero, //订单结算0元锁库存  ---------移动端才有
    
    
    
};
