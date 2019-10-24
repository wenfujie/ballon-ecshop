<template>
  <div class="amount-body" :class="[bodyList.length==0?'no-data':'']">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="bodyList.length>0">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :immediate-check="false"
        :offset="200"
      >
        <div class="list-item flex-row" v-for="(item,index) in bodyList" :key="index">
          <div class="left-item">
            <p class="omit">着装人：{{item.dressedusrName}}</p>
            <p class="body-font">性别：{{item.sexName?item.sexName:'无'}}</p>
          </div>
          <div
            class="right-item body-font"
            v-if="item.ctmmeasureDtMsrtypeDtos"
            @click="toViewData(item)"
          >
            查看数据
            <span>〉</span>
          </div>
          <div class="right-item body-font" v-else>暂无量体数据</div>
        </div>
      </van-list>
    </van-pull-refresh>
    <EmptyContent v-else :emptyText="'暂无量体数据'"></EmptyContent>

    <!-- <div class="immediately-appointment flex-row" @click="addBooking()">预约量体</div> -->
  </div>
</template>
<script>
import { UserService, Volume } from "../../api/service";
import { List, PullRefresh, Toast } from "vant";
import mixin from "../../mixins/requestData";
import Storage from "../../util/storage";
import EmptyContent from "../../components/EmptyContent";
export default {
  mixins: [mixin],
  components: {
    "van-list": List,
    "van-pull-refresh": PullRefresh,
    EmptyContent: EmptyContent
  },
  data() {
    return {
      bodyList: [], //量体列表
      userId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      ownCompanyId: Storage.get("COMPANYID").company_id
    };
  },
  methods: {
    addBooking() {
      console.log("addBookingaddBookingaddBooking");
      this.$router.push({
        path: "/booking-quantity-body",
        query: {
          entrance: 2
        }
      });
    },
    onRefresh() {
      setTimeout(() => {
        this.totalPage = 0;
        this.pageNumber = 1;
        this.getAmountBodyList();
      }, 500);
    },
    onLoad() {
      if (this.isLoading) return;
      setTimeout(() => {
        this.pageNumber++;
        this.getAmountBodyList(1);
      }, 500);
    },

    /**
     *
     * 获取量体列表
     * @param {*} params
     * ctmUsrId
     * companyId
     * dressedUsrName 可不传
     * pageNum
     * pageSize
     */
    async getAmountBodyList(isPull) {
      let data = {
        ctmUsrId: Storage.get("USER_INFO").usrId,
        companyId: Storage.get("COMPANYID").company_id,
        dressedUsrName: "",
        pageNum: this.pageNumber,
        pageSize: 10
      };
      const res = await Volume.getCtmmeasure(data);
      this.getList(isPull, res);
      this.bodyList = this.dataList;

    },
    toViewData(item) {
      console.log("7777777777");
      this.$router.push({
        path: "/amount-body-detail",
        query: {
          entrance: 1,
          bodyDetail: item
        }
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        window.scrollTo(0, 1);
      });
    }, 0);

    this.getAmountBodyList();
  }
};
</script>

<style scoped lang="scss">
/deep/.van-list__error-text,
.van-list__finished-text,
.van-list__loading-text {
  display: none;
}
/deep/.van-list__loading {
  text-align: center;
  background: #fff;
}
/deep/.van-pull-refresh {
  overflow: scroll;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
@import "./scss/volume.scss";
.body-font {
  font-size: computed(24);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);

  span {
    margin-left: computed(5);
  }
}

.amount-body {
   height: 100%;
  width: 100%;
  background: #edf0f7;

  .list-item {
    background: #fff;
    padding: computed(30);
    justify-content: space-between;
    margin-bottom: computed(10);
    .left-item {
      border: comptued(1);
      width: 76%;
      p:nth-child(1) {
        width: 100%;

        margin-bottom: computed(10);
        font-size: computed(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>
