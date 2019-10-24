<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-27 20:36:28
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-27 20:42:07
 * @Description: 
 -->
<style lang="scss" scoped>
.wrap {
  background-color: #edf0f7;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;


  .bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    height: computed(100);
    .icon-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: computed(100);
      background: #fff;
      border-top: solid 1px #cccccc;
      .iconfont {
        font-size: computed(50) !important;
      }
      .text {
        font-size: computed(20);
        line-height: 100%;
      }
    }
    .btn-right {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      outline: 0;
      border: 0;
      color: #fff;
      font-size: computed(30);
      font-family: "PingFang-SC-Medium";
      background-color: #2ba4f3;
    }
  }
}
</style>

<template>
  <div class="wrap">
    <div class="overflow-scroll flex-auto">
      <pickup-info :data="order"></pickup-info>
      <good-list :pkg="order" :order="order" v-if="order.goodsList"></good-list>
      <order-info :data="order"></order-info>
    </div>
  </div>
</template>

<script>
import Storage from "../../util/storage";
import components from "./components";
import check from "../../util/check.js";
import { Order } from "../../api/service";
import { getOrdInfo } from "./public";

export default {
  components: components,
  data() {
    return {
      order: {}
    };
  },
  methods: {
    //获取订单详情
    getOrdInfo() {
      getOrdInfo(this);
    }
  },
  created() {
    this.getOrdInfo();
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        window.scrollTo(0, 1);
      });
    }, 0);
  }
};
</script>
