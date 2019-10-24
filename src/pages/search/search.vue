/*
* createTime：2018/6/28
* author：en.chen
* description: 搜索页面
*/
<template>
    <div class="search-wrapper">
        <div class="search-box">
            <div class="search">
                <i class="iconfont icon-sousuo"></i>
                <form @submit.prevent action="javascript:return true">
                    <input ref="id" v-model="keyWords" type="search" :placeholder="defaultWords" @keyup.13="searchGoods" autocomplete="off" v-focus  @focus="filterKeyWord" @input="filterKeyWord" @blur="closeAssociativeWord">
                </form>
                <i class="iconfont icon-guanbi" @click="clearSearchWord"></i>
            </div>
            <div class="cancel-btn" @click="cancel()">取消</div>
        </div>
        <ul class="associative-word-list" v-show="associativeWord.length >0">
            <li
                    v-for="(item,index) in associativeWord"
                    :key="index"
                    @click="goGoodsList(item)"
            >{{item}}
            </li>
        </ul>
        <div class="keywords-list" v-if="historyList.length>0 && associativeWord.length <= 0">
            <p class="list-title">历史搜索<a class="clean-btn" @click="cleanHistory()">清空</a></p>
            <ul>
                <li class="list-item" v-for="item in historyList" @click="quickSearch(item)">{{item}}</li>
            </ul>
        </div>
        <div class="keywords-list" v-if="hotSearchList.length>0 && associativeWord.length <= 0">
            <p class="list-title">热门搜索</p>
            <ul>
                <li class="list-item" v-for="item in hotSearchList" @click="searchWord(item)" v-if="item.searchWord && item.searchWord!==null">{{item.searchWord}}</li>
            </ul>
        </div>
        <a :href="this.url">{{url}}</a>
    </div>
</template>
<script>
	import Storage from '../../util/storage'
	import { Base , Cms , Goods } from '../../api/service'

	export default {
		data () {
			return {
				defaultWords: '',
				keyWords: '',
				historyList: [],
				hotSearchList: [],
				url:'',
				associativeWord: [],  // 联想搜索词
				linkUrl:''//预置搜索词跳转

			}
		},
		methods: {
			//  获取历史搜索列表
			getHistoryList () {
				let arr = Storage.get('SEARCH_HISTORY') // 从本地缓存中读取搜索历史
				if (arr === null || arr === undefined || arr === '' || arr === 'undefined' || arr === 'null') {
					this.historyList = []
					Storage.set('SEARCH_HISTORY', '[]')
				} else {
					this.historyList = arr.reverse()
				}
			},

			//  通过关键字搜索
			searchGoods () {
				console.log('this.defaultWordsdefaultWordsdefaultWordsdefaultWords')
				let keyword = this.keyWords ? this.keyWords : this.defaultWords
			
				if(keyword === '请输入搜索词') {
					this.$toast('请输入搜索词')
					return
				}
				let arr = Storage.get('SEARCH_HISTORY')
				if (arr === null || arr === undefined || arr === '' || arr === 'undefined' || arr === 'null') {
					let newArr = []
					newArr.push(keyword)
					Storage.set('SEARCH_HISTORY', newArr)
				} else {
					if (arr.length < 10) {  // 需求限制最多存储10条数据
						let hassame = true  // 判断是否将当前搜索的关键字存入本地,true为是，false为否
						for (let i = 0; i < arr.length; i++) {
							if (keyword === arr[i]) {  // 判断当前关键字是否与本地有重复
								hassame = false
							}
						}
						if (hassame) {  // 将没有重复的关键字存进本地
							arr.push(keyword)
							Storage.set('SEARCH_HISTORY', arr)
						}
					} else {
						let hassame = true
						for (let i = 0; i < arr.length; i++) {
							if (keyword === arr[i]) {
								hassame = false
							}
						}
						if (hassame) {  // 超过10个关键词则删除最先搜索的一个关键词，将没有重复的关键字存进本地
							arr.splice(0, 1)
							arr.push(keyword)
							Storage.set('SEARCH_HISTORY', arr)
						}
					}
				}
				this.saveKeyWord(keyword)
			    // 判断预置搜索词是否有配置链接
				if(this.linkUrl){
					if (
                    this.linkUrl.indexOf("http://") === -1 &&
                    this.linkUrl.indexOf("https://") === -1
                    ) {
                    this.$router.push(this.linkUrl);
                    } else {
                    window.location.href = this.linkUrl;
                    }
				}else{
	              this.$router.replace('/goods-list?keyWord=' + encodeURIComponent(keyword))
				}
				this.keyWords = '';
			},

			// 清除关键字
			clearSearchWord () {
				this.keyWords = ''
			},

			// 清除本地搜索历史
			cleanHistory () {
				Storage.remove('SEARCH_HISTORY')
				this.getHistoryList()
			},

			// 快捷搜索
			quickSearch (value) {
				this.keyWords = value
				this.saveKeyWord()
				this.searchGoods()
			},

			// 普通搜索
			searchWord (item) {
				this.linkUrl = '';
				if(!item.searchWordUrl) {
					this.keyWords = item.searchWord
					this.saveKeyWord()
					this.searchGoods()
				}else{
					let url = item.searchWordUrl
					if(url.indexOf('http://') === -1  && url.indexOf('https://') === -1) {  // 内部路由
						url = window.location.pathname + '#' + url
					}
					window.location.href = url
				}
			},

			// 获取热门商品列表
			getHotList () {
				let data = {
					isShop: 1
				}
				Goods.getHotGoods(data).then((res)=>{
					if (!!res && res.length) {
						res.forEach((item) => {
							if(item.searchWordTypeCode === 'D_SCPRESET') {
								let timeStart = new Date().getTime()
								let timeEnd = new Date(Date.parse(item.invalidTime.replace(/-/g, "/"))).getTime()
								if (timeStart <= timeEnd) {
									this.defaultWords = item.searchWord
									this.linkUrl = item.searchWordUrl
								}
							}
							else{
								if (item.searchWord) {
									this.hotSearchList.push(item);
								}
							}
						})
						if(!this.defaultWords) this.defaultWords = '请输入搜索词'
						if(this.hotSearchList.length <= 0) {
							this.getRcmdHotWord()
						}
					}else {
						this.getRcmdHotWord()
					}
				},() => {
					this.getRcmdHotWord()
				})
			},

			// 获取90天热搜
			getRcmdHotWord() {
				Goods.getHotWord({}).then((res) => {
					res.map((item)=>{
						item.searchWord = item.search_terms
					})
					this.hotSearchList = res.slice(0,10);
				})
			},

			// 搜索词过滤 + 联想
			filterKeyWord() {
				this.keyWords = this.keyWords.replace(/(^\s+)|(\s+$)/g, "");
				if(!!this.keyWords) {
					let data = {
						input: this.keyWords
					}
					Goods.getAssociativeWord(data).then((res) => {
						this.associativeWord = res.slice(0,10);
					})
				}else{
					this.associativeWord = []
				}
			},

			// 保存搜索词
			saveKeyWord(keyword) {
				if(!!keyword || !!this.keyWords) {
					let data = {
						model: {
							busContsCode: baseConstant.busContsCode,
							searchTerms: keyword || decodeURIComponent(this.keyWords)
						}
					}
					Goods.createRecordList(data).then(()=>{})
				}
			},

			// 跳转商品列表
			goGoodsList(keyword) {
				this.keyWord = keyword
				let arr = Storage.get('SEARCH_HISTORY')
				if (arr === null || arr === undefined || arr === '' || arr === 'undefined' || arr === 'null') {
					let newArr = []
					newArr.push(keyword)
					Storage.set('SEARCH_HISTORY', newArr)
				} else {
					if (arr.length < 10) {  // 需求限制最多存储10条数据
						let hassame = true  // 判断是否将当前搜索的关键字存入本地,true为是，false为否
						for (let i = 0; i < arr.length; i++) {
							if (keyword === arr[i]) {  // 判断当前关键字是否与本地有重复
								hassame = false
							}
						}
						if (hassame) {  // 将没有重复的关键字存进本地
							arr.push(keyword)
							Storage.set('SEARCH_HISTORY', arr)
						}
					} else {
						let hassame = true
						for (let i = 0; i < arr.length; i++) {
							if (keyword === arr[i]) {
								hassame = false
							}
						}
						if (hassame) {  // 超过10个关键词则删除最先搜索的一个关键词，将没有重复的关键字存进本地
							arr.splice(0, 1)
							arr.push(keyword)
							Storage.set('SEARCH_HISTORY', arr)
						}
					}
				}
				this.saveKeyWord(keyword)
				this.$router.replace('/goods-list?keyWord=' + encodeURIComponent(keyword))
				// 点击跳转完之后再重置搜索词
				this.associativeWord = []

			},

			// 关闭联想词
			closeAssociativeWord() {
				setTimeout(() => {
					this.associativeWord = [];
				}, 300)
			},
			// 取消
			cancel() {
				if (this.keyWords) {
					this.$router.replace("/goods-list?keyWord=" + encodeURIComponent(this.keyWords));
				} else {
					this.$router.go(-1);
				}
			}
		},
		created () {
			this.keyWords = !!this.$route.query.keyWord ? decodeURIComponent(this.$route.query.keyWord) : ''
			this.getHistoryList()
			this.getHotList()
		},
		mounted () {
			this.$nextTick(() => {
				window.scrollTo(0, 0)
			})
//			this.$refs.id.focus()
		},
		watch: {
			'keyWords' : function () {
				if(!this.keyWords) this.associativeWord = []
			}
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
    .search-wrapper{
        margin: 0 computed(30);
        padding-top: computed(30);
        overflow: hidden;
    }
    .search-box{
        overflow: hidden;
    }
    .search-box::after{
        content: '';
        display: table;
        clear: both;
    }
    .search{
        box-sizing: border-box;
        position: relative;
        width: computed(610);
        height: computed(70);
        float: left;
        padding: 0 computed(64);
        border: solid 1px #CCCCCC;
        vertical-align: middle;
        overflow: hidden;
    }
    .search .icon-sousuo{
        font-size: computed(32);
        line-height: computed(70);
        position: absolute;
        top: 0;
        left: computed(12);
        color: #CCCCCC;
    }
    .search .icon-guanbi{
        font-size: computed(30);
        line-height: computed(70);
        position: absolute;
        top: 0;
        right: computed(20);
        color: #CCCCCC;
    }
    .search input{
        position: relative;
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: computed(48);
        margin: computed(10) auto;
        border: none;
        font-size: computed(30);
        line-height: computed(36);
        color: #454545;
        overflow: hidden;
        vertical-align: middle;
    }
    .search input::placeholder{
        color: #CCCCCC;
    }
    .cancel-btn{
        float: right;
        font-size: computed(30);
        line-height: computed(70);
        color: #2BA4F3;
    }
    .associative-word-list{
        position: absolute;
        z-index: 9;
        background: #ffffff;
        top: computed(100);
        left: computed(30);
        width: computed(690);
        li{
            box-sizing: border-box;
            font-size: computed(30);
            line-height: computed(80);
            color: #0D0E09;
            border-bottom: solid computed(1) #DBDBDB;
        }
    }
    .keywords-list{
        margin: computed(30) 0 computed(60) 0;
        overflow: hidden;
    }
    .list-title{
        font-size: computed(30);
        line-height: computed(38);
        color: #CCCCCC;
    }
    .clean-btn{
        margin-left: computed(40);
        text-decoration: underline;
        color: #2BA4F3;
    }
    .keywords-list ul{
        position: relative;
        overflow: hidden;
    }
    .keywords-list ul::after{
        content: '';
        display: table;
        clear: both;
    }
    .keywords-list ul .list-item{
        float: left;
        margin: computed(28) computed(60) 0 0;
        font-size: computed(30);
        line-height: computed(34);
        color: #454545;
    }
</style>
