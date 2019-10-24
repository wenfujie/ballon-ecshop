/*
 * createTime：2018/7/16
 * author：en.chen
 * description: 购物车模块用于处理前端请求的中间层接口
 */

class shoppingCartModel {
    //  批量转移本地购物车
    static async cartTransfer(ctx, params) {
        let url = '/rtl-cart-hd-aggregates/transfer?companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  删除购物车
    static async deleteCart(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-cart-hds/usr-id', params).then((res) => {
            return res
        });
    }

    //  保存购物车列表
    static async saveCart(ctx, params) {
		let url = '/rtl-cart-hd-aggregates?companyId=' + params.companyId + '&flag=' + params.flag
		return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params ).then((res) => {
			return res
		});
    }

    //  保存购物车数量
    static async saveCartNum(ctx, params) {
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart +
            '/sp-goods/modify-cart-count/' + params.cartId, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  查询购物车列表
    static async getCartList(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/rtl-cart-hd-aggregates', params).then((res) => {
            return res
        });
    }

    //  查询购物车数量
    static async getCartCount(ctx, params) {
        let url = '/rtl-cart-hds/count/' + params.vipInfoHdId
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  判断商品商品及SKU是否上架
    static async isGoodsAndSkuShevel(ctx, params) {
        let url = '/sp-part-goodss/batch-get-sell-flags'
        params.spPartGoodsSearchDtoList[0].ownCompanyId = params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url + '?companyId=' + params.companyId, params.spPartGoodsSearchDtoList).then((res) => {
            return res
        });
    }

    //获取购物车优惠价/促销价
    static async getShopVouchers(ctx, params) {
        let url = '/online-calculate/dis-amount?companyId=' + params.companyId + '&usrId=' + params.usrId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.promotion + url, params,ctx.headers).then((res) => {
            return res
        });
    }
}

module.exports = shoppingCartModel
