/*
* createTime：2018/11/6
* author：en.chen
* description: 前端积分模块api
*/

import http from '../../util/http'

/**
 * 获取积分详情
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    }
 * @returns {*}
 */

export const getPointDetail = (config) => {return http.get('point/getPointDetail',config); }

/**
 * 获取可用积分、冻结积分
 * @param config
 * @returns {*}
 */
export const getPointTotal = (config) => {return http.get('point/getPointTotal',config); }

/**
 * 获取积分明细列表
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    }
 * @returns {*}
 */
export const getPointDetailList = (config) => {return http.get('point/getPointDetailList',config); }

export const sellCardData = (config) => {return http.put('point/sellCardData', Object.assign(config, {isMeasure: true})); }

export const getCardData = (config) => {return http.get('point/getCardData', Object.assign(config, {isMeasure: true})); }

/**
 * 获取用户是否可使用积分flag
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    ownCompanyId: 公司id
    }
 * @returns {*}
 */

export const getUsePointFlag = (config) => {return http.get('point/getUsePointFlag',config); }

/**
 * 根据价格计算赠送积分
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id
    ownCompanyId: 公司id
    price: 商品,组合价格
    }
 * @returns {*}
 */

export const getComputePresentPointer = (config) => {return http.get('point/getComputePresentPointer',config); }
