/*
* createTime：2018/10/16
* author：en.chen
 * description: 会员模块-发票功能模块用于处理前端请求的中间层接口
 */
class invoice {

    //  提交发票
    static async putInvoice(ctx, params) {
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.invoice + '/sp-save-ord-invoices', params).then((res) => {
            return res
        });
    }

    //  获取发票字典表信息（发票类型）
    static async getInvoiceInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/dict-simples/up-dict-code/' + params.type, params).then((res) => {
            return res
        });
    }

    //  获取发票设置（是否可以开发票）
    static async canSetInvoice(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/sp-ord-invoices', params).then((res) => {
            return res
        });
    }

    //  获取发票详情
    static async getDetail(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ord-invoices', params).then((res) => {
            return res
        });
    }

    // 取消发票
    static async cancelInvoice (ctx, params) {
        let url = '/rtl-ord-dt-share-aggregates/cancel-ord-invoice?billCode=' + params.billCode + '&companyId=' + params.companyId + '&usrId=' + params.usrId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }
}

module.exports = invoice