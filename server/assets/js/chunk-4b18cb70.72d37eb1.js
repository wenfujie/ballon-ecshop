(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4b18cb70"],{"0653":function(t,s,e){"use strict";e("68ef")},2221:function(t,s,e){},"34e9":function(t,s,e){"use strict";var i=e("2638"),n=e.n(i),a=e("a142"),o=e("ba31"),d=Object(a["i"])("cell-group"),r=d[0],c=d[1];function l(t,s,e,i){var a=t("div",n()([{class:[c(),{"van-hairline--top-bottom":s.border}]},Object(o["b"])(i,!0)]),[e["default"]&&e["default"]()]);return s.title?t("div",[t("div",{class:c("title")},[s.title]),a]):a}l.props={title:String,border:{type:Boolean,default:!0}},s["a"]=r(l)},"754d":function(t,s,e){"use strict";var i=e("7753"),n=e.n(i);n.a},7753:function(t,s,e){},aca4:function(t,s,e){"use strict";e.r(s);var i=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"address-list"},[t.loading?e("div",{staticClass:"loading-tip"},[t._v("加载中~")]):t._e(),e("ul",[t._l(t.addressList,function(s,i){return t.addressList.length>0?e("li",{key:i},[e("van-swipe-cell",{attrs:{"right-width":70,"on-close":t.onClose}},[e("van-cell-group",[e("div",{staticClass:"address-header"},[e("span",{staticClass:"user-name"},[t._v(t._s(s.cargousrName))]),e("span",{staticClass:"user-phone"},[t._v(t._s(s.cargoPhone))]),e("span",{staticClass:"edit-btn",on:{click:function(e){t.editAddress(s.id,s.destId)}}},[e("i",{staticClass:"iconfont icon-pingjia"})])]),e("div",{staticClass:"address-msg",on:{click:function(e){t.selectAddress(s)}}},[1===s.defaultFlag?e("span",{staticClass:"default-address"},[t._v("[默认地址]")]):t._e(),t._v("\n                        "+t._s(s.destDesc+s.address)+"\n                    ")]),e("div",{staticClass:"address-handle"})]),e("span",{staticClass:"delete-btn",attrs:{slot:"right"},on:{click:function(e){t.deleteAddress(s)}},slot:"right"},[t._v("删除")])],1)],1):t._e()}),t.loading||t.addressList&&0!==t.addressList.length?t._e():e("div",{staticClass:"empty-content"})],2),e("div",{staticClass:"common-bottom-btn",on:{click:t.newAddr}},[e("p",{staticClass:"btn-txt"},[t._v("新增收货地址")])])])},n=[],a=(e("a481"),e("e7e5"),e("d399")),o=(e("e17f"),e("2241")),d=(e("c3a6"),e("ad06")),r=(e("0653"),e("34e9")),c=(e("68ef"),e("2221"),e("a142")),l=e("db78"),h=e("3875"),u=function(t){return{mounted:function(){var s=this;t.handler=function(e){s.$el.contains(e.target)||s[t.method]()},Object(l["b"])(document,t.event,t.handler)},beforeDestroy:function(){Object(l["a"])(document,t.event,t.handler)}}},f=Object(c["i"])("swipe-cell"),g=f[0],p=f[1],v=.15,m=g({mixins:[h["a"],u({event:"touchstart",method:"onClick"})],props:{onClose:Function,disabled:Boolean,leftWidth:Number,rightWidth:Number},data:function(){return{offset:0,dragging:!1}},methods:{open:function(t){var s="left"===t?this.leftWidth:-this.rightWidth;this.swipeMove(s),this.resetSwipeStatus()},close:function(){this.offset=0},resetSwipeStatus:function(){this.swiping=!1,this.opened=!0},swipeMove:function(t){void 0===t&&(t=0),this.offset=Object(c["h"])(t,-this.rightWidth,this.leftWidth),this.offset?this.swiping=!0:this.opened=!1},swipeLeaveTransition:function(t){var s=this.offset,e=this.leftWidth,i=this.rightWidth,n=this.opened?1-v:v;"right"===t&&-s>i*n&&i>0?this.open("right"):"left"===t&&s>e*n&&e>0?this.open("left"):this.swipeMove(0)},startDrag:function(t){this.disabled||(this.dragging=!0,this.startOffset=this.offset,this.touchStart(t))},onDrag:function(t){this.disabled||(this.touchMove(t),"horizontal"===this.direction&&(Object(l["c"])(t),this.swipeMove(this.deltaX+this.startOffset)))},endDrag:function(){this.disabled||(this.dragging=!1,this.swiping&&this.swipeLeaveTransition(this.offset>0?"left":"right"))},onClick:function(t){void 0===t&&(t="outside"),this.$emit("click",t),this.offset&&(this.onClose?this.onClose(t,this):this.swipeMove(0))}},render:function(t){var s=this,e=function(t,e){return function(i){e&&i.stopPropagation(),s.onClick(t)}},i={transform:"translate3d("+this.offset+"px, 0, 0)",transition:this.dragging?"none":".6s cubic-bezier(0.18, 0.89, 0.32, 1)"};return t("div",{class:p(),on:{click:e("cell"),touchstart:this.startDrag,touchmove:this.onDrag,touchend:this.endDrag,touchcancel:this.endDrag}},[t("div",{class:p("wrapper"),style:i,on:{transitionend:function(){s.swiping=!1}}},[this.leftWidth?t("div",{class:p("left"),on:{click:e("left",!0)}},[this.slots("left")]):null,this.slots(),this.rightWidth?t("div",{class:p("right"),on:{click:e("right",!0)}},[this.slots("right")]):null])])}}),b=e("2b61"),w=e("22ce"),C={components:{"van-swipe-cell":m,"van-cell-group":r["a"],"van-icon":d["a"]},name:"address-list",data:function(){return{fromPage:"",addressList:[],loading:!0,addrSelected:{}}},methods:{getAddress:function(){var t=this,s={vipUsrId:b["a"].get("USER_INFO").usrId};w["k"].getAddrList(s).then(function(s){t.addressList=s||[],t.$nextTick(function(){console.log("creatednextTick"),window.scrollTo(0,1)})},function(s){t.loading=!1}).then(function(){t.loading=!1})},editAddress:function(t,s){this.$router.push("/address-detail?id="+t+"&destId="+s)},onClose:function(t,s){switch(t){case"left":case"cell":case"outside":s.close();break}},deleteAddress:function(t){var s=this;o["a"].confirm({message:"确定删除该地址吗？"}).then(function(){var e={ids:t.id};w["k"].deleteAddrList(e).then(function(){if(s.addressList=[],s.getAddress(),b["a"].get("settlementAddr")){var e=b["a"].get("settlementAddr");t.id===e.id&&b["a"].remove("settlementAddr")}Object(a["a"])("删除地址成功~")})},function(t){})},selectAddress:function(t){"settlement"===this.fromPage?(b["a"].set("settlementAddr",t),this.$router.go(-1)):"postSale"===this.fromPage&&(this.$router.go(-1),this.$router.replace({name:"postSaleDetail",params:{addrInfo:t}}))},newAddr:function(){this.addressList.length>19?Object(a["a"])("最多可添加20条收货地址"):this.$router.push("/address-detail?addressList_length="+this.addressList.length)}},created:function(){this.fromPage=this.$route.query.fromPage,this.getAddress()}},k=C,_=(e("754d"),e("2877")),A=Object(_["a"])(k,i,n,!1,null,"289d42c9",null);s["default"]=A.exports},c3a6:function(t,s,e){"use strict";e("68ef")}}]);