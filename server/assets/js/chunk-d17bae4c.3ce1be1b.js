(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d17bae4c"],{"1a41":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"phoneBox",staticClass:"popup-phone"},[n("div",{staticClass:"wrapper phone-box"},[n("div",{staticClass:"titile",on:{click:function(e){t.close()}}},[t._v("\n            绑定手机号\n            "),n("i",{staticClass:"iconfont icon-guanbi popup-close"})]),n("div",{staticClass:"form-box"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.phoneNum,expression:"phoneNum"},{name:"inputfix",rawName:"v-inputfix"}],staticClass:"wd100",attrs:{type:"tel",placeholder:"请输入手机号",maxlength:"11"},domProps:{value:t.phoneNum},on:{input:[function(e){e.target.composing||(t.phoneNum=e.target.value)},t.phoneRule]}})]),n("div",{staticClass:"form-box"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.captcha,expression:"captcha"},{name:"inputfix",rawName:"v-inputfix"}],staticClass:"captcha-text fl",attrs:{type:"tel",placeholder:"请输入验证码",maxlength:"6"},domProps:{value:t.captcha},on:{input:function(e){e.target.composing||(t.captcha=e.target.value)}}}),n("button",{staticClass:"captcha-btn color-mian fr",class:[1==t.captchaLocked?"disabled":""],on:{click:t.checkPhone}},[t._v(t._s(t.captchaText))])]),n("div",{staticClass:"bottom-btns",on:{click:t.bindPhone}},[t._v("立即绑定")])])])},s=[],a=(n("e7e5"),n("d399")),i=(n("a481"),n("8a58"),n("e41f")),c=n("22ce"),d=n("2b61"),r={props:{},components:{"van-popup":i["a"]},data:function(){return{phoneNum:"",captcha:"",captchaText:"点击获取验证码",captchaLocked:!1,isSendCaptcha:!1,time:60,checkStatus:!1,btnLock:!1}},methods:{close:function(){this.$emit("bindPhoneCallback",!1)},getUser:function(){var t=this,e={};c["k"].getUserInfo(e).then(function(e){t.userInfo=e})},phoneRule:function(){this.phoneNum=this.phoneNum.replace(/\D/g,"")},checkPhone:function(){var t=this;if(!0!==this.captchaLocked)if(isPhone(this.phoneNum)){var e={ctmUsrId:d["a"].get("USER_INFO").ctmUsrId,mobile:this.phoneNum,buscontsId:baseConstant.busContsCode};c["k"].checkWxPhone(e).then(function(e){t.checkStatus=!0,t.getCaptcha()},function(t){Object(a["a"])(t.errorMsg)})}else Object(a["a"])("请填写正确的手机号")},getCaptcha:function(){var t=this;if(!0!==this.captchaLocked&&!1!==this.checkStatus){this.captchaLocked=!0;var e=this.phoneNum,n={mobile:e,verifyClassCode:"VERIFY_BIND_MOBILE"};c["k"].getCaptcha(n).then(function(t){},function(t){}).then(function(){t.isSendCaptcha=!0}),this.countDown()}},countDown:function(){var t=this;t.captchaLocked=!0,t.captchaText="验证码已发送";var e=window.setInterval(function(){t.captchaText="重新获取"+t.time+"s",t.time--<=0&&(t.time=60,t.captchaLocked=!1,t.captchaText="点击获取验证码",window.clearInterval(e))},1e3)},bindPhone:function(){var t=this;if(!0===this.btnLock)return!1;if(this.btnLock=!0,!isPhone(this.phoneNum))return Object(a["a"])("请填写正确的手机号"),this.btnLock=!1,!1;if(!this.captcha)return Object(a["a"])("请先填写验证码"),this.btnLock=!1,!1;if(!0!==this.isSendCaptcha)return Object(a["a"])("请先获取验证码"),this.btnLock=!1,!1;if(!1===this.checkStatus)return Object(a["a"])("该手机号已经被绑定了~"),this.btnLock=!1,!1;var e={mobilePhone:this.phoneNum,registCode:this.captcha,usrId:d["a"].get("USER_INFO").usrId,companyId:d["a"].get("USER_INFO").companyId,verifyType:"D_VERIFYLOG",verifyClassCode:"VERIFY_BIND_MOBILE"};c["k"].checkCaptcha(e).then(function(){var e={mobile:t.phoneNum};c["k"].bindMobile(e).then(function(){combineLogin().then(function(e){t.btnLock=!1,e?t.$emit("bindPhoneCallback",!0):(Object(a["a"])("绑定手机号出错~"),t.$emit("bindPhoneCallback",!1))})},function(){Object(a["a"])("绑定手机号出错~"),t.$emit("bindPhoneCallback",!1)})},function(t){Object(a["a"])("手机验证码错误")}).then(function(){t.btnLock=!1})}},created:function(){this.successUrl=this.$route.query.successUrl},mounted:function(){}},u=r,h=(n("2a2c"),n("2877")),p=Object(h["a"])(u,o,s,!1,null,"766fd2f9",null);e["a"]=p.exports},"289c":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"iframe-web-design"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.showLoading,expression:"showLoading"}],staticClass:"loading"},[n("div",{staticClass:"load-text"},[n("van-loading",{attrs:{type:"spinner",size:"48px",vertical:""}}),n("p",[t._v("加载中...")])],1)]),n("iframe",{staticClass:"design-iframe",attrs:{id:"iframePage",src:t.url}}),n("van-popup",{model:{value:t.showPopup,callback:function(e){t.showPopup=e},expression:"showPopup"}},[n("phone-popup",{on:{bindPhoneCallback:t.bindPhoneCallback}})],1)],1)},s=[],a=(n("8a58"),n("e41f")),i=(n("ac1e"),n("543e")),c=n("2b61"),d=n("22ce"),r=n("1a41"),u={name:"web-design",data:function(){return{isShelves:!1,goodsCode:"",url:"",showLoading:!0,operate:null,showPopup:!1,showMessage:"",rtlDesignHdId:"",spGoodsDtDesignId:""}},components:{"van-loading":i["a"],"van-popup":a["a"],phonePopup:r["a"]},methods:{addEventMessage:function(){var t=this;window.addEventListener("message",function(e){e.data.isShowLoading||(t.showLoading=!1)},!1)},postMessage:function(t,e){var n=document.getElementById("iframePage");n.contentWindow.postMessage({isBindPhone:t,operate:e},this.url)},bindPhoneCallback:function(t){t?(this.showPopup=!1,this.postMessage(!0,this.operate)):this.showPopup=!1},saveHistory:function(){var t=this,e={usrId:c["a"].get("USER_INFO")?c["a"].get("USER_INFO").usrId:0,busContsCode:baseConstant.busContsCode,goodsCode:this.$route.query.goodsCode||"",shopId:c["a"].get("properties").shopId};d["d"].getGoodsInfo(e).then(function(e){t.goodsInfo=e;var n={usrId:c["a"].get("USER_INFO").usrId,busContsCode:baseConstant.busContsCode,ctmUsrId:c["a"].get("USER_INFO").usrId,dptId:c["a"].get("properties").shopId,salePrice:e.salePrice,tagPrice:e.tagPrice,ptiPartHdId:e.ptiPartHdId};d["k"].saveFootprint(n).then(function(t){},function(t){})})}},created:function(){var t=this;this.rtlDesignHdId=this.$route.query.rtlDesignHdId,this.spGoodsDtDesignId=this.$route.query.spGoodsDtDesignId,this.$nextTick(function(){var e=c["a"].get("COMPANYID").company_id,n=JSON.stringify(c["a"].get("USER_INFO"));n&&t.saveHistory();var o=window.location.origin+"/standard/#/",s=(c["a"].get("TEMPLATE_INFO"),t.$route.query.goodsCode||""),a=function(s){var a={ownCompanyId:e,goodsCode:s,buscontsCode:baseConstant.busContsCode};d["d"].isShelves(a).then(function(a){if(a){var i=a.ptiPartHdId;a.goodsName&&(document.title=a.goodsName),t.addEventMessage(),t.url=o+"newWebDesign?companyId="+e+"&busContsCode="+baseConstant.busContsCode+"&goodsCode="+s+"&goodsId="+i+"&goodsName="+a.goodsName+"&userInfo="+n,window.addEventListener("message",function(e){e.data.isBindPhone&&(t.showPopup=!0),t.operate=e.data.operate},!1),t.rtlDesignHdId&&(t.url+="&rtlDesignHdId="+t.rtlDesignHdId),t.spGoodsDtDesignId&&(t.url+="&spGoodsDtDesignId="+t.spGoodsDtDesignId)}a||t.$router.push({path:"/off-shelves",query:{page:"web-design"}})})};a(s)})}},h=u,p=(n("7308"),n("2877")),l=Object(p["a"])(h,o,s,!1,null,"f0da4dd4",null);e["default"]=l.exports},"2a2c":function(t,e,n){"use strict";var o=n("d68d"),s=n.n(o);s.a},7308:function(t,e,n){"use strict";var o=n("d278"),s=n.n(o);s.a},"8a58":function(t,e,n){"use strict";n("68ef"),n("4d75")},ac1e:function(t,e,n){"use strict";n("68ef")},d278:function(t,e,n){},d68d:function(t,e,n){},e41f:function(t,e,n){"use strict";var o=n("a142"),s=n("6605"),a=Object(o["i"])("popup"),i=a[0],c=a[1];e["a"]=i({mixins:[s["a"]],props:{position:String,transition:String,overlay:{type:Boolean,default:!0},closeOnClickOverlay:{type:Boolean,default:!0}},render:function(t){var e,n=this;if(this.shouldRender){var o=this.position,s=function(t){return function(){return n.$emit(t)}},a=this.transition||(o?"van-popup-slide-"+o:"van-fade");return t("transition",{attrs:{name:a},on:{afterEnter:s("opened"),afterLeave:s("closed")}},[t("div",{directives:[{name:"show",value:this.value}],class:c((e={},e[o]=o,e))},[this.slots()])])}}})}}]);