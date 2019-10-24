<template>
    <div class="iframe-web-design">
        <div class="loading" v-show="showLoading">
            <div class="load-text">
                <van-loading type="spinner" size="48px" vertical></van-loading>
                <p>加载中...</p>
            </div>
        </div>
        <!--<div v-show="isShelves" class="shelves">该商品未上架~</div>-->
        <iframe class="design-iframe" id="iframePage" :src="url"></iframe>

        <van-popup v-model="showPopup">
            <phone-popup @bindPhoneCallback="bindPhoneCallback"></phone-popup>
        </van-popup>
    </div>
</template>
<script>
import Storage from "../../util/storage";
import { Goods, UserService } from "../../api/service";
import { Loading, Popup, Toast } from "vant";
import phonePopup from "../member/popup-phone";
export default {
    name: "web-design",
    data() {
        return {
            isShelves: false,
            goodsCode: "",
            url: "",
            showLoading: true,
            operate: null,
            showPopup: false,
            showMessage: "",
            rtlDesignHdId: "",
            spGoodsDtDesignId: ""
        };
    },
    components: {
        "van-loading": Loading,
        "van-popup": Popup,
        phonePopup
    },
    methods: {
        addEventMessage() {
            window.addEventListener(
                "message",
                event => {
                    if (!event.data.isShowLoading) {
                        this.showLoading = false;
                    }
                },
                false
            );
        },
        postMessage(isBindPhone, operate) {
            let iframePage = document.getElementById("iframePage");
            iframePage.contentWindow.postMessage(
                {
                    isBindPhone: isBindPhone,
                    operate: operate
                },
                this.url
            );
        },
        // 手机号绑定事件回调
        bindPhoneCallback(status) {
            if (!status) {
                this.showPopup = false;
            } else {
                this.showPopup = false;
                // 发送信息给子页面
                this.postMessage(true, this.operate);
            }
        },
        //浏览记录
        saveHistory() {
            let data = {
                usrId: Storage.get("USER_INFO")
                    ? Storage.get("USER_INFO").usrId
                    : 0, // 用户未登录传0
                busContsCode: baseConstant.busContsCode,
                goodsCode: this.$route.query.goodsCode || "",
                shopId: Storage.get("properties").shopId
            };
            Goods.getGoodsInfo(data).then(res => {
                this.goodsInfo = res;
                let params = {
                    usrId: Storage.get("USER_INFO").usrId,
                    busContsCode: baseConstant.busContsCode,
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    dptId: Storage.get("properties").shopId,
                    salePrice: res.salePrice,
                    tagPrice: res.tagPrice,
                    ptiPartHdId: res.ptiPartHdId
                };
                UserService.saveFootprint(params).then(res => {}, err => {});
            });
        }
    },
    created() {
        // 定制设计id（用于还原设计）
        this.rtlDesignHdId = this.$route.query.rtlDesignHdId;
        this.spGoodsDtDesignId = this.$route.query.spGoodsDtDesignId;
        this.$nextTick(() => {
            let companyId = Storage.get("COMPANYID").company_id;
            let usrInfo = JSON.stringify(Storage.get("USER_INFO"));
            if (!!usrInfo) {
                this.saveHistory();
            }
            // let iframeUrl = 'http://localhost:8080/#/'
            let iframeUrl = window.location.origin + "/standard/#/";
            let templateInfo = Storage.get("TEMPLATE_INFO");
            let goodsCode = this.$route.query.goodsCode || "";
            let callback = goodsCode => {
                let params = {
                    ownCompanyId: companyId,
                    goodsCode: goodsCode,
                    buscontsCode: baseConstant.busContsCode
                };
                Goods.isShelves(params).then(res => {
                    if (res) {
                        let goodsId = res.ptiPartHdId;
                        // 设置标题
                        if (res.goodsName) {
                            document.title = res.goodsName;
                        }
                        this.addEventMessage();
                        this.url =
                            iframeUrl +
                            "newWebDesign?companyId=" +
                            companyId +
                            "&busContsCode=" +
                            baseConstant.busContsCode +
                            "&goodsCode=" +
                            goodsCode +
                            "&goodsId=" +
                            goodsId +
                            "&goodsName=" +
                            res.goodsName +
                            "&userInfo=" +
                            usrInfo;
                        window.addEventListener(
                            "message",
                            event => {
                                // 绑定手机号
                                if (event.data.isBindPhone) {
                                    this.showPopup = true;
                                }
                                // 联合登录
                                // if (event.data.isLogin) {
                                //     Toast('您还未登录，请先登录');
                                //     let path = this.$route.path + '?goodsCode=' + this.$route.query.goodsCode;
                                //     Storage.set("redirectPath", {"path": path});
                                //     // 跳转至login页
                                //     this.$router.push({
                                //         path: '/login'
                                //     });
                                // }
                                this.operate = event.data.operate;
                                // console.log("收到" + event.origin + "消息", event.data)
                            },
                            false
                        );
                        if (this.rtlDesignHdId) {
                            this.url += "&rtlDesignHdId=" + this.rtlDesignHdId;
                        }
                        if (this.spGoodsDtDesignId) {
                            this.url +=
                                "&spGoodsDtDesignId=" + this.spGoodsDtDesignId;
                        }
                    }

                    // 未导入微信平台和全平台跳转至商品未上架页面
                    if (!res) {
                        this.$router.push({
                            path: "/off-shelves",
                            query: {
                                page: "web-design"
                            }
                        });
                    }
                });
            };
            callback(goodsCode);
        });
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.iframe-web-design {
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    .design-iframe {
        display: block;
        margin: 0 auto;
        width: 100%;
        height: 100%;
        border: none;
    }
    .loading {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
        .load-text {
            width: 70px;
            height: 80px;
            // text-align: center;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            p {
                color: #969799;
                font-size: 16px;
            }
        }
    }
}
</style>
