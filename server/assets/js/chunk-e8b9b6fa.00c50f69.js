(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e8b9b6fa"],{"04d3":function(t,e,i){t.exports=i.p+"img/off-shelves.9ed93290.png"},"29b2":function(t,e,i){"use strict";var n=i("78ed"),s=i.n(n);s.a},"77b9":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"off-shelves-page"},[i("div",{staticClass:"content"},[i("div",{staticClass:"off-shelves-img"},[i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:t.offShelvesImg,expression:"offShelvesImg"}],attrs:{alt:"商品未上架"}})]),i("p",{staticClass:"tip"},[t._v("抱歉，该商品还未上架")])]),i("div",{staticClass:"btn-group"},[i("div",{staticClass:"back-btn btn",on:{click:t.back}},[t._v("上一页 ("),i("span",[t._v(t._s(t.time)+"s")]),t._v(")")]),i("div",{staticClass:"index-btn btn",on:{click:t.toIndex}},[t._v("回到首页")])])])},s=[],o=(i("a481"),{data:function(){return{offShelvesImg:i("04d3"),time:3,timer:null}},created:function(){},mounted:function(){this.navBack()},methods:{navBack:function(){var t=this;this.timer=window.setInterval(function(){--t.time<=0&&(window.clearInterval(t.timer),"web-design"===t.$route.query.page?t.$router.go(-2):(console.log("页面历史记录数量",window.history.length),window.history.length<=1?t.$router.replace("/index"):(console.log("返回上一页"),t.$router.go(-1))))},1e3)},back:function(){this.timer&&window.clearInterval(this.timer),"web-design"===this.$route.query.page?this.$router.go(-2):window.history.length<=1?this.$router.replace("/index"):(console.log("返回上一页"),this.$router.go(-1))},toIndex:function(){this.timer&&window.clearInterval(this.timer),this.$router.replace("/index")}},beforeDestroy:function(){this.timer&&window.clearInterval(this.timer)}}),r=o,a=(i("29b2"),i("2877")),c=Object(a["a"])(r,n,s,!1,null,"71d9506f",null);e["default"]=c.exports},"78ed":function(t,e,i){}}]);