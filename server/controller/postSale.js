/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 14:57:29
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-07-29 16:50:09
 * @Description: 售后申请
 */

const postSale = require('../model/postSale');
const base = require("../model/base");
const pingyin = require("../util/pinyin")

class postSaleController {
    // 获取申请单列表
    static async getList(ctx) {
        let res = await postSale.getList(ctx, ctx.params);
        ctx.body = {
            data: res.data,
            statusCode: 200
        };
    }

    // 取消售后申请单
    static async cancelApply(ctx) {
        let params = {
            usrId: ctx.params.usrId,
            reApplyCode: ctx.params.reApplyCode,
            companyId: ctx.params.companyId,
            ownCompanyId: ctx.params.ownCompanyId
        };
        let res = await postSale.cancelApply(ctx, params);
        if (res === 1) res = 200;
        ctx.body = {
            statusCode: res
        };
    }

    // 提交售后申请
    static async submitApplyWx(ctx) {
        let res = await postSale.submitApply(ctx, ctx.params);
        if (res.status === 500) {
            res.code = 500;
        } else if (res.msg) {
            res.code = 200;
            res.data = res.msg
        }
        ctx.body = {
            status: res.code,
            data: res.data
        };
    }

    // 获取售后原因编码
    static async getReasonCodes(ctx) {
        let res = await postSale.getReasonCodes(ctx, ctx.params);
        ctx.body = {
            data: res.data,
            status: res.status
        }
    }

    // 获取售后类型
    static async getPostSaleWay(ctx) {
        let res = await postSale.getPostSaleWay(ctx, ctx.params);
        ctx.body = {
            status: res.status,
            data: res.data
        };
    }

    // 获取可申请售后数量
    static async getApplyNum(ctx) {
        let params = Object.assign(ctx.params, {
            ownCompanyId: ctx.params.companyId
        })
        let res = await postSale.getApplyNum(ctx, params);
        ctx.body = {
            applyNum: res.data,
            status: res.status
        }
    }

    // 获取售后申请单详情
    static async getPostSaleDetail(ctx) {
        let res = await postSale.getPostSaleDetail(ctx, ctx.params);
        ctx.body = {
            data: res.data
        }
    }

    // 获取快递公司列表
    static async getExpressCompanies(ctx) {
        let result = await base.getExpressCompanies(ctx, ctx.params)
        ctx.body = {
            data: result.data
        }
    }

    // 保存售后物流
    static async savePostSaleLogisWx(ctx) {
        let res = await postSale.savePostSaleLogis(ctx, ctx.params);
        ctx.body = res
    }

    // 获取可换货商品
    static async getGoodsForChange(ctx) {
        let res = await postSale.getGoodsForChange(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = postSaleController;
