<style lang='scss' scoped>
</style>

<template>
    <van-popup v-model="show" position="top" show-toolbar="true">
        <van-picker
            v-if="show"
            :value-key="labelKey"
            :show-toolbar="true"
            :columns="listData"
            :default-index="sIndex"
            @confirm="onConfirm"
            @cancel="onCancel"
        ></van-picker>
    </van-popup>
</template>

<script>
import { Popup, Picker } from "vant";
export default {
    components: {
        "van-popup": Popup,
        "van-picker": Picker
    },
    props: {
        value: [Boolean],
        listData: [Array, Object],
        labelKey: String,
        defaultIndex: {
            type: [String, Number],
            default: 0
        }
    },
    data() {
        return {
            show: this.value,
            sIndex: +this.defaultIndex
        };
    },
    methods: {
        //
        onConfirm(value, index) {
            this.sIndex = index;
            this.$emit("input", false);
            this.$emit("confirm", value, index);
        },
        //
        onCancel() {
            this.$emit("input", false);
        },
        //设置默认选中
        setDefault(index) {}
    },
    watch: {
        value: function(newVal) {
            this.show = newVal;
        },
        show: function(val) {
            if (!val) {
                this.$emit("input", val);
            }
        }
    }
};
</script>