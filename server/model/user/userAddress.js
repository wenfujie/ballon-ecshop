/*
 * createTime：2018/7/25
 * author：en.chen
 * description: 会员模块-地址增删改查功能api
 */

class userAddressModel {

    //  获取用户地址列表
    static async getAddrListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss', params).then((res) => {
            return res
        });
    }

    //  新增/修改用户地址信息
    static async changeAddrValue(ctx, params) {
        let url = `/vip-info-dt-addss/dest-code?companyId=${params.companyId}&usrId=${params.usrId}&vipInfoHdId=${params.vipInfoHdId}&destCode=${params.destCode}`
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  删除用户地址
    static async deleteAddrListValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss', params).then((res) => {
            return res
        });
    }

    //  获取地址详情
    static async addressDetailValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss/receive-adds-info/id', params).then((res) => {
            return res
        });
    }


}

module.exports = userAddressModel
