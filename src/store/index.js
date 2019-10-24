/*
 * createTime：2019/2/21
 * author：en.chen
 * description: 数据仓库
 */

import Vue from "vue";
import Vuex from "vuex";




//  用户信息
import dressed from "./modules/order/dressed";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        dressed,
  
    },

});
