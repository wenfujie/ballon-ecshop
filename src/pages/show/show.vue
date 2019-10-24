/*
* createTime：2018-06-20
* author：en.chen
* description: Show页面的模块展示
*/
<template>
    <div class="index">

        <!--广告弹窗 begin-->
        <van-popup v-model="showBanner" :close-on-click-overlay="false">
            <swiper :options="bannerSwiperOption" id="banner-box" class="banner-box" @slideChange="slidechange">
                <swiper-slide v-for="(item,index) in banners" class="banner-list" :key="index">
                    <img v-if="item.coverFileUrl" :src="getImg(item.coverFileUrl)" alt="" @click="playVideo(item,index)" v-show="item.showCover === true" onerror="errImg(event)">
                    <video :poster="getImg(item.coverFileUrl)" controls  v-if="item.fileType === '2' && item.fileUrl" :src="getVideo(item.fileUrl)" v-show="item.showCover === false">
                    </video>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="close-btn" @click="closeBanner">
                <i class="iconfont icon-shanchuguanbi"></i>
            </div>
        </van-popup>
        <!--广告弹窗 end-->

        <!--悬浮窗口 begin-->
        <div class="banner-window" v-if="smallCover" v-show="showBanner==false" @click="showBanner=true">
            <div class="small-banner" :style="{background:'url('+getImg(smallCover) +') no-repeat center'}"></div>
        </div>
        <!--悬浮窗口 end-->

        <!--页面模块 begin-->
        <div id="content">
            <div id="container">
                <a v-for="(item, index) in moduleList" :data-index="index" :data-url="item.url">
                    <p v-if="!!item.name">{{item.name}}</p>
                    <img v-if="!!item.pic" :src="getImg(item.pic)" onerror="errImg(event)" alt="" >
                    <div class="video-wrapper">
                        <video v-if="!!item.video && !item.pic" :poster="getImg(item.vpic)"  controls  :src="item.video"></video>
                    </div>
                </a>
            </div>
        </div>
        <!--页面模块 end-->
        <footer-bar></footer-bar>
    </div>
</template>
<script>
    import { Popup } from 'vant'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import FooterBar from '@/components/FooterBar'
    import { UserService, Base, Login, Cms } from '../../api/service'
    import Storage from '../../util/storage'
    import filters from '@/util/filters'
    import 'swiper/dist/css/swiper.css'
    import '../../assets/js/jquery-2.1.1.min'

    export default {
        name: 'index',
        props: ['initActive'],
        components: {
            swiper,
            swiperSlide,
            'van-popup': Popup,
            'footer-bar': FooterBar
        },
        data () {
            return {
                //  广告轮播配置
                bannerSwiperOption: {
                    autoplay: true, // 自动播放
                    time: 3000,
                    speed: 300, // 滚动速度
                    pagination: {
                        el: '.swiper-pagination'
                    },  //  轮播图下的圆点提示
                    loop: false  //循环播放
                },
                showBanner: false,  //  广告显示的变量
                banners: [],  // 广告图数据
                smallCover: '',  //  小窗口封面图
                moduleList: [], //  模块元素,
                loadFlag: 1
            }
        },
        methods: {

            // 广告轮播切换
            slidechange () {
                for (let i = 0; i < this.banners.length; i++) {
                    this.banners[i].showCover = true
                }
                this.stopBannerVideo()
            },

            // 播放视频
            playVideo (item, index) {
                this.stopBannerVideo()
                if (item.fileType !== '2') {
                    if(item.url && item.url !== null) {
                        this.$router.push(item.url)
                    }
                    return
                } else {
                    item.showCover = false
                    let $video = document.getElementById('banner-box').getElementsByTagName('video')
                    $video[index].play()
                }
            },

            // 停止广告播放视频
            stopBannerVideo () {
                let $video = document.getElementById('banner-box').getElementsByTagName('video')
                for (let i = 0; i < $video.length; i++) {
                    $video[i].pause()
                }
            },

            // 关闭广告弹窗
            closeBanner () {
                this.stopBannerVideo()
                this.showBanner = false
                for (let i = 0; i < this.banners.length; i++) {
                    this.banners[i].showCover = true;
                }
            },

            //  获取模块
            getPart () {
                let data = {
                    cmsTemplateCode: Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                    cmsWebCode: pageCode.index.name,
                    busContsCode: baseConstant.busContsCode
                }
                Cms.getUsrCmsInfoV2(data).then((res)=> {
                    let moduleData = res.cmsModulepageHdList[0].cmsBackpageDtDtoList  //正确格式
//                    let moduleData = res.cmsModulepageHdList  //125测试数据格式
                    let moduleList = []
                    moduleData.forEach((item)=> {

                        //  字段区分，正确数据格式为cmsBackpageDttList，125测试数据格式为cmsBackpageDtDtoList
                        if((item.cmsBackpageDttList.length !== undefined) && (item.cmsBackpageDttList.length > 0)) {
                            //  ad01为广告模块的代号,正确数据格式可以直接取cmsBackpageDtCode，125测试数据取cmsBackpageDtDtoList[0]下的cmsBackpageDtCode
                            if(item.cmsBackpageDtCode !== 'ad01') {
                                item.showCover = true
                                let obj = {}
                                //  字段区分，正确数据格式取cmsBackpageDttList下的数据进行遍历，125测试数据取cmsBackpageDtDtoList[0].cmsBackpageDttList下的数据
                                item.cmsBackpageDttList.forEach((child)=>{
                                    if(child.fileType === '0'){
//                                        obj.name = child.cmsBackpageDttName
                                          obj.name = child.covername
                                        if(!obj.url) {
                                            obj.url = child.url
                                        }
                                    }else if(child.fileType === '1'){
                                        obj.pic = child.coverFileUrl
                                        if(!obj.url) {
                                            obj.url = child.url
                                        }
                                    }else{
                                        obj.vpic = child.coverFileUrl
                                        obj.video = child.fileUrl
                                    }
                                })
//                                let child = item.cmsBackpageDtDtoList[0].cmsBackpageDttList[0]
//                                if(child.fileType == 0){
//                                    obj.name = child.cmsBackpageDttName
//                                    obj.url = child.url
//                                }else if(child.fileType == 1){
//                                    obj.pic = child.coverFileUrl
//                                    obj.url = child.url
//                                }else{
//                                    obj.vpic = child.coverFileUrl
//                                    obj.video = child.fileUrl
//                                }
                                moduleList.push(obj)
                            }else if(item.cmsBackpageDtCode === 'ad01') {
                                //  正确格式直接取cmsBackpageDttList，125测试数据取cmsBackpageDtDtoList[0].cmsBackpageDttList
                                let banners = item.cmsBackpageDttList
                                banners.forEach((child) => {
                                    child.showCover = true;
                                });
                                this.smallCover = banners[0].coverFileUrl || ''
                                this.banners = banners
                                if(this.banners.length > 0) {
                                    this.showBanner = true
                                    this.judgeLoad()
                                }
                            }
                        }
                    })
                    this.moduleList = moduleList
                }, (err)=> {}).then(()=>{
                    this.$nextTick(function () {
                        // 初始化首页封面的拖动和点击
                        var height = (801 * $(window).width()) / 751
                        var currentIndex = 0
                        var dir = 'up'
                        var dirs = 'up'
                        var step = 1
                        var move_Height = 0
                        var area = document.getElementById('content')
                        var videos = $(area).find('video')
                        var texts = $(area).find('p')

                        // 初始化封面图位置

                        function move_event (_y, moveHeight, _end) {
                            $('#container a').each(function (i) {
                                if (currentIndex == i) {
                                    $(this).css('transform', 'translateY(' + (_end ? 0 : _y) + 'px)')
                                    $(this).find('p').addClass('active')
                                } else if (currentIndex + 1 == i) {
                                    if (dirs == 'up') { $(this).css('transform', 'translateY(' + (_end ? height : height + _y) + 'px)') } else { $(this).css('transform', 'translateY(' + (_end ? height : height + moveHeight) + 'px)') }
                                    $(this).find('p').removeClass('active')
                                } else if (i < currentIndex) {
                                    $(this).css('transform', 'translateY(' + (-height * (currentIndex - i) + _y) + 'px)')
                                    $(this).find('p').removeClass('active')
                                } else if (i > currentIndex) {
                                    if (currentIndex + 2 == i && Math.abs(_y) > height && dir == 'up') { $(this).css('transform', 'translateY(' + (height + (height / 4) * (i - currentIndex - 1) + moveHeight * 1.5) + 'px)') } else { $(this).css('transform', 'translateY(' + (height + (height / 4) * (i - currentIndex - 1) + moveHeight) + 'px)') }
                                    $(this).find('p').removeClass('active')
                                }
                            })

                        }

                        move_event(0, 0)

                        var startY = 0

                        // 手指触摸事件
                        function touchStart (event) {
                            event.preventDefault()
                            var touchEvent = event.touches[0]
                            startY = touchEvent.pageY
                            step = Math.ceil((startY - height) / (height / 4))
                            if (step >= 1) {
                                step = getStep(step)
                            } else {
                                step = 0
                            }
                            $('#container a').removeClass('ant')
                        }

                        function getStep (step) {
                            if (currentIndex + step <= $('#container a').length - 1) return step
                            return getStep(step - 1)
                        }

                        area.addEventListener('touchstart', touchStart, true)

                        // 手指滑动事件

                        function touchMove (event) {
                            var touchEvent = event.touches[0]
                            var moveY = touchEvent.pageY - startY
                            // console.log(moveY);
                            if (moveY >= 0) {
                                move_Height = (Math.abs(moveY) > (height / 4) ? (height / 4) : moveY)
                            } else {
                                move_Height = (Math.abs(moveY) > (height / 4) ? (height / 4) * (-1) : moveY)
                                if (Math.abs(moveY) > height) {
                                    move_Height -= (Math.abs(moveY) - height)
                                }
                            }
                            move_event(moveY, move_Height)
                            if (moveY < -50) { dir = 'up' } else { dir = 'down' }

                            if (moveY < 0) { dirs = 'up' } else { dirs = 'down' }
                        }

                        area.addEventListener('touchmove', touchMove, true)

                        var endY = 0

                        // 手指滑动结束

                        function touchEnd (event) {
                            event.preventDefault()
                            stopVideo()
                            var touchEvent = event.changedTouches[0]
                            var $aLen = $('#container a').length
                            endY = touchEvent.pageY
                            if (step == 0 && startY - endY > 5) {
                                step = 1
                            } else if (step == 0 && Math.abs(startY - endY) < 1) {
                                var $video = $('a[data-index=' + currentIndex + ']').find('video')
                                if ($video.length == 0) {
//                                    console.log('当前是点击事件！')
                                    let url = $('a[data-index=' + currentIndex + ']').attr('data-url')
                                    if( url && (url !== undefined) ) {
                                        if(url.indexOf('http://') === -1  && url.indexOf('https://') === -1) {  // 内部地址
                                            url = window.location.pathname + '#' + url

                                        }
                                        top.location.href = url
                                    }
                                } else {
                                    $('a[data-index=' + currentIndex + ']').find('img').hide()
                                    $('a[data-index=' + currentIndex + ']').find('p').hide()
                                    var $vObject = $video[0]
                                    $($vObject).show()
                                }
                            }
                            if ((dir == 'up' || startY - endY >= 0) && currentIndex < $aLen - 1) {
                                if (startY - endY < 1) currentIndex += step
                                else if (startY - endY <= height) currentIndex++
                                else if (startY - endY > height) { currentIndex += 2; if (currentIndex >= $aLen - 1) currentIndex = $aLen - 1 }
                            } else if (dir == 'down' && currentIndex > 0) {
                                if (endY - startY > 20) {
                                    currentIndex--
                                }
                            }
                            $('#container a').addClass('ant')
                            move_event(0, 0, true)
                        }

                        function stopVideo () {
                            $(videos).hide()
                            $(texts).show()
                            if(videos.length>0){
                                videos[0].pause()
                            }
                            if($(area).find('img')){
                                $(area).find('img').show()
                            }
                        }

                        area.addEventListener('touchend', touchEnd, true)
                    })
                })
            },

            //  判断是否是首次进入
            judgeLoad () {
                let flag = Storage.get('SHOW_FLAG')
                if(flag === null) {
                    Storage.set('SHOW_FLAG',{'flag': 1})
                    this.showBanner = true
                }else{
                    this.showBanner =false
                }
            }
        },
        created () {
            this.getPart()
        }
    }
    /* eslint-enable */
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .banner-box{
        width: computed(600);
        padding-bottom: computed(40);

    }
    .banner-list{
        width: 100%;
        height: computed(850);
        overflow: hidden;
    }
    .banner-list img{
        display: block;
        width: 100%;
        height: 100%;
    }
    .close-btn{
        box-sizing: border-box;
        width: computed(60);
        height: computed(60);
        margin: computed(24) auto 0;
        border-radius: 50%;
        border: solid 1px #ffffff;
        overflow: hidden;
        color: #ffffff;
        text-align: center;
    }
    .close-btn i{
        font-size: computed(29);
        line-height: computed(60);
    }
    .banner-list video{
        display: block;
        margin: 0 auto;
        width: 100%;
    }
    .banner-window{
        width: computed(160);
        height: computed(160);
        position: fixed;
        right: 4vw;
        top: 40vh;
        box-sizing: border-box;
        padding: computed(5);
        -webkit-border-radius: computed(20);
        -moz-border-radius: computed(20);
        border-radius: computed(20);
        background-color: rgba(255,255,255,.2);
        z-index: 3;
    }
    .small-banner{
        width: 100%;
        height: 100%;
        -webkit-border-radius: computed(20);
        -moz-border-radius: computed(20);
        border-radius: computed(20);
        background-size: cover !important;
    }
    #container{
        position: relative;
    }
    #container a{
        overflow:hidden;
        display:block;
        position:absolute;
        color: #f8fffd;
        width:100%;
        height: computed(800);
        font-size:0px;
        top:0px;
    }
    #container a img{
        width:100%;
        overflow: hidden;
    }
    #container a p{
        position:absolute;
        transform:translateY(30px);
        transition:all .8s;
        left: 20%;
        text-align:center;
        font-size:16px;
        width: 60%;
        z-index: 10
    }
    #container a p.active{
        transition:all .8s;
        transform:translateY(200px);
    }
    #container .video-wrapper{
        width: 100%;
        height: 100%;
        z-index: 1;
    }
    #container a video{
        width: 100%;
        display: block;
        margin: 0 auto;
        top: 50%;
        position: relative;
        transform: translateY(-50%);
    }
    #container .ant{
        transition:all 0.2s ease-in-out;
    }
</style>
<style>
    .index .van-popup{
        background: transparent;
    }
    .index .swiper-pagination-bullet{
        background: #ffffff;
        opacity: .5;
    }
    .index .swiper-pagination-bullet-active{
        opacity: 1;
    }
    .index .swiper-container-horizontal > .swiper-pagination-bullets{
        bottom: 0;
    }
</style>


