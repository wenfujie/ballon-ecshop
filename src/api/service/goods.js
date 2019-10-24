/*
* createTime：2018/7/14
* author：en.chen
* description: 商品模块api聚合
*/

import http from '../../util/http'
/**
 * 获取面包屑查询条件ids的前置接口
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID",
    pageNum: 1,
    pageSize: 10，
    filters: [],  // 过滤条件
    keyword: this.$route.query.keyWord || "",  // 搜索关键词
    sortParam: // 面包屑,
    platformCode: //  分类
    queryNullBusFlag: 1,
    orderFlags: [0,1,2]  // 0，1，2代表大货、定制、组合，不传查询所有
   }
 * @returns {*}
 */
export const getCrumbsGoodsIds = (config) => {
   return http.get('goods/getCrumbsGoodsIds', config);
};
/**
 * 查询商品分类等级
 * @param config
 * var param = {
    busContsCode：业务触点
    ownCompanyId
    companyId：公司Id
    layer: 要查询等级数
    }
 * @returns {*}
 */
export const getGoodsLayerClass = (config) => {
    return http.get('goods/getGoodsLayerClass', config);
}

/**
 * 获取商品列表
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID",
    pageNum: 1,
    pageSize: 10
   }
 * @returns {*}
 */
export const getGoodsList = (config) => {
    return http.get('goods/getGoodsList', config);
}

/**
 * 查询平台商品的推荐商品列表
 * @param config
 * var param = {
    buscontsCode：平台编码
    partCode：商品编码
    userId：用户Id
    companyId：公司Id
    shopId: 1005423
    }
 * @returns {*}
 */
export const getGoodsRecommend = (config) => {
    return http.get('goods/getGoodsRecommend', config);
}

/**
 * 查询商品详情
 * @param config
 * var param = {
    busContsCode: 业务触点
    goodsCode: 平台商品编码
    userId: 用户Id
    companyId: 公司Id,
    shopCode: 门店编码
    }
 * @returns {*}
 */
export const getGoodsInfo = (config) => {
    return http.get('goods/getGoodsInfo', config);
}

/**
 * 查询商品分类
 * @param config
 * var param = {
    goodsClassCode：商品类别编号,
    usrId：用户id,
    companyId：公司Id,
    ptiPartClassCode: '10'  (巴龙写死字符串10)
    }
 * @returns {*}
 */
export const getGoodsClass = (config) => {
    return http.get('goods/getGoodsClass', config);
}

/**
 * 查询商品sku
 * @param config
 * var param = {
    usrId：用户id,
    companyId：公司Id,
    goodsCode: 平台商品编码,
    partCode: 商品货号,
    colorCode: 商品颜色,
    sizeCode: 尺码,
    busContsCode: 业务触点,
    shopCode: 门店编码
    }
 * @returns {*}
 */
export const getGoodsSku = (config) => {
    return http.get('goods/getGoodsSku', config);
}

/**
 * 获取平台运营分类列表
 * @param config
 * var param = {
    companyId：公司Id,
    busContsCode: 业务触点
    }
 * @returns {*}
 */
export const getPlatformList = (config) => {
    return http.get('goods/getPlatformList', config);
}

/**
 * 获取商品评价
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司",
    cookieId:"cookieID",
    goodsCode:"平台商品编码",
    busContsCode:"业务触点",
    pageSize:"条数",
    pageNum:"查询页"
    }
 * @returns {*}
 */
export const getGoodsComments = (config) => {
    return http.get('goods/getGoodsComments', config);
}

/**
 * 获取商品综合评分
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司",
    cookieId:"cookieID",
    goodsCode:"平台商品编码",
    busContsCode:"业务触点",
    }
 * @returns {*}
 */
export const getGoodsScore = (config) => {
    return http.get('goods/getGoodsScore', config);
}

/**
 * 获取风格选择列表
 * @param config
 * var param = {
    companyId：公司Id
    code: 上级附加属性编码
    }
 * @returns {*}
 */
export const getGoodsPropList = (config) => {
    return http.get('goods/goodsPropList', config);
}

/**
 * 获取商品尺码列表
 * @param config
 * var param = {
    companyId：公司Id,
    busContsCode: 业务触点,
    goodsCode: 平台商品编码
    }
 * @returns {*}
 */
export const getGoodsSize = (config) => {
    return http.get('goods/getGoodsSize', config);
}

/**
 * 获取商品库存（大货）
 * @param config
 * var param = {
    companyId：公司Id,
    busContsCode: 业务触点,
    goodsCode: 平台商品编码,
    colorCode: 颜色编码,
    sizeCode: 尺码编码,
    shopCode: 门店编码,
    orderFlag: 定制标记
    }
 * @returns {*}
 */
export const getGoodsStock = (config) => {
    return http.get('goods/getGoodsStock', config);
}

/**
 * 查询热门商品列表
 * @param config
 * var param = {
    companyId：公司Id
    }
 * @returns {*}
 */
export const getHotGoods = (config) => {
    return http.get('goods/getHotGoods', config);
}

/**
 * 查询商品详情目录
 * @param config
 * var param = {
    companyId：公司Id,
    goodsId: 商品id
    }
 * @returns {*}
 */
export const getGoodsTitle = (config) => {
    return http.get('goods/getGoodsTitle', config);
}

/**
 * 大货商品详情优惠促销信息
 * @param config
 * var param = {
    ptiPartHdId: 商品id,
    busContsCode: 业务触点,
    shopId: 店铺id,
    companyId:公司id,
    usrId: 用户id
    }
 * @returns {*}
 */
export const getGoodsPromotion = (config) => {
    return http.get('goods/getGoodsPromotion', config);
}

/**
 * 查询商品是否上架
 * @param config
 * var param = {
    ownCompanyId：公司Id,
    goodsCode: 商品编码,
    buscontsCode: 平台编码
    }
 * @returns {*}
 */
export const isShelves = (config) => { return http.get('goods/getIsShelves',config); }

/**
 * 批量判断库存
 * @param config
 * var param = {
    }
 * @returns {*}
 */
export const judgeStock = (config) => { return http.post('goods/judgeStock', config); }

/**
 * 查询定制商品面料库存是否足够
 * @param config
 * var param = {
    ptiPartHdId：商品id,
    fabricId：主面料id,
    gctRegeionHdIds：部件ids数组,
    fabricIds：面料ids数组,
    amount: 1,
    orderFlag: 1,
    shopDptId：店铺id,
    companyId：公司id
    }
 * @returns {*}
 */
export const isStockEnough = (config) => {
   return http.post('goods/isStockEnough', config);
}

/**
 * 批量获取商品库存（单品、组合、大货）
 * @param config
 * var param = {
    ownCompanyId:,
    usrId: ,
    companyId：公司Id,
    shopId: 门店编码,
    inventoryJudgeDtos:[
      {
        "count": 1,
        "orderFlag": 1,
        "ptiPartDtSkuId": 3478,
        "ptiPartHdCode": "HS112001",
        "ptiPartHdId": 935
      }
    ]
    }
 * @returns {*}
 */
export const judgeStockEnough = (config) => {
   return http.post('goods/getCommonStockCust', config);
}

/**
 * 获取是否有搭配记录
 * @param config
 * var param = {
    partCode：商品编码
    dptId: 店铺Id
    }
 * @returns {*}
 */
export const getCollocate = config => {
   return http.get("goods/getCollocate", config);
};

/**
 * 校验商品上架、库存
 * @param config
 * var param = {
"shopId":564,
"usrId":1560,
"goodList":[
{
"busContsCode":"D_BUSCONTS_B2C",//业务触点
"goodsCode":"wymtest002",//商品编码
"ptiPartDtSkuId":45098,//商品skuid
"amount":1,//数量
"orderFlag":0,//是否定制商品标识
"ptiPartHdId":241359//商品id
}
]
    }
 * @returns {*}
 */
export const getUseableGood = (config) => {
   return http.post('goods/getUseableGood', config);
}

/**
 * 校验商品是否上架
 * @param config
 * var param = {
    ownCompanyId:,
    companyId：公司Id,
    spPartGoodsSearchDtoList: 商品编码数组[{"busContsCode":"D_BUSCONTS_B2C","goodsCode":"QZJ001","ptiPartDtskuId":3316}]
    }
 * @returns {*}
 */
export const getGoodsSellState = (config) => {
   return http.post('goods/getSellState', config);
}

/**
 * 满减、满折、赠品
 * let data = {
        partId: '商品id',
        dptId: '店铺id',
    }
 * @param config
 * @returns {*|Promise}
 */
export const getGoodPreferential = config => {
   return http.get("goods/getGoodPreferential", config);
};

/**
 * 创建一条搜索词记录表信息
 * @param config
 * var param = {
    companyId:公司id,
    usrId: 用户id,
    model: 接收实体,
    }
 * @returns {*}
 */
export const createRecordList = (config) => {
   return http.post('goods/createRecordList', config);
}

/**
 * 读取热搜词记录
 * @param config
 * var param = {
    companyId:公司id
    }
 * @returns {*}
 */
export const getHotWord = (config) => {
   return http.get('goods/getHotWord', config);
}

/**
 * 获取联想词
 * @param config
 * var param = {
    companyId:公司id,
    usrId: 用户id,
    input: 搜索词,
    }
 * @returns {*}
 */
export const getAssociativeWord = (config) => {
   return http.get('goods/getAssociativeWord', config);
}

/**
 * 获取2.5D长图片
 * @param config
 * var param = {
    companyId:公司id,
    code: 商品code
    }
 * @returns {*}
 */
export const get25dImg = (config) => {
   return http.get('goods/get25dImg', config);
}
