<style lang='scss' scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.3);
    transition: all 0.5 ease;
    .laycontent {
        height: 250px;
        width: 100%;
        background: #fff;
    }
}
.picker-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: computed(10) computed(20) !important;
    box-sizing: border-box;
    .picker-choose {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
    }
    .picker-content {
        flex: 1;
        position: relative;
        height: 80%;
        overflow: hidden;
        padding-top: computed(20);
        .wheel-wrapper {
            flex: 1;
            display: flex;
            justify-content: center;
            width: 100%;
            height: 160px;
            text-align: center;
            .wheel {
                width: 100%;
                height: 100%;
                overflow: hidden;
                font-size: computed(32);
                .wheel-scroll {
                    padding: 0;
                    margin-top: 80px;
                    list-style: none;
                    .wheel-item {
                        padding: computed(10) 0;
                        list-style: none;
                        overflow: hidden;
                        white-space: nowrap;
                        color: #cccccc;
                    }
                    .active {
                        color: #2ba4f3;
                    }
                }
            }
        }
        .scroll-wrapper {
            position: absolute;
            top: 0px;
            right: 0px;
            bottom: 0px;
            height: 100%;
            overflow: hidden;
            font-size: computed(32);
            .scroll-view {
                padding: 0;
                list-style: none;
                .scroll-item {
                    color: #cccccc;
                    list-style: none;
                    padding: 5px 10px;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .active {
                    color: #2ba4f3;
                }
            }
        }
    }
}
</style>

<template>
    <div class="overlay" @click.prevent="close()" @touchmove.prevent="noop()">
        <div class="laycontent">
            <div class="picker-panel" @click.stop>
                <!-- 头部 -->
                <div class="picker-choose pdLr10">
                    <i class="iconfont icon-shanchuguanbi fs40B" @click="close()"></i>
                    <p class="fs28"></p>
                    <i class="iconfont icon-queding blue fs40B" @click="makeSure()"></i>
                </div>
                <!-- 内容 -->
                <div class="picker-content">
                    <!-- 文字内容 -->
                    <div class="wheel-wrapper" ref="wheelWrapper">
                        <div class="wheel">
                            <ul class="wheel-scroll">
                                <li
                                    v-for="(item,$index) in leftData"
                                    class="wheel-item fs36B"
                                    :key="$index"
                                    :class="{active:selectedIndex===$index}"
                                >{{item[label]}}</li>
                            </ul>
                        </div>
                    </div>
                    <!-- 联动字母 -->
                    <div class="scroll-wrapper" ref="scrollWrapper" v-if="rightData">
                        <ul class="scroll-view">
                            <li
                                v-for="(code,$index) in rightData"
                                :key="$index"
                                @click="reflect($index,code.reflectIndex)"
                                class="scroll-item fs32"
                                :class="{active:sideIndex===$index}"
                            >{{code.value}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import check from "@/util/check";
export default {
    name: "WheelPicker",
    props: {
        data: {},
        label: {
            type: String,
            default: "name"
        },
        confirm: {
            type: Function
        },
        show: {
            default: false
        }
    },
    data() {
        return {
            leftData: [],
            rightData: [],
            selectedIndex: 0,
            sideIndex: 0,
            seletedModel: {},
            showlayer: this.show
        };
    },

    methods: {
        noop() {},
        // 初始化轮转
        initWheel() {
            let wheelWrapper = this.$refs.wheelWrapper;
            if (!this.wheel) {
                this.wheel = new BScroll(wheelWrapper.children[0], {
                    preventDefault: true,
                    wheel: {
                        selectedIndex: this.selectedIndex,
                        rotate: 25,
                        adjustTime: 400,
                        /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
                        wheelWrapperClass: "wheel-scroll",
                        wheelItemClass: "wheel-item"
                    },
                    probeType: 3
                });
                this.wheel.on("scrollEnd", () => {
                    this.selectedIndex = this.wheel.getSelectedIndex();
                    this.sideIndex = this.leftData[this.selectedIndex].index;
                    this.seletedModel = this.leftData[this.selectedIndex];
                    this.sideScroll.wheelTo(this.sideIndex);
                });
            } else {
                this.wheel.refresh();
            }
        },
        // 初始化侧边滚动
        initSideScroll() {
            if (this.$refs.scrollWrapper) {
                if (!this.sideScroll) {
                    this.sideScroll = new BScroll(this.$refs.scrollWrapper, {
                        preventDefault: false,
                        probeType: 3
                    });
                } else {
                    this.sideScroll.refresh();
                }
                // console.log("scroll", this.sideScroll);
            }
        },
        // 初始化数据
        initData() {
            if (this.data instanceof Array) {
                this.leftData = this.data;
            } else {
                let dataLength = 0; //存储数据总长度
                let keys = Object.keys(this.data);
                keys.forEach((key, index) => {
                    // 构建左侧数据
                    this.data[key].forEach(item => {
                        item.index = index;
                        this.leftData.push(item);
                    });
                    //构建右边数据
                    dataLength = dataLength + this.data[key].length;
                    let obj = {};
                    obj.value = key;
                    if (index === 0) {
                        obj.reflectIndex = 0;
                    } else {
                        obj.reflectIndex = dataLength - this.data[key].length;
                    }
                    this.rightData.push(obj);
                });
            }
            this.seletedModel = this.leftData[0];
        },
        // 点击右侧字母,定位到左侧以该字母为首字母的第一个选项
        reflect(selectIndex, pointer) {
            this.$nextTick(() => {
                if (!this.wheel.isInTransition) {
                    this.sideIndex = selectIndex;
                    this.wheel.wheelTo(pointer);
                    this.selectedIndex = pointer;
                    this.seletedModel = this.leftData[pointer];
                    this.initWheel();
                }
            });
        },
        //
        close() {
            this.updateState();
        },
        // 确认
        makeSure() {
            // this.updateSelectModel();
            if (this.confirm) {
                this.confirm(this.seletedModel);
            }
            this.updateState();
        },
        // 初始化
        init() {
            this.$nextTick(() => {
                this.initData();
                this.initWheel();
                this.initSideScroll();
                this.showlayer = this.show;
            });
        },
        // 更新弹窗展示状态
        updateState() {
            this.showlayer = false;
            this.$emit("update:show", this.showlayer);
        },
        // 更新选中数据
        updateSelectModel() {
            this.$emit("update:seletedmodel", this.seletedModel);
        }
    },
    created() {
        this.init();
    },
    watch: {
        show: function(val) {
            // this.showlayer = val;
            this.init();
        },
        data: function(list) {
            console.log("dataList", typeof list, list);
            this.init();
        }
    }
};
</script>