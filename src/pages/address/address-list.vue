/*
* createTime：2018/7/3
* author：en.chen
* description: 收货地址列表
*/
<template>
    <div class="address-list">
        <div class="loading-tip" v-if="!!loading">加载中~</div>
        <ul>
            <li v-if="addressList.length>0" v-for="(item,index) in addressList" :key="index">
                <van-swipe-cell :right-width="70" :on-close="onClose">
                    <van-cell-group>
                        <div class="address-header">
                            <span class="user-name">{{item.cargousrName}}</span>
                            <span class="user-phone">{{item.cargoPhone}}</span>
                            <span class="edit-btn" @click="editAddress(item.id,item.destId)">
                                <i class="iconfont icon-pingjia"></i>
                            </span>
                        </div>
                        <div class="address-msg" @click="selectAddress(item)">
                            <span class="default-address" v-if="item.defaultFlag === 1">[默认地址]</span>
                            {{item.destDesc
                            + item.address}}
                        </div>
                        <div class="address-handle"></div>
                    </van-cell-group>
                    <span class="delete-btn" slot="right" @click="deleteAddress(item)">删除</span>
                </van-swipe-cell>
            </li>
            <div
                class="empty-content"
                v-if="!loading && (!addressList || addressList.length === 0)"
            ></div>
        </ul>
        <div class="common-bottom-btn" @click="newAddr">
            <p class="btn-txt">新增收货地址</p>
        </div>
    </div>
</template>
<script>
import { SwipeCell, CellGroup, Icon, Dialog, Toast } from "vant";
import Storage from "../../util/storage";
import { UserService } from "../../api/service";

export default {
    components: {
        "van-swipe-cell": SwipeCell,
        "van-cell-group": CellGroup,
        "van-icon": Icon
    },
    name: "address-list",
    data() {
        return {
            fromPage: "",
            addressList: [],
            loading: true,  // 加载状态
            addrSelected: {}
        };
    },
    methods: {
        // 获取地址列表
        getAddress() {
            
            let data = {
                vipUsrId: Storage.get("USER_INFO").usrId
            };
            UserService.getAddrList(data).then(
                (res) => {
                    this.addressList = res||[];
                    this.$nextTick(() => {
                        console.log('creatednextTick')
                        window.scrollTo(0, 1)
                    })
                },
                (err) => {
                    this.loading = false
                }
            ).then(() => {
                this.loading = false
            });
        },

        // 编辑地址
        editAddress(id, destId) {
            this.$router.push("/address-detail?id=" + id + "&destId=" + destId);
        },

        // 滑动组件
        onClose(clickPosition, instance) {
            switch (clickPosition) {
                case "left":
                case "cell":
                case "outside":
                    instance.close();
                    break;
            }
        },

        // 删除地址
        deleteAddress(item) {
            Dialog.confirm({
                message: "确定删除该地址吗？"
            }).then(
                () => {
                    let data = {
                        ids: item.id
                    };
                    UserService.deleteAddrList(data).then(() => {
                        this.addressList = []
                        this.getAddress();
                        // 删除地址检查本地缓存
                        if (!!Storage.get('settlementAddr')) {
                            let addrInfo = Storage.get('settlementAddr')
                            if (item.id === addrInfo.id) Storage.remove('settlementAddr')
                        }
                        Toast("删除地址成功~");
                    });
                },
                (err) => {
                }
            );
        },

        //  订单结算页面进入时的选择事件
        selectAddress(item) {
            if (this.fromPage === "settlement") {
                Storage.set("settlementAddr", item);
                this.$router.go(-1);
            } else if (this.fromPage === "postSale") {
                this.$router.go(-1);
                this.$router.replace({
                    name: 'postSaleDetail',
                    params: {
                        addrInfo: item
                    }
                })
            }
        },

        //  跳转新增地址
        newAddr() {
            if(this.addressList.length>19){
                Toast("最多可添加20条收货地址");
                return
            }
            this.$router.push("/address-detail?addressList_length=" + this.addressList.length);
        }
    },
    created() {
        
        this.fromPage = this.$route.query.fromPage;
        this.getAddress();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.address-list {
    overflow: hidden;
    position: relative;
}

.address-list ul {
    padding-bottom: computed(140);
}

.address-list ul li {
    position: relative;
    overflow: hidden;
    color: #333333;
}

.address-header {
    padding: computed(47) computed(30) computed(27);
    font-size: computed(30);
    line-height: computed(36);
    color: #000;
}

.address-header::after {
    content: "";
    clear: both;
    display: table;
}

.user-name {
    float: left;
    overflow: hidden;
    font-weight: bold;
}

.user-phone {
    margin-left: computed(50);
    float: left;
    font-weight: bold;
}

.default-address {
    color: #d80000;
    margin-right: computed(10);
}

.icon-pingjia {
    color: #2ba4f3;
}

.edit-btn {
    float: right;
    z-index: 9;
}

.address-msg {
    margin: 0 computed(30);
    padding: 0 0 computed(50) 0;
    border-bottom: solid 1px #dbdbdb;
    font-size: computed(28);
    line-height: computed(40);
}

.delete-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20vw;
    height: 100%;
    font-size: computed(30);
    line-height: computed(30);
    color: #fff;
    background: red;
    text-align: center;
    line-height: inherit;
}

[class*="van-hairline"]::after {
    display: none;
}

.empty-content {
    margin: computed(100) auto 0 auto;
    width: computed(400);
    height: computed(400);
    background: url("../../assets/images/common/noneAddress.jpg") no-repeat top
        center;
    -webkit-background-size: 90%;
    background-size: 90%;
}

.loading-tip {
    margin-top: computed(30);
    font-size: computed(30);
    line-height: computed(30);
    text-align: center;
    color: #999999;
}
</style>


