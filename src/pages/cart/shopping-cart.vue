/*
* createTime：2018/7/12
* author：en.chen
* description:  购物车
*/
<template>
    <div :class="['shopping-cart', { 'shop-card-pb': isKeyBoardHide }]">
        <!--购物车列表-->
        <div class="goods-item" v-for="(item, index) in shopCartList" :key="item.id">

            <!--选择框 begin-->
            <div class="select-box" :class="{'dis': (item.inventory <= 0 && item.orderFlag === 0 ) || !item.stockFlag || !item.sellFlag}">
                <input class="checkInput" name="shopCart" type="checkbox" v-model="checkedList" :value="item.id" :disabled="(item.inventory <= 0 && item.orderFlag === 0 ) || !item.stockFlag || !item.sellFlag">
                <i class="van-checkbox__icon" :class="{ 'checked' : checkedList.indexOf(item.id) !== -1 }" :for="item.id"></i>
            </div>
            <!--选择框 end-->

            <!--商品封面 begin-->
            <div class="goods-header">
                <div class="goods-cover" @click="goDetail(item)">
                    <img :src="getImg(item.url, '150*150')" alt="" onerror="errImg(event)">
                    <div class="diy-icon" v-if="item.orderFlag === 1"></div>
                </div>
                <p class="goods-depreciate" v-if="item.firstPrice - item.dealPrice > 0">
                    比加入时优惠<br>
                    ¥{{ item.firstPrice - item.dealPrice | $goldDivide }}
                </p>
                <!--大货、定制商品下架判断-->
                <p class="goods-stock-tip" v-if="!item.sellFlag || item.sellFlagStatus === 0">已下架</p>

                <!--大货商品-->
                <div v-if="item.orderFlag === 0">
                    <!--库存不足判断 上架 && 库存不足才显示-->
                    <p class="goods-stock-tip" v-if="item.sellFlag && (item.amount > item.inventory)">库存不足</p>
                    <!--已售罄(二期不做，放下期)-->
                    <!--<p class="goods-stock-tip" v-if="item.sellFlag === 1 && item.inventory === 0">已售罄</p>-->
                </div>

                <!--定制商品-->
                <div v-if="item.orderFlag === 1">
                    <!--库存不足判断 stockFlag库存 sellFlag上架-->
                    <p class="goods-stock-tip" v-if="!item.stockFlag && (item.sellFlag || item.sellFlagStatus !== 0)">库存不足</p>
                </div>
            </div>
            <!--商品封面 end-->

            <!--商品详情 begin-->
            <div class="goods-info">
                <div class="delete-btn" @click="cartDelete(item.id)">
                    <i class="iconfont icon-shanchuguanbi"></i>
                </div>
                <p class="goods-name">{{item.goodsName}}</p>
                <div class="goods-price">
                    <div class="price-box">
                        <p class="sale-price">￥{{item.dealPrice | $goldDivide}}</p>
                        <p v-if="!!item.tagPrice && item.tagPrice > 0" class="old-price">￥{{item.tagPrice | $goldDivide}}</p>
                    </div>
                    <div class="count-box">
                        <div class="count-btn reduce-btn" @click="reduceCount(item)"><i class="iconfont icon-jianshao"></i></div>
                        <!-- v-inputfix -->
                        <!-- _keyBoard('count_input_'+index) -->
                        <!-- :id="'count_input_'+index" -->
                        <input @focus="isKeyBoardHide = false"
                               @blur="isKeyBoardHide = true"
                               class="count_input"
                               v-model="item.amount"
                               :disabled="!item.sellFlag"
                               type="tel"
                               @change="changeCount(item)"
                               pattern="[0-9]*" />
                        <div class="count-btn add-btn" @click="addCount(item)"><i class="iconfont icon-zengjia"></i></div>
                    </div>
                </div>

                <!-- 大货商品 begin -->
                <div v-if="item.orderFlag === 0">
                    <!-- 上架了才会显示库存 -->
                    <p class="goods-stock-tip" v-if="item.sellFlag && item.inventory > 0 && item.amount >= item.inventory">库存剩余{{item.inventory}}</p>
                    <div class="goods-sku-box">
                        <div class="goods-sku-content">
                            <ul class="sku-item-list">
                                <!--sku选择修改为弹窗-->
                                <li>
                                    <p class="sku-name" @click="showSkuCard(item)" :class="[(!item.sellFlag || !item.simpleSkuInfoList) ? 'disabled' : '']">
                                        {{ item.sellFlag && item.inventory === 0 && item.amount >= item.inventory ? '重新选择商品规格' : item.colorName + '/' + item.sizeName}}
                                        <i class="iconfont icon-xialaxuan fr" :class="{'show-sku' : item.showColorArr === true }"></i>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!-- 大货商品 end -->

                <!-- 定制商品 begin -->
                <div v-if="item.orderFlag === 1" class="custom-list">
                    <div @click="showDetail(item)" class="title">
                        <span>定制清单</span>
                        <i :class="['iconfont icon-xialaxuan', {'tran' : item.customDetailFlag}]"></i>
                    </div>
                    <!--定制信息弹窗-->
                    <custom-dialog
                            fromPage="shoppingCart"
                            :mainFabricName="item.mainFabricName"
                            :partList="item.gsctPartDttAssfabricVos"
                            v-show="item.customDetailFlag"
                    ></custom-dialog>
                    <!--<ul v-show="item.customDetailFlag" class="detail">-->
                        <!--&lt;!&ndash; 主面料 &ndash;&gt;-->
                        <!--<li v-if="item.mainFabricName">主面料—{{item.mainFabricName}}</li>-->

                        <!--&lt;!&ndash; 部件信息 &ndash;&gt;-->
                        <!--<li v-for="partItem in item.gsctPartDttAssfabricVos">-->
                            <!--{{partItem.partname}}—{{partItem.fabricname}}-->
                        <!--</li>-->

                        <!--&lt;!&ndash; 绣花 &ndash;&gt;-->
                        <!--<li class="emb-print-part" v-for="partItem in item.gsctPartDttAssfabricVos" v-if="partItem.rtlCartDttEmbptDto">-->
                            <!--<span>绣花—{{partItem.regionName}}</span>-->
                            <!--<img :src="getImg(partItem.rtlCartDttEmbptDto.fileUrl)" onerror="errImg(event)">-->
                        <!--</li>-->

                        <!--&lt;!&ndash; 印花 &ndash;&gt;-->
                        <!--<li class="emb-print-part" v-for="partItem in item.gsctPartDttAssfabricVos" v-if="partItem.rtlCartDttPrintDto">-->
                            <!--<span>印花—{{partItem.regionName}}</span>-->
                            <!--<img :src="getImg(partItem.rtlCartDttPrintDto.fileUrl)" onerror="errImg(event)">-->
                        <!--</li>-->

                        <!--&lt;!&ndash; 绣字 &ndash;&gt;-->
                        <!--<li class="emb-part" v-for="partItem in item.gsctPartDttAssfabricVos" v-if="partItem.rtlCartDttEmbDto">-->
                            <!--<p>绣字—{{partItem.regionName}}</p>-->
                            <!--<p>-->
                                <!--<span>{{partItem.rtlCartDttEmbDto.ictEmbFontsHdName}}:</span>-->
                                <!--<span :style="{color: partItem.rtlCartDttEmbDto.colorNumberHx}">{{partItem.rtlCartDttEmbDto.embValue}}</span>-->
                            <!--</p>-->
                        <!--</li>-->
                    <!--</ul>-->
                </div>
                <!-- 定制商品 end -->
            </div>
            <!-- 商品详情 end -->

            <!-- 下架（遮罩） -->
            <!--<div v-show="!item.sellFlag || item.sellFlagStatus === 0" @click="goDetail(item)" class="bg-gray"></div>-->

        </div>

        <!-- 去逛逛 begin -->
        <div v-if="shopCartList.length <= 0 && showEmpty" class="shopping-cart-empty">
            <i class="iconfont icongouwuche"></i>
            <p class="info">购物车里空空如也，赶紧去逛逛吧</p>
            <span @click="navigate('/index')">去逛逛</span>
        </div>
        <!-- 去逛逛 end -->

        <!--清空失效商品-->
        <div class="clear-invalid" @click="clearInvalid" v-if="shopCartList.length > 0">清空失效商品</div>

        <!--底部按钮-->
        <div class="goods-actions" v-show="isKeyBoardHide">
            <div class="carts-info">
                <div class="van-checkbox" @click="checkedAll()" >
                    <i class="van-checkbox__icon" :class="{ 'checked': checkAll === true, 'un-checked': shopCartList.length === 0 }"></i>
                    <span class="checkbox-label">全选</span>
                </div>
                <div class="total-price">
                    合计：￥<span v-if="price - salesTotal > 0">{{ (price - salesTotal) | $goldDivide }}</span>
                           <span v-else>{{ price }}</span><br>
                    <p class="preferential" v-if="salesTotal > 0 && checkedList.length > 0">优惠减¥{{ salesTotal }}</p>
                </div>
            </div>
            <div class="buy-button" @click="buyNow">立即购买</div>
        </div>

        <!-- sku选择弹窗 -->
        <van-popup v-model="isShowSkuCard" position="bottom" :overlay="true" :lock-scroll="true" class="popup-add-card">
            <p class="iconfont icon-guanbi comment-close" @click="isShowSkuCard = false"></p>
            <div class="add-card-body">
                <div class="add-card-header">
                    <div class="goods-cover" @click="showBigColorImagesHeader = true">
                        <img v-lazy="getImg(colorImagesHeader)" onerror="errImg(event)">
                    </div>
                    <div class="goods-info">
                        <p class="goods-price" v-if="!!goodsInfo.tagPrice && goodsInfo.tagPrice !== 0 && (goodsInfo.dealPrice !== goodsInfo.tagPrice)">￥{{goodsInfo.tagPrice | $goldDivide}}</p>
                        <p class="goods-price" v-else>￥{{goodsInfo.dealPrice | $goldDivide}}</p>
                        <p class="goods-choice">已选择：{{ colorName + ' ' + sizeName }}</p>
                    </div>
                </div>
                <h2 class="add-card-title">颜色</h2>
                <ul class="add-card-slider-small">
                    <li v-for="(item, index) in goodsColor" :key="index"
                        :class="{'none':item.stucks === 0 , 'active': item.colorCode === colorCode}"
                        @click="changeSlider(index,item)">
                        {{ item.colorName }}
                    </li>
                </ul>
                <h2 class="add-card-title">尺码</h2>
                <div class="add-card-size">
                    <ul>
                        <li v-for="item in goodsSize"
                            :class="{'none':item.stucks === 0 , 'active': item.sizeCode === sizeCode}"
                            @click="changeSize(item)">
                            {{item.sizeName}}
                        </li>
                    </ul>
                </div>

                <!--&lt;!&ndash;数量&ndash;&gt;-->
                <!--<h2 class="add-card-title">数量</h2>-->
                <!--<div class="stepper">-->
                    <!--<van-stepper-->
                        <!--v-model="amount"-->
                        <!--@blur="handleBlur"-->
                        <!--:max="goodsStock">-->
                    <!--</van-stepper>-->
                    <!--<p class="goods-stock">库存：{{goodsStock}}</p>-->
                <!--</div>-->
            </div>
            <div class="add-card-sure" @click="sureChangeSku()"><span>确定</span></div>
        </van-popup>

        <!--sku弹窗大图-->
        <van-popup v-model="showBigColorImagesHeader" :overlay="true" :lock-scroll="true" :lazy-render="true" overlay-class="big-background">
            <div class="big-pic-box">
                <van-swipe :initial-swipe="commentImgIndex" :loop="false">
                    <van-swipe-item>
                        <img :src="getImg(colorImagesHeader)" class="bigPic" onerror="errImg(event)" @click="showBigColorImagesHeader = false"/>
                    </van-swipe-item>
                </van-swipe>
            </div>
        </van-popup>
    </div>
</template>
<script>
    import Storage from '../../util/storage'
    import { ShoppingCart, Order, Goods, UserService } from '../../api/service'
    import { Toast, Dialog, Popup, Swipe, SwipeItem, Stepper } from 'vant'
    import debounce from "@/util/debounce";
    import fastJson from '../../util/fastJsonRf'
    import CustomDialog from '@/components/CustomDialog'

    export default {
        components: {
            "van-popup": Popup,
            "van-swipe": Swipe,
            "van-swipe-item": SwipeItem,
            CustomDialog,
            // "van-stepper": Stepper,
        },
        data() {
            return {
                shopCartList: [],
                checkedList: [],  // 存放选中的商品id
                checkAll: false, // 全选状态
                ids: [],
                vipInfo: {},
                canSave: [],  // 购物车选中商品库存检验状态数组
                btnLock: false,  // 按钮锁
                isShowSkuCard: false,
                sliderIndex: 0,  // 轮播索引
                colorImagesMain: null,
                colorImagesHeader: null,
                images: [],
                goodsColor: [], // 商品颜色
                colorsVoList: [],
                goodsSize: [], // 商品尺寸
                stuckList: [],
                goodsInfo: [],
                goodsCode: '',
                colorItem: [], // 弹窗选中颜色
                colorCode: '', // 弹窗选中颜色编号
                colorName: '', // 弹窗选中颜色名
                sizeItem: [], // 弹窗选中尺码
                sizeCode: '', // 弹窗选中尺码编号
                sizeName: '', // 弹窗选中尺码名
                // amount: 1,
                noInventory: 0,  // 无库存的商品
                orderDetailIndex: -1,
                isKeyBoardHide: true,
                btnNumLock: false,//控制增加减少
                salesTotal: '',  // 已优惠价格
                showEmpty: false,
                commentImgIndex: 0,
                showBigColorImagesHeader: false, // sku弹窗大图
            }
        },

        //  监听是否全选
        watch:{
            'checkedList': function(){
                this.getVouchersInfo();
                if((this.shopCartList.length-this.noInventory) === this.checkedList.length){
                    this.checkAll = true;
                }else{
                    this.checkAll = false;
                }
            },
            checkAll(yes) {
                this.checkAll = yes;
            }
        },

        //  计算总价
        computed: {
            'price': function () {
                let price = 0;
                let vals = [];
                if( this.checkedList.length > 0) {
                    for(let i=0; i<this.checkedList.length; i++){
                        for(let j=0; j<this.shopCartList.length; j++){
                            if( this.checkedList[i] === this.shopCartList[j].id){
                                price+= (this.shopCartList[j].dealPrice * 1.0 ) * (this.shopCartList[j].amount * 1.0)
                                vals.push(this.shopCartList[j]);
                            }
                        }
                    }
                }
                price = !!price ? price : 0
                return price
            },

            // 所有定制商品
            orderFlagGood(){
                return this.shopCartList.filter(item => item.orderFlag == 1)
            },

        },

        methods: {
            //  获取购物车列表(多平台整合不传店铺Id)
            getCartInfo () {
                let data = {
                    usrKey: Storage.get('USER_INFO').usrId,
                    shopDptId: Storage.get('USER_INFO').shopId,
                    buscontsCode: baseConstant.busContsCode,
                    pageSize: 9999,
                    pageNo: 1
                }
                ShoppingCart.getCartList(data).then(async (res)=>{
                    let map = {}
                    let goodList = [] // 判断库存、上下架
                    res = fastJson.format(res)
                    res.list.forEach((item) => {
                        item.colorArr = []
                        item.sizeArr = []
                        item.newPtiPartDtSkuId = item.ptiPartDtSkuId  //  保存购物车所需参数，默认与原skuId一致
                        //拆解sku
                        for(let i=0; i<item.simpleSkuInfoList.length; i++) {
                            //  遍历所有sku组合，选取颜色数组
                            if(item.colorArr.length === 0) {
                                map.colorCode = item.simpleSkuInfoList[i].colorCode
                                map.colorId = item.simpleSkuInfoList[i].colorId
                                map.colorName = item.simpleSkuInfoList[i].colorName
                                item.colorArr.push(map)
                                map = {}
                            }
                            for(let j=0; j<item.colorArr.length; j++) {
                                let arrList = []
                                item.colorArr.forEach((colorItem) => {
                                    arrList.push(colorItem.colorId)
                                })
                                if(arrList.indexOf(item.simpleSkuInfoList[i].colorId) === -1) {
                                    map.colorCode = item.simpleSkuInfoList[i].colorCode
                                    map.colorId = item.simpleSkuInfoList[i].colorId
                                    map.colorName = item.simpleSkuInfoList[i].colorName
                                    item.colorArr.push(map)
                                    map = {}
                                }
                            }
                            //  遍历所有sku组合，选取尺码数组
                            if(item.sizeArr.length === 0) {
                                map.sizeCode = item.simpleSkuInfoList[i].sizeCode
                                map.sizeId = item.simpleSkuInfoList[i].sizeId
                                map.sizeName = item.simpleSkuInfoList[i].sizeName
                                item.sizeArr.push(map)
                                map = {}
                            }
                            for(let j=0; j<item.sizeArr.length; j++) {
                                let arrList = []
                                item.sizeArr.forEach((sizeItem) => {
                                    arrList.push(sizeItem.sizeId)
                                })
                                if(arrList.indexOf(item.simpleSkuInfoList[i].sizeId) === -1) {
                                    map.sizeCode = item.simpleSkuInfoList[i].sizeCode
                                    map.sizeId = item.simpleSkuInfoList[i].sizeId
                                    map.sizeName = item.simpleSkuInfoList[i].sizeName
                                    item.sizeArr.push(map)
                                    map = {}
                                }
                            }
                        }
                        item.showColorArr = false
                        item.showSizeArr = false
                        item.customDetailFlag = false

                        item.sellFlagStatus = item.sellFlag  // 上下架状态码
                        item.sellFlag = true      // 默认上架
                        item.stockFlag = true     // 默认库存充足

                        let obj = {
                            busContsCode: baseConstant.busContsCode,
                            goodsCode: item.goodsCode,
                            ptiPartDtSkuId: item.ptiPartDtSkuId,
                            amount: item.amount,
                            orderFlag: item.orderFlag,
                            ptiPartHdId: item.ptiPartHdId,
                            cartId: item.id
                        }
                        goodList.push(obj)
                    })

                    if (goodList.length) {
                        let data = {
                            shopId: Storage.get("USER_INFO").shopId,
                            goodList: goodList
                        }
                        let getUseableGood = await Goods.getUseableGood(data);
                        // 商品下架
                        if (getUseableGood.sellAll === 0) {
                            for (let i = 0; i < getUseableGood.unSellList.length; i++) {
                                let unSellItem = getUseableGood.unSellList[i]
                                for (let j = 0; j < res.list.length; j++) {
                                    let item = res.list[j]
                                    if (unSellItem.goodsCode === item.goodsCode) {
                                        item.sellFlag = false
                                    }
                                }
                            }
                        }
                    }

                    if (res.list.length) {
                        await this.checkoutStockPromise(res.list).then(response => {
                            if (res.enoughAll == 1) return;
                            let enoughInfoDtos = response.partEnoughInfoDtos;
                            let enoughSkuInfoDtos = response.partEnoughSkuInfoDtos;
                            res.list.forEach((item, index) => {
                                // 商品已上架
                                if (item.sellFlag) {
                                    // 判断大货商品具体sku是否库存不足
                                    for (let i = 0; i < enoughInfoDtos.length; i++) {
                                        if (enoughInfoDtos[i].enough != 1) {
                                            if (enoughInfoDtos[i].cartId == item.id) {
                                                item.stockFlag = false;
                                            }
                                        }
                                    }
                                }
                            })
                        })
                    }

                    /* orderFlag字段用于区分定制商品和大货商品，0表示大货商品 */
                    this.shopCartList = res.list

                    if (!res.list.length || res.list.length < 1) {
                        this.showEmpty = true
                    }

                    toastLoading(false);
                    this.btnNumLock = false
                }, (err)=>{
                    this.btnNumLock = false
                })
            },

            //  全选与取消全选
            checkedAll () {
                if (this.shopCartList.length <= 0) {
                    return
                }

                let goodsData = []
                this.noInventory = 0
                if (this.checkAll === false) {  // 判断当前的全选状态
                    this.shopCartList.forEach((item) => {
                        // 库存重置 上架
                        if(item.orderFlag === 0 && item.inventory > 0 && item.stockFlag && item.sellFlag){  // 大货
                            goodsData.push(item.id)
                        } else if (item.orderFlag === 1 && item.stockFlag && item.sellFlag) {   // 定制
                            goodsData.push(item.id)
                        } else {
                            this.noInventory++
                        }
                    });
                }
                this.checkedList = goodsData;
                this.getVouchersInfo();
            },

            // 增加购物车数量
            // debounce(function (item)
            addCount (item) {
                if (this.btnNumLock) {
                    return
                }
                this.btnNumLock = true

                if (!item.sellFlag) {
                    this.btnNumLock = false
                    return
                }

                toastLoading();

                if (item.orderFlag === 0) {     // 大货
                    if (item.inventory === 0) {
                        toastLoading(false);
                        this.btnNumLock = false
                        return
                    }

                    item.amount = item.amount * 1
                    let amount = item.amount + 1

                    let data = {
                        companyId: Storage.get('USER_INFO').companyId,
                        busContsCode: baseConstant.busContsCode,
                        shopCode: Storage.get('USER_INFO').shopCode,
                        goodsCode: item.goodsCode,
                        colorCode: item.colorCode,
                        sizeCode: item.sizeCode
                    }
                    Goods.getGoodsStock(data).then((res) => {
                        toastLoading(false);
                        if((res.goodsQty >= amount) && (res.skuList[0].skuQty >= amount)) {
                            item.amount+= 1
                            this.cartSave(item, null, true)
                            this.getVouchersInfo();
                        } else{
                            this.btnNumLock = false
                            Toast('抱歉！库存不足，无法添加')
                        }
                    }, (err) => {
                        this.btnNumLock = false
                    })
                } else {            // 定制
                    for (let i = 0;i < this.orderFlagGood.length; i++) {
                        if (this.orderFlagGood[i].id === item.id) {
                            this.orderFlagGood[i].amount += 1
                        }
                    }

                    // 库存判断
                    this.checkoutStockPromise(this.orderFlagGood).then(res=>{
                        // .some() 如果里面有一个结果返回true，那就结束循环，并且结果返回true
                        res.partEnoughInfoDtos.some(_item => {
                            if (_item.cartId === item.id) {
                                if (_item.enough === 1) {
                                    // 修改购物车数量
                                    let data = {
                                        cartId: item.id,
                                        count: item.amount
                                    }
                                    this._saveCartNumber(data)
                                } else {
                                    toastLoading(false);
                                    item.amount -= 1
                                    this.btnNumLock = false
                                    Toast('抱歉！库存不足，无法添加')
                                }
                                return true
                            }
                        })
                    }, (err) => {
                        this.btnNumLock = false
                    })
                }
            },

            //  减少购物车数量
            // debounce(function (item)
            reduceCount (item) {
                if (this.btnNumLock) {
                    return
                }
                if (!item.sellFlag) {
                    this.btnNumLock = false
                    return
                }
                this.btnNumLock = true

                if (item.orderFlag === 0) {     // 大货
                    if (item.inventory === 0) {
                        toastLoading(false);
                        this.btnNumLock = false
                        return
                    }

                    item.amount = item.amount * 1
                    if(item.amount <= 1) {
                        item.amount === 1
                        Toast('不能再减少了');
                        this.btnNumLock = false
                        return
                    }else{
                        toastLoading();
                        item.amount-= 1
                    }
                    this.cartSave(item)
                    this.getVouchersInfo();
                } else {
                    // 定制
                    toastLoading();
                    if (item.amount <= 1) {
                        toastLoading(false);
                        Toast('不能再减少了');
                        this.btnNumLock = false
                        return
                    }

                    let amount = item.amount - 1
                    // 修改购物车数量
                    let data = {
                        cartId: item.id,
                        count: amount
                    }
                    this._saveCartNumber(data)
                }
            },

            /**
             * 校验库存promise arr custParams 只需传一个
             * @param arr 传入购物车列表数据（自动处理成参数）
             * @param custParams 传入自定义参数（只取该参数）
             * @returns {*}
             */
            checkoutStockPromise(arr,custParams) {
                let inventoryJudgeDtos = [];
                if(arr){
                    arr.forEach(item => {
                        inventoryJudgeDtos.push({
                            "cartId": item.id,
                            "count": item.amount,
                            "orderFlag": item.orderFlag,
                            "ptiPartDtSkuId": item.ptiPartDtSkuId,
                            "ptiPartHdCode": item.goodsCode,
                            "ptiPartHdId": item.ptiPartHdId
                        })
                    })
                }
                if(custParams){
                    inventoryJudgeDtos.push(custParams);
                }

                let stockData = {
                    usrId: Storage.get("USER_INFO").usrId,
                    inventoryJudgeSearchDto: {
                        inventoryJudgeDtos: inventoryJudgeDtos
                    },
                    shopId: Storage.get('USER_INFO').shopId,
                    ownCompanyId: Storage.get("USER_INFO").companyId
                };
                // 库存校验
                return Goods.judgeStock(stockData);
            },

            // 修改定制商品数量
            _saveCartNumber (data) {
                ShoppingCart.saveCartNum(data).then(async (res)=>{
                    if(res == 1){// 成功
                        await this.getCartInfo();
                    } else {
                        Toast('修改失败~')
                    }
                }, (error) => {
                    toastLoading(false);
                    Toast('修改失败，', error)
                    this.btnNumLock = false
                })
            },

            //  手动输入商品数量
            changeCount (item) {
                item.amount = (item.amount.replace(/[^\d]/g,'')) * 1

                if (item.orderFlag === 0) {     // 大货
                    if(item.amount <= 1){
                        item.amount = 1
                        this.cartSave(item)
                        this.btnNumLock = false
                        return
                    } else{
                        item.amount = item.amount * 1
                        let data = {
                            companyId: Storage.get('USER_INFO').companyId,
                            busContsCode: baseConstant.busContsCode,
                            shopCode: Storage.get('USER_INFO').shopCode,
                            goodsCode: item.goodsCode,
                            colorCode: item.colorCode,
                            sizeCode: item.sizeCode
                        }
                        Goods.getGoodsStock(data).then((res) => {
                            if((res.goodsQty >= item.amount) && (res.skuList[0].skuQty >= item.amount)) {
                                this.cartSave(item)
                            } else{
                                // 还原当前库存
                                item.amount = item.inventory
                                this.cartSave(item)
                                Toast('抱歉！库存不足，无法添加')
                            }
                        })
                    }
                } else {// 定制
                    if(item.amount <= 1){
                        item.amount = 1
                        this.btnNumLock = false
                    }

                    // 库存判断
                    this.checkoutStockPromise(this.orderFlagGood).then(res=>{
                        // .some() 如果里面有一个结果返回true，那就结束循环，并且结果返回true
                        res.partEnoughInfoDtos.some(_item => {
                            if (_item.cartId == item.id) {
                                if (_item.enough == 1) {
                                    // 修改购物车数量
                                    let data = {
                                        cartId: item.id,
                                        count: item.amount
                                    }
                                    this._saveCartNumber(data)
                                } else {
                                    Toast('库存不足~')
                                    this.getCartInfo();
                                    this.btnNumLock = false
                                }
                                return true
                            }
                        })
                    })
                }
            },

            // 删除购物车
            cartDelete (id) {
                Dialog.confirm({
                    message: "确定删除该商品吗？"
                }).then(() => {
                    this.ids.push(id)
                    let data = {
                        cookieId: Storage.get('USER_INFO').cookieId,
                        cartIds: this.ids.join(',')
                    }
                    ShoppingCart.deleteCart(data).then(() => {
                        this.getCartInfo()
                        this.ids = []
                        Toast('删除成功~')
                    } , (err) => {})
                },(err) =>{})
            },

            // 保存购物车
            cartSave (item, newId, type) {
                let saveData = {
                    amount: item.amount,
                    busContsCode: baseConstant.busContsCode,
                    cookieId: Storage.get('USER_INFO').cookieId,
                    ctmUsrId: Storage.get('USER_INFO').ctmUsrId,
                    dptId: Storage.get('USER_INFO').shopId,
                    goodsCode: item.goodsCode,
                    partDtSkuId: item.ptiPartDtSkuId,
                    newPartDtSkuId: item.newPtiPartDtSkuId,
                    flag: 1
                }
                ShoppingCart.saveCart(saveData).then((res)=>{
                    if(newId) {
                        item.ptiPartDtSkuId = newId
                    }
                    toastLoading(false);
                }, (err)=>{
                    this.btnNumLock = false
                }).then(()=>{
                    if (type) {
                        this.btnNumLock = false
                        return
                    }
                    this.getCartInfo()
                })
            },

            // 保存更新结算
            saveOrder () {
                if(this.checkedList.length <= 0) {
                    Toast('请选择需要结算的商品~')
                    return
                }else{
                    //  未绑定手机号的情况下跳转绑定手机号页面
                    if(this.vipInfo.mobilePhone === null  || !this.vipInfo.mobilePhone) {
                        this.$router.push('/phone-bind')
                    }else{
                        let skuList = []
                        let map = {}
                        for (let i=0; i<this.checkedList.length; i++) {
                            this.shopCartList.forEach((item) => {
                                if(item.id === this.checkedList[i] && item.orderFlag === 0) {           // 大货
                                    map = item
                                    map.cartId = map.id
                                    map.pictFileId = map.fileHdId
                                    skuList.push(map)
                                } else if (item.id === this.checkedList[i] && item.orderFlag === 1) {   // 定制
                                    map = item
                                    map.cartId = map.id
                                    map.pictFileId = map.fileHdId
                                    map.mainFabricId = map.fabricId

                                    item.partList = this.getPartListParams(item.gsctPartDttAssfabricVos)
                                    // 删除多余数据
                                    delete item.colorArr;
                                    delete item.gsctPartDttAssfabricVos;
                                    delete item.simpleSkuInfoList;
                                    delete item.sizeArr;
                                    skuList.push(map)
                                }
                            })
                            map = {}
                        }
                        let data = {
                            interfaceCode:"SP_SALE_SAVECARTTEMP",
                            ctmUsrId: Storage.get('USER_INFO').usrId,
                            cookieId: Storage.get('USER_INFO').cookieId,
                            shopCode: Storage.get('USER_INFO').shopCode,
                            usrKey: Storage.get('USER_INFO').usrId,
                            sourceCode: 'D_ORDWEIN',
                            skuList: skuList,
                            amountOrd: 1 * this.price
                        }
                        Order.saveCartTemp(data).then((res)=>{
                            Order.orderPreferCal({ordId: res}).then(()=>{
                                this.$router.push("/order-settlement?orderHdId=" + res);
                            })
                        })
                    }
                }
            },

            // 获取部件参数（用于保存）
            getPartListParams(partList) {
                return partList.map((item,index) => {
                    let emb = [],
                        embCont = {},
                        ept = [],
                        eptObj = {},
                        prt = [],
                        prtObj = {};
                    // 绣字
                    if(item.rtlCartDttEmbDto){
                        // 绣字内容
                        embCont.content = item.rtlCartDttEmbDto.embValue
                        // 颜色
                        embCont.colorId = item.rtlCartDttEmbDto.colorId
                        // 字体
                        embCont.fontsId = item.rtlCartDttEmbDto.fontsId
                        // 旋转 60/180*3.14 = 1.1
                        embCont.rotate = item.rtlCartDttEmbDto.rotationX
                        // 缩放
                        embCont.scale = item.rtlCartDttEmbDto.scaleX
                        // x轴坐标
                        embCont.xcoordinate = item.rtlCartDttEmbDto.positionX
                        // y轴坐标
                        embCont.ycoordinate = item.rtlCartDttEmbDto.positionY
                        // 绣字UV图
                        // todo 暂时写死测试
                        embCont.embPictId = item.rtlCartDttEmbDto.fileHdId
                        emb.push(embCont);
                    }
                    // 绣花
                    if(item.rtlCartDttEmbptDto){
                        // 绣花档案id  传的是id而不是imageId(确认过)
                        eptObj.embId = item.rtlCartDttEmbptDto.embHdId
                        // 旋转
                        eptObj.rotate = item.rtlCartDttEmbptDto.rotationX
                        // 缩放
                        eptObj.scale = item.rtlCartDttEmbptDto.scale
                        // x轴坐标
                        eptObj.xcoordinate = item.rtlCartDttEmbptDto.positionX
                        // y轴坐标
                        eptObj.ycoordinate = item.rtlCartDttEmbptDto.positionY
                        // 绣花UV图
                        // todo 暂时写死测试
                        eptObj.embPrintPictId = item.rtlCartDttEmbptDto.fileHdId
                        ept.push(eptObj)
                    }
                    // 印花
                    if(item.rtlCartDttPrintDto){
                        prtObj.prtId = item.rtlCartDttPrintDto.printHdId
//                        prtObj.prtcode = item.rtlCartDttPrintDto.printCode
                        // 印花UV图
                        // todo 暂时写死测试
                        prtObj.embPrintPictId = item.rtlCartDttPrintDto.fileHdId
                        // 旋转
                        prtObj.rotate = item.rtlCartDttPrintDto.rotationX || 0
                        // 缩放
                        prtObj.scale = item.rtlCartDttPrintDto.scale
                        // x轴坐标
                        prtObj.xcoordinate = item.rtlCartDttPrintDto.positionX
                        // y轴坐标
                        prtObj.ycoordinate = item.rtlCartDttPrintDto.positionY

                        prt.push(prtObj)
                    }
                    return {
                        "regionCode": item.regionCode,
                        "partCode": item.partCode,
                        "fabricCode": item.fabricCode,
                        "partId": item.assemplyId,//部件
                        "fabricId": item.ptiPartHdId,//面料
                        "regionId": item.gctRegionHdId,//部位
                        "memo": "",
                        "emb": emb,
                        "ept": ept,
                        "prt": prt,
                        "salePrice": item.salePrice ? item.salePrice : 0,
                        "tagPrice": ""
                    }
                })
            },

            // 跳转商品详情
            goDetail (item) {
                this.isShelve(item.goodsCode).then(res => {
                    if (res) {
                        if (item.orderFlag === 1) { // 定制
                            this.$router.push("/goods/web-design?goodsCode=" + item.goodsCode +
                                '&goodsId=' + item.ptiPartHdId +
                                (item.rtlDesignHdId?'&rtlDesignHdId=' + item.rtlDesignHdId:'') +
                                (item.spGoodsDtDesignId?'&spGoodsDtDesignId=' + item.spGoodsDtDesignId:'')
                            )
                        } else {
                            this.$router.push('/goods-detail?goodsCode=' + item.goodsCode)
                        }
                    } else {
                        this.$router.push("/off-shelves");
                    }
                });
            },
            // 显示sku选择弹窗
            async showSkuCard(item) {
                // 未上架商品不显示sku弹窗
                if (!item.sellFlag || !item.simpleSkuInfoList) {
                    return false;
                }
                this.goodsColor = item.colorArr;
                this.goodsSize = item.sizeArr;
                this.colorCode = item.colorCode;
                this.colorName = item.colorName;
                this.sizeCode = item.sizeCode;
                this.sizeName = item.sizeName;
                this.goodsCode = item.goodsCode;
                this.images = [];
                this.goodsInfo = item;
                this.isShowSkuCard = true;
                // 存储默认选中颜色尺码
                this.goodsColor.forEach((item) => {
                    if (item.colorCode === this.colorCode) {
                        this.colorItem = item;
                    }
                });
                this.goodsSize.forEach((item) => {
                    if (item.sizeCode === this.sizeCode) {
                        this.sizeItem = item;
                    }
                });

                let dataStock = {
                    busContsCode: baseConstant.busContsCode,
                    goodsCode: item.goodsCode,
                    shopCode: Storage.get("USER_INFO").shopCode
                };
                await Goods.getGoodsStock(dataStock).then((res) => {
                    this.stuckList = res.skuList;
                });

                let dataInfo = {
                    busContsCode: baseConstant.busContsCode,
                    goodsCode: this.goodsCode,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    userId: Storage.get("USER_INFO").usrId
                };
                await Goods.getGoodsInfo(dataInfo).then((res) => {
                    this.colorsVoList = res.colorsVoList;
                    if (!!res.colorsVoList) {
                        for (let i=0; i<res.colorsVoList.length; i++) {
                            if (res.colorsVoList[i].colorCode === this.colorCode) {
                                if (!!res.colorsVoList[i].dtColorUrls) {
                                    this.colorImagesHeader = res.colorsVoList[i].dtColorUrls[0];
                                } else {
                                    this.colorImagesHeader = res.url;
                                }
                            }
                        }
                    }
                    this.colorImagesMain = res.url;
                });

                // 初始化尺码列表
                if (this.colorCode !== "") {
                    for (let i = 0; i < this.stuckList.length; i++) {
                        if (this.stuckList[i].colorCode === this.colorCode) {
                            this.goodsSize.forEach((item) => {
                                if (item.sizeCode === this.stuckList[i].sizeCode) {
                                    item.stucks = this.stuckList[i].skuQty;
                                }
                            });
                        }
                    }
                }
                // 初始化颜色列表
                if (this.sizeCode !== "") {
                    for (let i = 0; i < this.stuckList.length; i++) {
                        if (this.stuckList[i].sizeCode === this.sizeCode) {
                            this.goodsColor.forEach((item) => {
                                if (item.colorCode === this.stuckList[i].colorCode) {
                                    item.stucks = this.stuckList[i].skuQty;
                                }
                            });
                        }
                    }
                }

                // if (!!this.colorItem.lumpThumb) {
                //     this.colorImagesHeader = item.lumpThumb;
                // } else {
                //     // 无颜色图取主图
                //     this.colorImagesHeader = this.goodsInfo.url;
                // }
                this.$forceUpdate();
            },

            // 商品颜色切换
            changeSlider(index, item) {
                //  选中及反选
                if (item.colorCode === this.colorCode) {
                    this.colorCode = '';
                    this.goodsSize.forEach((item) => {
                        item.stucks = '';
                    });
                    this.colorName = '';
                    this.colorImagesHeader = this.colorImagesMain;
                } else {
                    if (item.stucks === 0) {
                        this.$toast('该类商品库存不足');
                        return false;
                    } else {
                        this.colorItem = item;
                        this.colorCode = item.colorCode;
                        this.colorName = item.colorName
                        if (!!this.colorsVoList[index].dtColorUrls) {
                            this.colorImagesHeader = this.colorsVoList[index].dtColorUrls[0];
                        } else {
                            this.colorImagesHeader = this.colorImagesMain;
                        }
                    }
                }
                // 通过选择的颜色判断尺码库存
                if (this.colorCode !== "") {
                    for (let i = 0; i < this.stuckList.length; i++) {
                        if (this.stuckList[i].colorCode === this.colorCode) {
                            this.goodsSize.forEach((item) => {
                                if (item.sizeCode === this.stuckList[i].sizeCode) {
                                    item.stucks = this.stuckList[i].skuQty;
                                }
                            });
                        }
                    }
                }
                // if (this.amount > this.goodsStock) {
                //     this.amount = this.goodsStock;
                // }
            },

            // 商品尺码切换
            changeSize(item) {
                //  选中及反选
                if (item.sizeCode === this.sizeCode) {
                    this.sizeCode = '';
                    this.goodsColor.forEach((item) => {
                        item.stucks = '';
                    });
                    this.sizeName = '';
                } else {
                    if (item.stucks === 0) {
                        this.$toast('该类商品库存不足');
                        return false;
                    } else {
                        this.sizeItem = item;
                        this.sizeCode = item.sizeCode;
                        this.sizeName = item.sizeName;
                    }
                }

                // 通过选择的尺码判断颜色库存
                if (this.sizeCode !== "") {
                    for (let i = 0; i < this.stuckList.length; i++) {
                        if (this.stuckList[i].sizeCode === this.sizeCode) {
                            this.goodsColor.forEach((item) => {
                                if (item.colorCode === this.stuckList[i].colorCode) {
                                    item.stucks = this.stuckList[i].skuQty;
                                }
                            });
                        }
                    }
                }
                // if (this.amount > this.goodsStock) {
                //     this.amount = this.goodsStock;
                // }
            },

            // 确认切换
            sureChangeSku() {
                if (this.btnLock === true) {
                    return false;
                }
                this.btnLock = true;
                if (this.colorCode === "") {
                    Toast("请先选择商品颜色");
                    this.btnLock = false;
                    return false;
                }
                if (this.sizeCode === "") {
                    Toast("请先选择商品尺码");
                    this.btnLock = false;
                    return false;
                }
                let skuAmount = this.goodsInfo.amount;
                // let skuAmount = this.amount;
                let skuInfo = {
                    ptiPartDtSkuId: '',
                    ptiPartHdId: ''
                }
                this.goodsInfo.simpleSkuInfoList.forEach((skuItem) => {
                    if((skuItem.sizeCode === this.sizeItem.sizeCode) && (skuItem.colorCode === this.colorItem.colorCode)) {
                        skuInfo.ptiPartDtSkuId = skuItem.id
                        skuInfo.ptiPartHdId = skuItem.ptiPartHdId
                    }
                })
                //  遍历购物车列表，查询是否有相同的sku商品，合并商品信息
                // this.shopCartList.forEach((cartItem) => {
                //     if(cartItem.newPtiPartDtSkuId === skuInfo.ptiPartDtSkuId) {
                //         //  当出现相同sku的商品，在sku校验库存完成后删除，预加至删除商品列表
                //         this.ids.push(cartItem.id)
                //         //  计算sku商品总数
                //         skuAmount += cartItem.amount
                //     }
                // });

                // 检验商品库存
                let data = {
                    companyId: Storage.get("USER_INFO").companyId,
                    busContsCode: baseConstant.busContsCode,
                    goodsCode: this.goodsCode,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    colorCode: this.colorCode,
                    sizeCode: this.sizeCode
                };
                Goods.getGoodsStock(data).then((res) => {
                    if((res.goodsQty >= skuAmount) && (res.skuList[0].skuQty >= skuAmount)) {
                        this.goodsInfo.sizeCode = this.sizeItem.sizeCode
                        this.goodsInfo.sizeId = this.sizeItem.sizeId
                        this.goodsInfo.sizeName = this.sizeItem.sizeName
                        this.goodsInfo.colorCode = this.colorItem.colorCode
                        this.goodsInfo.colorId = this.colorItem.colorId
                        this.goodsInfo.colorName = this.colorItem.colorName
                        this.goodsInfo.newPtiPartDtSkuId = skuInfo.ptiPartDtSkuId
                        this.goodsInfo.showSizeArr = false
                        this.goodsInfo.amount = skuAmount
                        if(this.ids.length > 0) {
                            //  在购物车中删除相同sku商品
                            let deleteData = {
                                cookieId: Storage.get('USER_INFO').cookieId,
                                cartIds: this.ids.join(',')
                            }
                            ShoppingCart.deleteCart(deleteData).then(() => {
                                this.ids = []
                            } , (err) => {}).then(() => {
                                this.cartSave(this.goodsInfo, skuInfo.ptiPartDtSkuId)
                                this.isShowSkuCard = false;
                            })
                        }else{
                            this.cartSave(this.goodsInfo, skuInfo.ptiPartDtSkuId)
                            this.isShowSkuCard = false;
                        }
                    } else{
                        if(this.ids.length > 0) {
                            //  在购物车中删除相同sku商品
                            let deleteData = {
                                cookieId: Storage.get('USER_INFO').cookieId,
                                cartIds: this.ids.join(',')
                            }
                            ShoppingCart.deleteCart(deleteData).then(() => {
                                this.ids = []
                            } , (err) => {})
                            item.amount = res.skuList[0].skuQty
                            this.cartSave(item,skuInfo.ptiPartDtSkuId)
                            this.isShowSkuCard = false;
                        }else{
                            Toast('库存不足')
                        }
                    }
                }).then(() => {
                    this.btnLock = false;
                });
            },

            // // 数字校验
            // handleBlur() {
            //     this.amount = parseInt(this.amount)
            // },

            //  用户信息
            getUser () {
                let data ={}
                UserService.getUserInfo(data).then((res) => {
                    this.vipInfo = res
                })
            },

            //  提交订单查询库存（没用到，buyNow替代）
            checkStock () {
                if(this.checkedList.length <= 0) {
                    // 校验购物车选中商品的数量
                    Toast('请选择需要结算的商品~')
                    return
                }else{
                    //  获取购物车选中商品的sku属性，进行库存校验
                    let skuList = []  // 选中商品数组
                    this.canSave = []
                    let map = {}
                    // let flag = true
                    for (let i=0; i<this.checkedList.length; i++) {
                        this.shopCartList.forEach((item) => {
                            console.log(item)
                            /* this.isShelve(item.goodsCode).then(res=>{
                                if(!res){
                                    Toast('商品'+item.goodsName+'已下架！')
                                    flag = false
                                    return
                                }
                                if(item.id === this.checkedList[i]) {
                                    map = item
                                    map.cartId = map.id
                                }
                            }) */
                            if(item.id === this.checkedList[i]) {
                                map = item
                                map.cartId = map.id
                            }
                        })
                        skuList.push(map)
                        map = {}
                    }
                    console.log(skuList)
                    // if(!flag) return
                    /* skuList.forEach((item) => {
                        let data = {
                            companyId: Storage.get('USER_INFO').companyId,
                            busContsCode: baseConstant.busContsCode,
                            shopCode: Storage.get('USER_INFO').shopCode,
                            goodsCode: item.goodsCode,
                            colorCode: item.colorCode,
                            sizeCode: item.sizeCode
                        }
                        Goods.getGoodsStock(data).then((res) => {
                            //  判断库存
                            if((res.goodsQty >= item.amount) && (res.skuList[0].skuQty >= item.amount)) {
                                this.canSave.push(1)
                            }else{
                                this.canSave.push(0)
                            }
                        }).then(() => {
                            console.log('len1'+JSON.stringify(this.canSave),'len2'+skuList.length)
                            if(this.canSave.length === skuList.length) {
                                if(this.canSave.indexOf(0) === -1) {
                                    this.saveOrder()
                                }else{
                                    Toast('库存不足')
                                    this.getCartInfo()
                                }
                            }
                        })
                    }) */
                }
            },

            // 获取购物车优惠信息
            getVouchersInfo() {
                let list = [];
                if (this.checkedList.length) {
                    for (let i=0; i<this.shopCartList.length; i++) {
                        for (let j=0; j<this.checkedList.length; j++) {
                            if (this.shopCartList[i].id === this.checkedList[j]) {
                                let opation = {
                                    qty: this.shopCartList[i].amount,
                                    colorId: this.shopCartList[i].colorId,
                                    sizeId: this.shopCartList[i].sizeId,
                                    id: this.shopCartList[i].newPtiPartDtSkuId,
                                    salePrice: this.shopCartList[i].dealPrice,
                                    ptiPartHdId: this.shopCartList[i].ptiPartHdId,
                                    ids: this.shopCartList[i].id
                                };
                                list.push(opation);
                            }
                        }
                    }
                }

                this.vourcherList = list;

                let data = {
                    dptId: Storage.get("USER_INFO").shopId,
                    goodsList: this.vourcherList
                };
                ShoppingCart.getshopVouchers(data).then(res => {
                    res != 0 ? (this.salesTotal = res) : (this.salesTotal = 0);
                });
            },
            async buyNow (){
                if(this.checkedList.length <= 0) {
                    Toast('请选择需要结算的商品~')
                    return
                }else{
                    // 判断库存、上下架
                    let goodList = []
                    for (let i = 0; i < this.checkedList.length; i++) {
                        for (let j = 0; j < this.shopCartList.length; j++) {
                            if (this.checkedList[i] === this.shopCartList[j].id) {
                                let obj = {
                                    busContsCode: baseConstant.busContsCode,
                                    goodsCode: this.shopCartList[j].goodsCode,
                                    ptiPartDtSkuId: this.shopCartList[j].ptiPartDtSkuId,
                                    amount: this.shopCartList[j].amount,
                                    orderFlag: this.shopCartList[j].orderFlag,
                                    ptiPartHdId: this.shopCartList[j].ptiPartHdId,
                                    cartId: this.shopCartList[j].id
                                }
                                goodList.push(obj)
                            }
                        }
                    }
                    let data = {
                        shopId: Storage.get("USER_INFO").shopId,
                        goodList: goodList
                    }
                    let res = await Goods.getUseableGood(data);

                    if(res.sellAll === 1 && res.stockAll === 1){    // 库存充足、都上架
                        this.saveOrder();
                    }else{
                        if (res.sellAll !== 1) {    // 商品已下架
                            let unSellList = ''
                            let len = res.unSellList.length
                            for (let i = 0; i < len; i++) {
                                unSellList += `<p>【${res.unSellList[i].goodsName}】；</p>`
                            }
                            Toast({
                                type: 'html',
                                message: '<div class="toast-html"><h2>以下商品已下架：</h2>' + unSellList + '</div>'
                            })
                            this.getCartInfo();
                            // 清空已选
                            this.checkedList = [];
                            return
                        }

                        if (res.stockAll !== 1) {   // 商品库存不足
                            let unStockList = ''
                            let len = res.unStockList.length
                            for (let i = 0; i < len; i++) {
                                unStockList += `<p>【${res.unStockList[i].ptiPartHdName}】${res.unStockList[i].ptiPartSkuId?'颜色：'+res.unStockList[i].colorName+'，尺码：'+res.unStockList[i].sizeName :''}</p>`
                                // unStockList += `<p>【${res.unStockList[i].ptiPartHdName}】颜色：${res.unStockList[i].colorName}，尺码：${res.unStockList[i].sizeName}；</p>`
                            }
                            Toast({
                                type: 'html',
                                message: '<div class="toast-html"><h2>以下商品库存不足：</h2>' + unStockList + '</div>'
                            })

                            this.getCartInfo();
                            // 清空已选
                            this.checkedList = [];
                            return
                        }
                    }
                }
            },
            /**
             * 查看定制清单
             * @param item
             */
            showDetail (item) {
                item.customDetailFlag = !item.customDetailFlag
            },
            // 清空失效商品
            clearInvalid() {
                this.shopCartList.forEach((item) => {
                    // 已下架
                    if (!item.sellFlag || item.sellFlagStatus === 0) {
                        this.ids.push(item.id);
                    }
                    // 大货商品库存不足
                    if (item.orderFlag === 0) {
                        if ((item.sellFlag && item.inventory === 0) || (item.sellFlag && item.amount > item.inventory)) {
                            this.ids.push(item.id);
                        }
                    }
                    // 定制商品库存不足
                    if (item.orderFlag === 1) {
                        if (!item.stockFlag && (item.sellFlag || item.sellFlagStatus !== 0)) {
                            this.ids.push(item.id);
                        }
                    }
                });

                if (this.ids.length > 0) {
                    Dialog.confirm({
                        message: "确定清空失效商品？"
                    }).then(() => {
                        let data = {
                            cookieId: Storage.get('USER_INFO').cookieId,
                            cartIds: this.ids.join(',')
                        };
                        ShoppingCart.deleteCart(data).then(() => {
                            this.getCartInfo()
                            this.ids = []
                            Toast('清空成功~')
                        } , (err) => {})
                    },(err) =>{})
                } else {
                    Toast('暂无失效商品');
                }
            },

            /**
             * 路由导航
             * @param url 路由连接
             */
            navigate(url) {
                if (!url) {
                    Toast('敬请期待~')
                    return
                }

                this.$router.push(url);
            }
        },
        created() {
            this.getCartInfo()
            this.getUser()
        },
        mounted () {
            /**
             * 监听input状态，屏幕滚动到input，上下居中
             * 在安卓手机上屏幕尺寸变化会产生resize事件。所以监听resize事件。
             * 然后定位到input框。
             */
            if ((/Android/gi).test(navigator.userAgent)) {
                window.addEventListener('resize', function () {
                    if (document.activeElement.tagName === 'INPUT') {
                        document.activeElement.scrollIntoView({behavior: "smooth"})
                    }
                })
            }

            window.scroll(0,0);
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .shopping-cart{
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        background: #EDF0F7;
        min-height: 100vh;
    }
    .shop-card-pb {
        padding-bottom: computed(100);
    }
    .goods-actions{
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: computed(100);
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 99;
    }
    .carts-info{
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: computed(100);
        border: solid computed(1) #CCCCCC;
        background: #fff;
        z-index: 9;
    }
    .buy-button{
        width: computed(230);
        height: computed(100);
        font-size: computed(32);
        line-height: computed(100);
        text-align: center;
        color: #ffffff;
        background: #2BA4F3;
    }
    .van-checkbox__icon{
        display: block;
        box-sizing: border-box;
        width: computed(30);
        height: computed(30);
        position: relative;
        border: 1px solid #2BA4F3;
        margin-left: computed(30);
        font-size: computed(30);
        line-height: computed(30);
    }
    .van-checkbox{
        display: flex;
        height: computed(100);
        align-items: center;
    }
    .checked::after{
        position: absolute;
        content: '';
        width: computed(16);
        height: computed(16);
        left: 50%;
        top: 50%;
        background: #2BA4F3;
        overflow: hidden;
        transform: translate(-50%,-50%);
    }
    .un-checked{
        opacity: 0.3;
    }
    .checkbox-label{
        margin-left: computed(10);
        font-size: computed(30);
        line-height: computed(100);
        color: #0D0E09;
    }
    .total-price{
        margin-right: computed(30);
        font-size: computed(32);
        line-height: computed(32);
        color: #0D0E09;
        text-align: right;
        .preferential {
            color: #D80000;
            font-size: computed(24);
            margin-top: computed(4);
        }
    }
    .goods-item{
        box-sizing: border-box;
        display: flex;
        width: 100%;
        padding: computed(58) computed(30);
        background: #ffffff;
        margin-bottom: computed(10);
        justify-content: center;
        position: relative;
    }
    .bg-gray {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #666666;
        opacity: 0.3;
        z-index: 9;
    }
    .select-box{
        height: 100%;
        position: relative;
    }
    .dis{
        opacity: 0.3;
    }
    .goods-item .van-checkbox__icon{
        margin-left: 0;
    }
    .goods-header {
        margin-left: computed(30);
        .goods-cover{
            position: relative;
            width: computed(150);
            max-height: computed(150);
            height: 100%;
            overflow: hidden;
        }
        .goods-cover img{
            display: block;
            width: 100%;
            height: 100%;
        }
        .goods-cover .diy-icon{
            position: absolute;
            left: 0;
            top: 0;
            width: computed(160);
            height: computed(36);
            /*z-index: 3;*/
            background: url("../../assets/images/common/diy.png") no-repeat top left;
            -webkit-background-size: contain;
            background-size: contain;
        }
        .goods-depreciate {
            color: #D80000;
            font-size: computed(18);
            padding-top: computed(10);
        }
        .goods-stock-tip {
            width: 100%;
            height: computed(32);
            line-height: computed(32);
            color: #fff;
            background: #CCCCCC;
            font-size: computed(20);
            text-align: center;
            margin-top: computed(10);
        }
    }
    .goods-info{
        width: 100%;
        margin-left: computed(30);
        position: relative;
    }
    .delete-btn{
        position: absolute;
        right: 0;
        top: 0;
        width: computed(30);
        height: computed(30);
        font-size: computed(30);
        line-height: computed(30);
        color: #999999;
        z-index: 99;
    }
    .delete-btn .icon-shanchuguanbi{
        font-size: computed(40);
        line-height: computed(30);
        color: #999999;
        font-weight: 600;
    }
    .goods-name{
        max-width: computed(380);
        font-size: computed(32);
        line-height: computed(34);
        color: #0D0E09;
        word-break:keep-all;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    .custom-list{
        position: relative;
        width: computed(450);
        z-index: 99;
        .title{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: computed(30);
            padding: computed(20) computed(16);
            background: #F2F2F2;
            color: #0D0E09;
            span{
                font-size: computed(28);
                font-weight:400;
                color:rgba(13,14,9,1);
            }
            .tran{
                transform: rotate(180deg);
            }
        }
    }
    .goods-stock-tip{
        margin-top: computed(30);
        font-size: computed(28);
        line-height: computed(30);
        color: #D80000;
        text-align: right;
    }
    .goods-price{
        display: flex;
        justify-content: space-between;
        margin-top: computed(28);
    }
    .checkInput{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 2;
    }
    .sale-price{
        font-size: computed(32);
        line-height: computed(34);
        color: #0D0E09;
    }
    .old-price{
        margin-top: computed(8);
        font-size: computed(28);
        line-height: computed(30);
        color: #CCCCCC;
        text-decoration: line-through;
    }
    .count-box{
        float: right;
    }
    .count_input{
        box-sizing: border-box;
        border: solid computed(1) #E6E6E6;
        width: computed(70);
        height: computed(50);
        font-size: computed(28);
        line-height: computed(48);
        color: #0D0E09;
        text-align: center;
        float: left;
        /* 解决ios版微信浏览器的边框和阴影*/
        border-radius: 0;
        box-shadow:0 0 0 rgba(0,0,0,0);
        -webkit-appearance:none;
        &[disabled] {
            color: #CCCCCC;
        }
    }
    .count-btn{
        box-sizing: border-box;
        width: computed(36);
        height: computed(36);
        font-size: computed(30);
        line-height: computed(34);
        text-align: center;
        color: #CCCCCC;
        float: left;
        position: relative;
        top: computed(5);
    }
    .reduce-btn{
        margin-right: computed(10);
    }
    .add-btn {
        margin-left: computed(10);
    }
    .goods-sku-box{
        margin-top: computed(30);
    }
    .goods-type, .other-title{
        box-sizing: border-box;
        font-size: computed(32);
        line-height: computed(34);
        color: #0D0E09;
        padding: computed(29) 0;
        position: relative;
    }
    .goods-type.act, .other-title.act{
        border-bottom: solid computed(1) #CCCCCC;
    }
    .goods-type .show-arrow, .other-title .show-arrow{
        position: absolute;
        display: block;
        right: computed(0);
        top: computed(31);
        height: computed(28);
        font-size: computed(28);
        line-height: computed(28);
    }
    .goods-type.act .show-arrow, .other-title.act .show-arrow{
        transform: rotate(180deg);
    }
    .goods-sku-content h5{
        font-size: computed(28);
        line-height: computed(30);
        color: #0D0E09;
        font-weight: 600;
    }
    .item-list li{
        display: flex;
        margin-top: computed(5);
        justify-content: space-between;
        font-size: computed(28);
        line-height: computed(32);
        color: #0D0E09;
    }
    .sku-item-list li{
        font-size: computed(28);
        line-height: computed(32);
        color: #0D0E09;
        background: #F2F2F2;
        .sku-name{
            padding: computed(20) computed(16);
            font-size: computed(28);
            &.disabled {
                color: #CCCCCC;
            }
        }
        .sku-box{
            padding-top: computed(15);
            border-top: solid computed(1) #CCCCCC;
            p{
                line-height: computed(52);
                padding-left: computed(10);
            }
        }
        .show-sku{
            transform: rotate(180deg);
        }
        .sku-act{
            background: #F2F2F2;
        }
    }
    /* 通用弹窗关闭按钮 */
    .comment-close {
        font-size: computed(32);
        color: #ccc;
        text-align: right;
        position: fixed;
        right: computed(30);
        top: computed(30);
        z-index: 9999;
    }
    /* 加入购物车弹窗 */
    .popup-add-card {
        width: 100%;
        height: 80%;
        .add-card-body {
            width: 100%;
            height: calc(100% - 7.3%);
            /*height: 100%;*/
            overflow-y: auto;
            padding: computed(30);
            box-sizing: border-box;
            .add-card-slider {
                img {
                    width: 100%;
                    height: computed(750);
                    display: block;
                }
            }
            .add-card-header {
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
            .add-card-slider-small {
                margin: computed(30) 0;
                li {
                    display: inline-block;
                    padding: computed(20) computed(18);
                    margin: 0 computed(15) computed(15) 0;
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
                        border: 1px solid $maincolor!important;
                        color: $maincolor!important;
                    }
                    &.none {
                        border: 1px dotted #CCCCCC;
                        color: #999999;
                    }
                }
            }
            .add-card-title {
                text-align: left;
                font-size: computed(28);
                color: #333333;
                margin-top: computed(50);
            }
            .add-card-size {
                /*margin-bottom: computed(120);*/
                margin-bottom: computed(20);
                ul {
                    /*display: inline-block;*/
                    /*overflow-x: auto;*/
                    /*overflow-y: hidden;*/
                    width: 100%;
                    /*height: computed(85);*/
                    white-space: nowrap;
                    font-size: 0;
                    margin-top: computed(20);
                    display: flex;
                    flex-flow: row wrap;
                    li {
                        /*display: inline-block;*/
                        width: computed(200);
                        height: computed(78);
                        line-height: computed(78);
                        font-size: computed(24);
                        border: 1px solid #666666;
                        margin-right: computed(20);
                        color: rgba(102, 102, 102, 1);
                        text-align: center;
                        margin-bottom: computed(20);
                        &:last-child {
                            margin-right: computed(30);
                        }
                        &.none {
                            border: 1px dashed #cccccc;
                            color: #d9d9d9;
                        }
                        &.active {
                            border: 1px solid $maincolor!important;
                            color: $maincolor!important;
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
            /*.stepper {*/
                /*display: flex;*/
                /*margin-top: computed(20);*/
                /*align-items: center;*/
                /*/deep/.van-stepper {*/
                    /*button {*/
                        /*background: #fff;*/
                        /*margin: 0;*/
                        /*box-sizing: border-box;*/
                        /*width: computed(88);*/
                        /*height: computed(66);*/
                        /*&:first-child {*/
                            /*border-left: computed(2) solid #9A9A9A;*/
                            /*border-top: computed(2) solid #9A9A9A;*/
                            /*border-bottom: computed(2) solid #9A9A9A;*/
                        /*}*/
                        /*&:last-child {*/
                            /*border-right: computed(2) solid #9A9A9A;*/
                            /*border-top: computed(2) solid #9A9A9A;*/
                            /*border-bottom: computed(2) solid #9A9A9A;*/
                        /*}*/
                        /*&.van-stepper__minus--disabled {*/
                            /*border-color: #ccc;*/
                        /*}*/
                        /*&.van-stepper__plus--disabled {*/
                            /*border-color: #ccc;*/
                        /*}*/
                    /*}*/
                    /*input {*/
                        /*margin: 0;*/
                        /*border: computed(1) solid #9A9A9A;*/
                        /*box-sizing: border-box;*/
                        /*width: computed(80);*/
                        /*height: computed(66);*/
                        /*background: #fff;*/
                    /*}*/
                /*}*/
                /*.goods-stock {*/
                    /*font-size: computed(24);*/
                    /*margin-left: computed(20);*/
                /*}*/
            /*}*/
        }
        .add-card-sure {
            position: fixed;
            display: flex;
            bottom: 0;
            width: 100%;
            background-color: $maincolor;
            color: white;
            height: computed(100);
            font-size: computed(36);
            span {
                margin: auto;
            }
        }
    }
    .add-card-slider {
        width: 100%;
        height: 100%;
    }
    .clear-invalid {
        width: 94%;
        line-height: computed(66);
        color: #2BA4F3;
        border: computed(1) solid #2BA4F3;
        text-align: center;
        font-size: computed(28);
        margin: computed(20) auto;
    }
    .shopping-cart-empty {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translate(0, -75%);
        text-align: center;
        > i {
            font-size: computed(88);
            color: $text-placeholder;
        }
        .info {
            font-size: $font-common;
            color: $text-secondary;
            margin: computed(59) 0 computed(35) 0;
        }
        > span {
            background-color: $maincolor;
            color: $color-white;
            font-size: $font-common;
            padding: computed(13) computed(30);
            border-radius: computed(5);
        }
    }
    .big-pic-box .van-swipe {
        width: computed(750);
        height: computed(750);
        .van-swipe__track {
            width: auto !important;
            .van-swipe-item {
                display: block;
                width: computed(750)!important;
                height: computed(750)!important;
                text-align: center;
                overflow: hidden;
                line-height: 0;
                .bigPic {
                    width: computed(750);
                    height: computed(750);
                }
            }
        }
    }
    /deep/.van-overlay {
        &.big-background {
            background: rgba(0,0,0,1);
        }
    }
</style>
