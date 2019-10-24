/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 获取token
 */

const token = require('../controller/token');

module.exports = {
    "POST/getCilentToken": token.cilentToken, // 通过客户端获取token
    "POST/pwdToken": token.pwdToken, // 通过密码模式获取token
};
