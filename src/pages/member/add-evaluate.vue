<!--
 * @Author: lan.chen
 * @Date: 2019-08-14 16:41:10
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-15 15:32:54
 * @Description: 追加评论
 -->
<template>
    <div class="order-evaluate">
        <div class="order-item" v-for="(item,index) in evaluateForm" :key="index">
            <div class="evaluate-content">
                <img v-lazy="getImg(item.thumb)" />
                <div class="goods-detail">
                    <h3>{{item.goodsName}}</h3>
                    <p>{{item.colorName}} /{{item.sizeName}}</p>
                </div>
                <textarea
                    class="evaluate-text"
                    :rows="6"
                    placeholder="点击输入评价内容"
                    maxlength="150"
                    @input="forceUpdate"
                    v-model="item.commentMemo"
                ></textarea>
                <!-- <div class="upLoad-box">
                    <div class="upLoad-title">
                        <span>上传图片</span>
                        <span>支持最多上传5张</span>
                    </div>
                    <div class="img-group">
                        <van-uploader
                            class="img-box upload-box flex-center"
                            :before-read="beforeRead"
                            multiple
                            :after-read="(file) => afterRead(file, item)"
                            :style="{'display':item.commentPictList&&item.commentPictList.length>=5?'none':''}"
                        >
                            <div class="flex-center w100 h100">
                                <i class="iconfont icon-tupiantianjia"></i>
                            </div>
                        </van-uploader>
                        <div
                            class="img-box box-border"
                            v-for="(img, imgIndex) in item.commentPictList"
                            :key="imgIndex"
                        >
                            <img
                                v-lazy="getImg(img.fileUrl)"
                                onerror="errImg(event)"
                                @click="showPreviewDialog(img.fileUrl)"
                            />
                            <i class="iconfont icon-shanchu" @click="removePreview(item, imgIndex)"></i>
                        </div>
                    </div>
                </div> -->
                <upload-file v-model="item.commentPictList"></upload-file>
            </div>
            <div class="gray"></div>
        </div>
        <div class="submit-btn" @click="submitEvaluate">提交</div>

        <!--大图预览弹窗-->
        <van-popup
            v-model="showBigPic"
            :overlay="true"
            class="enlarge-detail"
            @click="showBigPic=false"
        >
            <img :src="getImg(previewImg)" onerror="errImg(event)" @click="showBigPic=false" />
        </van-popup>
    </div>
</template>

<script>
import { Order } from "../../api/service";
import Storage from "../../util/storage";
import { Toast, Icon, Popup } from "vant";
import uploadFile from "@/components/uploadFile";
export default {
    name: "order-evaluate",
    components: {
        // "van-uploader": Uploader,
        "van-icon": Icon,
        "van-popup": Popup,
        uploadFile
    },
    data() {
        return {
            loading: false,
            btnLock: false,
            previewImg: null,
            evaluateForm: [],
            billCode: "", //订单号
            showBigPic: false //是否显示大图
        };
    },
    created() {
        this.billCode = this.$route.query.billCode;
        // this.billCode = "BLZD001201908151306471135675";
        this.getEvaluateList();
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                window.scrollTo(0, 1);
            });
        }, 0);
    },
    methods: {
        // 根据订单编号获取待追评列表
        async getEvaluateList() {
            this.loading = true;
            let params = {
                busContsCode: baseConstant.busContsCode,
                companyId: Storage.get("COMPANYID").company_id,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                billCode: this.billCode
            };
            await Order.getOrderEvaluateList(params).then(res => {
                this.evaluateForm = res;
                this.loading = false;
            });
            // 创建本地变量存储
            this.evaluateForm.forEach(item => {
                item.commentMemo = "";
                item.commentPictList = [];
            });
            this.forceUpdate();
        },
        // 返回布尔值
        beforeRead(file) {
            if (
                file.type == "image/png" ||
                file.type == "image/jpeg" ||
                file.type == "image/jpg" ||
                file.type == "image/bmp"
            ) {
                // 大小校验
                const isLt4M = file.size / 1024 / 1024 < 4;
                if (!isLt4M) {
                    Toast("图片过大，请更换一张或者进行压缩后上传");
                    return false;
                }
                return true;
            } else {
                Toast("上传图片必须是 JPG/PNG 格式!");
                return false;
            }
        },
        // 上传图片
        async afterRead(file, item) {
            if (item.commentPictList.length === 5) {
                Toast("最多支持五张图片，请先删除再上传图片");
                return false;
            }
            // 上传图片过程中启动盖屏，禁止点保存
            this.loading = true;
            // let file2base64 = "";
            // let reader = new FileReader();
            // reader.readAsDataURL(file.file);
            // reader.onload = () => {
            //     file2base64 = reader.result;
            // };
            // uploadImgDetail(file.file).then(res => {
            //     let result = res.uploadDetail.successDetail;
            //     // // 存储图片详情
            //     item.commentPictList.push({
            //         fileLength: result.fileSize,
            //         md5: result.md5,
            //         fileUrl: result.filePath,
            //         fileNameSource: file.file.name,
            //         fileNameUpload: file.file.name,
            //         pictClass: "D_COMMENTPICT",
            //         file2base64: file2base64
            //     });
            //     this.forceUpdate();
            // });
            this.uploadImg(file.file, item).then(res=>{
                this.loading = false;
                this.forceUpdate();
            })
        },
        uploadImg(file, item){
            return uploadImgDetail(file).then((res) => {
                let result = res.uploadDetail.successDetail;
                // 存储图片详情
                item.commentPictList.push({
                    fileLength: result.fileSize,
                    md5: result.md5,
                    fileUrl: result.filePath,
                    fileNameSource: file.name,
                    fileNameUpload: file.name,
                    pictClass: 'D_COMMENTPICT'
                });
                return true
            });
        },
        // 提交评价
        submitEvaluate() {
            // 非空校验
            for (let i = 0; i < this.evaluateForm.length; i++) {
                if (
                    this.evaluateForm[i].commentMemo.length === 0 &&
                    this.evaluateForm[i].commentPictList.length === 0
                ) {
                    Toast("请将评价填写完整再提交");
                    return false;
                }
            }
            // 校验是否已存在追评
            let data = {
                billCode: this.billCode,
                busContsCode: baseConstant.busContsCode
            };
            Order.getDetailInfo(data).then(async res => {
                if (res.data.reviewFlag === 1) {
                    Toast("该订单已存在追评");
                    return false;
                } else {
                    if (!this.btnLock) {
                        this.loading = true;
                        this.btnLock = true;
                        let spCommentDtSaveDtos = [];
                        // 组合追评信息
                        for (let i = 0; i < this.evaluateForm.length; i++) {
                            this.evaluateForm[i].commentPictList = await this.formatPictList(this.evaluateForm[i].commentPictList)
                            spCommentDtSaveDtos.push({
                                spCommentHdId: this.evaluateForm[i]
                                    .spCommentDtDto.spCommentHdId,
                                upSpCommentDtId: this.evaluateForm[i]
                                    .spCommentDtDto.id,
                                showFlag: 1,
                                commentMemo: this.evaluateForm[i].commentMemo,
                                fileDtSaveDtos: this.evaluateForm[i]
                                    .commentPictList
                            });
                        }
                        let params = {
                            companyId: Storage.get("COMPANYID").company_id,
                            ownCompanyId: Storage.get("COMPANYID").company_id,
                            usrId: Storage.get("USER_INFO").usrId,
                            vipInfoHdId: Storage.get("USER_INFO").vipInfoId,
                            spCommentDtSaveDtos: spCommentDtSaveDtos
                        };
                        // 保存追评
                        Order.ordAddComment(params).then(res => {
                            if (res === 1) {
                                this.loading = false;
                                this.btnLock = false;
                                Toast("提交成功");
                                this.$router.go(-1);
                            }
                        });
                    }
                }
            });
        },
        // 格式化图片参数
        formatPictList(list){
            if(!list || list.length == 0) return []
            let str = JSON.stringify(list)
            str = str.replace(/sourceFileName/g, "fileNameSource")
            str = str.replace(/pictPath/g, "fileUrl")
            list = JSON.parse(str)
            list.forEach(item=>{
                item.fileNameUpload = item.fileNameSource
            })
            return list
        },
        // 显示大图预览
        showPreviewDialog(url) {
            this.showBigPic = true;
            this.previewImg = url;
        },
        // 移除图片
        removePreview(item, index) {
            item.commentPictList.splice(index, 1);
            this.forceUpdate();
        },
        // 强制更新UI
        forceUpdate() {
            this.$forceUpdate();
        }
    }
};
</script>

<style scoped lang="scss">
.order-evaluate {
    position: relative;
    height: 100%;
    background: white;
    padding-bottom: computed(100);
    .order-item {
        .top-title {
            padding: 0 18px;
            width: 100%;
            height: computed(50);
            font-size: $font-regular;
            color: $text-primary;
            line-height: computed(50);
        }
        .evaluate-content {
            height: 100%;
            padding: computed(30) computed(30) computed(8) computed(30);
            overflow: auto;
            img {
                width: computed(150);
                height: computed(150);
            }
            .goods-detail {
                width: 76%;
                float: right;
                h3 {
                    font-size: $font-regular;
                    color: $text-primary;
                    margin: 6px 0;
                    line-height: 20px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                p {
                    font-size: $font-common;
                    color: $text-regular;
                    margin-top: computed(45);
                }
            }
            .evaluate-text {
                word-break: break-all;
                margin-top: computed(10);
                width: 100%;
                height: computed(109);
                // overflow: -webkit-paged-y;
                font-size: $font-common;
                color: $text-secondary;
                border: none;
                font-size: computed(28);
            }
            .upLoad-box {
                width: 100%;
                z-index: 10;
                .upLoad-title {
                    height: computed(60);
                    line-height: computed(60);
                    display: flex;
                    justify-content: space-between;
                    font-size: $font-regular;
                    span:nth-of-type(2) {
                        font-size: $font-common;
                        color: $text-secondary;
                    }
                }
                .upload-box {
                    border: computed(2) solid #cccccc;
                }
                .img-box {
                    position: relative;
                    width: 20vw;
                    height: 20vw;
                    margin: 2vw 2.4vw 4vw 0;
                    float: left;
                    z-index: 9;

                    img {
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }
                    .icon-shanchu {
                        position: absolute;
                        margin: computed(-12) 0 0 computed(-15);
                        color: #cccccc;
                        font-size: computed(26);
                    }
                }
                .box-border {
                    border: 1px solid #fff;
                }
            }
        }
    }
    .gray {
        width: 100%;
        height: computed(10);
        background: #edf0f7;
    }
    .submit-btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: computed(100);
        line-height: computed(100);
        z-index: 99;
        background: #2ba4f3;
        color: $color-white;
        text-align: center;
        font-size: $font-regular;
    }
}
.enlarge-detail {
    z-index: 999999 !important;
    position: absolute;
    width: 100%;
    img {
        display: block;
        width: 100%;
    }
}
</style>
