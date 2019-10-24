/*
* createTime：2018/8/2
* author：en.chen
* description:  我的足迹
*/
<template>
    <div class="member-center">
        <!--商品列表 begin-->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false" v-if="goodsList.length>0">
            <!--浏览提示 begin-->
            <p class="no-goods-tip">显示近90天的浏览足迹～</p>
            <!--浏览提示 end-->
            <!-- 浏览商品列表 end-->
            <div class="member-goods-list">
                <ul>
                    <li class="member-goods-item" v-for="item in goodsList" :key="">
                        <img :src="getImg(item.url, '165*165')" alt="" onerror="errImg(event)">
                        <p class="goods-name">{{ item.goodsName === null ? 'Null' : item.goodsName }}</p>
                        <div class="goods-price">
                            <span class="sale-price">￥{{item.salePrice}}</span>
                            <span class="tag-price" v-if="item.tagPrice">￥{{item.tagPrice}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- 浏览商品列表 end -->
        </van-list>
        <!--商品列表 end-->
        <!--没有浏览痕迹 begin-->
        <div class="no-goods-content" v-if="!goodsList || goodsList.length === 0"></div>
        <!--没有浏览痕迹 end-->
    </div>
</template>
<script>
    import { List, Toast } from 'vant';
    import { UserService } from '../../api/service'
    import Storage from '../../util/storage'
    export default {
        components: {
            'van-list': List
        },
        data() {
            return {
                goodsList: [],
                showSelect: false,
                loading: false,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                pageNum: 1,
                pageSize: 10
            }
        },
        methods: {
            //  上拉加载更多
            loadMore(){
                if(this.finished === true) {
                    return
                } else {
                    this.pageNum += 1
                    this.getList()
                }
            },

            //  加载页面
            getList () {
                if(this.finished === true) {
                    Toast('没有更多了~')
                    return
                }
                let data = {
                    busContsCode: baseConstant.busContsCode,
                    footMarkType: 'D_ALL',
                    dptId: Storage.get('USER_INFO').shopId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }
                UserService.getUserFootprint(data).then((res)=> {
                    if(res.list.length >0) {
                        res.list.forEach((item) => {
                            this.goodsList.push(item)
                        })
                    }
                    if(res.hasNextPage === false) {
                        this.finished = true
                    }
                    this.loading = false
                })
            }
        },
        created() {
            this.getList()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .no-goods-content{
        width: computed(400);
        margin: 0 auto;
        padding-bottom: computed(500);
        background: url("../../assets/images/common/no-footprint.jpg") no-repeat center;
        -webkit-background-size: 90%;
        background-size: 90%;
    }
    .goods-name{
        margin-top: computed(12);
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .goods-price {
        margin-top: computed(12);
    }
    .sale-price {
        color: #0D0E09;
    }
    .tag-price {
        margin-left: computed(10);
        color: #999999;
        text-decoration: line-through;
    }
</style>
