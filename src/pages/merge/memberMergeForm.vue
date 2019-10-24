/*
* createTime：2019/6/20
* author：fujie.wen
* description: 会员整合弹窗中的表单
*/
<template>
    <div class="cont">
        <!--账号整合内容 begin-->
        <div v-show="currentPage === 'userList'">
            <p class="tip">经系统检测，以下账号同属于您，请您确认，</p>
            <p class="tip">确认后，系统会将您的部分信息整合在一起</p>

            <ul class="user-list">
                <li
                        v-for="(item,index) in memberList"
                        class="user-item"
                        :key="item.id"
                >{{item.mobilePhone | phoneMask}}（{{item.vipAccount}}）</li>
            </ul>

            <div class="sure-btn" @click="currentPage = 'checkNote'">去确认</div>
        </div>
        <!--账号整合内容 end-->

        <!--验证身份内容 begin-->
        <div v-show="currentPage === 'checkAccount' || currentPage === 'checkNote'">
            <p class="tip check-tip" v-if="activeMemberInfo">
                请输入账号{{activeMemberInfo.mobilePhone | phoneMask}}（{{activeMemberInfo.vipAccount}}）的
                {{currentPage === 'checkAccount' ? '账号及密码' : '完整手机号'}}
            </p>

            <!--验证码校验form begin-->
            <ul class="form-list" v-show="currentPage === 'checkNote'">
                <li class="form-item">
                    <p class="form-describe">请输入绑定的手机号</p>
                    <van-field v-inputfix v-model="form.phone"
                               type="number"
                               @input="changePhone('form.phone', 11)"
                               class="input-style"/>
                </li>
                <li class="form-item">
                    <p class="form-describe">请输入验证码</p>
                    <van-field v-inputfix v-model="form.noteCode"
                               type="number"
                               @input="changePhone('form.noteCode', 6)"
                               class="input-style"/>
                    <div :class="['phone-code', { 'is-send' : countDownCode > 0}]"
                         @click="getNoteCode">获取验证码{{countDownCode > 0 ? `(${countDownCode})` : ''}}</div>
                    <div class="other-check" @click="currentPage = 'checkAccount'">其他验证方式</div>
                </li>
            </ul>
            <!--验证码校验form end-->

            <!--账号密码校验form begin-->
            <ul class="form-list" v-show="currentPage === 'checkAccount'">
                <li class="form-item">
                    <p class="form-describe">请输入手机号/用户名</p>
                    <van-field v-inputfix v-model="form.phoneOrName" class="input-style"/>
                </li>
                <li class="form-item">
                    <p class="form-describe">请输入登录密码</p>
                    <van-field v-inputfix v-model="form.password" type="password" class="input-style"/>
                    <div class="other-check" @click="currentPage = 'checkNote'">其他验证方式</div>
                </li>
            </ul>
            <!--账号密码校验form end-->

            <div class="flex-box footer-group-btn">
                <div class="second-btn" @click="memberMergeOperator(1)">此账号不是我的</div>
                <div class="main-btn"
                     @click="memberMergeOperator(currentPage === 'checkNote'?2:3)">确定</div>
            </div>
        </div>
        <!--验证身份内容 end-->
    </div>
</template>

<script>
    import { UserService } from "@/api/service";
    import Storage from "../../util/storage";
    import { Field, Toast } from 'vant';
    import MemberMergeMixins from './mixins/MemberMergeMixins'
    import md5 from "../../util/md5";

    export default {
        components: { 'van-field': Field },
        mixins: [ MemberMergeMixins ],
        props: {

        },
        computed: {
            // 当前操作用户信息
            activeMemberInfo() {
                return this.memberList && this.memberList.length > 0
                        ? this.memberList[0]
                        : null;
            }
        },
        data() {
            return {
                currentPage: "userList", // 当前页（'userList':用户列表；'checkAccount':校验账户；'checkNote':校验短信；）
                form: {
                    phoneOrName: "", //手机或用户名（密码登录）
                    phone: "", //手机号（验证码登录）
                    password: "", //密码
                    noteCode: "" //短息验证码
                },
                countDownCode: 0, // 验证码倒计时
                memberList: [], //会员列表
            };
        },
        methods: {
            // 手机号change事件
            changePhone(key,limitLong){
                let keyArr = key.split('.');
                if(keyArr.length === 1){
                    if(this[keyArr[0]] && this[keyArr[0]].length > limitLong){
                        this[keyArr[0]] = this[keyArr[0]].substring(0,limitLong);
                    }
                }else{
                    // 长度为2 （不考虑超过2的情况）
                    if(this[keyArr[0]][keyArr[1]] && this[keyArr[0]][keyArr[1]].length > limitLong){
                        this[keyArr[0]][keyArr[1]] = this[keyArr[0]][keyArr[1]].substring(0,limitLong);
                    }
                }
            },
            // 获取短信验证码
            getNoteCode() {
                if (this.countDownCode > 0) return;

                if(isPhone(this.form.phone) && this.activeMemberInfo.mobilePhone === this.form.phone){
                    let data = {
                        mobile: this.form.phone,
                        verifyClassCode: 'VERIFY_VIP_TER',
                    }
                    UserService.getCaptcha(data).then((res) => {
                        if (res == '03' || res == 'OK') {
                            this.countDownCode = 60;
                            this.countDown = setInterval(() => {
                                if (this.countDownCode <= 0) {
                                    clearInterval(this.countDown);
                                }
                                this.countDownCode--;
                            }, 1000);
                        } else {
                            Toast('短信发送失败')
                        }
                    }, (err) => {
                    })
                }else{
                    Toast('请输入正确的手机号');
                }
            },
            // 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
            memberMergeOperator(flag){
                let data = {
                            //                    todo
                        vipInfoHdId: Storage.get('USER_INFO').vipInfoId,
//                            vipInfoHdId: 625 || Storage.get('USER_INFO').vipInfoId,
                            confirmFlag: flag,
                        },
                        ownData = {},// 各个操作独立参数
                        checkState = false;// 表单校验是否通过

                switch (flag) {
                    case 0: // 不整合
                        let ids = this.memberList.map(item => item.id);
                        ownData = {
                            ids: ids
                        };
                        break;

                    case 1: // 此账号不是我的
                        ownData = {
                            relId: this.activeMemberInfo.id,
                            relVipInfoHdId: this.activeMemberInfo.vipInfoHdId
                        };
                        break;

                    case 2: // 验证码确认
                        if(isPhone(this.form.phone) && this.activeMemberInfo.mobilePhone === this.form.phone){
                            if(!this.form.noteCode){
                                Toast('请输入验证码');
                                return;
                            }
                            ownData = {
                                relId: this.activeMemberInfo.id,
                                relVipInfoHdId: this.activeMemberInfo.vipInfoHdId,
                                account: this.form.phone,
                                verifyClassCode: "VERIFY_VIP_TER",
                                verifyCode: this.form.noteCode
                            };
                        }else{
                            Toast('请输入正确的手机号');
                            return;
                        }
                        break;

                    case 3:// 账号密码确认
                            console.log()
                        if(this.form.phoneOrName && this.form.password.length >= 6){
                            ownData = {
                                relId: this.activeMemberInfo.id,
                                relVipInfoHdId: this.activeMemberInfo.vipInfoHdId,
                                account: this.form.phoneOrName,
                                verifyCode: md5(this.form.password),
                            }
                        }else{
                            Toast('账号密码校验失败！');
                            return;
                        }
                        break;
                }
                Object.assign(data, ownData);
                UserService.memberMergeOperator(data).then(async (res)=>{
                    if(res != 1){
                        Toast('操作失败');
                        return;
                    }
                    // 确认整合完后操作
                    let successCallback = ()=>{
                        // 仅在操作最后一条数据时提示
                        if(this.memberList.length == 1){
                            Toast("账号验证成功！");
                        }
                    }
                    switch (flag) {
                        case 0: // 不整合
                            break;
                        case 1: // 此账号不是我的
                            if (res === 1) {
                                // 仅在操作最后一条数据时提示
                                if(this.memberList.length == 1){
                                    Toast("已无可整合的账号");
                                }
                            }
                            break;
                        case 2: // 验证码确认
                            this.countDownCode = 0;
                            successCallback();
                            break;
                        case 3: // 账号密码确认
                            successCallback();
                            break;
                    }

                    this.memberList = await this.m_getMemberList(this.useParent === 'dialog' ? 1 : 0);

                    // 完成一次操作后处理
                    if(this.memberList && this.memberList.length){
                        this.form = {
                            phoneOrName: '',//手机或用户名（密码登录）
                            phone: '',//手机号（验证码登录）
                            password: '',//密码
                            noteCode: '',//短息验证码
                        };
                        this.countDownCode = 0;
                    }else{
                        this.$router.go(-1);
                    }
                }, err=>{
                    Toast(err.errorMsg);
                })
            },
        },
        watch:{
            currentPage:{
                immediate: true,
                handler(value){
                    let title = '';
                    switch (value){
                        case 'userList':
                            title = '账号整合';
                            break;
                        case 'checkAccount':
                            title = '验证身份';
//                            this.$refs.rulesPsdLogin.clearValidate();
                            break;
                        case 'checkNote':
                            title = '验证身份';
//                            this.$refs.rulesCodeLogin.clearValidate();
                            break;
                    }
                    document.title = title;
                    this.$emit('changePage',{pageCode: value, pageTitle: title});
                }
            },
            memberList: {
                deep:true,
                immediate: true,
                handler(list){
                    updateRelationAccountLength();
                    this.$emit('changeList',list);
                }
            }
        },
        async created() {
            // 前一个页面类型： 'dialog'（弹窗）； 不传 （其他）
            this.useParent = this.$route.query.useParent;
            // 设置当前页面内容
            this.currentPage = this.useParent === 'dialog' ? 'checkNote' : 'userList';

            this.memberList = await this.m_getMemberList(this.useParent === 'dialog' ? 1 : 0);
        }
    }
</script>

<style scoped lang="scss">
    .cont{
        padding: computed(40) computed(30);
        box-sizing: border-box;
    }
    .tip{
        line-height: 25px;
        font-size: computed(32);
        color: $maincolor;
        &.check-tip{
            color: #333;
        }
    }
    .user-list{
        padding: computed(25) 0 computed(60) 0;
        .user-item{
            line-height: computed(56);
            color: $blackcolor;
            font-size: computed(28);

        }
    }

    .sure-btn{
        line-height: computed(100);
        text-align: center;
        color: #fff;
        background: $maincolor;
        font-size: computed(32);
    }

    .form-list{
    }
    .form-item {
        padding-top: computed(25);
        position: relative;
        .form-describe{
            font-size: computed(28);
            color: #666;
            line-height: computed(55);
        }
        .input-style{
            border: computed(1) solid #D6D6D6;
        }
        .phone-code{
            position: absolute;
            right: computed(2);
            bottom: computed(2);
            height: computed(77);
            line-height: computed(77);
            width: computed(178);
            z-index: 100;
            background: #fff;
            text-align: center;
            color: $blackcolor;
            font-size: computed(24);
            border-left:computed(1) solid #D6D6D6;
            &.is-send{
                color: #D6D6D6;
                width: computed(250);
            }
        }
        .other-check{
            position: absolute;
            right: computed(0);
            bottom: 0;
            margin-bottom: computed(-37);
            line-height: computed(20);
            font-size: computed(24);
            color: $maincolor;
        }
    }
    .footer-group-btn{
        position: fixed;
        bottom:0;
        left: 0;
        width: 100%;
        .second-btn,
        .main-btn{
            flex:1;
            text-align: center;
            line-height: computed(100);
            color: #fff;
            background: $maincolor;
            font-size: computed(32);
        }
        .second-btn{
            background: #808080;
        }
    }
</style>
