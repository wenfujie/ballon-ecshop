/*
* createTime：2018/8/24
* author：en.chen
* description:  会员模块--消费记录
*/
<template>
    <div class="purchase">

        <ul class="purchase-title clearfix" :class="{'single' : isIntegration === false}">
            <li class="time">支付时间</li>
            <li class="type">消费类型</li>
            <li class="amount">金额</li>
            <li class="source" v-if="isIntegration">来源账号</li>
        </ul>

        <!--消费记录列表 begin-->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false" >
            <div v-for="year in yearList" :key="" v-if="yearList.length > 0">
                <div class="history-box">
                    <p class="year-line">{{year}}</p>
                    <ul class="history-list" v-if="historyList.length>0">
                        <li class="history-item" v-for="item in historyList" v-if="item.purchaseTime === year" :class="{'single' : isIntegration === false}">
                            <div class="purchase-time"><p>{{item.consumeTime}}</p></div>
                            <div class="detail">{{item.consumeName}}</div>
                            <div class="value">￥{{item.consumeAmount}}</div>
                            <div class="source" v-if="isIntegration">{{ item.vipInfoHdId === vipInfoHdId ? '当前账户' : item.vipMobilePhone  }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </van-list>
        <!--消费记录列表 end-->

        <!-- 暂无记录提示 -->
        <div class="empty-content" v-if="yearList.length <= 0 && !loading">
            <p v-if="!loading">暂无消费记录~</p>
        </div>
        <!-- 暂无记录提示 -->

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
                historyList: [],
                loading: true,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                pageNum: 1,
                pageSize: 10,
                yearList: [],
                total: '',
                statusLock: false,
                vipInfoHdId: Storage.get('USER_INFO').vipInfoId,
				isIntegration: null // 是否整合
            }
        },
        methods: {

        	//  获取会员整合的信息
			getRelationAccountList() {
				UserService.getRelationAccountList({}).then((res) => {
					if(res && res.length > 1) {
						this.isIntegration = true
                    }else{
						this.isIntegration = false
                    }
                }).then(() => {
					this.getList()
                })
            },

            //  获取消费记录列表
            getList () {
                if(this.statusLock) return
                this.statusLock = true
                if(this.finished === true) {
                    Toast('没有更多了~')
                    this.loading = false
                    return
                }
                //会员整合调整，后端只存一张表，所以不需要传lastTime
//                let time = ''
//                if(this.historyList.length >= 1) {
//                    let len = this.historyList.length
//                    time = this.historyList[len-1].consumeTime  // 当数据大于0时，取最后一条的时间参数作为lastTime
//                }
                let data = {
                    cookieId: Storage.get('USER_INFO').usrId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
//                    lastTime: time || null
                }
                UserService.getPurchase(data).then((response) => {
					let res = response.consumeInfoList || {}
                    this.total = res.total
                    if(!!res.total && res.total >0){
                        if(res.list.length>0){
                            res.list.forEach((item) => {
                                let year = item.consumeTime.substr(0,4)
                                item.purchaseTime = year
                                if(this.yearList.length === 0) {  // 获取时间年限
                                    this.yearList.push(year)
                                }else{
                                    for(let i=0; i<this.yearList.length; i++) {
                                        if(this.yearList[i] !== year){
                                            this.yearList.push(year)
                                        }else {}
                                    }
                                }
                                // 年份去重
                                this.yearList = Array.from(new Set(this.yearList));
                                this.historyList.push(item)
                            })
                        }
                        if(this.historyList.length && this.historyList.length >= this.total) {  // 判断分页是否结束
                            this.finished = true
                            this.loading = false
                        }
                    }else{
                        this.finished = true
                        this.loading = false
                    }
                }).then(() => {
                    this.statusLock = false
                    this.loading = false
                })
            },

            //  加载更多
            loadMore () {
                if(this.finished == true) {
                    Toast('没有更多了~')
                    return
                }
                else{
                    this.pageNum += 1
                    this.getList()
                }
            }
        },
        created() {
            this.getRelationAccountList()
        },
        mounted() {

        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .purchase{
        background: #F1F1F1;
        overflow: hidden;
        position: relative;
        padding-top: computed(88);
        .purchase-title{
            box-sizing: border-box;
            width: 100%;
            height: computed(88);
            padding: 0 computed(30);
            background: #F1F1F1;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 9;
            li{
                float: left;
                font-size: computed(28);
                line-height: computed(88);
                color: #333333;
                overflow: hidden;
                text-align: left;
                &.time{
                    width: computed(150);
                }
                &.type{
                    margin-left: computed(20);
                    width: computed(130);
                }
                &.amount{
                    margin-left: computed(55);
                }
                &.source{
                    width: computed(150);
                    float: right;
                }
            }
            &.single{
                display: flex;
                flex-direction: row;
                li{
                    flex: 1;
                    &.amount{
                        min-width: computed(160);
                        flex: inherit;
                    }
                }
            }
        }
        .history-box{
            background: #fff;
            position: relative;
            margin-bottom: computed(20);
            overflow: hidden;
            .year-line{
                box-sizing: border-box;
                font-size: computed(36);
                line-height: computed(80);
                color: #999999;
                position: relative;
                text-align: center;
                border-bottom: solid computed(1) #E6E6E6;
            }
        }
        .history-list{
            padding: 0 computed(30);
            .history-item{
                display: flex;
                height: computed(110);
                align-items: center;
                justify-content: space-between;
                .purchase-time{
                    width: computed(150);
                    word-break: break-all;
                    font-size: computed(24);
                    line-height: computed(34);
                    color: #999999;
                    p{
                        width: computed(150);
                    }
                }
                .detail{
                    margin-left: computed(20);
                    width: computed(130);
                    font-size: computed(24);
                    line-height: computed(28);
                    color: #0D0E09;
                    overflow: hidden;
                }
                .value{
                    flex: 1;
                    margin-left: computed(55);
                    font-size: computed(24);
                    line-height: computed(28);
                    color: #0D0E09;
                }
                .source{
                    width: computed(150);
                    font-size: computed(24);
                    line-height: computed(28);
                    color: #0D0E09;
                }
                &.single{
                    .purchase-time {
                        flex: 1;
                    }
                    .detail{
                        flex: 1;
                    }
                    .value{
                        min-width: computed(160);
                        flex: inherit;
                    }
                }
            }
        }
    }
    .history-box{
        position: relative;
        /*margin-top: computed(50);*/
        overflow: hidden;
    }
    .empty-content{
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: computed(30);
        color: #333333;
        line-height: 1;
    }
</style>
