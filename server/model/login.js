/*
 * createTime：2018/7/11
 * author：en.chen
 * description:  登陆模块用于处理前端请求的中间层接口
 */

class loginModel {

    //  登陆步骤1： 获取用户授权的url
    static async getAuthorizeUrlValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.baseService + '/wechat/event/web/get-authorize-url/' + params.wxUUID, params).then((res) => {
            return res
        });
    }

    //  登陆步骤2： 通过code值获取用户信息
    static async getAuthorizeInfoValue(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.baseService + '/wechat/event/web/get-user-info/' + params.wxUUID, params).then((res) => {
            return res
        });
    }

    //  联合登陆： 通过传递步骤2中的openId获取用户信息
    static async getUesrLoginValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/system/usr-logins', params).then((res) => {
            return res
        })
    }

    // 获取单点登录需要的code
    static async getSingleCode(ctx, params, headers) {
        return await ctx.$get(ctx.baseUrl + '/uaa/sso/code', params, headers).then((res) => {
            return res
        })
    }
}

module.exports = loginModel
