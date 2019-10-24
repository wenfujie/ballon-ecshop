/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 中间层提供给前端的内容管理模块api
 */

const cms = require('../model/cms');

class cmsController {
    // 获取模板
    static async getTemplate(ctx) {
        let params = ctx.params
        let res = { data: null }
        if (!params.usrId) {  // 有用户信息获取千人千面模板
            res = await cms.getUsrCmsTemplate(ctx, ctx.params);
        } else {  // 获取默认模板
            res = await cms.getCmsTemplateValue(ctx, ctx.params);
        }
        ctx.body = res.data;
    }
    // 内容管理获取默认模板
    static async getCmsTemplate(ctx) {
        let res = await cms.getCmsTemplateValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 内容管理获取千人千面模板
    static async getUsrCmsTemplate(ctx) {
        let res = await cms.getUsrCmsTemplate(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 内容管理获取模板内容v2
    static async getCmsInfoV2(ctx) {
        let res = await cms.getCmsInfoV2Value(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 内容管理获取面包屑
    static async getCrumbs(ctx) {
        let res = await cms.getCrumbsValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 内容管理获取面包屑
    static async getCrumbsDetail(ctx) {
        let res = await cms.getCrumbsDetailValue(ctx, ctx.params);
        ctx.body = res.data;
    }
    static async getCrumbsGoodsIds(ctx) {
        let res = await cms.getCrumbsGoodsIds(ctx, ctx.params);
        ctx.body = res;
    }

    // 内容管理获取模板导航内容
    static async getNavigation(ctx) {
        let res = await cms.getNavigationValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取模板页面模块元素商品列表
    static async getWebItemGoods(ctx) {
        let res = await cms.getGoodsListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取现购列表页面模块元素商品列表
    static async getChoosebuyGoods(ctx) {
        let res = await cms.getGoodsItemListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取wxUnionId、firameUrl、companyId
    static async getProperties(ctx) {
        let res = await cms.getProperties(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = cmsController;
