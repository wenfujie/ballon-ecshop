/*
 * createTime：2018/7/14
 * author：en.chen
 * description: 商品模块用于处理前端请求的中间层接口
 */

class goodsModel {

    //  商品墙/商品列表
    /*    static async getGoodsListValue(ctx,params) {
            return ctx.$get(ctx.baseUrl,'/iss/sal/sp-part-goodss',params).then((res) =>{
                return res
            });
        }*/

    //  商品分类等级查询
    static async getGoodsLayerClass(ctx, params) {
        let url = `/cms-busconcla-hds/layer`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params).then((res) => {
            return res
        });
    }

    static async getGoodsList(ctx, params) {
        params.orderFlags = JSON.parse(params.orderFlags)
        if (!params.platformCode) params.platformCode = ""
        let url = '/sp-goods-list/combgood_goods2?busContsCode=' + params.busContsCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId + '&platformCode=' + params.platformCode
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  热门商品列表
    static async getHotGoods(ctx, params) {
        let url = '/iss/bas/cms-searchword-hds?companyId=' + params.companyId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.baseService + url, params).then((res) => {
            return res
        });
    }

    //  查询平台商品的推荐商品列表
    static async getGoodsRecommend(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods/goods-recommend', params).then((res) => {
            return res
        });
    }

    //  查询商品详情
    static async getGoodsInfo(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-part-goodss', params).then((res) => {
            return res
        });
    }

    //  查询商品详情目录列表
    static async getGoodsTitle(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goods-descs', params).then((res) => {
            return res
        });
    }

    //  获取商品分类
    static async getGoodsClass(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-class/simple-list', params).then((res) => {
            return res
        });
    }

    //  获取商品sku属性
    static async getGoodsSku(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods-sku-infos/skus', params).then((res) => {
            return res
        });
    }

    //  获取平台运营分类列表
    static async getPlatformList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-busconcla-hds', params).then((res) => {
            return res
        });
    }

    //  获取商品评价信息
    static async getGoodsComments(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-part-goodss/goods/comments', params).then((res) => {
            return res
        });
    }

    //  获取商品评价综合评分
    static async getGoodsScore(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods/comments/score', params).then((res) => {
            return res
        });
    }

    //  获取风格选择列表
    static async goodsPropList(ctx, params) {
        let url = '/prop-hds/part-goods/' + params.code
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取商品尺寸列表
    static async getGoodsSize(ctx, params) {
        let url = '/sp-part-goods-sizes/' + params.goodsCode + '/' + params.busContsCode
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  获取商品库存
    static async getGoodsStock(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + ctx.optimizeFlag + '/part-hds/whse-qty/goods-codes2', params).then((res) => {
            return res
        });
    }

    //  判断商品是否上架
    static async getIsShelves(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-part-goodss/simple/' + params.goodsCode, params).then((res) => {
            return res
        });
    }

    //  批量判断商品库存
    static async judgeStock(ctx, params) {
        params.inventoryJudgeSearchDto.ownCompanyId = params.companyId
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + '/sp-goods/inventory-judge2?companyId=' + params.companyId + '&shopId=' + params.shopId, params.inventoryJudgeSearchDto).then((res) => {
            return res
        });
    }

    //  判断商品是否上架
    static async isStockEnough(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/gct-fabcostset-hds-aggregates/is-custom-pro-inv-enough?companyId=' + params.companyId, params).then((res) => {
            return res
        });
    }

    //  批量获取商品库存（单品、组合、大货）
    static async getCommonStockCust(ctx, params) {
        // todo 需换成/sp-goods/inventory-judge2
        let url = `/sp-goods/inventory-judge2?shopId=${params.shopId}&usrId=${params.usrId}&companyId=${params.companyId}`
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    // 获取是否有搭配记录
    static async getCollocate(ctx, params) {
        let url = "/qsc/m-3d-assort-hds/is-assort";
        return ctx.$get(ctx.baseUrl + url, params).then(res => {
            return res;
        });
    }

    //  获取商品是否上架
    static async getSellState(ctx, params) {
        let url = '/sp-part-goodss/batch-get-sell-flags?companyId=' + params.companyId;
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spPartGoodsSearchDtoList).then((res) => {
            return res
        });
    }

    //  大货商品详情优惠促销信息
    static async getGoodsPromotion(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/coupons-aggregates/coupons-gifts', params, ctx.headers).then((res) => {
            return res
        });
    }

    // 获取满减、满折、赠品
    static async getGoodPreferential(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.promotion + "/online-hds/online-list/part", params, ctx.headers).then(res => {
            return res;
        });
    }

	// 创建一条搜索词记录表信息
	static async createRecordList(ctx, params) {
		let url = `/glb-search-termss?companyId=${params.companyId}&usrId=${params.usrId || 0}`
		return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.systemService + url, params.model).then((res) => {
			return res
		});
	}

	// 读取热搜词记录
	static async getHotWord(ctx, params) {
		let url = '/glb-search-termss/get-hot-word'
		return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + url, params).then((res) => {
			return res
		});
	}

	// 获取联想词
	static async getAssociativeWord(ctx, params) {
		let url = '/glb-search-termss/get-automated-keywords'
		return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + url, params).then((res) => {
			return res
		});
	}

	// 获取2.5D长图片
	static async get25dImg(ctx, params) {
		let url = '/part-hds/part-code-files?companyId='+params.companyId+"&code="+params.goodsCode
		return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
			return res
		});
	}
}

module.exports = goodsModel
