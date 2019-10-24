/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 会员模块-会员基础功能模块用于处理前端请求的中间层接口
 */

const userBase = require('../../model/user/userBase');

class userBaseController {
    // 校验手机号是否绑定
    static async checkPhone(ctx) {
        let res = await userBase.checkPhoneValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 校验微信（移动）端手机号是否绑定
    static async checkWxPhone (ctx, next) {
        let res = await userBase.checkWxPhoneValue(ctx,ctx.params)
        ctx.body = res.data
    }

    // 手机验证码先置code
    static async getCaptcha(ctx) {
        let res = await userBase.getCaptchaValue(ctx, ctx.params);
        /* let params = {
            telphone: ctx.params.mobile,
            context: res.data.mobileMsg,
            ownCompanyId: ctx.params.ownCompanyId,
            cmsMesstempHdId: res.data.cmsMesstempHdId,
            companyId: ctx.params.ownCompanyId
        }
        let resp = await userBase.sendCaptchaValue(ctx,params) */
        ctx.body = res.data;
    }

    // 手机验证码
    static async sendCaptcha(ctx) {
        let res = await userBase.sendCaptchaValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 绑定手机号
    static async bindMobile(ctx) {
        let res = await userBase.bindMobileValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 验证手机验证码
    static async checkCaptcha (ctx) {
        let res = await userBase.checkCaptchaValue(ctx,ctx.params);
        ctx.body = res
    }

    // 验证手机验证码
    static async changePhone (ctx) {
        let res = await userBase.changePhoneValue(ctx,ctx.params);
        ctx.body = res
    }

    // 获取会员整合用户列表
    static async memberMergeList(ctx) {
        let res = await userBase.memberMergeListValue(ctx, ctx.params);
        ctx.body = res.data
    }

    // 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
    static async memberMergeOperator(ctx) {
        let res = await userBase.memberMergeOperatorValue(ctx, ctx.params);
        ctx.body = res
    }

    //  获取会员卡列表
    static async memberCartList(ctx) {
        let res = await userBase.memberCartListValue(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = userBaseController;
