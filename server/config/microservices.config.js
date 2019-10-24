/*
 * @Author: yongtian.hong
 * @Date: 2019-01-25 18:01:20
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-05-24 14:46:37
 * @Description: 微服务接口配置文件
 */

// 以下变量供本地开发使用
const local = {
    // 微服务接口
    serviceBaseUrl: {
        development: 'http://qishon-zuul-gateway.dev.qs.com',
        test: 'http://qishon-zuul-gateway.test.qs.com',
        pm: "http://1.1.20.82/api", //压测环境
		test2: 'http://qishon-zuul-gateway.test2.qs.com'  // 会员整合
    },
    serviceNettyUrl: {
        development: 'http://1.1.2.50:2081/api',
        test: 'http://qishon-zuul-gateway.test.qs.com',
        pm: "http://1.1.20.82:2080/api", //压测环境
		test2: 'http://1.1.2.50:2082/api',  // 会员整合
    },
    //token服务接口
    tokenServiceUrl: {
        development: "http://qishon-zuul-gateway.dev.qs.com/uaa/oauth-client/token",
        test: "http://qishon-zuul-gateway.test.qs.com/uaa/oauth-client/token",
        pm: "http://qishon-zuul-gateway/uaa/oauth-client/token",
		test2: "http://qishon-zuul-gateway.test2.qs.com/uaa/oauth-client/token",  // 会员整合
    },
    //文件系统接口
    ossServiceUrl: {
        development: "http://qishon-zuul-gateway.dev.qs.com/file/oss",
        test: "http://qishon-zuul-gateway.test.qs.com/file/oss",
        pm: "http://qishon-zuul-gateway/file/oss",
		test2: "http://qishon-zuul-gateway.test2.qs.com/file/oss"  // 会员整合
    },
    //文件系统开放路径
    ossOpenServiceUrl: {
        test2: "http://qsuat.qishon.com/openfile/v2/oss/image/"
    },
    dpServiceUrl: {
        development: "http://qishon-zuul-gateway.dev.qs.com",
        test: "http://qishon-zuul-gateway.test.qs.com",
        pm: "http://qishon-zuul-gateway.test.qs.com",
		test2: "http://qishon-zuul-gateway.test2.qs.com"  // 会员整合
    },
    shopClientId: {     // 获取Token key
        development: "wissClient",
        test: "wissClient",
        test2: "wissClient",
        pm: "wissClient"
    },
    shopClientSecret: {     // 获取Token secret
        development: "wissClientSecret",
        test: "wissClientSecret",
        test2: "wissClientSecret",
        pm: "wissClientSecret"
    }
}

// 获取环境变量
let environment = process.env.NODE_ENV;
// 配置路径全局
global.axiosBaseUrl = process.env.SERVICE_API;
global.dpUrl = process.env.DP_API;
global.shopClientId = process.env.SHOP_CLIENT_ID;
global.shopClientSecret = process.env.SHOP_CLIENT_SECRET;
let baseUrl = process.env.SERVICE_API;
let nettyUrl = process.env.NETTY_API;
let tokenUrl = process.env.TOKEN_API;
let ossUrl = process.env.OSS_API;
let ossOpenUrl = process.env.OSS_OPEN_API;
let dpUrl = process.env.DP_API;
let shopClientId = process.env.SHOP_CLIENT_ID;
let shopClientSecret = process.env.SHOP_CLIENT_SECRET;

//判断是否为本地开发环境,如果是则采用本地配置的变量路径
if (process.env.LOCAL_NODE_ENV) {
    //获取本地环境变量
    environment = process.env.LOCAL_NODE_ENV;
    //重置环境变量
    baseUrl = local.serviceBaseUrl[environment];
    nettyUrl = local.serviceNettyUrl[environment];
    global.axiosBaseUrl = local.serviceBaseUrl[environment];
    tokenUrl = local.tokenServiceUrl[environment];
    ossUrl = local.ossServiceUrl[environment];
    ossOpenUrl = local.ossOpenServiceUrl[environment];
    dpUrl = local.dpServiceUrl[environment];
    global.dpUrl = local.dpServiceUrl[environment];
    shopClientId = local.shopClientId[environment];
    global.shopClientId = local.shopClientId[environment];
    shopClientSecret = local.shopClientSecret[environment];
    global.shopClientSecret = local.shopClientSecret[environment];
}

console.log('environment', environment)
console.log('baseUrl', baseUrl)
console.log('nettyUrl', nettyUrl)
console.log('tokenUrl', tokenUrl)
console.log('ossUrl', ossUrl)
console.log('ossOpenUrl', ossOpenUrl)
console.log('dpUrl', dpUrl)
console.log('shopClientId', shopClientId)
console.log('shopClientSecret', shopClientSecret)

const microService = {
    base: '', // 基础服务接口
    systemService: '/iss/stm', // 系统服务
    goodsService: '/iss/mas', // 商品服务
    issBas: '/iss/bas', // 基础档案服务
    memberService: '/iss/crm', // 会员服务
    shoppingCart: '/iss/sal', // 购物车
    baseService: '', // 基础档案服务
    promotion: '/iss/spm', // 促销服务
    thirdPartyService: "/iss/thp", //第三方服务
    wxService: '/wechat/event', // 后台微信服务
    payment: '/iss/thp', // 第三方服务（订单支付）
    invoice: '/iss/acc' //  财务接口
}

module.exports = {
    baseUrl: baseUrl,
    nettyUrl: nettyUrl,
    ossUrl: ossUrl,
    ossOpenUrl: ossOpenUrl,
    tokenUrl: tokenUrl,
    dpUrl: dpUrl,
    shopClientId: shopClientId,
    shopClientSecret: shopClientSecret,
    environment: environment,
    microService: microService
}
