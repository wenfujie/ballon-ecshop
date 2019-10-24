/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 中间层提供给前端的商品模块api
 */

const goods = require('../model/goods');
const shoppingCartModel = require('../model/shoppingCart');

class goodsController {

    // 商品墙
    static async getGoodsList(ctx) {
        let res = await goods.getGoodsList(ctx, ctx.params);
        ctx.body = res;
    }

    // 商品模块查询平台商品的推荐商品列表
    static async getGoodsRecommend(ctx) {
        let res = await goods.getGoodsRecommend(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品详情
    static async getGoodsInfo(ctx) {
        let res = await goods.getGoodsInfo(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品详情目录
    static async getGoodsTitle(ctx) {
        let res = await goods.getGoodsTitle(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取一级面包屑分类
    static async getGoodsClass(ctx) {
        let res = await goods.getGoodsClass(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品sku
    static async getGoodsSku(ctx) {
        let res = await goods.getGoodsSku(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取平台运营分类
    static async getPlatformList(ctx) {
        let res = await goods.getPlatformList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品评价
    static async getGoodsComments(ctx) {
        let res = await goods.getGoodsComments(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品评价综合得分
    static async getGoodsScore(ctx) {
        let res = await goods.getGoodsScore(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块获取风格选择列表
    static async goodsPropList(ctx) {
        let res = await goods.goodsPropList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块获取商品尺寸大小
    static async getGoodsSize(ctx) {
        let res = await goods.getGoodsSize(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询商品库存(大货)
    static async getGoodsStock(ctx) {
        let res = await goods.getGoodsStock(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询热门商品列表
    static async getHotGoods(ctx) {
        let res = await goods.getHotGoods(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品分类 商品分类等级查询
    static async getGoodsLayerClass(ctx) {
        let res = await goods.getGoodsLayerClass(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询商品是否上架（nettyUrl接口）
    static async getIsShelves(ctx) {
        let res = await goods.getIsShelves(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 商品模块查询商品库存
    static async judgeStock(ctx) {
        let res = await goods.judgeStock(ctx, ctx.params);
        ctx.body = res;
    }

    // 定制商品面料库存是否足够
    static async isStockEnough(ctx) {
        let res = await goods.isStockEnough(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 批量获取商品库存（单品、组合、大货）
    static async getCommonStockCust(ctx) {
        let res = await goods.getCommonStockCust(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取是否有搭配记录
    static async getCollocate(ctx) {
        let res = await goods.getCollocate(ctx, ctx.params);
        ctx.body = res.data;
    }

    //  获取商品是否上架、有库存
    static async getUseableGood (ctx,next) {
        /** 调用接口前参数处理 **/
        let params = ctx.params;
        params.goodList.forEach((item)=>{
            item.ptiPartHdCode = item.goodsCode;
            item.count = item.amount;
            item.ptiPartDtskuId = item.ptiPartDtSkuId;// 上下架需要
        })
        params.spPartGoodsSearchDtoList = params.goodList;
        params.inventoryJudgeDtos = params.spPartGoodsSearchDtoList;
        delete params.goodList;

        let mergeRes = await ctx.$requestAll([
            // goods.getSellStateValue(ctx, ctx.params),
            // goods.getCommonStockCustValue(ctx, ctx.params)

            shoppingCartModel.isGoodsAndSkuShevel(ctx, ctx.params),
            goods.getCommonStockCust(ctx, ctx.params)
        ]);
        let sellRes = mergeRes[0];// 校验下架 返回值
        let stockRes = mergeRes[1];// 校验库存 返回值

        /** 错误抛错 **/
        if(sellRes.statusCode == 500){
            ctx.body = sellRes;
            return;
        }
        if(stockRes.statusCode == 500){
            ctx.body = stockRes;
            return;
        }

        /** 处理返回数据 抛回前端 **/
        let sellArr = [],// 上架列表
            stockArr = [],// 有库存列表
            unStockArr = [];// 无库存列表
        let orderFlag = 1;

        // 下架列表
        let unSellArr = sellRes.filter(item=>{
            if(item.sellFlag != 1 || item.skuSellFlag != 1){
                return true;
            }else{
                sellArr.push(item);
            }
        })
        stockRes.partEnoughInfoDtos.forEach(item=>{
            orderFlag = 1;// 定制不进入以下判断
            for(let i=0;i<stockRes.partEnoughSkuInfoDtos.length;i++){
                if(item.ptiPartHdCode == stockRes.partEnoughSkuInfoDtos[i].ptiPartHdCode){
                    orderFlag = 0;// 进入判断代表是大货
                    if(stockRes.partEnoughSkuInfoDtos[i].enough == 1){
                        stockArr.push(stockRes.partEnoughSkuInfoDtos[i]);
                    }else{
                        unStockArr.push(stockRes.partEnoughSkuInfoDtos[i]);
                    }
                    stockRes.partEnoughSkuInfoDtos.splice(i,1);
                }
            }
            if(orderFlag == 1){
                if(item.enough == 1){
                    stockArr.push(item);
                }else{
                    unStockArr.push(item);
                }
            }
        })

        // 过滤出上架且有库存商品
        stockArr = stockArr.filter(item=>{
            for(let j=0;j<sellArr.length;j++){
                if(item.ptiPartHdCode == sellArr[j].goodsCode){
                    if(item.ptiPartSkuId){
                        if(item.ptiPartSkuId == sellArr[j].ptiPartDtSkuId){
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        })

        let sellAll = sellArr.length == sellRes.length ? 1 : 0;

        ctx.body = {
            sellAll: sellAll,
            unSellList: unSellArr,
            sellList: sellArr,
            stockAll: sellAll == 1 && stockRes.enoughAll == 1 ? 1 : 0,
            stockList: stockArr,
            unStockList: unStockArr
        };
    }

	// 获取商品是否上架
	static async getSellState(ctx) {
		let res = await goods.getSellState(ctx, ctx.params);
		ctx.body = res;
	}

    // 大货商品详情优惠促销信息
    static async getGoodsPromotion(ctx) {
        let res = await goods.getGoodsPromotion(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取满减、满折、赠品
    static async getGoodPreferential(ctx) {
        let res = await goods.getGoodPreferential(ctx,ctx.params);
        ctx.body = res.data;
    }

	// 创建一条搜索词记录表信息
	static async createRecordList(ctx) {
		let res = await goods.createRecordList(ctx,ctx.params);
		ctx.body = res.data;
	}

	// 读取热搜词记录
	static async getHotWord(ctx) {
		let res = await goods.getHotWord(ctx,ctx.params);
		ctx.body = res.data;
	}

	// 获取联想词
	static async getAssociativeWord(ctx) {
		let res = await goods.getAssociativeWord(ctx,ctx.params);
		ctx.body = res.data;
	}

	// 获取2.5D长图片
	static async get25dImg(ctx) {
		let res = await goods.get25dImg(ctx,ctx.params);
		ctx.body = res.data;
	}
}

module.exports = goodsController;
