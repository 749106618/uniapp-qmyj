<template>
	<!-- #ifdef H5	 -->	
	<view 
		class="wwi-refresh-content"
		:style="{
				transform: 'translateY('+ pageDeviation +'px)',
				transition: pageTransition + 's',
				height: 'calc(100% - ' + pageTop + 'px)',
				maxHeight: 'calc(100% - ' + pageTop + 'px)'
			}"
		@touchstart="pageTouchstart"
		@touchmove="pageTouchmove"
		@touchend="pageTouchend"
	>
	<!-- #endif -->
	<!-- #ifndef H5	 -->	
	<view 
		class="wwi-refresh-content"
		:style="{
				transform: 'translateY('+ pageDeviation +'px)',
				transition: pageTransition + 's',
				height: 'calc(100vh - ' + pageTop + 'px)',
				maxHeight: 'calc(100vh - ' + pageTop + 'px)'
			}"
		@touchstart="pageTouchstart"
		@touchmove="pageTouchmove"
		@touchend="pageTouchend"
	>
	<!-- #endif -->
	
		<!-- 下拉刷新 -->
		<view class="wwi-loading-wrapper" v-if="refresh">
			<view class="wwi-loading-icon" :class="{active: refreshing, ready: refreshReady}" >
				<view class="loading-icon1"></view>
				<view class="loading-icon2"></view>
				<view class="loading-icon3"></view>
			</view>
		</view>
		
		<slot></slot>
		<view class="wwi-reloading-wrapper" v-if="reload">
		</view>
		
	</view>
</template>

<script>
	let startY, moveY;
	export default {
		
		props: {
			top: {
				//距离顶部距离，单位upx
				type: Number,
				default: 0
			},
			refresh:{
				//开启下拉刷新
				type: [Boolean, String],
				default: true
			},
			reload:{
				//开启上拉
				type: [Boolean, String],
				default: true
			}
		},
		data() {
			return {
				pageDeviation: 0, //下偏移量
				pageTransition: 0, //回弹过渡时间
				refreshReady: false, //进入刷新准备状态
				refreshing: false, // 进入刷新状态
				reLoadReady:false,//进入加载准备状态
				reLoading:false //进入加载状态
			};
		},
		computed: {
			pageTop(){
				return this.top;
			}
		},
		methods: {
			pageTouchstart(e){
				this.pageTransition = 0;
				startY = e.touches[0].pageY;
			},
			pageTouchmove(e){
				moveY = (e.touches[0].pageY - startY) * 0.4;
				if((moveY >= 0 && this.refresh) || (moveY <= 0 && this.reload)){
					this.pageDeviation = moveY;
					this.$emit('setEnableScroll', false);
				}
				if(moveY >= 50 && this.refreshReady === false && this.refresh){
					this.refreshReady = true;
				}else if(moveY < 50 && moveY > 0 && this.refreshReady === true && this.refresh){
					this.refreshReady = false;
				}
				
				if(moveY <= -50 && this.reDownReady === false && this.reload){
					this.reDownReady = true;
				}else if(moveY > -50 && moveY < 0 && this.reDownReady === true && this.reload){
					this.reDownReady = false;
				}
			},
			pageTouchend(){
			
				this.pageTransition = 0.3;
				
				if(moveY >= 50 && this.refresh){
					this.startPulldownRefresh();
				}else if(moveY <= -50 && this.reload){
					this.startPullupLoad();
				}else{
					this.pageDeviation = 0;
				}
				
				if(this.refreshReady === true){
					this.refreshReady = false;
				}
				if(this.reDownReady === true){
					this.reDownReady = false;
				}
				//修复下拉一点回弹后页面无法滚动的bug
				this.$emit('setEnableScroll', true);
				startY = moveY = 0;
			},
			//开启下拉刷新
			startPulldownRefresh(){
				this.refreshing = true;
				this.pageDeviation = uni.upx2px(90);
				this.$emit('refreshback');
			},
			//结束下拉刷新
			endPulldownRefresh(){
				this.refreshing = false;
				this.pageDeviation = uni.upx2px(0);
				//this.$emit('setEnableScroll', true);
			},
			//开启上拉加载
			startPullupLoad(){
				this.reLoading = true;
				this.pageDeviation = uni.upx2px(-90);
				this.$emit('reloadback');
			},
			//结束上拉加载
			endPullupLoad(){
				this.reLoading = false;
				this.pageDeviation = uni.upx2px(0);
				
				//this.$emit('setEnableScroll', true);
			},
		}
	}
</script>

<style>
	.wwi-refresh-content{display: flex;flex-direction: column;position: relative;}
	/* 下拉刷新部分 */
	.wwi-loading-wrapper{position: absolute;left: 0;top: 0;transform: translateY(-100%);display: flex;justify-content: center;align-items: center;width: 100%;}
	.wwi-reloading-wrapper{position: absolute;left: 0;bottom: 0;transform: translateY(100%);display: flex;justify-content: center;align-items: center;width: 100%;}
	.wwi-loading-icon{width: 150upx;height: 70upx;text-align: center;}
	.wwi-loading-icon view{width: 0upx; height: 0upx; background-color: #67CF22; border-radius: 100%;display: inline-block;  }
	.wwi-loading-icon .loading-icon2 {width: 20upx; height: 20upx;}
	.wwi-loading-icon.active .loading-icon1 {animation-delay: -0.32s;}
    .wwi-loading-icon.active .loading-icon2 {animation-delay: -0.16s;margin-left: 10upx;}
	.wwi-loading-icon.active .loading-icon3{margin-left: 10upx;}
	.wwi-loading-icon.ready .loading-icon1{width: 20upx; height: 20upx;}
	.wwi-loading-icon.ready .loading-icon2{margin-left: 10upx;}
	.wwi-loading-icon.active view{animation: bouncedelay 1.4s infinite ease-in-out;animation-fill-mode: both;width: 20upx; height: 20upx;}
	@keyframes bouncedelay {0%, 80%, 100% {transform: scale(0.0);} 40% {transform: scale(1.0);}}
	
</style>
