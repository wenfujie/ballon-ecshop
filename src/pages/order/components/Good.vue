/*
import check from '../../../util/check';
 * @Author: yongtian.hong
 * @Date: 2018-09-18 10:33:55
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-16 16:40:00
 * @Description: 
 */
<style lang='scss'  scoped>
.goodContent {
  color: #0d0e09;
  font-family: "PingFang-SC-Medium", "PingFang-SC-Bold";
  padding: 0;
  box-sizing: border-box;
  &:last-of-type {
    margin-bottom: 0;
  }
  .custom,
  .handsel {
    display: flex;
    font-size: computed(32);
    padding: computed(30);
    background-color: #fff;

    .left {
      width: 25%;
      padding-right: computed(20);
      .img-box {
        position: relative;
        width: computed(150);
        height: computed(150);

        img {
          width: 100%;
          height: 100%;
        }
        > span {
          position: absolute;
          padding: computed(10) computed(40) computed(10) computed(15);
          background: url("../../../assets/images/index/custom.png") no-repeat;
          background-size: 100% 100%;
          color: #ffffff;
          font-size: computed(24);
        }
      }
    }
    .right {
      width: 75%;
      display: flex;
      flex-direction: column;
      .cloth-name {
        font-size: computed(30);
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(13, 14, 9, 1);
      }
      .priceAndNum {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: computed(19) 0;
        .price {
          font-size: computed(30);

          .goodState {
            color: #d80000;
            border: solid 1px #d80000;
            padding: computed(0) computed(15);
            font-size: computed(12);
          }
        }
        .num {
          font-size: computed(30);
          text-align: right;
        }
      }
      .colist {
        display: flex;
        flex-direction: column;

        font-size: computed(28);
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(13, 14, 9, 1);
        margin-bottom: computed(30);
        // background:#EDF0F7;
        &:last-child {
          border: 0;
        }
        .main {
          padding: computed(21) computed(16);
          background: #edf0f7;
        }
        .c-left {
          width: 90%;
        }
        .c-right {
          width: 10%;
          padding: 0;
          text-align: right;
          .arrow-down {
            width: computed(30);
            height: computed(15);
          }
        }
      }
      .good-info {
        .title {
          font-size: computed(26);
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-bottom: computed(20);
        }
        .item {
          width: 100%;
          justify-content: space-between;
          font-size: computed(20);
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
  .borderN {
    border: solid 1px #cccccc;
    border-right: none;
  }
  .borderc {
    border: solid 1px #cccccc;
  }
  // .border-bottom-black {
  //   border-bottom: solid 1px #0d0e09;
  // }
  .img100 {
    width: computed(100);
    height: computed(100);
  }
}
.custom-infor {
  margin-top: computed(19);
  justify-content: flex-start;
  font-size: computed(24);
  font-family: PingFangSC-Regular;
  font-weight: 400;
}
.body-data {
  width: 33%;
  border-bottom: computed(1) dashed #dbdbdb;
  padding: computed(16) 0;
}
.parts-infor {
  width: 100%;
  & > div {
    justify-content: space-between;
    margin-bottom: computed(19);
  }
}
.part-infor-style {
  & > div {
    & > p {
      font-size: computed(24);
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }
  & > p {
    font-size: computed(20);
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
}
.part-pic {
  width: computed(60);
  height: computed(60);

  border-radius: computed(30);
}
.gift-style {
  background: #fff;
  padding: computed(30);
  border-bottom: computed(1) solid #e6e6e6;
  .gift-infor {
    display: flex;
    .image-main {
      position: relative;
      display: inherit;
      .image {
        width: computed(120);
        height: computed(120);
      }
      .title-image {
        position: absolute;
        top: 0;
        left: 0;
        width: computed(67);
        height: computed(67);
        background-image: url("../../../assets/images/common/send-title.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        span {
          position: absolute;
          left: computed(-1.5);
          top: computed(4.5);
          font-size: computed(18);
          color: $color-white;
          transform: rotate(-45deg);
          display: inline-block;
        }
      }
    }
    .gift-right {
      width: 100%;
      margin-left: computed(21);
      .gift-title,
      .gift-size {
        font-size: computed(28);
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(13, 14, 9, 1);
        justify-content: space-between;
      }
      .gift-title {
        margin-bottom: computed(66);
        .name {
          line-height: 1;
          > span {
            font-size: $font-common;
            color: #ff3636;
            margin-right: computed(8);
          }
        }
      }
      .gift-size {
        .chose {
          position: absolute;
          bottom: 0;
          right: 0;
          font-size: $font-common;
          color: #666666;
          border: 1px solid #cccccc;
          padding: computed(9) computed(15);
          border-radius: computed(25);
        }
      }
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  font-size: computed(24);
  margin-top: computed(30);
  .btn {
    color: #fff;
    border: 0;
    outline: 0;
    text-align: center;
    padding: computed(27) computed(41);
  }
  .update-booking {
    background: #fff;
    border: computed(1) solid #2ba4f3;
    color: #2ba4f3;
    margin-right: computed(20);
  }

  .btn-blue {
    margin-left: computed(20);
    background-color: #2ba4f3;
  }
  .btn-gray {
    background-color: #808080;
  }
}
.booking-infor {
  & > div {
    border-bottom: computed(2) dashed #dbdbdb;
  }
}
.left-title {
  width: 30%;
  margin-right: computed(29);
}

.pdTb16 {
  padding: computed(16) 0;
}
</style>

 <template>
  <div class="goodContent" @click.stop="goToViewDetail()">
    <!-- 定制 -->
    <div class="custom" v-if="isCustom">
      <div class="left">
        <div class="img-box">
          <span v-if="data.orderFlag == 1">定制</span>
          <img :src="getImg(data.thumb, '150*150')" onerror="errImg(event)" alt />
        </div>
      </div>
      <div class="right">
        <div class="cloth-name">{{data.goodsName}}</div>

        <div class="priceAndNum">
          <div class="price">￥{{data.averagePrice}}</div>
          <div class="num">x{{data.ordQty}}</div>
        </div>
        <div class="pdT10 pdB20" v-if="shipTime">预计发货 : {{shipTime}}</div>

        <div class="colist-box">
          <!-- 定制清单 -->
          <div class="colist">
            <div class="flex-box flex-vcenter main" @click.stop="toggle('customList')">
              <div class="c-left">定制清单</div>
              <div class="c-right">
                <i
                  class="iconfont icon-xialaxuan"
                  :class="{'rotatingUp':showFb,'rotatingDown':!showFb}"
                ></i>
              </div>
            </div>

            <!--定制信息弹窗-->
            <custom-dialog
                    fromPage="orderDetail"
                    :mainFabricName="data.mainFab?data.mainFab.fabName:''"
                    :partList="data.parts"
                    v-show="showFb"
            ></custom-dialog>

            <!--<div v-if="showFb">-->
              <!--&lt;!&ndash; 主面料 &ndash;&gt;-->
              <!--<div v-if="data.mainFab" class="flex-row custom-infor">-->
                <!--主面料- -->
                <!--<div v-if="data.mainFab">-->
                  <!--<div>&nbsp;{{data.mainFab.fabName}}</div>-->
                <!--</div>-->
                <!--<div v-if="DJTYPE[data.orderPriceType] && data.mainFabPrice">￥ {{data.mainFabPrice}}</div>-->
              <!--</div>-->
              <!--&lt;!&ndash; 部件 &ndash;&gt;-->
              <!--<div v-if=" data.parts" class="custom-infor parts-infor">-->
                <!--<div v-for="(part,index) in data.parts" class="flex-row" :key="index">-->
                  <!--<div class="part-infor-style">-->
                    <!--<div class="flex-row">-->
                      <!--<p>{{part.partName}}</p>- -->
                      <!--<p>{{part.fabricName}}</p>-->
                    <!--</div>-->
                  <!--</div>-->

                  <!--&lt;!&ndash; <img class="part-pic fl" v-lazy="getImg(part.fabricPictFileUrl)" alt /> &ndash;&gt;-->
                <!--</div>-->
              <!--</div>-->
              <!--&lt;!&ndash; 绣字 &ndash;&gt;-->
              <!--<div v-if=" emp.length > 0" class="custom-infor parts-infor">-->
                <!--<div v-for="(part,index) in emp" class="flex-row" :key="index">-->
                  <!--<div class="part-infor-style">-->
                    <!--<div class="flex-row">-->
                      <!--<p :style="{'color':part.colorNumberHx}">{{part.name}}</p>- -->
                      <!--<p :style="{'color':part.colorNumberHx}">{{part.content}}</p>-->
                    <!--</div>-->
                    <!--<p v-if="DJTYPE[data.orderPriceType] && part.price">￥ {{part.price|Fix2}}</p>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--&lt;!&ndash; 绣花 &ndash;&gt;-->
              <!--<div v-if="emb.length > 0">-->
                <!--<div class="custom-infor parts-infor">-->
                  <!--<div v-for="(part,index) in emb" class="flex-row" :key="index">-->
                    <!--<div class="part-infor-style">-->
                      <!--<div class="flex-row">-->
                        <!--<p>绣花-{{part.name}}</p>-->
                      <!--</div>-->
                      <!--<p v-if="DJTYPE[data.orderPriceType] && part.price">￥ {{part.price|Fix2}}</p>-->
                    <!--</div>-->
                    <!--<img class="part-pic fl" v-lazy="getImg(part.imgUrl)" alt />-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--&lt;!&ndash; 印花 &ndash;&gt;-->
              <!--<div v-if="prt.length > 0">-->
                <!--<div class="custom-infor parts-infor">-->
                  <!--<div v-for="(part,index) in prt" class="flex-row" :key="index">-->
                    <!--<div class="part-infor-style">-->
                      <!--<div class="flex-row">-->
                        <!--<p>印花-{{part.name}}</p>-->
                      <!--</div>-->
                      <!--<p v-if="DJTYPE[data.orderPriceType] && part.price">￥ {{part.price|Fix2}}</p>-->
                    <!--</div>-->
                    <!--<img class="part-pic fl" v-lazy="getImg(part.imgUrl)" alt />-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          </div>
          <!-- 已量体数据 -->
          <div class="colist" v-if="measurInfo&&measure">
            <div class="flex-box main" @click.stop="toggle('MeasureData')">
              <div class="c-left">着装人:{{measure.dressPerson}}</div>
              <div class="c-right">
                <i class="iconfont icon-xialaxuan"></i>
              </div>
            </div>
            <div class="flex-box Wrap mgT20" v-show="showVol">
              <div
                class="body-data flex-box"
                v-for="(volumn,index) in data.measureInfo"
                :key="index"
              >
                <div class="flex-lave text-center pdTb2">{{volumn.measureName }}</div>
                <div class="flex-lave text-center pdTb2">{{volumn.netValue}}</div>
              </div>
            </div>
          </div>
          <!-- 预约量体 -->
          <div class="flex-vbox colist mgT30" v-if="measure&&!measurInfo">
            <!-- 预约时间 -->
            <div class="flex-between main" @click.stop="toggle('MeasureInfo')">
              <div class="fs26B">着装人:{{measure.dressPerson}}</div>
              <div>
                <i
                  class="iconfont icon-xialaxuan fs30"
                  :class="{'rotatingUp':showMeasureInfo,'rotatingDown':!showMeasureInfo}"
                ></i>
              </div>
            </div>
            <!-- 预约人信息 -->
            <div class="fs28 grey66 mgT20 booking-infor" v-show="showMeasureInfo">
              <div class="pdTb16 flex-box" v-if="measure.statusId">
                <div class="left-title">状态 : &nbsp;</div>
                <div class="flex-auto" style="color:#2BA4F3">{{stateList[measure.statusId]}}</div>
              </div>
              <div class="pdTb16 flex-box" v-if="measure.sexName">
                <div class="left-title">性别 : &nbsp;</div>
                <div class="flex-auto">{{measure.sexName}}</div>
              </div>
              <div class="pdTb16 flex-box" v-if="measure.dressPhone">
                <div class="left-title">联系电话 : &nbsp;</div>
                <div class="flex-auto">{{measure.dressPhone}}</div>
              </div>
              <div class="pdTb16 flex-box" v-if="measure.dressPerson">
                <div class="left-title">预约时间 : &nbsp;</div>
                <div class="flex-auto">{{measure.orderTime}}</div>
              </div>

              <div class="pdTb16 flex-box" v-if="measure.msrWayName">
                <div class="left-title">量体方式 : &nbsp;</div>
                <div class="flex-auto">{{measure.msrWayName}}</div>
              </div>
              <div class="pdTb16 flex-box" v-if="measure.reservationAddr">
                <div class="left-title">量体地址 : &nbsp;</div>
                <div class="flex-auto">{{measure.reservationAddr}}</div>
              </div>
              <div class="pdTb16 flex-box">
                <div class="left-title">备注 : &nbsp;</div>
                <div class="flex-auto">{{measure.measureMemo?measure.measureMemo:'暂无备注'}}</div>
              </div>
            </div>
          </div>
          <!-- 添加着装人 -->
          <div
            class="colist"
            v-if="!measure&&data.measureOpCode=='D_MSROPMSR'&&  (order.ordStatusCodes=='D_ORDSPAYING' || order.ordStatusCodes=='D_ORDSSHIPPING')"
          >
            <div class="flex-box main" @click.stop="addBooking(data)">
              <div class="c-left">添加着装人</div>
              <div class="c-right">
                <i class="iconfont icon-tupiantianjia"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="btns">
          <button
            class="btn update-booking"
            v-if="measure&& data.measureOpCode=='D_MSROPMSR' && (measure.statusId=='10051501' || measure.statusId=='10051506') "
            @click.stop="updateMyBooking(measure.saleMeasureHdId)"
          >修改预约</button>
          <!-- <template v-if="measure&& data.measureOpCode=='D_MSROPMSR'">
            <button
              class="btn update-booking"
              v-if="measure.measureStatusId&&  (measure.measureStatusId=='10051501' || measure.measureStatusId=='10051506') "
              @click.stop="updateMyBooking(measure.saleMeasureHdId)"
            >修改预约</button>
            <button
              class="btn update-booking"
              v-if="measure.statusId&&  (measure.statusId=='10051501' || measure.statusId=='10051506') "
              @click.stop="updateMyBooking(measure.saleMeasureHdId)"
            >修改预约</button>
          </template>-->
          <button
            class="btn btn-blue left-button"
            @click.stop="onBtnClick(btnApply)"
            v-if="btnApply"
          >{{btnApply}}</button>
          <button
            class="btn btn-blue left-button"
            @click.stop="onBtnClick(btnViewDetail)"
            v-if="btnViewDetail"
          >{{btnViewDetail}}</button>
        </div>
      </div>
    </div>
    <!-- 非定制 / 赠品-->
    <template v-if="!isCustom">
      <div class="handsel" v-if="!isGift">
        <div class="left">
          <div class="img-box">
            <img :src="getImg(data.thumb, '150*150')" onerror="errImg(event)" />
          </div>
        </div>
        <div class="right">
          <div class="cloth-name">{{data.goodsName}}</div>
          <div class="priceAndNum">
            <div class="price">￥{{data.averagePrice|Fix2}}</div>
            <div class="num">x{{data.ordQty}}</div>
          </div>
          <div class="good-info">
            <div class="item flex-row">
              <p>颜色:</p>
              <p>{{data.colorName}}</p>
            </div>
            <div class="item flex-row">
              <p>尺码:</p>
              <p>{{data.sizeName}}</p>
            </div>
          </div>

          <div class="btns">
            <button
              class="btn btn-blue"
              @click.stop="onBtnClick(btnApply)"
              v-if="btnApply"
            >{{btnApply}}</button>
            <button
              class="btn btn-blue"
              @click.stop="onBtnClick(btnViewDetail)"
              v-if="btnViewDetail"
            >{{btnViewDetail}}</button>
          </div>
        </div>
      </div>
      <div class="gift-style" v-if="isGift">
        <div class="gift-infor">
          <div class="image-main">
            <img class="image" v-lazy="getImg(data.thumb)" onerror="errImg(event)" />
            <span class="title-image">
              <span>赠品</span>
            </span>
          </div>
          <div class="gift-right">
            <div class="gift-title flex-row">
              <p class="name overflow">{{data.goodsName}}</p>
              <p class="price">¥{{data.averagePrice|Fix2}}</p>
            </div>
            <div class="gift-size flex-row">
              <p>{{data.sizeName}}/{{data.colorName}}</p>

              <p class="num">x {{data.ordQty}}</p>
            </div>
          </div>
        </div>
        <div class="btns">
          <button class="btn btn-blue" @click.stop="onBtnClick(btnApply)" v-if="btnApply">申请售后</button>
        </div>
      </div>
    </template>
  </div>
</template>

 <script>
import getLocationPosition from "../../../util/getLocation";
import check from "@/util/check";
import { Toast } from "vant";
import CustomDialog from '@/components/CustomDialog'

export default {
  name: "Good",
    components:{
        CustomDialog
    },
  props: {
    data: {
      type: Object,
      default: {}
    },
    order: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      stateList: {
        "10051501": "审核中",
        "10051502": "审核通过待指派量体师",
        "10051503": "已派遣量体师",
        "10051504": "预约成功",
        "10051505": "量体完成",
        "10051506": "已取消"
      },
      btnApply: null, //申请按钮
      btnViewDetail: null, //查看详情按钮
      showFb: false, //显示定制清单
      showVol: false, //显示已量体数据
      showMeasureInfo: false, //显示联系人信息,
      unApplyableOrdStatus: ["D_TRANSCLOSE", "D_ORDSPAYING", "D_ORDCANCEL"], //不允许售后的订单状态
      params: {
        type: Object
      },
      emb: [], // 绣字
      emp: [], // 绣花
      prt: [], // 印花
      // 定价类型
      DJTYPE: {
        10260501: false,
        10260502: true
      }
    };
  },
  methods: {
    addBooking(item) {
      getLocationPosition();

      this.$router.push({
        path: "/booking-quantity-body",
        query: {
          entrance: 0,
          isOrder: 2,
          billCode: this.order.billCode,
          buscontsCode: this.order.buscontsCode,
          rtlOrdDtId: item.saleOrdDtId
        }
      });
    },
    updateMyBooking(id) {
      this.$router.push({
        name: "reserve-detail",
        query: {
          id: id,
          entrance: 1
        }
      });
    },
    getMaterial() {
      if (!check.isEmpty(this.data.parts)) {
        let embObj = [],
          empObj = [],
          prtObj = [];
        this.data.parts.forEach((part, index) => {
          let obj = {};
          if (!!part.emb && part.emb.length > 0) {
            obj.name = part.regionName;
            obj.content = part.emb[0].content;
            obj.price = part.emb[0].price;
            obj.colorNumberHx = part.emb[0].colorNumberHx;
            empObj.push(obj);
          } else if (!!part.embPrint && part.embPrint.length > 0) {
            obj.name = part.regionName;
            obj.imgUrl = part.embPrint[0].embPrintPictUrl;
            obj.price = part.embPrint[0].price;
            embObj.push(obj);
          } else if (!!part.prtPrint && part.prtPrint.length > 0) {
            obj.name = part.regionName;
            obj.imgUrl = part.prtPrint[0].embPrintPictUrl;
            obj.price = part.prtPrint[0].prtprice;
            prtObj.push(obj);
          }
        });
        this.emb = embObj;
        this.emp = empObj;
        this.prt = prtObj;
      }
    },
    // 初始化售后状态
    initState() {
      this.showFb = false;
      this.showVol = false;
      if (check.isEmpty(this.data)) return;
      // 待付款/交易关闭的订单不允许售后
      let code = this.data.ordStatusCode;

      if (this.unApplyableOrdStatus.includes(code)) {
        this.btnApply = null;
      }
      //
      if (this.data.applyable) {
        this.btnApply = "申请售后";
      } else {
        this.btnApply = null;
      }

      if (!check.isEmpty(this.data.reapplyCodes)) {
        this.btnViewDetail = "售后详情";
      } else {
        this.btnViewDetail = null;
      }
    },

    // 路由跳转
    goTo(path, params) {
      this.$router.push({
        name: path + "",
        path: "/" + path,
        params: params || {}
      });
    },
    // 显示隐藏
    toggle(name) {
      switch (name) {
        case "customList":
          this.showFb = !this.showFb;
          break;
        case "MeasureData":
          this.showVol = !this.showVol;
          break;
        case "MeasureInfo":
          this.showMeasureInfo = !this.showMeasureInfo;
          break;
      }
    },
    // 申请售后
    applyPostSale() {
      if (!check.isEmpty(this.$route.params)) {
        this.Storage.set("shopCode", {
          code: this.$route.params.shopCode
        });
      }
      this.goTo("postSaleApply", this.data);
    },
    // 查看商品详情
    goToViewDetail() {
      this.isShelve(this.data.goodsCode).then(res => {
        if (res) {
          if (this.data.orderFlag === 0) {
            this.$router.push({
              path: "goods-detail",
              query: {
                goodsCode: this.data.goodsCode
              }
            });
          } else {
            this.$router.push({
              path: "goods/web-design",
              query: {
                goodsCode: this.data.goodsCode
              }
            });
          }
        } else {
          Toast({
            duration: 400, // 持续展示 toast
            message: "商品未上架"
          });
          setTimeout(() => {
            this.$router.push("/off-shelves");
          }, 500);
        }
      });
    },
    //查看售后详情
    viewPostSaleDaetail() {
      let num = this.data.reapplyCodes.length;
      if (num === 1) {
        let params = {
          reapplycode: this.data.reapplyCodes[0]
        };
        this.goTo("postSaleDetail", params);
      } else {
        this.goTo("postSaleList");
      }
    },
    //点击事件
    onBtnClick(name) {
      switch (name) {
        case "申请售后":
          this.applyPostSale();
          break;
        case "售后详情":
          this.viewPostSaleDaetail();
          break;
        case "更换着装人":
          break;
        default:
          this.btnApply = null;
          this.btnViewDetail = null;
      }
    }
  },
  mounted() {},
  created() {
    this.$nextTick(() => {
      this.initState();
      this.getMaterial();
    });
  },
  watch: {
    data: function(val) {
      this.initState();
      this.getMaterial();
    }
  },
  computed: {
    // 绣字
    /* emb: function() {
          let temp = [];
          if (!check.isEmpty(this.data.parts)) {
            this.data.parts.forEach((part) => {
              let obj = {};
              if (part.emb) {
                obj.name = part.regionName;
                obj.content = part.emb[0].content;
                obj.price = part.emb[0].price;
                temp.push(obj);
              }
            });
          }
    
          return !check.isEmpty(temp) ? temp : null;
        },
        // 绣花
        emp: function() {
          let temp = [];
          if (!check.isEmpty(this.data.parts)) {
            this.data.parts.forEach((part) => {
              let obj = {};
              if (part.embPrint) {
                obj.name = part.regionName;
                obj.imgUrl = part.embPrint[0].embPrintPictUrl;
                obj.price = part.embPrint[0].price;
                temp.push(obj);
              }
            });
          }
          return !check.isEmpty(temp) ? temp : null;
        },
        // 绣花
        prt: function() {
          let temp = [];
          if (!check.isEmpty(this.data.parts)) {
            this.data.parts.forEach((part) => {
              let obj = {};
              if (part.embPrint) {
                obj.name = part.regionName;
                obj.imgUrl = part.embPrint[0].embPrintPictUrl;
                obj.price = part.embPrint[0].price;
                temp.push(obj);
              }
            });
          }
          return !check.isEmpty(temp) ? temp : null;
        }, */
    // 是否定制
    isCustom: function() {
      return this.data.orderFlag == 1 ? true : false;
    },
    // 是否赠品
    isGift: function() {
      return this.data.isGift == 1 ? true : false;
    },
    // 量体人预约信息
    measure: function() {
      if (check.isEmpty(this.data.measure)) return null;
      return this.data.measure[0];
    },
    // 已量体数据
    measurInfo: function() {
      if (this.data.measureInfo && this.data.measureInfo.length) return true;
      return false;
    },
    // 预计发货时间
    shipTime: function() {
      if (this.data.ordStatusCode != "D_ORDSSHIPPING") return null;
      if (this.data.nodeCode > 3) return null;
      if (check.isEmpty(this.data.estimateTime)) return null;
      return this.data.estimateTime.split(" ")[0];
    }
  },

  beforeDestroy() {
    Object.assign(this.$data, this.$options.data());
  }
};
</script>