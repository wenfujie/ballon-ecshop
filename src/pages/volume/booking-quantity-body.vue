<!--
 * @Description: 
 * @Author: wxx
 * @Date: 2019-09-07 15:13:50
 * @LastEditTime: 2019-09-23 10:03:04
 * @LastEditors: wxx
 -->
<template>
  <form class="booking-quantity-body" id="registerForm" method="post">
    <tab :tabList="bodyTab" :active.sync="active" @howWay="howWay" />
    <div class="input-style">
      <p class="title">量体地址</p>
      <!-- 上门量体 -->
      <template v-if="!active">
        <div class="select flex-row" @click.stop="showDoorArea=true">
          <p v-if="doorAddress.length!=0">{{`${doorAddress[0]}${doorAddress[1]}${doorAddress[2]}`}}</p>
          <p v-else>选择省市区</p>
          <p>〉</p>
        </div>
        <van-field
          maxlength="150"
          type="textarea"
          v-model="doorDetailAddress"
          clearable
          placeholder="请输入详细的量体地址"
        />
      </template>
      <!-- 到店量体 -->
      <template v-else>
        <div class="select flex-row" @click.stop="goSelectShop()">
          <p v-if="shopAddress.length!=0">{{`${shopAddress[0]}${shopAddress[1]}${shopAddress[2]}`}}</p>
          <p v-else>选择省市区</p>
          <p>〉</p>
        </div>

        <div class="select flex-row no-line" v-if="dptInfor.dptName">
          <div class="shop-address">
            <p v-text="`[${dptInfor.dptName}]`"></p>
            <p v-text="dptInfor.address">{{dptInfor.address}}</p>
          </div>
        </div>

        <div class="select no-line flex-row" @click.stop="selectPicer(1)" v-else>
          <p class="select-big">请选择门店</p>
          <p></p>
        </div>
      </template>
    </div>
    <div class="input-style">
      <p class="title">着装人姓名</p>
      <van-field v-model="cargousrName" maxlength="15" clearable placeholder="请输入着装人姓名" />
    </div>
    <div class="input-style select-sex flex-box">
      <p class="title">请选择性别</p>
      <div class="sex-style flex-row">
        <p
          class="flex-row"
          :class="[sexIndex==index?'over-select':'no-select']"
          @click.stop="selectSex(index)"
          v-for="(item,index) in sexList"
          :key="index"
        >{{item.text}}</p>
      </div>
    </div>

    <div class="input-style">
      <p class="title">联系电话</p>
      <van-field maxlength="11" v-model="cargoMobile" clearable placeholder="请输入联系电话" />
    </div>
    <div class="input-style flex-box time-style" @click.stop="selectPicer(2)" v-if="!active">
      <p class="title">请选择量体时间</p>
      <div class="time">
        {{orderTimeDoor|formatDate}}
        <span>〉</span>
      </div>
    </div>
    <div class="input-style flex-box time-style" @click.stop="selectPicer(3)" v-else>
      <p class="title">请选择量体时间</p>
      <div class="time">
        {{orderTimeShop|formatDate}}
        <span>〉</span>
      </div>
    </div>
    <div class="input-style">
      <p class="title">备注</p>
      <van-field type="textarea" maxlength="120" v-model="note" clearable placeholder="请输入备注" />
    </div>
    <div
      class="immediately-appointment flex-row"
      @click="getBillType"
      v-if="entrance==0 || isOrder"
    >提交</div>
    <div class="immediately-appointment flex-row" @click="submitBooking" v-else>提交</div>
    <!-- 上门量体 -->
    <van-popup v-model="showDoorArea" position="top">
      <van-area
        :value="codeDoor"
        show-toolbar
        title="省市区地址"
        :area-list="areaDoorList"
        @confirm="areaDoorChange"
        @cancel="showDoorArea = false"
        :visible-item-count="5"
      />
    </van-popup>

    <!-- 到店量体 -->
    <!-- <van-popup v-model="showShopArea" position="top">
      <van-area
        show-toolbar
        title="省市区地址"
        :area-list="areaShopList"
        @confirm="areaShopChange"
        @cancel="showShopArea = false"
        :visible-item-count="5"
        :value="codeShop"
      />
    </van-popup>-->

    <!-- 上门量体 -->
    <van-popup v-model="showDoorDate" position="top">
      <van-picker
        show-toolbar
        title="可预约时间"
        :columns="columnsDoorTime"
        @change="changeDoorTime"
        @confirm="confirmDoorTime"
        @cancel="showDoorDate = false"
      />
    </van-popup>

    <!-- 到店量体 -->
    <van-popup v-model="showShopDate" position="top">
      <van-picker
        show-toolbar
        title="可预约时间"
        :columns="columnsShopTime"
        @change="changeShopTime"
        @confirm="confirmShopTime"
        @cancel="showShopDate = false"
      />
    </van-popup>

    <!-- 门店 -->

    <!-- <van-popup v-model="selectShop" position="top">
      <van-picker
        show-toolbar
        title="可预约门店"
        :columns="shopList"
        @cancel="selectShop = false"
        @confirm="selectShopAddress"
      />
    </van-popup>-->
  </form>
</template>
<script>
import getLocationPosition from "../../util/getLocation";
import { cityData } from "../../assets/js/cityData";
import tab from "./components/tab";
import { Volume, Order } from "../../api/service";
import { Popup, Area, Field, DatetimePicker, Toast, Picker } from "vant";
import Storage from "../../util/storage";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      bthLock: false, //按钮锁
      billCode: this.$route.query.billCode,
      entrance: this.$route.query.entrance,
      columnsDoorTime: [], //上门量体可选时间
      columnsShopTime: [], //到店量体可选时间
      dptCode: "", //门店的dptCode
      areaDoorList: [], //上门量体可选区域地址
      areaShopList: cityData, //到店量体全国地址
      dateObj: {}, //时间对象
      cardNo: Storage.get("CARDNO").cardNo, //会员号
      usrId: Storage.get("USER_INFO").usrId, //用户id
      shopId: Storage.get("properties").shopId, //门店id
      shopCode: Storage.get("properties").shopCode, //门店code
      codeDoor: "",
      codeShop: "", //默认获取IP地址code
      showShopDate: false, //到店预约时间是否显示
      showDoorDate: false, //上门预约时间是否显示
      note: "", //备注
      cargousrName: "", //着装人姓名
      doorDetailAddress: "", //上门量体到店详情地址
      sexCode: "D_MALE", //性别
      cargoMobile: "", //电话
      orderTimeDoor: "", //上门时间
      orderTimeShop: "", //到店时间
      showDoorArea: false, //上门区域选择
      showShopArea: false, //到店区域选择
      doorAddress: [], //上门区域地址
      shopAddress: [], //到店区域地址
      shopInfor: this.$store.state.dressed.storeInfor,
      bookingInfor: this.$route.query.bookingInfor
        ? this.$route.query.bookingInfor
        : {},
      dptInfor: {
        dptName: "",
        address: ""
      }, //到店 -门店信息
      active: this.$route.query.way ? this.$route.query.way : 0, //tab选项卡
      sexIndex: 0, //性别选项卡
      reserveId: "", //预约单的ID
      sexList: [
        //性别列表
        { text: "男", sexCode: "D_MALE" },
        { text: "女", sexCode: "D_FEMALE" }
      ], //tab选项卡名称
      bodyTab: [{ name: "上门量体" }, { name: "到店量体" }],
      doorTimeList: [],
      shopTimeList: [],
      count: 0,
      clickCount: this.$route.query.clickCount
        ? this.$route.query.clickCount
        : 1,
      rtlOrdDtId: this.$route.query.rtlOrdDtId,
      buscontsCode: "D_BUSCONTS_WSC",
      isOrder: this.$route.query.isOrder ? this.$route.query.isOrder : 0 //是否是订单过来的
    };
  },
  components: {
    tab,
    "van-datetime-picker": DatetimePicker,
    "van-area": Area,
    "van-popup": Popup,
    "van-field": Field,
    "van-picker": Picker
  },

  methods: {
    goSelectShop() {
      this.clickCount++;
      console.log(this.bookingInfor, "bookingInforbookingInforbookingInfor");
      this.$router.replace({
        name: "shop-address",
        query: {
          way: 1,
          goBooking: 1,
          clickCount: this.clickCount,
          isOrder: this.isOrder,
          billCode: this.billCode,
          rtlOrdDtId: this.rtlOrdDtId,
          bookingInfor: this.bookingInfor,
          orderTimeDoor: this.orderTimeDoor,
          doorDetailAddress: this.doorDetailAddress
        }
      });
    },
    selectPicer(type) {
      let emitList = {
        "1": () => {
          if (this.shopAddress.length == 0) return Toast("请选择省市区");
        },
        "2": () => {
          if (JSON.stringify(this.doorTimeList) == "{}")
            return Toast("暂无可预约量体的时间");
          window.scrollTo(0, 1);
          this.showDoorDate = true;
        },
        "3": () => {
          if (this.dptInfor.dptName.length == 0) return Toast("请先选择门店");
          if (JSON.stringify(this.shopTimeList) == "{}")
            return Toast("暂无可预约量体的时间");
          window.scrollTo(0, 1);
          this.showShopDate = true;
        }
      };
      emitList[type]();
    },

    changeDoorTime(picker, values) {
      picker.setColumnValues(1, this.dateObj[values[0]]);
    },
    changeShopTime(picker, values) {
      picker.setColumnValues(1, this.dateObj[values[0]]);
    },
    //上门量体可用地址
    async getMyVisitedAdress() {
      console.log("7777");
      let data = {
        usrId: this.usrId,
        companyId: this.companyId,
        cardNo: this.cardNo,
        masterWayCode: "D_MSRVISIT"
      };
      const res = await Volume.getDoorAddr(data);

      if (!res) return;
      let provinceMap = {},
        cityMap = {},
        countyMap = {};
      res.forEach(item => {
        provinceMap[item.provinceCode] = item.provinceName;
        cityMap[item.cityCode] = item.cityName;
        countyMap[item.districtCode] = item.districtName;
      });
      this.areaDoorList = {
        province_list: provinceMap,
        city_list: cityMap,
        county_list: countyMap
      };

      if (this.bookingInfor.msrWayId == "10050301" && this.entrance == 1)
        return;

      if (this.count != 0) return;

      let countryCode = Storage.get("POSITION").location[2];
      this.count += 1;

      if (!this.areaDoorList.county_list[countryCode]) {
        this.doorAddress = [];
        return Toast("您当前所在区域暂时无上门量体服务");
      } else {
      }
    },
    //可预约时间   active 0 上门量体 取本地缓存shopCode   active 1 到店量体 取门店dptCode

    async getTime() {
      if (this.active == 1 && this.dptCode == "") return;
      let data = {
        dptCode: this.active == 0 ? this.shopCode : this.dptCode,
        buscontscode: "D_BUSCONTS_WSC",
        usrId: this.usrId,
        companyId: this.companyId,
        cardNo: this.cardNo
      };
      console.log(data, "datadata");

      const res = await Volume.getVolumeTime(data);

      this.active == 0 ? (this.doorTimeList = res) : (this.shopTimeList = res);
      console.log(this.doorTimeList, "doorTimeListdoorTimeList");
      console.log(this.shopTimeList, "shopTimeListshopTimeList");
      if (JSON.stringify(res) == "{}") return false;

      let list = [],
        valueF = res[0].ymd; //默认第一个;
      // valueF = res[0].ymd; //默认第一个;
      list = res.map(item => {
        return {
          value: item.ymd,
          list: item.hourList
        };
      });
      list.forEach(item => {
        this.dateObj[item.value] = item.list;
      });
      this.columnsTime = [
        {
          values: Object.keys(this.dateObj),
          className: "column1"
        },
        {
          values: this.dateObj[valueF],
          className: "column2",
          defaultIndex: 0
        }
      ];
      this.active == 1
        ? (this.columnsShopTime = this.columnsTime)
        : (this.columnsDoorTime = this.columnsTime);
    },
    confirmDoorTime(val) {
      this.orderTimeDoor = `${val[0]} ${val[1]}:00`;
      this.showDoorDate = false;
    },
    confirmShopTime(val) {
      if (this.shopTimeList.length == 0) return Toast("请选择时间");
      this.orderTimeShop = `${val[0]} ${val[1]}:00`;
      this.showShopDate = false;
    },

    howWay(way) {
      this.active = way;
    },
    //上门量体选择
    areaDoorChange(value) {
      this.doorAddress = [value[0].name, value[1].name, value[2].name];
      this.showDoorArea = false;
      this.orderTimeDoor = "";
    },

    selectSex(index) {
      this.sexIndex = index;
      this.sexCode = this.sexList[index].sexCode;
    },
    // D_MSRSHOP 到店       D_MSRVISIT 上门     active 0 上门  1 到店
    async submitBooking(saleOrdDtList) {
      this.address = this.active == 0 ? this.doorAddress : this.shopAddress;

      if (this.address.length == 0) {
        Toast(this.active == 0 ? "请选择上门量体地址" : "请选择到店量体地址");
        return false;
      }

      if (this.active == 0) {
        if (this.doorDetailAddress.length == 0) {
          Toast("请填写详细地址");
          return false;
        } else if (
          this.doorDetailAddress.length < 2 ||
          this.doorDetailAddress.length > 50
        ) {
          Toast("详细地址长度需2-50字符");
          return false;
        }
      } else {
        if (this.dptInfor.dptName.length == 0) {
          Toast("请选择门店");
          return false;
        }
      }
      if (this.cargousrName.length == 0) {
        Toast("请填写着装人姓名");
        return false;
      } else if (
        this.cargousrName.length < 2 ||
        this.cargousrName.length > 15
      ) {
        Toast("着装人姓名长度需2-15字符");
        return false;
      }
      if (this.note && this.note.length > 100) {
        Toast("备注需在100以内字符");
        return false;
      }

      let regPho = new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/);
      if (this.cargoMobile.length == 0) {
        Toast("请填写手机号");
        return false;
      } else if (!regPho.test(this.cargoMobile)) {
        Toast("手机号格式不符");
        return false;
      }
      let time = "";
      this.active == 0
        ? (time = this.orderTimeDoor)
        : (time = this.orderTimeShop);
      if (time.length == 0) {
        Toast(this.active == 0 ? "请选择上门量体时间" : "请选择到店量体时间");
        return false;
      }
      if (this.bthLock) return false;
      this.bthLock = true;
      let data = {
        address:
          this.active == 0 ? this.doorDetailAddress : this.dptInfor.address,
        dptCode: this.active == 0 ? this.shopCode : this.dptCode,
        buscontscode: "D_BUSCONTS_WSC",
        cardNo: this.cardNo,
        cargousrSex: this.sexCode,
        msrWayCode: this.active == 0 ? "D_MSRVISIT" : "D_MSRSHOP",
        cargousrName: this.cargousrName,
        cargoMobile: this.cargoMobile,
        stateName: this.active == 0 ? this.doorAddress[0] : this.shopAddress[0],
        cityName: this.active == 0 ? this.doorAddress[1] : this.shopAddress[1],
        destName: this.active == 0 ? this.doorAddress[2] : this.shopAddress[2],
        usrId: this.usrId,
        dptId: this.active == 0 ? this.shopId : this.dptInfor.dptId,
        shopId: this.shopId,
        measureMemo: this.note,
        orderTime: this.active == 0 ? this.orderTimeDoor : this.orderTimeShop
      };
      //预约单过来
      if (this.entrance == 1 || this.entrance == 3) {
        data.id = this.reserveId;
      }
      //选择着装人 或者 订单过来
      if (this.entrance == 0 || this.isOrder) {
        data.rtlOrdHdCode = this.billCode;
        data.saleOrdDtList = saleOrdDtList;
      }
      await Volume.saveVolume(data)
        .then(() => {
          Toast(this.entrance !== 1 ? "预约量体成功" : "修改预约成功");
          this.bthLock = false;
          Order.clearAllCache();

          console.log(-this.clickCount, "this.clickCount");
          this.$router.go(-1);
        })
        .catch(err => {
          if (err.errorCode == 88050511) Toast(err.errorMsg);
          this.bthLock = false;
        });
    },
    /**
     * 获取订单的状态
     * @param
     *
     */
    async getBillType() {
      let data = {
        usrId: this.usrId,
        ownCompanyId: this.companyId,
        companyId: this.companyId,
        ordHdCode: this.billCode,
        buscontsCode: "D_BUSCONTS_WSC"
      };

      const res = await Volume.getBillType(data);
      //与订单有关联的预约单
      let saleOrdDtList = [];
      res.forEach(item => {
        if (item.measureOpCode == "D_MSROPMSR") {
          saleOrdDtList = [{ saleOrdDtId: this.rtlOrdDtId }];
        }
      });
      this.submitBooking(saleOrdDtList);
    },
    editBooking() {
      this.active == 0
        ? (this.orderTimeDoor = this.bookingInfor.orderTime)
        : (this.orderTimeShop = this.bookingInfor.orderTime);
      //从量体地址进来
      this.sexCode = this.bookingInfor.sexCode;
      this.sexIndex = this.bookingInfor.sexCode == "D_MALE" ? 0 : 1;

      this.active == 0
        ? (this.doorAddress = [
            this.bookingInfor.stateName,
            this.bookingInfor.cityName,
            this.bookingInfor.destName
          ])
        : (this.shopAddress = [
            this.bookingInfor.stateName,
            this.bookingInfor.cityName,
            this.bookingInfor.destName
          ]);
      this.active == 0
        ? (this.doorDetailAddress = this.bookingInfor.address)
        : (this.dptInfor.address = this.bookingInfor.address);
      this.note = this.bookingInfor.measureMemo;
      this.codeDoor = this.bookingInfor.destCode;
      this.cargousrName = this.bookingInfor.cargousrName;
      this.cargoMobile = this.bookingInfor.cargoMobile;

      if (this.active == 1) {
        console.log(
          this.bookingInfor.dptName,
          "this.bookingInfor.dptNamethis.bookingInfor.dptName"
        );
        // if (
        //   this.bookingInfor.msrWayId == "10050301" &&
        //   !this.bookingInfor.dptNewName
        // ) {
        //   this.bookingInfor.dptName == "";
        //   this.bookingInfor.dptNewName=this.bookingInfor.dptName
        // }
        this.dptInfor = {
          dptId: this.bookingInfor.dptId,
          dptName: this.bookingInfor.dptName
        };
      }

      if (this.active == 0) {
        this.doorDetailAddress = this.bookingInfor.address;
      } else {
        this.dptInfor.address = this.bookingInfor.address;
      }

      if (
        this.bookingInfor.msrWayId == "10050301" &&
        !this.bookingInfor.newShop
      ) {
        this.bookingInfor.newShop = "1";
      }
      if (this.doorAddress.length == 0) {
        this.doorAddress = Storage.get("POSITION").locationTxt;
      }
      if (this.shopAddress.length == 0) {
        this.shopAddress = Storage.get("POSITION").locationTxt;
      }

      this.dptCode = this.bookingInfor.dptCode;
      this.reserveId = this.bookingInfor.id;
      this.getTime();
    }
  },
  watch: {
    active: {
      handler(val, oldVal) {
        this.getMyVisitedAdress();

        if (val != oldVal) {
          this.getTime();
        }
        this.bthLock = false;
      },
      deep: true
    },

    cargousrName: function(val) {
      this.bookingInfor.cargousrName = val;
    },
    sexCode: function(val) {
      this.bookingInfor.sexCode = val;
    },
    cargoMobile: function(val) {
      this.bookingInfor.cargoMobile = val;
    },
    note: function(val) {
      this.bookingInfor.measureMemo = val;
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, "tototototo");
    if (typeof to.query.goBooking == "string") {
    }

    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "shop-address") {
    }

    next();
  },
  mounted() {},

  created() {
    setTimeout(() => {
      this.$nextTick(() => {
        window.scrollTo(0, 1);
      });
    }, 0);
    getLocationPosition().then(() => {
      //入口1 为编辑 3从量体地址进来
      if (this.entrance == 1 || this.entrance == 3) {
        if (this.entrance == 3) {
          this.orderTimeShop = "";
          this.bookingInfor.orderTime = "";
          this.orderTimeDoor = this.$route.query.orderTimeDoor;
          this.doorDetailAddress = this.$route.query.doorDetailAddress;
        }
        this.active = this.$route.query.way;
        this.editBooking();
      } else if (this.entrance == 2 || this.entrance == 0) {
        this.doorAddress = Storage.get("POSITION").locationTxt
          ? Storage.get("POSITION").locationTxt
          : [];

        this.shopAddress = Storage.get("POSITION").locationTxt
          ? Storage.get("POSITION").locationTxt
          : [];
        //到店区域地址
        this.codeShop = Storage.get("POSITION").location[2];
        this.codeDoor = Storage.get("POSITION").location[2];
      }
      if (this.active == 0) {
        this.getTime();
        this.getMyVisitedAdress();
      }
    });
    console.log(
      Storage.get("properties"),
      'Storage.get("properties")Storage.get("properties")'
    );
    console.log(this.shopCode, "shopCodeshopCode");
  }
};
</script>
<style lang="scss" scoped>
/deep/.van-field--min-height .van-field__control {
  min-height: 60px;
}
@import "./scss/volume.scss";
/deep/.van-cell {
  padding-left: computed(0);
}
.booking-quantity-body {
  padding-top: computed(88);
  overflow: hidden;
  width: 100%;
  padding-bottom: computed(100);
  background: #edf0f7;
  .publicity-pictures {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  .input-style {
    margin-top: computed(10);
    padding: computed(20) computed(30);
    background: #fff;
    .title {
      font-size: computed(28);
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .select {
      margin-top: computed(34);
      justify-content: space-between;
      padding-bottom: computed(20);
      border-bottom: computed(1) solid#CCCCCC;
      font-size: computed(24);
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      .shop-address {
        p:nth-child(1) {
          color: #2ba4f3;
        }
        p:nth-child(2) {
          color: inherit;
        }
      }
    }
    .no-line {
      border: none !important;
    }
    .select-big {
      font-size: computed(28);
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
  .select-sex {
    justify-content: space-between;
    .sex-style {
      width: computed(202);
      height: computed(50);
      p {
        width: 50%;
        font-size: computed(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
      }
      .no-select {
        color: #2ba4f3;
        border: computed(1) solid #2ba4f3;
        height: 96%;
      }
      .over-select {
        height: 100%;
        background: rgba(43, 164, 243, 1);
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .time-style {
    justify-content: space-between;
    .time {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      font-size: computed(28);
    }
  }
}
</style>
