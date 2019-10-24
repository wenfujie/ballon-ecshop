/*
* createTime：2018/12/20
* author：junyong.hong
* description: 首页
*/
<template>
	<div class="index">

		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100" ref="refresh"
						  :disabled="canRefresh">

			<div class="index-content" ref="index">

				<!-- banner begin -->
				<div class="index-banner">
					<!--<van-swipe class="banner-swipe"-->
					<!--v-if="bannerList.length > 0"-->
					<!--:autoplay="3000"-->
					<!--indicator-color="#999999"-->
					<!--:duration="300">-->
					<!--<van-swipe-item-->
					<!--v-for="(item, index) in bannerList"-->
					<!--:key="index">-->
					<!--<img :src="getImg(item.coverFileUrl)" @click="goUrl(item.url)" onerror="errImg(event)" width="100%" height="100%">-->
					<!--</van-swipe-item>-->
					<!--</van-swipe>-->

					<swiper v-if="bannerList.length > 1 && isKeepAlive" :options="bannerSwiperOption"
							class="banner-swipe">
						<swiper-slide v-for="(item,index) in bannerList" :key="index" class="banner-list">
							<img :src="getImg(item.coverFileUrl, '750*360')" @click="goUrl(item.url)" width="100%" height="100%">
						</swiper-slide>
						<div class="swiper-pagination" slot="pagination"></div>
					</swiper>
				</div>
				<!-- banner end -->

				<!-- 搜索框 begin -->
				<div class="index-search" @click="goSearch()">
					<i class="iconfont icon-sousuo"></i>
					<input v-model="keyWord" type="text" placeholder="搜索商品" @keyup.enter="search()">
				</div>
				<!-- <div class="index-search" @click="goSearch()">
					<div class="search">
						<i class="iconfont icon-sousuo"></i>
						<p class="default-word">{{keyWord}}</p>
						<i class="iconfont icon-guanbi"></i>
					</div>
				</div>
				<!-- 搜索框 end -->

				<!-- 导航 begin -->
				<div class="index-nav">
					<van-row>
						<van-col v-for="(item, index) in navList"
								 :key="index"
								 span="6">
							<div @click="navGoto(item.cmsBackpageDttList[0].url || item.cmsBackpageDttList[1].url)"
								 class="nav-item">
								<img v-for="(child, imgIndex) in item.cmsBackpageDttList" :key="imgIndex"
									 v-if="child.fileType == 1" v-lazy="getImg(child.coverFileUrl, '100*100')">
								<p v-for="(child, ind) in item.cmsBackpageDttList" :key="ind"
								   v-if="child.fileType == 0">
									{{child.covername}}</p>
							</div>
						</van-col>
					</van-row>
				</div>
				<!-- 导航 end -->

				<!-- 热卖商品 begin -->
				<div v-if="hotGoodsList" class="index-hot-goods">
					<div class="goods-title">
						<p @click="navGoto('/choosebuy-category/' + hotClass)">{{rmdpGoods.covername}}<i
								class="iconfont icon-youfan"></i></p>
					</div>
					<div class="goods-main">
						<van-row>
							<van-col v-for="(item, index) in hotGoodsList.goodsList"
									 v-if="index <= 3"
									 :key="index"
									 span="12">
								<!-- :class="(index+1) % 2 === 0 ? 'fr' : ''" -->
								<div @click="goDetail(item)"
									 class="goods-main-item">
									<span v-if="item.orderFlag === 1">定制</span>
									<img v-lazy="getImg(item.goodsFilePath, '330*330')" alt="" :key="item.goodsFilePath">
									<p class="overflow">{{item.goodsName}}</p>
									<p class="overflow">
										<span>￥{{item.salePrice | moneyFilter}}</span>
										<del v-if="!!item.tagPrice && item.tagPrice > 0">
											￥{{item.tagPrice | moneyFilter}}
										</del>
									</p>
								</div>
							</van-col>
						</van-row>
					</div>
				</div>
				<!-- 热卖商品 end -->

				<!-- 新品推荐 begin -->
				<div v-if="newProductsList" class="index-hot-goods">
					<div class="goods-title">
						<p @click="navGoto('/choosebuy-category/' + newClass)">{{xptjGoods.covername}}<i
								class="iconfont icon-youfan"></i></p>
					</div>
					<div class="goods-main">
						<van-row>
							<van-col v-for="(item, index) in newProductsList.goodsList"
									 v-if="index <= 3"
									 :key="index"
									 span="12">
								<!-- :class="(index+1) % 2 === 0 ? 'fr' : ''" -->
								<div @click="goDetail(item)"
									 class="goods-main-item">
									<span v-if="item.orderFlag === 1">定制</span>
									<img v-lazy="getImg(item.goodsFilePath, '330*330')" alt="" :key="item.goodsFilePath">
									<p class="overflow">{{item.goodsName}}</p>
									<p class="overflow">
										<span>￥{{item.salePrice | moneyFilter}}</span>
										<del v-if="!!item.tagPrice && item.tagPrice > 0">
											￥{{item.tagPrice | moneyFilter}}
										</del>
									</p>
								</div>
							</van-col>
						</van-row>
					</div>
				</div>
				<!-- 新品推荐 end -->

			</div>

		</van-pull-refresh>

		<!--会员整合弹窗-->
		<member-merge-dialog ref="mergeDialog" @changeList="changeList"></member-merge-dialog>

		<!-- 底部导航 -->
		<footer-bar ref="footBar"></footer-bar>
	</div>
</template>
<script type="text/ecmascript-6">
	import {Row, Col, Toast, PullRefresh} from 'vant'
	import {swiper, swiperSlide} from 'vue-awesome-swiper'
	import FooterBar from '@/components/FooterBar'
	import {UserService, Base, Login, Cms} from '../../api/service'
	import Storage from '../../util/storage'
	// 金额后面补齐两位小数点
	import {toMoney} from '@/util/moneyFilter'
	import 'swiper/dist/css/swiper.css'
	import MemberMergeDialog from '@/components/MemberMergeDialog.vue'

	export default {
		components: {
//            'van-swipe': Swipe,
//            'van-swipe-item': SwipeItem,
			'van-row': Row,
			'van-col': Col,
			swiper,
			swiperSlide,
			'footer-bar': FooterBar,
			'van-pull-refresh': PullRefresh,
			MemberMergeDialog
		},
		data() {
			return {
				// banner
				bannerSwiperOption: {
					autoplay: {
						delay: 3000,//秒
						disableOnInteraction: false,//滑动不会失效
					}, // 自动播放
					pagination: {
						el: '.swiper-pagination'
					},  //  轮播图下的圆点提示
					loop: true  //循环播放
				},
				bannerList: [],
				isKeepAlive: false,
				keyWord: '',
				navList: [],
				hotGoodsList: '',
				newProductsList: [],
				xptjGoods: [],
				rmdpGoods: [],
				hotClass: pageCode.index.children.hot,  // 热卖商品
				newClass: pageCode.index.children.new,   // 新品推荐
				isLoading: false,
				canRefresh: false,
				scrollVal: 0
			}
		},
		filters: {
			/**
			 * 金额后面补齐两位小数点
			 */
			moneyFilter(money) {
				if(!money) money = 0
				return toMoney(money)
			}
		},
		created() {     // created(如果路由加了keepalive，create用于初始化接口参数，第二次进入不会再请求) -> mounted -> activated(用于第二次进入页面控制变量) -> deactivated
			this._getBannerAndNav()
			this.$requestAll([this._getCommonGoodsList(pageCode.index.children.hot, 'hotGoodsList'), this._getCommonGoodsList(pageCode.index.children.new, 'newProductsList')])
		},
		mounted() {
			window.scroll(0,0);
			setTimeout(() => {
				this.$nextTick(() => {
					window.scroll(0,0);
					this.$refs.index.addEventListener('scroll', this.watchScroll)
				})
			}, 0)
		},
		activated() {    // keep-alive页面替代created钩子
			this.$refs.index.scrollTop = this.scrollVal
			this.isKeepAlive = true
			window.scroll(0,0);
		},
		deactivated() {  // keep-alive页面替代destroy钩子
			this.isKeepAlive = false
		},
		beforeRouteLeave(to, from, next) {
			this.scrollVal = this.$refs.index.scrollTop
			next()
		},
		methods: {

			//  下拉刷新
			onRefresh() {
				setTimeout(() => {
					this.navList = [];
					this.bannerList = [];
					this.newProductsList = [];
					this.xptjGoods = [];
					this.rmdpGoods = [];
					this._getBannerAndNav()
					this.$requestAll([this._getCommonGoodsList(pageCode.index.children.hot, 'hotGoodsList'), this._getCommonGoodsList(pageCode.index.children.new, 'newProductsList')])
					this.$refs.footBar.getDefaultTemplate()
					this.isLoading = false
				}, 500)
			},

			// 会员整合弹窗 列表值改变事件
			changeList(list) {
				this.$nextTick(() => {
					if (list && list.length) {
						this.$refs.mergeDialog.dialogVisibleState();
					} else {
						this.$refs.mergeDialog.dialogVisibleState(false);
					}
				})
			},
			/**
			 * 搜索
			 */
			search() {
				this.$router.push('/goods-list?keyWord=' + this.keyWord)
			},
			/**
			 * 获取banner、导航
			 */
			_getBannerAndNav() {
				let data = {
					cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
					cmsWebCode: pageCode.index.name,
					busContsCode: baseConstant.busContsCode
				}
				Cms.getUsrCmsInfoV2(data).then((res) => {
					res.cmsModulepageHdList.forEach((item, itemIndex) => {
						if (!!item.cmsBackpageDtDtoList && item.cmsBackpageDtDtoList.length > 0) {
							item.cmsBackpageDtDtoList.forEach((itm, itmIndex) => {
								// banner
								if (itm.cmsBackpageDtCode === 'balongshouye' && !!itm.cmsBackpageDttList) {
									this.bannerList = itm.cmsBackpageDttList
								}
								if (itm.cmsBackpageDtCode === pageCode.index.children.new && !!itm.cmsBackpageDttList) {
									this.xptjGoods = itm.cmsBackpageDttList[0]
								}
								if (itm.cmsBackpageDtCode === pageCode.index.children.hot && !!itm.cmsBackpageDttList) {
									this.rmdpGoods = itm.cmsBackpageDttList[0]
								}

								// 导航
								if (new RegExp('tb').test(itm.cmsBackpageDtCode) && !!itm.cmsBackpageDttList) {
									let getTwoData = {
										cmsBackpageDttList: [],
										hasText: false,
										hasImg: false
									}
									itm.cmsBackpageDttList.map(child => {
										if (getTwoData.cmsBackpageDttList.length == 2) return;
										if (child.fileType == 0 && !getTwoData.hasText) {
											getTwoData.cmsBackpageDttList.push(child)
											getTwoData.hasText = true
										}
										if (child.fileType == 1 && !getTwoData.hasImg) {
											getTwoData.cmsBackpageDttList.push(child)
											getTwoData.hasImg = true
										}
									})
									if (!getTwoData.hasImg) {
										getTwoData.cmsBackpageDttList.push({fileType: 1, coverFileUrl: ''})
									}
									itm.cmsBackpageDttList = getTwoData.cmsBackpageDttList
									this.navList.push(itm)
								}
							})
						}
					})
				})
			},
			/**
			 * 获取热卖商品、新品推荐
			 * @param cmsWebItemCode 页面元素编号
			 * @param listName 对象名称
			 *
			 * cmsWebItemCode： 热卖商品 rmsp  新品推荐 xptj
			 */
			_getCommonGoodsList(cmsWebItemCode, listName) {
				let data = {
					// 模板编号
					cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
					// 页面编号
					cmsWebCode: pageCode.index.name,
					// 页面元素编号
					cmsWebItemCode: cmsWebItemCode,
					busContsCode: baseConstant.busContsCode,
					shopId: Storage.get('USER_INFO').shopId,
				}
				Cms.getChoosebuyGoods(data).then((res) => {
					if (!res || res.length === 0) {
						this.isLoading = false
						return // 判空
					}
					this[listName] = res[0]
					this.isLoading = false
				})
			},
			/**
			 * 导航跳转到对应路由
			 * @param url 地址
			 */
			navGoto(url) {
				if (!url) {
					Toast('敬请期待~')
					return
				}
				if (url.indexOf('http') != -1) {
					location.href = url
					return
				}
				this.$router.push(url)
			},
			/*
			* 轮播图跳转
			*/
			goUrl(url) {
				if (!url) {
					Toast('敬请期待~')
					return
				}
				if (url.indexOf('http') != -1) {
					location.href = url
					return
				}
				this.$router.push(url)
			},
			//  跳转搜索页
			goSearch() {
				this.$router.push("/search");
			},
			/**
			 * 热卖商品跳转到详情页
			 * @param item 当前对象
			 */
			goDetail(item) {
				// 商品跳转前校验上下架
//				this.isShelve(item.goodsCode).then(res => {
//					if(!!res) {
//						if (item.orderFlag === 1) {
//							this.$router.push("/goods/web-design?goodsCode=" + item.goodsCode);
//						} else {
//							this.$router.push("/goods-detail?goodsCode=" + item.goodsCode);
//						}
//					}else{
//						this.$router.push("/off-shelves");
//					}
//				})

				if (item.orderFlag === 1) {
					this.$router.push("/goods/web-design?goodsCode=" + item.goodsCode);
				} else {
					this.$router.push("/goods-detail?goodsCode=" + item.goodsCode);
				}
			},
			//  滚动条监听
			watchScroll() {
				console.log("this.$refs.index.scrollTop==", this.$refs.index.scrollTop)
				if (this.$refs.index.scrollTop > 5) {
					this.canRefresh = true
				} else {
					this.canRefresh = false
				}
			}
		}
	}
</script>
<style lang="scss" type="text/scss" scoped>
	.index {
		$whiteColor: #ffffff;
		$grayColor: #edf0f7;
		$borderColor: #cccccc;
		$navPColor: #333333;
		$hotGrayColor: #666666;
		$hotTitleColor: #0d0e09;
		$hotDelColor: #999999;

		position: absolute;
		/*height: calc(100% - #{computed(100)});*/
		padding-bottom: computed(100);
		width: 100%;
		background-color: $grayColor;
		-webkit-overflow-scrolling: touch;
		.van-pull-refresh {
			height: 100%;
		}

		.index-content {
			position: relative;
		}

		.index-banner {
			max-height: computed(360);
			color: white;
			.banner-swipe {
				max-height: computed(360);
				z-index: 999;
			}
		}
		.index-search {
			position: relative;
			display: table-cell;
			padding: 0 computed(30);
			height: computed(110);
			background-color: $grayColor;
			vertical-align: middle;
			font-size: computed(32);
			> i {
				position: absolute;
				left: computed(45);
				top: computed(40);
				color: $borderColor;
			}
			> input {
				width: computed(630);
				height: computed(70);
				padding-left: computed(60);
				border: 1px solid $borderColor;
				&::-webkit-input-placeholder { /*WebKit browsers*/
					color: $borderColor;
				}
				&::-moz-input-placeholder { /*Mozilla Firefox*/
					color: $borderColor;
				}
				&::-ms-input-placeholder { /*Internet Explorer*/
					color: $borderColor;
				}
			}
		}
		.index-nav {
			margin-bottom: computed(20);
			overflow: hidden;
			background-color: $whiteColor;
			> div {
				text-align: center;
				> div {
					border-bottom: 1px solid $borderColor;
					border-right: 1px solid $borderColor;
					&:nth-child(4n) {
						border-right: none;
					}
					.nav-item {
						position: relative;
						width: 100%;
						height: computed(206.25);
						img {
							margin: computed(40) computed(40) 0 computed(40);
							width: computed(100);
							height: computed(100);
							border-radius: 50%;
						}
						p {
							width: computed(185);
							font-size: computed(24);
							color: $navPColor;
							// margin-bottom: computed(25);
							position: absolute;
							top: computed(150)
						}
					}
				}
			}
		}
		.index-hot-activity {
			margin-bottom: computed(20);
			padding: computed(30);
			background-color: $whiteColor;
			> p {
				margin-bottom: computed(30);
				text-align: center;
				font-size: computed(36);
				line-height: computed(36);
				color: $navPColor;
				font-weight: 600;
			}
			> div {
				> div {
					margin-left: -1px;
					margin-top: -1px;
					.activity-item {
						height: computed(190);
						padding: computed(20);
						border: 1px solid $borderColor;
						.activity-item-title {
							font-size: computed(32);
							line-height: computed(32);
							font-weight: 600;
							color: $navPColor;
						}
						.activity-item-main {
							display: flex;
							flex-direction: row;
							.main-left {
								width: computed(150);
								> p {
									margin: computed(12) 0 computed(25) 0;
									font-size: computed(24);
									line-height: computed(24);
									color: $hotGrayColor;
								}
								> img {
									margin-left: computed(30);
									height: computed(90);
									background-size: 100% 100%;
								}
							}
							.main-right {
								flex: 1;
								display: flex;
								> img {
									margin: auto;
									height: computed(150);
									background-size: 100% 100%;
								}
							}
						}
					}
				}
			}
		}
		.index-hot-goods {
			margin-bottom: computed(20);
			padding: computed(30);
			background-color: $whiteColor;
			.goods-title {
				margin-bottom: computed(30);
				border-bottom: 1px solid $borderColor;
				> p {
					padding-bottom: computed(30);
					text-align: center;
					font-size: computed(36);
					font-weight: 600;
					color: $navPColor;
				}
				> i {
					margin-left: computed(15);
				}
			}
			.goods-main {
				> div {
					> div {
						.goods-main-item {
							position: relative;
							> span {
								position: absolute;
								padding: computed(10) computed(40) computed(10) computed(15);
								background: url('../../assets/images/index/custom.png') no-repeat;
								background-size: 100% 100%;
								color: $whiteColor;
								font-size: computed(24);
							}
							> img {
								display: block;
								width: computed(330);
								height: computed(330);
							}
							> p {
								margin-top: computed(10);
								font-size: computed(28);
								color: $hotTitleColor;
								font-weight: 600;
								> del {
									margin-left: computed(20);
									color: $hotDelColor;
									font-weight: normal;
								}
								&:last-child {
									margin: computed(10) 0 computed(15) 0;
								}
							}
						}
					}
				}
			}
		}

		.overflow {
			overflow-x: hidden;
			overflow-y: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.fr {
			float: right;
		}

		.goods-main{
			.van-col--12{
				max-width: computed(330);
			}
			.van-col--12:nth-child(2n){
				float: right;
			}
		}
	}
</style>
