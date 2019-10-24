/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 会员模块-会员基本功能api
 */

const userBenefit = require('../../model/user/userBenefit');

class userBenefitController {

    // 获取会员整合列表
    static async memberCardList(ctx, next) {
        let res = await userBenefit.getMemCardListValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取会籍会员列表
    static async cardLevelList(ctx, next) {
        let res = await userBenefit.getCardListValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取会籍会员详情
    static async cardLevelDetail(ctx, next) {
        let res = await userBenefit.getCardDetailValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取积分余额
    static async pointValue(ctx, next) {
        let res = await userBenefit.getPointValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取我的会籍会员
    static async getVipcardinfo(ctx, next) {
        let res = await userBenefit.getVipcardinfoValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取会员卡促销
    static async getCardVouchers(ctx, next) {
        let res = await userBenefit.getCardVouchersValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 购买会籍会员
    static async buyCard(ctx, next) {
        let res = await userBenefit.buyCard(ctx, ctx.params)
        ctx.body = res
    }

    //  获取会员推荐尺码
    static async getMinIntegral(ctx, next) {
        let res = await userBenefit.getMinIntegralValue(ctx, ctx.params)
        ctx.body = res.data
    }
}

module.exports = userBenefitController;
