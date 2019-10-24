/*
 * @Author: yongtian.hong
 * @Date: 2018-10-19 10:35:35
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-10-19 10:41:49
 * @Description: 第三方相关接口
 */

class thirdParty {
    // 获取物流信息
    static getLogis(vm, params) {
        return vm.$post('third-party/getLogis', params)
    }
}

export default thirdParty
