/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 中间层提供给前端的收藏模块api
 */

const collect = require('../model/collect');

class collectController {

    // 收藏模块查询收藏商品列表
    static async getCollectionList(ctx) {
        let res = await collect.getCollectionListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 收藏模块加入收藏功能
    static async addCollection(ctx) {
        let res = await collect.addCollectionValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 收藏模块取消收藏功能
    static async deleteCollection(ctx) {
        let res = await collect.deleteCollectionValue(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = collectController;
