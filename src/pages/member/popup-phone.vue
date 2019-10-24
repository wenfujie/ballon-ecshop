
<template>
    <div class="popup-phone" ref="phoneBox">
        <div class="wrapper phone-box">
            <div class="titile" @click="close()">
                绑定手机号
                <i class="iconfont icon-guanbi popup-close"></i>
            </div>
            <!--  v-inputfix -->
            <div class="form-box">
                <input
                    type="tel"
                    placeholder="请输入手机号"
                    class="wd100"
                    v-model="phoneNum"
                    maxlength="11"
                    @input="phoneRule"
                    v-inputfix
                >
            </div>
            <div class="form-box">
                <input
                    type="tel"
                    class="captcha-text fl"
                    v-model="captcha"
                    placeholder="请输入验证码"
                    v-inputfix
                    maxlength="6"
                >
                <button
                    class="captcha-btn color-mian fr"
                    :class="[captchaLocked == true ? 'disabled' : '']"
                    @click="checkPhone"
                >{{captchaText}}</button>
            </div>
            <div class="bottom-btns" @click="bindPhone">立即绑定</div>
        </div>
    </div>
</template>
<script>
import { Toast, Popup } from 'vant'
import { UserService } from '../../api/service'
import Storage from '../../util/storage'
export default {
    props: {
        // 是否显示弹窗
        // showPopupFlag: {
        //     type: Boolean,
        //     default: false
        // },
        // showPopup: {
        //     type: Boolean,
        //     default: false
        // }
    },
    components: {
        'van-popup': Popup,
        // 'van-field':Field
    },
    data() {
        return {
            phoneNum: '',  // 绑定手机号
            captcha: '',  //验证码
            captchaText: '点击获取验证码',  // 文字提示
            captchaLocked: false,  // 获取验证码按钮锁
            isSendCaptcha: false, // 是否获取过验证码
            time: 60,  // 倒计时时间
            checkStatus: false,  // 手机号是否允许绑定状态
            btnLock: false,  //  绑定手机号按钮锁
        }
    },
    methods: {
        // 关闭绑定手机号弹框
        close() {
            this.$emit('bindPhoneCallback', false);
        },
        //  获取用户信息
        getUser() {
            let data = {}
            UserService.getUserInfo(data).then((res) => {
                this.userInfo = res
            })
        },
        //  保留正确手机号
        phoneRule() {
            this.phoneNum = this.phoneNum.replace(/\D/g, '')
        },
        //  校验手机号是否绑定
        checkPhone() {
            if (this.captchaLocked === true) {
                return
            }
            // 校验手机号正确性
            if (!isPhone(this.phoneNum)) {
                Toast('请填写正确的手机号')
                return
            } else {
                //  校验手机号是否绑定
                let data = {
                    ctmUsrId: Storage.get('USER_INFO').ctmUsrId,
                    mobile: this.phoneNum,
                    buscontsId: baseConstant.busContsCode
                }
                UserService.checkWxPhone(data).then((res)=>{
                    this.checkStatus = true
                    this.getCaptcha()
                }, (err)=>{
                    Toast(err.errorMsg)
                })

                // 会员整合不验证手机号
                // this.checkStatus = true;
                // this.getCaptcha();
            }
        },
        // 获取验证码
        getCaptcha() {
            if (this.captchaLocked === true || this.checkStatus === false) {
                // 判断是否可以发送验证码
                return
            }
            this.captchaLocked = true
            let phone = this.phoneNum
            let data = {
                mobile: phone,
                verifyClassCode: "VERIFY_BIND_MOBILE",
            }
            UserService.getCaptcha(data).then((res) => {
            }, (err) => { }).then(() => {
                this.isSendCaptcha = true
            })
            this.countDown()
        },
        // 倒计时
        countDown() {
            let that = this
            that.captchaLocked = true
            that.captchaText = '验证码已发送'
            let interval = window.setInterval(function () {
                that.captchaText = '重新获取' + that.time + 's'
                if ((that.time--) <= 0) {
                    that.time = 60
                    that.captchaLocked = false
                    that.captchaText = '点击获取验证码'
                    window.clearInterval(interval)
                }
            }, 1000)
        },
        // 绑定手机号
        bindPhone() {
            if (this.btnLock === true) {
                return false;
            }
            this.btnLock = true
            if (!isPhone(this.phoneNum)) {
                Toast('请填写正确的手机号')
                this.btnLock = false
                return false
            }
            if (!this.captcha) {
                Toast('请先填写验证码')
                this.btnLock = false
                return false
            }
            if (this.isSendCaptcha !== true) {
                Toast('请先获取验证码')
                this.btnLock = false
                return false
            }
            if (this.checkStatus === false) {
                Toast('该手机号已经被绑定了~')
                this.btnLock = false
                return false
            }
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                usrId: Storage.get("USER_INFO").usrId,
                companyId: Storage.get("USER_INFO").companyId,
                verifyType: "D_VERIFYLOG",
                // sourceCode: baseConstant.busContsCode,
                // cudDptId: Storage.get('USER_INFO').shopId,
                verifyClassCode: "VERIFY_BIND_MOBILE",
            }
            //  验证手机号和验证码
            UserService.checkCaptcha(data).then(() => {
                // 绑定手机号
                let bindData = {
                    mobile: this.phoneNum,
                    // buscontsId: baseConstant.busContsCode
                }
                UserService.bindMobile(bindData).then(() => {
                    // Toast('绑定手机号成功~')
                    // this.btnLock = false;
                    // // this.getUser();
                    // let userInfo = Storage.get('USER_INFO');
                    // userInfo.mobilePhone = this.phoneNum;
                    // Storage.set('USER_INFO', userInfo);

                    combineLogin().then(res=>{
                        this.btnLock = false;
                        if (res) {
                            this.$emit('bindPhoneCallback', true);
                        } else {
                            Toast('绑定手机号出错~');
                            this.$emit('bindPhoneCallback', false);
                        }
                    });
                }, () => {
                    Toast('绑定手机号出错~');
                    this.$emit('bindPhoneCallback', false);
                })
            }, (err) => {
                Toast('手机验证码错误')
            }).then(() => {
                this.btnLock = false
            })
        },
    },
    created() {
        // this.show = true;
        // 绑定手机成功后要跳转路由
        this.successUrl = this.$route.query.successUrl;
    },
    mounted() {
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
.wrapper {
    width: computed(650);
    margin: computed(35) computed(12);
    padding: computed(15);
    .titile {
        width: 100%;
        text-align: center;
        font-size: computed(36);
        color: rgba(13, 14, 9, 1);
        .popup-close {
            position: absolute;
            margin: computed(5) computed(193);
        }
    }
    .captcha-text {
        width: 63%;
    }
    .bottom-btns {
        width: 100%;
        height: computed(80);
        line-height: computed(80);
        background: $maincolor;
        border-radius: computed(44);
        margin-top: computed(61);
        text-align: center;
        color: #fff;
        font-size: computed(30);;
    }
}
/*  手机号绑定、更换页面  */
.phone-box {
    overflow: hidden;

    .form-box {
        box-sizing: border-box;
        width: 100%;
        height: computed(88);
        margin-top: computed(30);
    }

    .form-box input {
        user-select: text;
        -webkit-user-select: text;
        display: block;
        box-sizing: border-box;
        // height: computed(88);
        padding: computed(25) computed(30);
        background: #F6F6F6;
        font-size: computed(30);
        // line-height: computed(88);
        color: #0D0E09;
        border: none;
        /* 解决ios版微信浏览器的边框和阴影*/
        border-radius: 0;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        -webkit-appearance: none;
    }

    .captcha-btn {
        box-sizing: border-box;
        display: block;
        float: right;
        position: relative;
        margin: 0;
        border: none;
        background: transparent;
        text-align: center;
        font-size: computed(26);
        line-height: computed(88);
    }
}
    .wd100 {
        width: 100%;
    }
</style>
