/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 14:34:38
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-06 18:07:31
 * @Description: 物流进度组件
   @传入数据结构说明
   data:{
     shippingWayCode:"",//快递配送方式
     expressCode:"",//快递运营商代码编号，如YTO(圆通)
     expressNo:""//快递单号
   }
 */
 <style lang='scss' scoped>
/deep/.van-steps--vertical {
  padding: 0 0 0 15px;
}
/deep/.van-step--vertical .van-step__line {
  display: none;
}
/deep/.van-step--vertical.van-step--process .van-icon {
  display: none;
}
/deep/.van-step--vertical .van-step__circle-container > i {
  display: none;
}
/deep/.van-step__title {
  h3 {
    font-size: computed(24);
    font-family: PingFangSC-Regular;
    font-weight: 400;
    // color: rgba(51, 51, 51, 1);
  }
  p {
    font-size: computed(20);
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
}
/deep/.van-step--vertical {
  padding: computed(10) computed(70) computed(10) 0;
}
.rotatingUp {
  transition: all 0.5s;
  transform: rotate(-180deg);
  display: inline-block;
}
.rotatingDown {
  transition: all 0.5s;
  display: inline-block;
}

.logis {
  position: relative;
  .show-logis {
    position: absolute;
    color: #999999;
    top: 0;
    right: computed(30);
  }
}
.van-steps--vertical{
  max-height: computed(350);
  overflow-y: scroll;
}
.title {
    text-align: center;
    font-size: $font-title1;
    margin: computed(10) 0;
}
.show-more-logis {
  // height: computed(350);
  // overflow-y: scroll;
}
.hidden-logis {
  height: auto;
}
</style>

 <template>
  <div v-if="isReady" class="logis" :class="[direction?'show-more-logis':'hidden-logis']">
    <template v-if="!type">
      <div class="fs36B text-center mgT30">{{title}}</div>
      <p class="title">{{returnShippingName}}，{{returnShipCode}}</p>
    </template>

    <van-steps direction="vertical" :active="0" active-color="#2BA4F3">
      <van-step v-for="(step,index) in sliceList" :key="index">
        <h3>{{step.acceptStation}}</h3>
        <p>{{step.acceptTime}}</p>
      </van-step>
    </van-steps>
    <div class="fs28 text-center pdTb10 show-logis" @click="toggle()" v-if="traceList.length>2">
      <!-- {{actionName}} -->
      <i class="iconfont icon-xialaxuan" :class="{rotatingUp:direction,rotatingDown:!direction}"></i>
    </div>
  </div>
</template>

 <script>
import { Step, Steps } from "vant";
import check from "@/util/check";
export default {
  props: {
    data: {},
    type: {
      type: Number
    },
    title: {
      type: String,
      default: "物流信息"
    },
    returnShipCode: {
      type: String,
      default: ""
    },
    returnShippingName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      logis: {},
      traceList: [],
      sliceList: [],
      actionName: "展开",
      direction: false,
      isReady: false
    };
  },
  components: {
    "van-steps": Steps,
    "van-step": Step
  },
  methods: {
    // 获取物流
    async getLogisInfo() {
      let params = {
        expressCode: this.data.expressCode,
        logisticCode: this.data.expressNo
      };
      let logis = await this.$post("third-party/getLogis", params);
      this.traceList = logis.traceList;
      this.sliceList = this.traceList.slice(0, 2);
      this.isReady = true;
    },

    toggle() {
      if (this.sliceList.length <= 2) {
        this.sliceList = this.traceList;
        this.actionName = "收起";
        this.direction = true;
      } else {
        this.sliceList = this.traceList.slice(0, 2);
        this.direction = false;
        this.actionName = "展开";
      }
    },
    initData() {
      this.direction = true;
      if (
        this.data.shippingWayCode === "kdps" &&
        this.data.expressNo &&
        this.data.expressCode
      ) {
        this.getLogisInfo();
      } else {
        this.isReady = false;
      }
    }
  },
  created() {
    this.initData();
  },
  watch: {
    data: function() {
     
      this.initData();
    }
  }
};
</script>
