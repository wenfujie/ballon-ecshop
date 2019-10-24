/*
 * @Author: yongtian.hong
 * @Date: 2018-10-11 15:04:24
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 15:18:36
 * @Description: 售后申请-退货退款
 */

<style lang='scss' scoped>
@import "./common";
.pd{
    // padding: 0 computed(30) computed(30);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 92%;
    padding: 0 4% computed(30);
    background-color: $color-white;
}
.content{
    padding: computed(30) computed(30) computed(100);
}
.h100{
    overflow: hidden;
}
</style>
<template>
    <div class="w100 h100">
        <div class="flex-vbox w100 h100">
            <div class="flex-auto overflow-scroll content">
                <ordState :data="data"></ordState>
                <!-- 物流 -->
                <logis
                    :data="data"
                    :store="store"
                    :logis="logis"
                    :area="area"
                    :switchBackMode="switchBackMode"
                    :show-area-list.sync="showAreaList"
                    :show-store-list.sync="showStoreList"
                    :show-logis-list.sync="showLogisList"
                ></logis>
                <!-- 商品 -->
                <goods :data="data"></goods>
            </div>
            <div class="flex-between pd">
                <button
                    class="flex-auto flex-center h100px white"
                    :class="btnStyle"
                    v-if="btnName"
                    @click="btnEvent(btnName)"
                >{{btnName}}</button>
                <button
                    class="flex-auto flex-center h100px white"
                    :class="btnModifyStyle"
                    v-if="btnModify"
                    @click="btnEvent(btnModify)"
                >{{btnModify}}</button>
            </div>
        </div>
        <van-popup v-model="showAreaList" position="top">
            <van-area :area-list="cityList" @confirm="selectArea" @cancel="cancelAreaPopup" />
        </van-popup>
        <wheelPicker
            v-model="showStoreList"
            label-key="dptName"
            :list-data="storeList"
            @confirm="selectStore"
        />
        <wheelPicker
            v-model="showLogisList"
            label-key="shippingName"
            :list-data="logisList"
            @confirm="selectLogis"
        />
    </div>
</template>

<script>
import {
    initState,
    selectArea,
    selectStore,
    selectLogis,
    switchBackMode,
    saveLogis,
    btnClickEvent
} from "./public/functions";
import data from "./public/data";
import components from "./components";
export default {
    components: components,
    data() {
        return data;
    },
    methods: {
        initState() {
            initState(this);
        },
        //选择省市区
        selectArea(list) {
            selectArea(this, list);
        },
        //关地区选择弹窗
        cancelAreaPopup() {
            this.showAreaList = false;
        },
        // 选择门店
        selectStore(store) {
            selectStore(this, store);
        },
        // 选择物流
        selectLogis(logis) {
            selectLogis(this, logis);
        },

        // 退回方式切换回调
        switchBackMode(code) {
            switchBackMode(this, code);
        },
        // 按钮事件
        btnEvent(btnName) {
            btnClickEvent(this, btnName);
        }
    },
    created() {
        this.initState();
    },
    beforeDestroy() {
        this.data = {};
        this.btnName = null;
        this.btnModify = null;
        this.showLogisList = false;
    },
    beforeRouteLeave(to, from, next) {
        if (to.name != "addressList") {
            this.Storage.set("EXPRE", {});
            this.logis = {};
            this.area = {};
        }
        next();
    }
};
</script>