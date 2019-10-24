/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 防止按钮多次点击
 * @Date: 2019-04-17 19:06:57
 * @LastEditTime: 2019-06-27 17:11:41
 */

const fn = {
    // 事件防抖
    debounce(func, time, ctx) {
        let timer;
        let isFirstExecu = false;
        return function (...params) {
            if (!isFirstExecu) { func.apply(ctx, params) }
            isFirstExecu = true;
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(ctx, params);
            }, time);
        };
    },

    // 事件节流
    throttle(func, time, ctx) {
        var previous = 0;
        return function (...params) {
            var now = Date.now();
            if (now - previous > time) {
                func.apply(ctx, params);
                previous = now;
            }
        };
    }
};

function getFuncName(ctx) {
    return ctx.hasOwnProperty("throttle") ? "throttle" : "throttle";
}

export default {
    abstract: true,
    props: ["time", "events"],
    created() {
        this.funcName = getFuncName(this);
        this.eventKeys = this.events.split(",");
        this.originMap = {};
        this.debouncedMap = {};
    },
    render() {
        if (Object.keys(this.$slots) == 0) return;
        const vnode = this.$slots.default[0];
        this.eventKeys.forEach(key => {
            const targetFn = vnode.data.on[key];
            if (targetFn === this.originMap[key] && this.debouncedMap[key]) {
                vnode.data.on[key] = this.debouncedMap[key];
            } else if (targetFn) {
                this.originMap[key] = targetFn;
                this.debouncedMap[key] = fn[this.funcName](
                    targetFn,
                    this.time,
                    vnode
                );
                vnode.data.on[key] = this.debouncedMap[key];
            }
        });

        return vnode;
    }
};
