/*
* createTime：2018/7/5
* author：en.chen
* description: 前端内容管理模块api聚合
*/

import http from '../../util/http'
import Storage from "../../util/storage";

/**
 * 获取模板
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    busContsCode: "D_BUSCONTS_WSC(业务触点)"
    shopId: 店铺id*（非必填）
    }
 * @returns {*}
 */
export const getTemplate = (config) => { return http.get('cms/getTemplate', config); }
/**
 * 获取默认模板
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    busContsCode: "D_BUSCONTS_WSC(业务触点)"
    }
 * @returns {*}
 */
export const getCmsTemplate = (config) => { return http.get('cms/cmsTemplate', config); }

/**
 * 获取千人千面模板
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    busContsCode: "业务触点"
    }
 * @returns {*}
 */
export const getUsrCmsTemplate = (config) => {
   config = Object.assign({
      shopId: !!Storage.get('properties') ? Storage.get('properties').shopId : null
   }, config)
   return http.get('cms/usrCmsTemplate', config);
}

/**
 * 获取内容模板v2
 * @param config
 * var param = {
    cmsTemplateCode: "模板编号",
    cmsWebCode: "页面编号",
    cmsWebMdlCode: "页面模块编号",
    busContsCode: "业务触点",
    usrId: "用户ID",
    companyId: "公司ID"
   }
 * @returns {*}
 */
export const getUsrCmsInfoV2 = (config) => { return http.get('cms/getCmsInfoV2', config); }

/**
 * 获取面包屑
 * @param config
 * var param = {
    usrId": "用户ID",
    companyId: "公司ID",
    busContsCode: "业务触点",
    goodsClassId: "品类id",
    pageSize: "条数",
    pageNum: "查询页"
   }
 * @returns {*}
 */
export const getCrumbs = (config) => { return http.get('cms/getCrumbs', config); }

/**
 * 获取面包屑子内容详情
 * @param config
 * var param = {
    usrId": "用户ID",
    companyId: "公司ID",
    ptiPartHdIds:  '商品id',
    crumbsCode: '面包屑类别code' (非必传)
   }
 * @returns {*}
 */
export const getCrumbsDetail = (config) => { return http.get('cms/getCrumbsDetail', config); }
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
   return http.get('cms/getCrumbsGoodsIds', config);
};

/**
 * 获取模板导航内容
 * @param config
 * var param = {
    cmsTemplateCode: "模板编号",
    busContsCode: "业务触点",
    usrId: "用户ID",
    companyId: "公司ID",
   }
 * @returns {*}
 */
export const getNavigation = (config) => { return http.get('cms/getNavigation', config); }

/**
 * 获取模板页面模块元素商品列表
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID", //非空
    cookieKey:"cookieID",//游客ID
    busContsCode:"业务触点",
    cmsTemplateCode:"模板编号",
    cmsWebCode:"页面编号",
    cmsWebMdlCode:"页面模块编号",
    cmsWebItemcode:"页面元素编号",
   }
 * @returns {*}
 */
export const getWebItemGoods = (config) => { return http.get('cms/getWebItemGoods', config); }

/**
 * 获取现购页面模块元素商品列表
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID", //非空
    cookieKey:"cookieID",//游客ID
    busContsCode:"业务触点",
    cmsTemplateCode:"模板编号",
    cmsWebCode:"页面编号",
    cmsWebItemcode:"页面元素编号",
   }
 * @returns {*}
 */
export const getChoosebuyGoods = (config) => { return http.get('cms/getChoosebuyGoods', config); }

/**
 * 返回wxUnionId、firameUrl、companyId
 * @param {*} 
 */
export const getProperties = () => { return http.get('cms/getProperties'); }

