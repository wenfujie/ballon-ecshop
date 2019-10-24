/**
 * createTime: 2018/9/10 17:06
 * author: zhibin.zhao
 * description:
 */
import Storage from './storage.js'
class filters {
    static imgFilter (fileUrl, imageSize) {
        if(!!fileUrl) {
            if (/(png|jpe?g)$/.test(fileUrl)) {
                return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('COMPANYID').company_id)
            } else {
                let imageUrl = (baseConstant.ossOpenUrl || Storage.get('properties').ossOpenUrl) + fileUrl
                if (imageSize) {
                    imageUrl += '?imageSize=' + imageSize
                }
                return imageUrl
            }
        } else {
            return global.errImg
        }
        // return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('COMPANYID').company_id)

        // return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=239")
    }
    static videoFilter (fileUrl) {
        // return baseConstant.serverUrl + "file-system/getVideo?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('USER_INFO').companyId)
        return baseConstant.serverUrl + "file-system/getVideo?" + ("fileUrl=" + fileUrl + "&companyId=" + Storage.get('COMPANYID').company_id)
            // + "&random=" + Math.random()
    }
    static getShareImg (fileUrl, companyId) {
        return baseConstant.serverUrl + "file-system/getImg?" + ("fileUrl=" + fileUrl + "&companyId=" + companyId)
    }
}
export default filters
