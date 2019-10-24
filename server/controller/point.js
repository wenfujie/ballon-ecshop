/*
 * createTime: 2019/7/9 10:16
 * author: en.chen
 * description: 积分模块
 */

const point = require('../model/point');

class pointController {

    // 获取积分详情
    static async getDetail(ctx) {
        let res = await point.getDetail(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取可用积分、冻结积分
    static async getPointTotal(ctx) {
        let res = await point.getPointTotal(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取积分明细列表
    static async getDetailList(ctx) {
        let res = await point.getDetailList(ctx, ctx.params);
        ctx.body = res.data
    }

    // 获取用户是否可使用积分flag
    static async getUsePointFlag(ctx) {
        let res = await point.getUsePointFlagValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 根据价格计算赠送积分
    static async getComputePointer(ctx) {
        let res = await point.getComputePointerValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 查询积分券
    static async getCardData(ctx) {
        let res = await point.getCardData(ctx, ctx.params);
        ctx.body = res.data
    }

    // 兑换积分
    static async sellCardData(ctx) {
        let res = await point.sellCardData(ctx, ctx.params);
        ctx.body = res
    }
}

module.exports = pointController;
