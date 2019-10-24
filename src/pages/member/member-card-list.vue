/*
* createTime：2018/8/1
* author：en.chen
* description: 会籍会员卡列表页面
*/
<template>
    <div>
        <p class="title">购买会籍卡，享受会籍会员专属特权</p>
        <!--会籍会员卡列表 begin-->
        <ul class="card-list">
            <li v-for="item in cardList">
                <div
                    class="card-box black-bg"
                    :style="{ background : (item.vipCardImage!== null ? 'url('+ getImg(item.vipCardImage, '345*101') +')' : '') }"
                >{{item.cardLevelName}}</div>
                <p class="price">售价： ￥{{item.cardAmount}}</p>
                <div class="privilege-box">
                    <p
                        class="privilege-label"
                    >特权：{{item.vipDiscount.indexOf('10.')==-1? item.vipDiscount: '无'}}</p>
                    <div class="detail-btn" @click="goDetail(item.cardLevelCode)">查看详情></div>
                </div>
            </li>
        </ul>
        <!--会籍会员卡列表 end-->
    </div>
</template>
<script>
import { List, Toast } from "vant";
import Storage from "../../util/storage";
import { UserService } from "../../api/service";
export default {
    components: {
        "van-list": List
    },
    data() {
        return {
            cardList: []
        };
    },
    methods: {
        getList() {
            let data = {
                busContsCode: baseConstant.busContsCode,
                shopCode: Storage.get("properties").shopCode
            };
            UserService.getCardLevelList(data).then(res => {
                this.cardList = res;
                console.log(this.cardList, "cccc");
            });
        },
        goDetail(code) {
            this.$router.push("/member-card-detail?code=" + code);
        }
    },
    created() {
        this.getList();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.title {
    margin: 0 computed(30);
    padding: computed(28) 0;
    font-size: computed(28);
    line-height: computed(30);
    color: #1b1a1f;
}
.card-list {
    li {
        margin: 0 computed(16);
        padding: computed(28) computed(14) computed(50);
        box-sizing: border-box;
        position: relative;
        border-top: solid computed(1) #cccccc;
        font-size: computed(32);
        line-height: computed(34);
        .card-box {
            width: 100%;
            height: computed(202);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: computed(40);
            line-height: computed(40);
            -webkit-border-radius: computed(16);
            -moz-border-radius: computed(16);
            border-radius: computed(16);
            overflow: hidden;
            color: #ffffff;
            font-weight: 600;
            background-size: contain;
            background-position: top left;
        }
        .black-bg {
            background: repeating-linear-gradient(
                135deg,
                RGBA(69, 69, 69, 0.9),
                RGBA(69, 69, 69, 1) 25%,
                RGBA(109, 109, 109, 1) 20%
            );
        }
        .price {
            margin-top: computed(28);
        }
        .privilege-box {
            margin-top: computed(28);
            position: relative;
            .privilege-label {
                max-width: computed(400);
                float: left;
                word-break: keep-all;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .detail-btn {
                float: right;
                font-size: computed(28);
                color: #999999;
            }
        }
        .privilege-box::after {
            content: "";
            display: table;
            clear: both;
        }
    }
}
</style>
