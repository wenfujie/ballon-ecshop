/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 购物车模块用于处理前端请求的中间层接口
 */

const shoppingCart = require('../model/shoppingCart');

class shoppingCartController {

    // 批量转移本地购物车
    static async cartTransfer(ctx) {
        let res = await shoppingCart.cartTransfer(ctx, ctx.params);
        ctx.body = res;
    }

    // 删除购物车
    static async deleteCart(ctx) {
        let res = await shoppingCart.deleteCart(ctx, ctx.params);
        ctx.body = res;
    }

    // 保存购物车
    static async saveCart(ctx) {
        let res = await shoppingCart.saveCart(ctx, ctx.params);
        ctx.body = res;
    }

    // 保存购物车数量
    static async saveCartNum (ctx,next) {
        let res = await shoppingCart.saveCartNum(ctx,ctx.params);
        ctx.body = res;
    }

    // 获取购物车列表
    static async getCartList(ctx) {
        let res = await shoppingCart.getCartList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取购物车数量
    static async getCartCount(ctx) {
        let res = await shoppingCart.getCartCount(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 判断商品及SKU是否上下架
    static async isGoodsAndSkuShevel(ctx) {
        let res = await shoppingCart.isGoodsAndSkuShevel(ctx, ctx.params);
        ctx.body = res;
    }

    //获取优惠价
    static async getShopVouchers (ctx) {
        let res = await shoppingCart.getShopVouchers(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = shoppingCartController;
