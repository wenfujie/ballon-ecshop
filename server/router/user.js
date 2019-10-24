/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的会员模块api
 */

//  会员地址模块功能
const address = require('../controller/user/address');

//  会员基本模块功能
const base = require('../controller/user/base');

//  会员信息模块功能
const info = require('../controller/user/info');

//  会籍会员模块功能
const benefit = require('../controller/user/benefit');

module.exports = {
    "GET/getAddrList": address.getAddrList,
    "POST/changeAddrInfo": address.changeAddrInfo,
    "DELETE/deleteAddrList": address.deleteAddrList,
    "GET/getAddrDetail": address.addrDetail,
    "GET/getCaptcha": base.getCaptcha,
    "GET/sendCaptcha": base.sendCaptcha,
    "GET/checkPhone": base.checkPhone,//wenti
    "GET/checkWxPhone": base.checkWxPhone,
    "PUT/bindMobile": base.bindMobile,
    "POST/checkCaptcha": base.checkCaptcha,
    "PUT/changePhone": base.changePhone,
    "GET/getWxVipInfo": info.vipInfo,
    "GET/getUserInfo": info.userInfo,
    "PUT/updateUserInfo": info.updateInfo,//wenti 
    "GET/getMemberInfo": info.memberInfo,
    "PUT/updateMemberInfo": info.updateMemberInfo,
    "POST/saveFootprint": info.saveFootprint,
    "GET/getUserFootprint": info.userFootprint,
    "DELETE/deleteUserFootprint": info.deleteFootprint,
    "GET/getPurchase": info.purchaseHistory,
    "GET/getMemCardLevelList": benefit.memberCardList,//我的会员卡
    "GET/getCardLevelDetail": benefit.cardLevelDetail,//会员卡详情
    "GET/memberRcmdSize": info.memberRcmd,
    "POST/saveMemberRcmd": info.savememberRcmd,
    "GET/getPoint": benefit.pointValue,
    "GET/getMyCardInfo": benefit.getVipcardinfo,
    "GET/getCardVouchers": benefit.getCardVouchers,
    "PUT/buyCard": benefit.buyCard,
    "POST/memberMergeOperator": base.memberMergeOperator,
    "GET/memberMergeList": base.memberMergeList,
    "GET/memberCartList": base.memberCartList,
    "GET/getRelationAccountList": info.getRelationAccountList,
    "GET/getMinIntegral": benefit.getMinIntegral,
};
