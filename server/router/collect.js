/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的收藏模块api
 */

const collect = require('../controller/collect');

module.exports = {
    "GET/getCollectionList": collect.getCollectionList,
    "POST/addCollection": collect.addCollection,
    "DELETE/deleteCollection": collect.deleteCollection
};
