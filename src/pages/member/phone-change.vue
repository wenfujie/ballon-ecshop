/*
* createTime：2018-06-26
* author：en.chen
* description: 更换手机号
*/
<template>
    <div class="bind-wrapper">
        <div class="close-btn" onclick="window.history.go(-1)">
            <i class="iconfont icon-guanbi"></i>
        </div>
        <div class="form-wrapper" v-if="step==1">
            <p class="form-text">原手机号</p>
            <div class="form-box">
                <input
                    placeholder="请输入原手机号"
                    type="tel"
                    class="phone-text"
                    v-model="phoneNum"
                    maxlength="11"
                >
            </div>
            <p class="form-text">验证码</p>
            <div class="form-box">
                <input
                    placeholder="请输入短信验证码"
                    type="tel"
                    class="captcha-text"
                    v-model="captcha"
                    maxlength="6"
                >
                <button
                    class="captcha-btn"
                    :class="[captchaLocked == true ? 'disabled' : '']"
                    @click="checkPhone"
                >{{captchaText}}</button>
            </div>
            <div class="bind-btn" @click="nextStep()">下一步</div>
        </div>
        <div class="form-wrapper" v-if="step==2">
            <p class="form-text">新手机号</p>
            <div class="form-box">
                <input
                    placeholder="请输入新手机号"
                    type="tel"
                    class="phone-text"
                    v-model="phoneNum"
                    maxlength="11"
                >
            </div>
            <p class="form-text">验证码</p>
            <div class="form-box">
                <input
                    placeholder="请输入验证码"
                    type="tel"
                    class="captcha-text"
                    v-model="captcha"
                    maxlength="6"
                >
                <button
                    class="captcha-btn"
                    :class="[captchaLocked == true ? 'disabled' : '']"
                    @click="checkPhone"
                >{{captchaText}}</button>
            </div>
            <div class="bind-btn" @click="bindNewPhone">确定</div>
        </div>
    </div>
</template>
<script>
import { Toast, Popup } from "vant";
import Storage from "../../util/storage";
import { UserService } from "../../api/service";

export default {
    components: {
        "van-popup": Popup
    },
    data() {
        return {
            phoneNum: "",
            captcha: "",
            countDownData: undefined,
            captchaText: "获取验证码",
            captchaLocked: false,
            time: 60,
            ctmUsrKey: "",
            companyKey: "",
            cookieKey: "",
            step: 1,  //1为原手机号码验证，2为新手机号码验证
            oldPhone: "",
            newPhone: "",
            btnLock: "",
            userInfo: {}
        };
    },
    methods: {
        //  获取用户信息
        getUser() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.userInfo = res;
            });
        },
        // 发送验证码前的手机号判断
        checkPhone() {
            if (this.captchaLocked === true) {
                // 判断是否可以发送验证码
                return;
            }
            if (this.step === 1) {
                if (this.phoneNum !== this.userInfo.mobilePhone) {
                    Toast("该手机号不是原手机号~");
                    return;
                }
                this.getcaptcha()
            }else{
                //验证新手机号码是否已存在
                let data = {
                    id: Storage.get('USER_INFO').usrId,
                    mobile: this.phoneNum,
                    ownCompanyId: Storage.get("COMPANYID").company_id
                }
                UserService.checkPhone(data).then((res)=>{
                    this.getcaptcha()
                }, (err)=>{
                    Toast(err.errorMsg)
                })
            }
        },
        //发送验证码
        getcaptcha(){
            var reg = /^1(((5[0-35-9][0-9])|(7([0678])[ 0-9])|([3489][0-9]{2}))[0-9]{7})$/; // 验证手机号的正则表达式
            const phone = this.phoneNum;
            if (!reg.test(phone)) {
                Toast("请填写正确的手机号");
                return;
            }
            let data = {
                id: Storage.get("USER_INFO").usrId,
                mobile: phone,
                verifyClassCode: "VERIFY_CHANGE_MOBILE"
            };
            UserService.getCaptcha(data).then(res => {}, err => {});
            this.conutDown();
        },
        // 倒计时
        conutDown() {
            let that = this;
            this.captchaLocked = true;
            this.captchaText = "验证码已发送";
            this.countDownData = window.setInterval(function() {
                that.captchaText = "重新获取" + that.time + "s";
                if (that.time-- <= 0) {
                    that.time = 60;
                    that.captchaLocked = false;
                    that.captchaText = "获取验证码";
                    window.clearInterval(that.countDownData);
                }
            }, 1000);
        },
        // 校验信息后进行新手机号绑定
        nextStep() {
            console.log("??");
            if (!this.phoneNum) {
                Toast("请先输入手机号~");
                return;
            }
            if (!this.captcha) {
                Toast("请先输入验证码~");
                return;
            }
            if (this.phoneNum !== this.userInfo.mobilePhone) {
                Toast("该手机号不是原手机号~");
                return;
            }
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyClassCode: "VERIFY_CHANGE_MOBILE"
            };
            UserService.checkCaptcha(data).then(
                res => {
                    this.oldPhone = this.phoneNum;
                    this.phoneNum = "";
                    this.captcha = "";
                    window.clearInterval(this.countDownData);
                    this.captchaText = "获取验证码";
                    this.captchaLocked = false;
                    this.time = 60;
                    this.step = 2;
                },
                err => {
                    Toast("验证码错误，请重新输入！");
                }
            );
        },
        // 绑定新电话
        bindNewPhone() {
            if (this.btnLock === true) {
                return;
            }
            this.btnLock = true;
            let reg = /^1(((5[0-35-9][0-9])|(7([0678])[ 0-9])|([3489][0-9]{2}))[0-9]{7})$/; // 验证手机号的正则表达式
            if (!reg.test(this.phoneNum)) {
                Toast("请先输入正确的手机号");
                this.btnLock = false;
                return;
            }
            if (!this.captcha) {
                Toast("请先输入验证码");
                this.btnLock = false;
                return;
            }

            //  验证手机验证码
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyClassCode: "VERIFY_CHANGE_MOBILE"
            };
            UserService.checkCaptcha(data)
                .then(
                    res => {
                        //  更换新手机号
                        let changeData = {
                            newMobile: this.phoneNum,
                            oldMobile: this.oldPhone
                        };
                        UserService.changePhone(changeData)
                            .then(
                                res => {
                                    if (!res.errorCode) {
                                        Toast("更换绑定成功~");
                                        let userInfo = Storage.get("USER_INFO");
                                        userInfo.mobilePhone = this.phoneNum;
                                        Storage.set("USER_INFO", userInfo); // 更新缓存中的手机号
                                        window.history.go(-1);
                                    } else {
                                        Toast(res.errorMsg);
                                    }
                                },
                                err => {
                                    Toast(err.errorMsg);
                                }
                            )
                            .then(() => {
                                this.btnLock = false;
                            });
                    },
                    err => {
                        Toast("验证码错误，请重新输入~");
                        this.btnLock = false;
                        return;
                    }
                )
                .then(() => {
                    this.btnLock = false;
                });
        }
    },
    created() {
        this.getUser();
    }
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


