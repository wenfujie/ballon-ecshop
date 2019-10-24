<style lang='scss' scoped>
.list-item-wrapper {
    width: 100%;
    padding: 0 computed(30);
    box-sizing: border-box;
    .list {
        display: flex;
        padding: computed(50) 0;
        color: #0d0e09;
        margin-top: computed(50);
        border-bottom: solid 1px #cccccc;
        .left-box {
            width: computed(180);
            height: computed(180);
            margin-right: computed(30);
            img {
                width: 100%;
                height: 100%;
            }
        }
        .middle-box {
            flex: 1;
        }
        .right-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
    .list:first-child {
        padding-top: 0;
    }
    .red {
        color: red;
    }
    .green {
        color: lightgreen;
    }
    .button {
        width: computed(175);
        height: computed(80);
        color: #fff;
    }
}
.h32 {
    min-height: computed(32);
}
</style>

<template>
    <div class="list-item-wrapper">
        <div class="list" @click="viewDetail()">
            <div class="left-box">
                <img :src="getImg(data.pictUrl, '87*87')" onerror="errImg(event)" />
            </div>
            <div class="middle-box">
                <div class="fs32B mgB10" :class="titleColor">
                    状态:
                    <span class>{{stateNameMap[data.applyStatusCode]}}</span>
                </div>
                <div class="fs28 mgB8" :class="globalStyle">
                    售后类型:
                    {{data.returnTypeName}}
                </div>
                <div class="fs28 mgB8 h32" :class="globalStyle">
                    <div v-if="showMoney">
                        <span>{{moneyName}}:</span>
                        <span :class="moneyColor">{{Rmb}}{{money|fixed2 }}</span>
                    </div>
                </div>
                <div class="fs28 grey99">{{data.applyTime}}</div>
            </div>
            <div class="right-box">
                <button
                    class="button fs28 flex-center mgB20"
                    :class="btnStyle"
                    v-if="btnName"
                    @click.stop="btnClick(btnName)"
                >{{btnName}}</button>
                <button
                    class="button fs28 flex-center"
                    :class="btnModifyStyle"
                    v-if="btnModify"
                    @click.stop="btnClick(btnModify)"
                >{{btnModify}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import ordStateMap from "../public/OrdStateMap";
import { cancelApply, reApply, modifyApply, goTo } from "../public/functions";
import wxPay from "@/pages/order/public/wxPay";
export default {
    props: {
        data: {},
        reload: {
            type: Function
        }
    },
    data() {
        return {
            stateNameMap: ordStateMap,
            curStateName: "", //当前售后状态
            curTypeName: "", //当前售后类型
            btnName: null,
            btnStyle: "bg-gray",
            btnModify: null,
            btnModifyStyle: "bg-blue",
            money: 0,
            moneyName: "退款金额",
            moneyColor: "",
            globalStyle: "",
            titleColor: "",
            Rmb: "￥",
            showMoney: true
        };
    },
    methods: {
        init() {
            this.btnName = null;
            this.btnModify = null;

            this.curStateName = this.stateNameMap[this.data.applyStatusCode];
            this.curTypeName = this.data.returnTypeName;
            switch (this.curTypeName) {
                case "返修":
                    this.moneyColor = "red";
                    this.moneyName = "返修费用";
                    this.Rmb = "-￥";
                    if (this.data.repairPrice) {
                        this.money = this.data.repairPrice;
                    } else {
                        this.showMoney = false;
                    }
                    break;
                case "换货":
                    this.showMoney = false;
                    break;
                case "仅退款":
                    this.moneyColor = "green";
                    this.money = this.data.applyMoney;
                    break;
                case "退货退款":
                    this.moneyColor = "green";
                    this.money = this.data.applyMoney;
                    // this.data.goodsList[0].averagePrice *
                    // this.data.applyAmountQty;
                    break;
                default:
                    this.money = 0;
                    this.Rmb = "￥";
            }
            switch (this.curStateName) {
                case "待审核":
                    this.btnName = "取消申请";
                    this.btnModify = "修改申请";
                    break;
                case "待寄回":
                    this.btnName = "填写物流";
                    this.btnStyle = "bg-blue";
                    break;
                case "待支付":
                    this.btnName = "支付费用";
                    this.btnStyle = "bg-blue";
                    break;
                case "已完成":
                    this.globalStyle = "grey99";
                    this.moneyColor = "";
                    break;
                case "已关闭":
                    this.globalStyle = "grey99";
                    this.titleColor = "grey99";
                    this.moneyColor = "";
                    break;
                case "已拒绝":
                    this.btnName = null;
                    this.btnStyle = "bg-blue";
                    break;
                default:
                    this.btnName = null;
                    this.btnModify = null;
                    this.btnStyle = "bg-gray";
            }
        },
        // 填写物流
        fillLogis() {
            goTo(this, "postSaleDetail");
            console.log("填写物流");
        },
        //支付费用
        pay() {
            let reApplycode = this.data.reapplycode;
            let price = this.data.repairPrice;
            let payType = "D_PAY_REPAIR";
            wxPay(this, reApplycode, price, payType).then(
                () => {
                    Toast("支付成功");
                    this.reload();
                },
                () => {
                    // Toast("支付失败");
                }
            );
        },
        // 按钮点击触发事件
        btnClick(btnName) {
            switch (btnName) {
                case "取消申请":
                    cancelApply(this).then(
                        result => {
                            this.curStateName = "已关闭";
                            this.btnName = null;
                            this.btnModify = null;
                            this.globalStyle = "grey99";
                            this.titleColor = "grey99";
                            this.moneyColor = "grey99";
                            this.reload();
                            console.log("执行回调");
                        },
                        err => {
                            Toast("取消失败");
                        }
                    );
                    break;
                case "重新申请":
                    reApply(this);
                    break;
                case "修改申请":
                    modifyApply(this);
                    break;
                case "填写物流":
                    this.fillLogis();
                    break;
                case "支付费用":
                    this.pay();
                    break;
            }
        },
        // 查看申请单详情
        viewDetail() {
            goTo(this, "postSaleDetail");
        }
    },
    created() {
        this.init();
    },
    watch: {
        data: function() {
            this.init();
        }
    }
};
</script>