
<template>
    <div class="member-information">
        <!-- <div class="title">个人信息</div> -->
        <!--头像-->
        <div class="van-cell user-img-cell">
            <div class="van-cell__title">头像</div>
            <!--<div class="user-img">-->
            <!--<img :src="userInfo.photoThumb | imageFilter" onerror="errImg(event)" alt />-->
            <!--</div>-->
            <van-uploader
                class="user-img"
                :before-read="beforeRead"
                multiple
                :after-read="afterRead"
            >
                <div class="user-img">
                    <img :src="userInfo.photoThumb | imageFilter" onerror="errImg(event)" alt />
                </div>
            </van-uploader>
            <i class="iconfont icon-youfan"></i>
        </div>
        <!--姓名-->
        <!-- icon="close" -->
        <van-field
            v-model="username"
            label="姓名"
            placeholder="请输入昵称"
            max
            @click-icon="username = ''"
            required
        />
        <!--性别-->
        <van-field
            v-model="usersex"
            label="性别"
            placeholder="请选择性别"
            readonly
            @focus="onShowpicker('sexPickerShow')"
            icon="arrow"
            required
        />
        <!--手机号-->
        <van-field v-model="userphone" label="手机号" placeholder="请输入手机号" disabled required>
            <a slot="button" @click="changePhone()">更换手机号</a>
        </van-field>
        <!--邮箱-->
        <van-field
            v-model="userEmail"
            label="电子邮箱"
            placeholder="请输入电子邮箱"
            @click-icon="userEmail = ''"
        />
        <!--生日-->
        <van-field
            v-model="userbirthday"
            label="生日"
            placeholder="请选择出生日期"
            readonly
            arrow
            icon="arrow"
            @focus="onShowpicker('birthdayPickerShow')"
        />

        <!--身体数据-->
        <!--<div class="title" v-if="memberInfo.length > 0">身体数据</div>-->
        <!--会员属性-->
        <!--<div class="van-cell van-hairline van-field" v-for="item in memberInfo" :key="">-->
        <!--<div class="van-cell__title">-->
        <!--&lt;!&ndash;星号&ndash;&gt;-->
        <!--<span class="van-cell&#45;&#45;required" v-if="item.mustFlag === 1"></span>-->
        <!--<span>{{item.customName}}</span>-->
        <!--</div>-->
        <!--&lt;!&ndash;<div class="van-cell__value" v-if="item.selectClassCode === 'D_DOWNBOX' " @click="showPopup(item)">&ndash;&gt;-->
        <!--&lt;!&ndash;<input :placeholder="item.customName" class="van-field__control" v-model="item.customValue" readonly="readonly">&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--&lt;!&ndash;下拉框模式、展开列表模式&ndash;&gt;-->
        <!--<div class="van-cell__value radius">-->
        <!--&lt;!&ndash;<div class="van-cell__value radius" v-if="item.selectClassCode === 'D_ALISTOF' ">&ndash;&gt;-->
        <!--<van-radio-group v-model="item.customValue" class="clearfix" v-if="item.unfontClassCode === 'D_THERADIO'">-->
        <!--<van-radio v-for="(val,index) in item.choiceValues" :name="val.valueCode" :key="index">-->
        <!--<img v-if="val.pictFileUrl !== null" :src="val.pictFileUrl | imageFilter">-->
        <!--<span class="min-width">{{val.valueName}}</span>-->
        <!--</van-radio>-->
        <!--</van-radio-group>-->
        <!--<van-checkbox-group v-model="item.customValueArr" v-if="item.unfontClassCode === 'D_MULTISELECT'">-->
        <!--<van-checkbox class="van-radio" v-for="(val,index) in item.choiceValues" :name="val.valueCode" :key="index" @change="toggle(index)">-->
        <!--<img v-if="val.pictFileUrl !== null" :src="val.pictFileUrl | imageFilter">-->
        <!--<span>{{val.valueName}}</span>-->
        <!--</van-checkbox>-->
        <!--</van-checkbox-group>-->
        <!--</div>-->

        <!--&lt;!&ndash;文本框&ndash;&gt;-->
        <!--<div class="van-cell__value" v-if=" item.inputClassCode === 'D_TEXTBOX' ">-->
        <!--<input :placeholder="item.customName" :maxlength="item.valueLong" class="van-field__control" v-model="item.customValue" @input="typeLimit(item)" @blur="typeCheck(item)">-->
        <!--<span class="unit-name" v-if="!!item.unitName">{{item.unitName}}</span>-->
        <!--</div>-->
        <!--</div>-->

        <!--性别弹窗-->
        <van-picker
            :columns="columns"
            @change="onSexChange"
            show-toolbar
            @cancel="onCancel('sexPickerShow')"
            ref="sexPicker"
            @confirm="onSexConfirm"
            class="picker-fixed"
            v-show="sexPickerShow"
        />

        <!--生日弹窗-->
        <van-datetime-picker
            v-model="currentDate"
            type="date"
            :maxDate="maxDate"
            :min-date="minDate"
            @change="onBirthday"
            @cancel="onCancel('birthdayPickerShow')"
            @confirm="onBirthdayConfirm"
            class="picker-fixed"
            v-show="birthdayPickerShow"
        />
        <div class="common-bottom-btn" @click="putUserInfo">
            <p class="btn-txt">提交</p>
        </div>

        <!--遮罩-->
        <div class="masks" v-if="sexPickerShow||birthdayPickerShow"></div>

        <!--会员属性选择弹窗 begin-->
        <van-popup v-model="showMemberSelect" position="bottom">
            <van-picker
                :columns="changeMemberInfo"
                show-toolbar
                @cancel="cancelMemberInfo"
                @confirm="changeMember"
                class="picker-fixed"
            ></van-picker>
        </van-popup>
        <!--会员属性选择弹窗 end-->
    </div>
</template>
<script>
import {
    Field,
    Icon,
    Picker,
    DatetimePicker,
    Toast,
    Popup,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
    Uploader
} from "vant";
import { UserService } from "../../api/service";
import Storage from "../../util/storage";

export default {
    name: "member-information",
    components: {
        "van-field": Field,
        "van-icon": Icon,
        "van-picker": Picker,
        "van-datetime-picker": DatetimePicker,
        "van-popup": Popup,
        "van-radio-group": RadioGroup,
        "van-radio": Radio,
        "van-checkbox-group": CheckboxGroup,
        "van-checkbox": Checkbox,
        "van-uploader": Uploader
    },
    data() {
        return {
            username: "",
            userEmail: "",
            columns: [
                {
                    text: "男",
                    value: "D_MALE"
                },
                {
                    text: "女",
                    value: "D_FEMALE"
                }
            ],
            sexPickerShow: false,
            birthdayPickerShow: false,
            usersex: "",
            userSexCode: "",
            userphone: "",
            userbirthday: "",
            currentDate: new Date(1985, 0, 1),
            maxDate: new Date(),
            minDate: new Date(1900, 1, 1),
            userheight: "",
            userweight: "",
            userwaist: "",
            userInfo: {},
            memberInfo: [],
            showMemberSelect: false,
            memberType: "",
            changeMemberInfo: [],
            scrollTop: 0, // 滚动距离
            btnLock: false // 按钮锁
        };
    },
    methods: {
        //      生日和性别弹窗显示
        onShowpicker(attr) {
            this[attr] = true;
        },

        //      取消性别和生日弹窗
        onCancel(attr) {
            this[attr] = false;
        },

        //      性别change事件
        onSexChange(picker, value, index) {
            this.sexName = value;
        },

        //      性别confirm事件
        onSexConfirm() {
            if (!this.sexName) {
                //          没有选择时点击确定默认选中第一项
                this.sexName = this.columns[0];
            }
            this.usersex = this.sexName.text;
            this.userSexCode = this.sexName.value;
            this.sexPickerShow = false;
        },

        //      生日change事件
        onBirthday(picker, values, index) {
            this.birthday = picker.getValues();
        },

        //     生日confirm事件
        onBirthdayConfirm() {
            if (!this.birthday) {
                //          没有选择时点击确定默认选中第一项
                this.birthday = [
                    this.currentDate.getFullYear(),
                    ("0" + parseInt(this.currentDate.getMonth() + 1)).slice(-2),
                    ("0" + this.currentDate.getDate()).slice(-2)
                ];
            }
            this.userbirthday =
                this.birthday[0] +
                "-" +
                this.birthday[1] +
                "-" +
                this.birthday[2];
            this.onCancel("birthdayPickerShow");
        },

        //      跳转更改绑定手机号
        changePhone() {
            this.$router.push("/phone-change");
        },

        //  获取个人信息
        getUserInfo() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.userInfo = res;
                this.username = !!res.vipAccount ? res.vipAccount : "";
                this.userEmail = !!res.email ? res.email : "";
                this.photoId = !!res.photoId ? res.photoId : "";
                if (!!res.sexCode && !!res.sexName) {
                    this.userSexCode = res.sexCode;
                    this.usersex = res.sexName;
                }
                this.userbirthday = !!res.solarcalendar
                    ? res.solarcalendar.split(" ")[0]
                    : null;
                this.userphone = res.mobilePhone;

                //设置默认性别
                let usersex_index = 0;
                for (let i = 0; i < this.columns.length; i++) {
                    if (this.columns[i].text == this.usersex) {
                        usersex_index = i;
                        break;
                    }
                }
                this.$refs.sexPicker.setColumnIndex(0, usersex_index);

                //设置默认生日
                if (this.userbirthday) {
                    this.currentDate = new Date(this.userbirthday);
                }
            });
        },

        // 返回布尔值
        beforeRead(file) {
            if (
                file.type == "image/png" ||
                file.type == "image/jpeg" ||
                file.type == "image/jpg" ||
                file.type == "image/bmp"
            ) {
                // 大小校验
                const isLt4M = file.size / 1024 / 1024 < 4;
                if (!isLt4M) {
                    Toast("图片过大，请更换一张或者进行压缩后上传");
                    return false;
                }
                return true;
            } else {
                Toast("上传图片必须是 JPG/PNG 格式!");
                return false;
            }
        },

        afterRead(file) {
            uploadImg(file.file).then(res => {
                this.photoId = res;
                console.log(file);
                console.log(file.content);
                this.userInfo.photoThumb = file.content;
            });
        },

        //  修改个人信息
        putUserInfo() {
            if (this.btnLock) return;
            if (!this.username) {
                Toast("昵称为必填内容~");
                return;
            }
            if (this.username.length > 10) {
                Toast("昵称只能输入1-10个字符~");
                return;
            }
            var pwdblank = /^\S*$/;
            if (!pwdblank.test(this.username)) {
                Toast("昵称不能包含空格~");
                return;
            }
            if (!!this.userEmail) {
                let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/i;
                if (!emailReg.test(this.userEmail)) {
                    Toast("邮箱格式不正确~");
                    return;
                }
            }

            this.btnLock = true;
            let map = {};
            let arr = [];
            for (let i = 0; i < this.memberInfo.length; i++) {
                let item = this.memberInfo[i];
                if (item.showFlag === 1) {
                    //  只选择前端显示切不带图片的属性
                    if (item.mustFlag === 1) {
                        //  必填属性校验
                        if (
                            item.unfontClassCode === "D_MULTISELECT" &&
                            item.selectClassCode === "D_ALISTOF"
                        ) {
                            // 多选框模式
                            if (item.customValueArr.length > 0) {
                                for (
                                    let j = 0;
                                    j < item.customValueArr.length;
                                    j++
                                ) {
                                    map.customCode = item.customCode;
                                    map.customValue = item.customValueArr[j];
                                    arr.push(map);
                                    map = {};
                                }
                            } else {
                                Toast(item.customName + "为必填内容~");
                                this.btnLock = false;
                                return false;
                            }
                        } else if (!item.customCode || !item.customValue) {
                            Toast(item.customName + "为必填内容~");
                            this.btnLock = false;
                            return false;
                        } else {
                            map.customCode = item.customCode;
                            map.customValue = item.customValue;
                            arr.push(map);
                            map = {};
                        }
                    } else {
                        if (
                            item.unfontClassCode === "D_MULTISELECT" &&
                            item.selectClassCode === "D_ALISTOF"
                        ) {
                            // 多选框模式
                            if (item.customValueArr.length > 0) {
                                for (
                                    let j = 0;
                                    j < item.customValueArr.length;
                                    j++
                                ) {
                                    map.customCode = item.customCode;
                                    map.customValue = item.customValueArr[j];
                                    arr.push(map);
                                    map = {};
                                }
                            }
                        } else {
                            //  非必填属性直接添加进数组
                            map.customCode = item.customCode;
                            map.customValue = item.customValue;
                            arr.push(map);
                            map = {};
                        }
                    }
                }
            }
            let data = {
                //  用户信息
                solarCalendarStr: this.userbirthday,
                sexCode: this.userSexCode || null,
                email: this.userEmail,
                account: this.username,
                usrCode: this.username,
                photoId: this.photoId
            };
            let memberData = {
                //  会员属性
                customs: arr
            };
            UserService.updateUserInfo(data).then(res => {
                if (res === 1) {
                    this.btnLock = false;
                    Toast("修改信息成功~");
                    this.getUserInfo();
                }
            });
            // .then(() => {
            //     UserService.updateMemberInfo(memberData).then(res => {
            //         //  修改会员信息
            //         if (res && res !== 0) {
            //             Toast("修改信息成功~");
            //             this.$nextTick(() => {
            //                 this.getUserInfo();
            //                 this.getMemberInfo();
            //             });
            //         }
            //         this.btnLock = false;
            //     });
            // })
            // .then(() => {
            //     this.btnLock = false;
            // });
        },

        //  获取会员自定义属性
        getMemberInfo() {
            let data = {
                busContsCode: baseConstant.busContsCode
            };
            UserService.getMemberInfo(data).then(res => {
                this.memberInfo = res;
            });
        },

        //  会员属性确认
        changeMember(value) {
            this.memberInfo.forEach(item => {
                if (item.customCode === this.memberType) {
                    item.customValue = value;
                }
            });
            this.showMemberSelect = false;
            this.changeMemberInfo = [];
        },

        //  关闭会员属性弹窗
        cancelMemberInfo() {
            this.showMemberSelect = false;
            this.changeMemberInfo = [];
        },

        //  显示会员属性修改弹窗
        showPopup(item) {
            let arr = {};
            this.memberType = item.customCode;
            item.choiceValues.forEach(item => {
                arr = item.valueName;
                // arr = item.valueCode;
                this.changeMemberInfo.push(arr);
            });
            this.showMemberSelect = true;
        },

        // 身型数据中数字类型的输入框中的值的输入限制
        typeLimit(item) {
            if (item.fieldType === "D_INTEGER")
                item.customValue = item.customValue.replace(/[^0-9.]+/, "");
        },

        //  校验身型数据中数字类型的输入框中的值
        typeCheck(item) {
            if (!item.customValue) return;
            if (item.fieldType !== "D_INTEGER") {
                if (this.scrollTop > 0) window.scroll(0, this.scrollTop);
                return;
            }
            let rule = /^[0-9]+(.[0-9]{1,3})?$/;
            if (!rule.test(item.customValue)) {
                Toast(item.customName + "只允许输入不超过三位小数的数字~");
                item.customValue = "";
                return false;
            } else {
                if (!item.customValue) {
                    Toast(item.customName + "只允许输入不超过三位小数的数字~");
                    item.customValue = "";
                    return false;
                }
                if (!!item.maxValue) {
                    if (Number(item.customValue) > Number(item.maxValue)) {
                        Toast(
                            item.customName + "的最大值不能超过" + item.maxValue
                        );
                        item.customValue = "";
                        return;
                    }
                }
                if (!!item.minValue) {
                    if (Number(item.customValue) < Number(item.minValue)) {
                        Toast(item.customName + "的最小值为" + item.minValue);
                        item.customValue = "";
                        return;
                    }
                }
                item.customValue = Number(item.customValue);
                if (this.scrollTop > 0) window.scroll(0, this.scrollTop);
            }
        }
    },

    created() {
        this.getUserInfo();
        // this.getMemberInfo();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.member-information {
    height: 100%;
    background: $color-white;
    .iconfont {
        color: $text-secondary;
    }
}

.title {
    padding: computed(60) 0;
    font-size: computed(30);
    text-align: center;
}

.fix-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: computed(30) 0;
    width: 100%;
    z-index: 10;
    background: #fff;
}

.van-cell {
    margin-bottom: computed(30);
}

.user-img {
    width: computed(90);
    height: computed(90);
    float: right;
    border-radius: 50%;
    overflow: hidden;

    img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
.user-img-cell {
    line-height: computed(80);
    padding-top: computed(50);
}

.picker-fixed {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 11;
}

.masks {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
    z-index: 10;
}

.title-hr {
    width: 92%;
    margin: computed(28) 4% 0;
    padding: 0;
    border-top: 4px solid $blackcolor;
    border-bottom: 4px solid $blackcolor;
    border-right: 0;
    border-left: 0;
    display: inline-block;
}
.member-information .van-field .van-cell__title .van-cell--required {
    line-height: computed(60);
}
.unit-name {
    position: absolute;
    top: 0;
    right: computed(16);
    font-size: computed(30);
    line-height: computed(60);
    color: #d2d2d2;
    z-index: 1;
}
.van-radio {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 40px;
    span {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        float: right;
        img {
            width: 50px;
        }
        span {
            line-height: 50px;
            margin-left: 4px;
        }
    }
}
.van-checkbox {
    img {
        width: 50px;
    }
}
.common-bottom-btn {
    height: computed(100);
    .btn-txt {
        width: 100%;
        margin: 0;
    }
}
</style>
