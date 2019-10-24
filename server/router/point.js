/*
* createTime：2018/11/6
* author：en.chen
* description:  积分模块api路由
*/

//  支付功能模块
const pointFun = require('../controller/point')

module.exports = {
    "GET/getPointDetail": pointFun.getDetail,  // 获取积分详情
    "GET/getPointTotal": pointFun.getPointTotal,  // 获取可用积分、冻结积分
    "GET/getPointDetailList": pointFun.getDetailList,  // 获取积分明细列表
    "GET/getUsePointFlag": pointFun.getUsePointFlag,  // 获取积分详情
    "GET/getComputePresentPointer": pointFun.getComputePointer,  // 获取积分详情
    "PUT/sellCardData": pointFun.sellCardData,// 兑换积分
    "GET/getCardData": pointFun.getCardData, //  查询积分券
}
