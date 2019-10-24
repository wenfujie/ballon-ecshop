/*
 * @Author: wxx 
 * @Date: 2019-08-24 15:07:43 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-09-02 14:25:16
 */


<style lang="scss" scoped>
.step-wrap {
  width: 100%;
  padding: computed(20) 0;
  font-size: computed(24);
  border: computed(1) solid #e6e6e6;
  background: #fff;
  .line-wrap {
    padding: computed(9) computed(30) computed(19) computed(30);
    .line {
      position: relative;
      width: 100%;
      height: computed(19);
      background-color: #e6e6e6;
      .overlayer {
        position: absolute;
        left: 0;
        top: 0;
        width: 20%;
        height: 100%;
        background-color: #2ba4f3;
      }
    }
  }
  .text-wrap {
    display: flex;
    justify-content: space-between;
    padding-top: 0px;
    padding-bottom: computed(10);
    .step {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
      div {
        font-size: computed(24);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
    .stepActive {
      div {
        color: #2ba4f3;
      }
    }
    .finish {
      div {
        color: #999999;
      }
    }
  }
}
</style>

<template>
  <div class="step-wrap">
    <div class="line-wrap">
      <div class="line">
        <div class="overlayer" ref="process"></div>
      </div>
    </div>
    <div>
      <div class="text-wrap">
        <div
          class="step"
          v-for="(step,index) in steps"
          :key="index"
          :class="{stepActive:activeIndex===index}"
        >
          <div class="text">{{step.name}}</div>
          <div class="time" v-if="step.time">{{step.time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getDeliveryWay from "../public/deliveryText";
import check from "@/util/check";
export default {
  name: "OrderStep",
  props: ["order"],
  data() {
    return {
      stepCode: "",
      steps: [],
      errMsg: {
        kdps: "已取消发货",
        mdzq: "已取消发货"
      },
      activeIndex: 1
    };
  },

  methods: {
    //初始化步骤
    init() {
      let deliveryWay = getDeliveryWay();
      this.steps = deliveryWay[this.order.shippingWayCode];
      this.steps[0].time = this.order.ordTime; //  下单时间
      let nodeCode = this.order.nodeCode;
      switch (this.order.ordStatusCodes) {
        case "D_ORDSPAYING":
          nodeCode = 1;
          break;
        case "D_ORDSSHIPPING":
          nodeCode = 2;
          break;
        case "D_ORDSDELIVERY":
          nodeCode = 3;
          break;
        case "D_ORDSCOMMENTING":
          nodeCode = 4;
          break;
        case "D_ORDSAPPENDCOMMENTING":
          nodeCode = 4;
          break;
        case "D_ORDRECEIVED":
          nodeCode = 4;
          break;
        case "D_ORDCANCEL":
          nodeCode = "";
          break;
      }
      this.stepCode = nodeCode;
      console.log(nodeCode, "deliveryTimedeliveryTime");
      if (!nodeCode) return;
      if (nodeCode > 2) {
        this.steps[1].time = this.order.ordPayTime; // 支付时间
        this.steps[2].time = this.order.oufWhseTime; //发货时间
        this.steps[3].time = this.order.deliveryTime; //收货时间
        // if (nodeCode == 3) {
        //   this.steps[nodeCode - 1].time = this.order.oufWhseTime; //发货时间
        // }
        // if (nodeCode == 4) {
        //   this.steps[nodeCode - 1].time = this.order.deliveryTime; //收货时间
        // }
      } else {
        nodeCode == 2
          ? (this.steps[nodeCode - 1].time = this.order.ordPayTime)
          : (this.steps[nodeCode - 1].time = this.order.nodeTime);
      }

      let percent = (this.stepCode / 4) * 100;
      this.$refs.process.style.width = percent + "%";
      this.activeIndex = this.stepCode - 1;
    }
  },
  mounted() {},
  watch: {
    order: function(val) {
      this.init();
    }
  },
  created() {}
};
</script>