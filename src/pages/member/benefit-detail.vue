<!--
 * @Author: en.chen
 * @Date: 2018-8-03 17:46:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-22 14:56:33
 * @Description: 
 -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.benefit {
    overflow: hidden;
    min-height: 100%;
    // height: 100%;
    background: #f1f1f1;
    .card {
        display: flex;
        margin: computed(30);
        height: computed(202);
        -webkit-border-radius: computed(16);
        -moz-border-radius: computed(16);
        border-radius: computed(16);
        background: #bcba78;
        justify-content: center;
        align-items: center;
        position: relative;
        font-size: computed(40);
        line-height: computed(42);
        color: #ffffff;
        .isNowMember {
            font-size: computed(24);
            position: absolute;
            margin: computed(-55) 0 0 computed(-270);
        }
        .member-name {
            margin: computed(15) 0 0 computed(5);
            // width: computed(200);
            text-align: center;
            p:nth-of-type(1) {
                font-size: computed(40);
                font-weight: bold;
                line-height: computed(48);
            }
            p:nth-of-type(2) {
                font-size: computed(24);
            }
        }
        .add-wechat-btn {
            font-size: computed(28);
            line-height: computed(34);
            text-decoration: underline;
            position: absolute;
            bottom: computed(20);
            right: computed(20);
        }
    }
    .tip {
        position: relative;
        padding: computed(16) computed(30);
        font-size: computed(28);
        line-height: computed(30);
        border-bottom: solid computed(1) #dbdbdb;
        color: #999999;
        .benefit-icon {
            display: inline-block;
            width: computed(24);
            height: computed(24);
            background: url("../../assets/images/member/benefit.png") no-repeat
                center;
            -webkit-background-size: 100%;
            background-size: 100%;
        }
        .right-arrow {
            position: absolute;
            height: computed(26);
            font-size: computed(26);
            line-height: computed(26);
            right: computed(30);
            top: computed(18);
            color: #0d0e09;
        }
    }
    .panel-wrapper {
        position: relative;
        width: computed(630);
        margin: 0 0 computed(30) computed(30);
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        overflow: auto;
        font-size: computed(28);
        line-height: computed(30);
        color: #0d0e09;
        padding: computed(30);

        .panel-flex {
            label {
                width: computed(160);
                font-weight: bold;
                font-size: computed(32);
            }
            .benefit-list {
                margin: computed(15) 0 computed(20) 0;
                .content {
                    margin: computed(16) 0 computed(35) 0;
                    word-break: break-all;
                    font-size: computed(28);
                    line-height: computed(50);
                }
            }
            .time {
                font-size: computed(28);
                margin-top: computed(15);
            }
            .right-arrow {
                position: absolute;
                height: computed(26);
                font-size: computed(26);
                line-height: computed(26);
                right: computed(30);
                top: computed(30);
            }
        }
    }
}
</style>
<template>
    <div class="benefit">
        <div
            class="card"
            :style="{background:'url('+getImg(this.$route.params.vipCardImage, '690*202') +') no-repeat center','background-size': '100% 100%'}"
        >
            <p
                v-if="StorageVipId==this.$route.params.vipInfoHdId&&status>0"
                class="isNowMember"
            >当前账号</p>
            <p
                v-if="StorageVipId!=this.$route.params.vipInfoHdId&&status>0"
                class="isNowMember"
            >其他账号</p>
            <div class="member-name">
                <p>{{this.$route.params.vipLevelName}}</p>
                <p>{{this.$route.params.vipMobilePhone}}</p>
            </div>
            <!-- <span class="add-wechat-btn" v-if="benefit.isSynctowx === 0 && benefit.toWxCardFlag !== 0 && benefit.wxId !== null" @click="getWechatConfig()">加入微信卡包</span> -->
        </div>
        <div class="panel-wrapper">
            <div class="panel-flex">
                <label>专属特权：</label>
                <br />
                <ul class="benefit-list">
                    <div
                        class="content"
                        v-if="this.$route.params.lable==null||this.$route.params.lable==''"
                    >暂无说明</div>
                    <div class="content" v-html="this.$route.params.lable" v-else></div>
                </ul>
            </div>
            <div class="panel-flex">
                <label>有效时间：</label>
                <br />
                <p
                    class="time"
                    v-if="new Date(this.$route.params.expireDate).getTime() - new Date('2099-12-31 00:00:00').getTime()>=0"
                >长期有效</p>
                <p v-else class="time">至{{this.$route.params.expireDate}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import Storage from "../../util/storage";
import { UserService, Vouchers, Order } from "../../api/service";
import wx from "weixin-js-sdk";
export default {
    data() {
        return {
            benefit: {},
            cardBenefit: [],
            StorageVipId: "",
            vipId: "",
            status: "" //判断当前是否又会员整合
        };
    },
    methods: {
        //  跳转会籍会员卡列表页面
        goCardList() {
            this.$router.push("/member-card-list");
        },

        //  拉取微信卡券信息
        getWechatConfig() {
            if (this.benefit.expiringFlag === 0) {
                return;
            }
            let data = {
                card_id: this.benefit.wxId, //卡券weixinId,
                code: this.benefit.cardNo,
                isNeedOpenid: 0,
                openId: Storage.get("WECHAT_INFO").openid,
                wxuuid:
                    baseConstant.wxUnionid ||
                    Storage.get("properties").wxUnionid
            };
            Vouchers.getWxconfig(data).then(res => {
                let url = window.location.href.split("#")[0];
                let wxData = {
                    wxUUID:
                        baseConstant.wxUnionid ||
                        Storage.get("properties").wxUnionid,
                    unAuthorizedUrl: encodeURIComponent(url)
                };
                Order.getWxSignature(wxData).then(config => {
                    this.wxInit(config, this.benefit.wxId, res);
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
    created() {
        // 获取用户vip信息，用于判断是否是当前账户还是其他账户
        this.StorageVipId = Storage.get("USER_INFO").vipInfoId;
        this.status = Storage.get("USER_INFO").relationAccountLength; //获取会员整合的长度
    }
};
</script>
