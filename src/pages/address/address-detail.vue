/*
* createTime：2018/7/4
* author：en.chen
* description: 收货地址详情
*/
<template>
    <div class="address-detail">
        <div class="detail-cell">
            <div class="cell-title">姓名</div>
            <div class="cell-content">
                <input type="text" v-model="addressInfo.name" maxlength="40" v-inputfix />
            </div>
        </div>
        <div class="detail-cell">
            <div class="cell-title">联系方式</div>
            <div class="cell-content" :class="{'warn-tip' : checkPhone !== true}">
                <input
                    type="tel"
                    v-model="addressInfo.phone"
                    @change="checkPhoneNum"
                    maxlength="11"
                    v-inputfix
                />
            </div>
        </div>
        <div class="detail-cell">
            <div class="cell-title">地区</div>
            <div class="cell-content area" @click="showAreaList = true">
                <span v-text="addressInfo.province + addressInfo.city + addressInfo.district"></span>
            </div>
        </div>
        <div class="detail-cell">
            <div class="cell-title">详细地址</div>
            <div class="cell-content">
                <textarea
                    class="detail-address"
                    type="text"
                    v-model="addressInfo.detail"
                    v-inputfix
                />
            </div>
        </div>
        <div class="van-checkbox" @click="setDefault === 1 ? setDefault = 0 : setDefault =1">
            <i
                class="van-checkbox__icon van-checkbox--square"
                :class="{'checked' : setDefault === 1}"
            ></i>
            <span class="checkbox-label">设为默认</span>
        </div>
        <div class="bottom-btn" @click="editAddress">确定</div>
        <van-popup v-model="showAreaList" position="top">
            <!--<van-area :value="addressInfo.addressId" :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false" />-->
            <van-area
                :value="addressInfo.addressId"
                :area-list="areaList"
                @confirm="areaChange"
                @cancel="showAreaList = false"
                :visible-item-count="5"
            />
        </van-popup>
    </div>
</template>
<script>
import { Popup, Area, Toast } from "vant";
import { Base } from "../../api/service";
import { cityData } from "../../assets/js/cityData";
import { UserService } from "../../api/service";
import Storage from "../../util/storage";
export default {
    components: {
        "van-area": Area,
        "van-popup": Popup
    },
    name: "address-detail",
    data() {
        return {
            id: "",
            destId: "",
            addressInfo: {
                name: "",
                phone: "",
                province: "",
                district: "",
                city: "",
                addressId: "",
                detail: ""
            },
            checkPhone: true,
            setDefault: 0,
            showAreaList: false,
            areaList: cityData,
            btnLock: false
        };
    },
    watch: {
        "addressInfo.name"(value) {
            this.$nextTick(() => {
                this.addressInfo.name = this.filterInput(value);
            });
        },
        "addressInfo.detail"(value) {
            this.$nextTick(() => {
                this.addressInfo.detail = this.filterInput(value);
            });
        },
        "addressInfo.phone"(value) {
            this.$nextTick(() => {
                this.addressInfo.phone = this.filterPhone(value);
            });
        }
    },
    methods: {
        filterInput(val) {
            // 这里过滤的是特殊字符
            return val.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g, "");
        },
        filterPhone(val) {
            // 这里过滤的是特殊字符
            return val.replace(/[^0-9]/g, "");
        },

        // 提交地址信息
        editAddress() {
            if (this.btnLock) return;
            this.btnLock = true;
            this.checkPhoneNum();
            if (
                !this.addressInfo.name ||
                this.addressInfo.name.length < 2 ||
                this.addressInfo.name.length > 15
            ) {
                Toast("收货人姓名长度需2-15字符~");
                this.btnLock = false;
                return;
            }
            if (
                !this.addressInfo.name ||
                !this.addressInfo.detail ||
                !this.addressInfo.addressId
            ) {
                Toast("请完善地址信息~");
                this.btnLock = false;
                return;
            }
            if (this.checkPhone === false) {
                this.btnLock = false;
                return;
            } else {
                let addrData = {
                    id: parseInt(this.id),
                    address: this.addressInfo.detail,
                    cargousrName: this.addressInfo.name,
                    cargoMobile: this.addressInfo.phone,
                    cargoPhone: this.addressInfo.phone,
                    defaultFlag:
                        this.$route.query.addressList_length == 0
                            ? 1
                            : this.setDefault,
                    destCode: this.addressInfo.addressId
                };
                UserService.changeAddrInfo(addrData).then(
                    () => {
                        Toast("保存地址信息成功~");
                        window.history.go(-1);
                    },
                    err => {
                        this.btnLock = false;
                    }
                );
            }
        },

        // 校验电话号码
        checkPhoneNum() {
            var reg = /^1[3|4|5|7|8|9][0-9]{9}$/; // 验证手机号的正则表达式
            if (!reg.test(this.addressInfo.phone)) {
                this.checkPhone = false;
                return;
            } else {
                this.checkPhone = true;
            }
        },

        //  省市区选择
        areaChange(value) {
            this.addressInfo.province = value[0].name;
            this.addressInfo.district = value[2].name;
            this.addressInfo.city = value[1].name;
            if (value[2].code) {
                this.addressInfo.addressId = value[2].code;
            } else if (value[1].code) {
                this.addressInfo.addressId = value[1].code;
            } else {
                this.addressInfo.addressId = value[0].code;
            }
            this.showAreaList = false;
        }
    },
    created() {
        this.id = parseInt(this.$route.query.id) || "";
        this.destId = parseInt(this.$route.query.destId) || "";
        if (this.destId && this.destId !== undefined) {
            let data = {
                addressId: this.id,
                destId: this.destId
            };
            UserService.getAddrDetail(data).then(res => {
                this.addressInfo.name = res.cargousrName;
                this.addressInfo.phone = res.cargoPhone;
                this.addressInfo.addressId = res.districtCode;
                this.addressInfo.province = res.provinceCnName;
                this.addressInfo.district = res.districtCnName;
                this.addressInfo.city = res.cityCnName;
                this.addressInfo.detail = res.address;
                this.setDefault = res.defaultFlag;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.address-detail {
    margin: 0 computed(30);
    overflow: hidden;
    position: relative;
}
.detail-cell {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    margin: computed(30) 0;
    position: relative;
}
.cell-title {
    display: flex;
    flex: inherit;
    align-items: center;
    justify-content: inherit;
    width: computed(140);
    min-width: computed(140);
    font-size: computed(32);
    line-height: computed(34);
    color: #010101;
    white-space: nowrap;
    overflow: hidden;
}
.cell-content {
    height: computed(70);
    width: 100%;
    margin-left: computed(10);
    text-align: left;
    border: solid 1px #cccccc !important;
}
.detail-address {
    width: 100%;
    font-size: computed(30);
    border: none;
    height: computed(70);
}
.area {
    box-sizing: border-box;
    height: computed(70);
    padding: 0 computed(10);
    white-space: nowrap;
    /*word-break: break-all;*/
    font-size: computed(30);
    line-height: computed(70);
    overflow: hidden;
    text-overflow: ellipsis;
    border: none;
}
.cell-content input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: computed(70);
    padding: 0 computed(10);
    border: none;
    font-size: computed(30);
    line-height: computed(70);
    position: relative;
    /* 解决ios版微信浏览器的边框和阴影*/
    border-radius: 0;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
    -webkit-appearance: none;
}
.van-checkbox__icon {
    width: computed(30);
    height: computed(30);
    position: relative;
    border: 1px solid #2ba4f3;
}
.van-checkbox__icon,
.van-checkbox {
    font-size: computed(30);
    line-height: computed(34);
    vertical-align: middle;
    display: inline-block;
}
.checked::after {
    position: absolute;
    content: "";
    width: 2.13333vw;
    height: 2.13333vw;
    left: 50%;
    top: 50%;
    background: #2ba4f3;
    overflow: hidden;
    transform: translate(-50%, -50%);
}
.checkbox-label {
    margin-left: computed(10);
    font-size: computed(30);
    line-height: computed(34);
    color: #0d0e09;
}
.bottom-btn {
    position: fixed;
    width: 100%;
    height: computed(100);
    bottom: 0;
    left: 0;
    background: #2ba4f3;
    font-size: computed(32);
    line-height: computed(100);
    text-align: center;
    color: #ffffff;
}
.cell-content.warn-tip input {
    background: #f3adb8;
    border-color: #f3adb8;
}
.cell-content.warn-tip::after {
    content: "请输入正确的手机号";
    position: absolute;
    left: computed(160);
    bottom: computed(-20);
    color: #d80000;
    font-size: computed(16);
    line-height: computed(16);
}
</style>
<style lang="scss">
.address-detail .van-picker__cancel,
.van-picker__confirm {
    color: #38f;
    font-size: computed(30);
}
.address-detail .van-picker-column {
    font-size: computed(30);
}
</style>


