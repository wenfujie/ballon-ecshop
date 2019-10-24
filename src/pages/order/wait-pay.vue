<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-27 20:36:28
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-27 20:36:28
 * @Description: 
 -->
 
 
<style lang="scss" scoped>
.wait-pay {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    background: #edf0f7;
    padding-bottom: computed(120);
    .padding-top-90 {
        padding-top: computed(85);
    }
    .line {
        border-top: computed(10) solid #edf0f7;
    }

    .bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: computed(100);
        display: flex;
        background: #fff;
        .price,
        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: computed(32);
            font-family: "PingFang-SC-Medium";
        }
        .price {
            flex: 1;
            color: #0d0e09;
            border-top: solid 1px #cccccc;
        }
        .btn {
            height: computed(100);
            outline: 0;
            border: 0;
            color: #fff;
        }
        .btn-gray {
            background-color: #808080;
        }
        .btn-blue {
            background-color: #2ba4f3;
        }
    }
}
</style>

<template>
    <div class="wait-pay">
        <div class="overflow-scroll flex-auto " :class="{'padding-top-90':paddingTop}">

            <countDown :order="order" @getOrdInfo="getOrdInfo"></countDown>
            <pickup-info :data="order" :class="{'line':paddingTop}"></pickup-info>
            <good-list :pkg="order" :order="order"></good-list>
            <order-info :data="order"></order-info>
        </div>
        <div class="bottom">
            <div class="price">实付金额:￥{{order.amountNeedPay|Fix2}}</div>
            <button class="btn w30 btn-gray" @click="cancelOrder()">取消订单</button>
            <button class="btn w30 btn-blue" @click="pay()">立即付款</button>
        </div>
    </div>
</template>

<script>
import components from "./components";
import check from "@/util/check.js";
import { Dialog, Toast } from "vant";
import { getOrdInfo } from "./public";
import wxPay from "@/pages/order/public/wxPay";
import { cancelOrder, ordSignUp } from "@/pages/order/public/index";
export default {
    components: components,
    data() {
        return {
            paddingTop: false,
            discount: {},
            order: {}
        };
    },
    methods: {
        // 获取订单详情
        async getOrdInfo() {
            getOrdInfo(this);
        },
        //取消订单
        cancelOrder() {
            cancelOrder(this).then(
                () => {
                    // this.getOrdInfo();
                    this.$router.replace({
                        name: "orderClosed",
                        query: {
                            billCode: this.order.billCode
                        }
                    });
                },
                err => {
                    if (err) {
                        this.$router.replace({
                            name: "orderClosed",
                            query: {
                                billCode: this.order.billCode
                            }
                        });
                    }
                }
            );
        },
        // 支付
        pay() {
            let billCode = this.order.billCode;
            let price = this.order.amountUnPay;
            wxPay(this, billCode, price).then(
                // 成功回调
                data => {
                    this.$router.replace({
                        name: "waitShip",
                        query: {
                            billCode: this.order.billCode
                        }
                    });
                },
                // 失败回调
                err => {
                    if (err.statusCode == 500) {
                        Toast(err.errorMsg);
                        this.getOrdInfo();
                    }
                }
            );
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
        
        this.getOrdInfo();
    }
};
</script>