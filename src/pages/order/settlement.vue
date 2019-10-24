/*
* createTime：2018/7/18
* author：en.chen
* description: 订单结算
*/
<template>
    <div class="settlement">

        <!-- 配送方式 -->
        <div class="delivery-box">
            <p>配送方式</p>
            <div class="van-checkbox" v-for=" item in deliveryType" @click="choseDelivery(item)" :key="item.id">
                <i class="van-checkbox__icon" :class="{ 'checked': delivery === item.shipCode }"></i>
                <p class="checkbox-label">{{item.shipName}}</p>
            </div>
        </div>

        <!-- 地址信息 -->
        <div class="address-box">
            <!--快递配送-->
            <div v-if="delivery === 'kdps'">
                <h5 class="address-title">收货信息</h5>
                <!--有可选的收货地址-->
                <div class="address-content" v-if="hasAddr === true" @click="toAddress">
                    <div class="default-cell">
                        <label>收货人：</label>
                        <p>{{addressMsg.cargousrName}}</p>
                    </div>
                    <div class="default-cell">
                        <label>联系方式：</label>
                        <p>{{addressMsg.cargoPhone}}</p>
                    </div>
                    <div class="default-cell">
                        <label>收货地址：</label>
                        <p>{{addressMsg.destDesc + addressMsg.address}}</p>
                    </div>
                    <div>
                        <i class="select-address-btn iconfont icon-youfan">
                        </i>
                    </div>
                </div>
                <!--无可选的收货地址-->
                <div class="address-content" v-if="hasAddr === false">
                    <div class="detail-cell">
                        <div class="cell-title">姓名</div>
                        <div class="cell-content">
                            <input type="text" v-inputfix v-model="addressMsg.cargousrName"/>
                        </div>
                    </div>
                    <div class="detail-cell">
                        <div class="cell-title">联系方式</div>
                        <div class="cell-content" :class="{'warn-tip' : checkPhone !== true}">
                            <input maxlength="11" v-model="addressMsg.cargoMobile" v-inputfix
                                   @change="checkPhoneNum(addressMsg.cargoMobile)"/>
                        </div>
                    </div>
                    <div class="detail-cell">
                        <div class="cell-title">地区</div>
                        <div class="cell-content area" @click="showAreaList = true">
                            <span>{{ addressMsg.province ? addressMsg.province + addressMsg.district + addressMsg.city : '省市区'}}</span>
                        </div>
                    </div>
                    <div class="detail-cell">
                        <div class="cell-title">详细地址</div>
                        <div class="cell-content">
                            <input type="text" v-inputfix v-model="addressMsg.address"/>
                        </div>
                    </div>
                </div>
            </div>
            <!--门店自取-->
            <div v-if="delivery === 'mdzq'">
                <div class="address-content">
                    <div class="detail-cell">
                        <div class="cell-title">姓名</div>
                        <div class="cell-content">
                            <input type="text" v-inputfix v-model="pickupMsg.name" placeholder="请填写取货人姓名"/>
                        </div>
                    </div>
                    <div class="detail-cell">
                        <div class="cell-title">联系方式</div>
                        <div class="cell-content" :class="{'warn-tip' : checkPhone !== true}">
                            <input maxlength="11" v-inputfix v-model="pickupMsg.phone"
                                   @change="checkPhoneNum(pickupMsg.phone)"
                                   placeholder="请填写联系电话"/>
                        </div>
                    </div>
                    <div class="detail-cell">
                        <div class="cell-title">取货地区</div>
                        <div class="cell-content area" @click="showAreaList = true">
                            <span>{{ pickupMsg.province ? pickupMsg.province + pickupMsg.district + pickupMsg.city : '请选择取货地址'}}</span>
                        </div>
                    </div>
                    <div class="detail-cell">
                        <div class="cell-title">取货门店</div>
                        <div class="cell-content area" @click="checkStore">
                            <span>{{pickupMsg.storeNameText}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 商品清单 -->
        <p class="settlement-title">商品清单({{shoppingCartList.length}})</p>
        <div class="goods-list">
            <div class="goods-item" v-for="(item,index) in shoppingCartList" :key="index">
                <div class="goods-cover">
                    <img :src="getImg(item.url, '150*150')" alt="" onerror="errImg(event)">
                    <div class="diy-icon" v-if="item.orderFlag === 1"></div>
                </div>
                <div class="goods-info">
                    <p class="goods-name">{{item.goodsName}}</p>
                    <div class="goods-price">
                        <div class="price-box">
                            <p class="sale-price">￥{{item.dealPrice | Fix2}}</p>
                        </div>
                        <div class="count-box">
                            <p>x{{item.amount}}</p>
                        </div>
                    </div>
                    <div class="goods-sku-box" v-if="item.orderFlag === 1 && item.partList.length > 0">
                        <p class="goods-type" :class="{ 'act' : item.showSku === true }" @click="skuToggle(item)"
                           v-if="item.partList.length > 0">
                            定制清单<i class="show-arrow iconfont icon-xialaxuan"></i>
                        </p>

                        <!--定制信息弹窗-->
                        <custom-dialog
                                fromPage="orderSettle"
                                :mainFabricName="item.mainFabricName"
                                :partList="item.partList"
                                v-show="item.showSku === true"
                        ></custom-dialog>

                        <!--<div v-show="item.showSku === true">-->
                            <!--<div class="goods-sku-content" v-if="item.mainFabricName && item.mainFabricName !== null">-->
                                <!--<ul class="item-list">-->
                                    <!--<li>-->
                                        <!--<p>主面料（{{item.mainFabricName}}）</p>-->
                                        <!--<p v-if="item.fabricPrice || item.fabricPrice === 0">￥{{item.fabricPrice}}</p>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
                            <!--<div class="goods-sku-content" v-for="(list,index) in item.partList" :key="index">-->
                                <!--&lt;!&ndash;<h5>{{list.regionName}}：</h5>&ndash;&gt;-->
                                <!--<ul class="item-list">-->
                                    <!--<li>-->
                                        <!--&lt;!&ndash; 需求又又又变动了！！！！！&ndash;&gt;-->
                                        <!--<p>{{list.partName}}</p>-->
                                        <!--&lt;!&ndash;<p>{{item.mainFabricName}}</p>&ndash;&gt;-->
                                        <!--&lt;!&ndash;<p>{{list.fabricName}}</p>&ndash;&gt;-->
                                        <!--<p v-if="list.salePrice || list.salePrice === 0">￥{{list.salePrice |-->
                                            <!--fixed2}}</p>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
                            <!--<div class="goods-sku-content" v-if="item.embs.length > 0">-->
                                <!--<h5>绣字</h5>-->
                                <!--<ul class="item-list">-->
                                    <!--<li v-for="part in item.embs">-->
                                        <!--<p>{{part.name}} ({{part.content}})</p>-->
                                        <!--<p>￥{{part.price}}</p>-->
                                        <!--&lt;!&ndash;<img :src="getImg(part.url)" onerror="errImg(event)">&ndash;&gt;-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
                            <!--<div class="goods-sku-content" v-if="item.epts.length > 0">-->
                                <!--<h5>绣花</h5>-->
                                <!--<ul class="item-list">-->
                                    <!--<li v-for="part in item.epts">-->
                                        <!--<p>{{part.name}}</p>-->
                                        <!--<p><img :src="getImg(part.url)" onerror="errImg(event)"> &nbsp;￥{{part.price}}-->
                                        <!--</p>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
                            <!--<div class="goods-sku-content" v-if="item.prt.length > 0">-->
                                <!--<h5>印花</h5>-->
                                <!--<ul class="item-list">-->
                                    <!--<li v-for="part in item.prt">-->
                                        <!--<p>{{part.name}}</p>-->
                                        <!--<p><img :src="getImg(part.url)" onerror="errImg(event)"> &nbsp;￥{{part.price}}-->
                                        <!--</p>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
                        <!--</div>-->
                    </div>
                    <div class="goods-sku-box" v-if="item.orderFlag === 0">
                        <div class="goods-sku-content">
                            <!--<h5>商品属性：</h5>-->
                            <ul class="item-list">
                                <li>
                                    <p>颜色：</p>
                                    <p>{{item.colorName}}</p>
                                </li>
                                <li>
                                    <p>尺码：</p>
                                    <p>{{item.sizeName}}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 赠品 begin -->
        <div v-if="sendList && sendList.length > 0" class="goods-send-container">
            <p class="title">赠品 ({{totalSendNum}})</p>
            <ul v-for="(item,index) in sendList"
                :key="item.goodsCode">
                <div v-for="(giftGroupItem, giftGroupIndex) in item.giftGroup">
                    <!-- 随机、固定 -->
                    <li class="goodsList gift"
                        v-for="goods in giftGroupItem.gifts"
                        v-if="giftGroupItem.groupType !== '指定'">
                        <div class="send">
                            <div class="image-main">
                                <img v-lazy="getImg(goods.url, '120*120')" :key="goods.url" class="image">
                                <span class="title-image"><span>赠品</span></span>
                            </div>
                            <div class="goodsList-middle">
                                <p class="name overflow">
                                    {{goods.goodsName}}
                                </p>
                                <p class="size-color">{{goods.sizeName}}/{{goods.colorName}}</p>
                            </div>
                            <div class="goodsList-right">
                                <p class="price">¥0</p>
                                <p class="num">x {{goods.amount}}</p>
                            </div>
                        </div>
                    </li>
                    <!-- 指定 -->
                    <li class="goodsList gift"
                        v-if="giftGroupItem.gifts.length > 0 && giftGroupItem.groupType === '指定'">
                        <div class="send" v-if="giftGroupItem.choseGoods.goodsName">
                            <!-- 已选择赠品 -->
                            <div class="image-main">
                                <img v-lazy="getImg(giftGroupItem.choseGoods.url, '120*120')"
                                     :key="giftGroupItem.choseGoods.url"
                                     class="image">
                                <span class="title-image"><span>赠品</span></span>
                            </div>
                            <div class="goodsList-middle">
                                <p class="name overflow">
                                    {{giftGroupItem.choseGoods.goodsName ? giftGroupItem.choseGoods.goodsName :
                                    '请选择赠送商品的类型'}}
                                </p>
                                <p v-if="giftGroupItem.choseGoods.sizeName && giftGroupItem.choseGoods.colorName"
                                   @click="skuChose(giftGroupItem, index)"
                                   class="size-color overflow">
                                    {{giftGroupItem.choseGoods.sizeName}}/{{giftGroupItem.choseGoods.colorName}} <i
                                        class="iconfont icon-youfan"></i>
                                </p>
                            </div>
                            <div class="goodsList-right">
                                <p class="price">¥0</p>
                                <p v-if="giftGroupItem.choseGoods.amount" class="num">x
                                    {{giftGroupItem.choseGoods.amount}}</p>
                            </div>
                        </div>
                        <!-- 未选择赠品 -->
                        <div v-else class="un-send" @click="skuChose(giftGroupItem, index)">
                            <div class="un-send-left">
                                {{item.saleTheme}}
                            </div>
                            <div class="un-send-right">
                                选择赠品<i class="iconfont icon-youfan"></i>
                            </div>
                        </div>
                    </li>
                </div>
            </ul>
        </div>
        <!-- 赠品 end-->

        <p class="settlement-title">其他</p>
        <!--促销优惠 begin-->
        <div class="others-wrapper">
            <!--商品总额-->
            <div class="other-part">
                <div class="other-title">
                    <label>商品总额</label>
                     <div class="fr">
                          <span class="other-title-value">￥{{totalGold | Fix2}}</span>
                     </div>
                </div>
            </div>
            <!--会员卡 begin-->
            <div class="other-part">
                <div class="other-title" :class="{ 'act' : showCartList === true }">
                    <label>会员卡</label>
                    <div class="fr" @click="openCartList">
                        <span class="other-title-value">- ￥{{vipPrice | Fix2}}</span>
                        <span class="show-arrow"><i
                                class="iconfont icon-xialaxuan"></i></span>
                    </div>
                </div>
                <ul class="coupon-list" v-show="showCartList === true">
                    <!--判断选中-->
                    <li v-for="item in cardList" :class="{'act' : item.id === cardId }" :key="item.id"
                        @click="selectedVipCard(item)">
                        <div class="coupon-name">
                            <span>{{item.vipLevelName}}</span>
                            <!--<span class="coupon-type">卡包</span>-->
                        </div>
                        <div>
                            <span class="select-box"><i class="iconfont icon-queding"></i></span>
                        </div>
                    </li>
                    <li :class="{'act' : cardId == -1 }" @click="selectedVipCard({id: -1})">
                        <div class="coupon-name">不使用</div>
                        <div>
                            <!--判断选中 '不使用'-->
                            <span class="select-box"><i class="iconfont icon-queding"></i></span>
                        </div>
                    </li>
                </ul>
            </div>
            <!--会员卡 end-->

            <!--会籍折扣 begin-->
            <!--<div class="other-part">-->
            <!--<div class="other-title">-->
            <!--<label>会籍折扣</label>-->
            <!--<div class="fr">-->
            <!--<span class="other-title-value">- ￥{{vipPrice}}</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--会籍折扣 end-->

            <!--优惠券部分 begin-->
            <div class="other-part">
                <div class="other-title" :class="{ 'act' : showDisCoupon === true }">
                    <label>折扣券</label>
                    <div class="fr" @click="showDisCoupon = !showDisCoupon">
                        <span class="other-title-value">- ￥{{disCouponPrice | Fix2}}</span>
                        <span class="show-arrow"><i
                                class="iconfont icon-xialaxuan"></i></span>
                    </div>
                </div>
                <ul class="coupon-list" v-show="showDisCoupon === true">
                    <li v-for="item in disCouponList" :class="{'act' : disCouponId === item.cardId }"
                        @click="useCoupon(item.cardId,0)">
                        <!-- 变更优惠券名称，取值从valuecardName替换成couponName -->
                        <div class="coupon-name">{{item.couponName}}</div>
                        <div>
                            <span v-if="disCouponId === item.cardId">- ￥{{disCouponPrice | Fix2}}</span>
                            <span class="select-box"><i class="iconfont icon-queding"></i></span>
                        </div>
                    </li>
                    <li :class="{'act' : disCouponId === '' }" @click="useCoupon('',0)">
                        <div class="coupon-name">不使用</div>
                        <div>
                            <span v-if="disCouponId === ''">- ￥{{disCouponPrice | Fix2}}</span>
                            <span class="select-box"><i class="iconfont icon-queding"></i></span>
                        </div>
                    </li>
                </ul>
            </div>
            <!--优惠券部分 end-->

            <!--现金券部分 begin-->
            <div class="other-part">
                <div class="other-title" :class="{ 'act' : showCashCoupon === true }">
                    <label>抵用券</label>
                    <div class="fr" @click="showCashCoupon = !showCashCoupon">
                        <span class="other-title-value" v-if="useStoredCard === false">- ￥{{cashCouponPrice | Fix2}}</span>
                        <span class="other-title-value" v-if="useStoredCard === true">- ￥{{storedValueCardPrice | Fix2}}</span>
                        <span class="show-arrow"><i class="iconfont icon-xialaxuan"></i></span>
                    </div>
                </div>
                <ul class="coupon-list" v-show="showCashCoupon === true">
                    <li v-for="item in cashCouponList" :class="{'act' : cashCouponId === item.cardId&&!item.disabled, 'disabledCash': item.disabled }"
                        @click="useCoupon(item.cardId,1,item.cardClassDto.classCode,item)">
                        <div class="coupon-name">{{item.couponName}}</div>
                        <div>
                            <span v-if="cashCouponId === item.cardId && item.cardClassDto.classCode === '001'">- ￥{{storedValueCardPrice | Fix2}}</span>
                            <span v-if="cashCouponId === item.cardId && item.cardClassDto.classCode !== '001'">- ￥{{cashCouponPrice | Fix2}}</span>
                            <span class="select-box"><i class="iconfont icon-queding"></i></span>
                        </div>
                    </li>
                    <li :class="{'act' : cashCouponId === '' }" @click="useCoupon('',1)">
                        <div class="coupon-name">不使用</div>
                        <div>
                            <span v-if="cashCouponId === ''">- ￥{{cashCouponPrice | Fix2}}</span>
                            <span class="select-box"><i class="iconfont icon-queding"></i></span>
                        </div>
                    </li>
                </ul>
            </div>
            <!--现金券部分 end-->

            <!--促销优惠 begin-->
            <div class="other-part" v-if="otherGold">
                <p class="other-title">促销优惠
                    <span class="show-arrow">-￥{{otherGold | Fix2 | $goldDivide}}</span>

                </p>
            </div>
            <!--促销优惠 end-->

            <!--运费部分 begin-->
            <div class="other-part" v-if="delivery === 'kdps'">
                <p class="other-title">运费
                    <span class="show-arrow" v-if="transFee && transFee>0">￥{{transFee | Fix2}}</span>
                    <span class="show-arrow" v-if="!transFee || transFee <=0">包邮</span>
                </p>
            </div>
            <!--运费部分 end-->

            <!--使用积分 begin-->
            <div class="other-part" v-if="visiblePoint">
                <div class="other-title">
                    <label>使用{{pointInfo.point || 0}}积分</label>
                    <div class="fr">
                        <span class="other-title-value">- ￥{{pointInfo.pointPirce || 0 | Fix2 | $goldDivide}}</span>
                        <van-switch v-model="switchFlag" @change="pointChange" size="15px" active-color="#2ba4f3"/>
                        <!--<span class="show-arrow"><i class="iconfont icon-xialaxuan"></i></span>-->
                    </div>
                </div>
            </div>
            <!--会员卡 end-->

            <!--发票选择 begin-->
            <div class="other-part" v-if="invoiceStatus === true && totalPrice > 0">
                <div class="other-title">
                    <label>发票</label>
                    <div class="fr" v-if="invoiceStatus === false">
                        <span class="other-title-value">不开发票</span>
                    </div>
                    <div class="fr" v-if="invoiceStatus === true" @click="setInvoice">
                        <span class="other-title-value" v-if="!invoiceData.type">未选择发票</span>
                        <span class="other-title-value" v-if="invoiceData.type">{{invoiceData.type}} {{invoiceData.title}}</span>
                        <span class="show-arrow wait"><i class="iconfont icon-xialaxuan"></i></span>
                    </div>
                </div>
            </div>
            <!--发票选择 end-->

            <!--订单备注 begin-->
            <div class="other-part">
                <div class="other-box">
                    <label>订单备注：</label>
                    <textarea class="order-memo" v-model="memo" maxlength="50" v-inputfix></textarea>
                </div>
            </div>
            <!--订单备注 end-->

        </div>
        <!--促销优惠 end-->

        <!--底部按钮-->
        <div class="goods-actions">
            <div class="carts-info">
                <div class="total-price">合计：￥<span>{{ delivery === 'kdps' ? (totalPrice + transFee).toFixed(2) : totalPrice | Fix2}}</span>
                </div>
            </div>
            <div class="buy-button" @click="saveOrder">立即付款</div>
        </div>

        <!--省市区弹窗-->
        <van-popup v-model="showAreaList" position="top" visible-item-count="3">
            <!--<van-area :value="addressInfo.addressId" :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false" />-->
            <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false"/>
        </van-popup>
        <!--门店弹窗-->
        <van-popup v-model="showStoreList" position="top">
            <van-picker :columns="storeList" show-toolbar @cancel="showStoreList = false" @confirm="selectStore"/>
        </van-popup>

        <!-- 赠品sku选择 begin -->
        <van-popup v-model="isShowSku" position="bottom" :overlay="true" class="sku-popup">
            <order-sku-dialog-comp
                    :goodsInfo.sync="skuPopupList"
                    :colorActiveIndex.sync="colorActiveIndex"
                    :sizeActiveIndex.sync="sizeActiveIndex"
                    :isShowSku.sync="isShowSku"
                    :flag="3"
                    :sendActiveItem="sendActiveItem"
                    @onSelectColor="onSelectColor"
            ></order-sku-dialog-comp>
        </van-popup>
        <!-- 赠品sku选择 end -->
    </div>
</template>
<script>
    import {SwitchCell, Popup, Area, Picker, Toast, Switch, Dialog} from "vant";
    import Storage from "../../util/storage";
    import {cityData} from "../../assets/js/cityData";
    import wx from "weixin-js-sdk"
    import {
        UserService,
        Order,
        Vouchers,
        Base,
        Payment,
        Invoice,
        Goods
    } from "../../api/service";
    import orderSkuDialogComp from './components/order-sku-dialog.vue'
    import CustomDialog from '@/components/CustomDialog'

    export default {
        components: {
            "van-switch-cell": SwitchCell,
            "van-area": Area,
            "van-popup": Popup,
            "van-picker": Picker,
            "van-switch": Switch,
            orderSkuDialogComp,
            CustomDialog
        },
        data() {
            return {
                orderHdId: "", //  订单中间表id
                delivery: "", // 选中的配送方式
                deliveryType: [], //  配送方式列表
                hasAddr: false, // false代表没有地址选项，true代表有可以选择的地址
                showAreaList: false, // 地区选择弹窗
                checkPhone: true, //验证电话号码
                addressMsg: {}, //  快递地址信息
                pickupMsg: {
                    name: "",
                    phone: "",
                    province: "",
                    district: "",
                    city: "",
                    addressId: null,
                    storeId: null,
                    storeName: "请选择取货门店",
                    storeNameText: "请选择取货门店"
                }, //  门店自取地址信息
                areaList: cityData, // 省市区地址
                showStoreList: false, // 门店列表弹窗
                storeList: [], //  门店列表
                shoppingCartList: [], //购物车列表
                transFee: 0, //  运费
                discount: "",
                memo: null, // 备注
                invoiceStatus: false, //  是否允许开发票
                totalPrice: 0, // 销售价
                vipPrice: "", //  会员折扣
                disCouponPrice: "", // 优惠券折扣价
                cashCouponPrice: "", // 现金券优惠价
                disCouponList: [], //  优惠券列表
                cashCouponList: [], //  现金券列表
                disCouponId: "", // 选中优惠券id
                cashCouponId: "", // 选中现金券id
                showDisCoupon: false, //  显示优惠券弹窗变量
                showCashCoupon: false, //  显示折扣券弹窗变量
                storedValueCardPrice: "", //  储值卡优惠金额
                useStoredCard: false, //是否使用储值卡
                invoiceData: {},
                btnLock: false,

                assignGiftIndex: -1,// 指定赠品索引
                showCartList: false,// 是否展开会员卡列表
                cardId: -1,// 会员卡id
                cardList: [],// 会员卡列表
                disabledCart: false,// 禁用会员卡下拉 true表示禁用
                userPointInfo:{},// 积分信息
//                usePointFlag: 1,// 是否使用积分（默认使用）
                disabledPoint: false,// 是否禁用积分checkbox
                showPointFlag: 0,// 判断是否可使用积分
                switchFlag: true,// 积分使用开关
                pointInfo: {},// 将有使用积分时的积分信息保存下来

                price: {},// 记录价格字段

                isShowSku: false,
                sendList: [],// 赠品列表
                skuPopupList: '',// 赠品sku选择
                colorActiveIndex: null,
                sizeActiveIndex: null,
                sendActiveItem: {},// 赠品当前选中
                totalSendNum: 0,    // 赠品数量
            };
        },
        computed: {
            /** 是否显示积分行 **/
            visiblePoint(){
                return this.showPointFlag == 1 && !this.disabledPoint
            },
            /** 积分开关布尔值转换成数字 **/
            usePointFlag(){
                return this.switchFlag ? 1 : 0;
            },
            /** 当前选中优惠券 **/
            activeCoupon(){
                let cards = [];
                if (this.cashCouponId) {
                    cards.push(this.cashCouponId);
                }
                if (this.disCouponId) {
                    cards.push(this.disCouponId);
                }
                if (cards.length > 0) {
                    cards = cards.join(",");
                } else {
                    cards = "";
                }
                return cards;
            },
            /** 判断是否可使用积分 **/
//            showPointFlag(){
//                // "integralFlag":  启用积分抵现 1：启用， 0停用;  "effFlag": 状态 1：启用，0停用;  "moreThanMin": 是否超过最小可用积分； "prPointValue": 积分面值； "minPoint": 最小使用积分；
//                if(this.userPointInfo.effFlag == 1 &&
//                        this.userPointInfo.integralFlag == 1 &&
//                        this.userPointInfo.moreThanMin &&
//                        typeof this.userPointInfo.prPointValue === 'number'){
//
//                    return 1;
//                }
//                return 0;
//            },
            otherGold() {
                return (this.totalGold - this.totalPrice).toFixed(2) - this.preferentialPrice;
            },
            // 商品总额
            totalGold() {
                let allAmount = 0;
                this.shoppingCartList.forEach(item => {
                    allAmount += item.dealPrice * item.amount;
                });
                return allAmount;
            },
            // 优惠价
            preferentialPrice() {
                let price = this.price.vipPrice +
                        this.price.cashCouponPrice +
                        this.price.disCouponPrice +
                        (this.price.pointPirce || 0) +
                        this.price.storedValueCardPrice;
                return +(price.toFixed(2)) || 0;
            },
            // 结算时 要提交赠品数据
            promotionArr() {
                let promotionArr = [];

                if (this.sendList && this.sendList.length > 0) {
                    this.sendList.forEach(itemParent => {
                        //  添加赠品字段
                        if (itemParent.giftGroup && itemParent.giftGroup.length > 0) {
                            itemParent.giftGroup.forEach((item) => {
                                if (item.groupType !== "指定") {
                                    //  非指定商品全选
                                    item.gifts.forEach((goods) => {
                                        promotionArr.push(goods);
                                    });
                                }
                                if (item.groupType === "指定") {
                                    // 指定商品选择
                                    if (item.choseCode) {
                                        promotionArr.push(item.choseGoods);
                                    }
                                }
                            });
                        }
                    })
                }

                if (!promotionArr || promotionArr.length <= 0) {
                    promotionArr = null;
                }
                console.log("promotePartDto", promotionArr);
                return promotionArr;
            },
            // 判断促销 指定是否已选 return true标识都已勾选
            checkoutPromotionSelect() {
                let needSelect = 0,// 需要指定惠赠个数
                    selected = 0;// 已指定个数
                this.sendList.forEach(itemParent => {
                    //  添加赠品字段
                    if (itemParent.giftGroup && itemParent.giftGroup.length > 0) {
                        itemParent.giftGroup.forEach((item) => {
                            if (item.groupType === "指定") {
                                needSelect++;
                                // 指定商品选择
                                if (item.choseCode) {
                                    selected++;
                                }
                            }
                        });
                    }
                })
                return needSelect == selected;
            },
        },
        methods: {
            /** 点击勾选使用积分 **/
            pointChange(val){
                if(this.disabledPoint) return;
//                this.usePointFlag = val?1:0;
//                console.log('即将打印user------------=====》',this.usePointFlag)
                this.getDiscount();
            },
            /** 点击展开会员卡列表 **/
            openCartList() {
                // 规划确认不做调价禁用判断
//                if (this.disabledCart) {
//                    Toast("当前商品为调价商品，无法使用会员卡");
//                    return
//                }
                this.showCartList = !this.showCartList;
            },
            /** 校验是否可使用会员卡 **/
//            checkUseableCart() {
//                // 存在未调价商品则返回true 表示可使用会员卡
//                let disabledCart = this.shoppingCartList.some(item => {
//                    if (item.salePrice == item.dealPrice) {
//                        return true;
//                    }
//                })
//                this.disabledCart = disabledCart ? false : true;// true
//                if (this.disabledCart) {
//                    this.cardId = -1;
//                }
//            },
            // 选择会员卡
            selectedVipCard(item) {
                if (this.cardId === item.id) return;
                this.cardId = item.id;
                // 清空已选券 由于包含异步调用价格接口 可能返回比结尾的getDiscount的返回慢导致结果有误
//                this.useCoupon('', 0);
//                this.useCoupon('', 1);

                this.disCouponId = ""; // 选中折扣券id
                this.cashCouponId = ""; // 选中优惠券id

                // 获取券列表
                this.getCouponsList();
                // 计算价格
                this.getDiscount();
            },
            //  获取快递配送地址
            getAddr() {
                this.addressMsg = {};
                let addr = Storage.get("settlementAddr");
                if (addr) {
                    this.addressMsg = addr;
                    this.hasAddr = true;
                    this.getTransFee();
                } else {
                    let defaultFlag = false
                    //  获取个人默认地址
                    let data = {
                        vipUsrId: Storage.get("USER_INFO").usrId
                    };
                    UserService.getAddrList(data).then(
                        (res) => {
                            if (res && res.length > 0) {
                                this.hasAddr = true;
                                for (let i = 0; i < res.length; i++) {
                                    if (res[i].defaultFlag === 1) {
                                        this.addressMsg = res[i];
                                        this.getTransFee();
                                        defaultFlag = true
                                        return
                                    } else {
                                        defaultFlag = false
                                    }
                                }
                                if (!defaultFlag) {
                                    this.addressMsg = res[0] || {};
                                    this.getTransFee();
                                }
                            } else {

                            }
                        },
                        (err) => {
                        }
                    );
                }
            },

            //  快递配送省市区选择
            areaChange(value) {
                if (this.delivery === "kdps") {
                    this.addressMsg.province = value[0].name;
                    this.addressMsg.district = value[1].name;
                    this.addressMsg.city = value[2].name;
                    this.addressMsg.addressId = value[2].code;
                    this.addressMsg.districtCode = value[2].code;
                    console.log("this.addressMsg.addressId", this.addressMsg.addressId);
                    this.getTransFee();
                } else {
                    this.pickupMsg.province = value[0].name;
                    this.pickupMsg.district = value[1].name;
                    this.pickupMsg.city = value[2].name;
                    this.pickupMsg.addressId = value[2].code;
                    this.pickupMsg.storeId = null;
                    this.pickupMsg.storeName = "请选择取货门店";
                    this.pickupMsg.storeNameText = "请选择取货门店";
                    let data = {
                        code: this.pickupMsg.addressId,
                        pageNo: 1,
                        pageSize: 50
                    };
                    Base.getShopList(data).then((res) => {
                        if (res.list.length < 1) {
                            this.pickupMsg.storeName = "该地区暂无可取货的门店";
                            this.pickupMsg.storeNameText = "该地区暂无可取货的门店";
                        }
                        res.list.forEach((item) => {
                            item.text = item.dptName;
                            item.addressText = item.address;
                        });
                        this.storeList = res.list;
                    });
                }
                this.showAreaList = false;
            },

            // 校验电话号码
            checkPhoneNum(phone) {
                let reg = /^1(((5[0-35-9][0-9])|(7([0678])[0-9])|([3489][0-9]{2}))[0-9]{7})$/; // 验证手机号的正则表达式
                if (!reg.test(phone)) {
                    this.checkPhone = false;
                    return;
                } else {
                    this.checkPhone = true;
                }
            },

            //  判断是否有可选择的门店
            checkStore() {
                if (this.storeList.length > 0) {
                    this.showStoreList = true;
                } else {
                    Toast("该地区暂无可取货的门店~");
                }
            },

            // 选择门店
            selectStore(value, index) {
                this.pickupMsg.storeId = value.id;
                this.pickupMsg.storeName = value.addressText;
                this.pickupMsg.storeNameText = value.text;
                this.showStoreList = false;
            },

            //  展开折叠商品sku
            skuToggle(item) {
                item.showSku = !item.showSku;
            },

            //  获取运费
            getTransFee() {
                let data = {
                    usrId: Storage.get("USER_INFO").usrId,
                    companyId: Storage.get("USER_INFO").companyId,
                    id: this.orderHdId,
                    destCode: this.addressMsg.addressId
                        ? this.addressMsg.addressId
                        : this.addressMsg.districtCode
                };
                if (this.addressMsg.destId) {
                    data.destId = this.addressMsg.destId;
                }
                Order.getFreight(data).then((res) => {
                    this.transFee = res;
                });
            },

            //  获取结算页信息
            getPage() {
                let data = {
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    cookieId: Storage.get("USER_INFO").cookieId,
                    rtlCartTempHdId: this.orderHdId || this.$route.query.orderHdId,
                    busContsCode: baseConstant.busContsCode,
                    shopCode: Storage.get("USER_INFO").shopCode
                };
                let embs = [];
                let epts = [];
                let map = {};
                let prt = [];
                Order.getSettlementInfo(data)
                    .then((res) => {
                        res.skuList.forEach((item) => {
                            if (item.orderFlag === 1) {
                                item.showSku = false;
                                //  整理绣字绣花
                                item.partList.forEach((part) => {
                                    if (part.emb.length > 0) {
                                        map.name = part.regionName;
                                        map.url = part.emb[0].embPictUrl;
                                        map.content = part.emb[0].content;
                                        map.price = part.emb[0].embprice;
                                        embs.push(map);
                                        map = {};
                                    }
                                    if (part.ept.length > 0) {
                                        map.name = part.regionName;
                                        map.url = part.ept[0].embPrintPictUrl;
                                        map.price = part.ept[0].embprice;
                                        epts.push(map);
                                        map = {};
                                    }
                                    if (part.prt.length > 0) {
                                        map.name = part.regionName;
                                        map.url = part.prt[0].embPrintPictUrl;
                                        map.price = part.prt[0].prtprice;
                                        prt.push(map);
                                        map = {};
                                    }
                                });
                                item.embs = embs;
                                item.epts = epts;
                                item.prt = prt;
                                embs = [];
                                epts = [];
                                prt = [];
                            }
                        });
                        this.shoppingCartList = res.skuList;
                    })
                    .then(() => {
                        if (!!Storage.get('store')) return
                        // 校验是否可使用会员卡 该方法需在获取价格和券列表调用之前
//                        this.checkUseableCart();

                        this.getDiscount();
                        this.getCouponsList();

                    });
            },

            //  获取配送方式
            getShipType() {
                let data = {
                    effFlag: 1,
                    policyTypeCode: "D_SALERETAIL"
                };
                let deliveryStorage = Storage.get("orderDelivery");
                // console.log("sssssssssssss", deliveryStorage);
                Order.getShipType(data).then((res) => {
                    res.forEach((item) => {
                        if (item.shipCode === "kdps" || item.shipCode === "mdzq") {
                            this.deliveryType.push(item);
                        }
                    });
                    if (deliveryStorage !== null && deliveryStorage.type) {
                        this.delivery = deliveryStorage.type;
                    } else {
                        this.delivery = this.deliveryType[0].shipCode;
                        // 默认选择快递
                        this.deliveryType.forEach((item) => {
                            if (item.shipCode.indexOf("kdps") !== -1) {
                                this.delivery = item.shipCode;
                            }
                        });
                        let map = {};
                        map.type = this.delivery;
                        Storage.set("orderDelivery", map);
                    }
                });
            },

            //  选择配送方式
            choseDelivery(item) {
                this.delivery = item.shipCode;
                let deliveryStorage = Storage.get("orderDelivery");
                if (deliveryStorage && deliveryStorage !== null) {
                    deliveryStorage.type = this.delivery;
                    Storage.set("orderDelivery", deliveryStorage);
                } else {
                    let map = {};
                    map.type = this.delivery;
                    Storage.set("orderDelivery", map);
                }
            },

            //  获取发票设置
            getInvoice() {
                let data = {};
                Invoice.canSetInvoice(data).then((res) => {
                    if (res.invoiceStateCode === "D_INV_ORDSAVE") {
                        this.invoiceStatus = true;
                    } else {
                        this.invoiceStatus = false;
                    }
                });
            },
            /** 保存地址 **/
            saveAddress() {
                console.log("---", this.hasAddr, this.delivery)
                //  用户地址列表为空的情况下储存地址（使用addrFlag确保保存地址操作只被调用一次）
                if (this.hasAddr === false && this.delivery === "kdps") {
                    let data = {
                        address: this.addressMsg.address,
                        cargousrName: this.addressMsg.cargousrName,
                        cargoMobile: this.addressMsg.cargoMobile,
                        cargoPhone: this.addressMsg.cargoMobile,
                        destCode: this.addressMsg.districtCode
                            ? this.addressMsg.districtCode
                            : this.addressMsg.addressId,
                        defaultFlag: 1
                    };
                    UserService.changeAddrInfo(data).then(() => {
                    });
                }
            },

            // 查询商品库存
            async getGoodsStucks(item, groupId, salePmHdId) {
                let flag = false    // 默认库存不足
                let data = {
                    busContsCode: baseConstant.busContsCode,
                    goodsCode: item.goodsCode,
                    colorCode: item.colorCode,
                    sizeCode: item.sizeCode,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    onlineHdId: salePmHdId,
                    groupId: groupId
                };
                await Goods.getGoodsStock(data).then((res) => {
                    if (item.num) {
                        if (item.num <= res.skuList[0].skuQty) {
                            flag = true
                        }
                    } else {
                        if (item.amount <= res.skuList[0].skuQty) {
                            flag = true
                        }
                    }
                });
                return flag
            },

            //  提交订单
            async saveOrder() {
                if (this.btnLock === true) {
                    return;
                }
                this.btnLock = true;
                let that = this;
                console.log('this.deliveryType', this.deliveryType)
                //  获取配送方式code对应的id
                let receiptWayId = "";
                this.deliveryType.forEach((item) => {
                    if (item.shipCode === this.delivery) {
                        receiptWayId = item.id;
                    }
                });
                let data = {};
                //  选择的优惠券
                let vouchers = [];
                if (this.disCouponId !== "") {
                    vouchers.push(this.disCouponId);
                }
                if (this.cashCouponId !== "") {
                    vouchers.push(this.cashCouponId);
                }
                //  配送方式参数组装
                if (this.delivery === "kdps") {
                    if (!this.addressMsg.addressId) this.addressMsg.addressId = this.addressMsg.districtCode
                    if (
                        !this.addressMsg.addressId ||
                        !this.addressMsg.address ||
                        !this.addressMsg.cargoMobile ||
                        !this.addressMsg.cargousrName
                    ) {
                        console.log(this.addressMsg)
                        Toast("请先完善收货信息~");
                        this.btnLock = false;
                        return;
                    }
                    //  快递配送参数配置
                    data = {
                        billId: this.orderHdId,
                        busContsCode: baseConstant.busContsCode,
                        shopCode: Storage.get("USER_INFO").shopCode,
                        shopId: Storage.get("USER_INFO").shopId,
                        ctmUsrId: Storage.get("USER_INFO").usrId,
                        sourceCode: "D_ORDWEIN",
                        receiptWayCode: this.delivery,
                        receiptWayId: receiptWayId,
                        buyUsrMobile: this.addressMsg.cargoMobile,
                        cargoAddr: this.addressMsg.address,
                        cargoDestrictCode: this.addressMsg.districtCode
                            ? this.addressMsg.districtCode
                            : this.addressMsg.addressId,
                        cargoMobile: this.addressMsg.cargoMobile,
                        cargoUsrName: this.addressMsg.cargousrName,
                        cartList: this.shoppingCartList,
                        ctmMessage: this.memo,
                        promotionList: vouchers,
                        pointFlag: this.usePointFlag,//是否使用积分
                    };
                } else if (this.delivery === "mdzq") {
                    if (
                        !this.pickupMsg.phone ||
                        !this.pickupMsg.addressId ||
                        !this.pickupMsg.name
                    ) {
                        Toast("请先完善取货信息~");
                        this.btnLock = false;
                        return;
                    }
                    if (this.pickupMsg.storeId === null) {
                        Toast("取货门店不能为空~");
                        this.btnLock = false;
                        return;
                    }
                    //  门店自取参数配置

                    data = {
                        billId: this.orderHdId,
                        busContsCode: baseConstant.busContsCode,
                        shopCode: Storage.get("USER_INFO").shopCode,
                        shopId: Storage.get("USER_INFO").shopId,
                        sourceCode: "D_ORDWEIN",
                        buyUsrMobile: this.pickupMsg.phone,
                        cargoAddr: this.pickupMsg.storeName,
                        cargoDestrictCode: this.pickupMsg.addressId,
                        cargoMobile: this.pickupMsg.phone,
                        cargoUsrName: this.pickupMsg.name,
                        cartList: this.shoppingCartList,
                        ctmUsrId: Storage.get("USER_INFO").usrId,
                        ctmMessage: this.memo,
                        receiptWayCode: this.delivery,
                        receiptWayId: receiptWayId,
                        recptDptId: this.pickupMsg.storeId,
                        promotionList: vouchers,
                        pointFlag: this.usePointFlag,//是否使用积分
                    };
                }
//                // 赠品参数
//                if (this.promotionArr !== null) {
//                    data.promotePartDto = this.promotionArr;
//                }
//                // 判断指定惠赠是否都已选择
//                if(!this.checkoutPromotionSelect){
//                    Toast("请选择赠送商品的类型");
//                    this.btnLock = false;
//                    return
//                }
                data.vipCardHdId = this.cardId || null;//会员卡id


                // 赠品
                let stockFlag = false
                if (this.sendList && this.sendList.length > 0) {
                    // 判断是否已经选择赠品
                    for (let i = 0; i < this.sendList.length; i++) {
                        for (let j = 0; j < this.sendList[i].giftGroup.length; j++) {
                            let current = this.sendList[i].giftGroup[j]

                            if (!stockFlag && current.groupType === "指定") {
                                // 未选择赠品
                                if (!current.choseGoods.goodsCode ||
                                    current.choseGoods.goodsCode === undefined) {
                                    Toast('请选择赠品')
                                    this.btnLock = false
                                    return
                                }
                            }
                        }
                    }

                    // 判断赠品库存
                    for (let i = 0; i < this.sendList.length; i++) {
                        for (let j = 0; j < this.sendList[i].giftGroup.length; j++) {
                            let current = this.sendList[i].giftGroup[j]

                            if (!stockFlag && current.groupType !== "指定") {
                                for (let k = 0; k < current.gifts.length; k++) {
                                    let flag = await this.getGoodsStucks(current.gifts[k], this.sendList[i].giftGroup[j].groupId, this.sendList[i].salePmHdId)
                                    if (flag === false) {
                                        stockFlag = true

                                        if (stockFlag) {
                                            Dialog.confirm({
                                                title: '提示',
                                                message: '赠品库存不足，是否继续购买？'
                                            }).then(async () => {
                                                // 需求调整，请勿删除
//                                                this.handleEmitBill(false)

                                                this.sendList = []
                                                await this.getDiscount();
                                                if (this.price.gifts && this.price.gifts.length > 0) {
                                                    this.sendList = this._giftCommonData(this.price.gifts)
                                                }

                                                this.handleEmitBill(data)
                                                this.btnLock = false

                                            }).catch(async () => {
                                                this.sendList = []
                                                await this.getDiscount();
                                                if (this.price.gifts && this.price.gifts.length > 0) {
                                                    this.sendList = this._giftCommonData(this.price.gifts)
                                                }
                                                this.btnLock = false
                                            });
                                            break
                                        }
                                    }
                                }
                            }

                            if (!stockFlag && current.groupType === "指定") {
                                let flag = await this.getGoodsStucks(current.choseGoods, this.sendList[i].giftGroup[j].groupId, this.sendList[i].salePmHdId)
                                if (flag === false) {
                                    stockFlag = true

                                    if (stockFlag) {
                                        Dialog.confirm({
                                            title: '提示',
                                            message: '赠品库存不足，是否继续购买？'
                                        }).then(async () => {
                                            // 需求调整，请勿删除
//                                            this.handleEmitBill(false)

                                            this.sendList = []
                                            await this.getDiscount();
                                            if (this.price.gifts && this.price.gifts.length > 0) {
                                                Toast('请重新选择赠品~')
                                                this.sendList = this._giftCommonData(this.price.gifts)
                                            }
                                            this.btnLock = false
//                                            this.handleEmitBill()
                                        }).catch(async () => {
                                            // this.sendList = []
                                            // this.getOrderPromotion()

                                            this.sendList = []
                                            await this.getDiscount();
                                            if (this.price.gifts && this.price.gifts.length > 0) {
                                                this.sendList = this._giftCommonData(this.price.gifts)
                                            }
                                            this.btnLock = false
                                        });
                                        break
                                    }
                                }
                            }
                        }
                    }

                    if (!stockFlag) {
                        this.handleEmitBill(data)
                    }

                } else {
                    this.handleEmitBill(data)
                }
            },

            /**
             * 微信支付
             * @param data
             */
            handleEmitBill(data) {
                let that = this;
                let promotionArr = [];
                //  添加赠品字段
                if (this.sendList && this.sendList.length > 0) {
                    this.sendList.forEach((item) => {
                        item.giftGroup.forEach(async (giftGroupItem) => {
                            if (giftGroupItem.groupType !== "指定") {
                                //  非指定商品全选
                                giftGroupItem.gifts.forEach((goods) => {
                                    promotionArr.push(goods);
                                });
                            }
                            if (giftGroupItem.groupType === "指定") {
                                // 指定商品选择
                                if (giftGroupItem.choseCode) {
                                    promotionArr.push(giftGroupItem.choseGoods);
                                }
                            }
                        })
                    });
                }
                if (promotionArr.length <= 0) {
                    promotionArr = null;
                }
                if (promotionArr !== null) {
                    data.promotePartDto = promotionArr;
                }

                Order.saveOrder(data)
                    .then(async (res) => {
                            console.log("订单号", res);
                            //  开发票操作，当实际支付金额（不包含运费）大于0时开发票
                            if (this.totalPrice > 0) {
                                if (
                                    this.invoiceData.data &&
                                    this.invoiceData.data !== undefined &&
                                    this.invoiceData.data !== null
                                ) {
                                    let invoiceData = this.invoiceData.data;
                                    invoiceData.billCode = res;
                                    Invoice.putInvoice(invoiceData)
                                        .then(() => {
                                        })
                                        .then(() => {
                                            Storage.remove("invoiceData");
                                            Storage.remove("orderDelivery");
                                        });
                                }
                            }
                            let totalPrice = 0;
                            //  实际支付金额
                            if (this.delivery === "kdps") {
                                totalPrice = this.totalPrice + this.transFee;
                            } else {
                                totalPrice = this.totalPrice;
                            }
                            // 保存地址
                            this.saveAddress();
                            if (totalPrice <= 0) {
                                let params = {
                                    operType: 'FRONT_PAY',
                                    billCode: res,
                                    ownCompanyId: Storage.get("COMPANYID").company_id
                                }
                                await Order.lockZero(params).then(result => {
                                    // console.log("0元锁库存",result)
                                    Toast("购买成功~");
                                    that.$router.replace({
                                        name: "waitShip",
                                        query: {billCode: res}
                                    });
                                })
                            } else {
                                //  调取支付
                                let orderData = {
                                    usrId: Storage.get("USER_INFO").usrId,
                                    paymentCode: "D_WEIXIN",
                                    tradeTypeCode: "JSAPI",
                                    paymentTypeCode: "D_FULL",
                                    shopCode: Storage.get("USER_INFO").shopCode,
                                    orderList: res,
                                    openId: Storage.get("WECHAT_INFO").openid,
                                    payAmount: totalPrice.toFixed(2)
                                };
                                await Payment.payOrder(orderData)
                                    .then((config) => {
                                        if (typeof WeixinJSBridge == "undefined") {
                                            if (document.addEventListener) {
                                                document.addEventListener(
                                                    "WeixinJSBridgeReady",
                                                    onBridgeReady,
                                                    false
                                                );
                                            } else if (document.attachEvent) {
                                                document.attachEvent(
                                                    "WeixinJSBridgeReady",
                                                    onBridgeReady
                                                );
                                                document.attachEvent(
                                                    "onWeixinJSBridgeReady",
                                                    onBridgeReady
                                                );
                                            }
                                        } else {
                                            if (config.code === "200") {
                                                let appid = "";
                                                let num1 = config.requestStr.indexOf("<appid>");
                                                let num2 = config.requestStr.indexOf("</appid>");
                                                if (config.requestStr.substring(num1 + 7, num2)) {
                                                    appid = config.requestStr
                                                        .substring(num1 + 7, num2)
                                                        .toString();
                                                } else {
                                                    appid = "wx45b40e5b82bd74d2";
                                                }
                                                WeixinJSBridge.invoke(
                                                    "getBrandWCPayRequest",
                                                    {
                                                        appId: appid || "wx45b40e5b82bd74d2", //公众号名称，由商户传入
                                                        timeStamp: config.timeStamp, //时间戳，自1970年以来的秒数
                                                        nonceStr: config.nonceStr, //随机串
                                                        package: config.prepayId,
                                                        signType: "MD5", //微信签名方式：
                                                        paySign: config.paySign //微信签名
                                                    },
                                                    function (resp) {
                                                        if (resp.err_msg == "get_brand_wcpay_request:ok") {
                                                            // 使用以上方式判断前端返回,微信团队郑重提示：
                                                            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                                            that.btnLock = false;
                                                            window.setTimeout(function () {
                                                                that.$router.replace({
                                                                    name: "waitShip",
                                                                    query: {
                                                                        billCode: res,
                                                                        ordStatusCode: "D_ORDSSHIPPING"
                                                                    }
                                                                });
                                                            }, 1000);
                                                            Toast("订单提交成功~");
                                                        } else if (
                                                            resp.err_msg == "get_brand_wcpay_request:cancel"
                                                        ) {
                                                            // false
                                                            // alert('取消');
                                                            that.btnLock = false;
                                                            that.$router.replace({
                                                                name: "waitPay",
                                                                query: {
                                                                    billCode: res,
                                                                    ordStatusCode: "D_ORDSPAYING"
                                                                }
                                                            });
                                                        } else {
                                                            that.btnLock = false;
                                                            alert("支付出错了");
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    })
                                    .then(() => {
                                        that.btnLock = false;
                                    });
                            }
                        },
                        (err) => {
                            that.btnLock = false;
                            if (err.errorMsg) {
                                Toast(err.errorMsg);
                            }
                        }
                    )
                    .then(() => {
                        // 清空选择地址缓存、配送方式缓存、发票类型
                        Storage.remove("settlementAddr");
                        Storage.remove("orderDelivery");
                        Storage.remove("invoiceData");

                        that.btnLock = false;
                    });
            },

            // 获取结算页面可用优惠券列表
            getCouponsList() {
                let data = {
                    shopId: Storage.get("USER_INFO").shopId,
                    rtlOrdInterHdId: this.orderHdId,
                    scopeId: 0,
                    vipCardHdId: this.cardId || null,//会员卡id
                };
                Vouchers.getOrderCouponsList(data).then((res) => {
                    this.disCouponList = [];
                    this.cashCouponList = [];
                    res.forEach((item) => {
                        if (item.discount) {
                            this.disCouponList.push(item);
                        } else {
                            this.cashCouponList.push(item);
                        }
                    });
                });
            },
            /**
             * 获取价格
             * @params
             * internalPointFlag: 在getDiscount函数中递归调用才传，其他地方不可传(以该字段结束递归)
             **/
            getDiscount(cards, internalPointFlag) {
                let usePointFlag = internalPointFlag;
                if(typeof usePointFlag !== 'number') {
                    usePointFlag = this.showPointFlag;
                }
                let data = {
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: !!cards ? cards : this.activeCoupon,
                    shopId: Storage.get("USER_INFO").shopId,
                    pointFlag: usePointFlag, //是否使用积分
                    vipCardHdId: this.cardId || null,//会员卡id
                    busContsCode: baseConstant.busContsCode,
                };
                Vouchers.getOrderDiscount(data).then((res) => {
                    this.price = res;
                    let num = res.salePrice.toFixed(2);
                    this.totalPrice = num * 1.0;
                    this.vipPrice = Number(res.vipPrice).toFixed(2);
                    this.disCouponPrice = Number(res.disCouponPrice).toFixed(2);
                    this.cashCouponPrice = Number(res.cashCouponPrice).toFixed(2);
                    this.storedValueCardPrice = Number(res.storedValueCardPrice).toFixed(2);

                    // 将有使用积分时的积分信息保存下来
                    if(this.price.point){
                        this.pointInfo = {
                            point: this.price.point,
                            pointPirce: this.price.pointPirce,
                        }
                    }

                    // 如果有显示积分 && 不是内部调用
                    if(this.showPointFlag && typeof internalPointFlag !== 'number') {

                        // 积分逻辑
                        let checkPrice = this.price.salePrice + (this.price.pointPirce?this.price.pointPirce:0);

                        // 商品价格（扣除积分前所有应扣价格）  <  最低积分使用额度   ==》  不让使用积分
                        if(!this.price.pointPirce || checkPrice < this.userPointInfo.prPointValue * this.userPointInfo.minPoint){
                            // 之前是勾选使用积分的情况
                            if(this.switchFlag) {
                                this.switchFlag = false;
                                this.disabledPoint = true;
                                this.getDiscount('', 0);
                            }else{
                                this.disabledPoint = true;
                                this.getDiscount('', 0);
                            }
                        }else{// 满足使用积分
                            // 之前是勾选使用积分的情况
                            if(this.switchFlag) {

                            }else{
                                this.disabledPoint = false;
                                this.$nextTick(()=>{
                                    this.getDiscount('', this.switchFlag?1:0);
                                })
                            }
                        }
                    }

                    // 获取赠品
                    this.sendList = []
                    if (this.price.gifts !== undefined && this.price.gifts !== null && this.price.gifts.length > 0) {
                        this.sendList = this._giftCommonData(this.price.gifts)
                        this.totalSend()
                    }
                });
            },

            /**
             * 赠品数据组装
             * @param data 原始数据
             */
            _giftCommonData(data) {
                let newSendList = []

                data.forEach((giftItem) => {
                    giftItem.giftGroup.forEach((itm) => {
                        if (itm.groupType === "随机") {
                            // 随机全部赠送
                        }
                        if (itm.groupType === "固定") {
                            //  固定全部赠送
                        }
                        if (itm.groupType === "指定") {
                            //  选择一件商品
                            itm.choseCode = "";
                            itm.choseGoods = {};
                            itm.showArr = false;
                        }

                        itm.gifts.forEach((giftsItm) => {
                            // 促销id
                            giftsItm.salePmHdId = data[0].salePmHdId

                            // 赠品数量累加
                            let obj = {}
                            if (newSendList.length === 0) {
                                obj.goodsCode = giftsItm.goodsCode
                                obj.skuId = giftsItm.skuId
                                obj.num = giftsItm.amount
                                newSendList.push(obj)
                            } else {
                                let isNumAddFlag = false
                                for (let i = 0; i < newSendList.length; i++) {
                                    if (newSendList[i].goodsCode === giftsItm.goodsCode &&
                                        newSendList[i].skuId === giftsItm.skuId) {
                                        newSendList[i].num += giftsItm.amount
                                        isNumAddFlag = true
                                        break
                                    }
                                }

                                if (!isNumAddFlag) {
                                    obj.goodsCode = giftsItm.goodsCode
                                    obj.skuId = giftsItm.skuId
                                    obj.num = giftsItm.amount
                                    newSendList.push(obj)
                                }
                            }
                        })
                    })
                });

                // todo
                data.forEach((giftItem) => {
                    giftItem.giftGroup.forEach((itm) => {
                        itm.gifts.forEach((giftsItm) => {
                            newSendList.forEach((newItem, newIndex) => {
                                if (newItem.goodsCode === giftsItm.goodsCode &&
                                    newItem.skuId === giftsItm.skuId) {

                                    giftsItm.num = newItem.num
                                }
                            })
                        })
                    })
                });

                return data
            },

            // 组件回调：尺码、颜色选择
            onSelectColor(colorItem, sizeItem, currentSend) {
                let obj = {}
                let imgFlag = false
                currentSend.colorAndSizeList.forEach((item) => {
                    if (item.colorCode === colorItem.colorCode) {
                        item.sizeChildList.forEach((itm) => {
                            if (itm.sizeCode === sizeItem.sizeCode) {
                                obj.amount = itm.skuQty
                                obj.skuId = itm.skuId
                                obj.salePmHdId = itm.salePmHdId
                                obj.giftId = itm.giftId

                                // 优先取颜色图，没有颜色图取主图
                                if (itm.url) {
                                    obj.url = itm.url
                                } else {
                                    obj.url = currentSend.url
                                }
                            }
                        })
                    }
                })
                // 商品id
                obj.partHdId = currentSend.partHdId

                this.sendList.forEach((sendItem, sendIndex) => {
                    sendItem.giftGroup.forEach((giftGroupItem, giftGroupIndex) => {
                        for (let i = 0; i < giftGroupItem.gifts.length; i++) {
                            let current = giftGroupItem.gifts[i]
                            if (current.colorCode === colorItem.colorCode &&
                                current.sizeCode === sizeItem.sizeCode &&
                                sendIndex === this.sendListIndex) {
                                giftGroupItem.choseCode = ''
                                giftGroupItem.choseGoods = {}

                                giftGroupItem.choseCode = colorItem.classCode
                                giftGroupItem.choseGoods.goodsCode = colorItem.goodsCode
                                giftGroupItem.choseGoods.goodsName = colorItem.goodsName

                                giftGroupItem.choseGoods.colorCode = colorItem.colorCode
                                giftGroupItem.choseGoods.colorId = colorItem.colorId
                                giftGroupItem.choseGoods.colorName = colorItem.colorName

                                giftGroupItem.choseGoods.sizeCode = sizeItem.sizeCode
                                giftGroupItem.choseGoods.sizeId = sizeItem.sizeId
                                giftGroupItem.choseGoods.sizeName = sizeItem.sizeName

                                giftGroupItem.choseGoods.amount = obj.amount
                                giftGroupItem.choseGoods.skuId = obj.skuId
                                giftGroupItem.choseGoods.salePmHdId = obj.salePmHdId
                                giftGroupItem.choseGoods.url = obj.url
                                giftGroupItem.choseGoods.partHdId = obj.partHdId
                                giftGroupItem.choseGoods.giftId = obj.giftId

                                break
                            }
                        }
                    })
                })

                this.totalSend()
                this.$emit('update:sendList', this.sendList)
            },

            // sku弹窗
            async skuChose(item, index) {
                console.log(item)
                console.log(index)
                this.isShowSku = !this.isShowSku
                this.sendListIndex = index

                // 判断赠品当前是否有选中状态
                if (item.choseGoods.goodsCode) {
                    this.sendActiveItem = item.choseGoods
                } else {
                    this.sendActiveItem = {}
                }

                let goodSkuArr = []

                // 区分货号
                item.gifts.forEach((itm, itmIndex) => {
                    let goodSkuObj = {}
                    goodSkuObj.colorList = []
                    goodSkuObj.sizeList = []
                    goodSkuObj.colorAndSizeList = []
                    goodSkuObj.salePrice = 0

                    goodSkuObj.goodsCode = itm.goodsCode
                    goodSkuObj.partHdId = itm.partHdId
                    goodSkuObj.goodsName = itm.goodsName
                    goodSkuObj.url = itm.url

                    goodSkuArr.push(goodSkuObj)
                })

                // 去重相同的货号
                let newGoodSkuArr = objCombine(goodSkuArr, 'goodsCode')

                // 颜色、尺码放到指定的商品下
                newGoodSkuArr.forEach((newGoodItem) => {
                    let combineColor = []
                    let combineSize = []
                    item.gifts.forEach((itm) => {
                        if (newGoodItem.goodsCode === itm.goodsCode) {
                            // 颜色
                            let colorObj = {}
                            colorObj.colorCode = itm.colorCode
                            colorObj.colorId = itm.colorId
                            colorObj.colorName = itm.colorName
                            colorObj.colorSortSeq = itm.colorSortSeq

                            colorObj.classCode = itm.classCode
                            colorObj.goodsCode = itm.goodsCode
                            colorObj.goodsName = itm.goodsName

                            colorObj.urls = []
                            colorObj.none = true     // 默认按钮可以点击

                            combineColor.push(colorObj)

                            // 尺码
                            let sizeObj = {}
                            sizeObj.sizeCode = itm.sizeCode
                            sizeObj.sizeId = itm.sizeId
                            sizeObj.sizeName = itm.sizeName
                            sizeObj.sizeSortSeq = itm.sizeSortSeq
                            sizeObj.none = true     // 默认按钮可以点击
                            combineSize.push(sizeObj)
                        }
                    })

                    // 对象去重
                    let repeatColorList = objCombine(combineColor, 'colorCode')
                    let repeatSizeList = objCombine(combineSize, 'sizeCode')

                    // 赠品排序
                    newGoodItem.colorList = repeatColorList.sort(compare('colorSortSeq'))
                    newGoodItem.sizeList = repeatSizeList.sort(compare('sizeSortSeq'))
                })

                // 颜色放到colorAndSizeList
                newGoodSkuArr.forEach((arrItem) => {
                    arrItem.colorList.forEach((colorAndSizeItem, colorAndSizeIndex) => {
                        let obj = {}
                        obj.colorCode = colorAndSizeItem.colorCode
                        obj.colorId = colorAndSizeItem.colorId
                        obj.colorName = colorAndSizeItem.colorName
                        arrItem.colorAndSizeList.push(obj)
                        arrItem.colorAndSizeList[colorAndSizeIndex].sizeChildList = []
                    })
                })

                newGoodSkuArr.forEach((arrItem, arrIndex) => {
                    arrItem.colorAndSizeList.forEach((colorAndSizeItem) => {
                        item.gifts.forEach((itm, itmIndex) => {
                            if (itm.goodsCode === arrItem.goodsCode && itm.colorCode === colorAndSizeItem.colorCode) {
                                let obj = {}
                                obj.sizeCode = itm.sizeCode
                                obj.sizeName = itm.sizeName
                                obj.skuId = itm.skuId
                                obj.skuQty = itm.amount
                                obj.salePmHdId = itm.salePmHdId
                                obj.url = itm.url
                                obj.giftId = itm.giftId // 赠品来自哪个促销商品
                                colorAndSizeItem.sizeChildList.push(obj)
                            }
                        })
                    })
                })

                this.skuPopupList = newGoodSkuArr
            },

            // 赠品数量
            totalSend() {
                let total = 0

                this.sendList.forEach((sendItem) => {
                    sendItem.giftGroup.forEach((giftGroupItem) => {
                        if (giftGroupItem.groupType !== '指定') {
                            giftGroupItem.gifts.forEach((giftsItem) => {
                                total += giftsItem.amount
                            })
                        } else {
                            if (giftGroupItem.choseCode) {
                                total += giftGroupItem.choseGoods.amount
                            }
                        }
                    })
                })

                this.totalSendNum = total
            },

            //  选择卡券  (type为1表示修改现金券，type为0表示修改折扣券)
            useCoupon(cardId, type, cardCode, child) {
                if(!!child&&child.disabled) return
                let cards = [];
                if (type === 1) {
                    if (cardCode === "001") {
                        this.useStoredCard = true;
                    } else {
                        this.useStoredCard = false;
                    }
                    if (this.cashCouponId !== cardId) {
                        this.cashCouponId = cardId;
                        if (this.cashCouponId) {
                            cards.push(this.cashCouponId);
                        }
                        if (this.disCouponId) {
                            cards.push(this.disCouponId);
                        }
                        if (cards.length > 0) {
                            cards = cards.join(",");
                        } else {
                            cards = "";
                        }
                        this.getDiscount(cards);
                    }
                } else if (type === 0) {
                    console.log("kahao",cardId)
                    if (this.disCouponId !== cardId) {
                        this.disCouponId = cardId;
                        if (this.cashCouponId) {
                            cards.push(this.cashCouponId);
                        }
                        if (this.disCouponId) {
                            cards.push(this.disCouponId);
                        }
                        cards = cards.join(",");
                        if(cardId){
                            this.getUsableTickets(cardId).then(res=>{
                                let allCashList = [];
                                if(res.storeList && res.storeList.length){
                                    allCashList = allCashList.concat(res.storeList);
                                }
                                if(res.cashList && res.cashList.length){
                                    allCashList = allCashList.concat(res.cashList);
                                }
                                this.cashCouponList.forEach((item,index)=>{
                                    if(!item.cardId)return;
                                    if(allCashList && allCashList.length){
                                        for(let i=0;i<allCashList.length;i++){
                                            if(item.cardId == allCashList[i]){
                                                item.disabled = false;
                                                break;
                                            }
                                            // 可用券列表中找不到该券
                                            if(allCashList.length == i+1){
                                                console.log("item",item)
                                                item.disabled = true;
                                                // 已选券被禁用 清空该已选
                                                if(this.cashCouponId == item.cardId){
                                                    this.cashCouponId = '';
                                                }

                                            }
                                        }
                                    }else{
                                        item.disabled = true;
                                        this.cashCouponId = '';
                                    }

                                })
                            })
                    }else{
                        this.cashCouponList.forEach((item,index)=> {
                            item.disabled = false;
                        })
                    }
                        this.getDiscount(cards);
                    }
                }
            },

            //选中券 过滤出可用券
            getUsableTickets(cardIds) {
                let params = {
                    rtlOrdInterHdId: this.orderHdId,
                    vipCardHdId: this.cardId || null,//会员卡id
                    cardIds: cardIds + "" || ""
                };
                return Vouchers.getCanUseCouponsList(params);
            },
            //  发票页面跳转
            setInvoice() {
                if (this.invoiceStatus === false) {
                    return;
                } else {
                    this.setStore();
                    this.$router.push("/invoice-type?fromPage=settlement");
                }
            },

            toAddress() {
                this.setStore();
                this.$router.push("/address-list?fromPage=settlement");
            },

            // 设置用户操作表单缓存
            setStore() {
                Storage.set("store", {
                    pickupMsg: this.pickupMsg,
                    disCouponId: this.disCouponId,
                    disCouponPrice: this.disCouponPrice,
                    cashCouponId: this.cashCouponId,
                    disCouponList: this.disCouponList,
                    cashCouponList: this.cashCouponList,

                    cashCouponPrice: this.cashCouponPrice,
                    vipPrice: this.vipPrice,
                    showCashCoupon: this.showCashCoupon,
                    showDisCoupon: this.showDisCoupon,
                    memo: this.memo,
                    totalPrice: this.totalPrice,
                    assignGiftIndex: this.assignGiftIndex,
                    sendList: this.sendList,
                    cardList: this.cardList,
                    cardId: this.cardId,

                    userPointInfo: this.userPointInfo,
                    showPointFlag: this.showPointFlag,
                    disabledPoint: this.disabledPoint,
                    switchFlag: this.switchFlag,
                    pointInfo: this.pointInfo,

                    price: this.price,
                })
            },

            //  选择赠品
            chosePromotion(parent, child, index) {
                this.assignGiftIndex = index;// 给指定赠品索引复制
                parent.choseCode = child.classCode;
                parent.choseGoods = child;
                parent.showArr = false;
                this.sendList = JSON.parse(JSON.stringify(this.sendList));
                console.log(parent, "===", child.classCode)

            },
            // 获取会员卡列表
            getCartList() {
                let data = {
                    shopCode: Storage.get("USER_INFO").shopCode,
                }
                return UserService.memberCartList(data)
            }
        },
        async created() {

            this.orderHdId = this.$route.query.orderHdId;
            this.invoiceData = Storage.get("invoiceData") || {};
            let store = Storage.get('store')
            console.log('即将打印store=====》',store)
            if (!!store) {
                this.pickupMsg = store.pickupMsg
                this.disCouponId = store.disCouponId
                this.disCouponList = store.disCouponList
                this.disCouponPrice = store.disCouponPrice
                this.cashCouponId = store.cashCouponId
                this.cashCouponList = store.cashCouponList
                this.cashCouponPrice = store.cashCouponPrice
                this.vipPrice = store.vipPrice
                this.showCashCoupon = store.showCashCoupon
                this.showDisCoupon = store.showDisCoupon
                this.memo = store.memo
                this.totalPrice = store.totalPrice
                this.sendList = store.sendList
                this.assignGiftIndex = store.assignGiftIndex
                this.cardList = store.cardList
                this.cardId = store.cardId

                this.userPointInfo = store.userPointInfo
                this.showPointFlag = store.showPointFlag
                this.disabledPoint = store.disabledPoint
                this.switchFlag = store.switchFlag
                this.pointInfo = store.pointInfo
                this.price = store.price
            } else {
//                this.getOrderPromotion();
                // 获取会员卡列表
                this.cardList = await this.getCartList();

                if (this.cardList && this.cardList.length) {
                    // 默认使用第一张（后端以最高级到低级排序）
                    this.cardId = this.cardList[0].id;
                } else {
                    this.cardId = -1;
                }

                this.userPointInfo = await UserService.getMinIntegral({
                    shopId: Storage.get("USER_INFO").shopId,
                    busContsCode: baseConstant.busContsCode,
                });
                this.userPointInfo.minPoint = this.userPointInfo.minPoint?this.userPointInfo.minPoint:0;
                // 由于页面缓存问题导致不能用计算属性
                // "integralFlag":  启用积分抵现 1：启用， 0停用;  "effFlag": 状态 1：启用，0停用;  "moreThanMin": 是否超过最小可用积分； "prPointValue": 积分面值； "minPoint": 最小使用积分；
                if(this.userPointInfo.effFlag == 1 &&
                        this.userPointInfo.integralFlag == 1 &&
                        this.userPointInfo.moreThanMin &&
                        typeof this.userPointInfo.prPointValue === 'number'){

                    this.showPointFlag = 1;
                }else{
                    this.showPointFlag = 0;
                }
                this.switchFlag = this.showPointFlag == 1 ? true : false;
            }
            this.getShipType();
            this.getAddr();
            this.getInvoice();

            this.getPage();
        },
        watch:{
            visiblePoint(boolean){
                // 如果积分行由不显示变成显示 把开关打开
                if(boolean){
                    this.switchFlag = true;
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            if (from.path !== '/invoice-type' && from.path !== '/address-list') {
                Storage.remove('store')
                Storage.remove('invoiceData')
            }

            next()
        },
        beforeRouteLeave(to, from, next) {
            if (to.path === '/invoice-type') {    // 准备跳转至发票页

            } else {
            }
            next()
        }
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .settlement {
        padding-bottom: computed(108);
        background-color: #EDF0F7;
        .goods-send-container {
            padding: computed(30);
            background: #fff;
            .title {
                font-size: $font-title1;
                color: $text-block;
                text-align: center;
                margin-bottom: computed(40);
            }
            .goods-send-active {
                display: flex;
                justify-content: space-between;
                p {
                    color: #D80000;
                    font-size: computed(28);
                }
                a {
                    color: #333;
                    font-size: computed(28);
                }
            }
            .goodsList {
                display: flex;
                flex-direction: row;
                padding: computed(20) 0 computed(25) 0;
                border-bottom: 1px solid $border-gray-1px;
                .image {
                    width: computed(140);
                    height: computed(140);
                }
                .goodsList-middle {
                    position: relative;
                    margin-left: computed(19);
                    width: computed(450);
                    .name {
                        font-size: $font-regular;
                        color: $text-block;
                        text-align: left;
                        font-weight: 500;
                    }
                    .size-color {
                        position: absolute;
                        bottom: 0;
                        font-size: $font-regular;
                        color: $text-primary;
                        max-width: computed(350);
                    }
                }
                .goodsList-right {
                    flex: 1;
                    position: relative;
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    .price {
                        font-size: $font-regular;
                        color: $text-block;
                    }
                    .num {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        font-size: $font-common;
                        color: $text-block;
                    }
                }

                /* 赠品 */
                &.gift {
                    .send {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        .image-main {
                            position: relative;
                            display: inherit;
                            .image {
                                width: computed(120);
                                height: computed(120);
                            }
                            .title-image {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: computed(67);
                                height: computed(67);
                                background-image: url('../../assets/images/common/send-title.png');
                                background-repeat: no-repeat;
                                background-size: 100% 100%;

                                span {
                                    position: absolute;
                                    left: computed(-1.5);
                                    top: computed(4.5);
                                    font-size: computed(18);
                                    color: $color-white;
                                    transform: rotate(-45deg);
                                    display: inline-block;
                                }
                            }
                        }
                        .goodsList-middle {
                            .name {
                                line-height: 1;
                                > span {
                                    font-size: $font-common;
                                    color: #FF3636;
                                    margin-right: computed(8);
                                }
                            }
                        }
                        .goodsList-right {
                            .chose {
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                font-size: $font-common;
                                color: #666666;
                                border: 1px solid #CCCCCC;
                                padding: computed(9) computed(15);
                                border-radius: computed(25);
                            }
                        }
                    }
                }
            }
            .un-send {
                width: 100%;
                display: flex;
                flex-direction: row;
                .un-send-left {
                    flex: 1;
                    font-size: $font-regular;
                    color: $text-red;
                }
                .un-send-right {
                    width: computed(150);
                    font-size: $font-regular;
                    color: $text-primary;
                    text-align: right;
                }
            }
        }
    }

    .delivery-box {
        background: #fff;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        height: computed(90);
        padding: 0 computed(30);
        margin-bottom: computed(10);
        font-size: computed(32);
        line-height: computed(90);
        color: #0d0e09;
        align-items: center;
        justify-content: flex-start;
    }

    .van-checkbox__icon {
        display: block;
        box-sizing: border-box;
        width: computed(30);
        height: computed(30);
        position: relative;
        border: 1px solid #2ba4f3;
        font-size: computed(30);
        line-height: computed(30);
    }

    .van-checkbox {
        display: flex;
        height: computed(90);
        align-items: center;
        margin-left: computed(50);
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
        margin-left: computed(20);
        font-size: computed(32);
        line-height: computed(90);
        color: #0d0e09;
    }
    .disabledCash{
        opacity: 0.5;
    }
    .address-box {
        background: #fff;
        padding: computed(50) 0;
        border-bottom: solid computed(1) #e6e6e6;
    }

    .address-title {
        font-size: computed(36);
        line-height: computed(38);
        color: #0d0e09;
        text-align: center;
    }

    .address-content {
        box-sizing: border-box;
        padding: 0 computed(30);
        position: relative;
    }

    .default-cell {
        display: flex;
        width: computed(630);
        margin-top: computed(14);
        font-size: computed(28);
        line-height: computed(44);
        color: #0d0e09;
    }

    .default-cell label {
        width: 24%;
        text-align: right;
    }

    .default-cell p {
        width: 76%;
        word-wrap: break-word;
    }

    .select-address-btn {
        position: absolute;
        top: 50%;
        right: computed(30);
        width: computed(36);
        font-size: computed(38);
        line-height: computed(38);
        transform: translateY(-50%);
        color: #0d0e09;
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
        width: 100%;
        margin-left: computed(10);
        text-align: left;
    }

    .area {
        box-sizing: border-box;
        padding: 0 computed(10);
        white-space: normal;
        word-break: break-all;
        font-size: computed(30);
        line-height: computed(70);
        border: solid 1px #cccccc;
    }

    .cell-content input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: computed(70);
        padding: 0 computed(10);
        border: solid 1px #cccccc;
        font-size: computed(30);
        line-height: computed(70);
        position: relative;
        /* 解决ios版微信浏览器的边框和阴影*/
        border-radius: 0;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        -webkit-appearance: none;
    }

    .cell-content.warn-tip input {
        background: #f3adb8;
        border-color: #f3adb8;
    }

    .cell-content.warn-tip::before {
        content: "请输入正确的手机号";
        position: absolute;
        left: computed(160);
        top: computed(-20);
        color: #d80000;
        font-size: computed(16);
        line-height: computed(16);
    }

    .goods-list {
        border-bottom: solid computed(1) #e6e6e6;
    }

    .goods-item {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        padding: computed(30) computed(30);
        background: #ffffff;
        justify-content: center;
        position: relative;
    }

    .settlement-title {
        background: #fff;
        margin-top: computed(10);
        font-size: computed(30);
        line-height: computed(38);
        padding-top: computed(30);
        color: #333;
        text-align: center;
    }

    .goods-cover {
        width: computed(150);
        height: computed(150);
        overflow: hidden;
        position: relative;
    }

    .goods-cover img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .goods-info {
        flex: 1;
        margin-left: computed(30);
        position: relative;
    }

    .goods-name {
        max-width: computed(380);
        font-size: computed(32);
        line-height: computed(34);
        font-weight: 600;
        color: #0d0e09;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .goods-price {
        display: flex;
        justify-content: space-between;
        margin-top: computed(28);
    }

    .sale-price {
        font-size: computed(32);
        line-height: computed(34);
        font-weight: 600;
        color: #0d0e09;
    }

    .old-price {
        margin-top: computed(8);
        font-size: computed(28);
        line-height: computed(30);
        color: #cccccc;
        text-decoration: line-through;
        visibility: hidden;
    }

    .count-box {
        float: right;
        font-size: computed(24);
        line-height: computed(30);
        font-weight: 600;
        color: #0d0e09;
    }

    .goods-sku-box {
        /*margin-top: computed(45);*/
    }

    .goods-type {
        box-sizing: border-box;
        font-size: computed(32);
        line-height: computed(34);
        color: #0d0e09;
        padding: computed(20) computed(16);
        position: relative;
        background: #EDF0F7;
        margin-top: computed(20);
    }

    .other-title {
        box-sizing: border-box;
        width: calc(100% - #{computed(60)});
        font-size: computed(32);
        line-height: computed(34);
        color: #0D0E09;
        padding: computed(30) 0;
        margin-left: computed(30);
        position: relative;
        border-bottom: solid 1px #dbdbdb;
        background: #fff;
    }

    .goods-type.act,
    .other-title.act {
        border-bottom: none;
    }

    .goods-type .show-arrow,
    .other-title .show-arrow {
        display: block;
        float: right;
        height: computed(28);
        font-size: computed(28);
        line-height: computed(28);

        i {
            color: #999999;
        }

    }

    .goods-type.act .show-arrow,
    .other-title.act .show-arrow {
        transform: rotate(180deg);
    }

    .show-arrow.wait {
        transform: rotate(270deg);
    }

    .goods-sku-content {
        margin-top: computed(28);
    }

    .goods-sku-content h5 {
        font-size: computed(26);
        line-height: computed(30);
        margin-bottom: computed(16);
        color: #666666;
        font-weight: 600;
    }

    .item-list li {
        display: flex;
        margin-top: computed(5);
        justify-content: space-between;
        font-size: computed(20);
        line-height: computed(32);
        color: #333;

        img {
            display: inline-block;
            width: computed(40);
            height: computed(40);
            line-height: 0;
        }

    }

    .others-wrapper {
        /*padding: 0 computed(30);*/
        background: #fff;
    }

    .other-title::after {
        content: "";
        display: table;
        clear: both;
    }

    .other-title .other-title-value {
        float: left;
        margin-right: computed(10);
    }

    .goods-actions {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: computed(100);
        z-index: 9;
        position: fixed;
        left: 0;
        bottom: 0;

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

        .total-price {
            margin-left: computed(30);
            font-size: computed(32);
            line-height: computed(32);
            color: #0d0e09;
        }

    }

    .other-box {
        display: flex;
        box-sizing: border-box;
        font-size: computed(32);
        line-height: computed(34);
        color: #0d0e09;
        padding: computed(29) computed(34);
        position: relative;

        .order-memo {
            flex: 1;
            border: none;
            display: block;
            padding: 0 computed(10);
            height: computed(140);
        }

    }

    .coupon-list {
        background: #EDF0F7;
        li {
            display: flex;
            padding: computed(30) 0;
            margin: 0 computed(30);
            justify-content: space-between;
            align-items: center;
            font-size: computed(28);
            /*line-height: computed(30);*/
            color: #666;
            border-bottom: solid 1px #dbdbdb;
            &:last-child {
                border-bottom: none;
            }

            .coupon-name {
                max-width: computed(520);
                overflow: hidden;
                .coupon-type {
                    line-height: computed(30);
                    padding: 0 computed(12);
                    color: #fff;
                    font-size: computed(16);
                    background: $maincolor;
                    margin-left: computed(38);
                    border-radius: computed(5);
                }
            }

            .select-box {
                display: block;
                box-sizing: border-box;
                float: right;
                width: computed(30);
                height: computed(30);
                margin-left: computed(10);
                text-align: center;
                border: solid 1px #666;
                -webkit-border-radius: computed(5);
                -moz-border-radius: computed(5);
                background: #ffffff;
                border-radius: computed(5);
                overflow: hidden;

                i {
                    font-size: computed(28);
                    line-height: computed(28);
                    color: #ffffff;
                }

            }
        }
        li.act {

            .select-box {
                background: #2BA4F3;
                border-color: #2BA4F3;
            }

        }
    }

    .diy-icon {
        position: absolute;
        left: 0;
        top: 0;
        width: computed(150);
        height: computed(36);
        z-index: 3;
        background: url("../../assets/images/common/diy.png") no-repeat top left;
        -webkit-background-size: contain;
        background-size: contain;
    }

    .promotion-goods-list {
        border-bottom: solid 1px #dbdbdb;
    }

    .promotion-goods-list li {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        display: flex;
        padding: computed(20) 0 computed(20) computed(24);
        position: relative;

        .promotion-goods-cover {
            width: computed(120);
            height: computed(120);
            float: left;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
            }

        }
        .promotion-goods-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            margin-left: computed(20);
            font-size: computed(28);
            line-height: computed(30);

            .promotion-goods-name {
                color: #0d0e09;
            }

            .promotion-sku {
                margin-top: computed(10);
                color: #999999;
                max-width: computed(420);
                word-break: break-all;
            }

            .promotion-tip {
                color: #d80000;
                border: solid 1px #d80000;
                padding: computed(2) computed(6);
            }

            .promotion-size {
                margin-left: computed(10);
            }

            .van-clearfix {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .fr .show-arrow {
                display: inline-block;
                color: #999999;
            }

            .fr .show-arrow.act {
                transform: rotate(180deg);
            }

        }
    }
</style>
