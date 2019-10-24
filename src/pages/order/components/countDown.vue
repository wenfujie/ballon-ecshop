<style lang='scss' scoped>
.count-wrap {
  position: fixed;
  z-index:3;
  top: 0;
  width: 100%;
  padding: computed(24) 0;
  font-size: computed(24);
  text-align: center;
  color: #2ba4f3;
  background: #ffffff;
}
</style>

<template>
  <div class="count-wrap" v-if="isRender">
    <span>{{hours}}小时</span>
    <span>{{minutes}}分</span>
    <span>{{seconds}}秒</span>
    <span>&nbsp;后自动取消订单</span>
  </div>
</template>

<script>
import Storage from "../../../util/storage";
import { Order } from "../../../api/service";
export default {
  name: "countDown",
  props: {
    order: Object
  },
  data() {
    return {
      time: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      maxtime: 0,
      timer: null,
      flag: 1
    };
  },
  methods: {
    // 初始化
    init_Time() {
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      this.time = this.order.closeDate - this.order.nowDate;
    },
    // 获取结束时间与当前时间差值的毫秒值
    getEndTimeMill() {
      return Math.floor(this.time / 1000);
    },
    //时间设置
    set_Time(maxtime) {
      this.seconds = Math.floor(maxtime % 60);
      this.minutes = Math.floor(maxtime / 60) % 60;
      this.hours = Math.floor(maxtime / 3600);
    },
    // 判断订单是否待支付状态
    isPayed() {
      const isPayed =
        this.order.ordStatusCodes == "D_ORDSPAYING" ? true : false;
      const isPayedPart =
        this.order.payStatusCode == "D_PAIDPART" ? false : true;
      return isPayed && isPayedPart ? true : false;
    },
    // 倒计时
    countDown(maxtime) {
      let that = this;
      that.maxtime = maxtime;

      this.timer = setInterval(function() {
        if (that.maxtime > 0) {
          that.maxtime--;
          that.set_Time(that.maxtime);
        } else {
          // 取消订单的接口
          that.cancelOrder();
          clearInterval(that.timer);
        }
      }, 1000);
    },
    //取消订单
    async cancelOrder() {
      let data = {
        flag: 1,
        ctmUsrId: Storage.get("USER_INFO").usrId,
        billCodes: [this.order.billCode]
      };
      const res = await Order.cancelOrder(data);
      if (res.status === 200) {
        this.$emit("getOrdInfo");
           this.$router.replace({
            name: "orderClosed",
            query: {
              billCode: this.order.billCode
            }
          });
      
      } 
    },

    // 开始
    start() {
      this.clearTimer();
      if (!this.isPayed()) return;
      this.init_Time();
      const maxtime = this.getEndTimeMill();
      if (maxtime <= 0) return;
      this.set_Time(maxtime);
      this.countDown(maxtime);
    },

    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  computed: {
    isRender: function() {
      this.$parent.paddingTop = false;
      if (!this.isPayed()) return false;
      if (this.maxtime == 0) return false;
      this.$parent.paddingTop = true;
      return true;
    }
  },
  watch: {
    order: function() {
      this.start();
    }
  },
  mounted() {
    this.start();
  },
  beforeRouteLeave() {
    this.clearTimer();
  }
};
</script>
