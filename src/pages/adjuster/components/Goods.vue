/*
 * @Author: yongtian.hong
 * @Date: 2018-08-13 13:42:39
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-07 01:28:24
 * @Description: 售后服务公用商品描述组件
 */

<style lang='scss' scoped>
.img-box {
    width: computed(150);
    height: computed(150);
    margin-right: computed(20);
    img {
        width: 100%;
        height: 100%;
    }
}
.imgs {
    display: flex;
    flex-wrap: wrap;
    img {
        width: computed(150);
        height: computed(150);
        margin: computed(20) computed(20) 0 0;
    }
}
.pdT30 {
    padding-top: computed(30) !important;
}
</style>

<template>
    <div class="mgT20 pdT30" v-if="data">
        <!-- 商品 -->
        <div class="flex-box mgB30" v-for="(good,index) in data.goodsList" :key="index">
            <div class="img-box">
                <img :src="getImg(good.thumb, '75*75')" onerror="errImg(event)" />
            </div>
            <div class="flex-lave fs32">
                <div class="fw-bold mgB15">{{good.goodsName}}</div>
                <div class="fw-bold mgB15">￥ {{good.averagePrice}}</div>
                <div class="flex-between fs28 grey99">
                    <span>{{good.colorName}} {{good.sizeName}}</span>
                    <span>x{{good.ordQty}}</span>
                </div>
            </div>
        </div>
        <!-- 说明 -->
        <div class="fs32">
            <div class="mgB30">售后类型: {{data.returnTypeName}}</div>
            <div class="mgB30">售后原因: {{data.returnsReason}}</div>
            <div class="mgB30" v-if="isRefund && data.goodsList">退款金额: ￥{{data.applyMoney}}</div>
            <div class="mgB30" v-if="isReturn">
                退货数量: {{data.applyAmountQty}}
                <span
                    class="refund"
                    v-if="data.goodsList"
                >预计退款: ￥{{data.applyMoney|fixed2}}</span>
            </div>
            <!-- 换货商品显示 -->
            <div class="flex-box" v-if="isChange">
                <div>换货商品:</div>
                <div class="mgL20">
                    <div v-for="(good,index) in data.changeGoodsList" :key="index" class="mgB30">
                        <span>{{good.colorName}}</span>
                        <span class="mgL30">{{good.sizeName}}</span>
                        <span class="mgL30">x{{good.amount}}</span>
                    </div>
                </div>
            </div>
            <div class="mgB30">售后说明: {{data.reasonMemo||"无"}}</div>
            <div>
                上传图片:
                <span v-if="data.pictList && data.pictList.length==0">无</span>
            </div>
        </div>
        <!-- 用户上传的图片 -->
        <div class="imgs mgB30">
            <img
                v-for="(item,index) in data.pictList"
                :src="getImg(item.pictUrl, '75*75')"
                onerror="errImg(event)"
                :key="index"
            />
        </div>
    </div>
</template>

<script>
import check from "@/util/check";

export default {
    name: "goods",
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            isRefund: false, //仅退款
            isReturn: false, //退货退款
            isChange: false, //换货
            isRepair: false //返修
        };
    },
    methods: {
        initCurType() {
            // console.log("code", this.data.returnTypeCode);
            switch (this.data.returnTypeCode) {
                // 仅退款
                case "D_ONLYDRAWBACK":
                    this.isRefund = true;
                    break;
                // 换货
                case "D_CHANGEPART":
                    this.isChange = true;
                    break;
                // 返修
                case "D_REPAIR":
                    this.isRepair = true;
                    break;
                // 退货退款
                case "D_RETURNSALES":
                    this.isReturn = true;
                    break;
            }
        }
    },

    watch: {
        data: function() {
            this.initCurType();
        }
    }
};
</script>