/*
 * createTime：2018/8/16
 * author：en.chen
 * description: 收藏模块用于处理前端请求的中间层接口
 */

class collectModel {

    //  获取收藏列表
    static async getCollectionListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-collects/clt-info/goods-list', params).then((res) => {
            return res
        });
    }

    // 加入收藏
    static async addCollectionValue(ctx, params) {
		let url = `/sp-goods/favorite?vipInfoHdId=${params.vipInfoHdId}&usrId=${!!params.usrId ? params.usrId : '' }&companyId=${params.companyId}`
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  取消收藏
    static async deleteCollectionValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-collects/clt-info', params).then((res) => {
            return res
        });
    }

}

module.exports = collectModel
