/*
 * @Author: wxx 
 * @Date: 2019-08-05 09:47:20 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-08-11 15:37:45
 * @description: 预约量体模块api聚合
 */


import http from '../../util/http'

/**
 * 获取预约金
 * @param config
 * var param = {
    companyId：公司Id,
    }
 * @returns {*}
 */
export const getMsrAmount = (config) => {
    return http.get('volume/getMsrAmount', config);
}

/**
 * 获取量体项目
 * @param config
 * var param = {
    companyId：公司Id,
    measureClassInfoCode: 量体品类编码
    }
 * @returns {*}
 */
export const getVolumes = (config) => {
    return http.get('volume/getVolumes', config);
}

/**
 * 获取上门量体可用地址
 * @param config
 * var param = {
    companyId：公司Id,
    usrId: 用户id,
    masterWayCode: 量体方式,
    cardNo: 会员卡号
    }
 * @returns {*}
 */
export const getDoorAddr = (config) => {
    return http.get('volume/getDoorAddr', config);
}


export const getBillType = (config) => {
    return http.get('volume/getBillType', config);
}
/**
 * 获取到店量体可用地址
 * @param config
 * var param = {
    "companyId":"公司id",
    "stateName":"省名称",
    "cityName":"市名称",
    "destName":"区名称",
    "usrId":"用户id",
    "cardNo":"会员卡号"
    }
 * @returns {*}
 */
export const getShopAddr = (config) => {
    return http.get('volume/getShopAddr', config);
}

/**
 * 获取到预约时间
 * @param config
 * var param = {
 *  ownCompanyId:
    "companyId":"公司id",
    "stateName":"省名称",
    "cityName":"市名称",
    "destName":"区名称",
    "usrId":"用户id",
    "cardNo":"会员卡号"
    }
 * @returns {*}
 */
export const getVolumeTime = (config) => {
    return http.get('volume/getVolumeTime', config);
}


/**
 * 提交预约量体
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyKey":"公司",
    "model":{
      "msrWayCode":"量体方式编码",
      "cargousrName":"联系人名字",
      "cargousrSex":"联系人性别",
      "cargoMobile":"联系电话",
      "stateName":"省名称",
      "cityName":"市名称",
      "destName":"区名称",
      "address":"地址",
      "masterWayCode":"选择量体师方式",
      "measurePresonKey":"量体师ID",
      "dptId":"预约量体店铺",
      "orderTime":"预约量体时间",
      "customMemo":"顾客要求",
      "billCode":"订单CODE",
      "cartId":"购物车的Key",
      "id":"量体工单id",
      "saleOrdDtList":[
        {
         "saleOrdDtId":"订单dtid"
        }
      ],
      "measurePersonSex":"量体师性别"
    }
    }
 * @returns {*}
 */
export const saveVolume = (config) => {
    return http.post('volume/saveVolume', config);
}

export const sendCoupons = (config) => {
    return http.post('volume/sendCoupons', config);
}


export const measureInfor = (config) => {
    return http.get('volume/measureInfor', config);
}
/**
 * 获取预约量体列表
 * @param config
 * var param = {
    * companyId：公司Id,
    * usrId: 用户id,
    * searchUsrId: 用户id,
    * statusCodes: 'MEASURE_UNFINISH',  //('MEASURE_FINISHED'表示已完成，'MEASURE_UNFINISH'表示待完成)
    pageNum: 分页页码,
    pageSize: 分页条数,
    }
 * @returns {*}
 */
export const getVolumeList = (config) => {
    return http.get('volume/getVolumeList', config);
}



export const getMeasureOpInfo = (config) => {
    return http.get('volume/getMeasureOpInfo', config);
}


/**
 * 获取会员量体数据
 * @param config
 * var param = {
    *ctmUsrId: '用户id',
    *companyId: '公司id',
    *msrModeTypeCode: 'D_ACTUALMSR' (参数为量体类型编码，D_ACTUALMSR表示实际量体，参数写死)
    dressedUsrName:'着装人姓名',
    measureClassInfoId: '量体类别',
    billCode: '版本流水号'
   }
 * @returns {*}
 */
export const getMeasureInfo = (config) => {
    return http.get('measure-master/measureInfo', config);
}
export const getDress = (config) => {
    return http.get('volume/getDress', config);
}

export const getCtmmeasure = (config) => {
    return http.get('volume/getCtmmeasure', config);
}


export const getSalemeasure = (config) => {
    return http.get('volume/getSalemeasure', config);
}


//添加着装人
export const addCtmmeasure = (config) => {
    return http.post('volume/addCtmmeasure', config);
}

/**
 * 删除我的预约
 * 
 * @param config
 * var param = {
    *ctmUsrId: '用户id',
    *companyId: '公司id',
    *msrModeTypeCode: 'D_ACTUALMSR' (参数为量体类型编码，D_ACTUALMSR表示实际量体，参数写死)
    dressedUsrName:'着装人姓名',
    measureClassInfoId: '量体类别'
   }
 * @returns {*}
 */
export const delCtmMeasure = (config) => {
    return http.delete('volume/delCtmMeasure', config);
}

//删除我的量体行记录
export const delCtmMeasureHd = (config) => {
    return http.delete('volume/delCtmMeasureHd', config);
}

export const cancelMeasure = (config) => {
    return http.put('volume/cancelMeasure', config);
}

//取消预约
export const delSaleMeasure = (config) => {
    return http.delete('volume/delSaleMeasure', config);
}

export const getMeasureType = (config) => {
    return http.get('volume/getMeasureType', config);
}

export const getSaleMeasureId = (config) => {
    return http.get('volume/getSaleMeasureId', config);
}
