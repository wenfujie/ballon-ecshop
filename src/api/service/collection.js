/*
* createTime：2018/8/16
* author：en.chen
* description: 收藏模块api聚合
*/

import http from '../../util/http'

/**
 * 获取收藏列表
 * @param config
 * var param = {
    "usrId":"用户ID",
    "companyId":"公司",
    "cltTypeCode":"收藏类型",
    "collocationCode":"收藏夹ID",
    "priceTypeCode":"降价标识",
    "busContsCode":"业务触点",
    "pageSize":"分页条数",
    "pageNum":"分页页码"
    }
 * @returns {*}
 */
export const getCollectionList = (config) => { return http.get('collect/getCollectionList', config); }

/**
 * 加入收藏功能
 * @param config
 * var param = {
    "usrId":"用户ID",
    "companyId":"公司",
    "busContsCode":"业务触点",
    goodsCode: 商品货号,
    shopId: 店铺id
    }
 * @returns {*}
 */
export const addCollection = (config) => { return http.post('collect/addCollection', config); }


/**
 * 取消收藏功能
 * @param config
 * var param = {
    "usrId":"用户ID",
    "companyId":"公司",
    "goodCodeStr":"以逗号隔开的商品编码",
    ids: '收藏id'
    }
 * @returns {*}
 */
export const deleteCollection = (config) => { return http.delete('collect/deleteCollection', config); }
