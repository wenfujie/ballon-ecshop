/*
* createTime：2018/8/22
* author：en.chen
* description: 优惠券模块
*/

import http from '../../util/http'

/**
 * 获取可领取优惠券列表
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   "busContsCode":"业务触点",
   "isWeixin":"是否是微信卡券(0,1,2)" 默认使用2,
   "wxUnionid":"公众号id"
    }
 * @returns {*}
 */
export const getVouchersList = (config) => { return http.get('vouchers/getVouchersList', config); }

/**
 * 获取我的优惠券列表
 * @param config
 * var param = {
   usrId: "用户ID",
   companyId: "公司ID",
   couponCategory: 'D_VALCARDOVERD(非必填)',
   pageNum: 1,
   pageSize: 10,
   cardCode: 优惠券编码，非必填
    }
 * @returns {*}
 */
export const userVouchersList = (config) => { return http.get('vouchers/getUserVouchersList', config); }

/**
 * 领取优惠券
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   "busContsCode":"业务触点",
   "couponsId":"优惠劵ID",
   "totalFlag":"全部领取标记",
   "cardId:"领取指定的卡ID"
    }
 * @returns {*}
 */
export const saveCoupons = (config) => { return http.post('vouchers/saveCoupons', config); }

/**
 * 购买优惠券
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   "shopCode":"店铺编码",
   "couponsId":"优惠劵ID"
   "cardHdId":"储值卡ID"[增加储值卡分支]
    }
 * @returns {*}
 */
export const buyCoupons = (config) => { return http.post('vouchers/buyCoupons', config); }


/**
 * 清空优惠券
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   couponCategory: 'D_VALCARDUSEED(已使用)'/ 'D_VALCARDOVERD(已过期)'
    }
 * @returns {*}
 */
export const deleteCoupons = (config) => { return http.put('vouchers/deleteCoupons', config); }

/**
 * 获取结算可用优惠信息 (超鸿)
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
    }
 * @returns {*}
 */
export const getSettlementDiscount = (config) => { return http.get('vouchers/getSettlementDiscount', config); }

/**
 * 获取结算可用优惠信息 (季老师)
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   scopeId: 0,
   shopId: 店铺id,
   rtlOrdInterHdId: 订单中间表id
    }
 * @returns {*}
 */
export const getOrderCouponsList = (config) => { return http.get('vouchers/getOrderCouponsList', config); }

/**
 * 获取订单结算页的促销信息
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   "shopCode":"店铺编码",
   "rtlCartTempHdId":"购物车中间表key",
   "busContsCode":"业务触点"
    }
 * @returns {*}
 */
export const getOrderPromotion = (config) => { return http.get('vouchers/getOrderPromotion', config); }

/**
 * 获取商品促销活动
 * @param config
 * var param = {
   "usrId": "用户ID",
   "companyId": "公司ID",
   "shopCode": "店铺编码",
   "goodsCode": "商品编码",
   "sizeCode": "尺码编码",
   "colorCode": "颜色编码"
    }
 * @returns {*}
 */
export const getGoodsPromotion = (config) => { return http.get('vouchers/getGoodsPromotion', config); }

/**
 * 获取商品促销标识图标
 * @param config
 * var param = {
    companyId: "公司ID",
    shopCode: "店铺编码",
    partCode: "商品编码",
    ownCompanyId: 公司id
    }
 * @returns {*}
 */
export const getGoodspmFlag = (config) => { return http.get('vouchers/getGoodsPmFlag', config); }

/**
 * 获取促销赠品sku
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    busContsCode: "业务触点",
    goodsCode: "赠品编码",
    groupId: "赠品组主键"
    }
 * @returns {*}
 */
export const getPromotionGoodsSku = (config) => { return http.get('vouchers/getPromotionGoodsSku', config); }

/**
 * 获取促销赠品库存
 * @param config
 * var param = {
    giftId: 赠品行key
    goodsCode: 赠品编码
    skuCode :
    companyId: 公司ID
    }
 * @returns {*}
 */
export const promotionGoodsInventory = (config) => { return http.get('vouchers/getPromotionGoodsInventory', config); }

/**
 * 获取商品促销活动
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    rtlOrdInterHdId: 中间表id,
    cardIds: '卡券id',
    }
 * @returns {*}
 */
export const getOrderDiscount = (config) => { return http.post('vouchers/getOrderDiscountPoint', config); }

/**
 * 加入微信卡券获取参数
 * @param config
 * var param = {
      "card_id": "string",  卡券weixinId
      "code": "string",
      "isNeedOpenid": 0,
      "openId": "string",
      "wxuuid": "string"
    }
 * @returns {*}
 */
export const getWxconfig = (config) => { return http.post('vouchers/getWxConfig', config); }

/**
 * 用户登陆送券
 * @param config
 * var param = {
      "ownCompanyId":
      "companyId":
      "usrId": 用户id,
      "vipInfoHdId": vipInfoHdId
    }
 * @returns {*}
 */
export const sendCardCoupons = (config) => { return http.put('vouchers/sendCardCoupons', config); }

/**
 * 选券后获取可用券id列表 (季老师)
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   ownCompanyId "公司ID",
   rtlOrdHd 非必传
   cardIds ['123','456'] //全选中券id
   rtlOrdInterHdId: 订单中间表id
    }
 * @returns {*}
 */
export const getCanUseCouponsList = (config) => { return http.get('vouchers/getCanUseCouponsList',config); }