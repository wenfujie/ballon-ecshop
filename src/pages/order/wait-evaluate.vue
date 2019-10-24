<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-27 20:36:28
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-27 20:40:47
 * @Description: 
 --> 
<style lang="scss" scoped>
.wrap {
  background: #edf0f7;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  padding-bottom: computed(100);

  .bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    height: computed(100);
    background: #fff;
    .icon-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: computed(100);

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
  .tip {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000000;
    opacity: 0.8;
    text-align: center;
    z-index: 50;
  }
}
</style>

<template>
  <div class="wrap">
    <div v-if="packages" class="overflow-scroll flex-auto container">
      <step-line :order="order"></step-line>
      <pickup-info :data="order"></pickup-info>
      <ScrollTab :data="packages" :tab-click="changePackage" v-if="packages.length>1"></ScrollTab>
      <packageInfor :order="order" :pkg="pkg"></packageInfor>
      <prepare :pkg="pkg"></prepare>
      <logis :type='1' :data="pkg"></logis>
      <good-list :pkg="pkg" :order="order"></good-list>
      <order-info :data="order"></order-info>
    </div>
    <div class="bottom">
      <div class="btn-right" @click="goToEvaluate()">去评价</div>
    </div>
    <div @click="hideShareImg" class="tip" v-show="isShowTip">
      <img src="@/assets/images/common/guide.png" alt />
    </div>
  </div>
</template>

 <script>
import Storage from "@/util/storage.js";
import components from "./components";
import wx from "@/util/wxShare.js";
import check from "../../util/check.js";
import { Order } from "@/api/service";
import { getOrdInfo, changePkg, getParams } from "./public";

export default {
  components: components,
  data() {
    return {
      isShowTip: false,
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
    async changePackage(curPackage) {
      changePkg(this, curPackage);
    },
    // 分享订单
    shareGoods() {
      let url = window.location.href.split("#")[0];
      let params = {
        wxUUID: baseConstant.wxUnionid || Storage.get("properties").wxUnionid,
        unAuthorizedUrl: encodeURIComponent(url),
        billCode: this.$route.query.billCode
      };
      Order.getWxSignature(params).then(res => {
        wx.ready(res, {
          billCode: params.billCode,
          companyId: params.companyId,
          usrId: params.usrId
        });
      });
    },
    showShareImg() {
      this.isShowTip = true;
    },
    hideShareImg() {
      this.isShowTip = false;
    },
    // 去评价
    goToEvaluate() {
      this.$router.push({
        name: "orderEvaluate",
        query: {
          billCode: this.order.billCode
        }
      });
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
    this.shareGoods();
  }
};
</script>