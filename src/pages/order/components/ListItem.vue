<style lang='scss' scoped>
.list-item-wrap {
    background: #fff;
    width: 100%;
}
.list-item-wrap:nth-child(1) {
    margin-top: computed(5);
}
.good-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: computed(1) solid rgba(204, 204, 204, 0.3);
    padding-bottom: computed(25);
    font-size: computed(28);
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);

    .orderState {
        color: $maincolor;
    }
}

.good-box {
    padding: computed(25) computed(30) 0 computed(30);
    .good-detail {
        width: 100%;
        margin: computed(20) 0;
        img {
            width: computed(150);
            height: computed(150);
            position: relative;
        }
        .small-img {
            width: computed(120);
            height: computed(120);
        }
        .diy-icon {
            position: absolute;
            left: computed(30);
            width: computed(160);
            height: computed(36);
            z-index: 3;
            background: url("../../../assets/images/common/diy.png") no-repeat
                top left;
            -webkit-background-size: contain;
            background-size: contain;
        }
        .title-image {
            position: absolute;
            z-index: 10;
            width: computed(67);
            height: computed(67);
            background-image: url("../../../assets/images/common/send-title.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            span {
                position: absolute;
                left: computed(-1.5);
                top: computed(4.5);
                display: inline-block;
                font-size: computed(18);
                color: $color-white;
                transform: rotate(-45deg);
            }
        }
        .good-right,
        .smallPic-right {
            width: 72%;
            float: right;
            text-align: left;
            font-size: computed(28);
            .add-message {
                color: $maincolor;
                font-size: $font-regular;
            }
            p {
                margin-top: computed(10);
                height: computed(40);
                .left {
                    float: left;
                }
                .order_num,
                .price {
                    float: right;
                }
            }
            p:nth-of-type(2) {
                margin-top: computed(50);
            }
        }
        .smallPic-right {
            width: 78%;
            p {
                margin-top: 2px;
            }
            p:nth-of-type(2) {
                margin-top: computed(40);
            }
        }
    }
    .order-btn {
        float: right;
        display: flex;
        justify-content: space-between;
    }
    .money {
        color: $text-regular;
        margin-top: computed(20);
        width: 58%;
        font-size: computed(24);
        .total-price {
            font-size: computed(32);
            font-weight: bold;
            color: $text-primary;
        }
    }
    .oprate-btn {
        margin-top: computed(20);
        width: computed(132);
        height: computed(50);
        color: $color-white;
        text-align: center;
        background: $maincolor;
        font-size: computed(24);
    }
    .oprate-btn:nth-of-type(1) {
        border: 1px solid rgba(43, 164, 243, 1);
        background: $color-white;
        color: $maincolor;
        box-sizing: border-box;
    }
    .oprate-btn:nth-of-type(2) {
        margin-left: computed(20);
    }
}

.gray {
    width: 100%;
    height: computed(10);
    background: #edf0f7;
}
.order-bottom {
    border-top: computed(1) solid rgba(204, 204, 204, 0.3);
    display: flex;
    justify-content: space-between;
}

.flex-btn-wrap {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    // align-items: flex-end;
}
.lineH0 {
    line-height: 0;
}
</style>

<template>
    <div class="list-item-wrap flex-box fs32">
        <!-- 订单信息 -->
        <div class="flex-auto flex-between flex-vbox" @click="viewDetail()">
            <div class="good-box" v-if="order.goodsList.length>0">
                <div class="good-title">
                    <span>{{order.ordTime}}</span>
                    <span
                        class="orderState"
                        :style="{color:order.ordStatusCode=='D_ORDCANCEL'?'rgba(216,0,0,1)':''}"
                    >{{order.ordStatusName}}</span>
                </div>
                <div
                    class="good-detail"
                    v-for="(item,index) in order.goodsList"
                    :key="index"
                    @click.stop="viewDetail()"
                >
                    <div class="diy-icon" v-if="item.orderFlag === 1"></div>
                    <div class="title-image" v-if="item.isGift==1&&item.isGift">
                        <span>赠品</span>
                    </div>
                    <img
                        v-lazy="getImg(item.thumb, '150*150')"
                        :class="item.isGift==1&&item.isGift?'small-img':''"
                    />
                    <!-- good-right -->
                    <div :class="item.isGift==1&&item.isGift?'smallPic-right':'good-right'">
                        <p>
                            <span>{{item.goodsName}}</span>
                            <span class="price">￥{{item.dealPrice|Fix2}}</span>
                        </p>
                        <p>
                            <template v-if="item.measureOpCode=='D_MSROPMSR'">
                                <span
                                    v-if="!item.measure.length&&(order.ordStatusCode=='D_ORDSPAYING' || order.ordStatusCode=='D_ORDSSHIPPING')"
                                    class="add-message left"
                                    @click.stop="addBooking(item)"
                                >
                                    +添加着装人
                                    <i class="iconfont icon-jiantou"></i>
                                </span>
                                <span
                                    class="left"
                                    v-else-if="item.measure&&item.measure.length>0"
                                >着装人:{{item.measure[0].dressPerson}}</span>
                            </template>

                            <span
                                class="left"
                                v-else-if="item.measureOpCode!='D_MSROPMSR'"
                            >{{item.colorName}} /{{item.sizeName}}</span>
                            <span class="order_num">x{{item.ordQty}}</span>
                        </p>
                    </div>
                    <!-- <div class="good-right"></div> -->
                </div>
                <div class="order-bottom">
                    <div class="pdB30 money">
                        合计:
                        <span class="total-price">￥{{order.amountNeedPay|Fix2}}</span>
                        (共{{order.totalQty}}件)
                    </div>
                    <div class="order-btn" ref="btnCtrl">
                        <div
                            class="oprate-btn flex-center"
                            @click.stop="cancelOrder()"
                            v-if="isShowCancelBtn"
                        >取消订单</div>
                        <div
                            class="oprate-btn flex-center"
                            @click.stop="addEvaluate()"
                            v-if="order.allowCommentFlag === 1 &&
                order.reviewFlag === 0&&order.ordStatusCode!='D_ORDCANCEL'"
                        >追加评价</div>
                        <div
                            class="oprate-btn flex-center"
                            @click.stop="navigate(buttonName)"
                            v-if="buttonName"
                        >{{buttonName}}</div>
                    </div>
                </div>
            </div>
            <div class="gray"></div>
        </div>
    </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import pay from "@/pages/order/public/wxPay";
import { Order } from "../../../api/service";
import Storage from "../../../util/storage";
import { cancelOrder, ordSignUp } from "@/pages/order/public/index";

export default {
    props: {
        order: {
            type: Object
        },
        reload: {
            type: Function
        }
    },
    components: {
        "van-dialog": Dialog
    },
    data() {
        return {
            // 各种订单状态显示的按钮名称
            stateNames: {
                D_ORDSPAYING: "立即付款", //待付款
                D_ORDSDELIVERY: "确认收货", //待收货
                D_ORDSCOMMENTING: "立即评价", //待评价
                D_ORDSAPPENDCOMMENTING: "立即追评",
                D_ORDCANCEL: "删除订单" //交易关闭
            },
            isShowCancelBtn: false,
            buttonName: "",
            params: {},
            position: Storage.get("POSITION")
        };
    },

    methods: {
        addEvaluate() {
            this.$router.push({
                name: "addEvaluate",
                query: {
                    billCode: this.order.billCode
                }
            });
        },
        //初始化订单状态
        initState() {
            this.isShowCancelBtn = false;
            this.buttonName = null;
            let code = this.order.ordStatusCode;
            this.buttonName = this.stateNames[this.order.ordStatusCode];
            if (code === "D_ORDSPAYING") {
                this.isShowCancelBtn = true; //只有待付款状态下才显示取消订单的按钮
            }
            //全局参数
            this.params = {
                busContsCode: baseConstant.busContsCode,
                billCode: this.order.billCode,
                ordStatusCode: code,
                ordStatusName: this.order.ordStatusName,
                shopCode: this.order.shopCode
            };
        },
        //根据不同按钮执行操作
        async navigate(statusName) {
            if (statusName === "立即付款") {
                let billCode = this.order.billCode;
                let price = this.order.amountUnPay;
                pay(this, billCode, price).then(
                    // 成功回调
                    data => {
                        Toast("付款成功");
                        this.goTo("waitShip");
                    },
                    // 失败回调
                    err => {
                        if (err.statusCode == 500) {
                            Toast(err.errorMsg);
                            this.reload();
                        }
                    }
                );
            } else if (statusName === "确认收货") {
                ordSignUp(this).then(() => {
                    this.reload();
                    this.buttonName = "立即评价";
                });
            } else if (statusName === "立即评价") {
                this.$router.push({
                    name: "orderEvaluate",
                    query: {
                        billCode: this.order.billCode
                    }
                });
            } else if (statusName === "立即追评") {
                this.$router.push({
                    name: "/add-evaluate",
                    query: {
                        billCode: this.order.billCode
                    }
                });
            } else if (statusName === "删除订单") {
                this.deletedOrder();
            }
        },
        //删除订单 2为删除
        deletedOrder() {
            Dialog.confirm({
                message: "确定删除该订单吗?"
            }).then(() => {
                let data = {
                    flag: 2,
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    billCodes: [this.order.billCode]
                };
                Order.cancelOrder(data).then(res => {
                    if (res.status === 200) {
                        Toast("删除订单成功!");
                        this.reload();
                    } else {
                        Toast("删除订单失败!");
                    }
                });
            });
        },
        //查看订单详情时，跳转至不同状态页面
        goTo(path) {
            this.$router.push({
                name: path + "",
                path: "/" + path,
                query: {
                    billCode: this.order.billCode
                }
            });
        },
        //查看详情
        async viewDetail() {
            let code = this.order.ordStatusCode;
            let receiptWayCode = this.order.receiptWayCode;
            if (code === "D_ORDSPAYING") {
                //待付款
                this.goTo("waitPay");
            } else if (code === "D_ORDSSHIPPING") {
                // 待发货
                this.goTo("waitShip");
            } else if (code === "D_ORDSDELIVERY") {
                // 待收货
                this.goTo("waitRecieve");
            } else if (code === "D_ORDSCOMMENTING") {
                // 待评价
                this.goTo("waitEvaluate");
            } else if (code === "D_ORDRECEIVED") {
                // 交易完成
                this.goTo("tradFinish");
            } else if (code === "D_ORDCANCEL") {
                // 已关闭的订单
                this.goTo("orderClosed");
            }
        },
        //取消订单
        cancelOrder() {
            cancelOrder(this).then(
                () => {
                    this.reload();
                    this.buttonName = null;
                    this.isShowCancelBtn = false;
                },
                err => {
                    if (err) {
                        //订单已被取消,重载数据
                        this.reload();
                    }
                }
            );
        },
        addBooking(item) {
            this.$router.push({
                path: "/booking-quantity-body",
                query: {
                    entrance: 0,
                    isOrder: 1,

                    billCode: this.order.billCode,
                    buscontsCode: this.order.buscontsCode,
                    rtlOrdDtId: item.rtlOrdDtId
                }
            });
        }
    },
    created() {
        this.initState();
    },

    watch: {
        order: function() {
            this.initState();
        }
    }
};
</script>
