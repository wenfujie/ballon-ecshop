/*
* createTime：2018-06-26
* author：junyong.hong
* description: 品类导购
*/
<template>
    <div class="choosebuy-body" v-cloak>
        <!-- 通用头部组件 -->
        <!-- <GoodsHeader :count="shoppingCartCount" :isActive="'choosebuy'"></GoodsHeader> -->

        <!-- 头部导航 begin -->
        <!-- <div class="choosebuy-body-nav" >
            <div class="nav-title" ref="menuWrapper">
                <ul>
                    <li v-for="(item, index) in products"
                        :class="{'active': currentIndex === index}"
                        @click="selectMenu(index, $event)"
                        ref="menuList"
                    ><span>{{item.title}}</span></li>
                </ul>
                <span class="home iconfont icon-shouye" @click="backHome"></span>
            </div>
        </div> -->
        <!-- 头部导航 end -->

        <!-- 内容 begin -->
        <div class="choosebuy-body-main" ref="clothesWrapper">
            <ul>
                <li ref="clothesList" >
                    <!-- <div class="main-title">{{item.title}}</div> -->
                    <div class="main-content" v-for="(row, rowIndex) in products" @click="goDetail(row)" :key="rowIndex">
                        <img :src="getImg(row.goodsFilePath, '750*750')" alt="" onerror="errImg(event)">
                        <div v-if="row.isNew" class="main-new-img"></div>
                        <div>
                            <div class="main-left">
                                <span class="main-money">￥</span>
                                <span class="main-pay">{{row.salePrice || 0}}</span>
                                <del v-if="!!row.tagPrice && row.tagPrice > 0">{{row.tagPrice}}</del>
                            </div>
                            <div class="main-right">
                                <span class="iconfont icon-zan" @click.stop="collectToggle(row)" :class="[row.collectionDtId !== null ? 'active icon-zan_' : '']"></span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 内容 end -->

        <!-- 点赞弹出框 begin -->
        <van-popup v-model="likeShow" overlay-class="model-z-index" class="like-show" >{{likeShowContent}}</van-popup>
        <!-- 点赞弹出框 end -->
    </div>
</template>
<script>
    // better-scroll
    import BScroll from 'better-scroll'

    // vant
    import { Popup } from 'vant'

    // 头部组件
    import GoodsHeader from '@/components/GoodsHeader'

    // 金额后面补齐两位小数点
    import { toMoney } from '@/util/moneyFilter'

    // 前端api
    import { Cms, Collection, ShoppingCart } from '../../api/service'

    //  本地缓存
    import Storage from '../../util/storage'

    export default {
        name: 'choosebuy',
        filters: {
            /**
             * 金额后面补齐两位小数点
             */
            moneyFilter (money) {
            	if(!money) money = 0
                return toMoney(money)
            }
        },
        data () {
            return {
                // 产品数据模拟
                products: [],
                // 每个模块的高度
                listHeight: [],
                // 垂直滚动距离
                scrollY: 0,
                // 点赞弹窗
                likeShow: false,
                // 弹窗内容
                likeShowContent: '',
                shoppingCartCount: ''
            }
        },
        components: {
            GoodsHeader,
            'van-popup': Popup
        },
        computed: {
            /**
             * 计算当前激活的标题
             * @returns {number} 返回当前选中的索引值
             */
            currentIndex () {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i]
                    let height2 = this.listHeight[i + 1]
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        this._followScroll(i)
                        return i
                    }
                }
                return 0
            }
        },
        created () {
            // console.log(this)
            // this.getNavList()
            // this.getCartCount()
            this.getGoodsList()
            /**
             * 页面窗口改变
             */
            window.onresize = () => {
                this._calculateHeaderWidth()
                this._calculateHeight()
            }
        },
        methods: {

            //  获取购物车数量
            getCartCount() {
                let data = {};
                ShoppingCart.getCartCount(data).then((res) => {
                    this.shoppingCartCount = res;
                });
            },

            //  返回首页
            backHome () {
                this.$router.push('/index')
            },
            /**
             * 点击标题，滑倒对应的模块
             * @param index 当前点击的索引值
             * @param event
             */
            selectMenu (index, event) {
                if (!event._constructed) {
                    return
                }
                let clothesList = this.$refs.clothesList
                let el = clothesList[index]
                this.clothesScroll.scrollToElement(el, 500)
            },
            /**
             * 计算ul的滑动宽度
             * @private
             */
            _calculateHeaderWidth () {
                let width = 0

                // 此距离相当与li的margin
                let liMargin = this.$refs.menuList[0].getBoundingClientRect().left

                // home键的宽度
                let homeWidth = this.$refs.menuWrapper.getElementsByClassName('home')[0].getBoundingClientRect().width

                // 计算所有li的宽度 + margin
                for (let i = 0; i < this.products.length; i++) {
                    // getBoundingClientRect() 返回元素的大小及其相对于视口的位置
                    width += Math.ceil(this.$refs.menuList[i].getBoundingClientRect().width) + liMargin
                }

                // 所有li的宽度 - 一屏屏幕的宽度 + home键的宽度
                let setWidth = width - (window.screen.width) + homeWidth

                // 导航应滚动的宽度
                if (setWidth > 0) {
                    this.$refs.menuWrapper.getElementsByTagName('ul')[0].style.width = setWidth + 'px'
                } else {
                    this.$refs.menuWrapper.getElementsByTagName('ul')[0].style.width = '0px'
                }
            },

            /**
             * better-scroll初始化参数
             * @private
             */
            _initScroll () {
                this.meunScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true,
                    scrollX: true,
                    scrollY: false
                })

                this.clothesScroll = new BScroll(this.$refs.clothesWrapper, {
                    click: true,
                    probeType: 3
                })

                this.clothesScroll.on('scroll', (pos) => {
                    // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
                    if (pos.y <= 0) {
                        this.scrollY = Math.abs(Math.round(pos.y))
                    }
                })
            },

            /**
             * 计算每个分类的高度
             * @private
             */
            _calculateHeight () {
                let clothesList = this.$refs.clothesList
                let height = 0
                this.listHeight = []
                this.listHeight.push(height)
                for (let i = 0; i < clothesList.length; i++) {
                    let item = clothesList[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },

            /**
             * 横向移动标题
             * @param index 当前激活的title的索引值
             * @private
             */
            _followScroll (index) {
                let menuList = this.$refs.menuList
                let el = menuList[index]
                this.meunScroll.scrollToElement(el, 500, -200, 0)
            },

            /**
             * 收藏/取消收藏
             */
            collectToggle (item) {

                //  collectionDtId=== null代表未收藏

                if(item.collectionDtId === null) {
                    //  收藏
                    let data = {
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('USER_INFO').companyId,
                        busContsCode: baseConstant.busContsCode,
                        goodsCode: item.goodsCode,
                        shopId: Storage.get('USER_INFO').shopId
                    }
                    Collection.addCollection(data).then((res)=> {
                        if(res === 1){
                            this.likeShowContent = '收藏成功'
                            this.likeShow = true
                            this.getGoodsList()
                            setTimeout(() => {
                                this.likeShow = false
                            }, 1000)
                        }
                    })
                }else{
                    //  取消收藏
                    let data = {
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('USER_INFO').companyId,
                        goodCodeStr: item.goodsCode,
                        ids: item.collectionDtId
                    }
                    Collection.deleteCollection(data).then((res)=>{
                        this.likeShowContent = '取消收藏成功'
                        this.likeShow = true
                        this.getGoodsList()
                        setTimeout(() => {
                            this.likeShow = false
                        }, 1000)
                    })

                }
            },

            goDetail (row) {

				if (row.orderFlag === 1) {
					this.$router.push("/goods/web-design?goodsCode=" + row.goodsCode);
				} else {
					this.$router.push("/goods-detail?goodsCode=" + row.goodsCode);
				}

				// 商品跳转前校验上下架
//				this.isShelve(row.goodsCode).then(res => {
//					if(!!res) {
//						if (row.orderFlag === 1) {
//							this.$router.push("/goods/web-design?goodsCode=" + row.goodsCode);
//						} else {
//							this.$router.push("/goods-detail?goodsCode=" + row.goodsCode);
//						}
//					}else{
//						this.$router.push("/off-shelves");
//					}
//				})
            },

            //  获取导航栏元素
            getNavList () {
                let pageData = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    busContsCode: baseConstant.busContsCode,
                    cmsWebCode: pageCode.chooseBuy.children.category
                }
                Cms.getUsrCmsInfoV2(pageData).then((res) => {
                    let categoryList = res.cmsModulepageHdList[0].cmsBackpageDtDtoList  //正确数据结构
//                    let categoryList = res.cmsModulepageHdList  //  companyId=125时的数据结构
                    let newArr = []
                    for (let i = 0; i < categoryList.length; i++) {
                        let map = {}
                        map.title = categoryList[i].cmsBackpageDtName  //正确数据结构
//                        map.title = categoryList[i].cmsBackpageDtDtoList[0].cmsBackpageDtName  //companyId=125时的数据结构
                        map.cmsBackpageDtCode = categoryList[i].cmsBackpageDtCode
//                        map.cmsBackpageDtCode = categoryList[i].cmsBackpageDtDtoList[0].cmsBackpageDtCode  // companyId=125时的数据结构
                        map.rows = []
                        newArr.push(map)
                    }
                    this.products = newArr
                }, (err)=>{}).then(() => {
                    this.$nextTick(() => {
                        this.getGoodsList()
                    })
                })
            },

            //  获取导航栏商品列表
            getGoodsList () {
                let goodsData = {
                    shopId: Storage.get('USER_INFO').shopId,
                    busContsCode: baseConstant.busContsCode,
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    // 页面编号
                    cmsWebCode: pageCode.index.name,
                    cmsWebItemCode: this.$route.params.className
                }
                Cms.getChoosebuyGoods(goodsData).then((res)=>{
                    console.log(res)
                    if(!res[0].goodsList || res[0].goodsList.length <= 0) return
                    this.products = res[0].goodsList
                    /* this.products.forEach((item)=> {
                        item.rows = []
                    })
                    this.products.forEach((item)=> {
                        for(let i=0; i<res.length; i++) {
                            if(res[i].cmsWebItemCode.indexOf(item.cmsBackpageDtCode) !== -1) {
                                try {
                                    for(let x=0; x<res[i].goodsList.length; x++){
                                        item.rows.push(res[i].goodsList[x])
                                    }
                                } catch (e){}
                            }
                        }
                    }) */
                }).then(()=>{
                    /* this.$nextTick(() => {
                        this._calculateHeaderWidth()
                        this._initScroll()
                        this._calculateHeight()
                    }) */
                })
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .choosebuy-body {
        .choosebuy-body-nav{
            position: fixed;
            top: computed(105);
            width: 100%;
            z-index: 999;
            background-color: #fff;
            border-bottom: 1px solid #cccccc;
            overflow: hidden;
            .nav-title{
                display:inline;
                height: computed(103);
                white-space: nowrap;
                ul{
                    position: relative;
                    > li{
                        display: inline-block;
                        margin: 0 computed(15);
                        padding: computed(30) 0;
                        font-size: computed(30);
                        &.active {
                            color: $maincolor;
                            border-bottom: 2px solid $maincolor;
                        }
                        &:first-child{
                            margin-left: computed(30) !important;
                        }
                    }
                }
                .home{
                    position: absolute;
                    top: 0;
                    right: 0;
                    color: $maincolor;
                    z-index: 999;
                    font-size: computed(49);
                    background-color: white;
                    width: computed(80);
                    height: computed(110);
                    line-height: computed(110);
                    text-align: center;
                }
            }
        }
        .choosebuy-body-main{
            // position: fixed;
            // top: computed(208);
            // bottom: 0;
            overflow-y: auto;
            width: 100%;
            ul{
                li{
                    text-align: center;
                    font-size: computed(30);
                    .main-title{
                        padding: computed(40) 0;
                    }
                    .main-content{
                        position: relative;
                        margin: 0 0 computed(20) 0;
                        padding: 0;
                        > img{
                            display: block;
                            width: 100%;
                            height: computed(750);
                        }
                        .main-new-img{
                            position: absolute;
                            top: computed(30);
                            right: computed(30);
                            padding: 0;
                            background-image: url('../../assets/images/goods/new-products.png');
                            background-size: 100% 100%;
                            height: computed(120);
                            width: computed(120);
                        }
                        > div{
                            position: absolute;
                            bottom: computed(30);
                            padding: 0 computed(30);
                            width: 92%;
                            .main-left{
                                float: left;
                                .main-money{
                                    font-size: computed(30);
                                    color: $maincolor;
                                }
                                .main-pay{
                                    font-size: computed(36);
                                    color: $maincolor;
                                    font-family: 'keesoftnew' !important;
                                    font-weight:100 !important;
                                }
                                del{
                                    font-size: computed(26);
                                    color: #999999;
                                    margin-left: computed(15);
                                }
                            }
                            .main-right{
                                float: right;
                                span{
                                    font-size: computed(30);
                                    &.active{
                                        color: $maincolor;
                                    }
                                }
                            }
                        }
                        &:last-child{
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
        .like-show{
            padding: computed(65) computed(80);
            white-space: nowrap;
            word-break: keep-all;
        }
    }
</style>
