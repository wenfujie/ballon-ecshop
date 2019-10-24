<template>
  <div>
    <div v-if="pkg.expressNo">
      <div class="package-infor" v-if="pkg.shippingWayCode=='kdps'">
        <div v-if="pkg.expressName && pkg.expressNo">
          <p class="flex-row">
            <span>物流公司：</span>
            <span>{{pkg.expressName}}</span>
          </p>
          <p class="flex-row">
            <span>物流单号：</span>
            <span>{{pkg.expressNo}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="package-infor" v-else>
      <div>
       
        <p>物流信息:</p>
        <p> {{pkg.statusCode=='D_SHIPPINGCANCLE'?"已取消":'未发货'}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "packageInfor",
  props:['pkg'],
  data() {
    return {};
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.package-infor {
  background: #fff;
  padding: computed(20);
  div {
    padding: computed(20);
    background: #edf0f7;
    p:nth-child(1) {
      margin-bottom: computed(10);
    }
    p {
      justify-content: flex-start;
      font-size: computed(24);
      span {
        font-size: computed(24);
        font-family: PingFangSC-Regular;
        font-weight: 400;
      }
      span:nth-child(1) {
        color: rgba(153, 153, 153, 1);
      }
      span:nth-child(2) {
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>