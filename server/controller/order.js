
/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 订单模块功能api
 */

const order = require('../model/order');
const custom = require("../model/custom");
const volume = require("../model/volume");
const thirdPartyModel = require("../model/thirdParty");
const check = require("../util/check");

// 根据订单生成包裹
function createTabs(packages) {
    let length = packages.length;
    let packageTabs = [];
    for (let i = 0; i < length; i++) {
        let obj = {
            name: ""
        };
        obj.name = "包裹 " + (i + 1);
        obj.data = packages[i];
        packageTabs.push(obj);
    }
    return packageTabs;
}

class orderController {
    // 获取运费
    static async getFreight(ctx, next) {
        let res = await order.getFreight(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取订单优惠信息
    static async getOrderDiscount(ctx, next) {
        let res = await order.getOrderDiscount(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取订单列表
    static async getWxOrderList(ctx, next) {
        let params = Object.assign(ctx.params, {
            ctmUsrId: ctx.params.usrId
        })
        let res = await order.getOrderList(ctx, params);
        ctx.body = {
            status: res.status,
            statusText: res.statusText,
            data: res.data
        };
    }

    // 获取订单详情
    static async getOrderDetail(ctx, next) {

        let ordInfo = await order.getOrderDiscount(ctx, ctx.params);
        let res = await order.getOrderDetail(ctx, ctx.params);
        let result = Object.assign(res.data, ordInfo.data);
        // console.log("res", result);
        ctx.body = {
            status: res.status,
            statusText: res.statusText,
            data: result
        };
    }

    // 获取订单详情
    static async getWxOrderDetailInfo(ctx, next) {
        let mergeRes = await ctx.$requestAll([
            order.getOrderDetail(ctx, ctx.params),
            order.getBillList(ctx, ctx.params)
        ]);
        let ordDetailInfo = mergeRes[0];
        let billResult = mergeRes[1];
        let packagesList = [];
        if (!check.isEmpty(billResult.data)) {
            packagesList = billResult.data;
        }
        let packages = createTabs(packagesList);
        if (!check.isEmpty(packagesList)) {
            ordDetailInfo.data.packages = packages
        }
        ordDetailInfo.data.packages = packages
        ctx.body = {
            data: ordDetailInfo.data,
            status: 200
        }
    }

    // 获取商品定制清单
    static async getCustomList(ctx, next) {
        // 请求参数
        let result = await custom.getCustomList(ctx, ctx.params);
        ctx.body = {
            data: result.data
        }
    }
    // 获取已量体数据
    static async getVolumedList(ctx, next) {
        let result = await volume.getHistoryMeasureData(ctx, ctx.params);
        ctx.body = {
            data: result
        }
    }
    // 确认收货前判断该订单是否存在售后申请单子
    /******
     * 0:没有售后单
     * 1:有未完成的售后申请单
     * 2:有待审核的售后申请单
     * *** */
    static async beforeSignUpWx(ctx, next) {
        let res = await order.beforeSignUp(ctx, ctx.params).catch(() => {
            return 500;
        });
        if (!res) res = 0;
        ctx.body = res;
    }
    // 确认收货
    static async confirmRcievedWx(ctx, next) {
        let res = await order.confirmRcieved(ctx, ctx.params);
        if (res === 1) res = 200;
        ctx.body = {
            status: res
        };
    }
    // 取消订单
    static async cancelOrderWx(ctx, next) {
        let res = await order.cancelOrder(ctx, ctx.params);
        if (res === 1) res = 200;
        ctx.body = {
            status: res
        };
    }

    // 订单分享
    static async getWxSignature(ctx, next) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            wxUUID: ctx.params.wxUUID,
            unAuthorizedUrl: ctx.params.unAuthorizedUrl
        };
        let result = await thirdPartyModel.getWxSignature(ctx, params);
        // console.error('result', result)
        ctx.body = result;
    }

    // 保存更新结算
    static async saveCartTemp(ctx, next) {
        let res = await order.saveCartTemp(ctx, ctx.params)
        ctx.body = res
    }

    // 获取结算页信息
    static async getOrderSettlementInfo(ctx, next) {
        let res = await order.getOrderSettlementInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取配送方式
    static async getShipType(ctx, next) {
        let res = await order.getShipType(ctx, ctx.params)
        ctx.body = res.data
    }

    // 提交订单
    static async saveOrderOld(ctx, next) {
        let res = await order.saveOrderOld(ctx, ctx.params)
        ctx.body = res
    }

    // 订单分享信息查询
    static async getShareItem(ctx, next) {
        let res = await order.getShareItem(ctx, ctx.params)
        ctx.body = res.data
    }

    // 订单分享信息更新（比pc多个vipInfoHdId）
    static async saveShareItemWx(ctx, next) {
        let res = await order.saveShareItemWx(ctx, ctx.params)
        ctx.body = res
    }

    // 提交订单评价
    static async ordCommentWx(ctx, next) {
        let res = await order.ordCommentWx(ctx, ctx.params)
        ctx.body = res
    }
    // 获取待评价的商品列表
    static async getOrderEvaluateList(ctx) {
        let res = await order.getOrderEvaluateList(ctx, ctx.params);
        ctx.body = res.data;
    }
    // 提交订单追评
    static async ordAddComment(ctx) {
        let res = await order.ordAddComment(ctx, ctx.params);
        ctx.body = res;
    }

    // 订单分享信息保存
    static async saveShareInfo(ctx, next) {
        let res = await order.saveShareInfo(ctx, ctx.params)
        ctx.body = res
    }

    // 订单结算0元锁库存
    static async lockZero(ctx, next) {
        let res = await order.lockZero(ctx, ctx.params)
        ctx.body = res
    }

    // 根据订单编码获取售后单状态
    static async getOrdReapplyStatus(ctx, next) {
        let res = await order.getOrdReapplyStatus(ctx, ctx.params)
        ctx.body = res
    }

    //  订单促销优惠计算
    static async orderPreferCal(ctx, params) {
        let res = await order.orderPreferCal(ctx, ctx.params);
        ctx.body = {
            status: res.status,
            data: res.data || ''
        };
    }

     // 不带参清除全部订单详情/列表缓存
     static async clearAllCache(ctx) {
        let res = await order.clearAllCache(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = orderController;
