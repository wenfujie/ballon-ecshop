/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的基础模块api
 */

const base = require('../controller/base');

module.exports = {
    'GET/getContent': base.getContent,  // 获取常数值  ---------移动端才有
    'GET/getShopList': base.getShopList,  // 获取门店列表
    'GET/getDestnation': base.getDestnation,  // 获取地区信息 ---------移动端才有(由于和pc的controll处理不一样)
    'GET/getBaseParams': base.getBaseParams,     //通过AppId获取基础参数 通过网址域名获取基础参数
    'GET/getPlamset': base.getPlamset,  // 获取购物平台设置  ---------移动端才有
    'GET/getCompanyQuery': base.getCompanyQuery,  // 二级域名解析 ---------移动端才有
    'GET/getCompanyById': base.getCompanyById,  // 获取公司信息 ---------移动端才有
};
