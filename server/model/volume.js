/*
 * @Author: wxx 
 * @Date: 2019-08-05 09:51:34 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-08-13 19:59:42
 * @description: 预约量体模块用于处理前端请求的中间层接口
 */


class userVolume {

    //  获取预约金
    static async getMsrAmountValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-parameters-vips/order-amount', params).then((res) => {
            return res
        });
    }

    //  获取量体项目(性能调优标识)
    static async getVolumnsValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + ctx.optimizeFlag + '/measure-hds/info-code-list', params).then((res) => {
            return res
        });
    }

    static async getMeasureOpInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods-list/getMeasureOpInfo', params).then((res) => {
            return res
        });
    }


    //  根据商品ids过滤会员量体数据
    static async getMeasureTypeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hds/measure-type', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  删除我的预约
    static async delSaleMeasureValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/salemeasure-hds', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  取消我的预约
    static async cancelMeasure(ctx, params) {
        let url = `/salemeasure-hds/update-status?companyId=${params.companyId}&usrId=${params.usrId}&id=${params.id}&statusCode=${params.statusCode}`
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            console.log(res, 'cancelMeasurecancelMeasurecancelMeasurecancelMeasurecancelMeasurecancelMeasure')
            return res
        });
    }

    static async delCtmMeasure(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-dt-msrtypes', params, ctx.headers).then((res) => {
            return res
        });
    }

    static async delCtmMeasureHd(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hds', params, ctx.headers).then((res) => {
            return res
        });
    }
    // 查询订单信息(修改netty接口)
    static async getBillTypeValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/sale-ctm-measure-aggregates/' + params.ordHdCode + '/dt-ord-list', params, ctx.headers).then((res) => {
            return res
        });
    }
    //  获取支付cardbillcode

    static async getSaleMeasureIdValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ord-level-hds/sale-measure-id', params).then((res) => {
            return res
        });
    }


    //  获取预约/上门量体可用地址
    static async getDoorAddrValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/measure-dest-aggregats/dest-list', params, ctx.headers).then((res) => {
            return res
        });
    }
    //  获取到店量体可用地址
    static async getStoreListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-shop-list-aggregats/shop-list', params, ctx.headers).then((res) => {
            return res
        });
        //  一期暂时使用以下代码
        // return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-shop-list-aggregats/shop-list2', params).then((res) => {
        //     return res
        // });
    }
    //  获取预约量体时间
    static async getRegmeasureTimeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-aggregats/measure-time', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  提交预约量体
    static async saveRegMeasureValue(ctx, params) {
        let url = '/salemeasure-hds/sp-interface?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }


    //  选择着装人获取可用量体数据
    static async getDress(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hd-aggregates/msrtype/part-class', params, ctx.headers).then((res) => {
            return res
        });
    }
    //  获取静态量体数据
    static async getCtmmeasure(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/ctmmeasure-hd-aggregates/msrtype/measure-data', params, ctx.headers).then((res) => {
            return res
        });
    }
    //  根据订单获取预约工单
    static async getSalemeasure(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/salemeasure-hds/ord-dt-id', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  添加量体人数据
    static async addCtmmeasure(ctx, params) {
        let url = `/ctmmeasure-hds/binding-ord-by-ctmmeasure?companyId=${params.companyId}&usrId=${params.usrId}`
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params, ctx.headers).then((res) => {
            return res
        });
    }
    //  选择着装人查看量体明细
    static async measureInfor(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-ord-dts/measure-detail', params, ctx.headers).then((res) => {
            return res
        });
    }

    //  赠送促销卡券
    static async sendCoupons(ctx, params) {
        let url = '/rtl-online-result-dt-coupons/send-coupons?billCode=' + params.billCode + '&usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + ctx.optimizeFlag + url, params).then((res) => {
            return res
        });
    }

    //  提交预约量体
    // static async saveRegMeasureValue(ctx, params) {
    //     let url = '/salemeasure-hds/sp-interface?usrId=' + params.usrId + '&companyId=' + params.companyId
    //     return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
    //         return res
    //     });
    // }

    // 获取历史量体数据
    static async getHistoryMeasureData(ctx, params) {
        let url = '/rtl-ord-dttt-msrs/get-hist-measure-batch?usrId=' + params.usrId + '&companyId=' + params.companyId;
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
    }

    // 查询预约量体信息
    static async getVolumeList(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + ctx.optimizeFlag + '/salemeasure-hds/page-measure-info', params, ctx.headers).then((res) => {
            return res
        });
    }
    //查询预约量体信息(GS_MSR_GETREGMEASUREINFO)
    static async getVolumeDataList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hd-aggregates/measure-data', params).then((res) => {
            return res
        });
    }

}

module.exports = userVolume
