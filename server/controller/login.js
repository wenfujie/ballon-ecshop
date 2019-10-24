/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 登陆模块用于处理前端请求的中间层接口
 */

const login = require('../model/login');

class loginController {

    // 微信获取用户授权地址
    static async getAuthorizeUrl(ctx) {
        let res = await login.getAuthorizeUrlValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 微信登陆后获取用户信息
    static async getAuthorizeInfo(ctx) {
        let res = await login.getAuthorizeInfoValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取乔顿商城用户信息
    static async userLoginService(ctx) {
        let res = await login.getUesrLoginValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取单点登录需要的code（搭配组件）
    static async getSingleCode(ctx) {
        let res = await login.getSingleCode(ctx, ctx.params, ctx.headers);
        ctx.body = res.data;
    }

}

module.exports = loginController;
