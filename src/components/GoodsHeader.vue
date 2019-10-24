/*
* createTime：2018-06-26
* author：junyong.hong
* description: 现购头部通用组件
*/
<template>
    <div class="qs-goods-header">
        <ul class="header-ul">
            <li class="iconfont icon-sousuo" @click="goSearch()"></li>
            <li class="choosebuy" @click="goChooseBuyCategory();"  :class="{ 'active': isActive === 'choosebuy' }">品类导购</li>
            <li class="scene" @click="goChooseBuyScene();" :class="{ 'active': isActive === 'scene' }">场景优选</li>
            <li class="iconfont icon-gouwudai shoppingCard" @click="goShoppingCart()"><span v-if="this.count > 0">{{count}}</span></li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: [
            // 购物车的数量
            'count',
            // 当前选中的标题
            'isActive'
        ],
        methods: {
            /**
             * 跳转到品类导购页面
             */
            goChooseBuyCategory () {
                this.$router.replace('/choosebuy-category')
            },
            /**
             * 跳转到场景优选
             */
            goChooseBuyScene () {
                this.$router.replace('/choosebuy-scene')
            },
            //  跳转搜索页
            goSearch () {
                this.$router.push('/search')
            },

            //  跳转购物车
            goShoppingCart () {
                this.$router.push('/shopping-cart')
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .qs-goods-header{
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 999;
        .header-ul{
            display: flex;
            width: 100%;
            height: computed(105);
            background-color: #222222;
            color: white;
            > li{
                margin: auto;
            }
            li:first-child, li:last-child{
                width: computed(89);
                font-size: computed(49);
                text-align: center;
            }
            li:last-child{
                position: relative;
                > span{
                    position: absolute;
                    top: computed(-5);
                    right: computed(20);
                    font-size: computed(24);
                    background-color: $maincolor;
                    border-radius: 50%;
                    min-width: computed(26);
                    min-height: computed(26);
                    line-height: computed(26);
                }
            }
            .choosebuy, .scene{
                flex: 1;
                text-align: center;
                font-size: computed(39.59);
            }
            .choosebuy.active, .scene.active{
                color: $maincolor;
            }
        }
    }
</style>
