<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-27 20:36:28
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-27 20:36:28
 * @Description: 
 -->
 
<style lang="scss" scoped>
.wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

}
</style>

<template>
    <div class="wrap">
        <ScrollTab :data="packages" :tab-click="changePackage" v-if="packages.length>1"></ScrollTab>
        <div v-if="packages" class="overflow-scroll flex-auto">
            <step-line :pkg="pkg"></step-line>
             <pickup-info :data="order"></pickup-info>
            <good-list :pkg="pkg" :order="order" v-if="pkg.goodsList"></good-list>
            <order-info :data="order"></order-info>
        </div>
    </div>
</template>
<script>
import components from "./components";
import check from "../../util/check.js";
import { getOrdInfo, changePkg } from "./public";

export default {
    components: components,
    data() {
        return {
            order: {},
            packages: [],
            pkg: {}
        };
    },
    methods: {
        //获取订单详情
        getOrdInfo() {
            getOrdInfo(this);
        },
        //切换包裹
        changePackage(curPackage) {
            changePkg(this, curPackage);
        }
    },
       mounted() {
          setTimeout(() => {
      this.$nextTick(() => {
        window.scrollTo(0, 1);
      });
    }, 0);

    },
    created() {
        this.getOrdInfo();
    }
};
</script>

 