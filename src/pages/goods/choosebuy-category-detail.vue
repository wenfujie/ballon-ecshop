/*
* createTime：2018/7/2
* author：junyong.hong
* description: 商品详情
*/
<template>
	<div class="category-detail" :class="[isTop ? 'margin-bottom':'']" ref="categoryDetail">
		<!-- 按钮组 -->
		<div class="btn-group">
			<div class="btn-bottom-right">
				<div class="design"
					 :class="[{'off-shelves-status': !!sellFlag }]"
					 @click="design(goodsInfo.bindPartGoodsCode)"
					 v-if="goodsInfo.bindPartGoodsCode && goodsInfo.bindPartGoodsCode !== null && !!sellFlag">
					<span>去定制</span>
				</div>
				<!--去搭配-->
				<div class="collocate" v-if="isShowCollocate" @click="toCollocate()"><span>去搭配</span></div>
				<!-- 帮助中心 -->
				<div class="help" @click="kfServer"><span class="iconfont icon-bangzhuzhongxin"></span></div>
			</div>
		</div>

		<div class="detail-slider">
			<!-- 轮播 -->
			<div class="detail-slider-content">
				<van-swipe :loop="false" @change="changeSwipper" ref="goodsSwipper">
					<van-swipe-item v-for="(image, index) in goodsSwipperList" :key="index" v-if="index < 6">
						<img v-lazy="getImg(image, '750*750')" :key="image" alt="商品图"/>
					</van-swipe-item>
					<van-swipe-item v-if="have25dImg">
						<!-- <img src="http://1.1.20.203/api/v2/oss/image/rl5Tx6D4SZkGck7EENE65NxPjA+8tpKbdKNNPkKh0maf3bQNTvM7KJKcKeOKGRJ/9AkqVhQwqrHrMnDVDFZX3g==" alt=""> -->
						<div class="imgBox" ref="imgBox" @touchstart.stop.prevent="imgTouchStart($event)" @touchmove.stop.prevent="imgTouchMove($event)">
							<div class="imgContent" ref="imgContent">
								<div class="Paint" ref="Paint">
									<img ref="canvasPaint" :src="getImg(selectedColor.fileUrl)" class="canvasPaint">
									<!-- <img ref="canvasPaint" :src="getImg(fileUrl)" class="canvasPaint"> -->
								</div>
							</div>
						</div>
					</van-swipe-item>
				</van-swipe>
				<div>
					<div class="indicatorCustom" v-if="have25dImg">
						<!-- <div class="indicatorItem"></div> -->
						<span :class="['left', {'active': !isWeb3D}]" @click="swipeTo(0)">图片</span>
						<span :class="['middle', {'active': isWeb3D}]" @click="swipeTo(goodsSwipperList.length>6?6:goodsSwipperList.length)">3D展示</span>
					</div>
					<div v-show="!isWeb3D" class="swipperNum">
						<span class="right"></span>
						<span class="num">{{currentImgIndex}}/{{goodsSwipperList.length>6?6:goodsSwipperList.length}}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 商品信息 -->
		<div class="goods-info-base">
			<div class="goods-info-header">
				<!--商品名-->
				<p class="goods-info-title">{{goodsInfo.goodsName}}</p>
				<!--收藏-->
				<span
					class="iconfont icon-zan like"
					:class="{'active icon-zan_' : goodsInfo.collectionFlag === 1}"
					@click="collection(goodsInfo)">
					收藏
				</span>
			</div>

			<p class="goods-info-money">
				<span>￥{{goodsInfo.salePrice | fixed2}}</span>
				<del v-if="!!goodsInfo.tagPrice && goodsInfo.tagPrice > 0">
					{{goodsInfo.tagPrice | fixed2}}
				</del>
			</p>
			<!--<p class="detail-info-return" ref="detailInfoReturn">七天无理由退货</p>-->
		</div>

		<!--领券、促销、sku选择-->
		<div class="goods-discount">
			<div class="goods-discount-item" v-if="coupons.length > 0">
				领券
				<div class="goods-discount-item-inner" @click="showVouchersPopup()">
					<div class="coupon-list">
						<div class="coupons-item" v-if="!!priceCoupon">
							{{ priceCoupon.initialValue }}元现金券
						</div>
						<div class="coupons-item" v-if="!!discountCoupon">
							{{ parseFloat((discountCoupon.discount * 10).toFixed(2)) | fixed2 }}折折扣券
						</div>
					</div>
					<i class="iconfont icon-youfan"></i>
				</div>
			</div>
			<div class="goods-discount-item" v-if="goodPreferentialList.length > 0">
				促销
				<div class="goods-discount-item-inner" @click="isShowPromoPopup = true">
					<div class="promo-list">
						<div class="promo-item"
							 v-for="(item, index) in goodPreferentialList"
							 v-if="index <= 1" :key="index">
							{{ item.onlineName }}
						</div>
					</div>
					<i class="iconfont icon-youfan"></i>
				</div>
			</div>
			<div class="goods-discount-item">
				规格
				<div class="goods-discount-item-inner" @click="showSkuDialog()">
					<div class="chose-sku" v-if="colorName && sizeName">{{colorName + '/' + sizeName}}</div>
					<div class="chose-sku" v-else>请选择商品规格</div>
					<div class="recommend" v-show="!!recommendValue">推荐 {{recommendValue}} 码</div>
					<i class="iconfont icon-youfan"></i>
				</div>
			</div>
		</div>

		<!--评价-->
		<div class="goods-evaluate">
			<div class="evaluate-title">
				评价
				<span @click="getEvaluateData()" v-if="comments.length > 0">
					查看全部
					<i class="iconfont icon-youfan"></i>
				</span>
			</div>
			<div class="evaluate-content" v-if="comments.length > 0">
				<div class="user-info">
					<img v-lazy="getImg(comments[0].headUrl, '64*64')">
					<span>{{comments[0].usrName}}</span>
					<van-rate v-model="comments[0].commentTypeScore" disabled-color="#2ba4f3" :disabled="true"/>
				</div>
				<p class="evaluate-comment">{{comments[0].commentMemo}}</p>
				<p class="evaluate-time">{{comments[0].commentTime}}</p>
			</div>
			<div class="evaluate-empty" v-else>
				暂无评价内容
			</div>
		</div>

		<!-- 商品目录 -->
		<div class="detail-content">
			<div class="detail-content-tab" v-if="goodsTitle.length > 0">
				<div class="tab-content" v-html="goodsTitle"></div>
			</div>
			<div class="detail-content-images" v-if="goodsTitle.length === 0 && goodsDetails.length > 0">
				<img v-for="(item,index) in goodsDetails" :src="getImg(item)" :key="index" lazy-load="true"  mode="widthFix">
			</div>
			<div class="detail-empty" v-if="goodsTitle.length === 0 && goodsDetails.length === 0">
				暂无商品详情
			</div>
		</div>

		<!--推荐商品-->
		<div class="rcmd-goods" v-if="rcmdGoods.length > 0">
			<p class="rcmd-title">
				推荐商品
				<i class="iconfont icon-youfan"></i>
			</p>
			<ul class="rcmd-list">
				<li v-for="item in rcmdGoods" @click="goDetail(item)">
					<img v-lazy="getImg(item.url)" :key="item.url">
					<div class="rcmd-info">
						<div class="goods-info">
							<p class="goods-name">{{ item.goodsName }}</p>
							<p class="price">
								￥{{item.salePrice}}
								<span class="tag-price" v-if="!!item.tagPrice && item.tagPrice > 0">￥{{item.tagPrice | fixed2}}</span>
							</p>
						</div>
						<div class="collection" :class="{'active': item.collectionFlag === 1}">
							<i class="iconfont icon-zan like"
							   :class="{'icon-zan_': item.collectionFlag === 1}"
							   @click.stop="collection(item)"></i>
							<p>{{item.collectionFlag === 1 ? '已收藏' : '收藏'}}</p>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<!--底部固定导航栏-->
		<div class="footer-bar">
			<div class="btn-icon">
				<div class="home" @click="backHome">
					<i class="iconfont icon-shouye"></i>
					首页
				</div>
				<div class="share" @click="share()">
					<i class="iconfont icon-fenxiang"></i>
					分享
				</div>
				<div class="cart" @click="goShoppingCart">
					<span class="cart-number" v-if="this.shoppingCartCount !== null && this.shoppingCartCount > 0">{{shoppingCartCount > 99 ? '99+' : shoppingCartCount}}</span>
					<i class="iconfont icon-gouwuche"></i>
					购物车
				</div>
			</div>
			<div class="btn-box">
				<div v-if="!!sellFlag" class="btn-cart" @click="cardOrBuy(1)" :class="[goodsQty === 0 ? 'disable' : '']">加入购物车</div>
				<div v-if="!!sellFlag" class="btn-buy" @click="cardOrBuy(2)" :class="[goodsQty === 0 ? 'disable' : '']">立即购买</div>
				<div v-if="!sellFlag" class="btn-off-shelves">{{sellFlag}}商品已下架</div>
				<div v-else-if="goodsStock <= 0" class="btn-off-shelves">商品已售罄</div>
			</div>
		</div>

		<!-- 分享弹窗 -->
		<van-popup v-model="isShowShare" position="top" :overlay="true" class="share-popup">
			<div class="share-img"></div>
		</van-popup>

		<!-- 评价弹窗 -->
		<van-popup v-model="isShowComment" position="right" :overlay="true" :lock-scroll="true" class="popup-comment">
			<van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false">
				<p class="iconfont icon-guanbi comment-close" @click="isShowComment = false"></p>
				<div class="popup-comment-body">
					<p class="comment-rate" v-if="comments.length === 0">暂无评论</p>
					<!--综合评分星级-->
					<div class="common-score">
						<!--综合评分-->
						<p>评价</p>
						<van-rate
							class="rate"
							v-model="commonScore"
							:size="15"
							color="#2ba4f3"
							disabled-color="#2ba4f3"
							:disabled="true">
						</van-rate>
					</div>
					<div class="comment-item" v-for="item in comments">
						<div class="comment-rate">
							<img :src="getImg(item.headUrl, '64*64')">
							<p>{{item.usrName}}</p>
							<van-rate class="rate" v-model="item.commentTypeScore" :size="15" color="#2ba4f3"
									  disabled-color="#2ba4f3" :disabled="true"/>
						</div>
						<p class="comment-item-content">{{item.commentMemo}}</p>
						<div class="comment-item-img">
							<img v-for="(data,index) in item.thumbsVos" v-lazy="getImg(data.url, '75*75')" :key="data.url"
								 @click="bigPic(item.thumbsVos,index)">
						</div>
						<van-row class="comment-item-tel">
							<van-col span="16" class="data">
								{{item.commentTime}}
							</van-col>
						</van-row>
						<p class="comment-item-reply" v-if="item.answerCommentmo"><span>商家回复：</span><span>{{ item.answerCommentmo }}</span></p>
						<p class="comment-time" v-if="item.answerCommentmo">
							{{ item.answerTime }}
						</p>

						<!--追评-->
						<div class="add-comment-item" v-for="addComment in item.addGoodsCommentVos">
							<p class="comment-item-content"><span>追评：</span>{{addComment.addCommentMemo}}</p>
							<div class="comment-item-img">
								<img v-for="(data,index) in addComment.thumbsVos" v-lazy="getImg(data.url)" :key="data.url"
									 @click="bigPic(addComment.thumbsVos,index)">
							</div>
							<p class="comment-time">
								{{ addComment.addCommentTime }}
							</p>
							<!--追评回复-->
							<p class="comment-item-reply" v-if="addComment.addAnswerContent">
								<span>商家回复：</span>
								{{addComment.addAnswerContent}}
							</p>
							<p class="comment-time" v-if="addComment.addAnswerContent">
								{{ addComment.addAnswerTime }}
							</p>
						</div>
					</div>
				</div>
			</van-list>
		</van-popup>

		<!-- 加入购物车、立即购买 -->
		<van-popup v-model="isShowSkuCard" position="bottom" :overlay="true" :lock-scroll="true" class="popup-add-card">
			<p class="iconfont icon-guanbi comment-close" @click="isShowSkuCard = false"></p>
			<div class="add-card-body">
				<!--商品信息-->
				<div class="add-card-header">
					<div class="goods-cover" @click="showBigColorImagesHeader = true">
						<img v-lazy="getImg(colorImagesHeader)" onerror="errImg(event)">
					</div>
					<div class="goods-info">
						<p class="goods-price">￥{{goodsInfo.salePrice | fixed2}}</p>
						<p class="goods-choice">已选择：{{ this.colorName + ' ' + this.sizeName }}</p>
					</div>
				</div>

				<!-- 颜色 -->
				<h2 class="add-card-title">颜色</h2>
				<ul class="add-card-slider-small">
					<li v-for="(item, index) in goodsColor" :key="index"
						:class="[{'none' : maxStock <=0 || !sellFlag || !item.canSelectFlag},{'active' : item.colorCode === colorCode}]"
						@click="changSlider(item, index)">
						{{ item.colorName }}
					</li>
				</ul>

				<!-- 尺码 -->
				<h2 class="add-card-title">尺码</h2>
				<div class="add-card-size">
					<ul>
						<li v-for="item in goodsSize"
							:class="[{'none': maxStock <=0 || !sellFlag || !item.canSelectFlag} , {'active': item.sizeCode===sizeCode}]"
							@click="choseSize(item)">{{item.sizeName}}
						</li>
					</ul>
				</div>

				<!--数量-->
				<h2 class="add-card-title">数量</h2>
				<div class="stepper">
					<van-stepper
						v-model="amount"
						@blur="handleBlur"
						min="1"
						:max="goodsStock"
						:disabled="sellFlag === 0"
						 v-inputfix>
					</van-stepper>
					<p class="goods-stock">库存：{{goodsStock}}</p>
				</div>
			</div>
			<div class="footer-bar">
				<div class="btn-icon">
					<div class="home" @click="backHome">
						<i class="iconfont icon-shouye"></i>
						首页
					</div>
					<div class="share" @click="share()">
						<i class="iconfont icon-fenxiang"></i>
						分享
					</div>
					<div class="cart" @click="goShoppingCart">
						<span class="cart-number" v-if="this.shoppingCartCount !== null && this.shoppingCartCount > 0">{{shoppingCartCount > 99 ? '99+' : shoppingCartCount}}</span>
						<i class="iconfont icon-gouwuche"></i>
						购物车
					</div>
				</div>
				<div class="btn-box">
					<div v-if="!!sellFlag" class="btn-cart" @click="cardOrBuy(1)" :class="[goodsQty === 0 ? 'disable' : '']">加入购物车</div>
					<div v-if="!!sellFlag" class="btn-buy" @click="cardOrBuy(2)" :class="[goodsQty === 0 ? 'disable' : '']">立即购买</div>
					<div v-if="!sellFlag" class="btn-off-shelves">{{sellFlag}}商品已下架</div>
					<div v-else-if="goodsStock <= 0" class="btn-off-shelves">商品已售罄</div>
				</div>
			</div>
		</van-popup>

		<!--sku弹窗大图-->
		<van-popup v-model="showBigColorImagesHeader" :overlay="true" :lock-scroll="true" :lazy-render="true" overlay-class="big-background">
			<div class="big-pic-box">
				<van-swipe :initial-swipe="commentImgIndex" :loop="false">
					<van-swipe-item>
						<img :src="getImg(colorImagesHeader)" class="skuBigPic" onerror="errImg(event)" @click="showBigColorImagesHeader = false"/>
					</van-swipe-item>
				</van-swipe>
			</div>
		</van-popup>

		<!--评论大图轮播-->
		<van-popup v-model="showBigPic" :overlay="true" :lock-scroll="true" :lazy-render="true" @click-overlay="resetPic" overlay-class="big-background">
			<div class="big-pic-box">
				<van-swipe :initial-swipe="commentImgIndex" :loop="false">
					<van-swipe-item v-for="(image, index) in bigPics" :key="index">
						<img :src="getImg(image)" class="bigPic" onerror="errImg(event)" @click="showBigPic = false"/>
					</van-swipe-item>
				</van-swipe>
			</div>
		</van-popup>

		<!--领券弹窗-->
		<van-popup v-model="isShowVouchersPopup" position="bottom" :overlay="true" :lock-scroll="true" class="popup-vouchers-card">
			<p class="iconfont icon-guanbi comment-close" @click="isShowVouchersPopup = false"></p>
			<div class="vouchers-card-body">
				<p class="vouchers-card-title">领券</p>
				<ul class="vouchers-card-list" v-if="cardList.length > 0">
					<li class="vouchers-item"
						:class="{'auto': item.isShowInstruct === true}"
						v-for="(item, index) in cardList"
						:key="index"
						v-show="item.couponCount !== 0">
						<div class="circle-left"></div>
						<div class="circle-right"></div>
						<div class="vouchers-main">
							<div class="vouchers-price" v-if="item.cardTypeCode === 'D_CASHVOLUME'">
								￥<span>{{ item.initialValue }}</span>
							</div>
							<div class="vouchers-price" v-if="item.cardTypeCode === 'D_DISCOUNTCOUPONS'">
								<span>{{ item.couponValue }}折</span>
							</div>
							<div class="vouchers-desc">
								<p class="type" v-if="item.cardTypeCode === 'D_CASHVOLUME'">现金券</p>
								<p class="type" v-if="item.cardTypeCode === 'D_DISCOUNTCOUPONS'">折扣券</p>
								<p class="time">
									{{ item.effStartDate | timeFilter }} 起
									<br>
									{{ item.effEndDate | timeFilter }} 止
								</p>
							</div>
							<div class="vouchers-buy">
								<p v-if="item.buyPrice">仅售￥{{ item.buyPrice }}元</p>
								<div class="vouchers-button" @click="getCard(item)">
									{{ item.buyPrice > 0 ? '立即购买' : '立即领取' }}
								</div>
							</div>
						</div>
						<div class="vouchers-footer">
							<div class="limit-desc" @click="item.isShowInstruct = !item.isShowInstruct">
								<p class="type">{{item.couponLimit}}</p>
								<i class="iconfont icon-xialaxuan"
								   :class="{'rotate': item.isShowInstruct === true}">
								</i>
							</div>
							<div class="instruct-text" v-if="item.isShowInstruct">
								{{item.instructions}}
							</div>
						</div>
					</li>
				</ul>
				<p class="empty" v-else>暂无优惠券~</p>
			</div>
		</van-popup>

		<!--促销弹窗-->
		<van-popup v-model="isShowPromoPopup" position="bottom" :overlay="true" :lock-scroll="true" class="popup-promo-card">
			<p class="iconfont icon-guanbi comment-close" @click="isShowPromoPopup = false"></p>
			<div class="promo-card-body">
				<p class="promo-card-title">促销</p>
				<ul class="promo-card-list" v-if="goodPreferentialList.length > 0">
					<li class="promo-item" v-for="item in goodPreferentialList">
						<div class="promo">{{ item.onlineName }}</div>
						<div class="time">
							{{item.startDate}} 起
							<br>
							{{item.endDate}} 止
						</div>
					</li>
				</ul>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import {
		Swipe,
		SwipeItem,
		Button,
		Popup,
		Row,
		Col,
		Rate,
		List,
		Toast,
		Cell,
		Stepper
	} from "vant";
	import Storage from "../../util/storage";
	import {
		Goods,
		ShoppingCart,
		Collection,
		UserService,
		Order,
		Base,
		Vouchers,
		Payment
	} from "../../api/service";
	import ysfService from "@/util/ysfService"
	import Web25d from "@/util/web2.5d"

	export default {
		components: {
			"van-swipe": Swipe,
			"van-swipe-item": SwipeItem,
			"van-button": Button,
			"van-popup": Popup,
			"van-row": Row,
			"van-col": Col,
			"van-rate": Rate,
			"van-list": List,
			"van-cell": Cell,
			"van-stepper": Stepper ,
		},
		data() {
			return {
				goodsCode: "",
				images: [],
				goodsSwipperList: [],  // 商品轮播大图
				tabContent: [],
				// 标题是否已经滚动到顶部
				isTop: false,
				// 分享弹窗
				isShowShare: false,
				// 评论弹窗
				isShowComment: false,
				// 加入购物车弹窗
				isShowSkuCard: false,
				// 关闭sku弹窗定时器
				closeSkuDialog: null,
				companyCode: '', //公司编码
				// 1代表加入购物车；2代表立即购买
				isCardOrBuy: "",
				// 轮播索引
				sliderIndex: 0,
				// 商品信息
				goodsInfo: [],
				//  商品尺寸
				goodsSize: [],
				//  商品颜色
				goodsColor: [],
				//  颜色选择
				colorCode: "",
				//  尺码选择
				sizeCode: "",
				// 商品数量
				amount: 1,
				//  评价列表
				comments: [],
				// 综合评分星级
				commonScore: 1,
				//  库存列表
				stockList: [],
				//  选中sku的值
				skuId: "",
				//  推荐商品
				rcmdGoods: [],
				//  推荐尺码
				rcmdSize: {},
				//  商品目录
				goodsTitle: [],
				goodsDetails: [],
				pageNum: 1,
				pageSize: 10,
				loading: false, // 控制loading显示
				finished: false, // 控制是否加载更多
				shoppingCartCount: null,
				userInfo: {},
				btnLock: false,  // 按钮锁
				showBigPic: false,  // 显示评论大图
				showBigColorImagesHeader: false, // 显示sku大图
				bigPics: [], // 评论大图数组
				colorImages: [],  // 商品详情弹窗轮播图
				colorImagesHeader: null,  // 商品详情弹窗默认图
				colorName: '',  // 商品详情弹窗选中颜色名
				sizeName: '',  // 商品详情弹窗选中尺码名
				commentImgIndex: 0,  // 商品评论默认显示第一张大图
				sellFlag: null,  // 上下架标识
				goodsQty: 0,  // 商品总库存
				goodsSkuListSellFlag: [],  // 商品sku组合对应的上下架标识
				promotion: {}, // 赠品信息
				coupons: [], // 优惠券列表
				isShowVouchersPopup: false, // 是否显示领券弹窗
				isShowPromoPopup: false, // 是否显示促销弹窗
				cardList: [], //  优惠券列表
				orderCode: '',
				goodPreferentialList: [], // 满减瞒折满赠
				isShowCollocate: false,
				maxStock: null,  // 最大库存
				currentImgIndex: 1,	// 当前轮播图默认
				isWeb3D: false,	// 当展示3D展示轮播时，不显示右下轮播角数量
				recommendValue: "", // 推荐尺码
				selectedColor: {
					colorCode: "",
					fileUrl: ""
				},
				web25d: {},	// web2.5d对象
				touchObj: {
					startX: 0,
					startY: 0,
					endX: 0,
					endY: 0
				},
				have25dImg: false,	//控制是否展示3d展示轮播页
				goods25dImgList: []	// 本商品所有颜色对应的2.5D数据
			};
		},
		created() {
			this.recommendValue = Storage.get('rmSize') || ""
			this.goodsCode = this.$route.query.goodsCode || "";
			this.goodsSwipperList = []
			this.isShelve()
			this.getGoodsInfo();
			this.getGoodsComments();
			this.getGoodsRcmd();
//            this.saveFootprint();
			this.getCartCount();
			this.getUserInfo();
			this.get25dImg();	//获取2.5D数据
		},
		mounted() {
			// this._btnScroll();
			window.scroll(0,0);
		},
		methods: {
			/**
			 * 按钮滚动到头部
			 * @private
			 */
			_btnScroll() {
				window.addEventListener("scroll", () => {
					let btnTop = this.$refs.detailInfoReturn.getBoundingClientRect().top;
					if (btnTop <= 0) {
						this.isTop = true;
					} else {
						this.isTop = false;
					}
				});
			},
			/**
			 * 点击标题展开详情
			 */
			showImg(item) {
				item.isShowImg = !item.isShowImg;
			},
			/**
			 * 分享遮罩
			 */
			share() {
				this.isShowShare = true;
			},
			imgTouchStart(event){
				event.preventDefault();
				var touch = event.touches[0];
        		this.touchObj.startX = touch.pageX;
			},
			imgTouchMove(event){
				// console.log(event)
				var touch = event.touches[0];
				event.preventDefault();
				this.touchObj.endX = touch.pageX;
				if ((this.touchObj.startX - this.touchObj.endX) < -10) {
					this.web25d.goNext();
					this.touchObj.startX = this.touchObj.endX;
				} else if ((this.touchObj.startX - this.touchObj.endX) > 10) {
					this.web25d.goPrev();
					this.touchObj.startX = this.touchObj.endX;
				}
			},
			// 2.5D图片加载完成后执行
			imgLoad(fileUrl){
				let img = new Image()
				img.src = getImg(fileUrl)
				img.onload = ()=>{
					let picSize = img.height
					let totalFabrics = Math.round(img.width/picSize)
					console.log(img.width, img.height)
					console.log("图片加载完啦")
					this.touchObj = {
						startX: 0,
						startY: 0,
						endX: 0,
						endY: 0
					}
					this.web25d = new Web25d(totalFabrics, 0, picSize, picSize, this.$refs)
					this.web25d.init()
				}
			},
			get25dImg(){
				Goods.get25dImg({goodsCode: this.goodsCode}).then(res=>{
					if(!res || res.length===0) {
						this.have25dImg = false
						return
					}
					this.have25dImg = true
					this.goods25dImgList = res
					this.$nextTick(()=>{
						this.selectedColor.colorCode = res[0].colorCode
						this.selectedColor.fileUrl = res[0].fileUrl
						this.imgLoad(res[0].fileUrl)
					})

				})
			},
			// 根据选中的颜色查找对应的2.5D图，并展示
			search25dImg(colorObj){
				if(colorObj.colorCode === this.selectedColor.colorCode) return
				this.goods25dImgList.forEach((item, index)=>{
					if(colorObj.colorCode === item.colorCode){
						this.selectedColor.colorCode = item.colorCode
						this.selectedColor.fileUrl = item.fileUrl
						this.imgLoad(item.fileUrl)
						return
					}
				})
			},
			/**
			 * 每一页轮播结束后触发
			 * @param index 当前页的索引
			 */
			changeSwipper(index) {
				if(index+1 > (this.goodsSwipperList.length>6?6:this.goodsSwipperList.length)) {
					this.isWeb3D = true
					return;
				}
				this.isWeb3D = false
				this.currentImgIndex = index+1
			},
			// 点击图片、3D展示时候出发轮播
			swipeTo(index){
				// console.log(this.$refs.goodsSwipper)
				this.$refs.goodsSwipper.swipeTo(index, {
					immediate: true
				})
			},
			/**
			 * 颜色选择
			 * 滑动轮播结束，返回索引值
			 * @param index 当前轮播的索引
			 */
			changSlider(item, index) {
				this.search25dImg(item)
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
					this.colorImagesHeader = this.goodsInfo.url;
				} else {
					if (this.maxStock <= 0 || this.sellFlag === 0 || item.stocks === 0 || item.effFlag === 0 || item.canSelectFlag == 0) {
						this.$toast('该类商品库存不足或已下架')
						return;
					}else {
						this.colorCode = item.colorCode
						this.colorImages = item.urls
						this.colorName = item.colorName;

						// 无颜色图显示主图，无主图取默认图
						if (!!this.goodsInfo.colorsVoList[index].dtColorUrls) {
							this.colorImagesHeader = this.goodsInfo.colorsVoList[index].dtColorUrls[0];
						} else {
							// 无颜色图取主图
							this.colorImagesHeader = this.goodsInfo.url;
						}
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
				if (this.amount > this.goodsStock) {
					if (this.goodsStock === 0) {
						this.amount = 1;
					} else {
						this.amount = this.goodsStock;
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
					if (this.maxStock <= 0 || this.sellFlag === 0 || item.stocks === 0 || item.effFlag === 0 || item.canSelectFlag === 0) {
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
									console.log(this.stockList[i].skuQty)
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
				if (this.amount > this.goodsStock) {
					if (this.goodsStock === 0) {
						this.amount = 1;
					} else {
						this.amount = this.goodsStock;
					}
				}
			},

			/**
			 * 加入购物车、立即购买
			 * @param flag 1代表加入购物车；2代表立即购买
			 */
			cardOrBuy(flag) {
				// 所有颜色尺码都没库存 【加入购物车】【立刻购买】按钮置灰
				if (this.goodsQty === 0) {
					return false;
				}
				if (!this.isShowSkuCard) {
					this.isShelve().then(res => {
						if (!res) {
							Toast('该商品已下架！')
						} else {
							this.isShowSkuCard = true;
							this.isCardOrBuy = flag;
						}
					})
				} else {
					this.isCardOrBuy = flag;
					// 执行加入购物车或者购买操作
					this.buyGoods();
				}
			},

			// 显示sku弹窗
			showSkuDialog() {
				// 清空定时器
				clearTimeout(this.closeSkuDialog);
				this.isShowSkuCard = true;
			},

			//  获取用户信息
			getUserInfo() {
				let data = {};
				UserService.getUserInfo(data).then((res) => {
					this.userInfo = res;
				});
			},

			// 商品是否下架
			isShelve() {
				let list = []
				let map = {}
				map.goodsCode = this.goodsCode || this.$route.query.goodsCode
				map.busContsCode = !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode
				map.companyId = Storage.get('COMPANYID').company_id
				list.push(map)
				let data = {
					spPartGoodsSearchDtoList: list
				}
				return Goods.getGoodsSellState(data).then((res) => {
					if (!!res[0].sellFlag && !!res[0].spPartGoodsSkuList) {
						this.sellFlag = res[0].sellFlag
						this.goodsSkuListSellFlag = res[0].spPartGoodsSkuList
						return true
					}
					if(this.sellFlag === 0) {
						return false
						this.$toast('商品已下架~')
					}
				})
			},

			//  查询商品详情
			async getGoodsInfo() {
				let data = {
					busContsCode: baseConstant.busContsCode,
					goodsCode: this.goodsCode,
					shopCode: Storage.get("properties").shopCode,
					userId: Storage.get("USER_INFO").usrId
				};
				await Goods.getGoodsInfo(data)
					.then((res) => {
						// 静默刷新
						this.goodsInfo = [];
						this.goodsColor = [];
						this.images = [];
						this.goodsInfo = res;
						this.goodsSwipperList = []
						this.goodsInfo.goodsCode = this.goodsCode;
						this.colorImagesHeader = this.goodsInfo.url;
						// 获取颜色列表
						let colorList = res.colorsVoList;
						colorList.forEach((item) => {
							item.act = false
							item.stocks = ""  // 库存
							item.effFlag = ''  // 上下架
							item.canSelectFlag = 1  // 是否可选

							// 同步PC取图逻辑
							if (!!item.dtColorUrls && item.dtColorUrls.length > 0) {
								item.urls.forEach((image) => {
									this.goodsSwipperList.push(image)
								})
							}

						});

						//  没有颜色图取主图，没有主图取默认图
						if (this.goodsSwipperList.length <= 0) {
							if(!!this.goodsInfo.url) {
								this.goodsSwipperList.push(this.goodsInfo.url)
							}else{
								this.goodsSwipperList.push('')
							}
						}

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
							item.act = false
							item.stocks = ""
							item.effFlag = ''  // 上下架
							item.canSelectFlag = 1  // 是否可选
						});
						this.goodsSize = sizeList;
						if (res.colorsVoList.length && res.colorsVoList.length > 0) {
							res.colorsVoList.forEach((item) => {
								if (item.urls) {
									this.images.push.apply(this.images, item.urls)
									if (item.urls !== null && item.urls.length > 0) {
										item.lumpThumb = item.urls[0]
									}
								}
							})
						} else {
							if (res.url) {
								this.images.push(res.url);
							} else {
								let defaultUrl = "require('../../assets/images/no-image.jpg')";
								this.images.push(defaultUrl);
							}
						}
						this.colorImages = this.images

						//  获取商品详情目录
						// if(!!this.goodsInfo.orderGoodsCode){
						// 	this.getGoodsInfoTitle();
						// }

						// 获取商品详情目录（新版，支持图片素材管理上传）
						if (res.descriptions) {
							let newStr = res.descriptions.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
								let index = src.indexOf('=') + 1
								let imgData = getImg(src.substring(index, img.length))
								return '<img src="' + imgData + '" style="width: 100%; display: block; margin: 0;">'
							})
							let newPre = newStr.replace(/\<pre\>/gi, function () {
								return '<pre style="word-wrap: break-word;white-space:pre-wrap;">'
							})
							let newP = newPre.replace(/\<p\>/gi, function () {
								return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
							})
							this.goodsTitle = newP;
						} else if (res.descFileUrl) {
							this.goodsDetails =res.descFileUrl;
						}
					})
                    .then(() => {
						this.getGoodsstocks();
						this.getGoodsPromotion();
						this.getGoodPreferential();
//                        this.getRcmdSize();
                     if(!!Storage.get('USER_INFO')) this.saveHistory()
                    })
			},

			//  获取商品优惠促销
			getGoodsPromotion() {
				let data = {
					ptiPartHdId: this.goodsId || this.goodsInfo.ptiPartHdId,
					busContsCode: !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode,
					shopId: Storage.get('properties').shopId,
				}
				Goods.getGoodsPromotion(data).then((res) => {
					this.coupons = res.couponsCards
					this.promotion = res.giftVos
					if (res.giftVos.length > 0) {
						this.promotionList = []
						res.giftVos.forEach((item) => {
							if (!!item.giftGoodsDtos.length && item.giftGoodsDtos.length > 0) {
								this.promotionList.push.apply(this.promotionList, item.giftGoodsDtos)
							}
						})
					}
				})
			},

			//  查询商品详情目录
			// getGoodsInfoTitle() {
			// 	let data = {
			// 		goodsId: this.goodsInfo.orderGoodsCode
			// 	};
			// 	Goods.getGoodsTitle(data).then((res) => {
			// 		if (this.goodsInfo.descriptions) {
			// 			res.forEach((item) => {
			// 				item.showContent = false;
			// 				if(!!item.descContent) {
			// 					let newStr = item.descContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
			// 						let index = src.indexOf('=') + 1
			// 						let imgData = getImg(src.substring(index, img.length))
			// 						return '<img src="' + imgData + '" style="width: 100%; display: block; margin: 0;">'
			// 					})
			// 					let newPre = newStr.replace(/\<pre\>/gi, function () {
			// 						return '<pre style="word-wrap: break-word;white-space:pre-wrap;">'
			// 					})
			// 					let newP = newPre.replace(/\<p\>/gi, function () {
			// 						return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
			// 					})
			// 					item.descContent = newP
			// 				}
			// 			});
			// 			this.goodsTitle = res;
			// 		} else if (this.goodsInfo.descFileUrl) {
			// 			this.goodsDetails = this.goodsInfo.descFileUrl;
			// 		}
			// 	});
			// },

			//  查询商品评价
			getGoodsComments() {
				this.comments = [];
				let commentData = {
					usrId: Storage.get("USER_INFO").usrId,
					goodsCode: this.goodsCode,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					busContsCode: baseConstant.busContsCode
				};
				Goods.getGoodsComments(commentData)
					.then(
						(res) => {
							if (res.list.length > 0) {
								res.list.forEach((item) => {
									this.comments.push(item)
								})
							}
							if (res.pages <= this.pageSize) {
								this.finished = true;
							}
						},
						(err) => {
						}
					)
					.then(() => {
						this.loading = false;
					});
			},

			// 查询商品综合评价分数
			getGoodsCommonScore() {
				let commentData = {
					goodsCode: this.goodsCode,
					busContsCode: baseConstant.busContsCode
				};
				Goods.getGoodsScore(commentData).then((res) => {
					this.commonScore = Math.round(res);
				})
			},

			// 获取商品评价数据和综合评分星级
			getEvaluateData() {
				this.isShowComment = true;
				this.getGoodsComments();
				this.getGoodsCommonScore();
			},

			//  获取商品评价
			loadMore() {
				if (this.finished === true) {
					Toast("没有更多了~");
					return;
				}
				this.pageNum += 1;
				this.getGoodsComments();
			},

			// 查询商品库存
			async getGoodsstocks() {
				let data = {
					busContsCode: baseConstant.busContsCode,
					goodsCode: this.goodsCode,
					shopCode: Storage.get("properties").shopCode
				};
				await Goods.getGoodsStock(data).then((res) => {
					this.goodsQty = res.goodsQty
					this.maxStock = res.goodsQty
					this.stockList = res.skuList;
					if (this.goodsSkuListSellFlag.length > 0 && !!res.skuList.length && res.skuList.length > 0) {
						this.stockList.forEach((item) => {
							this.goodsSkuListSellFlag.forEach((sellItem) => {
								if (item.skuId === sellItem.ptiPartDtSkuId) {
									item.effFlag = sellItem.effFlag
								}
							})
						})
					}
				});

				// 获取搭配记录信息
				this.getCollocate();
			},

			// 获取平台推荐商品列表
			getGoodsRcmd() {
				let data = {
					buscontsCode: baseConstant.busContsCode,
					partCode: this.goodsCode,
					userId: Storage.get("USER_INFO").usrId,
					shopId: Storage.get("properties").shopId
				};
				Goods.getGoodsRecommend(data).then(
					(res) => {
						this.rcmdGoods = {};
						res.forEach((item) => {
							item.rtlCollectionDtId = item.collectionDtId
						})
						this.rcmdGoods = res;
					}
				);
			},

			// 加入购物车/立即购买
			buyGoods() {
				if (this.btnLock === true) {
					return
				}
				this.btnLock = true
				if (this.colorCode === "") {
					Toast("请先选择商品颜色");
					this.btnLock = false;
					return;
				}
				if (this.sizeCode === "") {
					Toast("请先选择商品尺码");
					this.btnLock = false;
					return;
				}
				//  加入购物车
				if (this.isCardOrBuy === 1) {
					//  需求取消最大30件限制
//					if (this.shoppingCartCount >= 30) {
//						Toast('购物车商品数量已达上限，请先清理购物车～')
//						this.btnLock = false
//						return
//					}
					//  获取sku的code值
					for (let i = 0; i < this.stockList.length; i++) {
						if (
							this.stockList[i].sizeCode === this.sizeCode &&
							this.stockList[i].colorCode === this.colorCode
						) {
							this.skuId = this.stockList[i].skuId;
						}
					}

					let sellData = this.getSellParams()
					Goods.getGoodsSellState(sellData).then((res) => {

						if(!!res[0].skuSellFlag) {
							// 检验商品库存
							let data = {
								companyId: Storage.get("USER_INFO").companyId,
								busContsCode: baseConstant.busContsCode,
								goodsCode: this.goodsCode,
								shopCode: Storage.get("properties").shopCode,
								colorCode: this.colorCode,
								sizeCode: this.sizeCode,
								salePrice: this.goodsInfo.salePrice,
							};
							Goods.getGoodsStock(data).then((res) => {
								if (res.skuList[0].skuQty >= 1) {
									let cartData = {
										amount: this.amount,
										busContsCode: baseConstant.busContsCode,
										cookieId: Storage.get("USER_INFO").cookieId,
										//                            "ctmMeasureHdId": 量体数据ID,
										ctmUsrId: Storage.get("USER_INFO").ctmUsrId,
										//                            "delaySetDtId": 延期优惠ID,
										dptId: Storage.get("properties").shopId,
										//                            "fitFlag": "试衣标志",
										goodsCode: this.goodsCode,
										//                            "memo": "备注",
										partDtSkuId: this.skuId,
										newPartDtSkuId: this.skuId,
										//                            "saleMeasureHdId": 量体工单ID,
										flag: 0, // 从商品添加进购物车
										salePrice: this.goodsInfo.salePrice
									};
									ShoppingCart.saveCart(cartData).then(
										(res) => {
											Toast("加入购物车成功~")
											this.btnLock = false;
											this.getCartCount();
											//                            this.$router.push('/shopping-cart')
											let that = this;
											this.closeSkuDialog = setTimeout(function () {
												that.isShowSkuCard = false;
											}, 2000)
										},
										(err) => {
											this.btnLock = false;
										}
									);
								} else {
									Toast("商品库存不足~");
									this.btnLock = false;
								}
							}).then(() => {
								this.btnLock = false;
							});
						}else{
							Toast('该商品已下架~')
							this.btnLock = false
							setTimeout(() => {
								window.location.reload()
							},500)
						}

					},(err) => {
						Toast(err.errorMsg)
						this.btnLock = false
					})
				}

				//  立即购买
				if (this.isCardOrBuy === 2) {
					if (this.userInfo.mobilePhone === null || !this.userInfo.mobilePhone) {
						this.btnLock = false
						this.$router.push(`/phone-bind?toUrl=${this.$route.fullPath}`)
					}
					else {
						//  获取sku的code值
						for (let i = 0; i < this.stockList.length; i++) {
							if (
								this.stockList[i].sizeCode === this.sizeCode &&
								this.stockList[i].colorCode === this.colorCode
							) {
								this.skuId = this.stockList[i].skuId;
							}
						}

						// 判断上下架
						let sellData = this.getSellParams()
						Goods.getGoodsSellState(sellData).then((res) => {
							if(!!res[0].skuSellFlag) {
								// 检验商品库存
								let data = {
									busContsCode: baseConstant.busContsCode,
									goodsCode: this.goodsCode,
									shopCode: Storage.get("properties").shopCode,
									colorCode: this.colorCode,
									sizeCode: this.sizeCode
								};
								Goods.getGoodsStock(data).then((res) => {
									if (res.skuList[0].skuQty >= 1) {
										let picId = null;
										let colorId = null;
										this.goodsColor.forEach((item) => {
											if (item.colorCode === this.colorCode) {
												picId = item.fileId;
												colorId = item.colorId
											}
										})
										let orderData = {
											interfaceCode: "SP_SALE_SAVECARTTEMP",
											ctmUsrId: Storage.get("USER_INFO").usrId,
											cookieId: Storage.get("USER_INFO").cookieId,
											shopCode: Storage.get("properties").shopCode,
											usrKey: Storage.get("USER_INFO").usrId,
											sourceCode: "D_ORDWEIN",
											skuList: [
												{
													amount: this.amount,
													colorCode: this.colorCode,
													sizeCode: this.sizeCode,
													salePrice: this.goodsInfo.salePrice,
													tagPrice: this.goodsInfo.tagPrice,
													goodsCode: this.goodsCode,
													thumb: this.goodsInfo.url,
													pictFileId: picId,
													ptiPartDtSkuId: res.skuList[0].skuId,
													ptiPartHdId: this.goodsInfo.ptiPartHdId,
													colorId: colorId,
													sizeId: res.skuList[0].sizeId
												}
											],
											amountOrd: 1 * this.goodsInfo.salePrice
										};
										Order.saveCartTemp(orderData).then((res) => {
											Order.orderPreferCal({ordId: res}).then(() => {
												this.$router.push("/order-settlement?orderHdId=" + res);
											})
										});
									} else {
										this.btnLock = false
										Toast("商品库存不足~");
									}
								}).then(() => {
									this.btnLock = false;
								});
							}else{
								Toast('该商品已下架~')
								this.btnLock = false
								setTimeout(() => {
									window.location.reload()
								},500)
							}
						}, (err) => {
							Toast(err.errMsg)
							this.btnLock = false
						})
					}
				}
			},

			//  获取商品上下架的参数
			getSellParams() {
				let list = []
				let map = {}
				map.goodsCode = this.goodsCode
				map.goodsName = this.goodsInfo.goodsName
				map.busContsCode = !!baseConstant.busContsCode ? baseConstant.busContsCode : Storage.get('properties').busContsCode
				map.companyId = Storage.get('COMPANYID').company_id
				if(!!this.goodsSkuId) map.ptiPartDtskuId = this.goodsSkuId
				list.push(map)
				return {
					spPartGoodsSearchDtoList: list
				}
			},

			//  推荐商品跳转详情
			goDetail(item) {
				window.scroll(0,0);
				if (item.orderFlag === 0) {
					this.$router.push("/goods-detail?goodsCode=" + item.goodsCode)
				} else {
					this.$router.push('/goods/web-design?goodsCode=' + item.goodsCode)
				}
			},

			//  收藏与取消收藏
			/* collectionFlag为1表示已收藏 */
			collection(goods) {
				if (goods.collectionFlag === 1) {
					//  取消收藏
					let data = {
						goodCodeStr: goods.goodsCode,
						ids: goods.rtlCollectionDtId
					};
					Collection.deleteCollection(data).then((res) => {
						this.$nextTick(() => {
							Toast("取消收藏成功");
							this.getGoodsInfo();
							this.getGoodsRcmd();
						});
					});
				} else {
					//  收藏
					let data = {
						busContsCode: baseConstant.busContsCode,
						goodsCode: goods.goodsCode,
						shopId: Storage.get("properties").shopId,
						salePrice: this.goodsInfo.salePrice,
                        tagPrice: this.goodsInfo.tagPrice,
                        goodName:this.goodsInfo.goodsName

					};
					Collection.addCollection(data).then((res) => {
						if (res === 1) {
							this.$nextTick(() => {
								Toast("收藏成功");
								this.getGoodsInfo();
								this.getGoodsRcmd();
							});
						}
					});
				}
			},

              // 保存浏览记录
            saveHistory() {
                let data = {
                    usrId: Storage.get("USER_INFO").usrId,
                    busContsCode: baseConstant.busContsCode,
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    dptId: Storage.get("properties").shopId,
                    salePrice: this.goodsInfo.salePrice,
                    tagPrice: this.goodsInfo.tagPrice,
                    ptiPartHdId: this.goodsInfo.ptiPartHdId,
                }
                UserService.saveFootprint(data).then(
                    res => {
						// console.log(111111)
                    },
                    err => {
                    }
                );
            },

			//  获取会员推荐尺码
			getRcmdSize() {
				if (!this.goodsInfo.stereoType) return
				let data = {
					stereoTypeCode: this.goodsInfo.stereoType
				};
				UserService.memberRcmdSize(data).then((res) => {
					this.rcmdSize = res;
				});
			},

			// 跳转定制页面
			design(code) {
				if(!this.sellFlag) return
				this.$router.push("/goods/web-design?goodsCode=" + code);
			},

			//  跳转购物车
			goShoppingCart() {
				this.$router.push("/shopping-cart");
			},

			//  返回首页
			backHome() {
				this.$router.replace("/index");
			},

			//  获取购物车数量（多平台整合不传店铺Id）
			getCartCount() {
				let data = {
//					shopId: Storage.get('properties').shopId
				};
				ShoppingCart.getCartCount(data).then((res) => {
					this.shoppingCartCount = res;
				});
			},

			//  放大图片
			bigPic(data,index) {
				let arr = []
				data.forEach((item) => {
					if (item.url) {
						arr.push(item.url)
					}
				})
				this.commentImgIndex = index
				this.bigPics = arr
				this.showBigPic = true
			},

			//  重置评论大图
			resetPic(){
				this.commentImgIndex = 0
				this.bigPics = []
			},

			//  客服
			kfServer() {
				let uid = Storage.get("USER_INFO").usrId;
				let name = this.userInfo.usrName;
				let email = this.userInfo.email;
				let mobile = this.userInfo.mobilePhone;
				/* let goodsName = this.goodsInfo.goodsName;
				let goodsCode = this.goodsCode;
				let pictPath = this.goodsInfo.url;
				let salePrice = this.goodsInfo.salePrice;
				let url = ""; */
				ysfService.wakeUp(
					uid,
					name,
					email,
					mobile
				);
			},

			// 获取搭配记录信息
			async getCollocate() {
				// 获取公司编码
				await Base.getCompanyById().then((res) => {
					this.companyCode = res.companyCode;
				});

				if (this.goodsQty > 0 && this.sellFlag === 1) {
					// 搭配记录获取
					let params = {
						partCode: this.goodsCode,
						dptId: Storage.get('properties').shopId,
					};
					// 获取是否有搭配记录
					Goods.getCollocate(params).then((res) => {
						if (!!res) {
							this.isShowCollocate = true;
						} else {
							this.isShowCollocate = false;
						}
					});
				}
			},

			// 去搭配
			toCollocate() {
				this.$router.push({
					path: '/collocate-design',
					query: {
						goodsName: this.goodsInfo.goodsName,
						companyCode: this.companyCode,
						usrId: Storage.get('USER_INFO').usrId,
						vipInfoHdId: Storage.get('USER_INFO').vipInfoId,
						shopCode: Storage.get('properties').shopCode,
						partCode: this.goodsCode,
						busContsCode: baseConstant.busContsCode,
						showFlag: 1,
					}
				});
			},

			// 显示领券弹窗
			showVouchersPopup() {
				this.isShowVouchersPopup = true;

				this.getCardList();
			},

			// 获取优惠券列表
			async getCardList() {
				// 根据商品筛选优惠券
				let params = {
					busContsCode: baseConstant.busContsCode,
					shopId: Storage.get("properties").shopId,
					ptiPartHdId: this.goodsInfo.ptiPartHdId
				};

				await Goods.getGoodsPromotion(params).then((res) => {
					let cardList = [];
					if (!!res.couponsCards) {
						cardList = res.couponsCards;
						cardList.forEach(item => {
							if (item.cardTypeCode == "D_DISCOUNTCOUPONS") {
								// 折扣券
								item.couponValue = parseInt(item.discount * 100) / 10;
							} else {
								// D_CASHVOLUME现金券
								item.couponValue = item.initialValue;
							}
							item.isShowInstruct = false;
						});
					}
					this.cardList = cardList;
				});
			},

			// 领取、购买优惠券
			getCard(item) {
				if (new Date(item.effEndDate.replace(/-/g, "/")).getTime() <= new Date().getTime()) {
					Toast('来迟一步，已经被购买完啦~~');
					return false;
				}
				if (this.btnLock === true) {
					return;
				}
				this.btnLock = true;
				let that = this;
				if (item.buyPrice === 0 || !item.buyPrice) {
					//  领取
					let data = {};
					if (item.couponId === null) {
						// 储值卡
						data = {
							usrId: Storage.get("USER_INFO").usrId,
							companyId: Storage.get("USER_INFO").companyId,
							busContsCode: baseConstant.busContsCode,
							cardId: item.valueCardHdId,
							vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
							shopId: Storage.get("properties").shopId
						};
					} else {
						data = {
							usrId: Storage.get("USER_INFO").usrId,
							companyId: Storage.get("USER_INFO").companyId,
							busContsCode: baseConstant.busContsCode,
							couponsId: item.couponId,
							vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
							shopId: Storage.get("properties").shopId
						};
					}
					Vouchers.saveCoupons(data).then(res => {
						if (res.length === 0) {
							Toast("来迟一步，已经被领完啦~");
							return;
						}
						if (res[0].state === "0") {
							this.getCardList();
							this.getGoodsPromotion();
							Toast("领取成功~");
						} else if (res[0].state === "1") {
							Toast("您已经领取过该优惠券啦~");
						} else if (res[0].state === "2") {
							Toast("该优惠券已经被其他会员绑定~");
						} else {
							Toast("领取失败~");
						}
					}).then(() => {
						this.btnLock = false;
					});
				} else if (item.buyPrice > 0) {
					//  购买
					let data = {};
					if (item.couponId === null) {
						//  储值卡
						data = {
							usrId: Storage.get("USER_INFO").usrId,
							companyId: Storage.get("USER_INFO").companyId,
							shopCode: Storage.get("properties").shopCode,
							valuecardHdId: item.valueCardHdId,
							busContsCode: baseConstant.busContsCode
						};
					} else {
						//  非储值卡
						data = {
							usrId: Storage.get("USER_INFO").usrId,
							companyId: Storage.get("USER_INFO").companyId,
							shopCode: Storage.get("properties").shopCode,
							couponsId: item.couponId,
							busContsCode: baseConstant.busContsCode
						};
					}
					Vouchers.buyCoupons(data).then(res => {
						if (res.msg === "无券可领") {
							Toast("来迟一步，已经被购买完啦~~");
							return;
						}
						this.orderCode = res.billCode; //  获取订单号，调用微信支付
						let orderData = {
							usrId: Storage.get("USER_INFO").usrId,
							paymentCode: "D_WEIXIN",
							tradeTypeCode: "JSAPI",
							paymentTypeCode: "D_FULL",
							shopCode: Storage.get("properties").shopCode,
							orderList: res.billCode,
							openId: Storage.get("WECHAT_INFO").openid,
							orderType: "D_COUPONSORD",
							payAmount: item.buyPrice
						};
						Payment.payOrder(orderData).then(config => {
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
									let num1 = config.requestStr.indexOf(
											"<appid>"
									);
									let num2 = config.requestStr.indexOf(
											"</appid>"
									);
									if (
											config.requestStr.substring(
													num1 + 7,
													num2
											)
									) {
										appid = config.requestStr
												.substring(num1 + 7, num2)
												.toString();
									} else {
										appid = "wx45b40e5b82bd74d2";
									}
									WeixinJSBridge.invoke(
											"getBrandWCPayRequest",
											{
												appId: appid, //公众号名称，由商户传入
												timeStamp: config.timeStamp, //时间戳，自1970年以来的秒数
												nonceStr: config.nonceStr, //随机串
												package: config.prepayId,
												signType: "MD5", //微信签名方式：
												paySign: config.paySign //微信签名
											},
											function(resp) {
												if (
														resp.err_msg ==
														"get_brand_wcpay_request:ok"
												) {
													// 使用以上方式判断前端返回,微信团队郑重提示：
													//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
													// window.setTimeout(function() {
													// 	that.$router.replace({
													// 		name: "goods-detail?goodsCode=" + that.goodsCode
													// 	});
													// }, 1000);
													Toast("购买成功~");
													that.getCardList()
												} else if (
														resp.err_msg ==
														"get_brand_wcpay_request:cancel"
												) {
													that.btnLock = false;
												} else {
													that.btnLock = false;
													alert("支付出错了");
												}
											}
									);
								}
							}
						}).then(() => {
							this.btnLock = false;
						});
					}).then(() => {
						this.btnLock = false;
					});
				}
			},
			// 获取商品对应的满减满折惠赠信息
			getGoodPreferential() {
				let data = {
					partId: this.goodsId || this.goodsInfo.ptiPartHdId || this.goodsInfo.orderGoodsCode,
					dptId: Storage.get('properties').shopId,
				}
				Goods.getGoodPreferential(data).then((res) => {
					this.goodPreferentialList = res
				})
			},
			// 数字校验
			handleBlur() {
				this.amount = parseInt(this.amount)
			}
		},
		watch: {
			'$route'(to, from) {
				if (to.path.indexOf('goods-detail') !== -1) {
					this.goodsCode = this.$route.query.goodsCode || "";
					this.getGoodsInfo();
					this.getGoodsComments();
					this.getGoodsstocks();
					this.getGoodsRcmd();
//                    this.saveFootprint();
					this.getCartCount();
					this.getUserInfo();
				}
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
				})
				return goodsSkuId
			},

			//  库存校验
			goodsStock: function () {
				let stock = 0
				if (!!this.sizeCode && !!this.colorCode) {
					for (let i = 0; i < this.stockList.length; i++) {
						if (this.stockList[i].skuId === this.goodsSkuId) {
							stock = this.stockList[i].skuQty
							return stock
						}
					}
				} else if (!!this.sizeCode && !this.colorCode) {
					for (let i = 0; i < this.stockList.length; i++) {
						if (this.stockList[i].sizeCode === this.sizeCode) {
							stock += this.stockList[i].skuQty
						}
					}
				} else if (!this.sizeCode && !!this.colorCode) {
					for (let i = 0; i < this.stockList.length; i++) {
						if (this.stockList[i].colorCode === this.colorCode) {
							stock += this.stockList[i].skuQty
						}
					}
				} else if (!this.sizeCode && !this.colorCode) {
					stock = this.goodsQty
				}
				return stock
			},

			//  抵用券
			priceCoupon: function () {
				let coupon = ''
				if (this.coupons.length <= 0) {
					return coupon
				} else {
					for (let i = 0; i < this.coupons.length; i++) {
						let item = this.coupons[i]
						if (!item.discount && !!item.initialValue) {
							return item
						}
					}
					return coupon
				}
			},

			//  折扣券
			discountCoupon: function () {
				let coupon = ''
				if (this.coupons.length <= 0) {
					return coupon
				} else {
					for (let i = 0; i < this.coupons.length; i++) {
						let item = this.coupons[i]
						if (!!item.discount) {
							return item
						}
					}
					return coupon
				}
				return stock
			},
		},
		filters: {
			timeFilter(str) {
				return str.substring(0, str.length - 2);
			}
		}
	};
</script>
<style lang="scss" type="text/scss" scoped>
	.category-detail {
		padding-bottom: computed(120);
		&.margin-bottom {
			margin-bottom: computed(80);
		}
		/* 悬浮在窗口最前端 */
		.btn-group {
			> div {
				position: fixed;
				z-index: 999;
				> div {
					width: computed(76);
					height: computed(76);
					border-radius: 50%;
					color: white;
					display: flex;
					justify-content: center;
					align-items: center;
					span:last-child {
						font-size: computed(38);
					}
				}
			}
			.btn-top-left {
				top: computed(16);
				left: computed(20);
				display: flex;
				flex-direction: column;
				.comment {
					background-color: $blackcolor-1;
				}
				.cart {
					background-color: $maincolor;
					margin-top: computed(20);
					position: relative;
					.cart-number {
						position: absolute;
						top: computed(8);
						right: computed(8);
						font-size: computed(16);
						background-color: #d80000;
						color: white;
						border-radius: 50%;
						min-width: computed(26);
						min-height: computed(26);
						line-height: computed(26);
					}
				}
			}
			.btn-top-right {
				top: computed(16);
				right: computed(30);
				.home {
					background-color: $maincolor;
				}
			}
			.btn-bottom-right {
				right: computed(30);
				bottom: computed(250);
				.design {
					margin-bottom: computed(12);
					background: $maincolor;
					span {
						font-size: computed(20);
					}
				}
				.collocate {
					margin-bottom: computed(12);
					background: $maincolor;
					span {
						font-size: computed(22)
					}
				}
				.help {
					// display: none;
					background-color: $blackcolor-1;
					opacity: .7;
				}
			}
		}
		@media screen  and (max-width: 320px) {
			.btn-group {
				> div {
					> div {
						width: computed(90);
						height: computed(90);
					}
				}
			}
		}
		/* 轮播 */
		.detail-slider {
			position: relative;
			width: 100%;
			height: computed(748);
			.detail-slider-content {
				.indicatorCustom{
					width: computed(250);
					// height: computed(30);
					position: absolute;
					left: 0;
					right: 0;
					bottom: computed(20);
					z-index: 100;
					font-size: computed(24);
					margin: 0 auto;
					span{
						display: inline-block;
						width: computed(100);
						height: computed(42);
						text-align: center;
						line-height: computed(42);
						color: $maincolor;
						background-color: $color-white;
						border: 1px solid $maincolor;
						&.left{
							margin-right: computed(12);
						}
						&.active{
							color: $color-white;
							background-color: $maincolor;
						}
					}
					// .indicatorItem{
					// 	display: inline-block;
					// 	font-size: computed(12);
					// 	width: computed(60);
					// 	span{

					// 	}
					// }
				}
				.swipperNum{
					position: absolute;
					right: computed(30);
					bottom: computed(20);
					z-index: 100;
					font-size: computed(24);
					width: computed(64);
					height: computed(36);
					color: $color-white;
					.right{
						display: block;
						width: computed(64);
						height: computed(36);
						background-color: $blackcolor;
						opacity: 0.4;
					}
					.num{
						width: computed(29);
						height: computed(23);
						position: absolute;
						top: computed(2);
						left: computed(13);
					}
				}
				.imgBox{
					position: absolute;
					left: 0;
					right: 0;
					margin: 0 auto;
					// width: 55%;
					height: computed(748);
					overflow: hidden;
					.imgContent{
						.Paint{
							position: absolute;
							z-index: 1;
						}
					}
					img{
						width: auto;
					}
				}
				img {
					pointer-events: none;
					width: 100%;
					max-height: computed(748);
				}
			}
			.detail-slider-btn {
				position: absolute;
				bottom: computed(45);
				left: computed(20);
				right: computed(30);
				> span {
					font-size: computed(38);
					&.active {
						color: $maincolor;
					}
				}
				.share {
					float: left;
					color: $maincolor;
				}
				.like {
					float: right;
				}
			}
		}
		/* 商品基本信息 */
		.goods-info-base {
			background: #fff;
			position: relative;
			padding: computed(0) computed(30);
			border-bottom: computed(10) solid #EEF1F7;
			.goods-info-header {
				display: flex;
				height: computed(106);
				align-items: center;
				justify-content: space-between;
				border-bottom: computed(5) solid #F0F0F0;
				.goods-info-title {
					color: #333333;
					font-size: computed(42);
					font-weight: 600;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.like {
					min-width: computed(80);
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: computed(18);
					&::before {
						font-size: computed(30);
					}
				}
			}
			.goods-info-money {
				display: flex;
				align-items: center;
				height: computed(96);
				span {
					font-size: computed(42);
					color: $maincolor;
					font-weight: 600;
				}
				del {
					color: #B3B3B3;
					font-size: computed(28);
					margin-left: computed(10);
				}
			}
			> p {
				/*text-align: center;*/
			}
			.detail-info-return {
				font-size: computed(22);
				color: $maincolor;
				margin: computed(40) 0 computed(20) 0;
			}
			.detail-info-cust {
				position: absolute;
				top: computed(50);
				left: computed(20);
				font-size: computed(24);
				color: $maincolor;
				border: 1px solid $maincolor;
				border-radius: computed(35);
				padding: computed(10);
				&.off-shelves-status{
					background: #CCCCCC;
					border-color: #CCCCCC;
				}
			}
			.detail-info-btn {
				display: flex;
				justify-content: center;
				text-align: center;
				margin-bottom: computed(60);
				font-size: computed(30);
				> div {
					width: computed(237);
					height: computed(80);
					line-height: computed(80);
					color: white;
					background-color: $maincolor;
					border: 1px solid $maincolor;
					border-radius: 0;
					&:nth-child(odd) {
						margin-right: computed(5);
					}
					&.btn-off-shelves{
						background: #CCCCCC;
						border-color: #CCCCCC;
					}
				}
				&.btn-bottom {
					position: fixed;
					bottom: 0;
					left: 0;
					width: 100%;
					background-color: white;
					margin-bottom: 0;
					z-index: 9;
					> div {
						width: 49.5%;
					}
				}
			}
		}
		.goods-discount {
			background: #fff;
			position: relative;
			padding: computed(0) 0 0 computed(30);
			border-bottom: computed(10) solid #EEF1F7;
			.goods-discount-item {
				height: computed(90);
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #666666;
				font-size: computed(28);
				font-weight: 600;
				&:last-child {
					.goods-discount-item-inner {
						border-bottom: none;
					}
				}
				.goods-discount-item-inner {
					width: 88%;
					height: 100%;
					border-bottom: computed(1) solid #CCCCCC;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-right: computed(30);
					.recommend{
						color: $text-secondary;
						font-size: $font-regular;
					}
					.coupon-list {
						width: 90%;
						display: flex;
						flex-direction: row;
						align-items: center;
						.coupons-item {
							display: flex;
							align-items: center;
							justify-content: center;
							padding: computed(4) computed(10);
							margin-right: computed(10);
							color: #fff;
							font-size: computed(24);
							background-size: 100% 100%;
							background-image: url('../../assets/images/goods/vouchers-bg.png');
						}
					}
					.promo-list {
						display: flex;
						.promo-item {
							margin-right: computed(10);
							line-height: computed(36);
							padding: computed(10) computed(10);
							border: computed(1) solid #2BA4F3;
							color: #2BA4F3;
							max-width: computed(200);
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
					.chose-sku {
						color: #333;
						font-size: computed(28);
					}
				}
			}
		}
		.goods-evaluate {
			padding: 0 computed(30) computed(30) computed(30);
			background: #fff;
			border-bottom: computed(10) solid #EEF1F7;
			.evaluate-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: computed(1) solid #CCCCCC;
				font-size: computed(28);
				color: #666;
				font-weight: 600;
				height: computed(86);
				span {
					font-size: computed(24);
					color: #333;
				}
			}
			.evaluate-content {
				.user-info {
					display: flex;
					flex-direction: row;
					align-items: center;
					height: computed(104);
					font-size: computed(28);
					color: #666;
					img {
						width: computed(64);
						height: computed(64);
						border-radius: 50%;
					}
					span {
						margin-left: computed(20);
					}
					div {
						margin-left: computed(20);
						display: flex;
						align-items: center;
					}
				}
				.evaluate-comment {
					color: #333;
					font-size: computed(24);
					margin-bottom: computed(20);
					word-break: break-all;
				}
				.evaluate-time {
					color: #999;
					font-size: computed(20);
				}
			}
			.evaluate-empty {
				color: #333333;
				font-size: computed(24);
				line-height: computed(80);
			}
		}
		/* 商品图文信息 */
		.detail-content {
			.detail-content-p {
				> img {
					display: block;
					width: 100%;
					margin-bottom: computed(5);
					&:last-child {
						margin-bottom: 0;
					}
				}
			}
			.detail-content-tab {
				overflow: hidden;
				padding: 0 computed(30);
				border-bottom: computed(10) solid #EDF0F7;
				padding-bottom: computed(14);
				.tab-title {
					text-align: center;
					font-size: computed(28);
					line-height: computed(78);
					border-bottom: computed(1) solid #CCCCCC;
				}
				.tab-content {
					img {
						display: block;
						width: 100%;
						margin: 0 auto;
					}
					&.none {
						display: none;
					}
					&.show {
						display: block;
					}
				}
			}
			.detail-content-images {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				img {
					max-width: 100%;
				}
			}
			.detail-empty {
				padding: 0 computed(30) computed(30) computed(30);
				color: #333333;
				font-size: computed(24);
				line-height: computed(80);
			}
		}
		/*底部固定导航栏*/
		.footer-bar {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: computed(100);
			background: #fff;
			display: flex;
			justify-content: space-between;
			border-top: computed(1) solid #CCCCCC;
			&.z-top {
				z-index: 20000;
			}
			.btn-icon {
				display: flex;
				justify-content: space-between;
				div {
					color: #333333;
					position: relative;
					width: computed(90);
					font-size: computed(16);
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					i {
						font-size: computed(50);
					}
					.icon-shouye {
						margin-left: computed(-10);
					}
					.cart-number {
						position: absolute;
						padding: computed(2);
						top: computed(4);
						right: computed(12);
						font-size: computed(16);
						background-color: #d80000;
						color: white;
						text-align: center;
						border-radius: 50%;
						min-width: computed(26);
						min-height: computed(26);
						line-height: computed(26);
					}
				}
			}
			.btn-box {
				display: flex;
				border-left: computed(1) solid #CCCCCC;
				.btn-cart {
					width: computed(240);
					line-height: computed(100);
					text-align: center;
					font-size: computed(28);
					&.disable {
						border-right: computed(1) solid #fff;
					}
				}
				.btn-buy {
					width: computed(240);
					background: #2BA4F3;
					color: #fff;
					line-height: computed(100);
					text-align: center;
					font-size: computed(28);
				}
				.disable {
					background: #CCCCCC;
					color: #fff;
				}
				.btn-off-shelves{
					width: computed(480);
					background: #CCCCCC;
					border-color: #CCCCCC;
					line-height: computed(100);
					text-align: center;
					font-size: computed(28);
					color: #fff;

				}
			}
		}
		/* 评论弹窗 */
		.popup-comment {
			.common-score {
				display: flex;
				align-items: center;
				p {
					color: #666;
					font-size: computed(28);
					margin-right: computed(20);
					font-weight: 600;
				}
			}
			.popup-comment-body {
				width: 100vw;
				height: 100vh;
				overflow-y: auto;
				-webkit-overflow-scrolling: touch;
				box-sizing: border-box;
				padding: computed(30);
				.comment-rate {
					font-size: computed(28);
					color: $maincolor;
					margin: computed(70) 0 computed(30) 0;
					display: flex;
					align-items: center;
					img {
						width: computed(64);
						height: computed(64);
						border-radius: 50%;
						margin-right: computed(18);
					}
					.rate {
						display: inline-block;
						margin-left: computed(40);
					}
				}
				.comment-item {
					border-bottom: 1px solid rgba(204, 204, 204, 1);
					padding-bottom: computed(50);
					&:last-child {
						border-bottom: none;
						padding-bottom: 0;
					}
					.comment-item-tel {
						padding: computed(20) 0;
						height: computed(36);
						line-height: computed(36);
						.phone {
							font-size: computed(30);
							color: $maincolor;
						}
						.vip {
							font-size: computed(24);
							color: white;
							background-color: $maincolor;
							padding: computed(10) computed(15);
							margin-left: computed(20);
						}
						.data {
							font-size: computed(24);
							color: rgba(153, 153, 153, 1);
							text-align: left;
						}
					}
					.comment-item-content {
						font-size: computed(24);
						color: rgba(13, 14, 9, 1);
						word-break: break-all;
					}
					.comment-item-img {
						margin-top: computed(20);
						img {
							margin: 0 computed(20) computed(20) 0;
							width: computed(150);
							height: computed(150);
						}
					}
					.comment-item-reply {
						background: #EDF0F7;
						font-size: computed(24);
						padding: computed(14);
						margin-bottom: computed(14);
						span:first-child {
							font-weight: bold;
						}
						span:last-child {
						}
					}
					.add-comment-item {
						.comment-item-content {
							margin: 0 0 computed(14) 0;
							span {
								color: #2BA4F3;
							}
						}
					}
					.comment-time {
						color: #999999;
						font-size: computed(24);
						margin-bottom: computed(20);
					}
				}
			}
		}
		/* 加入购物车弹窗 */
		.popup-add-card {
			width: 100%;
			height: 84%;
			z-index: 1000;
			padding-bottom: 20px;
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
							margin-bottom: computed(20);
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
				.stepper {
					display: flex;
					margin-top: computed(20);
					align-items: center;
					/deep/.van-stepper {
						button {
							background: #fff;
							margin: 0;
							box-sizing: border-box;
							width: computed(88);
							height: computed(66);
							&:first-child {
								border-left: computed(2) solid #9A9A9A;
								border-top: computed(2) solid #9A9A9A;
								border-bottom: computed(2) solid #9A9A9A;
							}
							&:last-child {
								border-right: computed(2) solid #9A9A9A;
								border-top: computed(2) solid #9A9A9A;
								border-bottom: computed(2) solid #9A9A9A;
							}
							&.van-stepper__minus--disabled {
								border-color: #ccc;
							}
							&.van-stepper__plus--disabled {
								border-color: #ccc;
							}
						}
						input {
							margin: 0;
							border: computed(1) solid #9A9A9A;
							box-sizing: border-box;
							width: computed(80);
							height: computed(66);
							background: #fff;
						}
					}
					.goods-stock {
						font-size: computed(24);
						margin-left: computed(20);
					}
				}
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
		.popup-vouchers-card {
			height: 80%;
			.comment-close {
				top: computed(30);
			}
			.vouchers-card-body {
				height: 100%;
				.vouchers-card-title {
					text-align: left;
					padding: 0 computed(30);
					line-height: computed(90);
					font-size: computed(32);
					color: #0D0E09;
					background: #EDF0F7;
				}
				.empty {
					text-align: center;
					font-size: computed(30);
					color: #333333;
					line-height: 1.5;
				}
				.vouchers-card-list {
					text-align: center;
					overflow: auto;
					padding: computed(30) computed(30) 0 computed(30);
					height: 89%;
					.vouchers-item {
						position: relative;
						width: 100%;
						background: #2BA4F3;
						height: computed(200);
						box-sizing: border-box;
						margin-bottom: computed(30);
						padding: 0 computed(30);
						&.auto {
							height: auto;
						}
						.circle-left {
							width: computed(30);
							height: computed(30);
							background: #fff;
							position: absolute;
							top: computed(128);
							border-radius: 50%;
							left: computed(-15);
						}
						.circle-right {
							width: computed(30);
							height: computed(30);
							background: #fff;
							position: absolute;
							top: computed(128);
							border-radius: 50%;
							right: computed(-15);
						}
						.vouchers-main {
							border-bottom: computed(1.5) dotted #fff;
							display: flex;
							align-items: center;
							justify-content: space-between;
							color: #fff;
							height: computed(144);
							.vouchers-price {
								font-size: computed(30);
								width: computed(150);
								span {
									font-size: computed(48);
								}
							}
							.vouchers-desc {
								text-align: left;
								.type{
									font-size: computed(30);
									font-weight: 600;
									margin-bottom: computed(18);
								}
								.time{
									font-size: computed(20);
								}
							}
							.vouchers-buy {
								p {
									font-size: computed(20);
									color: #fff;
									margin-bottom: computed(10);
									margin-top: computed(-10);
								}
								.vouchers-button {
									width: computed(132);
									line-height: computed(50);
									color: #2BA4F3;
									font-size: computed(24);
									background: #fff;
								}
							}
						}
						.vouchers-footer {
							color: #fff;
							.limit-desc {
								display: flex;
								justify-content: space-between;
								font-size: computed(20);
								line-height: computed(50);
							}
							.instruct-text {
								font-size: computed(20);
								text-align: left;
								line-height: computed(30);
								padding-bottom: computed(16);
							}
							.rotate{
								transform: rotate(180deg);
							}
						}
					}
				}
			}
		}
		.popup-promo-card {
			height: 80%;
			.comment-close {
				top: computed(20);
			}
			.promo-card-body {
				height: 100%;
				.promo-card-title {
					text-align: left;
					padding: 0 computed(30);
					line-height: computed(90);
					font-size: computed(32);
					color: #0D0E09;
					background: #EDF0F7;
				}
				.promo-card-list {
					text-align: center;
					overflow: auto;
					padding: 0 computed(30);
					height: 89%;
					.promo-item {
						position: relative;
						width: 100%;
						height: computed(102);
						box-sizing: border-box;
						display: flex;
						justify-content: space-between;
						align-items: center;
						border-bottom: computed(1.5) solid #CCCCCC;
						.promo {
							color: #2BA4F3;
							font-size: computed(24);
							width: 55%;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							text-align: left;
						}
						@media screen  and (max-width: 320px) {
							.promo {
								width: 65%;
							}
						}
						.time {
							text-align: left;
							color: #333333;
							font-size: computed(20);
						}
					}
				}
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
		/* 平台推荐商品 */
		.rcmd-goods {
			overflow: hidden;
			padding: 0 computed(30);
			.rcmd-title {
				padding: computed(40) 0;
				font-size: computed(32);
				line-height: computed(32);
				color: #333;
				text-align: center;
				font-weight: 600;
				border-bottom: computed(1) solid #CCCCCC;
			}
			.rcmd-list li {
				position: relative;
				width: 100%;
				overflow: hidden;
				img {
					display: block;
					width: 100%;
					height: 100%;
				}
				.rcmd-info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.goods-info {
						width: 80%;
						padding: 0;
						.goods-name {
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						.price {
							font-size: computed(28);
							color: #0D0E09;
							font-weight: 600;
							.tag-price {
								color: #999999;
								font-size: computed(24);
								text-decoration: line-through;
							}
						}
					}
					.collection {
						width: 20%;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border-left: computed(1) solid #CCCCCC;
						p {
							font-size: computed(18);
						}
						&.active {
							color: #2ba4f3;
						}
					}
				}
			}
		}


		.big-pic-box .van-swipe {
			width: computed(750);
			height: computed(750);
			.van-swipe__track {
				width: auto !important;
				.van-swipe-item {
					display: flex;
					width: computed(750)!important;
					height: computed(750)!important;
					text-align: center;
					overflow: hidden;
					justify-content: center;
					align-items: center;
					.bigPic {
						max-width: computed(750);
						max-height: computed(750);
					}
					.skuBigPic {
						width: computed(750);
						height: computed(750);
					}
				}
			}
		}
	}
	.comment-popup{
		z-index: 9999;
	}
	/deep/.van-swipe {
		.van-swipe__indicators {
			.van-swipe__indicator--active {
				width: computed(36);
				border-radius: computed(30) computed(30);
			}
		}
	}

	.share-popup{
		background: transparent;
	}

	/* 自定义弹窗背景 -- 分享 */
	.share-img {
		width: 100%;
		height: computed(230);
		background: url('../../assets/images/goods/share.png') no-repeat;
		background-size: computed(370) computed(230);
		background-position-x: computed(320);
	}

	/deep/.van-overlay {
		&.big-background {
			background: rgba(0,0,0,1);
		}
	}
</style>
