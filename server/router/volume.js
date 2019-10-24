/*
 * @Author: wxx 
 * @Date: 2019-08-05 09:49:20 
 * @Last Modified by:   wxx 
 * @Last Modified time: 2019-08-05 09:49:20 
 */


const volume = require('../controller/volume');

module.exports = {
    "GET/getMsrAmount": volume.getMsrAmount,
    "GET/getVolumes": volume.getVolumns,
    "GET/getDoorAddr": volume.getDoorAddr,
    "GET/getShopAddr": volume.getShopAddr,
    "GET/getVolumeTime": volume.getRegmeasureTime,
    "POST/saveVolume": volume.saveVolume,
    "POST/sendCoupons": volume.sendCoupons,
    "GET/getVolumeList": volume.getVolumeList,
    "GET/volumeDataList": volume.getVolumeDataList,
    "GET/getMeasureType": volume.getMeasureType,
    "GET/getBillType": volume.getBillType,
    "GET/getSaleMeasureId": volume.getSaleMeasureId,
    "DELETE/delSaleMeasure": volume.delSaleMeasure,
    "PUT/cancelMeasure": volume.cancelMeasure,
    "DELETE/delCtmMeasure": volume.delCtmMeasure,
    "DELETE/delCtmMeasureHd": volume.delCtmMeasureHd,
    "GET/getSalemeasure": volume.getSalemeasure,
    "GET/getCtmmeasure": volume.getCtmmeasure,
    "GET/getDress": volume.getDress,
    "POST/addCtmmeasure": volume.addCtmmeasure,
    "GET/getMeasureOpInfo": volume.getMeasureOpInfo,
    "GET/measureInfor": volume.measureInfor
}
