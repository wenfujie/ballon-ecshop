/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 10:49:46
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 14:00:02
 * @Description: 第三方服务接口
 */
class thirdPartyModel {
  // 获取物流
  static async getLogis(ctx, params) {
    let url = "/expresss?companyId=" + params.companyId;
    return ctx.$post(
      ctx.baseUrl + ctx.serverPortUrl.thirdPartyService + url,
      params
    );
  }
  //获取微信授权
  static async getWxSignature(ctx, params) {
    let url = "/wechat/event/web/get-signature/" + params.wxUUID + "?unAuthorizedUrl=" + params.unAuthorizedUrl;
    return ctx.$post(ctx.baseUrl + url, params);
  }
}
module.exports = thirdPartyModel;