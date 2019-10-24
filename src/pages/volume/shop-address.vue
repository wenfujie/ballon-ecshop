<template>
  <div class="shop-address">
    <div class="select-address flex-row" @click="showShopArea=true">
      <p>{{addressInfor.stateName}}</p>
      <p>{{addressInfor.cityName}}</p>
      <p>{{addressInfor.destName}}</p>
      <i class="iconfont icon-xialaxuan"></i>
    </div>
    <div class="map-style" id="allMap" ref="allmap"></div>
    <p
      class="flex-row load-more"
      :class="{'xiala': addressShowMore}"
      v-if="addressList.length > 1"
      @click="addressShowMore=!addressShowMore"
    >
      <i class="iconfont" :class="[!addressShowMore?'icon-shangla':'icon-xialaxuan']"></i>
    </p>
    <div
      class="address-list"
      v-if="addressList.length!=0"
      :class="[addressShowMore?'show-address':'no-show-address']"
    >
      <div v-for="(item,index) in addressList" :key="index">
        <div class="item-address" :key="index" v-if="(index>0&&addressShowMore==false)?false:true">
          <div class="flex-box">
            <p @click="selectStore(index)"></p>
            <span v-if="store==index" class="over-checked"></span>
            <div class="address-infor">
              <div class="flex-row">
                <p>[{{item.dptName}}]</p>
                <p>{{item.dptPhone?item.dptPhone:item.dptMobile}}</p>
              </div>
              <p>{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-address" v-else>
      <p>该区域没有门店</p>
      <p>请重新选择地区，或者移动地图试试～</p>
    </div>
    <div class="sure flex-row" @click="sure">确定</div>
    <van-popup v-model="showShopArea" position="top">
      <van-area
        show-toolbar
        title="省市区地址"
        :area-list="areaShopList"
        @confirm="areaChange"
        @cancel="cancelSelectShop"
        :visible-item-count="5"
        :value="codeShop"
      />
    </van-popup>
  </div>
</template>
<script>
import { cityData } from "../../assets/js/cityData";
import { Volume, Order } from "../../api/service";
import { Popup, Toast, Area, Picker } from "vant";
import Storage from "../../util/storage";
import { MP } from "../../util/map";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      addressShowMore: false,
      codeShop: Storage.get("POSITION").location[2], //默认获取IP地址code
      areaShopList: cityData, //到店量体全国地址
      showShopArea: false, //到店区域选择
      markers: [],
      infoActive: -1,
      store: -1,
      ownCompanyId: Storage.get("COMPANYID").company_id, //公司id
      dptId: "",
      addressInfor: {},
      storeVisible: false, //选择门店是否显示
      areaList: [], //区域列表
      addressList: [], //可用门店地址列表
      map: "", // 地图实例
      currentCity: "", //当前的城市
      storeInfor: {
        dptCode: ""
      },
      // storeInfor:
      //   this.$store.state.dressed.storeInfor != "1"
      //     ? this.$store.state.dressed.storeInfor
      //     : {}, //已选地址信息
      cardNo: Storage.get("CARDNO").cardNo,
      bookingInfor: this.$route.query.bookingInfor
        ? this.$route.query.bookingInfor
        : {}
    };
  },
  components: {
    "van-popup": Popup,
    "van-picker": Picker,
    "van-area": Area
  },
  beforeRouteLeave(to, from, next) {
    to.query.way = 1;
    to.query.bookingInfor = this.bookingInfor;
    next();
  },
  methods: {
    ...mapActions("dressed", ["SetStoreInfor", "setBookingInfor"]),
    cancelSelectShop(value) {
      this.showShopArea = false;
    },
    /**
     *确定选择地址
     * @param
     *selectPlease
     */
    sure() {
      console.log("//////////////////////");

      if (this.addressList.length == 0) return Toast("此区域无门店数据")
      console.log(this.storeInfor,'storeInforstoreInfor')
      if (!this.storeInfor.dptCode ||  this.storeInfor.dptCode.length == 0) return Toast("请选择门店");

      let {
        address,
        cityCode,
        cityName,
        districtCode,
        districtName,
        dptCode,
        dptId,
        provinceCode,
        provinceName,
        dptName
      } = this.storeInfor;

      this.bookingInfor.codeShop = this.codeShop;
      this.bookingInfor.address = address;
      this.bookingInfor.cityCode = cityCode;
      this.bookingInfor.cityName = cityName;
      this.bookingInfor.dptId = dptId;
      this.bookingInfor.destName = districtName;
      this.bookingInfor.destCode = districtCode;
      this.bookingInfor.stateName = provinceName;
      this.bookingInfor.stateCode = provinceCode;
      this.bookingInfor.dptCode = dptCode;
      this.bookingInfor.dptName = dptName;
      this.bookingInfor.newShop = "2";
      if (!this.bookingInfor.sexCode) {
        this.bookingInfor.sexCode = "D_MALE";
      }
      console.log(this.storeInfor,'storeInforstoreInforstoreInforstoreInforstoreInfor')
      this.$router.replace({
        name: "booking-quantity-body",
        query: {
          entrance: "3",
          way: 1,
          bookingInfor: this.bookingInfor,
          isOrder: this.$route.query.isOrder,
          billCode: this.$route.query.billCode,
          clickCount: this.$route.query.clickCount,
          rtlOrdDtId: this.$route.query.rtlOrdDtId,
          orderTimeDoor: this.$route.query.orderTimeDoor,
          doorDetailAddress: this.$route.query.doorDetailAddress
        }
      });
    },
    /**
     * 设置地图标识颜色前的判断
     * @param
     *item 当前点击的门店信息
     *index 索引
     */
    setMarkerStyle(item, index) {
      if (this.infoActive == index) {
        return;
      }
      if (this.infoActive != -1) {
        this.setMarkersColor(
          this.infoActive,
          require("../../assets/images/volume/location_select_no.png")
        );
      }
      this.infoActive = index;
      this.setMarkersColor(
        index,
        require("../../assets/images/volume/location_select.png")
      );
    },

    /**
     * 设置地图标识颜色
     * @param
     *index 索引
     *iconUrl 图标样式
     */
    setMarkersColor(index, iconUrl) {
      let icon = new BMap.Icon(iconUrl, new BMap.Size(24, 33), {
        anchor: new BMap.Size(24 / 2, 33)
      }); //显示图标大小
      this.markers[index].setIcon(icon); //设置标签的图标为自定义图标
    },
    /**
     * 地图点击事件
     * @param
     *e 当前的event
     */
    attribute(e) {
      let lat = e.currentTarget.point.lat;
      let lng = e.currentTarget.point.lng;
      this.map.panTo(new BMap.Point(lng, lat));
      //遍历门店，点击图标选中门店
      this.addressList.forEach((item, index) => {
        if (item.lon == lng && item.lat == lat) {
          this.setMarkerStyle(item, index);
          this.store = index;
          this.storeInfor = this.addressList[index];
          console.log(this.storeInfor, "storeInfor");

          this.storeInfor.dptCode = this.addressList[index].dptCode;
        }
      });
    },
    createdMap() {
      MP("kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG").then(BMap => {
        this.map = new BMap.Map("allMap");
        let point = "",
          marker = "",
          positon = "",
          top_left_navigation = new BMap.NavigationControl(); //右下角，添加默认缩放平移控件
        this.map.enableScrollWheelZoom(true); // 缩放
        this.map.addControl(top_left_navigation);
        this.addressInfor.destName == "全部"
          ? (positon = this.addressInfor.cityName)
          : (positon = this.addressInfor.destName);
        if (this.addressList.length == 0)
          return this.map.centerAndZoom(positon, 12);
        let markers = [];
        let infoActive = -1;
        this.addressList.forEach((item, index) => {
          point = new BMap.Point(item.lon, item.lat);
          this.map.centerAndZoom(point, 12);
          let storeIcon = new BMap.Icon(
            require("../../assets/images/volume/location_select_no.png"),
            new BMap.Size(24, 33),
            {
              anchor: new BMap.Size(24 / 2, 33)
            }
          ); //显示图标大小
          marker = new BMap.Marker(point, { icon: storeIcon }); // 创建标注
          marker.setIcon(storeIcon); //设置标签的图标为自定义图标
          markers.push(marker);
          this.map.addOverlay(marker); // 将标注添加到地图中
          marker.addEventListener("click", this.attribute);

          if (this.storeInfor.dptId && item.dptId == this.storeInfor.dptId) {
            this.store = index;
            this.storeInfor = this.addressList[index];
            infoActive = index;
          }
          this.markers = markers;
          this.infoActive = infoActive;
          if (infoActive != -1) {
            this.setMarkersColor(
              infoActive,
              require("../../assets/images/volume/location_select.png")
            );
            this.map.panTo(
              new BMap.Point(
                this.addressList[infoActive].lon,
                this.addressList[infoActive].lat
              )
            );
          }
        });
      });
    },
    /**
     * 选择门店  拿到门店id，省市区给父组件传参
     * @param
     *
     */
    selectStore(val, type) {
      console.log('77777777777777')
      //点击单个获取百度地图
      if (type == 1) {
        //修改
        this.createdMap();
        console.log('777777777524546')
        this.addressList.forEach((item, index) => {
          if (item.dptId == this.bookingForm.dptId) {
            this.store = index;
            this.storeInfor = this.addressList[index];
          }
        });
      } else {
        //新增

        this.store = val;
        this.setMarkerStyle(this.storeInfor, this.store);

        this.storeInfor = this.addressList[val];
        console.log(this.storeInfor,'storeInforstoreInforstoreInfor')
        this.storeInfor.dptCode = this.addressList[val].dptCode;
      }

      this.$nextTick(() => {
        this.map.panTo(
          new BMap.Point(this.storeInfor.lon, this.storeInfor.lat)
        );
      });
    },

    /**
     * 店面量体地址列表
     * @param
     * type 1 修改
     */
    async getShopAddress(type, bookingForm) {
      console.log("7777777777777777777777777");
      console.log(
        Storage.get("POSITION"),
        'Storage.get("POSITION")Storage.get("POSITION")Storage.get("POSITION")'
      );
      let data = {
        ownCompanyId: this.ownCompanyId,
        stateName: this.addressInfor.stateName,
        cityName: this.addressInfor.cityName,
        cardNo: this.cardNo,
        destName: this.addressInfor.destName,
        buscontscode: "D_BUSCONTS_WSC"
      };
      if (data.destName == "全部") {
        data.destName = "";
      }

      const res = await Volume.getShopAddr(data);
      this.addressList = res;
      this.currentCity = this.addressInfor.cityName;
      this.createdMap();
    },
    /**
     * 选择门店弹框显示
     * @param
     *
     */
    storeShow() {
      this.storeVisible = !this.storeVisible;
    },
    /**
     * 取消
     * @param
     *
     */
    emptyData() {
      this.storeVisible = false;
      this.cardNo = Storage.get("CARDNO").cardNo;
      this.ownCompanyId = Storage.get("COMPANYID").company_id;
      this.addressInfor = {
        stateName: Storage.get("POSITION").locationTxt[0],
        cityName: Storage.get("POSITION").locationTxt[1],
        destName: Storage.get("POSITION").locationTxt[2]
      };
      this.store = "-1";

      this.currentCity = ""; //当前的城市
      this.storeInfor = []; //已选地址信息
    },
    /**
     * 选择省市区
     * @param
     * value  数组省市区
     */
    areaChange(value) {
      this.store = "-1";
      this.storeInfor = []; //已选地址信息

      if (value) this.addressInfor.addressId = value[2].code;
      this.codeShop = value[2].code;

      this.addressInfor = {
        stateName: value[0].name,
        cityName: value[1].name,
        destName: value[2].name
      };
      if (this.addressInfor.destName == "全部") {
        this.store = "";
      }

      this.getShopAddress();
      this.showShopArea = false;
    }
  },
  mounted() {
    if (this.bookingInfor.stateName) {
      this.destCode = this.bookingInfor.destCode;
      this.addressInfor = {
        stateName: this.bookingInfor.stateName,
        cityName: this.bookingInfor.cityName,
        destName: this.bookingInfor.destName
      };
      this.storeInfor.dptId = this.bookingInfor.dptId;

      this.codeShop = this.bookingInfor.codeShop
        ? this.bookingInfor.codeShop
        : this.bookingInfor.destCode;

      if (this.bookingInfor.newShop == 1) {
        this.addressInfor = {
          stateName: Storage.get("POSITION").locationTxt[0],
          cityName: Storage.get("POSITION").locationTxt[1],
          destName: Storage.get("POSITION").locationTxt[2]
        };
        this.codeShop = Storage.get("POSITION").location[2];
        console.log(this.codeShop,'codeShopcodeShop')
      }
    } else {
      this.addressInfor = {
        stateName: Storage.get("POSITION").locationTxt[0],
        cityName: Storage.get("POSITION").locationTxt[1],
        destName: Storage.get("POSITION").locationTxt[2]
      };
      this.codeShop = Storage.get("POSITION").location[2];
    }
    this.getShopAddress();
  }
};
</script>
<style lang="scss" scoped>
.shop-address {
  height: 100%;
  width: 100%;
  position: relative;
  .map-style {
    width: 100%;
    height: 100%;
  }
  .select-address {
    position: absolute;
    width: computed(690);
    height: computed(86);
    background: rgba(255, 255, 255, 1);
    z-index: 22;
    left: computed(30);
    top: computed(30);
    p {
      margin-right: computed(80);
    }
    p:nth-child(3) {
      margin-right: computed(50);
    }
    p,
    i {
      font-size: computed(28);
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
  .no-show-address {
    height: auto;
  }
  .show-address {
    height: computed(500);
    overflow-y: scroll;
  }
  .address-list {
    background: #fff;
    width: 92%;
    position: fixed;
    bottom: computed(88);
    padding: 0 computed(30);
  }
  .address-list,
  .no-address {
    background: #fff;
    width: 92%;
    position: fixed;
    bottom: computed(88);
    padding: 0 computed(30);

    & > div {
      .item-address {
        padding: computed(30) 0;
        & > div {
          width: 100%;

          align-items: center;
          & > p {
            width: computed(28);
            margin-right: computed(25);
            height: computed(28);
            border: 1px solid rgba(43, 164, 243, 1);
            position: relative;
          }
          .over-checked {
            position: absolute;
            width: computed(16);
            height: computed(16);
            left: computed(38);
            background: rgba(43, 164, 243, 1);
          }
          .address-infor {
            width: 90%;
            & > div {
              justify-content: space-between;
              & > p:nth-child(1) {
                font-size: computed(28);
                font-family: PingFang SC;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
              & > p:nth-child(2) {
                font-size: computed(24);
                font-family: PingFang SC;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
            }
            & > p {
              font-size: computed(24);
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
            }
          }
        }
      }
    }
  }

  .sure {
    width: 100%;
    height: computed(88);
    position: fixed;
    bottom: 0;
    background: rgba(43, 164, 243, 1);
    font-size: computed(32);
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
}
.load-more {
  width: 100%;
  height: computed(44);
  background: rgba(255, 255, 255, 1);
  position: fixed;
  padding: 0 computed(30);
  bottom: computed(200);
  z-index: 100;
  i {
    color: #2ba4f3;
  }
}
.xiala {
  bottom: computed(550);
}
.no-address {
  p:nth-child(1) {
    font-size: computed(28);
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-bottom: computed(13);
  }
  p:nth-child(2) {
    font-size: computed(24);
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 36px;
  }
}
</style>