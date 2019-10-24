<template>
    <div class="member-point">
        <!--积分预览-->
        <div class="point-preview" id="point-preview">
            <p class="final-point">{{(finalPoints === undefined) || (finalPoints === null) ? 0 : finalPoints}}积分可用</p>
            <p class="freeze-point">{{(freezePoints === undefined) || (freezePoints === null) ? 0 : freezePoints}}积分冻结中<i class="iconfont icon-wenhao" @click="showDialog()"></i></p>
        </div>
        <!--积分明细-->
        <div class="point-detail">
            <ul class="point-title clearfix" :class="{'single' : isIntegration === false}">
                <li class="detail">明细</li>
                <li class="amount">积分</li>
                <li class="final">操作后积分</li>
                <li class="source" v-if="isIntegration">来源账号</li>
            </ul>
        </div>
        <!--fixed栏-->
        <div class="point-detail fixed" id="fixed-bar">
            <ul class="point-title clearfix" :class="{'single' : isIntegration === false}">
                <li class="detail">明细</li>
                <li class="amount">积分</li>
                <li class="final">操作后积分</li>
                <li class="source" v-if="isIntegration">来源账号</li>
            </ul>
        </div>

        <!--积分明细列表 begin-->
        <van-list v-model="loading" :finished="finished" @load="loadMore" :immediate-check="false" >
            <div v-for="year in yearList" v-if="yearList.length > 0">
                <div class="point-box">
                    <p class="year-line">{{ year }}</p>
                    <ul class="point-list" v-if="pointList.length > 0">
                        <li :class="[isIntegration ? 'point-item' : 'single']" v-for="item in pointList" v-if="item.purchaseTime === year">
                            <div class="detail"><p>{{ item.poinTypeName }}</p>{{ item.regTime | dateFilter}}</div>
                            <div class="value" :class="[item.pointsStr.substring(0,1) === '-' ? 'red' : '']">{{ item.pointsStr | removeFix }}</div>
                            <div class="operate">{{ item.finalPoints + item.freezePoints }}</div>
                            <div class="source" v-if="isIntegration && item.vipInfoHdId === vipInfoHdId">当前账户</div>
                            <div class="source" v-if="isIntegration && item.vipInfoHdId !== vipInfoHdId">{{ item.mobilePhone | phoneFilter }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </van-list>

        <div class="empty-content" v-if="yearList.length <= 0 && !loading">
            <p v-if="!loading">暂无积分记录~</p>
        </div>
    </div>
</template>

<script>
    import Storage from "../../util/storage";
    import { List, Toast } from 'vant';
    import { Point, UserService } from "../../api/service";
    export default {
        name: 'member-point',
        components: {
            'van-list': List,
        },
        data() {
            return {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                pointList: [],
                yearList: [],
                finalPoints: 0,
                freezePoints: 0,
                isIntegration: null,
                statusLock: false,
                loading: true,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                vipInfoHdId: Storage.get('USER_INFO').vipInfoId
            }
        },
        created() {
            // 获取会员整合的信息
            this.getRelationAccountList();

            // 滚动监听固定导航栏
            window.onscroll = function() {
                let fixedBar = document.getElementById("fixed-bar");
                let domHeight = document.getElementById("point-preview").offsetHeight;
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if (scrollTop >= domHeight) {
                    fixedBar.style.top = '0';
                }

                if (scrollTop < domHeight) {
                    fixedBar.style.top = '-150px';
                }
            }
        },
        methods: {
            // 获取会员整合的信息
            getRelationAccountList() {
                UserService.getRelationAccountList({}).then((res) => {
                    if (res && res.length > 1) {
                        this.isIntegration = true;
                    }else{
                        this.isIntegration = false;
                    }
                }).then(() => {
                    this.getPointDetail();
                    this.getPointList();
                })
            },
            // 获取积分详情
            async getPointDetail() {
                await Point.getPointTotal().then((res) => {
                    this.finalPoints = res.finalPoints;
                    this.freezePoints = res.freezePoints;
                })
            },
            // 获取积分列表
            getPointList() {
                if(this.statusLock) return
                this.statusLock = true
                if(this.finished === true) {
                    Toast('没有更多了~');
                    this.loading = false
                    return
                }

                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                };
                Point.getPointDetailList(params).then((res) => {
                    this.total = res.total;
                    if (res.total > 0){
                        if (res.list.length > 0){
                            res.list.forEach((item) => {
                                let year = item.regTime.substr(0,4);
                                item.purchaseTime = year
                                if (this.yearList.length === 0) {  // 获取时间年限
                                    this.yearList.push(year)
                                }else{
                                    for (let i=0; i<this.yearList.length; i++) {
                                        if (this.yearList[i] !== year){
                                            this.yearList.push(year)
                                        }
                                    }
                                }
                                // 年份去重
                                this.yearList = Array.from(new Set(this.yearList));
                                this.pointList.push(item);
                            })
                        }
                        if(this.pointList.length && this.pointList.length >= this.total) {  // 判断分页是否结束
                            this.finished = true
                            this.loading = false
                        }
                    }else{
                        this.finished = true
                        this.loading = false
                    }
                }).then(() => {
                    this.statusLock = false;
                    this.loading = false;
                });
            },
            // 加载更多
            loadMore () {
                if(this.finished === true) {
                    Toast('没有更多了~');
                    return false;
                }
                else{
                    this.pageNum += 1;
                    this.getPointList();
                }
            },
            // 冻结积分弹窗
            showDialog() {
                Toast({
                    message: '冻结积分暂时无法使用，\n订单确认收货后转为可用积分'
                });
            }
        },
        filters: {
            // 手机号掩码
            phoneFilter(str) {
                if(str !== undefined && str !== null){
                    return str.substring(0, 3) + '****' + str.substring(7, 11);
                }
            },
            // 日期过滤器
            dateFilter(str) {
                if (str !== undefined) {
                    return str.substring(5, 7) + '.' + str.substring(8, 10) + ' ' + str.substring(11, 13) + ':' + str.substring(14, 16);
                }
            },
            // 移除小数位
            removeFix(str) {
                if (str !== undefined && str !== null) {
                    if (str.substring(str.length - 2, str.length) === '.0') {
                        return str.substring(0, str.length -2);
                    } else {
                        return str
                    }
                }
            }
        },
        destroyed() {
            // 清空滚动事件
            window.onscroll = null
        }
    }
</script>

<style scoped lang="scss">
    .member-point {
        background: #EDF0F7;
        min-height: 100%;
        .point-preview {
            text-align: center;
            background: #fff;
            .final-point {
                color: #2BA4F3;
                font-size: computed(32);
                padding: computed(40) 0 computed(14) 0;
            }
            .freeze-point {
                color: #999999;
                font-size: computed(20);
                padding-bottom: computed(40);
                i {
                    margin-left: computed(8);
                }
            }
        }
        .point-detail {
            z-index: 100;
            width: 100%;
            .point-title{
                box-sizing: border-box;
                width: 100%;
                height: computed(88);
                padding: 0 computed(30);
                background: #EDF0F7;
                z-index: 9;
                display: flex;
                justify-content: space-between;
                li{
                    float: left;
                    font-size: computed(28);
                    line-height: computed(88);
                    color: #333333;
                    overflow: hidden;
                    text-align: left;
                    &.detail{
                        width: 20%;
                    }
                    &.amount{
                        width: 16%;
                    }
                    &.final {
                        width: 26%;
                    }
                    &.source{
                        width: 18%;
                    }
                }
                &.single{
                    display: flex;
                    flex-direction: row;
                    li{
                        &.detail {
                            width: 40%;
                        }
                        &.amount{
                            width: 30%;
                        }
                        &.final {
                            width: 22%;
                        }
                    }
                }
            }
            &.fixed {
                position: fixed;
                top: -150px;
            }
        }
        .point-box{
            background: #fff;
            position: relative;
            margin-bottom: computed(10);
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
            .point-list{
                padding: 0 computed(30);
                .point-item{
                    display: flex;
                    height: computed(110);
                    align-items: center;
                    justify-content: space-between;
                    .detail{
                        width: 20%;
                        overflow: hidden;
                        font-size: computed(20);
                        color: #999;
                        p {
                            margin-bottom: computed(10);
                            font-size: computed(24);
                            color: #0D0E09;
                        }
                    }
                    .value{
                        width: 14%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                        &.red {
                            color: #D80000;
                        }
                    }
                    .operate {
                        width: 22%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                    .source{
                        width: 24%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                }
                .single{
                    display: flex;
                    height: computed(110);
                    align-items: center;
                    justify-content: space-between;
                    .detail{
                        width: 30%;
                        overflow: hidden;
                        font-size: computed(20);
                        color: #999;
                        p {
                            margin-bottom: computed(10);
                            font-size: computed(24);
                            color: #0D0E09;
                        }
                    }
                    .value{
                        width: 20%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                    .operate {
                        width: 24%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                }
            }
        }
        .empty-content{
            width: 100%;
            text-align: center;
            font-size: computed(30);
            color: #333333;
            line-height: computed(70);
        }
    }
    /deep/.van-toast {
        text-align: center;
    }
</style>
