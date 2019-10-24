/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 购物车模块用于处理前端请求的中间层接口
 */

const shoppingCart = require('../controller/shoppingCart');

module.exports = {
    "GET/getCartCount": shoppingCart.getCartCount,  // 获取购物车数量
    "GET/getCartList": shoppingCart.getCartList,  // 获取购物车列表
    'POST/getShopVouchers': shoppingCart.getShopVouchers,//获取优惠价
    "POST/saveCart": shoppingCart.saveCart,  // 保存购物车
    'POST/isGoodsAndSkuShevel': shoppingCart.isGoodsAndSkuShevel,// 判断商品及SKU是否上下架  ------移动端才有
    "PUT/saveCartNum": shoppingCart.saveCartNum,// 保存购物车数量
    "PUT/cartTransfer": shoppingCart.cartTransfer,  // 批量转移本地购物车 ------移动端才有
    "DELETE/deleteCart": shoppingCart.deleteCart,  // 删除购物车
};
