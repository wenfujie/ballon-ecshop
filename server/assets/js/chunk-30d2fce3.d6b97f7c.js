(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-30d2fce3"],{"0bfb":function(e,t,n){"use strict";var i=n("cb7c");e.exports=function(){var e=i(this),t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.unicode&&(t+="u"),e.sticky&&(t+="y"),t}},2994:function(e,t,n){"use strict";n("68ef"),n("c0c2")},"2bdd":function(e,t,n){"use strict";var i=n("a142"),s=n("543e"),o=n("db78"),a=n("023d"),r=Object(i["i"])("list"),c=r[0],d=r[1],u=r[2];t["a"]=c({model:{prop:"loading"},props:{error:Boolean,loading:Boolean,finished:Boolean,errorText:String,loadingText:String,finishedText:String,immediateCheck:{type:Boolean,default:!0},offset:{type:Number,default:300},direction:{type:String,default:"down"}},mounted:function(){this.scroller=Object(a["c"])(this.$el),this.handler(!0),this.immediateCheck&&this.$nextTick(this.check)},destroyed:function(){this.handler(!1)},activated:function(){this.handler(!0)},deactivated:function(){this.handler(!1)},watch:{loading:function(){this.$nextTick(this.check)},finished:function(){this.$nextTick(this.check)}},methods:{check:function(){if(!(this.loading||this.finished||this.error)){var e=this.$el,t=this.scroller,n=Object(a["e"])(t);if(n&&"none"!==window.getComputedStyle(e).display&&null!==e.offsetParent){var i=this.offset,s=this.direction;o()&&(this.$emit("input",!0),this.$emit("load"))}}function o(){if(e===t){var o=Object(a["d"])(e);if("up"===s)return o<=i;var r=o+n;return t.scrollHeight-r<=i}if("up"===s)return Object(a["d"])(t)-Object(a["a"])(e)<=i;var c=Object(a["a"])(e)+Object(a["e"])(e)-Object(a["a"])(t);return c-n<=i}},clickErrorText:function(){this.$emit("update:error",!1),this.$nextTick(this.check)},handler:function(e){this.binded!==e&&(this.binded=e,(e?o["b"]:o["a"])(this.scroller,"scroll",this.check))}},render:function(e){return e("div",{class:d()},["down"===this.direction&&this.slots(),this.loading&&e("div",{class:d("loading"),key:"loading"},[this.slots("loading")||[e(s["a"],{class:d("loading-icon")}),e("span",{class:d("loading-text")},[this.loadingText||u("loading")])]]),this.finished&&this.finishedText&&e("div",{class:d("finished-text")},[this.finishedText]),this.error&&this.errorText&&e("div",{on:{click:this.clickErrorText},class:d("error-text")},[this.errorText]),"up"===this.direction&&this.slots()])}})},3846:function(e,t,n){n("9e1e")&&"g"!=/./g.flags&&n("86cc").f(RegExp.prototype,"flags",{configurable:!0,get:n("0bfb")})},5118:function(e,t,n){(function(e){var i="undefined"!==typeof e&&e||"undefined"!==typeof self&&self||window,s=Function.prototype.apply;function o(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new o(s.call(setTimeout,i,arguments),clearTimeout)},t.setInterval=function(){return new o(s.call(setInterval,i,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(i,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},n("6017"),t.setImmediate="undefined"!==typeof self&&self.setImmediate||"undefined"!==typeof e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!==typeof self&&self.clearImmediate||"undefined"!==typeof e&&e.clearImmediate||this&&this.clearImmediate}).call(this,n("c8ba"))},"5d72":function(e,t,n){"use strict";var i=n("a20a"),s=n.n(i);s.a},6017:function(e,t,n){(function(e,t){(function(e,n){"use strict";if(!e.setImmediate){var i,s=1,o={},a=!1,r=e.document,c=Object.getPrototypeOf&&Object.getPrototypeOf(e);c=c&&c.setTimeout?c:e,"[object process]"==={}.toString.call(e.process)?p():h()?m():e.MessageChannel?g():r&&"onreadystatechange"in r.createElement("script")?v():b(),c.setImmediate=d,c.clearImmediate=u}function d(e){"function"!==typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var a={callback:e,args:t};return o[s]=a,i(s),s++}function u(e){delete o[e]}function l(e){var t=e.callback,i=e.args;switch(i.length){case 0:t();break;case 1:t(i[0]);break;case 2:t(i[0],i[1]);break;case 3:t(i[0],i[1],i[2]);break;default:t.apply(n,i);break}}function f(e){if(a)setTimeout(f,0,e);else{var t=o[e];if(t){a=!0;try{l(t)}finally{u(e),a=!1}}}}function p(){i=function(e){t.nextTick(function(){f(e)})}}function h(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}function m(){var t="setImmediate$"+Math.random()+"$",n=function(n){n.source===e&&"string"===typeof n.data&&0===n.data.indexOf(t)&&f(+n.data.slice(t.length))};e.addEventListener?e.addEventListener("message",n,!1):e.attachEvent("onmessage",n),i=function(n){e.postMessage(t+n,"*")}}function g(){var e=new MessageChannel;e.port1.onmessage=function(e){var t=e.data;f(t)},i=function(t){e.port2.postMessage(t)}}function v(){var e=r.documentElement;i=function(t){var n=r.createElement("script");n.onreadystatechange=function(){f(t),n.onreadystatechange=null,e.removeChild(n),n=null},e.appendChild(n)}}function b(){i=function(e){setTimeout(f,0,e)}}})("undefined"===typeof self?"undefined"===typeof e?this:e:self)}).call(this,n("c8ba"),n("f28c"))},"6b54":function(e,t,n){"use strict";n("3846");var i=n("cb7c"),s=n("0bfb"),o=n("9e1e"),a="toString",r=/./[a],c=function(e){n("2aba")(RegExp.prototype,a,e,!0)};n("79e5")(function(){return"/a/b"!=r.call({source:"a",flags:"b"})})?c(function(){var e=i(this);return"/".concat(e.source,"/","flags"in e?e.flags:!o&&e instanceof RegExp?s.call(e):void 0)}):r.name!=a&&c(function(){return r.call(this)})},"8a58":function(e,t,n){"use strict";n("68ef"),n("4d75")},a20a:function(e,t,n){},c0c2:function(e,t,n){},e41f:function(e,t,n){"use strict";var i=n("a142"),s=n("6605"),o=Object(i["i"])("popup"),a=o[0],r=o[1];t["a"]=a({mixins:[s["a"]],props:{position:String,transition:String,overlay:{type:Boolean,default:!0},closeOnClickOverlay:{type:Boolean,default:!0}},render:function(e){var t,n=this;if(this.shouldRender){var i=this.position,s=function(e){return function(){return n.$emit(e)}},o=this.transition||(i?"van-popup-slide-"+i:"van-fade");return e("transition",{attrs:{name:o},on:{afterEnter:s("opened"),afterLeave:s("closed")}},[e("div",{directives:[{name:"show",value:this.value}],class:r((t={},t[i]=i,t))},[this.slots()])])}}})},ec8b:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"vouchers"},[e.cardList.length>0?n("van-list",{attrs:{finished:e.finished,"immediate-check":!1},on:{load:e.loadMore},model:{value:e.loading,callback:function(t){e.loading=t},expression:"loading"}},[e.cardList.length>0?n("ul",{staticClass:"vouchers-list"},e._l(e.cardList,function(t,i){return n("li",{directives:[{name:"show",rawName:"v-show",value:0!==t.couponCount,expression:"item.couponCount !== 0"}],key:i,staticClass:"vouchers-item"},[n("div",{staticClass:"detail"},[n("div",{staticClass:"left-box"},[n("p",{staticClass:"type"},[e._v(e._s(t.couponName))]),n("p",{staticClass:"value"},[n("span",{staticClass:"price"},[e._v(e._s(e._f("decimal")(t.couponValue)))]),n("span",[e._v(e._s(0!==t.cardType?"元":"折"))])]),1===t.isBuy&&t.buyPrice>0?n("p",{staticClass:"tip"},[e._v("仅售"+e._s(t.buyPrice)+"元")]):e._e()]),n("div",{staticClass:"right-box"},[null!==t.couponStartTime||null!==t.couponEndTime?n("p",{staticClass:"time"},[e._v("\n                            "+e._s(t.couponStartTime)+"\n                            "),n("br"),e._v("至\n                            "),n("br"),e._v("\n                            "+e._s(t.couponEndTime)+"\n                        ")]):e._e(),n("div",{staticClass:"btn",class:{"buy-btn":1===t.isBuy&&t.buyPrice>0},on:{click:function(n){e.getCard(t)}}},[e._v(e._s(1===t.isBuy&&t.buyPrice>0?"立即购买":"立即领取"))])])]),n("div",{staticClass:"explain",class:{"show-content":!0===t.wordBreak},on:{click:function(e){t.wordBreak=!t.wordBreak}}},[n("p",{staticClass:"instructions"},[e._v(e._s(t.instructions))]),e.instructionsScrollWidth[i]>e.instructionsOffsetWidth[i]?n("i",{staticClass:"iconfont icon-xialaxuan",attrs:{title:i}}):e._e()])])})):e._e()]):e._e(),e.cardList.length<1&&!e.loading?n("div",{staticClass:"empty-tip"}):e._e(),n("van-popup",{staticClass:"save-tip",attrs:{"overlay-class":"model-z-index"},model:{value:e.saveTip,callback:function(t){e.saveTip=t},expression:"saveTip"}},[e._v("领取成功")])],1)},s=[],o=(n("ac6a"),n("e7e5"),n("d399")),a=(n("96cf"),n("3b8d")),r=(n("6b54"),n("a481"),n("28a5"),n("2994"),n("2bdd")),c=(n("8a58"),n("e41f")),d=n("22ce"),u=n("2b61"),l=n("5118"),f={components:{"van-popup":c["a"],"van-list":r["a"]},data:function(){return{cardList:[],saveTip:!1,orderCode:"",btnLock:"",loading:!0,finished:!1,instructionsOffsetWidth:[],instructionsScrollWidth:[]}},filters:{dateFilter:function(e){var t=[];return t=e.split(" "),t[0].replace(/-/g,".")},decimal:function(e){var t=e.toString().split(".");return t.length>1?t[1].length>1?e.toFixed(2):e.toFixed(1):t[0]}},methods:{getList:function(){var e=Object(a["a"])(regeneratorRuntime.mark(function e(){var t,n=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.finished=!1,!0!==this.finished){e.next=4;break}return Object(o["a"])("没有更多了~"),e.abrupt("return");case 4:return t={busContsCode:baseConstant.busContsCode,isWeixin:2,wxUnionid:baseConstant.wxUnionid||u["a"].get("properties").wxUnionid,shopId:u["a"].get("properties").shopId},e.next=7,d["m"].getVouchersList(t).then(function(e){var t=[];e.couponTypesList&&e.couponTypesList.forEach(function(e){for(var n=0;n<e.couponsList.length;n++)e.couponsList[n].cardLabel=e.couponsTypeName,-1!==e.couponsList[n].couponAmount.indexOf("折")?e.couponsList[n].cardType=0:e.couponsList[n].cardType=1,e.couponsList[n].wordBreak=!1,null===e.couponsList[n].buyPrice&&(e.couponsList[n].buyPrice=0),t.push(e.couponsList[n])}),n.cardList=t,n.cardList.length>=e.count?n.finished=!0:n.finished=!1,n.loading=!1}).then(function(){n.instructionsOffsetWidth=[],n.instructionsScrollWidth=[];for(var e=document.getElementsByClassName("instructions"),t=0;t<e.length;t++)n.instructionsOffsetWidth.push(e[t].offsetWidth),n.instructionsScrollWidth.push(e[t].scrollWidth)});case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),loadMore:function(){!0!==this.finished||Object(o["a"])("没有更多了~")},getCard:function(e){var t=this;if(!0!==this.btnLock){var n=this;if(1!==e.isBuy||0===e.buyPrice){var i={};i=null===e.couponId?{usrId:u["a"].get("USER_INFO").usrId,companyId:u["a"].get("COMPANYID").company_id,busContsCode:baseConstant.busContsCode,cardId:e.valueCardHdId,vipInfoHdId:u["a"].get("USER_INFO").vipInfoId,shopId:u["a"].get("properties").shopId}:{usrId:u["a"].get("USER_INFO").usrId,companyId:u["a"].get("COMPANYID").company_id,busContsCode:baseConstant.busContsCode,couponsId:e.couponId,vipInfoHdId:u["a"].get("USER_INFO").vipInfoId,shopId:u["a"].get("properties").shopId},d["m"].saveCoupons(i).then(function(e){console.log(e,"ress"),0!==e.length?"0"===e[0].state?(t.getList(),Object(o["a"])("领取成功~"),t.$router.go(-1)):"1"===e[0].state?Object(o["a"])("您已经领取过该优惠券啦~"):"2"===e[0].state?Object(o["a"])("该优惠券已经被其他会员绑定~"):Object(o["a"])("领取失败~"):Object(o["a"])("来迟一步，已经被领完啦~")}).then(function(){t.btnLock=!1})}else if(1===e.isBuy&&e.buyPrice>0){var s={};s=null===e.couponId?{usrId:u["a"].get("USER_INFO").usrId,companyId:u["a"].get("COMPANYID").company_id,shopCode:u["a"].get("properties").shopCode,valuecardHdId:e.valueCardHdId,busContsCode:baseConstant.busContsCode}:{usrId:u["a"].get("USER_INFO").usrId,companyId:u["a"].get("COMPANYID").company_id,shopCode:u["a"].get("properties").shopCode,couponsId:e.couponId,busContsCode:baseConstant.busContsCode},d["m"].buyCoupons(s).then(function(i){if("无券可领"!=i.msg){t.orderCode=i.billCode;var s={usrId:u["a"].get("USER_INFO").usrId,paymentCode:"D_WEIXIN",tradeTypeCode:"JSAPI",paymentTypeCode:"D_FULL",shopCode:u["a"].get("properties").shopCode,orderList:i.billCode,openId:u["a"].get("WECHAT_INFO").openid,orderType:"D_COUPONSORD",payAmount:e.buyPrice};d["h"].payOrder(s).then(function(e){if("undefined"==typeof WeixinJSBridge)document.addEventListener?document.addEventListener("WeixinJSBridgeReady",onBridgeReady,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",onBridgeReady),document.attachEvent("onWeixinJSBridgeReady",onBridgeReady));else if("200"===e.code){var t="",i=e.requestStr.indexOf("<appid>"),s=e.requestStr.indexOf("</appid>");t=e.requestStr.substring(i+7,s)?e.requestStr.substring(i+7,s).toString():"wx45b40e5b82bd74d2",WeixinJSBridge.invoke("getBrandWCPayRequest",{appId:t,timeStamp:e.timeStamp,nonceStr:e.nonceStr,package:e.prepayId,signType:"MD5",paySign:e.paySign},function(e){console.log(e,"resp"),"get_brand_wcpay_request:ok"==e.err_msg?(window.setTimeout(function(){n.$router.replace({name:"my-vouchers"})},1e3),Object(o["a"])("购买成功~")):"get_brand_wcpay_request:cancel"==e.err_msg?n.btnLock=!1:(n.btnLock=!1,alert("支付出错了"))})}}).then(function(){console.log(1111),t.btnLock=!1})}else Object(o["a"])("来迟一步，已经被购买完啦~~")})}}}},mounted:function(){var e=this;Object(l["setTimeout"])(function(){e.$nextTick(function(){window.scrollTo(0,1)})},0)},created:function(){this.getList()}},p=f,h=(n("5d72"),n("2877")),m=Object(h["a"])(p,i,s,!1,null,"de504718",null);t["default"]=m.exports}}]);