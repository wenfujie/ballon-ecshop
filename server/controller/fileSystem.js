
/*
 * createTime: 2019/7/8 10:07
 * author: wei.wang
 * description: 中间层提供给前端的基础模块api
 */

const fileSystem = require('../model/fileSystem');

class fileSystemController {

    static async getFileSystemToken(ctx) {
        let res = await fileSystem.getFileSystemToken(ctx, ctx.params);
        ctx.body = res;
    }

    static async getImgByPath(ctx) {
        let res = await fileSystem.getImgByPath(ctx, ctx.params);
        ctx.body = res.data;
    }

    static async getVideoByPath(ctx) {
        let res = await fileSystem.getVideoByPath(ctx, ctx.params);
        ctx.set(res.headers)
        ctx.body = res.data;
    }

    static async imgUpload(ctx) {
        let res = await fileSystem.imgUpload(ctx, ctx.params);
        ctx.body = res;
    }
    static async imgUploadDetail(ctx) {
        let res = await fileSystem.imgUploadDetail(ctx, ctx.params)
        ctx.body = res
    }
}

module.exports = fileSystemController;
