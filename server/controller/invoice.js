/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 会员模块-发票功能模块用于处理前端请求的中间层接口
 */

const invoice = require('../model/invoice');

class invoiceController {

    // 提交发票
    static async putInvoice(ctx) {
        let res = await invoice.putInvoice(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取发票类型
    static async getInvoiceInfo(ctx) {
        let res = await invoice.getInvoiceInfo(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取发票设置
    static async canSetInvoice(ctx) {
        let res = await invoice.canSetInvoice(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取发票详情
    static async getDetail(ctx) {
        let res = await invoice.getDetail(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 取消发票
    static async cancelInvoice(ctx) {
        let res = await invoice.cancelInvoice(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = invoiceController;
