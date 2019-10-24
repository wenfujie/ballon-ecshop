/*
 * createTime：2018/8/21
 * author：en.chen
 * description: 会员模块-会员信息功能模块用于处理前端请求的中间层接口
 */
class userInfo {

    //  获取账户页面会员信息（会员整合新增vipInfoHdId、性能调优标识）
    static async getVipInfoValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/vip-info-hds/index-info/vip-id', params).then((res) => {
            return res
        });
    }

    //  获取个人资料(会员整合修改传参路径、性能调优标识)
    static async getUserInfoValue(ctx, params) {
        let url = '/vip-info-aggregates/vip-id/' + params.vipInfoHdId
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  修改个人资料
    static async updateUserInfoValue(ctx, params) {
        let url = '/vip-info-hds/usr-id/' + params.usrId + '?companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取会员自定义属性
    static async getMemberInfo(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-ctms/vip-customs', params).then((res) => {
            return res
        });
    }

    //  修改会员自定义属性
    static async updateMemberInfoValue(ctx, params) {
        let url = '/sp-ctms/vip-customs?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }
    //  保存我的足迹（会员整合新增vipInfoHdId、性能调优标识）
    static async saveUserFootprintValue(ctx, params) {
        let url = '/footmark-hd-aggregates/insert-vip-info?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取我的足迹
    static async getUserFootprintValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/footmark-hd-aggregates/footmark-list', params).then((res) => {
            return res
        });
    }

    //  删除我的足迹
    static async deleteUserFootprintValue(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + '/footmark-hd-aggregates/delete?companyId=' + params.companyId, params.ids).then((res) => {
            return res
        });
    }
    //  获取消费记录
    static async getPurchaseHistoryValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/card-info-dt-costs/consume-list/usr-id', params).then((res) => {
            return res
        });
    }

    //  获取会员推荐尺码
    static async getMemberRcmdValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ctms/recommend-size', params).then((res) => {
            return res
        });
    }

    //  保存会员推荐尺码
    static async saveMemberRcmdValue(ctx, params) {
        let url = '/sp-ctms/recommend-size?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spCommendSizeDto).then((res) => {
            return res
        });
    }
}

module.exports = userInfo