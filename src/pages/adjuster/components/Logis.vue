/*
 * @Author: yongtian.hong
 * @Date: 2018-08-13 13:43:18
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-15 22:05:02
 * @Description: 物流信息组件
 */
 <style lang='scss' scoped>
.logis-wrap {
    width: 100%;
}
.selected {
    color: #2ba4f3;
    padding-bottom: computed(5) !important;
    border-bottom: solid 2px #2ba4f3;
}
.title {
    text-align: center;
    font-size: $font-title1;
    margin: computed(10) 0;
}
.input-box {
    height: computed(70);
    input {
        outline: 0;
        border: 0;
        input::placeholder {
            color: #cccccc;
        }
    }
}
</style>
 
 <template>
    <div class="logis-wrap" v-if="renderSelf">
        <div class="text-center fs32B mgT30">{{title}}</div>
        <div class="mgTb30 borderB1c pdB30">
            <!-- 寄回方式填写 -->
            <div v-if="!data.reciveWayCode">
                <div class="mgTb30 flex-center fs28">
                    <div class="w50 flex-between">
                        <div :class="{'selected':state}" @click="select('kdth')">快递寄回</div>
                        <div :class="{'selected':!state}" @click="select('mdth')">退回门店</div>
                    </div>
                </div>
                <!-- 快递寄回 -->
                <div class="mgTb20" v-show="state">
                    <div class="flex-box fs28 mgB20">
                        <div class="w20">收货人:</div>
                        <div class="flex-auto flex-between">
                            <div class="name">{{data.expressRecipient}}</div>
                            <div class="phone">{{phone}}</div>
                        </div>
                    </div>
                    <div class="flex-box fs28">
                        <div class="w20">收货地址:</div>
                        <div class="flex-auto">{{data.changeShopAddress}}</div>
                    </div>
                    <div class="mgT20">
                        <div class="flex-box fs32 mgB20">
                            <div class="w30 flex-vcenter">快递单号</div>
                            <div class="input-box w100 flex-vcenter border1c pdLr10">
                                <input
                                    v-inputfix
                                    v-model="kdInfo.expressNo"
                                    class="flex-auto fs28"
                                    type="text"
                                    placeholder="请填写快递单号"
                                    @blur.prevent="saveExpressCode()"
                                />
                            </div>
                        </div>
                        <div class="flex-box fs32">
                            <div class="w30 flex-vcenter">物流公司</div>
                            <div
                                class="input-box w100 flex-vcenter border1c pdLr10"
                                @click="selectLogis()"
                            >
                                <div class="flex-auto fs28">{{logis.shippingName||"请选择物流公司"}}</div>
                                <i class="iconfont icon-youfan grey99"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 退回门店 -->
                <div class="mgTb20" v-show="!state">
                    <div class="flex-box fs32 mgB20">
                        <div class="w30 flex-vcenter">所在地区</div>
                        <div
                            class="input-box w100 flex-vcenter border1c pdLr10"
                            @click="selectArea()"
                        >
                            <div class="flex-auto fs28">{{selectedArea||"请选择地区"}}</div>
                            <i class="iconfont icon-youfan grey99"></i>
                        </div>
                    </div>
                    <div class="flex-box fs32">
                        <div class="w30 flex-vcenter">选择门店</div>
                        <div
                            class="input-box w100 flex-vcenter border1c pdLr10"
                            @click="selectShop()"
                        >
                            <div class="flex-auto fs28">{{store.dptName||"请选择退回的门店"}}</div>
                            <i class="iconfont icon-youfan grey99"></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 门店地址(回显提交后的信息) -->
            <div class="mgTb30 pd20 borderDash grey66 fs28" v-if="showMdAddr">
                <div class="mgB20 fs32 grey66">门店地址</div>
                <div class="mgB20 flex-box">
                    <div class="w20">门店名称:</div>
                    <div class="flex-auto flex-between">
                        <div>{{store.dptName}}</div>
                        <div>{{store.personMobile||store.phone}}</div>
                    </div>
                </div>
                <div class="flex-box">
                    <div class="w20">收货地址:</div>
                    <div class="flex-auto">{{selectedStoreAddr}}</div>
                </div>
            </div>
            <!-- 快递寄回/退回门店 -->
            <div v-if="data.reciveWayCode">
                <div class="mgTb20 fs28" v-if="data.reciveWayCode=='kdth'">
                    <div class="mgB20">快递寄回</div>
                    <div class="flex-box">
                        <div class="w30">{{data.shipPingName}} :</div>
                        <div class="flex-auto">{{data.expressCode}}</div>
                    </div>
                </div>
                <div class="mgTb20 fs28" v-if="data.reciveWayCode=='mdth'">
                    <div class="mgB20">退回门店</div>
                    <div class="flex-box">
                        <div>{{data.changeShopName}} :</div>
                        <div class="flex-auto pdL20">{{data.changeShopAddress}}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 我的收货地址显示/选择 -->
        <div
            class="flex-box borderB1c"
            @click="selectAddr()"
            v-if="data.reciveWayCode=='kdth'||!data.reciveWayCode&&state"
        >
            <div class="flex-auto">
                <div class="pdB20 fs28">
                    <div class="mgB20 text-center fs32B">我的收货地址</div>
                    <div class="flex-box">
                        <div class="mgR20">{{addrInfo.cargousrName}}</div>
                        <div class="flex-auto">{{addrInfo.cargoMobile}}</div>
                    </div>
                    <div class="mgTb20">{{addrInfo.address}}</div>
                </div>
            </div>
            <div class="flex-center" v-if="!data.reciveWayCode">
                <i class="iconfont icon-youfan grey99"></i>
            </div>
        </div>
        <!-- 商家寄出 -->
        <div v-if="repairedFinish">
            <!-- <div class="fs36B text-center mgT30">商家发出</div>
            <p class="title">{{data.returnShippingName}}，{{data.returnShipCode}}</p> -->
            <logis title="商家发出" :returnShippingName="data.returnShippingName" :returnShipCode="data.returnShipCode" :data="logisic"></logis>
        </div>
    </div>
</template>
 
 <script>
import { Toast } from "vant";
import { getAddrList } from "@/api/service/user-service";
import check from "@/util/check";
import ordStateMap from "../public/OrdStateMap";
import logis from "@/components/logis";
export default {
    props: {
        data: {},
        //选中的地区列表
        area: {},
        //选中的门店
        store: {},
        // 选中的物流
        logis: {},
        // 退回方式切换
        switchBackMode: {
            type: Function
        },
        // 控制门店,物流，省市区弹窗显示
        showLogisList: false,
        showStoreList: false,
        showAreaList: false
    },
    data() {
        return {
            userInfo: {},
            addrInfo: {},
            logisic: {
                shippingWayCode: "kdps", //快递配送方式
                expressCode: "", //快递运营商代码编号，如YTO(圆通)
                expressNo: "" //快递单号
            },
            state: {
                type: Boolean, //true:快递寄回，false:退回门店
                default: true
            },
            title: "",
            //快递寄回
            kdInfo: {
                expressNo: "",
                company: ""
            },
            // 退回门店
            mdInfo: {
                name: "",
                phone: "",
                area: {}, //地区
                store: {} //门店
            },
            renderSelf: false, //控制组件自身是否渲染
            showMdAddr: false, //显示(选择后的)门店地址
            repairedFinish: false, //显示维修完成商家发出
            showlayer: false,
            ordStateMap: ordStateMap,
            selectedArea: "",
            selectedStore: ""
        };
    },
    methods: {
        initState() {
            // this.noRenderSelf();
            // 售后单状态
            const ordState = this.ordStateMap[this.data.applyStatusCode];
            // 售后单类型
            const returnType = this.data.returnTypeName;
            // 组件渲染控制
            this.renderContrl(ordState, returnType);

            this.initKdInfo();

            switch (returnType) {
                case "换货":
                    this.title = "换货物流";
                    break;
                case "返修":
                    this.title = "返修物流";
                    //物流初始化
                    this.logisic.expressNo = this.data.returnShipCode;
                    this.logisic.expressCode = this.data.returnShippingCode;

                    break;
                case "退货退款":
                    this.title = "退货物流";
                    break;
                default:
                    this.title = null;
                    this.renderSelf = false;
            }
        },
        // 渲染控制
        renderContrl(ordState, returnType) {
            // 在下面这些售后单状态下，组件自身不渲染
            const noRenderCase = [
                "待审核",
                "待支付",
                "已取消",
                "已关闭",
                "已拒绝"
            ];
            // 在下面这些售后单状态下,组件渲染填写提交节点
            const renderFillCase = ["待寄回"];
            // 返修单在下面这些售后单状态下,组件渲染物流进度内容
            const repairedFinishCase = ["维修完成", "已完成"];
            if (noRenderCase.includes(ordState)) {
                this.renderSelf = false;
            } else if (renderFillCase.includes(ordState)) {
                this.renderSelf = true;
            } else {
                // 除以上所有的售后单状态外,剩余都渲染
                this.afterFill();
                if (returnType != "返修") return;
                if (repairedFinishCase.includes(ordState)) {
                    this.repairedFinish = true;
                }
            }
        },
        beforFill() {
            this.renderSelf = true;
        },
        afterFill() {
            this.renderSelf = true;
            if (!this.data.shipPingCode) {
                this.showMdAddr = false;
            }
        },
        noRenderSelf() {
            this.renderSelf = false;
        },
        // 设置地址
        setAddrInfo({
            cargousrName,
            cargoMobile,
            destDesc,
            address,
            id
        } = addrInfo) {
            this.$route.params.addressId = id;
            return {
                cargousrName: cargousrName,
                cargoMobile: cargoMobile,
                address: destDesc ? destDesc + address : address
            };
        },
        // 初始化地址
        async initAddr() {
            // 用户选择完地址可以
            const addressInfo = this.$route.params.addrInfo;
            if (this.ordStateMap[this.data.applyStatusCode] === "待寄回") {
                if (check.isEmpty(addressInfo)) {
                    let params = {
                        vipUsrId: this.Storage.get("USER_INFO").usrId
                    };
                    let defaultAddr = await getAddrList(params).then(list => {
                        let defaultAddress = list.filter(item => {
                            if (item.defaultFlag == 1) return item;
                        })[0];
                        if (!defaultAddress) {
                            defaultAddress = list[0];
                        }
                        return defaultAddress;
                    });
                    this.addrInfo = this.setAddrInfo(defaultAddr);
                } else {
                    this.addrInfo = this.setAddrInfo(addressInfo);
                }
            } else {
                // 非待寄回状态直接取售后详情接口返回的地址数据
                if (!this.data.addressInfo) return;
                this.addrInfo.cargousrName = this.data.addressInfo.cargousrname;
                this.addrInfo.cargoMobile = this.data.addressInfo.cargomobile;
                this.addrInfo.address = this.data.addressInfo.cargoaddress;
            }
        },

        // 初始化物流选择信息
        initKdInfo() {
            let expressNo, company, expre = this.Storage.get("EXPRE")
            if(!!expre){
                expressNo = expre.expressNo
                company = expre.company
            }
            // const { expressNo, company } = this.Storage.get("EXPRE");
            this.kdInfo.expressNo = expressNo || "";
            this.kdInfo.company = company || "";
        },
        // 切换快递寄回与退回门店
        select(code) {
            this.state = !this.state;
            this.switchBackMode(code);
            if (this.state) {
                this.Storage.set("usrinfo", {});
                this.mdInfo.name = null;
                this.mdInfo.phone = null;
            } else {
                this.Storage.set("EXPRE", {});
                this.kdInfo.expressNo = null;
            }
        },
        // 选择物流公司
        selectLogis() {
            this.showlayer = true;
            this.$emit("update:showLogisList", this.showlayer);
        },
        //选择地区
        selectArea() {
            this.showlayer = true;
            this.$emit("update:showAreaList", this.showlayer);
        },
        // 选择门店
        selectShop() {
            if (this.area.length === 0) {
                Toast("请先选择门店所在地区");
            } else if (check.isEmpty(this.$parent.storeList)) {
                Toast("您所在地区无线下门店");
            } else {
                this.showlayer = true;
                this.$emit("update:showStoreList", this.showlayer);
            }
        },
        //选择地址
        selectAddr() {
            if (!this.data.reciveWayCode) {
                this.$router.push({
                    name: "addressList",
                    query: {
                        fromPage: "postSale"
                    }
                });
            }
        },
        // 保存快递单号（失焦时触发）
        saveExpressCode() {
            this.Storage.set("EXPRE", this.kdInfo);
        },
        // 保留用户信息（失焦时触发）
        saveUsrInfo() {
            this.Storage.set("usrinfo", this.mdInfo);
        }
    },
    watch: {
        area: function(list) {
            this.selectedArea = "";
            list.forEach((element, index) => {
                if (index < 2) {
                    this.selectedArea += element.name + "-";
                } else {
                    this.selectedArea += element.name;
                }
            });
        },
        store: function(obj) {
            // 判断门店选择时，如果选中门店且地区也存在,显示门店地址
            if (!check.isEmpty(obj)) {
                this.showMdAddr = true;
            } else {
                this.showMdAddr = false;
            }
        },
        data: function(newData) {
            this.initState();
            this.initAddr();
        }
    },
    components: {
        logis
    },
    computed: {
        selectedStoreAddr: function() {
            let addr =
                this.store.provinceName +
                this.store.cityName +
                this.store.districtName +
                this.store.address;
            return addr;
        },
        phone: function() {
            if (!check.isEmpty(this.data.expressPhone)) {
                return this.data.expressPhone;
            } else if (!check.isEmpty(this.data.expressMobile)) {
                return this.data.expressMobile;
            }
            return null;
        }
    }
};
</script>
