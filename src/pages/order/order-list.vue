/*
 * @Author: wxx 
 * @Date: 2019-08-17 15:48:14 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-09-04 14:56:34
 */

<style lang='scss' scoped>
.orderList-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #edf0f7;
    .top-bar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        width: 100%;

        .ord-source {
            display: flex;
            justify-content: center;
            align-items: center;
            height: computed(90);
            font-size: computed(28);
            color: #666666;
            background: #f1f1f1;
            .iconfont {
                font-size: computed(24);
            }
        }
        .tabBar {
            width: 100%;
        }
    }

    .list-box {
        padding: 0 0 computed(100) 0;
        min-height: computed(300);
    }
    .van-list {
        padding-bottom: computed(100);
    }
    .bottom-btn-bar {
        // display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        font-size: computed(28);
        a,
        button {
            font-size: computed(24);
        }
        a {
            position: relative;
            i {
                margin-right: computed(14);
                font-size: computed(45);
            }
        }
        .line {
            width: computed(1);
            position: absolute;
            height: computed(60);
            background: rgba(204, 204, 204, 0.26);
            left: computed(375);
            top: computed(23);
            z-index: 2;
        }
        button {
            i {
                font-size: computed(40);
                margin-right: computed(10);
            }
        }
    }
}
.pd-top-80 {
    padding-top: computed(80);
}
.pd-top-170 {
    padding-top: computed(170);
}
.split-line {
    width: 1px;
    height: 80%;
    background-color: #cccccc;
}
.phone-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: computed(10);
}
.empty-box {
    height: computed(400);
    padding-top: computed(250);
    position: fixed;
}
</style>

<template>
    <div class="orderList-wrap" :class="[accountList.length>1?'pd-top-170':'pd-top-80']">
        <div class="top-bar">
            <div class="ord-source" v-if="accountList.length>1">
                <div>订单来源:&nbsp;</div>
                <div @click="toggleAccountList()">
                    <span>{{curAccount.name}}&nbsp;</span>
                    <i class="iconfont icon-xialaxuan"></i>
                </div>
            </div>
            <div class="tabBar">
                <scroll-tab
                    class="borderB1c"
                    :data="tabs"
                    :tabClick="search"
                    :index="sIndex"
                    :tabs-align="'center'"
                />
            </div>
        </div>

        <div class="list-box">
            <van-list
                v-model="showLoading"
                :finished="finished"
                @load="loadMoreData"
                :loading-text="loadingText"
                :offset="500"
            >
                <list-item
                    class="list-item"
                    v-for="(order) in orderList"
                    :key="order.billCode"
                    :order="order"
                    :reload="getListData"
                />
            </van-list>
            <empty emptyText="没有相关订单" v-show="showEmpty&&!showLoading"></empty>
        </div>
        <!-- 底部 -->
        <div class="flex-box fs28 bottom-btn-bar">
            <button class="w50 h100px bg-blue white flex-row" @click="concatCumService()">
                <i class="iconfont icon-fuwuzhongxin"></i> 联系客服
            </button>
            <p class="line"></p>
            <a class="flex-center w50 h100px bg-blue white flex-row" href="tel:400-000-0000">
                <i class="iconfont icon-bodadianhua"></i>
                <div class="phone-box">
                    <div>拨打电话</div>
                    <div>4008010808</div>
                </div>
            </a>
        </div>
        <wheelPicker
            v-model="showAccountList"
            label-key="name"
            :default-index="defaultAccountIndex"
            :list-data="accountList"
            @confirm="changeAccount"
        />
    </div>
</template>


<script>
import getLocationPosition from "../../util/getLocation";
import listItem from "./components/ListItem";
import scrollTab from "@/components/ScrollTab";
import wheelPicker from "@/components/wheel-picker";
import check from "../../util/check.js";
import { List, Loading, Cell, Popup, Picker } from "vant";
import { UserService } from "@/api/service";
import { cancelOrder } from "./public/index";
import Storage from "@/util/storage"; // axios二次封装
import tabs from "./public/tabs";
import ysfService from "@/util/ysfService";
import Empty from "../../components/EmptyContent";

export default {
    name: "ordList",
    components: {
        "van-loading": Loading,
        "van-list": List,
        "van-cell": Cell,
        "van-popup": Popup,
        "van-picker": Picker,
        listItem,
        scrollTab,
        wheelPicker,
        empty: Empty
    },
    data() {
        return {
            tabs: tabs,
            sIndex: 0,
            orderList: [],
            showLoading: true,
            finished: false,
            result: {},
            loadingText: "小主请稍等,数据一会就到哦。。。",
            isReload: false,
            direction: false,
            accountList: [],
            showAccountList: false,
            curAccount: {
                name: "",
                ids: []
            },
            defaultAccountIndex: 0,
            vipId: this.Storage.get("USER_INFO").vipInfoId,
            params: {
                pageNum: 1,
                pageSize: 10,
                searchCode: null,
                busContsCode: baseConstant.busContsCode,
                vipInfoHdIds: []
            },
            showEmpty: false
        };
    },

    methods: {
        // 初始化选中的订单与编号
        initState() {
            let curTab = Storage.get("ordListTab");
            this.params.searchCode = curTab ? curTab.code : "";
            this.sIndex = curTab ? curTab.index : 0;
        },

        // 手机号部分隐藏处理
        phoneNumHandle(phoneNumber) {
            return (phoneNumber + "").replace(
                /^(\d{3})\d{4}(\d{4})$/,
                "$1****$2"
            );
        },

        //获取关联账户列表
        async getAccountList() {
            let accountList = await UserService.getRelationAccountList();

            let allAcount = {
                name: "全部",
                ids: []
            };
            let curAccount = {
                name: "当前账户",
                ids: ""
            };
            let accounts = [];
            // 数据重组
            if (accountList instanceof Array) {
                accountList.forEach(account => {
                    // 添加id
                    allAcount.ids.push(account.id);
                    //判断是否为当前Id
                    if (this.vipId == account.id) {
                        curAccount.ids = account.id;
                    } else {
                        accounts.push({
                            name: this.phoneNumHandle(account.mobilePhone),
                            ids: account.id
                        });
                    }
                });
                allAcount.ids = allAcount.ids.toString();
            }
            return accountList.length > 1
                ? [allAcount, curAccount, ...accounts]
                : [allAcount];
        },

        saveCurSelectedState(index, code) {
            // this.$route.query.index = index;
            // this.$route.query.code = code;
            Storage.set("ordListTab", {
                code: code,
                index: index
            });
        },

        //
        restPageSize() {
            window.scrollTo(0, 1);
        },
        //tab点击按条件查询对应订单
        search(item, index) {
            this.showEmpty = false;
            this.sIndex = index;
            this.params.pageNum = 1;
            this.params.searchCode = item.code;
            this.restPageSize();
            this.saveCurSelectedState(index, item.code);
            this.showLoading = true;
            this.finished = false;
            this.loadingText = "小主请稍等,数据一会就到哦。。。";
            this.getListData();
        },
        //选择账号
        toggleAccountList() {
            this.showAccountList = !this.showAccountList;
        },
        // 切换账户
        changeAccount(account, index) {
            Storage.set("curAccount", Object.assign(account, { index: index }));
            this.curAccount = account;
            this.params.vipInfoHdIds = this.curAccount.ids;
            
            this.params.pageNum = 1; //重置查询条件为获取第一页数据
            this.showAccountList = false;
            // this.params.searchCode = null; //重置查询条件为查询全部
            // this.sIndex = 0; //默认选中第一个
            this.restPageSize();
            this.getListData();
        },
        // 获取订单编号集合
        getBillCodes(list) {
            let codes = [];
            if (list instanceof Array) {
                list.forEach(element => {
                    codes.push(element.billCode);
                });
            }
            return codes;
        },
        // 获取列表数据
        async getListData() {
            this.params.pageNum = 1;
            if (this.accountList.length == 0) {
                let defaultAccount = Storage.get("curAccount");
                this.defaultAccountIndex = defaultAccount
                    ? defaultAccount.index
                    : this.defaultAccountIndex;

                this.accountList = await this.getAccountList();
                this.curAccount = this.accountList[this.defaultAccountIndex];
                this.params.vipInfoHdIds = this.curAccount.ids;
            }
            this.result = await this.$get("order/getWxOrderList", this.params);
            // this.getBillCodes(this.result.data.list);
            if (this.result.data) {
                this.showLoading = false;
            }
            //提取列表项
            this.orderList = this.result.data.list;
            console.log(this.orderList, "this.orderList");
            if (this.orderList.length == 0) {
                console.log(1111);
                this.showEmpty = true;
            }
        },
        //上拉加载更多
        async loadMoreData() {
            if (this.finished) {
                return false;
            } else if (this.result.data.hasNextPage) {
                this.params.pageNum += 1;
                this.showLoading = true;
                this.result = await this.$get("order/getWxOrderList", this.params);
                this.showLoading = false;
                this.orderList = this.orderList.concat(this.result.data.list);
            } else {
                this.finished = true;
                this.loadingText = "小主没有更多订单咯。。。";
                setTimeout(() => {
                    this.showLoading = false;
                }, 2000);
            }
        },
        //联系客服
        async concatCumService() {
            // let user = await UserService.getUserInfo();
            // Custom(user.usrId, user.usrName, user.email, user.mobilePhone);
            // console.log("user,", user);
            ysfService.wakeUp();
        },
        // 初始化
        initData() {
            this.getListData();
        },

        //重置液面高度
        resetHeight() {
            this.$nextTick(() => {
                window.scrollTo(0, 1);
            });
        }
    },
    created() {
        this.initState();
        this.initData();
        this.resetHeight();
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                window.scrollTo(0, 1);
            });
        }, 0);
    },
    watch: {
        isReload: function() {
            this.initData();
            this.isReload = false;
        }
    },
    beforeRouteEnter(to, from, next) {
       
        let whiteList = ["member-center"];
        if (whiteList.includes(from.name)) {
            Storage.set("curAccount", { index: 0 });
        }
        next();
    }
};
</script>