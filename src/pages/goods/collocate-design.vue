<template>
    <div class="collocate-design">
        <iframe :src="iframeUrl" id="collocate"></iframe>
        <van-popup v-model="showPopup">
            <phone-popup @bindPhoneCallback="bindPhoneCallback"></phone-popup>
        </van-popup>
    </div>
</template>

<script>
    import axios from 'axios'
    import { Popup, Toast } from "vant";
    import { Login } from "../../api/service";
    import phonePopup from '../member/popup-phone'
    export default {
        name: 'collocate-design',
        components: {
            'van-popup': Popup,
            phonePopup
        },
        data() {
            return {
                iframeUrl: null,
                showPopup: false,
                operate: null,
                code: null
            }
        },
        async created() {
            // 动态更新标题
            document.title = '单品搭配 ' + this.$route.query.goodsName;

            // 获取单点登录code
            await Login.getSingleCode().then((res) => {
                this.code = res;
            });

            this.iframeUrl = window.location.origin
                + '/dp/mobile/singleCollocate?flag=1'
                + '&code=' + this.code
                + '&companyCode=' + this.$route.query.companyCode
                + '&shopCode=' + this.$route.query.shopCode
                + '&usrId=' + this.$route.query.usrId
                + '&vipInfoHdId=' + this.$route.query.vipInfoHdId
                + '&partCode=' + this.$route.query.partCode
                + '&partName=' + this.$route.query.goodsName
                + '&busContsCode=' + this.$route.query.busContsCode
                + '&showFlag=1'
                + '&theme=ballon-ecshop&collocateCodeArr=[1,2]';


            // 页面初始化时注册消息事件监听，对来自 iframe 框架页面的消息进行监听处理
            window.addEventListener('message', (event => {
                // 是否绑定手机号
                if (event.data.isBindPhone) {
                    // 开启绑定手机号弹窗
                    this.showPopup = true;
                }
                // 储存操作码
                this.operate = event.data.operate;
                console.log("收到" + event.origin + "消息", event.data)
            }), false);
        },
        methods: {
            // 手机号绑定事件回调
            bindPhoneCallback(status) {
                if (!status) {
                    this.showPopup = false;
                } else {
                    this.showPopup = false;
                    // 回传绑定成功信息给搭配组件页面
                    document.getElementById('collocate').contentWindow.postMessage({
                        isBindPhone: true,
                        operate: this.operate
                    }, this.iframeUrl);
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .collocate-design {
        width: 100%;
        height: 100%;
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
</style>
