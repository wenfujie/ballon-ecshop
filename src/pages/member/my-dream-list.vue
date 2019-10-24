
/*
* createTime：2018/8/15
* author：en.chen
* LastEditors: lan.chen
* LastEditTime: 2019-06-26 17:46:31
* description:  我的收藏
*/
<template>
    <div class="member-center">
        <!--操作栏 begin-->
        <div class="top-content">
            <div class="dreamList-title" v-if="goodsList.length > 0">
                我的收藏 ({{totals}})
                <div class="fr" @click="editStatus = !editStatus">
                    <i class="iconfont icon-bianji"></i>
                    {{editStatus === false ? '编辑' : '完成'}}
                </div>
            </div>
            <empty emptyText="暂无收藏~" v-show="showEmpty"></empty>
        </div>
        <!--操作栏 end-->

        <!--商品列表 begin-->
        <van-list
            v-model="loading"
            :finished="finished"
            @load="loadMore"
            :immediate-check="false"
            v-if="goodsList.length>0"
        >
            <div class="member-goods-list">
                <ul>
                    <li class="member-goods-item" v-for="(item,index) in goodsList" :key="index">
                        <img
                            :src="getImg(item.thumb, '165*165')"
                            onerror="errImg(event)"
                            alt
                            @click="goDetail(item)"
                        />
                        <div class="diy-icon" v-if="item.orderFlag === 1"></div>
                        <p class="goods-name">{{item.goodsName}}</p>
                        <div class="goods-price">
                            <span class="sale-price">￥{{item.salePrice | fixed2}}</span>
                            <span
                                v-if="!!item.tagPrice && item.tagPrice > 0"
                                class="tag-price"
                            >￥{{item.tagPrice | fixed2}}</span>
                        </div>
                        <!--选择框 begin-->
                        <div class="select-box" v-if="editStatus === true">
                            <input
                                class="checkInput"
                                name="shopCart"
                                type="checkbox"
                                v-model="checkedList"
                                :value="item.id"
                            />
                            <i
                                class="van-checkbox__icon"
                                :class="{ 'checked' : checkedList.indexOf(item.id) !== -1 }"
                                :for="item.id"
                            ></i>
                        </div>
                        <!--选择框 end-->
                    </li>
                </ul>
            </div>
        </van-list>
        <!--商品列表 end-->

        <!--没有商品 begin-->
        <!-- <p
            class="no-goods-tip"
            v-if="!loading && (!goodsList.length || goodsList.length < 1) "
        >您还没有选择商品</p>-->
        <!--没有商品 end-->

        <!--loading提示 begin-->
        <!-- <p class="no-goods-tip" v-if="loading">加载中~</p> -->
        <!--loading提示 end-->

        <!--底部状态栏 begin-->
        <div class="goods-actions" v-if="editStatus === true">
            <div class="carts-info">
                <div class="van-checkbox" @click="checkedAll()">
                    <i class="van-checkbox__icon" :class="{ 'checked': checkAll === true}"></i>
                    <span class="checkbox-label">全选</span>
                </div>
            </div>
            <div class="buy-button" @click="deleteCollected()">删除</div>
        </div>
        <!--底部状态栏 end-->
    </div>
</template>
<script>
import { List, Dialog, Toast } from "vant";
import Storage from "../../util/storage";
import { Goods, Collection, Cms } from "../../api/service";
import Empty from "../../components/EmptyContent";
export default {
    components: {
        "van-list": List,
        empty: Empty
    },
    data() {
        return {
            goodsList: [],
            showSelect: false,
            loading: true, // 控制loading显示
            finished: false, // 控制是否加载更多商品
            pageNum: 1,
            pageSize: 10,
            checkedList: [],
            checkAll: false,
            editStatus: false,
            totals: 0,
            showEmpty: false
        };
    },
    watch: {
        //  选择商品时监听全选状态
        checkedList: function() {
            if (this.goodsList.length === this.checkedList.length) {
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
        },

        //  加载更多商品时监听全选状态
        goodsList: function() {
            if (this.goodsList.length === this.checkedList.length) {
                this.checkAll = true;
            } else {
                this.checkAll = false;
            }
        },

        //  设置全选状态
        checkAll(status) {
            this.checkAll = status;
        }
    },
    methods: {
        //  加载收藏商品列表
        getList() {
            let data = {
                cltTypeCode: "",
                collocationCode: "",
                priceTypeCode: "",
                busContsCode: baseConstant.busContsCode,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                shopDptId: Storage.get("properties").shopId
            };
            Collection.getCollectionList(data)
                .then(
                    res => {
                        this.totals = res.pages.total;
                        let goodsData = res.pages.list;
                        goodsData.forEach(item => {
                            this.goodsList.push(item);
                        });
                        if (this.goodsList.length == 0) {
                            this.showEmpty = true;
                        }
                        if (res.pages.pageNum >= res.pages.pages) {
                            this.finished = true;
                        }
                    },
                    err => {}
                )
                .then(() => {
                    this.loading = false;
                });
        },

        //  上拉加载更多
        loadMore() {
            if (this.finished === true) {
                Toast("没有更多了");
                return;
            } else {
                this.pageNum += 1;
                this.getList();
            }
        },

        //  全选与取消全选
        checkedAll() {
            let goodsData = [];
            if (this.checkAll === false) {
                // 判断当前的全选状态
                this.goodsList.forEach(item => {
                    goodsData.push(item.id);
                });
            }
            this.checkedList = goodsData;
        },

        //  取消收藏/移除愿望清单
        deleteCollected() {
            if (!this.checkedList.length || this.checkedList.length < 1) {
                Toast("请先选择要删除的商品~");
                return;
            } else {
                Dialog.confirm({
                    message: "确定移出我的收藏吗？"
                }).then(
                    () => {
                        let goodsCodes = [];
                        for (let i = 0; i < this.checkedList.length; i++) {
                            this.goodsList.forEach(item => {
                                if (item.id === this.checkedList[i]) {
                                    goodsCodes.push(item.goodsCode);
                                }
                            });
                        }
                        let data = {
                            usrId: Storage.get("USER_INFO").usrId,
                            companyId: Storage.get("COMPANYID").company_id,
                            goodCodeStr: goodsCodes.join(","),
                            ids: this.checkedList.join(",")
                        };
                        Collection.deleteCollection(data).then(res => {
                            Toast("操作成功~");
                            this.$nextTick(() => {
                                this.pageNum = 1;
                                this.goodsList = [];
                                this.checkedList = [];
                                this.checkAll = false;
                                this.editStatus = false;
                                this.finished = false;
                                this.getList();
                            });
                        });
                    },
                    err => {}
                );
            }
        },

        // 跳转详情
        goDetail(item) {
            let params = {
                ownCompanyId: Storage.get("COMPANYID").company_id,
                goodsCode: item.goodsCode,
                buscontsCode: baseConstant.busContsCode
            };
            Goods.isShelves(params).then(res => {
                // 商品上架了一定跳转至详情页
                if (res.sellFlag === 1) {
                    if (item.orderFlag === 1) {
                        this.$router.push(
                            "/goods/web-design?goodsCode=" + item.goodsCode
                        );
                    } else if (item.orderFlag === 0) {
                        this.$router.push(
                            "/goods-detail?goodsCode=" + item.goodsCode
                        );
                    }
                    return false;
                } else {
                    // 导入微信平台且下架
                    if (res.buscontsId && res.sellFlag === 0) {
                        if (item.orderFlag === 1) {
                            this.$router.push(
                                "/goods/web-design?goodsCode=" + item.goodsCode
                            );
                        } else if (item.orderFlag === 0) {
                            this.$router.push(
                                "/goods-detail?goodsCode=" + item.goodsCode
                            );
                        }
                        return false;
                    }
                    // 导入全平台未导入微信平台且下架
                    if (!res.buscontsId && res.sellFlag === 0) {
                        if (item.orderFlag === 1) {
                            this.$router.push(
                                "/goods/web-design?goodsCode=" + item.goodsCode
                            );
                        } else if (item.orderFlag === 0) {
                            this.$router.push(
                                "/goods-detail?goodsCode=" + item.goodsCode
                            );
                        }
                        return false;
                    }

                    // 未导入微信平台和全平台跳转至商品未上架页面
                    if (!res || (!res.buscontsId && res.sellFlag !== 0)) {
                        this.$router.push("/off-shelves");
                    }
                }
            });
        }
    },
    created() {
        this.getList();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.member-center {
    overflow: hidden;
    .no-goods-tip {
        width: 90%;
        margin: computed(110) 0 0 computed(38);
        color: #cccccc;
        font-size: computed(28);
        line-height: computed(35);
    }
}
.member-center .member-goods-list {
    margin: computed(70) computed(30) computed(100) computed(30);
    .goods-name {
        margin-top: computed(14);
        font-size: computed(28);
        line-height: computed(32);
        color: #0d0e09;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .goods-price {
        margin-top: computed(12);
        font-size: computed(28);
        line-height: computed(32);
        .sale-price {
            color: #0d0e09;
            font-weight: bold;
        }
        .tag-price {
            color: #999999;
            margin-left: computed(10);
            text-decoration: line-through;
        }
    }
    .select-box {
        position: absolute;
        right: computed(10);
        top: computed(10);
        z-index: 2;
        background: transparent;
        width: computed(60);
        height: computed(60);
        .van-checkbox__icon {
            margin: 0;
            float: right;
            background: #ffffff;
        }
        .checkInput {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 2;
        }
    }
}
.top-content {
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: computed(35) computed(30) computed(30) computed(30);
    font-size: computed(36);
    line-height: computed(38);
    color: #454545;
    background: #ffffff;
    z-index: 9;
    .none-list {
        text-align: center;
    }
    .dreamList-title {
        position: relative;
        .fr {
            margin-top: computed(-5);
            font-size: computed(32);
            .icon-bianji {
                font-size: computed(36);
                line-height: computed(36);
                color: #2ba4f3;
            }
        }
        &::after {
            content: "";
            display: table;
            clear: both;
        }
    }
}
.goods-actions {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: computed(100);
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 7;
}
.carts-info {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: computed(100);
    border: solid computed(1) #cccccc;
    background: #fff;
    z-index: 9;
}
.buy-button {
    width: computed(230);
    height: computed(100);
    font-size: computed(32);
    line-height: computed(100);
    text-align: center;
    color: #ffffff;
    background: #2ba4f3;
}
.van-checkbox__icon {
    display: block;
    box-sizing: border-box;
    width: computed(30);
    height: computed(30);
    position: relative;
    border: 1px solid #2ba4f3;
    margin-left: computed(30);
    font-size: computed(30);
    line-height: computed(30);
}
.van-checkbox {
    display: flex;
    height: computed(100);
    align-items: center;
}
.checked::after {
    position: absolute;
    content: "";
    width: computed(16);
    height: computed(16);
    left: 50%;
    top: 50%;
    background: #2ba4f3;
    overflow: hidden;
    transform: translate(-50%, -50%);
}
.checkbox-label {
    margin-left: computed(10);
    font-size: computed(30);
    line-height: computed(100);
    color: #0d0e09;
}
.diy-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: computed(160);
    height: computed(36);
    z-index: 3;
    background: url("../../assets/images/common/diy.png") no-repeat top left;
    -webkit-background-size: contain;
    background-size: contain;
}
.empty-box {
    height: computed(400);
    padding-top: computed(250);
    position: fixed;
    margin-left: computed(-25);
}
</style>
