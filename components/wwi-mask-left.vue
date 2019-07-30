<template>
	<view>
		 <view class="wwiapp-full-mask" v-if="showDv>0" :class="{'hide':showDv==0,'left':showDv==1,'right':showDv==2}"  catchtouchmove="reue">
		 <view class="wwiapp-full-mask-bg" v-show="showDv==1" @click="onClickCanel"  catchtouchmove="true"></view>
		 	<view class="wwiapp-full-mask-block flex flexcol">
				<view class="header-title" v-if="title.length">{{title}}</view>
				<scroll-view scroll-y class="mask-bd">
					<slot></slot> 
				</scroll-view>
				<view v-if="btitle.length" class="mask-bottom"  @tap="onClickBottom">{{btitle}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showDv:0
			};
		},
		props:{
			title:{
				type:String,
				default:''
			},
			btitle:{
				type:String,
				default:''
			}
			
		},
		methods:{
			show(){
				this.showDv = 1;
			},
			hide(){
				this.showDv = 2;
			},
			onClickCanel:function(){
				this.showDv = 2;
				this.$emit('onClickCannel');
			},
			 onClickBottom:function(){
				 this.$emit('onClickBottom')
			 }
		}
	}
</script>

<style>
.wwiapp-full-mask-block{background: #fff;}
.wwiapp-full-mask-block .header-title{display: flex; align-items: center; justify-content: center; height: 44px; font-size: 18px;}
.wwiapp-full-mask-block .mask-bd{width: 100%; height: calc(100% - 88px);}
.wwiapp-full-mask-block .mask-bottom{height: 44px; background: #FF0036; color: #FFFFFF;display: flex; align-items: center; justify-content: center;  font-size: 18px;}
</style>
