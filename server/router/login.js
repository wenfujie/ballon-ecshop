/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 登陆模块用于处理前端请求的中间层接口
 */

const login = require('../controller/login');

module.exports = {
    'POST/getWechatLogin': login.getAuthorizeUrl,
    'POST/getWechatInfo': login.getAuthorizeInfo,
    'GET/getUserLoginInfo': login.userLoginService,
    'GET/getSingleCode': login.getSingleCode
};
