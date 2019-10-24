/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 会员模块-地址增删改查功能api
 */

const userAddress = require('../../model/user/userAddress');

class userAddressController {
    // 获取地址列表
    static async getAddrList(ctx) {
        let res = await userAddress.getAddrListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 新增/修改用户地址
    static async changeAddrInfo(ctx) {
        let res = await userAddress.changeAddrValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 删除地址列表
    static async deleteAddrList(ctx) {
        let res = await userAddress.deleteAddrListValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取地址详情
    static async addrDetail(ctx) {
        let res = await userAddress.addressDetailValue(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = userAddressController;
