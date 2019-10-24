/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 11:33:16
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 14:11:25
 * @Description: 第三方服务
 */

const thirdParty = require('../controller/thirdParty');

module.exports = {
    "POST/getLogis": thirdParty.getLogis
};
