
/*
 * createTime：2018/9/5
 * author：en.chen
 * description: 订单模块用于处理前端请求的中间层接口
 */

class orderModel {

    //  获取运费
    static async getFreight(ctx, params) {
        let url = '/rtl-ord-inter-hds/freight/' + params.id
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  获取订单优惠信息
    static async getOrderDiscount(ctx, params) {
        let url = '/rtl-ord-hds/discount/' + params.billCode;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  获取订单列表
    static async getOrderList(ctx, params) {
        let url = '/sp-sales/ord-list'
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //获取订单详情
    static async getOrderDetail(ctx, params) {
        let url = '/sp-sales/ord-text'
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //配货单列表
    static async getBillList(ctx, params) {
        let url = '/rtl-shipment-hds/list/' + params.billCode;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //确认收货前判断该订单是否存在售后申请单子
    static async beforeSignUp(ctx, params) {
        let url = "/rtl-ord-hds/firm-receive-pre/bill-codes";
        return ctx
            .$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }

    //确认收货
    static async confirmRcieved(ctx, params) {
        let url = '/rtl-ord-hds/firm-receive/bill-codes'
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    // 取消订单
    static async cancelOrder(ctx, params) {
        let url = '/rtl-ord-hds/cancel-del-recycle/bill-codes?companyId=' + params.companyId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  保存更新结算
    static async saveCartTemp(ctx, params) {
        let url = '/sp-sales/cart-temp?companyId=' + params.companyId + '&usrId=' + params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  获取订单结算页信息
    static async getOrderSettlementInfo(ctx, params) {
        let url = '/sp-sales/cart-temp'
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  获取配送方式
    static async getShipType(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-ship-mgrs', params).then((res) => {
            return res
        });
    }

    //  提交订单
    static async saveOrderOld(ctx, params) {
        let url = '/rtl-ord-hd-aggregates/order-readirect-save?companyId=' + params.companyId + '&usrId=' + params.usrId
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            // return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  订单分享信息查询
    static async getShareItem(ctx, params) {
        let url = '/rtl-ord-dt-share-aggregates/get-share-statitem'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  订单分享信息更新（比pc多个vipInfoHdId）
    static async saveShareItemWx(ctx, params) {
        let url = '/rtl-ord-dt-share-aggregates/save-share-statitem?billCode=' + params.billCode + "&companyId=" + params.companyId + "&usrId=" + params.usrId + "&vipInfoHdId=" + params.vipInfoHdId
        params.model.ownCompanyId = params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.model).then((res) => {
            return res
        });
    }

    //  提交订单评价
    static async ordCommentWx(ctx, params) {
        let url = '/rtl-ord-hds/ord-comment/usr-id?companyId=' + params.companyId + '&usrId=' + params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        params.model.ownCompanyId = params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.model).then((res) => {
            // return ctx.$post('http://1.1.6.103:8806/rtl-ord-hds/ord-comment/usr-id?companyId='+params.companyId+'&usrId='+params.usrId, params.model).then((res) => {
            return res
        });
    }
    // 获取待评价的商品列表
    static async getOrderEvaluateList(ctx, params) {
        let url = "/rtl-shipment-hds/evaluate/part-list/" + params.billCode;
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers).then((res) => {
            return res;
        });
    }
    // 提交订单追评
    static async ordAddComment(ctx, params) {
        let url = '/sp-comment-aggregates/save-my-addcomment?companyId=' + params.companyId + '&usrId=' + params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spCommentDtSaveDtos, ctx.headers).then((res) => {
            return res;
        });
    }

    //  订单分享信息保存
    static async saveShareInfo(ctx, params) {
        let url = '/rtl-ord-dt-share-aggregates/save-share-info'
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  订单结算0元锁库存
    static async lockZero(ctx, params) {
        let url = '/lock-or-unlock-inv-aggregates/oper-order-inv-by-billcode?operType=' + params.operType + '&billCode=' + params.billCode + '&companyId=' + params.companyId + '&usrId=' + params.usrId + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  根据订单编码获取售后单状态
    static async getOrdReapplyStatus(ctx, params) {
        let url = '/sp-sales/get-ord-reapply-status?usrId=' + params.usrId + '&companyId=' + params.companyId + '&billCode=' + params.billCode + "&vipInfoHdId=" + params.vipInfoHdId;
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  订单促销优惠计算
    static async orderPreferCal(ctx, params) {
        let url = `/online-calculate/${params.ordId}`;
        delete params.ordId;
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + ctx.optimizeFlag + url, params).then(res => {
            return res;
        });
    }

    // 不带参清除全部订单详情/列表缓存
    static async clearAllCache(ctx, params) {
        let url = "/sp-sales/clear-ord-cache-all";
        return ctx.$get(
            ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
            params,
            ctx.header
        );
    }
}

module.exports = orderModel
