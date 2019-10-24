/**
 *
 * @description: 金额后面补齐两位小数点
 * @author: junyong.hong
 * @createTime: 2018/6/27
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
export function toMoney (money = 0) {
    return parseFloat(money)
    // return money.toFixed(2)
}
