/*
 * @Author: yongtian.hong
 * @Date: 2018-09-29 21:22:27
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-30 16:47:29
 * @Description: 数据类型与空数据校验
 */
class check {

    static typeOf(target) {
        return ({}).toString.call(target).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    static isObject(target) {
        return this.typeOf(target) === "object" ? true : false;
    }
    static isNumber(target) {
        return this.typeOf(target) === "number" ? true : false;
    }
    static isArray(target) {
        return this.typeOf(target) === "array" ? true : false;
    }
    static isBoolean(target) {
        return this.typeOf(target) === "boolean" ? true : false;
    }
    static isRegexp(target) {
        return this.typeOf(target) === "regexp" ? true : false;
    }
    static isJson(target) {
        return this.typeOf(target) === "json" ? true : false;
    }
    static isString(target) {
        return this.typeOf(target) === "string" ? true : false;
    }
    static isMath(target) {
        return this.typeOf(target) === "math" ? true : false;
    }
    static isDate(target) {
        return this.typeOf(target) === "date" ? true : false;
    }
    static isError(target) {
        return this.typeOf(target) === "error" ? true : false;
    }
    static isEmpty(target) {
        if (target === null) {
            return true;
        } else if (typeof target === 'undefined') {
            return true;
        } else if (this.isArray(target) || this.isString(target)) {
            return target.length === 0 ? true : false
        } else if (this.isObject(target)) {
            return Object.keys(target).length === 0 ? true : false
        }
    }
}

export default check