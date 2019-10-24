/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的商品模块api
 */

const goods = require('../controller/goods');

module.exports = {
    "GET/getGoodsList": goods.getGoodsList, // 商品墙
    "GET/getGoodsInfo": goods.getGoodsInfo,  // 商品详情
    "GET/getGoodsTitle": goods.getGoodsTitle, // 获取商品详情目录
    "GET/getGoodsClass": goods.getGoodsClass,// 获取一级面包屑分类
    "GET/getPlatformList": goods.getPlatformList,// 获取平台运营分类
    "GET/getGoodsComments": goods.getGoodsComments, // 商品模块查询商品评价
    "GET/getGoodsScore": goods.getGoodsScore,  // 商品评价综合得分
    "GET/getGoodsStock": goods.getGoodsStock,// 查询商品库存(大货)
    "GET/getHotGoods": goods.getHotGoods,// 商品模块查询热门商品列表
    "GET/getGoodsLayerClass": goods.getGoodsLayerClass,// 商品分类 商品分类等级查询
    "GET/getIsShelves": goods.getIsShelves,// 查询商品是否上架（nettyUrl接口）
    "GET/getGoodsPromotion": goods.getGoodsPromotion,  //  大货商品详情优惠促销信息(少敏)
    "GET/getGoodPreferential": goods.getGoodPreferential, // 满减满折惠赠（张谢全）
    "GET/getHotWord": goods.getHotWord, // 读取热搜词记录（罗凯铭）
    "GET/getAssociativeWord": goods.getAssociativeWord, // 获取联想词（罗凯铭）
    "GET/getGoodsRecommend": goods.getGoodsRecommend, // 商品模块查询平台商品的推荐商品列表  --------移动端才有
    "GET/getGoodsSku": goods.getGoodsSku,// 商品模块查询商品sku --------移动端才有
    "GET/goodsPropList": goods.goodsPropList,// 商品模块获取风格选择列表 --------移动端才有
    "GET/getGoodsSize": goods.getGoodsSize,// 商品模块获取商品尺寸大小 --------移动端才有
    "GET/getCollocate": goods.getCollocate,// 获取是否有搭配记录--------移动端才有
    "GET/get25dImg": goods.get25dImg,// 获取2.5D长图片
    "POST/getUseableGood": goods.getUseableGood, //  获取商品是否上架（建荣）（controller层请求的model不同，但是最后的接口一样）
    "POST/getSellState": goods.getSellState, //  获取商品是否上架（建荣）
    "POST/createRecordList": goods.createRecordList, // 创建一条搜索词记录表信息（罗凯铭）
    "POST/getCommonStockCust": goods.getCommonStockCust,// 批量获取商品库存（单品、组合、大货）
    "POST/isStockEnough": goods.isStockEnough,// 定制商品面料库存是否足够 --------移动端才有
    "POST/judgeStock": goods.judgeStock,// 商品模块查询商品库存 --------移动端才有（和pc的getCommonStockCust有点像）
};
