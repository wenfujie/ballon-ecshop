<template>
  <div class="amount-body-detail">
    <div class="body-detail">
      <template v-if="bodyDetail.dressedusrName&&bodyDetail.sexName ">
        <div class="detail-people flex-row">
          <p>着装人：{{bodyDetail.dressedusrName}}</p>
          <p>性别：{{bodyDetail.sexName}}</p>
        </div>
        <template v-if="bodyDetail.ctmmeasureDtMsrtypeDtos">
          <div
            class="data-detail"
            v-for="(item,index) in bodyDetail.ctmmeasureDtMsrtypeDtos"
            :key="index"
          >
            <div class="flex-box" v-for="(_item,_index) in item.measureInfoList" :key="_index">
              <p>{{_item.gctMeasureHdName}}(单位)</p>
              <p>{{_item.cleanValue}}</p>
            </div>
          </div>
        </template>
      </template>

      <div v-else class="no-detail-data">
        <p>该量体数据已被您删除了哦</p>
      </div>
    </div>
    <div
      class="immediately-appointment flex-row"
      @click="deleteBodyData()"
      v-if="bodyDetail.ctmmeasureDtMsrtypeDtos"
    >删除数据</div>
  </div>
</template>
<script>
import { Dialog } from "vant";
import { Volume } from "../../api/service";
import Storage from "../../util/storage";
import { Toast } from "vant";
export default {
  data() {
    return {
      userId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      entrance: this.$route.query.entrance,
      bodyDetail: "" //量体信息
    };
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        window.scrollTo(0, 1);
      });
    }, 0);

    if (this.entrance == 2) {
      this.getAmoutBodyDetail();
    } else {
      this.bodyDetail = this.$route.query.bodyDetail;
    }
  },
  methods: {
    async getAmoutBodyDetail() {
      let data = {
        pageNum: 1,
        pageSize: 10,
        ctmUsrId: this.userId,
        companyId: this.companyId,
        salemeasureHdId: this.$store.state.dressed.amountId
      };
      const res = await Volume.getCtmmeasure(data);
      if (res.list.length == 0) return;
      this.bodyDetail = res.list[0];

      this.bodyDetail.sexId == "10040201"
        ? (this.bodyDetail.sexName = "男")
        : (this.bodyDetail.sexName = "女");
    },
    /**
     * 删除量体数据
     * @param
     *
     *
     */
    async deleteBodyData() {
      let data = {
        userId: this.userId,
        companyId: this.companyId,
        ids: this.bodyDetail.id,
        ownCompanyId: this.ownCompanyId
      };
      Dialog.confirm({
        message: "确定删除该量体数据?"
      }).then(() => {
        Volume.delCtmMeasureHd(data).then(res => {
          Toast(res == 0 ? "删除失败!" : "删除成功!");
          this.$router.go(-1);
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./scss/volume.scss";
/deep/.van-list__error-text,
.van-list__finished-text,
.van-list__loading-text {
  display: none;
}
.no-detail-data {
  font-size: computed(28);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

.amount-body-detail {
  background: #edf0f7;
  overflow: hidden;

  width: 100%;
  height: 100%;

  .body-detail {
    background: #fff;
    padding: computed(30) computed(30) computed(10) computed(30);
    .detail-people {
      padding-bottom: computed(30);
      border-bottom: computed(1) solid #cccccc;
      margin-bottom: computed(30);
      p {
        width: 50%;
        font-size: computed(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
    .data-detail {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      div {
        width: 50%;
        margin-bottom: computed(20);

        p {
          font-size: computed(24);
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        p:nth-child(1) {
          margin-right: computed(30);
          width: 61%;
        }
      }
    }
  }
}
</style>