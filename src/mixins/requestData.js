
const request = {
    data() {
        return {
            totalPage:0,
            pageNumber:1,
            isLoading: false, //是否处于下拉刷新状态
            loading: false, //是否处于加载状态
            finished: false, //是否已加载完所有数据
            dataList:[],
        }
    },
    created() { },
    mounted() { },
    methods: {
        getList(isPull,res){
            let {list,pages} =res;
            this.totalPage=pages;
            console.log(this.pageNumber,'totalPagetotalPagetotalPage')
            console.log(pages,'totalPagetotalPagetotalPage')

            if (!isPull) {
                this.dataList=list
                this.isLoading = false;
                console.log('666666666666')
              } else {
                console.log('77777777777')
                this.dataList = [...this.dataList, ...list];
                this.loading = false;
                this.finished = this.pageNumber >= this.totalPage;
              }
        },
    }

}
export default request