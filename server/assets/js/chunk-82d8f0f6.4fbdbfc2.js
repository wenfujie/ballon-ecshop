(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-82d8f0f6"],{"1a41":function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{ref:"phoneBox",staticClass:"popup-phone"},[n("div",{staticClass:"wrapper phone-box"},[n("div",{staticClass:"titile",on:{click:function(e){t.close()}}},[t._v("\n            绑定手机号\n            "),n("i",{staticClass:"iconfont icon-guanbi popup-close"})]),n("div",{staticClass:"form-box"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.phoneNum,expression:"phoneNum"},{name:"inputfix",rawName:"v-inputfix"}],staticClass:"wd100",attrs:{type:"tel",placeholder:"请输入手机号",maxlength:"11"},domProps:{value:t.phoneNum},on:{input:[function(e){e.target.composing||(t.phoneNum=e.target.value)},t.phoneRule]}})]),n("div",{staticClass:"form-box"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.captcha,expression:"captcha"},{name:"inputfix",rawName:"v-inputfix"}],staticClass:"captcha-text fl",attrs:{type:"tel",placeholder:"请输入验证码",maxlength:"6"},domProps:{value:t.captcha},on:{input:function(e){e.target.composing||(t.captcha=e.target.value)}}}),n("button",{staticClass:"captcha-btn color-mian fr",class:[1==t.captchaLocked?"disabled":""],on:{click:t.checkPhone}},[t._v(t._s(t.captchaText))])]),n("div",{staticClass:"bottom-btns",on:{click:t.bindPhone}},[t._v("立即绑定")])])])},a=[],i=(n("e7e5"),n("d399")),c=(n("a481"),n("8a58"),n("e41f")),s=n("22ce"),r=n("2b61"),u={props:{},components:{"van-popup":c["a"]},data:function(){return{phoneNum:"",captcha:"",captchaText:"点击获取验证码",captchaLocked:!1,isSendCaptcha:!1,time:60,checkStatus:!1,btnLock:!1}},methods:{close:function(){this.$emit("bindPhoneCallback",!1)},getUser:function(){var t=this,e={};s["k"].getUserInfo(e).then(function(e){t.userInfo=e})},phoneRule:function(){this.phoneNum=this.phoneNum.replace(/\D/g,"")},checkPhone:function(){var t=this;if(!0!==this.captchaLocked)if(isPhone(this.phoneNum)){var e={ctmUsrId:r["a"].get("USER_INFO").ctmUsrId,mobile:this.phoneNum,buscontsId:baseConstant.busContsCode};s["k"].checkWxPhone(e).then(function(e){t.checkStatus=!0,t.getCaptcha()},function(t){Object(i["a"])(t.errorMsg)})}else Object(i["a"])("请填写正确的手机号")},getCaptcha:function(){var t=this;if(!0!==this.captchaLocked&&!1!==this.checkStatus){this.captchaLocked=!0;var e=this.phoneNum,n={mobile:e,verifyClassCode:"VERIFY_BIND_MOBILE"};s["k"].getCaptcha(n).then(function(t){},function(t){}).then(function(){t.isSendCaptcha=!0}),this.countDown()}},countDown:function(){var t=this;t.captchaLocked=!0,t.captchaText="验证码已发送";var e=window.setInterval(function(){t.captchaText="重新获取"+t.time+"s",t.time--<=0&&(t.time=60,t.captchaLocked=!1,t.captchaText="点击获取验证码",window.clearInterval(e))},1e3)},bindPhone:function(){var t=this;if(!0===this.btnLock)return!1;if(this.btnLock=!0,!isPhone(this.phoneNum))return Object(i["a"])("请填写正确的手机号"),this.btnLock=!1,!1;if(!this.captcha)return Object(i["a"])("请先填写验证码"),this.btnLock=!1,!1;if(!0!==this.isSendCaptcha)return Object(i["a"])("请先获取验证码"),this.btnLock=!1,!1;if(!1===this.checkStatus)return Object(i["a"])("该手机号已经被绑定了~"),this.btnLock=!1,!1;var e={mobilePhone:this.phoneNum,registCode:this.captcha,usrId:r["a"].get("USER_INFO").usrId,companyId:r["a"].get("USER_INFO").companyId,verifyType:"D_VERIFYLOG",verifyClassCode:"VERIFY_BIND_MOBILE"};s["k"].checkCaptcha(e).then(function(){var e={mobile:t.phoneNum};s["k"].bindMobile(e).then(function(){combineLogin().then(function(e){t.btnLock=!1,e?t.$emit("bindPhoneCallback",!0):(Object(i["a"])("绑定手机号出错~"),t.$emit("bindPhoneCallback",!1))})},function(){Object(i["a"])("绑定手机号出错~"),t.$emit("bindPhoneCallback",!1)})},function(t){Object(i["a"])("手机验证码错误")}).then(function(){t.btnLock=!1})}},created:function(){this.successUrl=this.$route.query.successUrl},mounted:function(){}},h=u,p=(n("2a2c"),n("2877")),l=Object(p["a"])(h,o,a,!1,null,"766fd2f9",null);e["a"]=l.exports},"2a2c":function(t,e,n){"use strict";var o=n("d68d"),a=n.n(o);a.a},"305a":function(t,e,n){},"8a58":function(t,e,n){"use strict";n("68ef"),n("4d75")},b043:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"collocate-design"},[n("iframe",{attrs:{src:t.iframeUrl,id:"collocate"}}),n("van-popup",{model:{value:t.showPopup,callback:function(e){t.showPopup=e},expression:"showPopup"}},[n("phone-popup",{on:{bindPhoneCallback:t.bindPhoneCallback}})],1)],1)},a=[],i=(n("96cf"),n("3b8d")),c=(n("8a58"),n("e41f")),s=(n("bc3a"),n("22ce")),r=n("1a41"),u={name:"collocate-design",components:{"van-popup":c["a"],phonePopup:r["a"]},data:function(){return{iframeUrl:null,showPopup:!1,operate:null,code:null}},created:function(){var t=Object(i["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return document.title="单品搭配 "+this.$route.query.goodsName,t.next=3,s["f"].getSingleCode().then(function(t){e.code=t});case 3:this.iframeUrl=window.location.origin+"/dp/mobile/singleCollocate?flag=1&code="+this.code+"&companyCode="+this.$route.query.companyCode+"&shopCode="+this.$route.query.shopCode+"&usrId="+this.$route.query.usrId+"&vipInfoHdId="+this.$route.query.vipInfoHdId+"&partCode="+this.$route.query.partCode+"&partName="+this.$route.query.goodsName+"&busContsCode="+this.$route.query.busContsCode+"&showFlag=1&theme=ballon-ecshop&collocateCodeArr=[1,2]",window.addEventListener("message",function(t){t.data.isBindPhone&&(e.showPopup=!0),e.operate=t.data.operate,console.log("收到"+t.origin+"消息",t.data)},!1);case 5:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),methods:{bindPhoneCallback:function(t){t?(this.showPopup=!1,document.getElementById("collocate").contentWindow.postMessage({isBindPhone:!0,operate:this.operate},this.iframeUrl)):this.showPopup=!1}}},h=u,p=(n("d463"),n("2877")),l=Object(p["a"])(h,o,a,!1,null,"9c3c17a6",null);e["default"]=l.exports},d463:function(t,e,n){"use strict";var o=n("305a"),a=n.n(o);a.a},d68d:function(t,e,n){},e41f:function(t,e,n){"use strict";var o=n("a142"),a=n("6605"),i=Object(o["i"])("popup"),c=i[0],s=i[1];e["a"]=c({mixins:[a["a"]],props:{position:String,transition:String,overlay:{type:Boolean,default:!0},closeOnClickOverlay:{type:Boolean,default:!0}},render:function(t){var e,n=this;if(this.shouldRender){var o=this.position,a=function(t){return function(){return n.$emit(t)}},i=this.transition||(o?"van-popup-slide-"+o:"van-fade");return t("transition",{attrs:{name:i},on:{afterEnter:a("opened"),afterLeave:a("closed")}},[t("div",{directives:[{name:"show",value:this.value}],class:s((e={},e[o]=o,e))},[this.slots()])])}}})}}]);