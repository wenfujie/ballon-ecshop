(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7e3026fa"],{"0f76":function(t,e,a){},b86d:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"bind-wrapper"},[a("div",{staticClass:"form-wrapper"},[a("p",{staticClass:"form-text"},[t._v("手机号")]),a("div",{staticClass:"form-box"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.phoneNum,expression:"phoneNum"}],staticClass:"phone-text",attrs:{type:"tel",maxlength:"11"},domProps:{value:t.phoneNum},on:{input:function(e){e.target.composing||(t.phoneNum=e.target.value)}}})]),a("p",{staticClass:"form-text"},[t._v("验证码")]),a("div",{staticClass:"form-box"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.captcha,expression:"captcha"}],staticClass:"captcha-text",attrs:{type:"tel",maxlength:"6"},domProps:{value:t.captcha},on:{input:function(e){e.target.composing||(t.captcha=e.target.value)}}}),a("button",{staticClass:"captcha-btn",class:[1==t.captchaLocked?"disabled":""],on:{click:t.checkPhone}},[t._v(t._s(t.captchaText))])]),a("div",{staticClass:"bind-btn",on:{click:t.bindPhone}},[t._v("立即绑定")])])])},c=[],o=(a("a481"),a("e7e5"),a("d399")),s=a("2b61"),i=a("22ce"),r=(a("c5a3"),{data:function(){return{phoneNum:"",captcha:"",captchaText:"获取验证码",captchaLocked:!1,time:60,ctmUsrKey:"",companyKey:"",cookieKey:"",checkStatus:!1,btnLock:!1}},methods:{checkPhone:function(){var t=this;if(!0!==this.captchaLocked){var e=/^1(((5[0-35-9][0-9])|(7([0678])[ 0-9])|([3489][0-9]{2}))[0-9]{7})$/;if(e.test(this.phoneNum)){var a={ctmUsrId:s["a"].get("USER_INFO").ctmUsrId,mobile:this.phoneNum,buscontsId:baseConstant.busContsCode};i["k"].checkWxPhone(a).then(function(e){t.checkStatus=!0,t.getcaptcha()},function(t){Object(o["a"])(t.errorMsg)})}else Object(o["a"])("请填写正确的手机号")}},getcaptcha:function(){if(!0!==this.captchaLocked&&!1!==this.checkStatus){this.captchaLocked=!0;var t=this.phoneNum,e={mobile:t,verifyClassCode:"VERIFY_BIND_MOBILE"};i["k"].getCaptcha(e).then(function(t){},function(t){}),this.conutDown()}},conutDown:function(){var t=this;t.captchaLocked=!0,t.captchaText="验证码已发送";var e=window.setInterval(function(){t.captchaText="重新获取"+t.time+"s",t.time--<=0&&(t.time=60,t.captchaLocked=!1,t.captchaText="获取验证码",window.clearInterval(e))},1e3)},bindPhone:function(){var t=this;if(!0!==this.btnLock){this.btnLock=!0;var e=/^1(((5[0-35-9][0-9])|([34879][0-9]{2}))[0-9]{7})$/;if(!e.test(this.phoneNum))return Object(o["a"])("请填写正确的手机号"),this.btnLock=!1,!1;if(0==this.checkStatus)return Object(o["a"])("该手机号已经被绑定了~"),this.btnLock=!1,!1;if(!this.captcha)return Object(o["a"])("请先填写验证码"),this.btnLock=!1,!1;var a={usrId:s["a"].get("USER_INFO").usrId,companyId:s["a"].get("COMPANYID").company_id,mobilePhone:this.phoneNum,registCode:this.captcha,verifyType:"D_VERIFYLOG",verifyClassCode:"VERIFY_BIND_MOBILE"};i["k"].checkCaptcha(a).then(function(){var e={mobile:t.phoneNum};i["k"].bindMobile(e).then(function(e){combineLogin().then(function(e){t.btnLock=!1,e&&t.$router.replace(t.$route.params.toUrl||t.$route.query.toUrl||"/index")})},function(){Object(o["a"])("绑定出错了~"),t.btnLock=!1})},function(e){Object(o["a"])("手机验证码错误~"),t.btnLock=!1})}},bindCallback:function(){var t=this;console.log("callback");var e=s["a"].get("WECHAT_INFO"),a="";1==e.sex?a="D_MALE":2==e.sex&&(a="D_FEMALE");var n={companyId:s["a"].get("COMPANYID").company_id,shopId:s["a"].get("properties").shopId,busContsCode:baseConstant.busContsCode,unionId:e.unionid,openId:e.openid,signUpTypeCode:baseConstant.signUpTypeCode,usrName:e.nickname,url:e.headimgurl,sex:a};i["f"].userInfo(n).then(function(e){t.btnLock=!1;var a=s["a"].get("USER_INFO");a=Object.assign(a,e),s["a"].set("USER_INFO",a),Object(o["a"])("绑定手机号成功~"),e.usrId&&e.mobilePhone&&i["m"].sendCardCoupons({usrId:e.usrId||"",shopId:s["a"].get("properties").shopId,vipInfoHdId:e.vipInfoHdId||""}),t.$router.replace(t.$route.params.toUrl||"/index")},function(){t.btnLock=!1})}},created:function(){}}),h=r,p=(a("e1e9"),a("2877")),u=Object(p["a"])(h,n,c,!1,null,"21023d46",null);e["default"]=u.exports},e1e9:function(t,e,a){"use strict";var n=a("0f76"),c=a.n(n);c.a}}]);