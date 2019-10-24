/*
 * createTime：2018/8/29
 * author：en.chen
 * description: 会员模块-会籍会员功能模块用于处理前端请求的中间层接口
 */

class userBenefitModel {
    // 获取会员卡列表（新增）
    static async getMemCardListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/card-info-hds/vip-cards/' + params.vipInfoHdId + '?shopCode=' + params.shopCode + '&companyId=' + params.companyId, ctx.headers).then((res) => {
            return res
        });
    }
    //  获取会籍会员列表
    static async getCardListValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-levels/card', params).then((res) => {
            return res
        });
    }

    //  获取会籍会员详情
    static async getCardDetailValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-levels/card-code', params).then((res) => {
            return res
        });
    }

    //  获取积分余额
    static async getPointValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-funds/point-fund', params).then((res) => {
            return res
        });
    }

    //  获取我的会籍会员
    static async getVipcardinfoValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-info-aggregates/getMyVipInfo', params).then((res) => {
            return res
        });
    }

    //  获取会员卡促销
    static async getCardVouchersValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-info-aggregates/card-vouchers', params).then((res) => {
            return res
        });
    }

    //  购买会籍会员卡
    static async buyCard(ctx, params) {
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/buy-card-level', params).then((res) => {
            return res
        });
    }

    //  获取会员用户对应的等级设置的最低可用积分
    static async getMinIntegralValue(ctx, params) {
        let url = '/vip-info-dtt-poins/min-integral-info'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

}

module.exports = userBenefitModel
