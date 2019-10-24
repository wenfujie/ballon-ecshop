
<template>
    <div class="member-center">
        <div class="center-header">
            <img :src="userInfo.thumb | imageFilter" alt onerror="errImg(event)" />
            <div class="shopping-cart" @click="navigate('/shopping-cart')">
                <i class="iconfont icon-gouwudai"></i>
                <div
                    class="cart-tip"
                    v-if="shoppingCartCount > 0"
                >{{shoppingCartCount > 100 ? '...' : shoppingCartCount }}</div>
            </div>
            <p>{{userInfo.account}}</p>
            <span class="member-tip">
                <van-icon name="member-day-privilege"></van-icon>
                <span class="user-vip-level">{{userInfo.vipLevel}}</span>
            </span>
            <van-tabbar class="order-tabbar">
                <van-tabbar-item @click=" goToOrdList({code:'D_ORDSPAYING',index:1})">
                    <span>待付款</span>
                    <template slot="icon" slot-scope="props">
                        <van-icon class="iconfont icon-daifukuan" />
                    </template>
                </van-tabbar-item>
                <van-tabbar-item @click=" goToOrdList({code:'D_ORDSSHIPPING',index:2})">
                    <span>待发货</span>
                    <template slot="icon" slot-scope="props">
                        <van-icon class="iconfont icon-daifahuo" />
                    </template>
                </van-tabbar-item>
                <van-tabbar-item @click=" goToOrdList({code:'D_ORDSDELIVERY',index:3})">
                    <span>待收货</span>
                    <template slot="icon" slot-scope="props">
                        <van-icon class="iconfont icon-daishouhuo" />
                    </template>
                </van-tabbar-item>
                <van-tabbar-item @click="navigate('/postSaleList')">
                    <span>维修/售后</span>
                    <template slot="icon" slot-scope="props">
                        <van-icon class="iconfont icon-weixiu" />
                    </template>
                </van-tabbar-item>
                <van-tabbar-item @click="goToOrdList({code:'',index:0})">
                    <span>全部订单</span>
                    <template slot="icon" slot-scope="props">
                        <van-icon class="iconfont icon-dingdan" />
                    </template>
                </van-tabbar-item>
            </van-tabbar>
        </div>
        <!--<van-cell-group class="first-cell">-->
        <!--<van-cell :title="userInfo.uneffTime" icon="location" value="开通会籍" is-link to="/member-card-list" />-->
        <!--</van-cell-group>-->
        <div class="cell-title">我的服务</div>
        <van-cell-group class="main-cell">
            <van-cell class="member-cell" is-link to="/my-vouchers">
                <template slot="title">
                    <i class="iconfont icon-youhuiquan" style="top: 0"></i>
                    <span class="van-cell-text">抵用券</span>
                    <span class="van-cell-text com-num">
                        共
                        <span>{{userInfo.voucherCount}}</span>张可用
                    </span>
                </template>
            </van-cell>
            <van-cell title="会员卡" is-link to="/member-benefit" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-huiyuanquanyi" />
            </van-cell>
            <van-cell title="消费记录" is-link to="/purchase-list" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-xiaofeijilu" />
            </van-cell>
            <van-cell title="我的收藏" is-link to="/my-dream-list" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-yuanwangqingdan" />
            </van-cell>
            <van-cell title="我的积分" is-link to="/member-point" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-jifen" />
            </van-cell>

            <van-cell title="我的预约" is-link to="/my-reserve" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-yuyue" />
            </van-cell>
            <van-cell title="我的量体" is-link to="/amount-body" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-liangtishuju1" />
            </van-cell>
        </van-cell-group>
        <div class="cell-title">其他</div>
        <van-cell-group class="sec-cell">
            <van-cell title="个人信息" is-link to="/member/member-information" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-gerenxinxi" />
            </van-cell>
            <van-cell title="地址管理" is-link to="/address-list" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-dizhi" />
            </van-cell>
            <van-cell title="在线客服" is-link @click="kfServer" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-fuwuzhongxin" />
            </van-cell>

            <van-cell title="账号整合" @click="isIntegrate()" class="member-cell">
                <van-icon slot="icon" class="iconfont icon-zhanghu" />
                <i class="iconfont icon-youfan"></i>
            </van-cell>
        </van-cell-group>
        <footer-bar></footer-bar>
    </div>
</template>
<script>
import { Icon, Tabbar, TabbarItem, Cell, CellGroup, Toast } from "vant";
import FooterBar from "@/components/FooterBar";
import { UserService, Base, Login, Cms, ShoppingCart } from "../../api/service";
import Storage from "../../util/storage";
import ysfService from "@/util/ysfService";

export default {
    components: {
        "van-icon": Icon,
        "van-tabbar": Tabbar,
        "van-tabbar-item": TabbarItem,
        "van-cell": Cell,
        "van-cell-group": CellGroup,
        "footer-bar": FooterBar
    },
    name: "member-center",
    data() {
        return {
            userInfo: {},
            memberList: [], //判断是否需要会员整合
            shoppingCartCount: null
        };
    },
    methods: {
        //路由导航
        navigate(url) {
            this.$router.push(url);
        },

        // 在线客服
        kfServer() {
            ysfService.wakeUp();
        },
        //  获取会员信息
        getVipInfo() {
            let data = {
                busContsCode: baseConstant.busContsCode
                // shopId: Storage.get("USER_INFO").shopId
            };
            UserService.getWxVipInfo(data).then(res => {
                // 处理会员等级
                if (res.vipLevel === null) {
                    res.vipLevel = "基础会员";
                }
                this.userInfo = res;
            });
        },

        //进入订单列表
        goToOrdList(params) {
            Storage.set("ordListTab", params);
            this.$router.push({
                name: "orderList",
                query: params
            });
        },
        isIntegrate() {
            this.getMemberList();
        },
        // 获取会员列表
        getMemberList() {
            let data = {
                vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                windowFlag: 0 // 1弹窗 0非弹窗
            };
            return UserService.memberMergeList(data).then(res => {
                this.memberList = res && res.length > 0 ? res : [];
                if (this.memberList.length == 0) {
                    Toast("暂无匹配的账号需要整合");
                } else {
                    this.$router.push("/member-integrate");
                }
            });
        },
        //  获取购物车数量（多平台整合不传店铺Id）
        getCartCount() {
            let data = {
                // shopId: Storage.get('USER_INFO').shopId
            };
            ShoppingCart.getCartCount(data).then(res => {
                this.shoppingCartCount = res;
            });
        }
    },
    created() {
        this.getVipInfo();
        // this.getMemberList();
        this.getCartCount();
        global.sendCardCoupons();
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                window.scrollTo(0, 1);
            });
        }, 0);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.member-center {
    padding-bottom: computed(122);
    background: #f1f1f1;
}

.center-header {
    height: computed(430);
    background: #222222;
    padding-top: computed(25);
    position: relative;

    .order-tabbar {
        height: computed(120);
        margin-top: computed(50);
    }

    .shopping-cart {
        position: absolute;
        top: computed(42);
        right: computed(42);
        text-align: center;
        i {
            color: #ffffff;
            font-size: computed(38);
            line-height: computed(38);
            z-index: 2;
        }
        .cart-tip {
            position: absolute;
            top: computed(-3);
            right: computed(-5);
            width: computed(26);
            height: computed(26);
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            overflow: hidden;
            background: #d80000;
            font-size: computed(16);
            line-height: computed(26);
            color: #ffffff;
            text-align: center;
            z-index: 3;
        }
    }

    img {
        width: computed(130);
        height: computed(130);
        display: block;
        margin: auto;
        background: #fff;
        border-radius: 50%;
    }

    p {
        text-align: center;
        color: #fff;
        font-size: computed(36);
        margin: computed(25) auto;
    }

    .van-tabbar {
        position: absolute;
        background: rgba(0, 0, 0, 0);

        .van-icon {
            font-size: computed(46);
        }

        .van-tabbar-item span {
            font-size: computed(24);
        }
    }
    .van-hairline--top-bottom::after {
        border: none;
    }

    .van-tabbar-item {
        color: #fff;
    }

    .member-tip {
        display: flex;
        justify-content: center;
        align-items: center;
        // height: computed(38);
        // line-height: computed(38);
        color: #fff;
        // margin: computed(25) auto;
        font-size: computed(17);
        // text-align: center;
        .van-icon {
            margin-right: 2%;
            vertical-align: middle;
        }
        .user-vip-level {
            padding: computed(5);
            background: $maincolor;
            border-radius: 4px;
        }
    }
}
.van-cell {
    padding: computed(30) computed(20);
    font-size: computed(30);
}

.van-hairline--top-bottom::after {
    border-width: 0;
}

.cell-title {
    height: computed(60);
    line-height: computed(60);
    background-color: #f1f1f1;
    font-size: computed(20);
    padding: 0 computed(20);
    color: #a3a3a3;
}

.com-num {
    float: right;

    span {
        font-size: computed(35);
        color: red;
        padding: 0 5px;
    }
}

.member-cell .iconfont {
    position: relative;
    top: computed(6);
    margin-right: computed(30);
    font-size: computed(40);
    line-height: computed(40);
    color: #999999;
}
.icon-youfan::before {
    font-size: computed(32);
    margin-right: computed(-33);
}
.van-cell:not(:last-child)::after {
    border-bottom-width: 0;
}
.member-cell:not(:last-child) {
    border-bottom: computed(1) solid #e5e5e5;
}
</style>


