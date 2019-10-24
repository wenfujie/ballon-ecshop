/*
    * createTime：2018-06-26
    * author：en.chen
    * description: 绑定手机号
*/
<template>
    <div class="bind-wrapper">
        <!--<div class="close-btn" onclick="window.history.go(-1)">
            <i class="iconfont icon-guanbi"></i>
        </div>-->
        <div class="form-wrapper">
            <p class="form-text">手机号</p>
            <div class="form-box">
                <input type="tel" class="phone-text" v-model="phoneNum" maxlength="11" />
            </div>
            <p class="form-text">验证码</p>
            <div class="form-box">
                <input type="tel" class="captcha-text" v-model="captcha" maxlength="6" />
                <button
                    class="captcha-btn"
                    :class="[captchaLocked == true ? 'disabled' : '']"
                    @click="checkPhone"
                >{{captchaText}}</button>
            </div>
            <div class="bind-btn" @click="bindPhone">立即绑定</div>
        </div>
    </div>
</template>
<script>
import { Toast } from "vant";
import Storage from "../../util/storage";
import { UserService, Login, Vouchers } from "../../api/service";
import { userInfo } from "../../api/service/login";
export default {
    data() {
        return {
            phoneNum: "",
            captcha: "",
            captchaText: "获取验证码",
            captchaLocked: false,
            time: 60,
            ctmUsrKey: "",
            companyKey: "",
            cookieKey: "",
            checkStatus: false,
            btnLock: false
        };
    },
    methods: {
        //  校验手机号是否绑定
        checkPhone() {
            if (this.captchaLocked === true) {
                return;
            }
            var reg = /^1(((5[0-35-9][0-9])|(7([0678])[ 0-9])|([3489][0-9]{2}))[0-9]{7})$/; // 验证手机号的正则表达式
            if (!reg.test(this.phoneNum)) {
                Toast("请填写正确的手机号");
                return;
            } else {
                //  校验手机号是否绑定
                let data = {
                    ctmUsrId: Storage.get("USER_INFO").ctmUsrId,
                    mobile: this.phoneNum,
                    buscontsId: baseConstant.busContsCode
                };
                UserService.checkWxPhone(data).then(
                    res => {
                        this.checkStatus = true;
                        this.getcaptcha();
                    },
                    err => {
                        Toast(err.errorMsg);
                    }
                );

                //会员整合不验证手机号
                // this.checkStatus = true;
                // this.getcaptcha();
            }
        },
        // 获取验证码
        getcaptcha() {
            if (this.captchaLocked === true || this.checkStatus === false) {
                // 判断是否可以发送验证码
                return;
            }
            this.captchaLocked = true;
            let phone = this.phoneNum;
            let data = {
                mobile: phone,
                verifyClassCode: "VERIFY_BIND_MOBILE"
            };
            UserService.getCaptcha(data).then(res => {}, err => {});
            this.conutDown();
        },
        // 倒计时
        conutDown() {
            let that = this;
            that.captchaLocked = true;
            that.captchaText = "验证码已发送";
            let interval = window.setInterval(function() {
                that.captchaText = "重新获取" + that.time + "s";
                if (that.time-- <= 0) {
                    that.time = 60;
                    that.captchaLocked = false;
                    that.captchaText = "获取验证码";
                    window.clearInterval(interval);
                }
            }, 1000);
        },
        // 绑定手机号
        bindPhone() {
            if (this.btnLock === true) {
                return;
            }
            this.btnLock = true;
            var reg = /^1(((5[0-35-9][0-9])|([34879][0-9]{2}))[0-9]{7})$/;
            if (!reg.test(this.phoneNum)) {
                Toast("请填写正确的手机号");
                this.btnLock = false;
                return false;
            }
            if (this.checkStatus == false) {
                Toast("该手机号已经被绑定了~");
                this.btnLock = false;
                return false;
            }
            if (!this.captcha) {
                Toast("请先填写验证码");
                this.btnLock = false;
                return false;
            }
            let data = {
                usrId: Storage.get("USER_INFO").usrId,
                companyId: Storage.get("COMPANYID").company_id,
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyType: "D_VERIFYLOG",
                verifyClassCode: "VERIFY_BIND_MOBILE"
            };
            //  验证手机号和验证码
            UserService.checkCaptcha(data).then(
                () => {
                    // 绑定手机号
                    let bindData = {
                        mobile: this.phoneNum
                    };
                    UserService.bindMobile(bindData).then(
                        res => {
                            // 联合登录抽成公用
                            combineLogin().then(res => {
                                this.btnLock = false;
                                if (res) {
                                    this.$router.replace(
                                        this.$route.params.toUrl ||
                                            this.$route.query.toUrl ||
                                            "/index"
                                    );
                                }
                            });
                            // window.history.go(-1)
                        },
                        () => {
                            Toast("绑定出错了~");
                            this.btnLock = false;
                        }
                    );
                },
                err => {
                    Toast("手机验证码错误~");
                    this.btnLock = false;
                }
            );
        },

        // 绑定手机号后更新用户信息，调用联合登陆获取用户信息，再调用获取用户信息的接口存入本地缓存
        bindCallback() {
            console.log("callback");
            let WechatInfo = Storage.get("WECHAT_INFO");
            let userSex = "";
            if (WechatInfo.sex == 1) {
                userSex = "D_MALE";
            } else if (WechatInfo.sex == 2) {
                userSex = "D_FEMALE";
            }
            let loginData = {
                companyId: Storage.get("COMPANYID").company_id,
                shopId: Storage.get("properties").shopId,
                busContsCode: baseConstant.busContsCode,
                unionId: WechatInfo.unionid,
                openId: WechatInfo.openid,
                signUpTypeCode: baseConstant.signUpTypeCode,
                usrName: WechatInfo.nickname,
                url: WechatInfo.headimgurl,
                sex: userSex
            };
            Login.userInfo(loginData).then(
                res => {
                    this.btnLock = false;
                    let usrInfo = Storage.get("USER_INFO");
                    usrInfo = Object.assign(usrInfo, res);
                    Storage.set("USER_INFO", usrInfo);
                    Toast("绑定手机号成功~");

                    //  登陆送券（存在usrId且绑定过手机号的用户）
                    if (!!res.usrId && !!res.mobilePhone) {
                        Vouchers.sendCardCoupons({
                            usrId: res.usrId || "",
                            shopId: Storage.get("properties").shopId,
                            vipInfoHdId: res.vipInfoHdId || ""
                        });
                    }

                    this.$router.replace(this.$route.params.toUrl || "/index");
                },
                () => {
                    this.btnLock = false;
                }
            );
        }
    },
    created() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.bind-wrapper {
    width: 100%;
    overflow: hidden;
}
.close-btn {
    width: computed(38);
    height: computed(38);
    position: absolute;
    top: computed(30);
    right: computed(30);
    line-height: computed(38);
}
.close-btn i {
    color: #666666;
    font-size: computed(38);
}
.form-wrapper {
    margin-top: computed(129);
    margin: computed(129) computed(40) 0 computed(40);
}
.form-text {
    font-size: computed(28);
    line-height: computed(28);
    color: #0d0e09;
}
.form-box {
    box-sizing: border-box;
    width: 100%;
    height: computed(82);
    margin: computed(17) 0 computed(30) 0;
    padding: 0 computed(17);
    border: solid 1px #d6d6d6;
    overflow: hidden;
    position: relative;
}
.form-box input {
    border: none;
    font-size: computed(28);
    line-height: computed(80);
    color: #0d0e09;
}
.phone-text {
    width: 100%;
}
.captcha-text {
    display: block;
    width: computed(380);
    float: left;
}
.captcha-btn {
    box-sizing: border-box;
    display: block;
    float: right;
    position: relative;
    width: computed(220);
    height: computed(50);
    margin: 0;
    border: none;
    border-left: solid 1px #d6d6d6;
    background: transparent;
    font-size: computed(28);
    text-align: center;
    line-height: computed(50);
    top: computed(15);
    right: computed(-17);
    color: #0d0e09;
}
.captcha-btn.disabled {
    color: #999999;
}
.bind-btn {
    width: 100%;
    height: computed(100);
    margin-top: computed(100);
    background: #2ba4f3;
    font-size: computed(32);
    line-height: computed(100);
    color: #ffffff;
    text-align: center;
}
.tip {
    margin-top: computed(29);
    font-size: computed(24);
    line-height: 1;
    color: #999999;
    text-align: center;
}
</style>


