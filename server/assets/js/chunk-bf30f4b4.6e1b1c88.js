(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bf30f4b4"],{2391:function(o,e,t){"use strict";t.r(e);var s=function(){var o=this,e=o.$createElement,t=o._self._c||e;return t("div",{staticClass:"choosebuy-page"},[t("div",{staticClass:"title"},[t("h5",[o._v(o._s(o.products.cmsWebItemName))]),null!==o.products.goodsList?t("p",[o._v("为您挑选了一批合适的"+o._s(o.products.cmsWebItemName))]):o._e(),null===o.products.goodsList?t("p",[o._v(" 暂无更多商品~ ")]):o._e()]),t("div",{staticClass:"choosebuy-body-main"},[t("ul",o._l(o.products.goodsList,function(e,s){return t("li",[t("div",{staticClass:"main-content",on:{click:function(t){o.goDetail(e)}}},[t("img",{attrs:{src:o.getImg(e.goodsFilePath),alt:"",onerror:"errImg(event)"}}),e.isNew?t("div",{staticClass:"main-new-img"}):o._e(),t("div",[t("div",{staticClass:"main-left"},[t("span",{staticClass:"main-money"},[o._v("￥")]),t("span",{staticClass:"main-pay"},[o._v(o._s(e.salePrice||0))]),t("del",[o._v(o._s(e.tagPrice))])]),t("div",{staticClass:"main-right"},[t("span",{staticClass:"iconfont icon-zan",class:[null!==e.collectionDtId?"active icon-zan_":""],on:{click:function(t){t.stopPropagation(),o.collectToggle(e)}}})])])])])}))])])},n=[],c=(t("e7e5"),t("d399")),a=t("22ce"),d=t("2b61"),i={data:function(){return{products:[],code:""}},methods:{getPage:function(){var o=this,e={cmsTemplateCode:d["a"].get("TEMPLATE_INFO").cmsTemplateCode,cmsWebCode:pageCode.chooseBuy.children.scene,busContsCode:baseConstant.busContsCode,cmsWebItemCode:this.code,shopId:d["a"].get("USER_INFO").shopId};a["b"].getChoosebuyGoods(e).then(function(e){o.products=e[0]})},collectToggle:function(o){var e=this;if(null===o.collectionDtId){var t={usrId:d["a"].get("USER_INFO").usrId,companyId:d["a"].get("USER_INFO").companyId,busContsCode:baseConstant.busContsCode,goodsCode:o.goodsCode,shopId:d["a"].get("USER_INFO").shopId};a["c"].addCollection(t).then(function(o){1===o&&(Object(c["a"])("收藏成功"),e.getPage())})}else{var s={usrId:d["a"].get("USER_INFO").usrId,companyId:d["a"].get("USER_INFO").companyId,goodCodeStr:o.goodsCode,ids:o.collectionDtId};a["c"].deleteCollection(s).then(function(o){Object(c["a"])("取消收藏成功~"),e.getPage()})}},goDetail:function(o){1===o.orderFlag?this.$router.push("/goods/web-design?goodsCode="+o.goodsCode):this.$router.push("/goods-detail?goodsCode="+o.goodsCode)}},created:function(){this.code=this.$route.query.code,this.getPage()}},l=i,u=(t("4d08"),t("2877")),r=Object(u["a"])(l,s,n,!1,null,"e6c7c214",null);e["default"]=r.exports},"2e45":function(o,e,t){},"4d08":function(o,e,t){"use strict";var s=t("2e45"),n=t.n(s);n.a}}]);