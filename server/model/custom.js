/*
 * @Author: yongtian.hong
 * @Date: 2018-09-19 14:29:24
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 10:50:10
 * @Description: 定制清单
 */

class custom {
  static async getCustomList(ctx, params) {
    let url = "/sp-sales/made-list";
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params);
  }
}
module.exports = custom;
