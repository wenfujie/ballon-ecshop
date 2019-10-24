/**
 *
 * @description: 动态插入百度地图引用地址
 * @author: junyong.hong
 * @createTime: 2018/8/1
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
export function MP(ak) {
    return new Promise(function (resolve, reject) {
        let script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init"
        script.onerror = reject
        document.head.appendChild(script)

        window.init = function () {
            resolve(BMap)
        }
    })
}
