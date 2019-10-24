/*
* createTime：2018/11/1
* author：fujie.wen
* description: 首页
*/
<template>
    <div class="container">
        <div class="main">
            <!--导航-->
            <div class="main-left" ref="mainLeft">
                <ul class="tab-list _footer-bar-padding">
                    <li
                        :class="['tab-list-item',{'item-selected':index===activeTabIndex}]"
                        @click="checkNav(item,index)"
                        :key="item.cmsBusconclaHdCode"
                        v-for="(item,index) in classList"
                    >
                        {{item.cmsBusconclaHdName}}
                        <div class="selected-border"></div>
                    </li>
                </ul>
            </div>

            <!--右侧内容-->
            <div class="main-right">
                <!--面料-->
                <!--<div class="material">-->
                <!--<div class="material-title">-->
                <!--<span>面料品牌</span>-->
                <!--</div>-->
                <!--<ul class="material-list">-->
                <!--<li class="material-list-item" v-for="item in [1,2,3,4]">-->
                <!--<img src="@/assets/images/show/test1.png" alt="">-->
                <!--</li>-->
                <!--</ul>-->
                <!--</div>-->
                <div ref="rightCont" :style="{paddingBottom: needAddHeight+'px'}">
                    <div
                        class="material-parent"
                        ref="anchor"
                        :id="'anchor'+classIndex"
                        v-for="(classItem,classIndex) in classList"
                        :key="classItem.cmsBusconclaHdCode"
                    >
                        <div class="material2">
                            <div class="material2-title" @click="goListPage(classItem)">
                                <span>{{classItem.cmsBusconclaHdName}}</span>
                                <i class="iconfont icon-youfan"></i>
                            </div>
                            <ul class="material2-list">
                                <li
                                    class="material2-list-item"
                                    :key="item.cmsBusconclaHdCode"
                                    @click="goListPage(item)"
                                    v-for="(item,index) in classItem.childs"
                                >
                                    <img :src="getImg(item.picUrl, '150*150')" onerror="errImg(event)" alt />
                                    <div class="item-describe">{{item.cmsBusconclaHdName}}</div>
                                </li>
                            </ul>
                            <!--测试用数据-->
                            <!--<ul class="material2-list">-->
                            <!--<li class="material2-list-item"-->
                            <!--v-for="item in [1,2,3,4,5]" >-->
                            <!--<img src="@/assets/images/show/test1.png" alt="">-->
                            <!--<div class="item-describe">{{item}}</div>-->
                            <!--</li>-->
                            <!--</ul>-->
                        </div>
                    </div>
                    <!--撑起底部导航距离-->
                    <div class="_footer-bar-padding"></div>
                </div>
            </div>
        </div>

        <!--底部导航-->
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import { Goods } from "../../api/service";
import FooterBar from "@/components/FooterBar";
import Storage from "../../util/storage";
import BScroll from "better-scroll";

export default {
    components: { "footer-bar": FooterBar },
    data() {
        return {
            activeTabIndex: 0, // 当前标签索引
            classList: [], //分类列表
            listArea: [],
            globalScrollHeight: 0,
            needAddHeight: 0 //设置底部需增加高度
        };
    },
    computed: {
        navIndex() {
            if (this.globalScrollHeight == 0) {
                return 0;
            }
            for (let i = this.listArea.length - 1; i > 0; i--) {
                if (this.globalScrollHeight > this.listArea[i] - 30) {
                    if (i > this.listArea.length - 2) {
                        return this.listArea.length - 2;
                    }
                    return i;
                }
            }
        }
    },
    methods: {
        // 商品墙页跳转
        goListPage(item) {
            this.$router.push("/goods-list?classId=" + item.cmsBusconclaHdCode);
        },

        // 点击tab 定位锚点
        checkNav(item, index) {
            let scrollHeight = -(this.listArea[index] + 6 * (index + 1)) + 30;
            this.activeTabIndex = index;
            this._scroll.scrollTo(0, scrollHeight, 0);
        },

        // 获取导航栏元素
        getNavList() {
            let data = {
                companyId: Storage.get("COMPANYID").company_id,
                busContsCode: baseConstant.busContsCode,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                layer: "3"
            };
            Goods.getGoodsLayerClass(data).then(res => {
                this.classList = res[0].childs;
                this.$nextTick(() => {
                    this.initScroll();
                    this.setAddBottomHeight();
                });
            });
        },
        // 设置底部需增加高度 解决滑动右侧高度不够无法定位tab标签
        setAddBottomHeight() {
            let fullHeight = document.documentElement.clientHeight; // 屏幕高度
            // 屏幕高度 - 最后一块高度
            this.needAddHeight =
                fullHeight -
                this.$refs.anchor[this.classList.length - 1].clientHeight -
                50;
        },

        // 初始化better scroll
        initScroll() {
            this._scroll = new BScroll(".main-right", {
                scrollY: true,
                click: true,
                probeType: 3
            });
            this.globalHeight = 0;
            // 获取分类高度 组成数组
            this.listArea = this.$refs.anchor.map((item, index) => {
                this.globalHeight += item.clientHeight;
                return this.globalHeight + 35;
            });
            this.listArea.unshift(0);
            this._scroll.on("scroll", pos => {
                this.globalScrollHeight = -parseInt(pos.y, 0);
                // 随着右侧滚动时，左侧也跟着滚动
                if (pos.y < -550) {
                    this.$refs.mainLeft.scrollTop = 350;
                } else {
                    this.$refs.mainLeft.scrollTop = 0;
                }
            });
        }
    },
    created() {
        this.getNavList();
    },
    watch: {
        navIndex(val) {
            // console.log(val, "vall");
            this.activeTabIndex = val;
        }
    }
};
</script>

<style scoped lang="scss">
._footer-bar-padding {
    padding-bottom: computed(98);
}
.container,
.main {
    height: 100%;
}
.main {
    display: flex;
}
.main-left {
    background: #ffffff;
    width: computed(180);
    height: 100%;
    overflow: auto;
    border-right: computed(1) solid rgba(230, 230, 230, 1);
}
.tab-list {
    .tab-list-item {
        text-align: center;
        color: #666666;
        font-size: computed(28);
        padding: computed(30) 0;
        // line-height: computed(90);
        position: relative;

        &.item-selected {
            color: #2ba4f3;
            .selected-border {
                display: block;
            }
        }
        .selected-border {
            border-left: computed(8) solid #2ba4f3;
            height: computed(44);
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: computed(-22);
            display: none;
        }
    }
}
.main-right {
    flex: 1;
    height: 100%;
    overflow-y: hidden;
    box-sizing: border-box;
}
.material {
    text-align: center;
    padding: 0 computed(30);
}
.material-title {
    font-size: computed(28);
    font-weight: bold;
    padding: computed(60) 0;
}
.material-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: computed(15);

    .material-list-item {
        margin-bottom: computed(30);
        img {
            width: computed(150);
            height: computed(88);
        }
    }
}

.material2 {
    // border-top: computed(1) solid #dbdbdb;
    text-align: center;
    padding: 0 computed(30);
}
.material-parent {
    &:first-child {
        .material2 {
            border-top: none;
        }
    }
}
.material2-title {
    font-size: computed(30);
    padding: computed(30) 0 computed(25) 0;
    border-bottom: computed(1) solid #cccccc;

    span {
        // font-size: computed(28);
        font-weight: bold;
    }

    i {
        font-size: computed(28);
        line-height: computed(28);
        margin-left: computed(10);
    }
}
.material2-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: computed(15);

    .material2-list-item {
        width: 33.33%;
        padding-top: computed(30);

        img {
            width: computed(150);
            height: computed(150);
        }
        .item-describe {
            margin-top: computed(30);
            font-size: computed(24);
            text-align: center;
        }
    }
}
</style>