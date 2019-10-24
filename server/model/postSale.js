/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 14:57:51
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-07-24 13:38:26
 * @Description: 售后申请
 */
class postSaleModel {
    // 获取售后申请单列表
    static async getList(ctx, params) {
        let url = "/rtl-ord-reapply-hd-aggregates";
        return ctx.$get(
            ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url,
            params
        );
    }
    // 取消售后申请
    static async cancelApply(ctx, params) {
        let url = `/rtl-ord-reapply-hds/cancel/${
            params.reApplyCode
            }?companyId=${params.companyId}&usrId=${params.usrId}&vipInfoHdId=${params.vipInfoHdId}`;
        return ctx.$put(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }
    // 提交售后申请
    static async submitApply(ctx, params) {
        let url =
            "/rtl-ord-reapply-hds/submit-after-sale-application?companyId=" +
            params.companyId +
            "&usrId=" +
            params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx
            .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(
                res => {
                    return res;
                },
                err => {
                    return err;
                }
            );
    }
    // 获取售后原因编码
    static async getReasonCodes(ctx, params) {
        let url = "/rtl-returnsreasons/code";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }
    // 获取允许的售后方式
    static async getPostSaleWay(ctx, params) {
        let url = "/sp-return-ways";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }

    // 获取售后申请单详情
    static async getPostSaleDetail(ctx, params) {
        let url = "/sp-reapply-infos";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }
    // 保存售后物流
    static async savePostSaleLogis(ctx, params) {
        let url =
            "/rtl-service-hds/after/sail-logistics?usrId=" +
            params.usrId +
            "&companyId=" +
            params.companyId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx.$post(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }

    // 获取可售后数量
    static async getApplyNum(ctx, params) {
        let url = "/rtl-ord-reapply-hd-aggregates/can-apply";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }

    // 获取换货数量
    static async getGoodsForChange(ctx, params) {
        let url = "/sp-part-goodss/exchange-goods-info";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params
        );
    }
}
module.exports = postSaleModel;
