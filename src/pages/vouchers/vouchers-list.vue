
/*
* createTime：2018/8/18
* author：en.chen
* LastEditors: lan.chen
* LastEditTime: 2019-06-26 17:53:21
* description: 领取优惠券列表
*/

<template>
    <div class="vouchers">
        <!-- 优惠券列表 begin -->
        <van-list
            v-model="loading"
            :finished="finished"
            @load="loadMore"
            :immediate-check="false"
            v-if="cardList.length > 0"
        >
            <ul class="vouchers-list" v-if="cardList.length > 0">
                <li
                    class="vouchers-item"
                    v-for="(item,index) in cardList"
                    :key="index"
                    v-show="item.couponCount !== 0"
                >
                    <!--抵用券详情 begin-->
                    <div class="detail">
                        <div class="left-box">
                            <p class="type">{{item.couponName}}</p>
                            <p class="value">
                                <span class="price">{{item.couponValue |decimal}}</span>
                                <span>{{ item.cardType !== 0 ? '元' : '折' }}</span>
                            </p>
                            <p
                                class="tip"
                                v-if="item.isBuy === 1 && item.buyPrice>0"
                            >仅售{{item.buyPrice}}元</p>
                        </div>
                        <div class="right-box">
                            <p
                                class="time"
                                v-if="(item.couponStartTime !== null) || (item.couponEndTime !== null )"
                            >
                                {{item.couponStartTime}}
                                <br />至
                                <br />
                                {{item.couponEndTime}}
                            </p>
                            <div
                                class="btn"
                                :class="{'buy-btn' : ((item.isBuy === 1) && (item.buyPrice > 0))}"
                                @click="getCard(item)"
                            >{{ ((item.isBuy === 1) && (item.buyPrice > 0)) ? '立即购买' : '立即领取' }}</div>
                        </div>
                    </div>
                    <!-- 抵用券详情 end -->

                    <!-- 抵用券说明 begin -->
                    <div
                        class="explain"
                        :class="{'show-content': item.wordBreak === true}"
                        @click="item.wordBreak = !item.wordBreak"
                    >
                        <p class="instructions">{{item.instructions}}</p>
                        <i
                            class="iconfont icon-xialaxuan"
                            :title="index"
                            v-if="instructionsScrollWidth[index] > instructionsOffsetWidth[index]"
                        ></i>
                    </div>
                    <!-- 抵用券说明 end -->
                </li>
            </ul>
        </van-list>
        <!-- 优惠券列表 end -->
        <!--无抵扣券 begin-->
        <div class="empty-tip" v-if="cardList.length < 1  && !loading"></div>
        <!--无抵扣券 end-->

        <!-- 点赞弹出框 begin -->
        <van-popup v-model="saveTip" overlay-class="model-z-index" class="save-tip">领取成功</van-popup>
        <!-- 点赞弹出框 end -->
    </div>
</template>
<script>
import { Popup, Toast, List } from "vant";
import { Vouchers, Payment } from "../../api/service";
import Storage from "../../util/storage";
import { setTimeout } from "timers";

export default {
    components: {
        "van-popup": Popup,
        "van-list": List
    },
    data() {
        return {
            cardList: [], //  优惠券列表
            saveTip: false, //  购买/领取成功的弹窗显示
            orderCode: "",
            btnLock: "", // 按钮锁
            loading: true, // 加载状态
            finished: false,
            instructionsOffsetWidth: [], // 优惠券描述文字容器宽
            instructionsScrollWidth: [] // 优惠券描述文字实际宽
        };
    },
    filters: {
        // 过滤掉日期的时间
        dateFilter(str) {
            let strArr = [];
            strArr = str.split(" ");
            return strArr[0].replace(/-/g, ".");
        },
        // 现在/折扣券过滤器
        decimal: function(val) {
            let arr = val.toString().split(".");      
            if (arr.length > 1) {
                if(arr[1].length>1){
                     return val.toFixed(2);  
                }else{
                     return val.toFixed(1);  
                }
            } else {
                return arr[0];
            }
        }
    },
    methods: {
        //  获取优惠券列表
        async getList() {
            this.finished = false;
            if (this.finished === true) {
                Toast("没有更多了~");
                return;
            }
            let data = {
                busContsCode: baseConstant.busContsCode,
                isWeixin: 2,
                wxUnionid:
                    baseConstant.wxUnionid ||
                    Storage.get("properties").wxUnionid,
                shopId: Storage.get("properties").shopId
            };
            await Vouchers.getVouchersList(data)
                .then(res => {
                    let cardList = [];
                    if (!!res.couponTypesList) {
                        res.couponTypesList.forEach(item => {
                            for (let i = 0; i < item.couponsList.length; i++) {
                                item.couponsList[i].cardLabel =
                                    item.couponsTypeName; //  优惠券大类
                                if (
                                    item.couponsList[i].couponAmount.indexOf(
                                        "折"
                                    ) !== -1
                                ) {
                                    //  对优惠券的类型赋值
                                    item.couponsList[i].cardType = 0; // 0代表折扣
                                } else {
                                    item.couponsList[i].cardType = 1; // 1代表抵用券
                                }
                                item.couponsList[i].wordBreak = false;
                                // if (
                                //     item.couponsList[i].instructions &&
                                //     item.couponsList[i].instructions.length < 25
                                // ) {
                                //     // 判断优惠券说明是否断行
                                //     item.couponsList[i].wordBreak = true;
                                // } else {
                                //     item.couponsList[i].wordBreak = false;
                                // }
                                if (item.couponsList[i].buyPrice === null) {
                                    item.couponsList[i].buyPrice = 0;
                                }
                                cardList.push(item.couponsList[i]);
                            }
                        });
                    }
                    this.cardList = cardList;
                    if (this.cardList.length >= res.count) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                    }
                    this.loading = false;
                })
                .then(() => {
                    this.instructionsOffsetWidth = [];
                    this.instructionsScrollWidth = [];
                    // 列表渲染完后判断是否需要显示描述下拉
                    let instructions = document.getElementsByClassName(
                        "instructions"
                    );
                    for (let i = 0; i < instructions.length; i++) {
                        this.instructionsOffsetWidth.push(
                            instructions[i].offsetWidth
                        );
                        this.instructionsScrollWidth.push(
                            instructions[i].scrollWidth
                        );
                    }
                });
        },
        loadMore() {
            if (this.finished === true) {
                Toast("没有更多了~");
                return;
            }
        },

        //  领取/购买优惠券/卡
        getCard(item) {
            if (this.btnLock === true) {
                return;
            }
            // this.btnLock = true;
            let that = this;
            if (item.isBuy !== 1 || item.buyPrice === 0) {
                //  领取
                let data = {};
                if (item.couponId === null) {
                    // 储值卡
                    data = {
                        usrId: Storage.get("USER_INFO").usrId,
                        companyId: Storage.get("COMPANYID").company_id,
                        busContsCode: baseConstant.busContsCode,
                        cardId: item.valueCardHdId,
                        vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                        shopId: Storage.get("properties").shopId
                    };
                } else {
                    data = {
                        usrId: Storage.get("USER_INFO").usrId,
                        companyId: Storage.get("COMPANYID").company_id,
                        busContsCode: baseConstant.busContsCode,
                        couponsId: item.couponId,
                        vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                        shopId: Storage.get("properties").shopId
                    };
                }
                Vouchers.saveCoupons(data)
                    .then(res => {
                        console.log(res, "ress");
                        if (res.length === 0) {
                            Toast("来迟一步，已经被领完啦~");
                            return;
                        }
                        if (res[0].state === "0") {
                            this.getList();
                            Toast("领取成功~");
                            this.$router.go(-1);
                        } else if (res[0].state === "1") {
                            Toast("您已经领取过该优惠券啦~");
                        } else if (res[0].state === "2") {
                            Toast("该优惠券已经被其他会员绑定~");
                        } else {
                            Toast("领取失败~");
                        }
                    })
                    .then(() => {
                        this.btnLock = false;
                    });
            } else if (item.isBuy === 1 && item.buyPrice > 0) {
                //  购买
                let data = {};
                if (item.couponId === null) {
                    //  储值卡
                    data = {
                        usrId: Storage.get("USER_INFO").usrId,
                        companyId: Storage.get("COMPANYID").company_id,
                        shopCode: Storage.get("properties").shopCode,
                        valuecardHdId: item.valueCardHdId,
                        busContsCode: baseConstant.busContsCode
                    };
                } else {
                    //  非储值卡
                    data = {
                        usrId: Storage.get("USER_INFO").usrId,
                        companyId: Storage.get("COMPANYID").company_id,
                        shopCode: Storage.get("properties").shopCode,
                        couponsId: item.couponId,
                        busContsCode: baseConstant.busContsCode
                    };
                }
                Vouchers.buyCoupons(data).then(res => {
                    if (res.msg == "无券可领") {
                        Toast("来迟一步，已经被购买完啦~~");
                        return;
                    }
                    this.orderCode = res.billCode; //  获取订单号，调用微信支付
                    let orderData = {
                        usrId: Storage.get("USER_INFO").usrId,
                        paymentCode: "D_WEIXIN",
                        tradeTypeCode: "JSAPI",
                        paymentTypeCode: "D_FULL",
                        shopCode: Storage.get("properties").shopCode,
                        orderList: res.billCode,
                        openId: Storage.get("WECHAT_INFO").openid,
                        orderType: "D_COUPONSORD",
                        payAmount: item.buyPrice
                    };
                    Payment.payOrder(orderData)
                        .then(config => {
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener(
                                        "WeixinJSBridgeReady",
                                        onBridgeReady,
                                        false
                                    );
                                } else if (document.attachEvent) {
                                    document.attachEvent(
                                        "WeixinJSBridgeReady",
                                        onBridgeReady
                                    );
                                    document.attachEvent(
                                        "onWeixinJSBridgeReady",
                                        onBridgeReady
                                    );
                                }
                            } else {
                                if (config.code === "200") {
                                    let appid = "";
                                    let num1 = config.requestStr.indexOf(
                                        "<appid>"
                                    );
                                    let num2 = config.requestStr.indexOf(
                                        "</appid>"
                                    );
                                    if (
                                        config.requestStr.substring(
                                            num1 + 7,
                                            num2
                                        )
                                    ) {
                                        appid = config.requestStr
                                            .substring(num1 + 7, num2)
                                            .toString();
                                    } else {
                                        appid = "wx45b40e5b82bd74d2";
                                    }
                                    WeixinJSBridge.invoke(
                                        "getBrandWCPayRequest",
                                        {
                                            appId: appid, //公众号名称，由商户传入
                                            timeStamp: config.timeStamp, //时间戳，自1970年以来的秒数
                                            nonceStr: config.nonceStr, //随机串
                                            package: config.prepayId,
                                            signType: "MD5", //微信签名方式：
                                            paySign: config.paySign //微信签名
                                        },
                                        function(resp) {
                                            console.log(resp, "resp");
                                            if (
                                                resp.err_msg ==
                                                "get_brand_wcpay_request:ok"
                                            ) {
                                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                                window.setTimeout(function() {
                                                    that.$router.replace({
                                                        name: "my-vouchers"
                                                    });
                                                }, 1000);
                                                Toast("购买成功~");
                                            } else if (
                                                resp.err_msg ==
                                                "get_brand_wcpay_request:cancel"
                                            ) {
                                                // false
                                                // alert('取消');
                                                that.btnLock = false;
                                            } else {
                                                that.btnLock = false;
                                                alert("支付出错了");
                                            }
                                        }
                                    );
                                }
                            }
                        })
                        .then(() => {
                            console.log(1111);
                            this.btnLock = false;
                        });
                });
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                window.scrollTo(0, 1);
            });
        }, 0);
    },
    created() {
        this.getList();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
.vouchers {
    padding-bottom: computed(10);
}
.detail {
    background: url("../../assets/images/member/vouchers.png") no-repeat top
        left;
}
.used-tip {
    background: url("../../assets/images/member/used.png") no-repeat top;
    background-size: 100%;
}
.expired {
    background: url("../../assets/images/member/expired.png") no-repeat top;
    background-size: 100%;
}
.loading-tip {
    margin-top: computed(30);
    font-size: computed(30);
    line-height: 1.4;
    text-align: center;
    color: #333333;
}
.empty-tip {
    margin: computed(100) auto 0 auto;
    width: computed(400);
    height: computed(400);
    background: url("../../assets/images/common/none-vouchers.jpg") no-repeat
        top center;
    -webkit-background-size: 90%;
    background-size: 90%;
}
.save-tip {
    font-size: computed(30);
    line-height: computed(34);
    color: #0d0e09;
    padding: computed(65) computed(80);
}
</style>
