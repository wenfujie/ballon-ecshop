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
 background: #edf0f7;
  min-height: 100%;
   padding-bottom: computed(120);

  .share {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: computed(100);
    outline: 0;
    border: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #2ba4f3;
    font-size: computed(32);
    font-family: "PingFang-SC-Medium";
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
    <button
      class="share"
      @click="addEvaluate()"
      v-if="order.allowCommentFlag === 1 &&
                order.reviewFlag === 0"
    >追加评价</button>
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
      order: {},
      packages: [],
      pkg: {},
      isShowTip: false
    };
  },
  methods: {
    addEvaluate() {
      this.$router.push({
        name: "addEvaluate",
        query: {
          billCode: this.$route.query.billCode
        }
      });
    },
    //获取订单详情
    getOrdInfo() {
      getOrdInfo(this);
    },
    //切换包裹
    changePackage(curPackage) {
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
