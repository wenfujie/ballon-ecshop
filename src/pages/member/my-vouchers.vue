
/*
* createTime：2018/8/8
* author：en.chen
* LastEditors: lan.chen
* LastEditTime: 2019-06-25 09:54:22
* description:  我的抵用券
*/

<template>
    <div class="vouchers">
        <!-- 优惠券列表 begin -->
        <div>
            <van-list
                v-model="loading"
                :finished="finished"
                @load="loadMore"
                :immediate-check="false"
                v-if="cardList.length > 0 || cardListHistory.length > 0"
            >
                <ul class="vouchers-list">
                    <!--可用优惠券-->
                    <li
                        class="vouchers-item"
                        v-for="(item,index) in cardList"
                        :key="'cardList' + index"
                    >
                        <!--抵用券详情 begin-->
                        <div class="detail">
                            <div class="left-box">
                                <p class="type">{{item.couponName}}</p>
                                <p class="value">
                                    <span>{{item.cardType === 10060203 ? item.discount : item.initialValue }}</span>
                                    <span class="price">{{item.cardType === 10060203 ?'折':'元'}}</span>
                                </p>
                                <p
                                    class="tip add-wechat"
                                    v-if="item.weixinId && item.weixinId !==null && item.isSyncToWechet === 0"
                                    @click="getWechatConfig(item)"
                                >加入微信卡包</p>
                                <!--<p class="tip" v-if="item.isSyncToWechet !== 0">已使用-元</p>-->
                            </div>
                            <div class="right-box">
                                <p class="time">
                                    {{item.couponTimeStart}}
                                    <br />至
                                    <br />
                                    {{item.couponTimeEnd}}
                                </p>
                                <!--statusCode: "D_VALCARDHACED"-->
                                <div
                                    class="btn"
                                    v-if="item.statusCode === 'D_VALCARDHACED'"
                                    @click="goShop(item)"
                                >立即使用</div>
                            </div>
                        </div>
                        <!-- 抵用券详情 end -->

                        <!-- 抵用券说明 begin -->
                        <div
                            class="explain"
                            :class="{'show-content': item.wordBreak === true}"
                            @click="item.wordBreak = !item.wordBreak"
                        >
                            <p class="instructionsUse">{{item.instructions}}</p>
                            <i
                                class="iconfont icon-xialaxuan"
                                v-if="instructionsUseScrollWidth[index] > instructionsUseOffsetWidth[index]"
                            ></i>
                        </div>
                        <!-- 抵用券说明 end -->
                    </li>
                    <!--历史优惠券-->
                    <li
                        class="vouchers-item disabled"
                        v-for="(item,index) in cardListHistory"
                        :key="'cardListHistory' + index"
                    >
                        <!--抵用券详情 begin-->
                        <div class="detail">
                            <div class="left-box">
                                <p class="type">{{item.couponName}}</p>
                                <p class="value">
                                    <span>{{item.cardType === 10060203 ? item.discount : item.initialValue }}</span>
                                    <span class="price">{{item.cardType === 10060203 ?'折':'元'}}</span>
                                </p>
                                <p
                                    class="tip add-wechat"
                                    v-if="item.weixinId && item.weixinId !==null && item.isSyncToWechet === 0"
                                    @click="getWechatConfig(item)"
                                >加入微信卡包</p>
                                <!--<p class="tip" v-if="item.isSyncToWechet !== 0">已使用-元</p>-->
                            </div>
                            <div class="right-box">
                                <p class="time">
                                    {{item.couponTimeStart}}
                                    <br />至
                                    <br />
                                    {{item.couponTimeEnd}}
                                </p>
                                <!--statusCode: "D_VALCARDHACED"-->
                                <div
                                    class="btn"
                                    v-if="item.statusCode === 'D_VALCARDHACED'"
                                    @click="goShop(item)"
                                >立即使用</div>
                            </div>
                        </div>
                        <!-- 抵用券详情 end -->

                        <!--优惠券过期提示 begin-->
                        <div
                            class="disabled-tip expired"
                            v-if=" item.statusCode === 'D_VALCARDOVERD' "
                        ></div>
                        <!--优惠券过期提示 end-->
                        <!-- 优惠券使用提示 begin-->
                        <div
                            class="disabled-tip used-tip"
                            v-if=" item.statusCode === 'D_VALCARDUSEED' "
                        ></div>
                        <!-- 优惠券使用提示 end -->
                        <!-- 抵用券说明 begin -->
                        <div
                            class="explain"
                            :class="{'show-content': item.wordBreak === true}"
                            @click="item.wordBreak = !item.wordBreak"
                        >
                            <p class="instructionsHistory">{{item.instructions}}</p>
                            <i
                                class="iconfont icon-xialaxuan"
                                v-if="instructionsHistoryScrollWidth[index] > instructionsHistoryOffsetWidth[index]"
                            ></i>
                        </div>
                        <!-- 抵用券说明 end -->
                    </li>
                </ul>
            </van-list>
            <div
                class="empty-content"
                v-if="loading === false && cardList.length === 0 && cardListHistory.length === 0"
            >暂无优惠券~</div>
        </div>
        <!-- 优惠券列表 end -->

        <!--底部按钮 begin-->
        <div class="common-bottom-btn" @click="routeLink">
            <p class="btn-txt">去领券</p>
        </div>
        <!-- 底部按钮 end -->
    </div>
</template>
<script>
import { List, Toast } from "vant";
import Storage from "../../util/storage";
import { Vouchers, Order } from "../../api/service";
import wx from "weixin-js-sdk";
export default {
    components: {
        "van-list": List
    },
    data() {
        return {
            cardList: [],
            cardListHistory: [],
            pageNum: 1,
            pageSize: 9999,
            loading: true, // 控制loading显示
            finished: true, // 控制是否加载更多商品
            instructionsUseOffsetWidth: [], // 优惠券描述文字容器宽Use
            instructionsUseScrollWidth: [], // 优惠券描述文字实际宽Use
            instructionsHistoryOffsetWidth: [], // 优惠券描述文字容器宽History
            instructionsHistoryScrollWidth: [] // 优惠券描述文字实际宽History
        };
    },
    methods: {
        //  获取卡券列表
        async getCardList() {
            // if (this.finished === true) {
            //     Toast("没有更多了~");
            //     return;
            // }
            let data = {
                pageNum: 1,
                pageSize: 9999,
                statusCodes: "D_VALCARDHACED"
            };
            await Vouchers.userVouchersList(data)
                .then(res => {
                    if (res.total > 0 && res.list.length > 0) {
                        res.list.forEach(item => {
                            item.wordBreak = false;
                        });
                        this.cardList = res.list;
                    }
                })
                .then(() => {
                    // 列表渲染完后判断是否需要显示描述下拉Use
                    let instructionsUse = document.getElementsByClassName(
                        "instructionsUse"
                    );
                    for (let i = 0; i < instructionsUse.length; i++) {
                        this.instructionsUseOffsetWidth.push(
                            instructionsUse[i].offsetWidth
                        );
                        this.instructionsUseScrollWidth.push(
                            instructionsUse[i].scrollWidth
                        );
                    }
                });
        },
        // 获取历史优惠券
        async getCardListHistory() {
            let data = {
                pageNum: 1,
                pageSize: 9999,
                statusCodes: "D_VALCARDUSEED,D_VALCARDOVERD",
                days: "60"
            };
            await Vouchers.userVouchersList(data)
                .then(res => {
                    if (res.total > 0 && res.list.length > 0) {
                        res.list.forEach(item => {
                            item.wordBreak = false;
                        });
                        this.cardListHistory = res.list;
                    }
                })
                .then(() => {
                    this.loading = false;
                    // 列表渲染完后判断是否需要显示描述下拉History
                    let instructionsHistory = document.getElementsByClassName(
                        "instructionsHistory"
                    );
                    for (let i = 0; i < instructionsHistory.length; i++) {
                        this.instructionsHistoryOffsetWidth.push(
                            instructionsHistory[i].offsetWidth
                        );
                        this.instructionsHistoryScrollWidth.push(
                            instructionsHistory[i].scrollWidth
                        );
                    }
                });
        },
        loadMore() {
            if (this.finished === true) {
                Toast("没有更多了~");
                return;
            } else {
                this.pageNum += 1;
                this.getCardList();
            }
        },
        routeLink() {
            this.$router.push("/vouchers-list");
        },
        goShop(item) {
            if (
                new Date(item.couponTimeStart.replace(/-/g, "/")).getTime() <=
                new Date().getTime()
            ) {
                // 使用范围全部直接跳转
                if (item.terminalList.length === 0) {
                    this.$router.push("/goods-list");
                } else {
                    // 平台限制跳转
                    let goFlag = false;
                    // 获取店铺id
                    let shopId = Storage.get("properties").shopId;
                    // 判断优惠券是否在可用店铺区间
                    for (let i = 0; i < item.terminalList.length; i++) {
                        if (item.terminalList[i] === shopId) {
                            goFlag = true;
                        }
                    }
                    if (goFlag) {
                        this.$router.push("/goods-list");
                    } else {
                        Toast("当前店铺不可用此优惠券");
                    }
                }
            } else {
                Toast("抱歉，还未到该券的使用时间");
                return false;
            }
        },
        //  拉取微信卡券信息
        getWechatConfig(item) {
            if (item.expiringFlag === 0) {
                return;
            }
            let data = {
                card_id: item.weixinId, //卡券weixinId,
                code: item.cardCode,
                isNeedOpenid: 0,
                openId: Storage.get("WECHAT_INFO").openid,
                wxuuid:
                    baseConstant.wxUnionid ||
                    Storage.get("properties").wxUnionid
            };
            Vouchers.getWxconfig(data).then(res => {
                let url = window.location.href.split("#")[0];
                let wxData = {
                    wxUUID: baseConstant.wxUnionid,
                    unAuthorizedUrl: encodeURIComponent(url)
                };
                Order.getWxSignature(wxData).then(config => {
                    this.wxInit(config, item.weixinId, res);
                });
            });
        },
        //  微信加入卡券
        wxInit(config, cardId, cardConfig) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.appId, // 必填，公众号的唯一标识
                timestamp: config.timeStamp, // 必填，生成签名的时间戳
                nonceStr: config.nonceStr, // 必填，生成签名的随机串
                signature: config.signature, // 必填，签名
                jsApiList: ["addCard"] // 必填，需要使用的JS接口列表
            });
            wx.ready(function() {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.addCard({
                    cardList: [
                        {
                            cardId: cardId,
                            cardExt: JSON.stringify(cardConfig)
                        }
                    ], // 需要添加的卡券列表
                    success: function(res) {
                        Toast("添加成功~");
                        var cardList = res.cardList; // 添加的卡券列表信息
                    }
                });
            });
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
        // 获取未使用优惠券
        this.getCardList();
        // 获取历史优惠券
        this.getCardListHistory();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
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
.empty-content {
    width: 100%;
    height: calc(100vh - #{computed(150)});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: computed(30);
    color: #333333;
    line-height: 1;
}
</style>
