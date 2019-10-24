
<template>
    <div class="empty-box">
        <p>{{emptyText}}</p>
    </div>
</template>
<script>
export default {
    name: "Empty",
    props: {
        emptyText: {
            type: String,
            default: "当前暂无数据~"
        }
    },
    data() {
        return {};
    },
    methods: {},
    created() {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
.empty-box {
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    background: url("../assets/images/common/empty.png") no-repeat center 20%;
    background-size: 40%;
    font-size: $font-common;
    line-height: 1;
    color: $text-secondary;
}
</style>