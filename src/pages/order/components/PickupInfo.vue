/*
 * @Author: wxx 
 * @Date: 2019-08-28 10:02:49 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-08-28 10:56:11
 */

<style lang='scss' >
.pickup-content {
  background: #fff;
  margin-bottom: computed(10);
  .pickup-info {

    padding: computed(30);
    .title {
      text-align: center;
      color: #0d0e09;
      padding: computed(20) 0px;
      margin-bottom: computed(20);
      font-size: computed(36);
      font-family: "PingFang-SC-Bold";
      font-weight: 700;
    }
    .body {
      .item {
        display: flex;
        margin-bottom: computed(23);
        font-size: computed(28);
        color: #0d0e09;
        .left {
          width: 22%;
          font-weight: bold;
        }
        .right {
          width: 80%;
          text-align: left;
          // padding-left: computed(30);
        }
      }

      .total {
        font-weight: 600;
      }
      .address {
        color: #2ba4f3;
      }
    }
  }
}
</style>
  
 <template>
  <div class="pickup-content">
    <div class="pickup-info" v-if="renderSelf">
    
      <div class="body">
        <div class="item">
          <div class="left">{{people[data.shippingWayCode||data.receiptWayCode]}}:</div>
          <div class="right">{{data.cargoUsrName}}</div>
        </div>
        <div class="item">
          <div class="left">联系方式：</div>
          <div class="right">{{data.cargoMobile}}</div>
        </div>
        <div class="item">
          <div class="left">收货地址：</div>
          <div class="right">
            <span class="address" v-if="shopName">{{'[ '+ shopName +' ]'}}</span>
            {{address}}
          </div>
        </div>
        <div class="item">
          <div class="left">订单备注：</div> 
          <div class="right">{{data.ctmMessage?data.ctmMessage:'暂无备注'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "PickupInfo",
  props: {
    data: {},
    order:{}
    
  },
  data() {
    return {
      title: {
        mdzq: "提货信息",
        kdps: "收货信息"
      },
      people: {
        mdzq: "提货人",
        kdps: "收货人"
      }
    };
  },
  methods: {},
  created() {
    this.$nextTick(() => {});
  },
  watch: {
    data: function(val) {}
  },
  computed: {
    // 门店名称
    shopName: function() {
      return this.data.shippingWayCode == "mdzq"
        ? this.data.recptdptName || this.data.dptName
        : null;
    },

    address: function() {
      let addr =
        this.data.cargoStateName +
        this.data.cargoCityName +
        this.data.cargoDestName +
        this.data.cargoAddress;
      return addr;

    },

    renderSelf: function() {
      console.log(this.data,'shippingWayCodeshippingWayCodeshippingWayCode')
      return this.data.shippingWayCode == "dczt" ? false : true;
    }
  }
};
</script>