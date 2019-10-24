<template>
  <div class="my-reserve">
    <tab
      :tabList="reserveTab"
      @changeStatus="changeStatus"
      @getEvent="getVolumeList"
      @getScroll="getScroll"
      :active.sync="active"
    />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" ref="list">
      <van-list
        v-model="loading"
        :finished="finished"
        @load="onLoad"
        :immediate-check="false"
        :offset="200"
      >
        <div class="reserve-list" v-if="volumeList.length>0">
          <div class="list-item" v-for="(item,index) in volumeList" :key="index">
            <div class="item-way flex-row">
              <p>{{item.msrWayName}}</p>
              <p>{{item.text}}</p>
            </div>
            <div class="item-name flex-row">
              <p class="omit">{{item.cargousrName}}</p>
              <p>量体时间：{{item.orderTime}}</p>
            </div>
            <p
              class="detail-address"
            >{{item.stateName}} {{item.cityName}}{{item.destName}}{{item.address}}</p>
            <div class="line"></div>
            <div class="go-detail flex-row">
              <p class="flex-row" @click="goResrveDetail(item)">查看详情</p>
            </div>
          </div>
        </div>
        <EmptyContent v-else style="height:750px;" :emptyText="'暂无预约数据'"></EmptyContent>
      </van-list>
    </van-pull-refresh>

    <!-- <div class="immediately-appointment flex-row" @click="addBooking()">新增预约</div> -->
  </div>
</template>
<script>
import tab from "./components/tab";
import { List, PullRefresh, Toast } from "vant";
import { Volume, UserService, Order } from "../../api/service";
import mixin from "../../mixins/requestData";
import Storage from "../../util/storage";

import { mapState, mapActions } from "vuex";
import EmptyContent from "../../components/EmptyContent";
export default {
  mixins: [mixin],
  components: {
    "van-list": List,
    "van-pull-refresh": PullRefresh,
    EmptyContent,
    tab
  },
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
      statusTabs: {
        "0": {
          statusIds: ["10051501", "10051502", "10051503", "10051504"]
        },
        "1": {
          statusIds: ["10051505"]
        },
        "2": {
          statusIds: ["10051506"]
        }
      },
      active:
        this.$store.state.dressed.activeStatus != "-1"
          ? this.$store.state.dressed.activeStatus
          : 0,
      usrId: Storage.get("USER_INFO").usrId,
      companyId: Storage.get("COMPANYID").company_id,
      ownCompanyId: Storage.get("COMPANYID").company_id,
      volumeList: [], //预约列表
      reserveTab: [{ name: "进行中" }, { name: "已完成" }, { name: "已取消" }]
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "member-center") {
      this.SetStatus(0);
    }
    next();
  },
  methods: {
    ...mapActions("dressed", ["SetRerveId", "SetStatus"]),

    changeStatus(tabIndex) {
      this.active = tabIndex;
    },
    getScroll() {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    goResrveDetail(item) {
      this.SetRerveId(item.id);
      this.SetStatus(this.active);
      this.$router.push({
        path: "/reserve-detail"
      });
    },
    /**
     *加载 上拉加载
     * @param
     *
     */
    onLoad() {
      if (this.isLoading) return;

      setTimeout(() => {
        this.pageNumber++;

        this.getVolumeList(1);
      }, 500);
    },
    /**
     * 获取预约列表
     * @param
     *usrId
     *companyId
     *searchUsrId
     *statusIds 数组
     *pageNum
     *pageSize
     */
    async getVolumeList(isPull, active, tab) {
      if (tab) {
        this.active = active;
        this.totalPage = 0;
        this.pageNumber = 1;
      }
      let data = {
        usrId: this.usrId,
        companyId: this.companyId,
        searchUsrId: this.usrId,
        statusIds: this.statusTabs[this.active].statusIds.toString(),
        pageNum: this.pageNumber,
        pageSize: 10
      };
      const res = await Volume.getVolumeList(data);
      this.getList(isPull, res);
      this.volumeList = this.dataList;
      this.volumeList.forEach(item => {
        this.stateList.forEach(_item => {
          if (item.statusCode == _item.value) {
            item.text = _item.txt;
          }
        });
      });
    },
    /**
     * 下拉刷新
     * @param
     *
     */
    onRefresh() {
      setTimeout(() => {
        this.totalPage = 0;
        this.pageNumber = 1;
        this.getVolumeList(0, this.active); //加载数据
      }, 500);
    },
    addBooking() {
      this.$router.push({
        path: "/booking-quantity-body",
        query: {
          entrance: 1
        }
      });
    }
  },

  mounted() {
    this.$nextTick(() => {
      window.scrollTo(0, 1);
    });

    this.getVolumeList(0, 0);
  },

  $route: {
    handler: function(val, oldVal) {
      if (val.path == "/my-reserve") {
        this.getVolumeList(0, 0);
      }
    },
    // 深度观察监听
    deep: true
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
@import "./scss/volume.scss";
/deep/.van-pull-refresh {
  overflow: scroll;
  height: 100%;
  -webkit-overflow-scrolling : touch;
}
.my-reserve {
  width: 100%;
  height: 100%;
  background: #edf0f7;
  -webkit-overflow-scrolling: touch;
  .reserve-list {
    padding-top: computed(88);
    .list-item {
      padding: computed(28) computed(30) computed(20) computed(30);
      margin-top: computed(10);
      background: #fff;
      .item-way {
        justify-content: space-between;
        font-size: computed(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);

        p:nth-child(1) {
          color: #666666;
        }
        p:nth-child(2) {
          color: #2ba4f3;
        }
      }
      .item-name {
        margin: computed(30) computed(0) computed(20) computed(0);
        justify-content: flex-start;
        font-size: computed(28);
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);

        p:nth-child(1) {
          width: 25%;
          margin-right: computed(40);
        }
      }
      .detail-address {
        font-size: computed(24);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; // 控制多行的行数
        -webkit-box-orient: vertical;
      }
      .line {
        height: computed(30);
        border-bottom: computed(1) solid #cccccc;
        margin-bottom: computed(20);
      }
      .go-detail {
        justify-content: flex-end;
        p {
          padding: computed(15) computed(20);
          font-size: computed(24);
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          border: computed(1) solid #333333;
        }
      }
    }
  }
}
</style>
