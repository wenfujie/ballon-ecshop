/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的内容管理模块api
 */

const Cms = require('../controller/cms');

module.exports = {
    // "GET/getTemplate": Cms.getTemplate,
    "GET/cmsTemplate": Cms.getCmsTemplate,
    "GET/usrCmsTemplate": Cms.getUsrCmsTemplate,
    "GET/getCmsInfoV2": Cms.getCmsInfoV2,
    "GET/getCrumbs": Cms.getCrumbs,
    "GET/getCrumbsDetail": Cms.getCrumbsDetail,
    "GET/getCrumbsGoodsIds": Cms.getCrumbsGoodsIds,  // 获取面包屑查询条件ids的前置接口(毅杰)
    "GET/getNavigation": Cms.getNavigation,
    "GET/getWebItemGoods": Cms.getWebItemGoods,
    "GET/getChoosebuyGoods": Cms.getChoosebuyGoods,
    "GET/getProperties": Cms.getProperties
};
