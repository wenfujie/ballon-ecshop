/*
* createTime：2018/11/6
* author：en.chen
* description: 积分模块中间层接口
*/
class point {
    //  查询积分券
    static async getCardData(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/swop-dt-card-aggregates', params).then((res) => {
            return res
        }, (err) => {});
    }

    //兑换积分
    static async sellCardData(ctx, params) {
        let url = '/swop-dt-card-aggregates/'
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url + params.swopCtCardId, params).then((res) => {
            return res
        }, (err) => {});
    }


    //  获取积分详情(性能调优标识)
    static async getDetail(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag +  '/vip-info-dtt-poins/list/usr-id', params).then((res) => {
            return res
        });
    }

    // 获取可用积分、冻结积分
    static async getPointTotal(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dtt-poins/total/' + params.vipInfoHdId, params).then((res) => {
            return res
        });
    }

    // 获取积分明细列表
    static async getDetailList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dtt-poins/list/vip-id/', params).then((res) => {
            return res
        });
    }

    //  用户是否可使用积分flag
    static async getUsePointFlagValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService +  '/card-info-dtt-poins/point-flag', params).then((res) => {
            return res
        });
    }

    //  用户是否可使用积分flag
    static async getComputePointerValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService +  '/card-info-dt-poins/points/price', params).then((res) => {
            return res
        });
    }
}

module.exports = point
