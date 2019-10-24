import Vue from "vue";
import Main from "@/index.vue";
import router from "@/router/index.router";
import "@/util/common"; // 全局参数
import "@/util/globalFun"; // 全局函数
import "@/util/commonVueFilter"; // 全局函数
import store from './store'
import http from "@/util/http.js";
import directives from "@/directives";
import components from "@/components";
import Storage from "./util/storage"; // axios二次封装
import VueLazyload from "vue-lazyload"; //  图片懒加载
import {
	Dialog, Toast
} from "vant";

// 要在此处注册dialog才能使用van-dialog--
Vue.use(Dialog);
Vue.use(directives);
Vue.use(components);

Vue.prototype.$get = http.get;
Vue.prototype.$post = http.post;
Vue.prototype.$put = http.put;
Vue.prototype.$delete = http.delete;
Vue.prototype.$requestAll = http.requestAll;
Vue.prototype.getImg = global.getImg;
Vue.prototype.getVideo = global.getVideo;
Vue.prototype.errImg = global.errImg;
Vue.prototype.$toast = Toast;

Vue.use(VueLazyload, {
	preLoad: 1.1, // 预加载高度比例
	error: require("./assets/images/no-image.jpg"), // 加载时的图片
	loading: require("./assets/images/no-image.jpg"), // 预加载图片
	attempt: 2 // 尝试计数
});

new Vue({
	el: "#app",
	router,
	store,
	components: {
		Main
	},
	template: "<Main/>"
});
