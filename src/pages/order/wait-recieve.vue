<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-27 20:36:28
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-27 20:36:28
 * @Description: 门店自提-待收货页面 
 -->
<style lang="scss" scoped>
.wrap {
   display: flex;
    flex-direction: column;
    width: 100%;
  min-height: 100%;
    background: #edf0f7;
    padding-bottom: computed(120);

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
    <div v-if="packages" class="overflow-scroll flex-auto">
      <step-line :order="order"></step-line>

      <pickup-info :data="order"></pickup-info>
      <ScrollTab :data="packages" :tab-click="changePackage" v-if="packages.length>1"></ScrollTab>
      <packageInfor :order="order" :pkg="pkg"></packageInfor>
      <prepare :pkg="pkg"></prepare>
      <logis :type="1" :data="pkg"></logis>
      <good-list :pkg="pkg" :order="order"></good-list>

      <order-info :data="order"></order-info>
    </div>
    <div class="bottom">
      <div class="btn-right" @click="comfirmRecieved()">确认收货</div>
    </div>
  </div>
</template>

<script>
import components from "./components";
import check from "../../util/check.js";
import { getOrdInfo, changePkg, ordSignUp } from "./public";
import { UserService } from "@/api/service";
// import { ordSignUp } from "@/pages/order/public/index";
import ysfService from "@/util/ysfService";

export default {
  components: components,
  data() {
    return {
      way: "",
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
    },
    //确认收货
    comfirmRecieved() {
      ordSignUp(this).then(() => {
        this.$router.replace({
          name: "waitEvaluate",
          query: {
            billCode: this.order.billCode
          }
        });
      });
    },
    //联系客服
    async concatCumService() {
      /* let user = await UserService.getUserInfo();
            Custom(user.usrId, user.usrName, user.email, user.mobilePhone);
            console.log("user,", user); */
      ysfService.wakeUp();
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