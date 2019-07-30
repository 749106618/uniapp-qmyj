<template>
	<view class="wwi-popup newBody">
		<view :class="{'popupMask':showPicker}" @click="maskClick" catchtouchmove="true"></view>
    <view class="wwi-popup-content bg flex flexcol" :class="{'wwi-popup-view-show':showPicker}">
	  <view class="wwi-popup-head">
		  <view class="wwi-popup-btn" @click="pickerCancel">{{leftText}}</view>
		  <view class="wwi-popup-title">{{title}}</view>
		 <view class="wwi-popup-btn" @click="pickerConfirm">{{rightText}}</view>
	  </view>
		<scroll-view scroll-y class="wwi-popup-main" style="margin: 0.5em 0; box-sizing: border-box;" :style="{'max-height': windowHeight+'px'}">
			<view class="wwi-popup-viddle">
			<slot></slot></view>
			</scroll-view>
	  <view class="wwi-popup-bottom" @click="pickerConfirm" v-if="bottomText.length">
		  {{bottomText}}
	  </view>
    </view>
	</view>
</template>

<script>
	export default {
	  data() {
		return {
		  showPicker:false,
			windowHeight:''
		};
	  },
	  props: {
		title: {
			type: String,
			default: ''
		},
		leftText: {
			type: String,
			default: ''
		},
		rightText: {
			type: String,
			default: ''
		},
		bottomText: {
			type: String,
			default: ''
		},
		themeColor: String
	  },
	  methods:{
		show() {
		  setTimeout(() => {
			this.showPicker = true;
			const res = uni.getSystemInfoSync();
			this.windowHeight = res.screenHeight *0.58;
		  }, 0);
		},
		maskClick() {
		  this.pickerCancel();
		},
		pickerCancel() {
		  this.showPicker = false;
		  this.$emit('onCancel');
		},
		pickerConfirm(e) {
		  this.showPicker = false;
		  this.$emit('onConfirm');
		},
		showPickerView() {
		  this.showPicker = true;
		}
	  }
	}
</script>

<style>

</style>
