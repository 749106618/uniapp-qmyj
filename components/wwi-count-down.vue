<template name="wwi-count-down">
	<view class="wwi-count-down">
		<block v-if="d != '00'">
		<view class="wwi-countdown-numbers" :style="{borderColor:borderColor, color:fontColor, background:bgrColor}"><view class="fz">{{d}}</view></view>
		<view class="wwi-countdown-splitor" :style="{color:splitorColor}">天</view></block>
		<view class="wwi-countdown-numbers" :style="{borderColor:borderColor, color:fontColor, background:bgrColor}"><view class="fz">{{h}}</view></view>
		<view class="wwi-countdown-splitor" :style="{color:splitorColor}">时</view>
		<view class="wwi-countdown-numbers" :style="{borderColor:borderColor, color:fontColor, background:bgrColor}"><view class="fz">{{i}}</view></view>
		<view class="wwi-countdown-splitor" :style="{color:splitorColor}">分</view>
		<view class="wwi-countdown-numbers" :style="{borderColor:borderColor, color:fontColor, background:bgrColor}"><view class="fz">{{s}}</view></view>
		<view class="wwi-countdown-splitor" :style="{color:splitorColor}">秒</view>
	</view>
</template>

<script>
	export default {
		name: "wwi-count-down",
		props: {
			bgrColor: {
				type: String,
				default: "#FFFFFF"
			},
			borderColor: {
				type: String,
				default: "#000000"
			},
			fontColor: {
				type: String,
				value: "#000000"
			},
			splitorColor: {
				type: String,
				default: "#000000"
			},
			timer: {
				type: [String,Number],
				default: "0"
			}
		},
		data() {
			return {
				setTime: null,
				d:'00',
				h: '00',
				i: '00',
				s: '00',
				leftTime: 0
			}
		},
		created:function(e){
			this.leftTime = this.timer;
			this.countDown(this);
			this.setInterValFunc(this);
		},
		methods:{
			setInterValFunc: function(obj) {
				this.setTime = setInterval(function() {
					obj.countDown(obj);
				}, 1000);
			},
			countDown: function(self) {
				var tms = self.leftTime;
				if (tms>0) {
					tms = parseInt(tms)-1;
					var days = Math.floor(tms / (1 * 60 * 60 * 24));
					var hours = Math.floor(tms / (1 * 60 * 60)) % 24;
					var minutes = Math.floor(tms / (1 * 60)) % 60;
					var seconds = Math.floor(tms / 1) % 60;
// 				    if(days > 0){
// 						hours = parseInt(days*24 + hours)
// 					}
					if (days < 0) days = 0;
					if (hours < 0) hours = 0;
					if (minutes < 0) minutes = 0;
					if (seconds < 0) seconds = 0;
                }else{
					var days=0, hours = 0, minutes = 0, seconds = 0;
		         }
				if (days < 10) {
					days = '0' + days;
				}
				if (hours < 10) {
					hours = '0' + hours;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				if (seconds < 10) {
					seconds = '0' + seconds;
				}
				self.d = days;
				self.h = hours;
				self.i = minutes;
				self.s = seconds;
				self.leftTime = tms;
		  }
		},
		beforeDestroy:function(){
			clearInterval(this.setTime)
		},
		
	}
</script>

<style>
.wwi-count-down {display: flex;padding: 0.05em 0;flex-wrap: nowrap;justify-content: center;line-height: 1.01em; align-items: center;}
.wwi-countdown-splitor {width: auto !important;justify-content: center;padding: 0 0.125em; display: flex; justify-content: center; align-items: center; font-size: 0.6em;}
.wwi-countdown-numbers {line-height: 1.01em;width: auto !important;padding: 0 0.25em;justify-content: center;height:1.01em;border-radius:0.25em;margin: 0 0.125em;border: 1px solid #000000; justify-content: center;}
.wwi-countdown-numbers .fz{font-size: 0.6em;}
</style>
