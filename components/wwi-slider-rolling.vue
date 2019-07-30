<template>
	<view class="wwi-slider-rolling" :style="{height:boxheight+'px'}">
		<view class="wwi-slider-box":style="{marginTop: top +'px'}" @touchstart="touchstart" @touchend="touchend">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				top:0
			};
		},
		props: {
			boxHeight:{
				type:Number,
				default: 100
			},
			lineHeight:{
				type:Number,
				default: 100
			},
			speed:{
				type:Number,
				default: 40
			},
			wwiList:{
				type:[Object,Array],
				default: function () {
					return []
				}
			}
		 },
		 computed: {
		 	boxheight() {
		 		return uni.upx2px(this.boxHeight);
		 	},
			mgTop(){
				return uni.upx2px(this.lineHeight);
			}
		 },
		created:function(e){
			this.marquee();
			//setInterval(this.scroll,2000)
		},
		methods:{
			marquee:function(){                                              
            var top = 0;
			var _this = this;
			_this.timer=setInterval(function(){
				top++;
				_this.top = 0-top;
				if(Math.abs(_this.top) >= _this.mgTop){
					top = 0;
				   _this.top = 0; //确保每次都是从0开始，避免抖动
				   _this.wwiList.push(_this.wwiList[0]);  // 将数组的第一个元素添加到数组的
				   _this.wwiList.shift();//删除数组的第一个元素            
				}                      
			}, _this.speed);			
        },
		touchstart:function(){
			clearInterval(this.timer);
		},
		touchend:function(){
			this.marquee(60);
		},
		}
	}
</script>

<style>
.wwi-slider-rolling{overflow: hidden; position: relative; width: 100%;}
.wwi-slider-box{position: absolute;}
</style>
