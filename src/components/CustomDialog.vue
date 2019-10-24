/*
* createTime：2019/8/29
* author：fujie.wen
* description: 定制信息弹窗 （有引用父级：购物车、结算页、订单详情）
*/
<template>
    <div class="container" @click.stop>

        <ul class="detail">
            <!-- 主面料 -->
            <li v-if="mainFabricName">主面料—{{mainFabricName}}</li>

            <!-- 部件信息 -->
            <li v-for="(item,index) in partList">
                {{item.partName}}—{{item.fabricName}}
            </li>

            <!-- 绣花 -->
            <li class="emb-print-part" v-for="(item,index) in embList.embpt">
                <div>
                    <span>绣花—{{item.regionName}}</span>
                    <p v-if="!!item.embprice">￥{{item.embprice | $goldDivide}}</p>
                </div>
                <img :src="getImg(item.embFileUrl, '60*60')" onerror="errImg(event)">
            </li>

            <!-- 印花 -->
            <li class="emb-print-part" v-for="(item,index) in embList.print">
                <div>
                    <span>印花—{{item.regionName}}</span>
                    <p v-if="!!item.prtprice">￥{{item.prtprice | $goldDivide}}</p>
                </div>
                <img :src="getImg(item.embPrintPictUrl, '60*60')" onerror="errImg(event)">
            </li>

            <!-- 绣字 -->
            <li class="emb-part" v-for="(item,index) in embList.emb">
                <p>绣字—{{item.regionName}}</p>
                <p>
                    <span>{{item.fontsName}}:</span>
                    <span :style="{color: item.colorNumberHx}">{{item.content}}</span>
                </p>
                <p v-if="!!item.embprice">￥{{item.embprice | $goldDivide}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
        }
    },
    props: {
        // 部件信息
        partList: {
            type: Array,
            default: []
        },
        // 主面料名称
        mainFabricName: {
            type: String,
            default: ''
        },
        // 父页面 shoppingCart(购物车)  orderSettle(结算页)
        fromPage: {
            type: String,
            default: ''
        }
    },
    computed: {//rtlCartDttPrintDto
        // 定制列表
        embList() {
            let data = {
                emb: [],//绣字
                embpt: [],//绣花
                print: []// 印花
            };
            console.log(this.partList,'partListpartList')
            this.partList.forEach(item => {
                if (this.fromPage === 'shoppingCart') {
                    this.$set(item,'salePrice',item.price)
                    this.$set(item,'fabricName',item.fabricname)
                    this.$set(item,'partName',item.partname)
//                    item.salePrice = item.price;
//                    item.fabricName = item.fabricname;
//                    item.partName = item.partname;
                    if (item.rtlCartDttEmbDto) {
                        item.rtlCartDttEmbDto.regionName = item.regionName;
                        item.rtlCartDttEmbDto.fontsName = item.rtlCartDttEmbDto.ictEmbFontsHdName;
                        item.rtlCartDttEmbDto.content = item.rtlCartDttEmbDto.embValue;
                        item.rtlCartDttEmbDto.embprice = item.rtlCartDttEmbDto.salePrice;
                        data.emb.push(item.rtlCartDttEmbDto);
                    }
                    if (item.rtlCartDttEmbptDto) {
                        item.rtlCartDttEmbptDto.regionName = item.regionName;
                        item.rtlCartDttEmbptDto.embFileUrl = item.rtlCartDttEmbptDto.fileUrl;
                        item.rtlCartDttEmbptDto.embprice = item.rtlCartDttEmbptDto.salePrice;
                        data.embpt.push(item.rtlCartDttEmbptDto);
                    }
                    if (item.rtlCartDttPrintDto) {
                        item.rtlCartDttPrintDto.regionName = item.regionName;
                        item.rtlCartDttPrintDto.embPrintPictUrl = item.rtlCartDttPrintDto.fileUrl;
                        item.rtlCartDttPrintDto.prtprice = item.rtlCartDttPrintDto.salePrice;
                        data.print.push(item.rtlCartDttPrintDto);
                    }
                } else if (this.fromPage === 'orderSettle') {
                    if (item.emb.length) {
                        item.emb[0].regionName = item.regionName;
                        data.emb.push(item.emb[0]);
                    }
                    if (item.ept.length) {
                        item.ept[0].regionName = item.regionName;
                        data.embpt.push(item.ept[0]);
                    }
                    if (item.prt.length) {
                        item.prt[0].regionName = item.regionName;
                        data.print.push(item.prt[0]);
                    }
                } else {

                    if (!!item.emb && item.emb.length) {    //绣字
                        item.emb[0].regionName = item.regionName;
                        item.emb[0].fontsName = item.emb[0].ictEmbfontsHdName
                        item.emb[0].embprice = item.emb[0].price
                        data.emb.push(item.emb[0]);
                    }
                    if (!!item.embPrint && item.embPrint.length) {    // 绣花
                        item.embPrint[0].regionName = item.regionName;
                        item.embPrint[0].embprice = item.embPrint[0].price;
                        item.embPrint[0].embFileUrl = item.embPrint[0].embPrintPictUrl
                        data.embpt.push(item.embPrint[0]);
                    }
                    if (!!item.prtPrint && item.prtPrint.length) {    // 印花
                        item.prtPrint[0].regionName = item.regionName;
                        data.print.push(item.prtPrint[0]);
                    }
                }

            })

            console.log('即将打印data=====》',data)
            return data;
        },
    },
    methods: {},
    created() {
    }
}
</script>

<style scoped lang="scss">
    .detail{
        margin-top: computed(30);
        /*border-top: 1px solid #CCCCCC;*/
        li{
            font-size:computed(24);
            color:rgba(51,51,51,1);
            padding: computed(9) 0;
            &.emb-print-part{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                img{
                    width:computed(60);
                    height:computed(60);
                    border:1px solid rgba(204,204,204,1);
                    border-radius:50%;
                }
            }
            &.emb-part{
                p:nth-child(2){
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    span:nth-child(1) {
                        color: #666666;
                        font-size:computed(20);
                        width: computed(169);
                    }
                    span:nth-child(2) {
                        flex: 1;
                        text-align: right;
                        word-break: keep-all;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
            &:first-child{
                margin-top: computed(21);
            }
        }
    }
</style>
