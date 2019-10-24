/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 15:10:30
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-07-24 11:15:16
 * @Description: 售后服务路由适配
 */

const postSale = require('../controller/postSale');

module.exports = {
    "GET/getList": postSale.getList,  // 获取申请单列表
    "GET/getReasonCodes": postSale.getReasonCodes,  //获取售后原因编码
    "GET/getPostSaleWay": postSale.getPostSaleWay,  // 获取售后类型
    "GET/getPostSaleDetail": postSale.getPostSaleDetail,  // 获取售后申请单详情
    "GET/getExpressCompanies": postSale.getExpressCompanies,  // 获取快递公司列表
    "GET/getApplyNum": postSale.getApplyNum,  // 获取可申请售后数量
    "GET/getGoodsForChange": postSale.getGoodsForChange,  // 获取可换货商品
    "POST/submitApplyWx": postSale.submitApplyWx,  // 提交售后申请-----改为移动端特有（中间层与pc不一样）
    "POST/savePostSaleLogisWx": postSale.savePostSaleLogisWx, // 保存售后物流-----改为移动端特有（中间层不一样）
    "PUT/cancelApply": postSale.cancelApply,  // 取消售后申请单
};
