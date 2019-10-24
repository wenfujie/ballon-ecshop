<!--
 * @Author: lan.chen
 * @Date: 2019-07-01 09:34:12
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-24 14:42:14
 * @Description: 账号整合
 -->

<template>
    <div class="member-integtate">
        <member-merge-form ref="mergeForm" @changeList="changeList"></member-merge-form>
    </div>
</template>
<script>
import { UserService } from "../../api/service";
import Storage from "../../util/storage";
import MemberMergeForm from "@/pages/merge/memberMergeForm.vue";

export default {
    components: {
        MemberMergeForm
    },
    data() {
        return {
            memberList: []
        };
    },
    methods: {
        // 会员整合弹窗 列表值改变事件
        changeList(list) {
            if (list && list.length) {
                // this.$refs.mergeDialog.dialogVisibleState();
            } else {
                // this.$refs.mergeDialog.dialogVisibleState(false);
            }
        }
    },
      mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                window.scrollTo(0, 1);
            });
        }, 0);
    },
    created() {}

};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.member-information {
    padding-bottom: computed(140);
}

.title {
    padding: computed(60) 0;
    font-size: computed(30);
    text-align: center;
}

.fix-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: computed(30) 0;
    width: 100%;
    z-index: 10;
    background: #fff;
}

.van-cell {
    margin-bottom: computed(30);
}

.user-img {
    width: computed(80);
    height: computed(80);
    float: right;
    border-radius: 50%;
    overflow: hidden;

    img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
.user-img-cell {
    line-height: computed(80);
}

.picker-fixed {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 11;
}

.masks {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
    z-index: 10;
}

.title-hr {
    width: 92%;
    margin: computed(28) 4% 0;
    padding: 0;
    border-top: 4px solid $blackcolor;
    border-bottom: 4px solid $blackcolor;
    border-right: 0;
    border-left: 0;
    display: inline-block;
}
.member-information .van-field .van-cell__title .van-cell--required {
    line-height: computed(60);
}
.unit-name {
    position: absolute;
    top: 0;
    right: computed(16);
    font-size: computed(30);
    line-height: computed(60);
    color: #d2d2d2;
    z-index: 1;
}
.van-radio {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 40px;
    span {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        float: right;
        img {
            width: 50px;
        }
        span {
            line-height: 50px;
            margin-left: 4px;
        }
    }
}
.van-checkbox {
    img {
        width: 50px;
    }
}
</style>
