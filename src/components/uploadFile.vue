<template>
    <!-- 图片上传 -->
    <div class="content">
        <div class="group">
            <div class="upload">
                <span>上传图片</span>
                <span class="limit">支持最多上传{{max}}张</span>
            </div>
        </div>
        <!-- 图片 -->
        <div class="img-group">
            <van-uploader
                class="img-box flex-center upload-box"
                :before-read="beforeRead"
                :after-read="onRead"
                v-if="isBeyongLimit"
            >
                <div class="flex-center w100 h100">
                    <i class="iconfont icon-tupiantianjia" v-if="!loading"></i>
                    <van-loading v-else/>
                </div>
            </van-uploader>
            <div class="img-box box-border" v-for=" (file, index) in imgs" :key="index">
                <img :src="file.content" alt />
                <i class="iconfont icon-shanchu" @click="delImg(index)"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { Uploader, Toast, Icon, Loading } from "vant";
import Storage from "@/util/storage";
import { EXIF } from "exif-js";
export default {
    name: "upload-file",
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    components: {
        "van-uploader": Uploader,
        "van-icon": Icon,
        "van-loading": Loading
    },
    data() {
        return {
            max: 5,
            imgs: [],
            images: [],
            isDisabled: false,
            loading: false,
        };
    },
    methods: {
        beforeRead(file){
            console.log(file)
            const isImg = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
            if (!isImg) {
                this.$toast('上传图片必须是 JPG/JPEG/PNG 格式!');
                return false
            }
            return true
        },
        onRead(file) {
            // 格式校验
            let that = this;
            let Orientation;
            let img = new Image();
            img.src = file.content;
            if (img.src.length <= 500 * 1024) {
                this.uploadFile(file);
            } else {
                img.onload = function() {
                    //去获取拍照时的信息，解决拍出来的照片旋转问题
                    EXIF.getData(file.file, function() {
                        Orientation = EXIF.getTag(this, "Orientation");
                        console.log(Orientation);
                        let base64Img = that.compress(img, Orientation, file.file.type);
                        let newImg = convertBase64UrlToBlob(
                            base64Img.replace(
                                /^data:image\/(png|jpg|jpeg);base64,/,
                                ""
                            )
                        );
                        newImg.name = file.file.name;
                        console.log(newImg);
                        file.content = base64Img;
                        file.file = newImg;
                        // console.log(file)
                        // console.log(data)
                        that.uploadFile(file);
                    });
                };
            }
        },
        // 压缩图片
        compress(img, Orientation, type) {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let width = img.width;
            let height = img.height;
            //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
            let ratio;
            if ((ratio = (width * height) / 5000000) > 1) {
                // console.log("大于400万像素");
                ratio = Math.sqrt(ratio);
                width /= ratio;
                height /= ratio;
            } else {
                ratio = 1;
            }
            canvas.width = width;
            canvas.height = height;
            //        铺底色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);
            //修复手机拍照上传图片的时候 被旋转的问题
            // if (navigator.userAgent.match(/iphone/i)) {
            // console.log("iphone 手机")
            if (Orientation != "" && Orientation != 1) {
                switch (Orientation) {
                    case 6: //需要顺时针（向左）90度旋转
                        this.rotateImg(img, "left", canvas);
                        break;
                    case 8: //需要逆时针（向右）90度旋转
                        this.rotateImg(img, "right", canvas);
                        break;
                    case 3: //需要180度旋转
                        let ctx = canvas.getContext("2d");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.rotate((180 * Math.PI) / 180);
                        ctx.drawImage(img, -img.width, -img.height);
                        // this.rotateImg(img, "right", 2, canvas); //转两次
                        break;
                }
            }
            /* }else{
                console.log("android 手机")
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6: //需要顺时针（向左）90度旋转
                            this.rotateImg(img, "left", canvas);
                            break;
                        case 8: //需要逆时针（向右）90度旋转
                            this.rotateImg(img, "right", canvas);
                            break;
                        case 3: //需要180度旋转
                            this.rotateImg(img, "right", canvas); //转两次
                            this.rotateImg(img, "right", canvas);
                            break;
                    }
                }
            } */
            console.log("type",type)
            //进行最小压缩
            let ndata = canvas.toDataURL(type, 0.5);
            return ndata;
        },
        // 旋转图片
        rotateImg(img, direction, canvas) {
            //最小与最大旋转方向，图片旋转4次后回到原方向
            const min_step = 0;
            const max_step = 3;
            if (img == null) return;
            //img的高度和宽度不能在img元素隐藏后获取，否则会出错
            let height = img.height;
            let width = img.width;
            let step = 2;
            if (step == null) {
                step = min_step;
            }
            if (direction == "right") {
                step++;
                //旋转到原位置，即超过最大值
                step > max_step && (step = min_step);
            } else {
                step--;
                step < min_step && (step = max_step);
            }
            //旋转角度以弧度值为参数
            let degree = (step * 90 * Math.PI) / 180;
            let ctx = canvas.getContext("2d");
            switch (step) {
                case 0:
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0);
                    break;
                case 1:
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(degree);
                    ctx.drawImage(img, 0, -height);
                    break;
                case 2:
                    canvas.width = width;
                    canvas.height = height;
                    ctx.rotate(degree);
                    ctx.drawImage(img, -width, -height);
                    break;
                case 3:
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(degree);
                    ctx.drawImage(img, -width, 0);
                    break;
            }
        },
        uploadFile(file) {
            console.log("file",file.file)
            // 上传图片过程中启动盖屏，禁止点保存
            this.loading = true;
            uploadImgDetail(file.file).then(res => {
                let result = res.uploadDetail.successDetail;
                this.images.push({
                    fileLength: result.fileSize,
                    md5: result.md5,
                    pictPath: result.filePath,
                    sourceFileName: file.file.name,
                    pictClass: "D_COMMENTPICT"
                });
                this.imgs.push(file);
                this.loading = false;
                this.$emit("input", this.images);
            });
        },
        // 删除图片
        delImg(index) {
            this.images.splice(index, 1);
            this.imgs.splice(index, 1);
            this.isDisabled = false;
        }
    },

    computed: {
        isBeyongLimit: function() {
            return this.imgs.length == this.max ? false : true;
        }
    }
};
</script>

<style lang="scss" type="text/scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    .upload {
        display: flex;
        justify-content: space-between;
        color: #333333;
        font-size: computed(28);
        margin-bottom: computed(30);
        font-family: "PingFang-SC-Medium";
        span:nth-of-type(2) {
            color: #999999;
            font-size: $font-common;
        }
    }
    .upload-box {
        border: computed(2) solid #cccccc;
    }
    .img-box {
        position: relative;
        width: 20vw;
        height: 20vw;
        margin: 0 2.4vw 4vw 0;
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
        // .icon-box {
        //     display: flex;
        //     justify-content: center;
        //     position: absolute;
        //     top: -2.66667vw;
        //     right: -2.66667vw;
        //     color: #fff;
        //     margin: 0;
        //     padding: 0;
        //     font-size: computed(40);
        // }
    }
    .box-border {
        border: 1px solid #fff;
    }
}
</style>
