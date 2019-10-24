<template>
  <div class="reserve-detail">
    <div class="detail-content">
      <div class="status flex-row">
        <p>预约状态</p>
        <p>{{volumeDetail.text}}</p>
      </div>
      <div class="item-deatil">
        <p>着装人</p>
        <p>{{volumeDetail.cargousrName}}</p>
      </div>
      <div class="item-deatil">
        <p>预约时间</p>
        <p>{{volumeDetail.orderTime}}</p>
      </div>
      <div class="item-deatil">
        <p>联系电话</p>
        <p>{{volumeDetail.cargoMobile}}</p>
      </div>
      <div class="item-deatil">
        <p>量体方式</p>
        <p>{{volumeDetail.msrWayName}}</p>
      </div>
      <div class="item-deatil">
        <p>量体地址</p>
        <p>{{volumeDetail.stateName}} {{volumeDetail.cityName}}{{volumeDetail.destName}}{{volumeDetail.address}}</p>
      </div>
      <div class="item-deatil">
        <p>备注</p>
        <p>{{volumeDetail.measureMemo?volumeDetail.measureMemo:'-'}}</p>
      </div>
      <div class="line"></div>
      <div class="item-deatil">
        <p>提交时间</p>
        <p>{{volumeDetail.amdLog}}</p>
      </div>
      <div class="item-deatil flex-row">
        <p>预约编号</p>
        <p>{{volumeDetail.billCode}}</p>
      </div>
    </div>
    <template
      v-if="volumeDetail.statusCode=='D_SALEMSRSTATUS1' || volumeDetail.statusCode=='D_SALEMSRSTATUS2'"
    >
      <div
        class="flex-row"
        :class="[volumeDetail.statusCode!=='D_SALEMSRSTATUS2'?'detail-opration':'immediately-appointment']"
      >
        <p
          class="flex-row"
          v-if="volumeDetail.statusCode!='D_SALEMSRSTATUS2'"
          @click="editBooking"
        >修改预约</p>
        <p class="flex-row" @click="cancelBooking()">取消预约</p>
      </div>
    </template>
    <template
      v-else-if="volumeDetail.statusCode=='D_SALEMSRSTATUS5' || volumeDetail.statusCode=='D_SALEMSRSTATUS6'"
    >
      <div
        class="flex-row"
        :class="[volumeDetail.statusCode=='D_SALEMSRSTATUS5'?'detail-opration':'immediately-appointment']"
      >
        <p
          class="flex-row"
          v-if="volumeDetail.statusCode=='D_SALEMSRSTATUS5'"
          @click="toViewData"
        >查看数据</p>
        <p class="flex-row" @click="deleteReserve">删除预约</p>
      </div>
    </template>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import Storage from "../../util/storage";
import { Volume, UserService, Order } from "../../api/service";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      stateList: [
        {
          value: "D_SALEMSRSTATUS1",
          label: "未审核",
          txt: "审核中",
          id: "10051501"
        },
        {
          value: "D_SALEMSRSTATUS2",
          label: "已审核",
          txt: "审核通过待指派量体师",
          id: "10051502"
        },
        {
          value: "D_SALEMSRSTATUS3",
          label: "已派遣",
          txt: "已派遣量体师",
          id: "10051503"
        },
        {
          value: "D_SALEMSRSTATUS4",
          label: "预约完成",
          txt: "预约成功",
          id: "10051504"
        },
        {
          value: "D_SALEMSRSTATUS5",
          label: "已完成",
          txt: "量体完成",
          id: "10051505"
        },
        {
          value: "D_SALEMSRSTATUS6",
          label: "已作废",
          txt: "已取消",
          id: "10051506"
        }
      ],
      volumeDetail: "",
      usrId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      entrance: this.$route.query.entrance,
      id: this.$route.query.id
    };
  },
  methods: {
     ...mapActions("dressed", ["SetAmountId"]),
    editBooking() {

      this.$router.replace({
        path: "/booking-quantity-body",
        query: {
          entrance: 1,
  
          bookingInfor:this.volumeDetail,
          way: this.volumeDetail.msrWayCode == "D_MSRSHOP" ? 1 : 0
        }
      });
    },
    async getVolumeList() {
      let data = {
        usrId: this.usrId,
        companyId: this.companyId,
        searchUsrId: this.usrId,
        id: this.entrance == 1 ? this.id : this.$store.state.dressed.reserveId
      };

      const res = await Volume.getVolumeList(data);
      if (res.list.length == 0) return;
      res.list.forEach(item => {
        this.stateList.forEach(_item => {
          if (item.statusCode == _item.value) {
            item.text = _item.txt;
          }
        });
      });
      this.volumeDetail = res.list[0];
    },
    /**
     *删除数据
     * @param
     *
     */
    deleteReserve() {
      Dialog.confirm({
        message: "确定删除该预约吗?"
      }).then(() => {
        let data = {
          usrId: this.usrId,
          companyId: this.companyId,
          ids: this.volumeDetail.id,
          ownCompanyId: this.ownCompanyId
        };

        Volume.delSaleMeasure(data).then(res => {
          Toast(res == 1 ? "成功删除预约!" : "删除预约失败!");
          this.$router.go(-1);
        });
      });
    },
    /**
     *查看数据
     * @param
     *
     */
    toViewData() {
      this.SetAmountId(this.volumeDetail.id);
      this.$router.push({
        name: "amount-body-detail",
        query: {
          entrance: 2
        }
      });
    },
    /**
     *取消预约
     * @param
     *
     */
    cancelBooking() {

      Dialog.confirm({
        message: "确定取消该预约吗?"
      }).then(() => {
        let data = {
          usrId: this.usrId,
          companyId: this.companyId,
          id: this.volumeDetail.id,
          statusCode: "D_SALEMSRSTATUS6",
          ownCompanyId: this.ownCompanyId
        };

        Volume.cancelMeasure(data).then(res => {
          Toast(res == 1 ? "成功取消预约!" : "取消预约失败!");
           Order.clearAllCache();
          this.$router.go(-1);
        });
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        window.scrollTo(0, 1);
      });
    }, 0);
    this.getVolumeList();
  }
};
</script>
<style  scoped lang="scss" >
@import "./scss/volume.scss";

.reserve-detail {
  
  width: 100%;
  height:100%;
  overflow:hidden;
  .detail-content {
    background: #fff;
    padding: computed(0) computed(30) computed(30) computed(30);
    .status {
      padding: computed(30) computed(0);
      justify-content: flex-start;
      border-bottom: computed(1) solid #cccccc;
      margin-bottom: computed(19);
      p {
        font-size: computed(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      p:nth-child(1) {
        color: #333333;
        margin-right: computed(43);
      }
      p:nth-child(2) {
        color: #2ba4f3;
      }
    }
    .item-deatil {
      justify-content: flex-start;
      margin-top: computed(19);
      display: flex;
      p {
        font-size: computed(24);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      p:nth-child(1) {
        width: computed(106);
        width: 16%;
        margin-right: computed(60);
        color: #999999;
      }
      p:nth-child(2) {
        width: computed(520);
        color: #333333;
        word-wrap: break-word;
        word-break: normal;
      }
    }
    .line {
      height: computed(30);

      border-bottom: computed(1) solid #cccccc;
    }
  }
  .detail-opration {
    height: computed(100);
    position: fixed;
    bottom: computed(0);
    width: 100%;

    p {
      width: 50%;
      font-size: computed(28);
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      height: 100%;
    }
    p:nth-child(1) {
      border-top: computed(1) solid #cccccc;
      color: #333333;
      background: #fff;
    }
    p:nth-child(2) {
      color: #ffffff;
      background: #2ba4f3;
    }
  }
}
</style>
