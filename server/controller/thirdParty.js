/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 13:15:13
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 13:22:01
 * @Description: 第三方服务
 */

const thirdParty = require('../model/thirdParty');

class thirdPartyController {

    // 第三方服务
    static async getLogis(ctx) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            companyId: ctx.params.companyId,
            expressCode: ctx.params.expressCode,
            logisticCode: ctx.params.logisticCode
        };
        let logis = await thirdParty.getLogis(ctx, params);
        ctx.body = logis
    }
}

module.exports = thirdPartyController;
