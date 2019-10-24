/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 中间层提供给前端的基础模块api
 */

const base = require('../model/base');

class baseController {

    // 获取常数值
    static async getContent(ctx) {
        let res = await base.getContent(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取门店列表
    static async getShopList(ctx) {
        let res = await base.getShopList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取地区信息
    static async getDestnation(ctx) {
        let res = await base.getDestnation(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取购物平台设置
    static async getPlamset(ctx) {
        let res = await base.getPlamset(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 二级域名解析
    static async getCompanyQuery(ctx) {
        let res = await base.getCompanyQuery(ctx, ctx.params);
        ctx.body = res.data;
    }

    static async getExpressCompanies(ctx) {
        let res = await base.getExpressCompanies(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取公司信息
    static async getCompanyById(ctx) {
        let res = await base.getCompanyById(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 通过AppId获取基础参数 通过网址域名获取基础参数
    static async getBaseParams(ctx) {
        let res = await base.getBaseParams(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = baseController;
