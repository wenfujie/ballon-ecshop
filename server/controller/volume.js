/*
 * @Author: wxx 
 * @Date: 2019-08-05 09:53:47 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-08-30 17:32:18
 * @description: 中间层提供给前端的预约量体模块api
 */


const volume = require('../model/volume');
const moment = require('moment');

class volumeController {

    // 预约量体模块-获取预约金api
    static async getMsrAmount(ctx) {
        let res = await volume.getMsrAmountValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 预约量体模块-获取量体项目api
    static async getVolumns(ctx) {
        let res = await volume.getVolumnsValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 预约量体模块-获取预约上门量体可用地址api
    static async getDoorAddr(ctx) {
        let res = await volume.getDoorAddrValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 预约量体模块-获取到店量体可用地址api
    static async getShopAddr(ctx) {
        let res = await volume.getStoreListValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 预约量体模块-获取量体时间api
    static async getRegmeasureTime(ctx) {
        let res = await volume.getRegmeasureTimeValue(ctx, ctx.params);
        let currentDate = new Date()
        let currentTime = new Date(moment(currentDate).format('YYYY-MM-DD')).getTime()
        for (let l = 0; l < res.data.length; l++) {
            if (currentTime > new Date(res.data[l].ymd).getTime()) {
                res.data.splice(l, 1)
                --l;
            } else if (currentTime == new Date(res.data[l].ymd).getTime()) {
                for (let m = 0; m < res.data[l].hourList.length; m++) {
                    let time = moment(res.data[l].ymd + ' ' + res.data[l].hourList[m]).format('YYYY-MM-DD HH:mm')
                    if (currentDate.getTime() > new Date(time).getTime()) {
                        res.data[l].hourList.splice(m, 1)
                        --m;
                    }
                }
                if (res.data[l].hourList.length <= 0) {
                    res.data.splice(l, 1)
                    --l;
                }
            }
        }
        res.data[0].newDate = currentDate
        res.data[0].newTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss')
        res.data[0].currentTime = new Date(moment(currentDate).format('YYYY-MM-DD HH:mm:ss'))
        ctx.body = res.data;
    }
    // 预约量体模块-提交预约量体api
    static async saveVolume(ctx) {
        let res = await volume.saveRegMeasureValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 赠送促销卡券
    static async sendCoupons(ctx) {
        let res = await volume.sendCoupons(ctx, ctx.params);
        ctx.body = res;
    }

    // 预约量体模块-获取量体列表api
    static async getVolumeList(ctx) {
        let res = await volume.getVolumeList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询预约量体信息(GS_MSR_GETREGMEASUREINFO)
    static async getVolumeDataList(ctx) {
        let res = await volume.getVolumeDataList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 根据商品ids过滤会员量体数据
    static async getMeasureType(ctx) {
        let res = await volume.getMeasureTypeValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 查询订单信息
    static async getBillType(ctx) {
        let res = await volume.getBillTypeValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取支付cardbillcode
    static async getSaleMeasureId(ctx) {
        let res = await volume.getSaleMeasureIdValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 删除我的预约
    static async delSaleMeasure(ctx) {
        let res = await volume.delSaleMeasureValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 取消我的预约
    static async cancelMeasure(ctx) {
        let res = await volume.cancelMeasure(ctx, ctx.params);
        ctx.body = res;
    }

    // 删除我的量体明细
    static async delCtmMeasure(ctx) {
        let res = await volume.delCtmMeasure(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 删除我的列表行数据
    static async delCtmMeasureHd(ctx) {
        let res = await volume.delCtmMeasureHd(ctx, ctx.params);
        ctx.body = res;
    }

    // 根据订单获取预约工单
    static async getSalemeasure(ctx) {
        let res = await volume.getSalemeasure(ctx, ctx.params);
        res.data.info = res.data.statusCode
        delete res.data.statusCode
        ctx.body = res.data;
    }

    // 获取静态量体数据
    static async getCtmmeasure(ctx) {
        let res = await volume.getCtmmeasure(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 选择着装人获取可用量体数据
    static async getDress(ctx) {
        let res = await volume.getDress(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 添加量体人数据
    static async addCtmmeasure(ctx) {
        let res = await volume.addCtmmeasure(ctx, ctx.params);
        ctx.body = res.data;
    }

    static async getMeasureOpInfo(ctx) {
        let res = await volume.getMeasureOpInfo(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 选择着装人查看量体明细
    static async measureInfor(ctx) {
        let res = await volume.measureInfor(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取量体项目(性能调优标识)
    static async getHistoryMeasureData(ctx) {
        let res = await volume.getVolumnsValue(ctx, ctx.params);
        ctx.body = res.data;
    }
}

module.exports = volumeController;
