(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9c40f72e"],{"18a0":function(e,n){!function(n,i){e.exports=i(n)}(window,function(e,n){function i(n,i,t){e.WeixinJSBridge?WeixinJSBridge.invoke(n,a(i),function(e){s(n,e,t)}):u(n,t)}function t(n,i,t){e.WeixinJSBridge?WeixinJSBridge.on(n,function(e){t&&t.trigger&&t.trigger(e),s(n,e,i)}):u(n,t||i)}function a(e){return e=e||{},e.appId=A.appId,e.verifyAppId=A.appId,e.verifySignType="sha1",e.verifyTimestamp=A.timestamp+"",e.verifyNonceStr=A.nonceStr,e.verifySignature=A.signature,e}function o(e){return{timeStamp:e.timestamp+"",nonceStr:e.nonceStr,package:e.package,paySign:e.paySign,signType:e.signType||"SHA1"}}function r(e){return e.postalCode=e.addressPostalCode,delete e.addressPostalCode,e.provinceName=e.proviceFirstStageName,delete e.proviceFirstStageName,e.cityName=e.addressCitySecondStageName,delete e.addressCitySecondStageName,e.countryName=e.addressCountiesThirdStageName,delete e.addressCountiesThirdStageName,e.detailInfo=e.addressDetailInfo,delete e.addressDetailInfo,e}function s(e,n,i){"openEnterpriseChat"==e&&(n.errCode=n.err_code),delete n.err_code,delete n.err_desc,delete n.err_detail;var t=n.errMsg;t||(t=n.err_msg,delete n.err_msg,t=c(e,t),n.errMsg=t),(i=i||{})._complete&&(i._complete(n),delete i._complete),t=n.errMsg||"",A.debug&&!i.isInnerInvoke&&alert(JSON.stringify(n));var a=t.indexOf(":");switch(t.substring(a+1)){case"ok":i.success&&i.success(n);break;case"cancel":i.cancel&&i.cancel(n);break;default:i.fail&&i.fail(n)}i.complete&&i.complete(n)}function c(e,n){var i=e,t=v[i];t&&(i=t);var a="ok";if(n){var o=n.indexOf(":");"confirm"==(a=n.substring(o+1))&&(a="ok"),"failed"==a&&(a="fail"),-1!=a.indexOf("failed_")&&(a=a.substring(7)),-1!=a.indexOf("fail_")&&(a=a.substring(5)),"access denied"!=(a=(a=a.replace(/_/g," ")).toLowerCase())&&"no permission to execute"!=a||(a="permission denied"),"config"==i&&"function not exist"==a&&(a="ok"),""==a&&(a="fail")}return i+":"+a}function d(e){if(e){for(var n=0,i=e.length;n<i;++n){var t=e[n],a=h[t];a&&(e[n]=a)}return e}}function u(e,n){if(!(!A.debug||n&&n.isInnerInvoke)){var i=v[e];i&&(e=i),n&&n._complete&&delete n._complete,console.log('"'+e+'",',n||"")}}function l(e){if(!(y||k||A.debug||b<"6.0.2"||P.systemType<0)){var n=new Image;P.appId=A.appId,P.initTime=M.initEndTime-M.initStartTime,P.preVerifyTime=M.preVerifyEndTime-M.preVerifyStartTime,B.getNetworkType({isInnerInvoke:!0,success:function(e){P.networkType=e.networkType;var i="https://open.weixin.qq.com/sdk/report?v="+P.version+"&o="+P.isPreVerifyOk+"&s="+P.systemType+"&c="+P.clientVersion+"&a="+P.appId+"&n="+P.networkType+"&i="+P.initTime+"&p="+P.preVerifyTime+"&u="+P.url;n.src=i}})}}function p(){return(new Date).getTime()}function f(n){T&&(e.WeixinJSBridge?n():I.addEventListener&&I.addEventListener("WeixinJSBridgeReady",n,!1))}function m(){B.invoke||(B.invoke=function(n,i,t){e.WeixinJSBridge&&WeixinJSBridge.invoke(n,a(i),t)},B.on=function(n,i){e.WeixinJSBridge&&WeixinJSBridge.on(n,i)})}function g(e){if("string"==typeof e&&e.length>0){var n=e.split("?")[0],i=e.split("?")[1];return n+=".html",void 0!==i?n+"?"+i:n}}if(!e.jWeixin){var h={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest",openEnterpriseRedPacket:"getRecevieBizHongBaoRequest",startSearchBeacons:"startMonitoringBeacons",stopSearchBeacons:"stopMonitoringBeacons",onSearchBeacons:"onBeaconsInRange",consumeAndShareCard:"consumedShareCard",openAddress:"editAddress"},v=function(){var e={};for(var n in h)e[h[n]]=n;return e}(),I=e.document,S=I.title,_=navigator.userAgent.toLowerCase(),w=navigator.platform.toLowerCase(),y=!(!w.match("mac")&&!w.match("win")),k=-1!=_.indexOf("wxdebugger"),T=-1!=_.indexOf("micromessenger"),x=-1!=_.indexOf("android"),C=-1!=_.indexOf("iphone")||-1!=_.indexOf("ipad"),b=function(){var e=_.match(/micromessenger\/(\d+\.\d+\.\d+)/)||_.match(/micromessenger\/(\d+\.\d+)/);return e?e[1]:""}(),M={initStartTime:p(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},P={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",isPreVerifyOk:1,systemType:C?1:x?2:-1,clientVersion:b,url:encodeURIComponent(location.href)},A={},V={_completes:[]},L={state:0,data:{}};f(function(){M.initEndTime=p()});var N=!1,O=[],B={config:function(e){A=e,u("config",e);var n=!1!==A.check;f(function(){if(n)i(h.config,{verifyJsApiList:d(A.jsApiList)},function(){V._complete=function(e){M.preVerifyEndTime=p(),L.state=1,L.data=e},V.success=function(e){P.isPreVerifyOk=0},V.fail=function(e){V._fail?V._fail(e):L.state=-1};var e=V._completes;return e.push(function(){l()}),V.complete=function(n){for(var i=0,t=e.length;i<t;++i)e[i]();V._completes=[]},V}()),M.preVerifyStartTime=p();else{L.state=1;for(var e=V._completes,t=0,a=e.length;t<a;++t)e[t]();V._completes=[]}}),m()},ready:function(e){0!=L.state?e():(V._completes.push(e),!T&&A.debug&&e())},error:function(e){b<"6.0.2"||(-1==L.state?e(L.data):V._fail=e)},checkJsApi:function(e){var n=function(e){var n=e.checkResult;for(var i in n){var t=v[i];t&&(n[t]=n[i],delete n[i])}return e};i("checkJsApi",{jsApiList:d(e.jsApiList)},(e._complete=function(e){if(x){var i=e.checkResult;i&&(e.checkResult=JSON.parse(i))}e=n(e)},e))},onMenuShareTimeline:function(e){t(h.onMenuShareTimeline,{complete:function(){i("shareTimeline",{title:e.title||S,desc:e.title||S,img_url:e.imgUrl||"",link:e.link||location.href,type:e.type||"link",data_url:e.dataUrl||""},e)}},e)},onMenuShareAppMessage:function(e){t(h.onMenuShareAppMessage,{complete:function(n){"favorite"===n.scene?i("sendAppMessage",{title:e.title||S,desc:e.desc||"",link:e.link||location.href,img_url:e.imgUrl||"",type:e.type||"link",data_url:e.dataUrl||""}):i("sendAppMessage",{title:e.title||S,desc:e.desc||"",link:e.link||location.href,img_url:e.imgUrl||"",type:e.type||"link",data_url:e.dataUrl||""},e)}},e)},onMenuShareQQ:function(e){t(h.onMenuShareQQ,{complete:function(){i("shareQQ",{title:e.title||S,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},onMenuShareWeibo:function(e){t(h.onMenuShareWeibo,{complete:function(){i("shareWeiboApp",{title:e.title||S,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},onMenuShareQZone:function(e){t(h.onMenuShareQZone,{complete:function(){i("shareQZone",{title:e.title||S,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},updateTimelineShareData:function(e){i("updateTimelineShareData",{title:e.title,link:e.link,imgUrl:e.imgUrl},e)},updateAppMessageShareData:function(e){i("updateAppMessageShareData",{title:e.title,desc:e.desc,link:e.link,imgUrl:e.imgUrl},e)},startRecord:function(e){i("startRecord",{},e)},stopRecord:function(e){i("stopRecord",{},e)},onVoiceRecordEnd:function(e){t("onVoiceRecordEnd",e)},playVoice:function(e){i("playVoice",{localId:e.localId},e)},pauseVoice:function(e){i("pauseVoice",{localId:e.localId},e)},stopVoice:function(e){i("stopVoice",{localId:e.localId},e)},onVoicePlayEnd:function(e){t("onVoicePlayEnd",e)},uploadVoice:function(e){i("uploadVoice",{localId:e.localId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},downloadVoice:function(e){i("downloadVoice",{serverId:e.serverId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},translateVoice:function(e){i("translateVoice",{localId:e.localId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},chooseImage:function(e){i("chooseImage",{scene:"1|2",count:e.count||9,sizeType:e.sizeType||["original","compressed"],sourceType:e.sourceType||["album","camera"]},(e._complete=function(e){if(x){var n=e.localIds;try{n&&(e.localIds=JSON.parse(n))}catch(e){}}},e))},getLocation:function(e){},previewImage:function(e){i(h.previewImage,{current:e.current,urls:e.urls},e)},uploadImage:function(e){i("uploadImage",{localId:e.localId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},downloadImage:function(e){i("downloadImage",{serverId:e.serverId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},getLocalImgData:function(e){!1===N?(N=!0,i("getLocalImgData",{localId:e.localId},(e._complete=function(e){if(N=!1,O.length>0){var n=O.shift();wx.getLocalImgData(n)}},e))):O.push(e)},getNetworkType:function(e){var n=function(e){var n=e.errMsg;e.errMsg="getNetworkType:ok";var i=e.subtype;if(delete e.subtype,i)e.networkType=i;else{var t=n.indexOf(":"),a=n.substring(t+1);switch(a){case"wifi":case"edge":case"wwan":e.networkType=a;break;default:e.errMsg="getNetworkType:fail"}}return e};i("getNetworkType",{},(e._complete=function(e){e=n(e)},e))},openLocation:function(e){i("openLocation",{latitude:e.latitude,longitude:e.longitude,name:e.name||"",address:e.address||"",scale:e.scale||28,infoUrl:e.infoUrl||""},e)},getLocation:function(e){e=e||{},i(h.getLocation,{type:e.type||"wgs84"},(e._complete=function(e){delete e.type},e))},hideOptionMenu:function(e){i("hideOptionMenu",{},e)},showOptionMenu:function(e){i("showOptionMenu",{},e)},closeWindow:function(e){i("closeWindow",{},e=e||{})},hideMenuItems:function(e){i("hideMenuItems",{menuList:e.menuList},e)},showMenuItems:function(e){i("showMenuItems",{menuList:e.menuList},e)},hideAllNonBaseMenuItem:function(e){i("hideAllNonBaseMenuItem",{},e)},showAllNonBaseMenuItem:function(e){i("showAllNonBaseMenuItem",{},e)},scanQRCode:function(e){i("scanQRCode",{needResult:(e=e||{}).needResult||0,scanType:e.scanType||["qrCode","barCode"]},(e._complete=function(e){if(C){var n=e.resultStr;if(n){var i=JSON.parse(n);e.resultStr=i&&i.scan_code&&i.scan_code.scan_result}}},e))},openAddress:function(e){i(h.openAddress,{},(e._complete=function(e){e=r(e)},e))},openProductSpecificView:function(e){i(h.openProductSpecificView,{pid:e.productId,view_type:e.viewType||0,ext_info:e.extInfo},e)},addCard:function(e){for(var n=e.cardList,t=[],a=0,o=n.length;a<o;++a){var r=n[a],s={card_id:r.cardId,card_ext:r.cardExt};t.push(s)}i(h.addCard,{card_list:t},(e._complete=function(e){var n=e.card_list;if(n){for(var i=0,t=(n=JSON.parse(n)).length;i<t;++i){var a=n[i];a.cardId=a.card_id,a.cardExt=a.card_ext,a.isSuccess=!!a.is_succ,delete a.card_id,delete a.card_ext,delete a.is_succ}e.cardList=n,delete e.card_list}},e))},chooseCard:function(e){i("chooseCard",{app_id:A.appId,location_id:e.shopId||"",sign_type:e.signType||"SHA1",card_id:e.cardId||"",card_type:e.cardType||"",card_sign:e.cardSign,time_stamp:e.timestamp+"",nonce_str:e.nonceStr},(e._complete=function(e){e.cardList=e.choose_card_info,delete e.choose_card_info},e))},openCard:function(e){for(var n=e.cardList,t=[],a=0,o=n.length;a<o;++a){var r=n[a],s={card_id:r.cardId,code:r.code};t.push(s)}i(h.openCard,{card_list:t},e)},consumeAndShareCard:function(e){i(h.consumeAndShareCard,{consumedCardId:e.cardId,consumedCode:e.code},e)},chooseWXPay:function(e){i(h.chooseWXPay,o(e),e)},openEnterpriseRedPacket:function(e){i(h.openEnterpriseRedPacket,o(e),e)},startSearchBeacons:function(e){i(h.startSearchBeacons,{ticket:e.ticket},e)},stopSearchBeacons:function(e){i(h.stopSearchBeacons,{},e)},onSearchBeacons:function(e){t(h.onSearchBeacons,e)},openEnterpriseChat:function(e){i("openEnterpriseChat",{useridlist:e.userIds,chatname:e.groupName},e)},launchMiniProgram:function(e){i("launchMiniProgram",{targetAppId:e.targetAppId,path:g(e.path),envVersion:e.envVersion},e)},miniProgram:{navigateBack:function(e){e=e||{},f(function(){i("invokeMiniProgramAPI",{name:"navigateBack",arg:{delta:e.delta||1}},e)})},navigateTo:function(e){f(function(){i("invokeMiniProgramAPI",{name:"navigateTo",arg:{url:e.url}},e)})},redirectTo:function(e){f(function(){i("invokeMiniProgramAPI",{name:"redirectTo",arg:{url:e.url}},e)})},switchTab:function(e){f(function(){i("invokeMiniProgramAPI",{name:"switchTab",arg:{url:e.url}},e)})},reLaunch:function(e){f(function(){i("invokeMiniProgramAPI",{name:"reLaunch",arg:{url:e.url}},e)})},postMessage:function(e){f(function(){i("invokeMiniProgramAPI",{name:"postMessage",arg:e.data||{}},e)})},getEnv:function(n){f(function(){n({miniprogram:"miniprogram"===e.__wxjs_environment})})}}},E=1,U={};return I.addEventListener("error",function(e){if(!x){var n=e.target,i=n.tagName,t=n.src;if(("IMG"==i||"VIDEO"==i||"AUDIO"==i||"SOURCE"==i)&&-1!=t.indexOf("wxlocalresource://")){e.preventDefault(),e.stopPropagation();var a=n["wx-id"];if(a||(a=E++,n["wx-id"]=a),U[a])return;U[a]=!0,wx.ready(function(){wx.getLocalImgData({localId:t,success:function(e){n.src=e.localData}})})}}},!0),I.addEventListener("load",function(e){if(!x){var n=e.target,i=n.tagName;if(n.src,"IMG"==i||"VIDEO"==i||"AUDIO"==i||"SOURCE"==i){var t=n["wx-id"];t&&(U[t]=!1)}}},!0),n&&(e.wx=e.jWeixin=B),B}})},"251b":function(e,n,i){},"734b":function(e,n,i){"use strict";var t=i("251b"),a=i.n(t);a.a},edcc:function(e,n,i){"use strict";i.r(n);var t=function(){var e=this,n=e.$createElement,i=e._self._c||n;return i("div",{staticClass:"benefit"},[i("div",{staticClass:"card",style:{background:"url("+e.getImg(this.$route.params.vipCardImage,"690*202")+") no-repeat center","background-size":"100% 100%"}},[e.StorageVipId==this.$route.params.vipInfoHdId&&e.status>0?i("p",{staticClass:"isNowMember"},[e._v("当前账号")]):e._e(),e.StorageVipId!=this.$route.params.vipInfoHdId&&e.status>0?i("p",{staticClass:"isNowMember"},[e._v("其他账号")]):e._e(),i("div",{staticClass:"member-name"},[i("p",[e._v(e._s(this.$route.params.vipLevelName))]),i("p",[e._v(e._s(this.$route.params.vipMobilePhone))])])]),i("div",{staticClass:"panel-wrapper"},[i("div",{staticClass:"panel-flex"},[i("label",[e._v("专属特权：")]),i("br"),i("ul",{staticClass:"benefit-list"},[null==this.$route.params.lable||""==this.$route.params.lable?i("div",{staticClass:"content"},[e._v("暂无说明")]):i("div",{staticClass:"content",domProps:{innerHTML:e._s(this.$route.params.lable)}})])]),i("div",{staticClass:"panel-flex"},[i("label",[e._v("有效时间：")]),i("br"),new Date(this.$route.params.expireDate).getTime()-new Date("2099-12-31 00:00:00").getTime()>=0?i("p",{staticClass:"time"},[e._v("长期有效")]):i("p",{staticClass:"time"},[e._v("至"+e._s(this.$route.params.expireDate))])])])])},a=[],o=(i("28a5"),i("2b61")),r=i("22ce"),s=i("18a0"),c=i.n(s),d={data:function(){return{benefit:{},cardBenefit:[],StorageVipId:"",vipId:"",status:""}},methods:{goCardList:function(){this.$router.push("/member-card-list")},getWechatConfig:function(){var e=this;if(0!==this.benefit.expiringFlag){var n={card_id:this.benefit.wxId,code:this.benefit.cardNo,isNeedOpenid:0,openId:o["a"].get("WECHAT_INFO").openid,wxuuid:baseConstant.wxUnionid||o["a"].get("properties").wxUnionid};r["m"].getWxconfig(n).then(function(n){var i=window.location.href.split("#")[0],t={wxUUID:baseConstant.wxUnionid||o["a"].get("properties").wxUnionid,unAuthorizedUrl:encodeURIComponent(i)};r["g"].getWxSignature(t).then(function(i){e.wxInit(i,e.benefit.wxId,n)})})}},wxInit:function(e,n,i){c.a.config({debug:!1,appId:e.appId,timestamp:e.timeStamp,nonceStr:e.nonceStr,signature:e.signature,jsApiList:["addCard"]}),c.a.ready(function(){c.a.addCard({cardList:[{cardId:n,cardExt:JSON.stringify(i)}],success:function(e){Toast("添加成功~");e.cardList}})})}},created:function(){this.StorageVipId=o["a"].get("USER_INFO").vipInfoId,this.status=o["a"].get("USER_INFO").relationAccountLength}},u=d,l=(i("734b"),i("2877")),p=Object(l["a"])(u,t,a,!1,null,"eb43f5aa",null);n["default"]=p.exports}}]);