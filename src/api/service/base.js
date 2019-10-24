
/*
* createTime：2018/7/2
* author：en.chen
* description: 前端基础模块api聚合
*/

import http from '../../util/http'

/**
 * 获取常数值
 * @returns {*}
 */
export const getBase = () => { return http.get('base/getContent'); }

/**
 * 获取门店列表
 * @param config
 * var params = { code: 省市区编码 ,pageNo: 1 , pageSize: 10 }
 * @returns {*}
 */
export const getShopList = (config) => { return http.get('base/getShopList', config); }


/**
 * 获取地区信息
 * @param config
 * @returns {*}
 */
export const getDestnation = () => { return http.get('base/getDestnation'); }

/**
 * 获取购物平台设置
 * @returns {*}
 */
export const getPlamset = () => { return http.get('base/getPlamset'); }

/**
 * 获取二级域名解析
 * @param config
 * var params = { companyUrl: 域名 }
 * @returns {*}
 */
export const getCompanyQuery = (config) => { return http.get('base/getCompanyQuery', config); }

/*
* 图片上传
* @param config
* var params = { file }
* return {*}
* */
export const imgUpload = (config) => { return http.post('file-system/imgUpload', config) }
/*
* 图片上传 返回上传图片详细信息
* @param config
* var params = { file }
* return {*}
* */
export const imgUploadDetail = (config) => { return http.post('file-system/imgUploadDetail', config) }
/**
 * 根据id获取公司信息
 * @param config
 * var params = { }
 * @returns {*}
 */
export const getCompanyById = (config) => { return http.get('base/getCompanyById', config); }

/**
 * 通过AppId获取基础参数
 * @param config
 * var params = {
 *      appId: 公众号唯一标识
  * }
 * @returns {*}
 */
export const getBaseParams = (config) => { return http.get('base/getBaseParams',config); }