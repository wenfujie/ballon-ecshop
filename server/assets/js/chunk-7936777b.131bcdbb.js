(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7936777b"],{2836:function(t,e,s){},2994:function(t,e,s){"use strict";s("68ef"),s("c0c2")},"2bdd":function(t,e,s){"use strict";var i=s("a142"),o=s("543e"),c=s("db78"),n=s("023d"),a=Object(i["i"])("list"),d=a[0],l=a[1],r=a[2];e["a"]=d({model:{prop:"loading"},props:{error:Boolean,loading:Boolean,finished:Boolean,errorText:String,loadingText:String,finishedText:String,immediateCheck:{type:Boolean,default:!0},offset:{type:Number,default:300},direction:{type:String,default:"down"}},mounted:function(){this.scroller=Object(n["c"])(this.$el),this.handler(!0),this.immediateCheck&&this.$nextTick(this.check)},destroyed:function(){this.handler(!1)},activated:function(){this.handler(!0)},deactivated:function(){this.handler(!1)},watch:{loading:function(){this.$nextTick(this.check)},finished:function(){this.$nextTick(this.check)}},methods:{check:function(){if(!(this.loading||this.finished||this.error)){var t=this.$el,e=this.scroller,s=Object(n["e"])(e);if(s&&"none"!==window.getComputedStyle(t).display&&null!==t.offsetParent){var i=this.offset,o=this.direction;c()&&(this.$emit("input",!0),this.$emit("load"))}}function c(){if(t===e){var c=Object(n["d"])(t);if("up"===o)return c<=i;var a=c+s;return e.scrollHeight-a<=i}if("up"===o)return Object(n["d"])(e)-Object(n["a"])(t)<=i;var d=Object(n["a"])(t)+Object(n["e"])(t)-Object(n["a"])(e);return d-s<=i}},clickErrorText:function(){this.$emit("update:error",!1),this.$nextTick(this.check)},handler:function(t){this.binded!==t&&(this.binded=t,(t?c["b"]:c["a"])(this.scroller,"scroll",this.check))}},render:function(t){return t("div",{class:l()},["down"===this.direction&&this.slots(),this.loading&&t("div",{class:l("loading"),key:"loading"},[this.slots("loading")||[t(o["a"],{class:l("loading-icon")}),t("span",{class:l("loading-text")},[this.loadingText||r("loading")])]]),this.finished&&this.finishedText&&t("div",{class:l("finished-text")},[this.finishedText]),this.error&&this.errorText&&t("div",{on:{click:this.clickErrorText},class:l("error-text")},[this.errorText]),"up"===this.direction&&this.slots()])}})},"49e9":function(t,e,s){"use strict";var i=s("2836"),o=s.n(i);o.a},"4f49":function(t,e,s){},"5fb8":function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"empty-box"},[s("p",[t._v(t._s(t.emptyText))])])},o=[],c={name:"Empty",props:{emptyText:{type:String,default:"当前暂无数据~"}},data:function(){return{}},methods:{},created:function(){}},n=c,a=(s("49e9"),s("2877")),d=Object(a["a"])(n,i,o,!1,null,"dba818e0",null);e["a"]=d.exports},b8b1:function(t,e,s){"use strict";var i=s("4f49"),o=s.n(i);o.a},c0c2:function(t,e,s){},edfb:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"member-center"},[s("div",{staticClass:"top-content"},[t.goodsList.length>0?s("div",{staticClass:"dreamList-title"},[t._v("\n            我的收藏 ("+t._s(t.totals)+")\n            "),s("div",{staticClass:"fr",on:{click:function(e){t.editStatus=!t.editStatus}}},[s("i",{staticClass:"iconfont icon-bianji"}),t._v("\n                "+t._s(!1===t.editStatus?"编辑":"完成")+"\n            ")])]):t._e(),s("empty",{directives:[{name:"show",rawName:"v-show",value:t.showEmpty,expression:"showEmpty"}],attrs:{emptyText:"暂无收藏~"}})],1),t.goodsList.length>0?s("van-list",{attrs:{finished:t.finished,"immediate-check":!1},on:{load:t.loadMore},model:{value:t.loading,callback:function(e){t.loading=e},expression:"loading"}},[s("div",{staticClass:"member-goods-list"},[s("ul",t._l(t.goodsList,function(e,i){return s("li",{key:i,staticClass:"member-goods-item"},[s("img",{attrs:{src:t.getImg(e.thumb,"165*165"),onerror:"errImg(event)",alt:""},on:{click:function(s){t.goDetail(e)}}}),1===e.orderFlag?s("div",{staticClass:"diy-icon"}):t._e(),s("p",{staticClass:"goods-name"},[t._v(t._s(e.goodsName))]),s("div",{staticClass:"goods-price"},[s("span",{staticClass:"sale-price"},[t._v("￥"+t._s(t._f("fixed2")(e.salePrice)))]),e.tagPrice&&e.tagPrice>0?s("span",{staticClass:"tag-price"},[t._v("￥"+t._s(t._f("fixed2")(e.tagPrice)))]):t._e()]),!0===t.editStatus?s("div",{staticClass:"select-box"},[s("input",{directives:[{name:"model",rawName:"v-model",value:t.checkedList,expression:"checkedList"}],staticClass:"checkInput",attrs:{name:"shopCart",type:"checkbox"},domProps:{value:e.id,checked:Array.isArray(t.checkedList)?t._i(t.checkedList,e.id)>-1:t.checkedList},on:{change:function(s){var i=t.checkedList,o=s.target,c=!!o.checked;if(Array.isArray(i)){var n=e.id,a=t._i(i,n);o.checked?a<0&&(t.checkedList=i.concat([n])):a>-1&&(t.checkedList=i.slice(0,a).concat(i.slice(a+1)))}else t.checkedList=c}}}),s("i",{staticClass:"van-checkbox__icon",class:{checked:-1!==t.checkedList.indexOf(e.id)},attrs:{for:e.id}})]):t._e()])}))])]):t._e(),!0===t.editStatus?s("div",{staticClass:"goods-actions"},[s("div",{staticClass:"carts-info"},[s("div",{staticClass:"van-checkbox",on:{click:function(e){t.checkedAll()}}},[s("i",{staticClass:"van-checkbox__icon",class:{checked:!0===t.checkAll}}),s("span",{staticClass:"checkbox-label"},[t._v("全选")])])]),s("div",{staticClass:"buy-button",on:{click:function(e){t.deleteCollected()}}},[t._v("删除")])]):t._e()],1)},o=[],c=(s("e17f"),s("2241")),n=(s("e7e5"),s("d399")),a=(s("ac6a"),s("2994"),s("2bdd")),d=s("2b61"),l=s("22ce"),r=s("5fb8"),h={components:{"van-list":a["a"],empty:r["a"]},data:function(){return{goodsList:[],showSelect:!1,loading:!0,finished:!1,pageNum:1,pageSize:10,checkedList:[],checkAll:!1,editStatus:!1,totals:0,showEmpty:!1}},watch:{checkedList:function(){this.goodsList.length===this.checkedList.length?this.checkAll=!0:this.checkAll=!1},goodsList:function(){this.goodsList.length===this.checkedList.length?this.checkAll=!0:this.checkAll=!1},checkAll:function(t){this.checkAll=t}},methods:{getList:function(){var t=this,e={cltTypeCode:"",collocationCode:"",priceTypeCode:"",busContsCode:baseConstant.busContsCode,pageSize:this.pageSize,pageNum:this.pageNum,shopDptId:d["a"].get("properties").shopId};l["c"].getCollectionList(e).then(function(e){t.totals=e.pages.total;var s=e.pages.list;s.forEach(function(e){t.goodsList.push(e)}),0==t.goodsList.length&&(t.showEmpty=!0),e.pages.pageNum>=e.pages.pages&&(t.finished=!0)},function(t){}).then(function(){t.loading=!1})},loadMore:function(){!0!==this.finished?(this.pageNum+=1,this.getList()):Object(n["a"])("没有更多了")},checkedAll:function(){var t=[];!1===this.checkAll&&this.goodsList.forEach(function(e){t.push(e.id)}),this.checkedList=t},deleteCollected:function(){var t=this;!this.checkedList.length||this.checkedList.length<1?Object(n["a"])("请先选择要删除的商品~"):c["a"].confirm({message:"确定移出我的收藏吗？"}).then(function(){for(var e=[],s=function(s){t.goodsList.forEach(function(i){i.id===t.checkedList[s]&&e.push(i.goodsCode)})},i=0;i<t.checkedList.length;i++)s(i);var o={usrId:d["a"].get("USER_INFO").usrId,companyId:d["a"].get("COMPANYID").company_id,goodCodeStr:e.join(","),ids:t.checkedList.join(",")};l["c"].deleteCollection(o).then(function(e){Object(n["a"])("操作成功~"),t.$nextTick(function(){t.pageNum=1,t.goodsList=[],t.checkedList=[],t.checkAll=!1,t.editStatus=!1,t.finished=!1,t.getList()})})},function(t){})},goDetail:function(t){var e=this,s={ownCompanyId:d["a"].get("COMPANYID").company_id,goodsCode:t.goodsCode,buscontsCode:baseConstant.busContsCode};l["d"].isShelves(s).then(function(s){return 1===s.sellFlag?(1===t.orderFlag?e.$router.push("/goods/web-design?goodsCode="+t.goodsCode):0===t.orderFlag&&e.$router.push("/goods-detail?goodsCode="+t.goodsCode),!1):s.buscontsId&&0===s.sellFlag?(1===t.orderFlag?e.$router.push("/goods/web-design?goodsCode="+t.goodsCode):0===t.orderFlag&&e.$router.push("/goods-detail?goodsCode="+t.goodsCode),!1):s.buscontsId||0!==s.sellFlag?void(s&&(s.buscontsId||0===s.sellFlag)||e.$router.push("/off-shelves")):(1===t.orderFlag?e.$router.push("/goods/web-design?goodsCode="+t.goodsCode):0===t.orderFlag&&e.$router.push("/goods-detail?goodsCode="+t.goodsCode),!1)})}},created:function(){this.getList()}},u=h,g=(s("b8b1"),s("2877")),f=Object(g["a"])(u,i,o,!1,null,"6b0d7b3a",null);e["default"]=f.exports}}]);