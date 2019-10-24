
/*
 * createTime: 2019/7/8 10:05
 * author: wei.wang
 * description: 中间层提供给前端的基础模块api
 */

const fileSystem = require('../controller/fileSystem');

module.exports = {
    'POST/token': fileSystem.getFileSystemToken,
    'GET/getImg/': fileSystem.getImgByPath,
    'GET/getVideo/': fileSystem.getVideoByPath,
    'POST/imgUpload/': fileSystem.imgUpload,
    'POST/imgUploadDetail/': fileSystem.imgUploadDetail,
};
