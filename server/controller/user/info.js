/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 会员模块-会员基本功能api
 */

const userInfo = require('../../model/user/userInfo');

class userInfoController {

    // 获取首页会员信息
    static async vipInfo(ctx, next) {
        let res = await userInfo.getVipInfoValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取用户信息
    static async userInfo(ctx, next) {
        let res = await userInfo.getUserInfoValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  修改用户信息
    static async updateInfo(ctx, next) {
        let res = await userInfo.updateUserInfoValue(ctx, ctx.params)
        ctx.body = res
    }

    //  获取会员自定义信息
    static async memberInfo(ctx, next) {
        let res = await userInfo.getMemberInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    //  修改会员自定义信息
    static async updateMemberInfo(ctx, next) {
        let res = await userInfo.updateMemberInfoValue(ctx, ctx.params)
        ctx.body = res
    }

    //  保存我的足迹
    static async saveFootprint(ctx, next) {
        let res = await userInfo.saveUserFootprintValue(ctx, ctx.params)
        ctx.body = res
    }

    //  获取我的足迹
    static async userFootprint(ctx, next) {
        let res = await userInfo.getUserFootprintValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  删除我的足迹
    static async deleteFootprint(ctx, next) {
        let res = await userInfo.deleteUserFootprintValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取消费记录
    static async purchaseHistory(ctx, next) {
        let res = await userInfo.getPurchaseHistoryValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取会员推荐尺码
    static async memberRcmd(ctx, next) {
        let res = await userInfo.getMemberRcmdValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  保存会员推荐尺码
    static async savememberRcmd(ctx, next) {
        let res = await userInfo.saveMemberRcmdValue(ctx, ctx.params)
        ctx.body = res
    }

    // 获取用户关联账户列表()
    static async getRelationAccountList(ctx, next) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            companyId: ctx.params.companyId,
            vipId: ctx.params.vipInfoHdId
        }
        let res = await userInfo.getRelationAccountList(ctx, params)
        ctx.body = res.data
    }
}

module.exports = userInfoController;
