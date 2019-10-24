<template>
    <div class="sku-dialog">
        <!--关闭弹窗-->
        <p class="iconfont icon-guanbi" @click="closePopup()"></p>
        <div class="sku-dialog-body">
            <!--商品信息-->
            <div class="sku-dialog-header">
                <div class="goods-cover">
                    <img v-lazy="getImg(colorImage, '186*186')" onerror="errImg(event)">
                </div>
                <div class="goods-info">
                    <p class="goods-price">￥{{ goodsInfo.salePrice | fixed2 }}</p>
                    <p class="goods-choice">已选择：{{ this.colorName + ' ' + this.sizeName }}</p>
                </div>
            </div>

            <!-- 颜色 -->
            <h2 class="sku-dialog-title">颜色</h2>
            <ul class="sku-dialog-slider-small">
                <li v-for="(item, index) in goodsColor" :key="index"
                    :class="[{'none' : goodsStock <=0 || !sellFlag || !item.canSelectFlag}, {'active' : item.colorCode === colorCode}]"
                    @click="changSlider(item)">
                    {{ item.colorName }}
                </li>
            </ul>

            <!-- 尺码 -->
            <h2 class="sku-dialog-title">尺码</h2>
            <div class="sku-dialog-size">
                <ul>
                    <li v-for="item in goodsSize"
                        :class="[{'none': goodsStock <=0 || !sellFlag || !item.canSelectFlag} , {'active': item.sizeCode === sizeCode}]"
                        @click="choseSize(item)">{{item.sizeName}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="sku-dialog-sure" @click="sureSubmit()">确定</div>
    </div>
</template>

<script>
    import Storage from "../util/storage";
    import { Goods, } from "../api/service";
    export default {
        name: 'sku-dialog',
        components: {},
        props: {
            // 接收商品编码
            goodsCode: {
                type: String
            },
            // 默认选中颜色名
            colorName: {
                type: String,
                default: ''
            },
            // 默认选中尺码名
            sizeName: {
                type: String,
                default: ''
            },
            isShowPopup: {
                type: String
            }
        },
        data() {
            return {
                goodsInfo: [],
                goodsColor: [],
                goodsSize: [],
                colorCode: '',
                sizeCode: '',
                colorImages: '',
                colorImage: '',
            }
        },
        computed: {
            //  商品
            goodsSkuId: function () {
                let goodsSkuId = ''
                this.stockList.forEach((item) => {
                    if (item.sizeCode === this.sizeCode && item.colorCode === this.colorCode) {
                        goodsSkuId = item.skuId
                    }
                });
                return goodsSkuId
            },

            //  库存校验
            goodsStock: function () {
                let stock = 0
                if (!!this.sizeCode && !!this.colorCode) {
                    console.log(1)
                    for (let i = 0; i < this.stockList.length; i++) {
                        if (this.stockList[i].skuId === this.goodsSkuId) {
                            stock = this.stockList[i].skuQty
                            return stock
                        }
                    }
                } else if (!!this.sizeCode && !this.colorCode) {
                    console.log(2)
                    for (let i = 0; i < this.stockList.length; i++) {
                        if (this.stockList[i].sizeCode === this.sizeCode) {
                            stock += this.stockList[i].skuQty
                        }
                    }
                } else if (!this.sizeCode && !!this.colorCode) {
                    console.log(3)
                    for (let i = 0; i < this.stockList.length; i++) {
                        if (this.stockList[i].colorCode === this.colorCode) {
                            stock += this.stockList[i].skuQty
                        }
                    }
                } else if (!this.sizeCode && !this.colorCode) {
                    console.log(4)
                    stock = this.goodsQty
                }
                return stock
            },
        },
        created() {
            this.getGoodsInfo();
        },
        methods: {
            //  查询商品详情
            getGoodsInfo() {
                this.goodsInfo = [];
                let data = {
                    busContsCode: baseConstant.busContsCode,
                    goodsCode: this.goodsCode,
                    shopCode: Storage.get("properties").shopCode,
                    userId: Storage.get("USER_INFO").usrId
                };
                Goods.getGoodsInfo(data).then((res) => {
                    this.goodsColor = [];
                    let images = [];
                    this.goodsInfo = res;
                    // 获取颜色列表
                    let colorList = res.colorsVoList;
                    colorList.forEach((item) => {
                        item.act = false
                        item.stocks = ""  // 库存
                        item.effFlag = ''  // 上下架
                        item.canSelectFlag = 1  // 是否可选
                    });

                    if (this.goodsColor.length === 0) {
                        this.goodsColor.push(colorList[0]);
                    }
                    //  去掉重复的颜色选项
                    let arr = [];
                    colorList.forEach((item) => {
                        this.goodsColor.forEach((colorItem) => {
                            arr.push(colorItem.colorId);
                        });
                        if (arr.indexOf(item.colorId) === -1) {
                            this.goodsColor.push(item);
                        }
                    });
                    //  获取尺码列表
                    let sizeList = res.sizesVoList;
                    sizeList.forEach((item) => {
                        item.act = false;
                        item.stocks = "";
                        item.effFlag = '';  // 上下架
                        item.canSelectFlag = 1  // 是否可选
                    });
                    this.goodsSize = sizeList;
                    if (res.colorsVoList.length && res.colorsVoList.length > 0) {
                        res.colorsVoList.forEach((item) => {
                            if (item.urls) {
                                images.push.apply(images, item.urls);
                                if (item.urls !== null && item.urls.length > 0) {
                                    item.lumpThumb = item.urls[0]
                                }
                            }
                        })
                    } else {
                        if (res.url) {
                            images.push(res.url);
                        } else {
                            let defaultUrl = "require('../assets/images/no-image.jpg')";
                            images.push(defaultUrl);
                        }
                    }
                    this.colorImages = images;
                });
            },
            /**
             * 颜色选择
             * 滑动轮播结束，返回索引值
             * @param index 当前轮播的索引
             */
            changSlider(item) {
                this.colorImage = item.lumpThumb;

                // 优先判断反选
                if(item.colorCode === this.colorCode) {
                    this.colorCode = "";
                    this.goodsSize.forEach((sizeItem) => {
                        sizeItem.stocks = ""
                        sizeItem.effFlag = ''
                        sizeItem.canSelectFlag = 1
                    });
                    this.colorImages = this.images;
                    this.colorName = '';
                } else {
                    if (this.goodsStock <= 0 || this.sellFlag === 0 || item.stocks === 0 || item.effFlag === 0 || item.canSelectFlag == 0) {
                        this.$toast('该类商品库存不足或已下架')
                        return;
                    }else {
                        this.colorCode = item.colorCode
                        this.colorImages = item.urls
                        this.colorName = item.colorName;
                    }
                }
                //  通过选择的颜色判断尺码库存
                if (!!this.colorCode) {
                    for (let i = 0; i < this.stockList.length; i++) {
                        if (this.stockList[i].colorCode === this.colorCode) {
                            this.goodsSize.forEach((sizeItem) => {
                                if (sizeItem.sizeCode === this.stockList[i].sizeCode) {
                                    sizeItem.stocks = this.stockList[i].skuQty;
                                    sizeItem.effFlag = this.stockList[i].effFlag;
                                    if (this.stockList[i].skuQty >= 1 && this.stockList[i].effFlag >0) {
                                        sizeItem.canSelectFlag = 1
                                    } else {
                                        sizeItem.canSelectFlag = 0
                                    }
                                }
                            });
                        }
                    }
                }
            },

            /* 尺码选择 */
            choseSize(item) {

                // 优先判断反选
                if (item.sizeCode === this.sizeCode) {
                    this.sizeCode = ''
                    this.goodsColor.forEach((colorItem) => {
                        colorItem.stocks = ''
                        colorItem.effFlag = ''
                        colorItem.canSelectFlag = 1
                    });
                    this.sizeName = '';
                }else{
                    if (this.goodsStock <= 0 || this.sellFlag === 0 || item.stocks === 0 || item.effFlag === 0 || item.canSelectFlag === 0) {
                        this.$toast('该类商品库存不足或已下架')
                        return;
                    }else {
                        this.sizeCode = item.sizeCode;
                        this.sizeName = item.sizeName;
                    }
                }

                //  通过选择的尺码判断颜色库存
                if (!!this.sizeCode) {
                    for (let i = 0; i < this.stockList.length; i++) {
                        if (this.stockList[i].sizeCode === this.sizeCode) {
                            this.goodsColor.forEach((colorItem) => {
                                if (colorItem.colorCode === this.stockList[i].colorCode) {
                                    colorItem.stocks = this.stockList[i].skuQty;
                                    colorItem.effFlag = this.stockList[i].effFlag;
                                    if (this.stockList[i].skuQty >= 1 && this.stockList[i].effFlag >0) {
                                        colorItem.canSelectFlag = 1
                                    } else {
                                        colorItem.canSelectFlag = 0
                                    }
                                }
                            });
                        }
                    }
                }
            },
            // 确认按钮
            sureSubmit() {

            },
            // 关闭弹窗
            closePopup() {
                this.isShowSkuCard = false
            }
        }
    }
</script>

<style scoped lang="scss">
    .sku-dialog {
        position: relative;
        .icon-guanbi {
            font-size: computed(32);
            color: #ccc;
            text-align: right;
            position: absolute;
            right: computed(30);
            top: computed(30);
            z-index: 9999;
        }
        .sku-dialog-body {
            width: 100%;
            height: calc(100% - 7.3%);
            /*height: 100%;*/
            overflow-y: auto;
            padding: computed(30);
            box-sizing: border-box;
            .sku-dialog-slider {
                img {
                    width: 100%;
                    height: computed(750);
                    display: block;
                }
            }
            .sku-dialog-header {
                display: flex;
                .goods-cover {
                    width: computed(186);
                    height: computed(186);
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .goods-info {
                    width: 50%;
                    display: flex;
                    margin-left: computed(30);
                    flex-direction: column;
                    justify-content: flex-end;
                    .goods-price {
                        color: #2BA4F3;
                        font-size: computed(30);
                        margin-bottom: computed(18);
                    }
                    .goods-choice {
                        color: #333333;
                        font-size: computed(28);
                    }
                }
            }
            .sku-dialog-slider-small {
                margin: computed(30) 0;
                li {
                    display: inline-block;
                    padding: computed(20) computed(18);
                    margin: 0 computed(15) 0 0;
                    box-sizing: border-box;
                    border: 1px solid #666666;
                    color: #666;
                    font-size: computed(18);
                    img {
                        display: block;
                        height: computed(104);
                        width: computed(104);
                        margin: computed(5);
                        pointer-events: none;
                    }
                    &.active {
                        border: 1px solid $maincolor;
                        color: $maincolor;
                    }
                    &.none {
                        border: 1px dotted #CCCCCC;
                        color: #999999;
                    }
                }
            }
            .sku-dialog-title {
                text-align: left;
                font-size: computed(28);
                color: #333333;
                margin-top: computed(50);
            }
            .sku-dialog-size {
                /*margin-bottom: computed(120);*/
                margin-bottom: computed(20);
                ul {
                    display: inline-block;
                    overflow-x: auto;
                    overflow-y: hidden;
                    width: 100%;
                    height: computed(85);
                    white-space: nowrap;
                    font-size: 0;
                    margin-top: computed(20);
                    li {
                        display: inline-block;
                        width: computed(200);
                        height: computed(78);
                        line-height: computed(78);
                        font-size: computed(24);
                        border: 1px solid #666666;
                        margin-right: computed(20);
                        color: rgba(102, 102, 102, 1);
                        text-align: center;
                        &:last-child {
                            margin-right: computed(30);
                        }
                        &.none {
                            border: 1px dashed #cccccc;
                            color: #d9d9d9;
                        }
                        &.active {
                            border: 1px solid $maincolor;
                            color: $maincolor;
                            position: relative;
                            /*&::after {*/
                            /*position: absolute;*/
                            /*content: " ";*/
                            /*width: computed(28);*/
                            /*height: computed(28);*/
                            /*background-image: url("../../assets/images/goods/active.png");*/
                            /*background-size: 100% 100%;*/
                            /*bottom: 0;*/
                            /*right: 0;*/
                            /*}*/
                        }
                    }
                }
                .result {
                    font-size: computed(24);
                    color: $maincolor;
                    margin: 0 0 0 computed(30);
                }
            }
        }
        .sku-dialog-sure {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: $maincolor;
            color: white;
            height: computed(100);
            font-size: computed(36);
            text-align: center;
            line-height: computed(100);
        }
    }
</style>
