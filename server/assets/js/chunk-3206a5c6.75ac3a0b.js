(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3206a5c6"],{"0135":function(e,t,n){},1146:function(e,t,n){},"2cc2":function(e,t,n){"use strict";var i=n("0135"),r=n.n(i);r.a},"565f":function(e,t,n){"use strict";var i=n("2638"),r=n.n(i),s=n("1988"),o=n("ad06"),a=n("7744"),c=n("dfaf"),u=n("a142"),l=n("db78"),h=n("023d");function f(e){return/^\d+$/.test(e)}var d=Object(u["i"])("field"),m=d[0],b=d[1];t["a"]=m({inheritAttrs:!1,props:Object(s["a"])({},c["a"],{error:Boolean,leftIcon:String,rightIcon:String,readonly:Boolean,clearable:Boolean,labelWidth:[String,Number],labelAlign:String,inputAlign:String,onIconClick:Function,autosize:[Boolean,Object],errorMessage:String,errorMessageAlign:String,type:{type:String,default:"text"}}),data:function(){return{focused:!1}},watch:{value:function(){this.$nextTick(this.adjustSize)}},mounted:function(){this.format(),this.$nextTick(this.adjustSize)},computed:{showClear:function(){return this.clearable&&this.focused&&""!==this.value&&Object(u["c"])(this.value)&&!this.readonly},listeners:function(){return Object(s["a"])({},this.$listeners,{input:this.onInput,keypress:this.onKeypress,focus:this.onFocus,blur:this.onBlur})},labelStyle:function(){var e=this.labelWidth;if(e){var t=f(String(e))?e+"px":e;return{maxWidth:t,minWidth:t}}}},methods:{focus:function(){this.$refs.input&&this.$refs.input.focus()},blur:function(){this.$refs.input&&this.$refs.input.blur()},format:function(e){void 0===e&&(e=this.$refs.input);var t=e,n=t.value,i=this.$attrs.maxlength;return"number"===this.type&&Object(u["c"])(i)&&n.length>i&&(n=n.slice(0,i),e.value=n),n},onInput:function(e){this.$emit("input",this.format(e.target))},onFocus:function(e){this.focused=!0,this.$emit("focus",e),this.readonly&&this.blur()},onBlur:function(e){this.focused=!1,this.$emit("blur",e),Object(u["d"])()&&window.scrollTo(0,Object(h["b"])())},onClickLeftIcon:function(){this.$emit("click-left-icon")},onClickRightIcon:function(){this.$emit("click-icon"),this.$emit("click-right-icon"),this.onIconClick&&this.onIconClick()},onClear:function(e){Object(l["c"])(e),this.$emit("input",""),this.$emit("clear")},onKeypress:function(e){if("number"===this.type){var t=e.keyCode,n=-1===String(this.value).indexOf("."),i=t>=48&&t<=57||46===t&&n||45===t;i||Object(l["c"])(e)}"search"===this.type&&13===e.keyCode&&this.blur(),this.$emit("keypress",e)},adjustSize:function(){var e=this.$refs.input;if("textarea"===this.type&&this.autosize&&e){e.style.height="auto";var t=e.scrollHeight;if(Object(u["f"])(this.autosize)){var n=this.autosize,i=n.maxHeight,r=n.minHeight;i&&(t=Math.min(t,i)),r&&(t=Math.max(t,r))}t&&(e.style.height=t+"px")}},renderInput:function(){var e=this.$createElement,t={ref:"input",class:b("control",this.inputAlign),domProps:{value:this.value},attrs:Object(s["a"])({},this.$attrs,{readonly:this.readonly}),on:this.listeners};return"textarea"===this.type?e("textarea",r()([{},t])):e("input",r()([{attrs:{type:this.type}},t]))},renderLeftIcon:function(){var e=this.$createElement,t=this.slots("left-icon")||this.leftIcon;if(t)return e("div",{class:b("left-icon"),on:{click:this.onClickLeftIcon}},[this.slots("left-icon")||e(o["a"],{attrs:{name:this.leftIcon}})])},renderRightIcon:function(){var e=this.$createElement,t=this.slots,n=t("right-icon")||t("icon")||this.rightIcon||this.icon;if(n)return e("div",{class:b("right-icon"),on:{click:this.onClickRightIcon}},[t("right-icon")||t("icon")||e(o["a"],{attrs:{name:this.rightIcon||this.icon}})])}},render:function(e){var t,n=this.slots,i=this.labelAlign,r={icon:this.renderLeftIcon};return n("label")&&(r.title=function(){return n("label")}),e(a["a"],{attrs:{icon:this.leftIcon,size:this.size,title:this.label,center:this.center,border:this.border,isLink:this.isLink,required:this.required,titleStyle:this.labelStyle,titleClass:b("label",i)},class:b((t={error:this.error,disabled:this.$attrs.disabled},t["label-"+i]=i,t["min-height"]="textarea"===this.type&&!this.autosize,t)),scopedSlots:r},[e("div",{class:b("body")},[this.renderInput(),this.showClear&&e(o["a"],{attrs:{name:"clear"},class:b("clear"),on:{touchstart:this.onClear}}),this.renderRightIcon(),n("button")&&e("div",{class:b("button")},[n("button")])]),this.errorMessage&&e("div",{class:b("error-message",this.errorMessageAlign)},[this.errorMessage])])}})},7744:function(e,t,n){"use strict";var i=n("1988"),r=n("2638"),s=n.n(r),o=n("a142"),a=n("dfaf"),c=n("ba31"),u=n("48f4"),l=n("ad06"),h=Object(o["i"])("cell"),f=h[0],d=h[1];function m(e,t,n,i){var r=t.icon,a=t.size,h=t.title,f=t.label,m=t.value,b=t.isLink,p=t.arrowDirection,v=n.title||Object(o["c"])(h),g=n["default"]||Object(o["c"])(m),k=n.label||Object(o["c"])(f),C=k&&e("div",{class:[d("label"),t.labelClass]},[n.label?n.label():f]),w=v&&e("div",{class:[d("title"),t.titleClass],style:t.titleStyle},[n.title?n.title():e("span",[h]),C]),I=g&&e("div",{class:[d("value",{alone:!n.title&&!h}),t.valueClass]},[n["default"]?n["default"]():e("span",[m])]),O=n.icon?n.icon():r&&e(l["a"],{class:d("left-icon"),attrs:{name:r}}),y=n["right-icon"],x=y?y():b&&e(l["a"],{class:d("right-icon"),attrs:{name:p?"arrow-"+p:"arrow"}}),j=function(e){Object(c["a"])(i,"click",e),Object(u["a"])(i)},P={center:t.center,required:t.required,borderless:!t.border,clickable:b||t.clickable};return a&&(P[a]=a),e("div",s()([{class:d(P),on:{click:j}},Object(c["b"])(i)]),[O,w,I,x,n.extra&&n.extra()])}m.props=Object(i["a"])({},a["a"],u["c"],{clickable:Boolean,arrowDirection:String}),t["a"]=f(m)},"907f":function(e,t){(function(){"use strict";function t(e,t){var n=(65535&e)+(65535&t),i=(e>>16)+(t>>16)+(n>>16);return i<<16|65535&n}function n(e,t){return e<<t|e>>>32-t}function i(e,i,r,s,o,a){return t(n(t(t(i,e),t(s,a)),o),r)}function r(e,t,n,r,s,o,a){return i(t&n|~t&r,e,t,s,o,a)}function s(e,t,n,r,s,o,a){return i(t&r|n&~r,e,t,s,o,a)}function o(e,t,n,r,s,o,a){return i(t^n^r,e,t,s,o,a)}function a(e,t,n,r,s,o,a){return i(n^(t|~r),e,t,s,o,a)}function c(e,n){e[n>>5]|=128<<n%32,e[14+(n+64>>>9<<4)]=n;var i,c,u,l,h,f=1732584193,d=-271733879,m=-1732584194,b=271733878;for(i=0;i<e.length;i+=16)c=f,u=d,l=m,h=b,f=r(f,d,m,b,e[i],7,-680876936),b=r(b,f,d,m,e[i+1],12,-389564586),m=r(m,b,f,d,e[i+2],17,606105819),d=r(d,m,b,f,e[i+3],22,-1044525330),f=r(f,d,m,b,e[i+4],7,-176418897),b=r(b,f,d,m,e[i+5],12,1200080426),m=r(m,b,f,d,e[i+6],17,-1473231341),d=r(d,m,b,f,e[i+7],22,-45705983),f=r(f,d,m,b,e[i+8],7,1770035416),b=r(b,f,d,m,e[i+9],12,-1958414417),m=r(m,b,f,d,e[i+10],17,-42063),d=r(d,m,b,f,e[i+11],22,-1990404162),f=r(f,d,m,b,e[i+12],7,1804603682),b=r(b,f,d,m,e[i+13],12,-40341101),m=r(m,b,f,d,e[i+14],17,-1502002290),d=r(d,m,b,f,e[i+15],22,1236535329),f=s(f,d,m,b,e[i+1],5,-165796510),b=s(b,f,d,m,e[i+6],9,-1069501632),m=s(m,b,f,d,e[i+11],14,643717713),d=s(d,m,b,f,e[i],20,-373897302),f=s(f,d,m,b,e[i+5],5,-701558691),b=s(b,f,d,m,e[i+10],9,38016083),m=s(m,b,f,d,e[i+15],14,-660478335),d=s(d,m,b,f,e[i+4],20,-405537848),f=s(f,d,m,b,e[i+9],5,568446438),b=s(b,f,d,m,e[i+14],9,-1019803690),m=s(m,b,f,d,e[i+3],14,-187363961),d=s(d,m,b,f,e[i+8],20,1163531501),f=s(f,d,m,b,e[i+13],5,-1444681467),b=s(b,f,d,m,e[i+2],9,-51403784),m=s(m,b,f,d,e[i+7],14,1735328473),d=s(d,m,b,f,e[i+12],20,-1926607734),f=o(f,d,m,b,e[i+5],4,-378558),b=o(b,f,d,m,e[i+8],11,-2022574463),m=o(m,b,f,d,e[i+11],16,1839030562),d=o(d,m,b,f,e[i+14],23,-35309556),f=o(f,d,m,b,e[i+1],4,-1530992060),b=o(b,f,d,m,e[i+4],11,1272893353),m=o(m,b,f,d,e[i+7],16,-155497632),d=o(d,m,b,f,e[i+10],23,-1094730640),f=o(f,d,m,b,e[i+13],4,681279174),b=o(b,f,d,m,e[i],11,-358537222),m=o(m,b,f,d,e[i+3],16,-722521979),d=o(d,m,b,f,e[i+6],23,76029189),f=o(f,d,m,b,e[i+9],4,-640364487),b=o(b,f,d,m,e[i+12],11,-421815835),m=o(m,b,f,d,e[i+15],16,530742520),d=o(d,m,b,f,e[i+2],23,-995338651),f=a(f,d,m,b,e[i],6,-198630844),b=a(b,f,d,m,e[i+7],10,1126891415),m=a(m,b,f,d,e[i+14],15,-1416354905),d=a(d,m,b,f,e[i+5],21,-57434055),f=a(f,d,m,b,e[i+12],6,1700485571),b=a(b,f,d,m,e[i+3],10,-1894986606),m=a(m,b,f,d,e[i+10],15,-1051523),d=a(d,m,b,f,e[i+1],21,-2054922799),f=a(f,d,m,b,e[i+8],6,1873313359),b=a(b,f,d,m,e[i+15],10,-30611744),m=a(m,b,f,d,e[i+6],15,-1560198380),d=a(d,m,b,f,e[i+13],21,1309151649),f=a(f,d,m,b,e[i+4],6,-145523070),b=a(b,f,d,m,e[i+11],10,-1120210379),m=a(m,b,f,d,e[i+2],15,718787259),d=a(d,m,b,f,e[i+9],21,-343485551),f=t(f,c),d=t(d,u),m=t(m,l),b=t(b,h);return[f,d,m,b]}function u(e){var t,n="";for(t=0;t<32*e.length;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function l(e){var t,n=[];for(n[(e.length>>2)-1]=void 0,t=0;t<n.length;t+=1)n[t]=0;for(t=0;t<8*e.length;t+=8)n[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return n}function h(e){return u(c(l(e),8*e.length))}function f(e){var t,n,i="0123456789abcdef",r="";for(n=0;n<e.length;n+=1)t=e.charCodeAt(n),r+=i.charAt(t>>>4&15)+i.charAt(15&t);return r}function d(e){return unescape(encodeURIComponent(e))}function m(e){return h(d(e))}function b(e){return f(m(e))}function p(e,t){return void 0!==t&&null!==t&&""!==t&&(e=e+"{"+t+"}"),b(e)}e.exports=function(e,t){if(void 0===e||null===e)throw new Error("Illegal argument "+e);return p(e,t)}})()},be7f:function(e,t,n){"use strict";n("68ef"),n("1146")},c06b:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"cont"},[n("div",{directives:[{name:"show",rawName:"v-show",value:"userList"===e.currentPage,expression:"currentPage === 'userList'"}]},[n("p",{staticClass:"tip"},[e._v("经系统检测，以下账号同属于您，请您确认，")]),n("p",{staticClass:"tip"},[e._v("确认后，系统会将您的部分信息整合在一起")]),n("ul",{staticClass:"user-list"},e._l(e.memberList,function(t,i){return n("li",{key:t.id,staticClass:"user-item"},[e._v(e._s(e._f("phoneMask")(t.mobilePhone))+"（"+e._s(t.vipAccount)+"）")])})),n("div",{staticClass:"sure-btn",on:{click:function(t){e.currentPage="checkNote"}}},[e._v("去确认")])]),n("div",{directives:[{name:"show",rawName:"v-show",value:"checkAccount"===e.currentPage||"checkNote"===e.currentPage,expression:"currentPage === 'checkAccount' || currentPage === 'checkNote'"}]},[e.activeMemberInfo?n("p",{staticClass:"tip check-tip"},[e._v("\n            请输入账号"+e._s(e._f("phoneMask")(e.activeMemberInfo.mobilePhone))+"（"+e._s(e.activeMemberInfo.vipAccount)+"）的\n            "+e._s("checkAccount"===e.currentPage?"账号及密码":"完整手机号")+"\n        ")]):e._e(),n("ul",{directives:[{name:"show",rawName:"v-show",value:"checkNote"===e.currentPage,expression:"currentPage === 'checkNote'"}],staticClass:"form-list"},[n("li",{staticClass:"form-item"},[n("p",{staticClass:"form-describe"},[e._v("请输入绑定的手机号")]),n("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"input-style",attrs:{type:"number"},on:{input:function(t){e.changePhone("form.phone",11)}},model:{value:e.form.phone,callback:function(t){e.$set(e.form,"phone",t)},expression:"form.phone"}})],1),n("li",{staticClass:"form-item"},[n("p",{staticClass:"form-describe"},[e._v("请输入验证码")]),n("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"input-style",attrs:{type:"number"},on:{input:function(t){e.changePhone("form.noteCode",6)}},model:{value:e.form.noteCode,callback:function(t){e.$set(e.form,"noteCode",t)},expression:"form.noteCode"}}),n("div",{class:["phone-code",{"is-send":e.countDownCode>0}],on:{click:e.getNoteCode}},[e._v("获取验证码"+e._s(e.countDownCode>0?"("+e.countDownCode+")":""))]),n("div",{staticClass:"other-check",on:{click:function(t){e.currentPage="checkAccount"}}},[e._v("其他验证方式")])],1)]),n("ul",{directives:[{name:"show",rawName:"v-show",value:"checkAccount"===e.currentPage,expression:"currentPage === 'checkAccount'"}],staticClass:"form-list"},[n("li",{staticClass:"form-item"},[n("p",{staticClass:"form-describe"},[e._v("请输入手机号/用户名")]),n("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"input-style",model:{value:e.form.phoneOrName,callback:function(t){e.$set(e.form,"phoneOrName",t)},expression:"form.phoneOrName"}})],1),n("li",{staticClass:"form-item"},[n("p",{staticClass:"form-describe"},[e._v("请输入登录密码")]),n("van-field",{directives:[{name:"inputfix",rawName:"v-inputfix"}],staticClass:"input-style",attrs:{type:"password"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}}),n("div",{staticClass:"other-check",on:{click:function(t){e.currentPage="checkNote"}}},[e._v("其他验证方式")])],1)]),n("div",{staticClass:"flex-box footer-group-btn"},[n("div",{staticClass:"second-btn",on:{click:function(t){e.memberMergeOperator(1)}}},[e._v("此账号不是我的")]),n("div",{staticClass:"main-btn",on:{click:function(t){e.memberMergeOperator("checkNote"===e.currentPage?2:3)}}},[e._v("确定")])])])])},r=[],s=(n("96cf"),n("3b8d")),o=(n("e7e5"),n("d399")),a=(n("28a5"),n("be7f"),n("565f")),c=n("22ce"),u=n("2b61"),l=n("e98a"),h=n("907f"),f=n.n(h),d={components:{"van-field":a["a"]},mixins:[l["a"]],props:{},computed:{activeMemberInfo:function(){return this.memberList&&this.memberList.length>0?this.memberList[0]:null}},data:function(){return{currentPage:"userList",form:{phoneOrName:"",phone:"",password:"",noteCode:""},countDownCode:0,memberList:[]}},methods:{changePhone:function(e,t){var n=e.split(".");1===n.length?this[n[0]]&&this[n[0]].length>t&&(this[n[0]]=this[n[0]].substring(0,t)):this[n[0]][n[1]]&&this[n[0]][n[1]].length>t&&(this[n[0]][n[1]]=this[n[0]][n[1]].substring(0,t))},getNoteCode:function(){var e=this;if(!(this.countDownCode>0))if(isPhone(this.form.phone)&&this.activeMemberInfo.mobilePhone===this.form.phone){var t={mobile:this.form.phone,verifyClassCode:"VERIFY_VIP_TER"};c["k"].getCaptcha(t).then(function(t){"03"==t||"OK"==t?(e.countDownCode=60,e.countDown=setInterval(function(){e.countDownCode<=0&&clearInterval(e.countDown),e.countDownCode--},1e3)):Object(o["a"])("短信发送失败")},function(e){})}else Object(o["a"])("请输入正确的手机号")},memberMergeOperator:function(e){var t=this,n={vipInfoHdId:u["a"].get("USER_INFO").vipInfoId,confirmFlag:e},i={};switch(e){case 0:var r=this.memberList.map(function(e){return e.id});i={ids:r};break;case 1:i={relId:this.activeMemberInfo.id,relVipInfoHdId:this.activeMemberInfo.vipInfoHdId};break;case 2:if(!isPhone(this.form.phone)||this.activeMemberInfo.mobilePhone!==this.form.phone)return void Object(o["a"])("请输入正确的手机号");if(!this.form.noteCode)return void Object(o["a"])("请输入验证码");i={relId:this.activeMemberInfo.id,relVipInfoHdId:this.activeMemberInfo.vipInfoHdId,account:this.form.phone,verifyClassCode:"VERIFY_VIP_TER",verifyCode:this.form.noteCode};break;case 3:if(console.log(),!(this.form.phoneOrName&&this.form.password.length>=6))return void Object(o["a"])("账号密码校验失败！");i={relId:this.activeMemberInfo.id,relVipInfoHdId:this.activeMemberInfo.vipInfoHdId,account:this.form.phoneOrName,verifyCode:f()(this.form.password)};break}Object.assign(n,i),c["k"].memberMergeOperator(n).then(function(){var n=Object(s["a"])(regeneratorRuntime.mark(function n(i){var r;return regeneratorRuntime.wrap(function(n){while(1)switch(n.prev=n.next){case 0:if(1==i){n.next=3;break}return Object(o["a"])("操作失败"),n.abrupt("return");case 3:r=function(){1==t.memberList.length&&Object(o["a"])("账号验证成功！")},n.t0=e,n.next=0===n.t0?7:1===n.t0?8:2===n.t0?10:3===n.t0?13:15;break;case 7:return n.abrupt("break",15);case 8:return 1===i&&1==t.memberList.length&&Object(o["a"])("已无可整合的账号"),n.abrupt("break",15);case 10:return t.countDownCode=0,r(),n.abrupt("break",15);case 13:return r(),n.abrupt("break",15);case 15:return n.next=17,t.m_getMemberList("dialog"===t.useParent?1:0);case 17:t.memberList=n.sent,t.memberList&&t.memberList.length?(t.form={phoneOrName:"",phone:"",password:"",noteCode:""},t.countDownCode=0):t.$router.go(-1);case 19:case"end":return n.stop()}},n)}));return function(e){return n.apply(this,arguments)}}(),function(e){Object(o["a"])(e.errorMsg)})}},watch:{currentPage:{immediate:!0,handler:function(e){var t="";switch(e){case"userList":t="账号整合";break;case"checkAccount":t="验证身份";break;case"checkNote":t="验证身份";break}document.title=t,this.$emit("changePage",{pageCode:e,pageTitle:t})}},memberList:{deep:!0,immediate:!0,handler:function(e){updateRelationAccountLength(),this.$emit("changeList",e)}}},created:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.useParent=this.$route.query.useParent,this.currentPage="dialog"===this.useParent?"checkNote":"userList",e.next=4,this.m_getMemberList("dialog"===this.useParent?1:0);case 4:this.memberList=e.sent;case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()},m=d,b=(n("2cc2"),n("2877")),p=Object(b["a"])(m,i,r,!1,null,"512653e4",null);t["default"]=p.exports},dfaf:function(e,t,n){"use strict";n.d(t,"a",function(){return i});var i={icon:String,size:String,center:Boolean,isLink:Boolean,required:Boolean,titleStyle:null,titleClass:null,valueClass:null,labelClass:null,title:[String,Number],value:[String,Number],label:[String,Number],border:{type:Boolean,default:!0}}},e98a:function(e,t,n){"use strict";n("96cf");var i,r,s=n("3b8d"),o=n("22ce"),a=n("2b61"),c={methods:{m_getMemberList:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n,i,r=arguments;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=r.length>0&&void 0!==r[0]?r[0]:0,n={vipInfoHdId:a["a"].get("USER_INFO").vipInfoId,windowFlag:t},e.next=4,o["k"].memberMergeList(n);case 4:return i=e.sent,e.abrupt("return",i);case 6:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()}},u=c,l=n("2877"),h=Object(l["a"])(u,i,r,!1,null,null,null);t["a"]=h.exports}}]);