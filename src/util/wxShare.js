/*
 * @Author: yongtian.hong
 * @Date: 2018-09-30 16:31:06
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-30 17:08:49
 * @Description: 启尚微信前端分享
 */


import weixin from "weixin-js-sdk";

class wx {
    static config(option, params) {
        weixin.config({
            debug: false, // false关闭，true开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: option.appId, // 必填，公众号的唯一标识
            timestamp: option.timeStamp, // 必填，生成签名的时间戳
            nonceStr: option.nonceStr, // 必填，生成签名的随机串
            signature: option.signature, // 必填，签名，见附录1
            jsApiList: [
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2，根据需要添加
                "updateAppMessageShareData",
                "updateTimelineShareData",
                "onMenuShareTimeline",
                "onMenuShareAppMessage"
            ]
        });
        weixin.error(function (res) {
            alert(JSON.stringify(res))
        })
        weixin.ready(function () {
            let title = option.title || "TA的购物清单";
            let desc = option.desc || "都是精心挑选的好货，赶快来看看";
            let imgUrl = option.imgUrl || "http://qsuat.qishon.com/zzb/logo.png";
            let link = window.location.href.split("#")[0] + "#/orderShare?billCode="+params.billCode+"&companyId="+params.companyId+"&usrId="+params.usrId;
            // let link = "http://qsuat.qishon.com/zzb/#/orderShare?billCode="+params.billCode+"&companyId="+params.companyId;
            console.log("分享链接", link)
            weixin.updateAppMessageShareData({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
            }, function (res) {
                //回调
            });
            weixin.updateTimelineShareData({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl // 分享图标
            }, function (res) {
                //回调
            });
            weixin.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            });
            weixin.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                }
            });
        })
    }
    static ready(option, params) {
        this.config(option, params);
    }
}
export default wx;