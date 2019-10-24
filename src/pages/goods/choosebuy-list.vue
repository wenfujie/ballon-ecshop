/*
* createTime：2018/9/29
* author：en.chen
* description:  现购页商品列表
*/
<template>
    <div class="choosebuy-page">

        <!--标题 begin-->
        <div class="title">
            <h5>{{products.cmsWebItemName}}</h5>
            <p v-if="products.goodsList !== null">为您挑选了一批合适的{{products.cmsWebItemName}}</p>
            <p v-if="products.goodsList === null "> 暂无更多商品~ </p>
        </div>
        <!--标题 end-->

        <!-- 内容 begin -->
        <div class="choosebuy-body-main">
            <ul>
                <li v-for="(item, itemIndex) in products.goodsList" :key="" >
                    <div class="main-content" @click="goDetail(item)">
                        <img :src="getImg(item.goodsFilePath)" alt="" onerror="errImg(event)">
                        <div v-if="item.isNew" class="main-new-img"></div>
                        <div>
                            <div class="main-left">
                                <span class="main-money">￥</span>
                                <span class="main-pay">{{item.salePrice || 0}}</span>
                                <del>{{item.tagPrice}}</del>
                            </div>
                            <div class="main-right">
                                <span class="iconfont icon-zan" @click.stop="collectToggle(item)" :class="[item.collectionDtId !== null ? 'active icon-zan_' : '']"></span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 内容 end -->
    </div>
</template>
<script>

    // 前端api
    import { Cms, Collection } from '../../api/service'
    //  本地缓存
    import Storage from '../../util/storage'
    import { Toast } from 'vant'

    export default {
        data() {
            return {
                products: [],
                code: ''
            }
        },
        methods: {
            //  获取页面
            getPage () {
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.chooseBuy.children.scene,
                    busContsCode: baseConstant.busContsCode,
                    cmsWebItemCode: this.code,
                    shopId: Storage.get('USER_INFO').shopId,
                }
                Cms.getChoosebuyGoods(data).then((res) => {
                    this.products = res[0]
                })
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
                            Toast('收藏成功')
                            this.getPage()
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
                        Toast('取消收藏成功~')
                        this.getPage()
                    })

                }
            },

            //  跳转详情
            goDetail(item) {

				if (item.orderFlag === 1) {
					this.$router.push("/goods/web-design?goodsCode=" + item.goodsCode);
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
//					}else{
//						this.$router.push("/off-shelves");
//					}
//				})
            }
        },
        created() {
            this.code = this.$route.query.code
            this.getPage()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
    .choosebuy-page{
        overflow: hidden;
    }
    .title{
        margin: computed(38) computed(30);
        h5{
            font-size: computed(36);
            line-height: computed(38);
            color: #0D0E09;
        }
        p{
            margin-top: computed(16);
            font-size: computed(24);
            line-height: computed(26);
            color: #999999;
        }
    }
    .choosebuy-body-main{
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
</style>