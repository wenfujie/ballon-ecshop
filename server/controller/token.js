/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 获取token
 */

const token = require('../model/token');

class tokenController {
    // 通过客户端获取token
    static async cilentToken(ctx) {
        let res = await token.getCilentToken(ctx, ctx.params);
        ctx.body = res;
    }

    // 通过密码模式获取token
    static async pwdToken(ctx) {
        let res = await token.getPwdToken(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = tokenController;
