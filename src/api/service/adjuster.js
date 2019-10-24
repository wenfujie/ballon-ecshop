/*
* createTime：2019/2/18
* author：zhibin.zhao
* description: 售后模块api
*/

import http from '../../util/http'


// 取消售后申请单
export const cancelApply = (config) => { return http.put('postSale/cancelApply', config); }

// 取消售后申请单
export const getGoodsForChange = (config) => { return http.get('postSale/getGoodsForChange', config); }

