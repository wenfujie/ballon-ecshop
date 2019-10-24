/*
* createTime：2018-06-26
* author：junyong.hong
* description: 场景优选
*/
<template>
    <div class="qs-scene">
        <!-- 头部导航 begin -->
        <GoodsHeader :count="shoppingCartCount" :isActive="'scene'"></GoodsHeader>
        <!-- 头部导航 end -->

        <!-- 内容 begin -->
        <div class="qs-scene-body" >
            <div class="body-bg" v-for="item in titleData">
                <img :src="getImg(item.img)" alt="" onerror="errImg(event)">
                <div class="body-bg-title">
                    <!-- 遍历列数 -->
                    <ul v-for="(data, index) in (Math.ceil((item.titles.length)/4))">
                        <!-- 当前列要遍历4个标题 -->
                        <li v-if="item.titles.length - 4*(index+1) >= 0" v-for="(li,liIndex) in liLength" @click="goList(item.titles[((4 * index) + liIndex)].cmsBackpageDttCode)" >{{item.titles[((4 * index) + liIndex)].cmsBackpageDttName}}</li>
                        <!-- 当前列遍历小于4个标题 -->
                        <li v-if="item.titles.length - 4*(index+1) < 0" v-for="(li,liIndex) in (item.titles.length - 4 * index)" @click="goList(item.titles[((4 * index) + liIndex)].cmsBackpageDttCode)" >{{item.titles[((4 * index) + liIndex)].cmsBackpageDttName}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 内容 end -->
    </div>

</template>
<script>
    // 头部组件
    import GoodsHeader from '@/components/GoodsHeader'
    import Storage from '../../util/storage'
    import { Cms, Goods, ShoppingCart } from '../../api/service'
    export default {
        components: {
            GoodsHeader
        },
        data () {
            return {
                titleData: [],
                pageData: [],
                // 每列要遍历的个数
                liLength: 4,
                shoppingCartCount: ''
            }
        },
        created () {
            this.$nextTick(() => {
                this.getPage()
                this.getCartCount()
            })
        },
        methods: {
            //  获取购物车数量
            getCartCount() {
                let data = {};
                ShoppingCart.getCartCount(data).then((res) => {
                    this.shoppingCartCount = res;
                });
            },

            //  获取页面模板
            getPage () {
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.chooseBuy.children.scene,
                    busContsCode: baseConstant.busContsCode,
                }
                Cms.getUsrCmsInfoV2(data).then((res)=>{
                    let map = {}
                    let newArr = []
                    let imgIndex = ''
                    let pageData = res.cmsModulepageHdList[0].cmsBackpageDtDtoList  //正确数据结构
//                    let pageData = res.cmsModulepageHdList  //  companyId=125时的数据结构
                    pageData.forEach((item)=> {
                        map.titles = item.cmsBackpageDttList
//                        map.titles = item.cmsBackpageDtDtoList[0].cmsBackpageDttList;  //companyId=125时的数据结构
                        for(let i=0; i<map.titles.length; i++) {
                            if(map.titles[i].fileType === "1") {
                                map.img = map.titles[i].fileUrl
                                imgIndex = i
                            }
                        }
                        map.titles.splice(imgIndex,1)
                        newArr.push(map)
                        map = {}
                    })
                    this.titleData = newArr
                } ,(err)=>{})
            },

            //  跳转现购列表
            goList(code) {
                if(code !== undefined) {
                    this.$router.push('/choosebuy-list?code=' + code)
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .qs-scene {
        .qs-scene-body{
            position: absolute;
            top: computed(105);
            width:100%;
            .body-bg{
                position: relative;
                width: 100%;
                > img{
                    display: block;
                    width: 100%;
                }
                .body-bg-title{
                    position: absolute;
                    top: computed(245);
                    width: 100%;
                    height: computed(230);
                    > ul{
                        z-index: 999;
                        font-size: computed(24);
                        color: white;
                        height: computed(228);
                        display: inline;
                        float: left;
                        > li{
                            margin-left: computed(40);
                            padding: computed(12.58) 0;
                        }
                    }
                }
            }
        }
    }
</style>
