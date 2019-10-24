/*
* createTime：2018/7/9
* author：en.chen
* description: 商品墙/商品列表
*/
<template>
    <div class="goods-list">
        <!--搜索框 begin-->
        <div class="search-box" @click="goSearch()">
            <div class="search">
                <i class="iconfont icon-sousuo"></i>
                <input class="default-word" v-model="keyWord" placeholder="搜索商品" @focus="goSearch" />
                <i class="iconfont icon-guanbi"></i>
            </div>
        </div>
        <!--搜索框 end-->

        <!--分类标签 begin-->
        <ul class="tab-list">
            <li
                class="tab-item"
                :class="{'act' : (sortParam === 'recmSeq') || (sortParam === '')}"
                @click="changeSort('recmSeq')"
            >设计师推荐</li>
            <li
                class="tab-item"
                :class="{'act' : sortParam === 'sales'}"
                @click="changeSort('sales')"
            >销量优先</li>
            <li
                class="tab-item"
                :class="{'act' : sortParam === 'price'}"
                @click="changeSort('price')"
            >
                价格
                <i class="iconfont icon-xialaxuan" :class="{ 'rotate' : sort === 'ASC' }"></i>
            </li>
            <li class="tab-item" @click="showfifter = true">筛选</li>
        </ul>
        <!--分类标签 end-->

        <!--商品列表 begin-->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
            <div class="list-content">
                <ul>
                    <li class="goods-item" v-for="item in goodsList" @click="goDetail(item)">
                        <div class="goods-cover">
                            <img :src="getImg(item.glbFileUrl, '165*165')" onerror="errImg(event)" alt />
                        </div>
                        <div class="diy-icon" v-if="item.orderFlag === 1"></div>
                        <p class="goods-name">{{item.goodsName}}</p>
                        <div class="goods-price">
                            <span class="sale-price">￥{{item.salePrice | fixed2}}</span>
                            <span
                                v-if="!!item.tagPrice && item.tagPrice > 0"
                                class="tag-price"
                            >￥{{item.tagPrice | fixed2}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </van-list>
        <!--商品列表 end-->

        <!--无内容提示 begin-->
        <empty emptyText="暂无商品~" v-if="!loading && goodsList.length<1"></empty>
        <!-- <p class="none-tip" v-if="!loading && goodsList.length<1">暂无商品~</p> -->
        <!--无内容提示 end-->

        <!--筛选弹窗 begin-->
        <!-- 筛选弹出层 -->
        <van-popup
            v-model="showfifter"
            position="right"
            custom-style="height:1150px;"
            @close="onClose"
        >
            <div class="good-fifter">
                <div class="fifter-content">
                    <div
                        v-for="(item,index) in CrumbsName"
                        :key="index"
                        class="content-box"
                        v-show="item.list && item.list.length!=0"
                    >
                        <div class="title" @click="showDetails(item)">
                            <p>{{item.escrumbsName}}</p>
                            <p class="more">
                                <i v-if="item.ishow===true" class="iconfont icon-shangla"></i>
                                <i v-else class="iconfont icon-xialaxuan"></i>
                            </p>
                        </div>
                        <div class="contents" v-if="item.ishow">
                            <p
                                v-for="(it,indexs) in  item.list"
                                :key="indexs"
                                :class="{checked:indexs==item.n }"
                                @click="choice(it,indexs,item)"
                            >{{it.name}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fifter-bottom">
                <span class="reset-btn select-btn" @click="reset()">重置</span>
                <span class="sure-btn select-btn" @click="sure">确定</span>
            </div>
        </van-popup>
        <!--筛选弹窗 end-->
    </div>
</template>
<script>
import { Popup, List, Toast } from "vant";
import { Cms, Goods } from "../../api/service";
import Storage from "../../util/storage";
import Empty from "../../components/EmptyContent";

export default {
    components: {
        "van-popup": Popup,
        "van-list": List,
        empty: Empty
    },
    data() {
        return {
            userInfo: {},
            defaultWords: "推荐搜索词",
            sortParam: "recmSeq", //  列表索引
            sortParamData: [],
            goodsList: [], //  商品列表
            keyWord: "", //  关键词
            ptiPartHdId: "", //  获取面包屑详情的id字符串
            sort: "",
            showfifter: false,
            loading: true, // 控制loading显示
            finished: false, // 控制是否加载更多商品
            pageNum: 1,
            pageSize: 10,
            CrumbsName: [], //面包屑标题
            flags: [], //存放面包屑过滤id
            crumbs: [], //过滤面包屑
            couponId: "", //优惠券id
            classId: "" //分类id
            // crumbsList: [], // 一级面包屑数组
            // actCrumbs: "", //  选中的一级面包屑的值
            // crumbsSecList: [], //  二级面包屑数组
            // crumbsDetailList: [], //  三级面包屑数组
            // crumbsArr: "" // 搜索面包屑参数
        };
    },
    methods: {
        onClose() {
            this.showfifter = false;
        },
        //  跳转搜索页
        goSearch() {
            let url = "/search";
            if (!!this.keyWord)
                url += `?keyWord=${this.keyWord}&timestampStr=${Date.now()}`;
            this.$router.replace(url);
        },
        //  查询面包屑接口所需ids
        getCrumbsIds() {
            console.log(this.classId, "this.classId");
            if (this.keyWord || this.classId) {
                let data = {
                    busContsCode: baseConstant.busContsCode, // 业务触点
                    shopId: Storage.get("properties").shopId, // Storage获取
                    pageNum: this.pageNum,
                    pageSize: 10,
                    origin: "",
                    filters: JSON.stringify(this.crumbs), // 面包屑
                    keyword: this.keyWord,
                    sortParam: JSON.stringify(this.sortParamData),
                    queryNullBusFlag: 1,
                    platformCode: this.classId,
                    orderFlags: JSON.stringify([0]),
                    couponId: this.couponId
                };
                Cms.getCrumbsGoodsIds(data).then(
                    res => {
                        this.GetCrumbs(res.join(","));
                    },
                    () => {
                        this.GetCrumbs();
                    }
                );
            } else {
                this.GetCrumbs();
            }
        },
        // 获取筛选一级分类
        GetCrumbs(ids, callBack) {
            let data = {
                busContsCode: baseConstant.busContsCode,
                pageSize: 0,
                pageNum: 0,
                platformCode: this.classId,
                goodsClassIds: !!ids ? ids : null
            };
            Cms.getCrumbs(data).then(res => {
                res.list.forEach((item, index) => {
                    item.list = []; //  二级面包屑数组
                    item.ishow = false; // 控制展示更多按钮
                });
                this.CrumbsName = res.list;
            });
            callBack && callBack();
        },
        // 获取筛选二级分类
        getDetails() {
            if (!this.ptiPartHdId) return;
            let data = {
                ptiPartHdIds: this.ptiPartHdId
            };
            this.CrumbsName.forEach(item => {
                if (!item.list || item.list.length <= 0) item.list = [];
            });
            if (this.CrumbsName.length > 0) {
                Cms.getCrumbsDetail(data).then(res => {
                    if (!!res.length && !!res.length > 0) {
                        this.CrumbsName.forEach(item => {
                            res.forEach(sort => {
                                if (
                                    item.list.length <= 0 &&
                                    item.escrumbsCode === sort.crumbsCode
                                ) {
                                    item.list = sort.crumbsList;
                                }
                            });
                        });
                    }
                });
            } else {
                let length = 0;
                let interval = setInterval(() => {
                    if (this.CrumbsName.length > 0 || ++length >= 100) {
                        clearInterval(interval);
                        Cms.getCrumbsDetail(data).then(res => {
                            if (!!res.length && !!res.length > 0) {
                                this.CrumbsName.forEach(item => {
                                    res.forEach(sort => {
                                        if (
                                            item.list.length <= 0 &&
                                            item.escrumbsCode ===
                                                sort.crumbsCode
                                        ) {
                                            item.list = sort.crumbsList;
                                        }
                                    });
                                });
                            }
                        });
                    }
                }, 100);
            }
        },
        // 点击展示更多
        showDetails(items) {
            items.ishow = !items.ishow;
            this.$set(items, "ishow", items.ishow);
        },
        // 二级分类目下的选择
        choice(it, index, item) {
            var that = this;
            item.n = index;
            this.CrumbsName = JSON.parse(JSON.stringify(this.CrumbsName));
            this.$set(it, "escrumbsCode", item.escrumbsCode);
            that.flags.push(it);
            var arr = [];
            var map = {};
            that.flags.forEach(item => {
                if (item.id !== "") {
                    map.queryField = item.escrumbsCode;
                    map.value = item.id.toString();
                    map.filterMode = true;
                    map.operate = "AND";
                    arr.push(map);
                    map = {};
                }
            });
            let filters = [
                {
                    operate: "AND",
                    filterList: arr
                }
            ];
            this.crumbs = filters;
        },
        // 筛选重置
        reset() {
            this.CrumbsName.forEach(item => {
                item.n = null;
            });
            this.flags = [];
            this.crumbs = [];
            this.goodsList = [];
            this.getGoodsList();
        },
        // 筛选确定
        sure() {
            this.showfifter = false;
            this.pageNum = 1;
            this.goodsList = [];
            this.getGoodsList();
        },
        changeSort(sortParam) {
            if (sortParam !== "price" && sortParam === this.sortParam) return;
            else {
				if (this.sortParam !== sortParam) {
					this.goodsList = [];
					this.pageNum = 1;
				}
				this.sortParam = sortParam;
				if (this.sortParam === "recmSeq") {
					this.sortParamData = [{ field: "recmSeq", order: "DESC" }];
				} else if (this.sortParam === "sales") {
					this.sortParamData = [{ field: "sales", order: "DESC" }];
				} else if (this.sortParam === "price") {
					if (this.sort === "DESC") {
						this.sort = "ASC";
						this.pageNum = 1;
						this.sortParamData = [{ field: "price", order: "ASC" }];
						this.goodsList = [];
					} else {
						this.sort = "DESC";
						this.pageNum = 1;
						this.sortParamData = [
							{ field: "price", order: "DESC" }
						];
						this.goodsList = [];
					}
				}
                this.getGoodsList(sortParam);
            }
        },

        //  获取商品墙
        getGoodsList(sortParam, filters) {
            var data = {
                usrId: this.userInfo.usrId,
                busContsCode: baseConstant.busContsCode,
                companyId: this.userInfo.companyId,
                shopId: this.userInfo.shopId,
                pageNum: this.pageNum,
                pageSize: 10,
                origin: "",
                filters: JSON.stringify(this.crumbs), // 面包屑,
                keyword: this.$route.query.keyWord || "",
                sortParam: JSON.stringify(this.sortParamData),
                queryNullBusFlag: 1,
                orderFlags: JSON.stringify([0, 1]), // 巴龙PC的需求只查询大货和定制商品
                couponId: this.couponId,
                onlineFlag: 1 //显示促销标识
            };
            if (filters && filters !== undefined) {
                data.filters = JSON.stringify(filters);
            }
            if (!!this.$route.query.classId) {
                data.platformCode = this.$route.query.classId;
            }
            this.loading = true;
            Goods.getGoodsList(data)
                .then(
                    res => {
                        console.log(res.ptiPartHdIds, "res.ptiPartHdIds");
                        this.ptiPartHdId = res.ptiPartHdIds;
                        this.goodsList.push.apply(this.goodsList, res.hits);
                        this.loading = false;
                        if (
                            this.goodsList.length >=
                                parseInt(res.pagination.totalCount) ||
                            parseInt(this.pageNum) >=
                                parseInt(res.pagination.totalPage)
                        ) {
                            this.finished = true;
                        } else {
                            this.finished = false;
                        }
                    },
                    err => {
                        this.loading = false;
                    }
                )
                .then(() => {
                    this.loading = false;
                    //  获取面包屑详情
                    this.getDetails();
                });
        },

        //  加载更多商品
        loadMore() {
            if (this.finished === true) {
                Toast("没有更多了~");
                return;
            } else {
                this.pageNum += 1;
                this.getGoodsList();
            }
        },

        //  商品跳转
        goDetail(item) {
            if (item.orderFlag === 1) {
                this.$router.push(
                    "/goods/web-design?goodsCode=" + item.goodsCode
                );
            } else {
                this.$router.push("/goods-detail?goodsCode=" + item.goodsCode);
            }

            // 商品跳转前校验上下架
            //				this.isShelve(item.goodsCode).then(res => {
            //					if(!!res) {
            //						if (item.orderFlag === 1) {
            //							this.$router.push("/goods/web-design?goodsCode=" + item.goodsCode);
            //						} else {
            //							this.$router.push("/goods-detail?goodsCode=" + item.goodsCode);
            //						}
            //                    }else{
            //						this.$router.push("/off-shelves");
            //                    }
            //                })
        }
    },
    created() {
        this.userInfo = Storage.get("USER_INFO");
        this.keyWord = !!this.$route.query.keyWord
            ? decodeURIComponent(this.$route.query.keyWord)
            : "";
        this.couponId = this.$route.query.couponId
            ? this.$route.query.couponId
            : ""; //优惠券id
        this.classId = this.$route.query.classId
            ? this.$route.query.classId
            : ""; //分类id
        // this.getCrumbs();
        if(!!this.$route.query.rmSize){
            Storage.set("rmSize", this.$route.query.rmSize=="-1"?"":this.$route.query.rmSize)
        }
        this.getGoodsList();
        this.getCrumbsIds();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.none-tip {
    margin-top: computed(30);
    font-size: computed(24);
    line-height: computed(26);
    color: #0d0e09;
    text-align: center;
}

.goods-list {
    padding-top: computed(200);
    padding-bottom: computed(120);
    overflow: hidden;
    position: relative;
}

.search-box {
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    top: 0;
    overflow: hidden;
    padding: computed(30) computed(30) 0 computed(30);
    z-index: 9;
    background: #ffffff;
}

.search-box::after {
    content: "";
    display: table;
    clear: both;
}

.search {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: computed(70);
    float: left;
    padding: 0 computed(64);
    border: solid 1px #cccccc;
    vertical-align: middle;
    overflow: hidden;
}

.search .icon-sousuo {
    font-size: computed(32);
    line-height: computed(70);
    position: absolute;
    top: 0;
    left: computed(12);
    color: #cccccc;
}

.search .icon-guanbi {
    font-size: computed(30);
    line-height: computed(70);
    position: absolute;
    top: 0;
    right: computed(20);
    color: #cccccc;
}

.search .default-word {
    display: block;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: computed(68);
    margin: 0 auto;
    font-size: computed(30);
    line-height: computed(68);
    color: #cccccc;
    border: none;
}

.tab-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 computed(30);
    font-size: computed(32);
    line-height: computed(34);
    color: #454545;
    border-bottom: solid 1px #cccccc;
    position: fixed;
    top: computed(100);
    z-index: 9;
    background: #ffffff;
}

.tab-list .tab-item {
    box-sizing: border-box;
    padding: computed(30) 0;

    .icon-xialaxuan {
        display: inline-block;
    }
}

.tab-list .tab-item.act {
    color: #2ba4f3;
    border-bottom: solid 1px #2ba4f3;
}

.rotate {
    transform: rotate(180deg);
}

.list-content {
    position: relative;
    overflow: hidden;
    margin: 0 computed(30);
    padding-bottom: computed(20);
}

.list-content::after {
    content: "";
    display: table;
    clear: both;
}

.list-content .goods-item {
    float: left;
    width: computed(330);
    margin-top: computed(20);
    font-size: computed(28);
    line-height: computed(30);
    position: relative;
}

.list-content .goods-item:nth-child(2n) {
    float: right;
}

.goods-item .goods-cover {
    width: computed(330);
    height: computed(330);
    overflow: hidden;
}

.goods-cover img {
    width: 100%;
    height: 100%;
}

.goods-name {
    line-height: computed(38);
    margin-top: computed(4);
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: text-bottom;
}

.goods-price {
    white-space: nowrap;
    word-break: keep-all;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: computed(12);
}

.sale-price {
    color: #0d0e09;
}

.tag-price {
    margin-left: computed(10);
    color: #999999;
    text-decoration: line-through;
}
.select-box {
    box-sizing: border-box;
    width: computed(596);
    height: 100%;
    background: #ffffff;
    overflow: scroll;
    .select-popup-box {
        box-sizing: border-box;
        position: relative;
        min-height: 100%;
        padding-bottom: computed(110);
        overflow: hidden;
    }
}
.type-content {
    margin: computed(30) 0 0 computed(30);
}

.type-title {
    position: relative;
    padding-bottom: computed(20);
    font-size: computed(32);
    line-height: computed(34);
    color: #0d0e09;
    border-bottom: solid 1px #bdbdbd;
}

.type-title .act {
    float: right;
    margin-right: computed(30);
    font-size: computed(30);
    line-height: computed(32);
    &.show-list {
        transform: rotate(180deg);
    }
}

.type-title .default {
    float: right;
    margin-right: computed(30);
    font-size: computed(30);
    line-height: computed(32);
    transform: rotate(180deg);
}

.type-title .default::before {
    content: "∨";
}

.type-list {
    position: relative;
    overflow: hidden;
}

.type-list::after {
    content: "";
    display: table;
    clear: both;
}

.type-list .type-item {
    float: left;
    margin: computed(8) computed(30) 0 0;
    font-size: computed(28);
    line-height: computed(50);
    color: #0d0e09;
}

.type-list .type-item.selected {
    margin-right: computed(20);
    padding: 0 computed(10);
    background: #2ba4f3;
    color: #ffffff;
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
// 面包屑弹出层
.van-popup {
    height: 100%;
    margin-top: computed(-2);
    .good-fifter {
        height: 92%;
        width: computed(660);
        overflow-x: hidden;
        // overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        // background-color: $color-white;

        .fifter-content {
            margin: computed(20) 0 computed(150) 0;
        }
        .fifter-header {
            text-align: left;
            padding-top: computed(30);
        }
        .content-box {
            padding: computed(20);
            font-size: $font-regular;
            .title {
                width: 100%;
                position: relative;
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                font-size: $font-h2;
                padding-bottom: computed(25);
                border-bottom: computed(1) solid rgba(189, 189, 189, 1);
                .iconfont {
                    font-size: $font-regular;
                }
            }
        }
        .contents {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-start;
            text-align: center;
            p {
                width: computed(150);
                height: computed(50);
                line-height: computed(50);
                font-size: $font-regular;
                margin-top: computed(20);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .checked {
                background: #2ba4f3;
                color: $color-white;
            }
        }
    }
    .fifter-bottom {
        width: 90%;
        height: computed(97);
        line-height: computed(97);
        text-align: center;
        position: absolute;
        bottom: 0;
        left: computed(35);
        z-index: 9999;
        box-shadow: 0 computed(1) 0 0 rgba(230, 230, 230, 1);
        display: flex;
        justify-content: space-around;
        .select-btn {
            display: inline-block;
            width: computed(240);
            height: computed(78);
            font-size: $font-regular;
            line-height: computed(78);
            text-align: center;
            color: #ffffff;
        }
        .reset-btn {
            background: #808080;
        }

        .sure-btn {
            background: #2ba4f3;
        }
    }
}
.empty-box {
    height: computed(400);
    padding-top: computed(250);
    position: fixed;
}
</style>
