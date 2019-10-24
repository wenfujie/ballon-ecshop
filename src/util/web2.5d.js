
/**
 * createTime: 2019/9/10 9:28
 * author: zhibin.zhao
 * description:
 */
class Web25d {
	constructor(totalFabrics, fabricsIndex, picSize, verticalSize, dom){
		this.totalFabrics = totalFabrics
		this.fabricsIndex = fabricsIndex
		this.picSize = picSize
		this.verticalSize = verticalSize
		this.dom = dom
	}
	init(){
		let viewWidth = this.dom.imgBox.offsetWidth, viewHeight = this.dom.imgBox.offsetHeight
		if(viewWidth*this.verticalSize >= this.picSize*viewHeight){//设备视图的宽高比比较大
			this.picSize = viewHeight*this.picSize/this.verticalSize;
		}else{	//图片可视区域的宽高比比较大
			this.picSize = viewWidth
		}

		this.dom.canvasPaint.style.width = this.picSize*this.totalFabrics + 'px'
		// this.dom.canvasPaint.style.height = this.picSize*this.verticalSize/this.picSize + 'px'
		this.dom.imgContent.style.width = this.picSize + 'px'
		this.dom.imgContent.style.height = this.picSize*this.verticalSize/this.picSize + 'px'
		this.dom.Paint.style.height = this.picSize*this.verticalSize/this.picSize + 'px'
		this.dom.Paint.style.left = '0px'
		// this.dom.canvasPaint.style.width = (this.picSize*this.totalFabrics)/750*100 + 'vw'
		// this.dom.canvasPaint.style.height = this.picSize*this.verticalSize/this.picSize + 'px'
		/* this.dom.imgContent.style.width = this.picSize/750*100 + 'vw'
		this.dom.imgContent.style.height = (this.picSize*this.verticalSize/this.picSize)/750*100 + 'vw'
		this.dom.Paint.style.height = (this.picSize*this.verticalSize/this.picSize)/750*100 + 'vw'
		this.dom.Paint.style.left = '0' */
	}
	goNext() {  //0-23，下一帧
		this.fabricsIndex++;
		if (this.fabricsIndex == this.totalFabrics){
			this.fabricsIndex = 0;
		}
		this.dom.Paint.style.left = this.fabricsIndex*(-this.picSize) + 'px'
	}
	goPrev(){ //23-0，上一帧
		this.fabricsIndex--;
		if(this.fabricsIndex < 0){
			this.fabricsIndex = this.totalFabrics - 1;
		}
		this.dom.Paint.style.left = this.fabricsIndex*(-this.picSize) + 'px'
		// this.dom.Paint.style.left = this.fabricsIndex*(-this.picSize)/750*100 + 'vw'
	}
}
export default Web25d