<template>
	<view class="case">
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper
						class="banner swiper"
						:style="{ height: windowHeight + 'px' }"
						:indicator-dots="indicatorDots"
						:autoplay="autoplay"
						:interval="interval"
						:duration="duration"
					>
						<swiper-item v-for="(itme, index) in pictureInfo.images" :key="index">
							<view class="swiper-item"><image :src="itme.image"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="header">
			<view class="header-left">
				<view class="header-left-icon"><image :src="pictureInfo.store_logo"></image></view>
				<view class="header-left-state">{{ pictureInfo.store_name }}</view>
			</view>
			<view class="header-right">
				<view class="header-right-icon icon"><span class="wwi-icon wwi-icon-case-xiaoxi"></span></view>
				<view class="header-right-state">在线沟通</view>
			</view>
		</view>
		<view class="state">{{ pictureInfo.content }}</view>
		<view class="bottom">
			<view class="input">
				<view class="wwi-icon wwi-icon-case-xiepinglun"></view>
				<view class="input-text">发表评论</view>
			</view>
			<view class="bottom-pl">
				<span class="icon wwi-icon wwi-icon-case-pinglun"></span>
				<span class="badge">333</span>
			</view>
			<view class="bottom-sc" @click="collect"><span :class="'icon wwi-icon ' + shoucang"></span></view>
			<button class="bottom-fx" type="primary" open-type="share"><span class="icon wwi-icon wwi-icon-case-fenxiang"></span></button>
		</view>
	</view>
</template>

<script>
import uniBadge from '@/components/uni-badge/uni-badge.vue';
export default {
	components: { uniBadge },
	data() {
		return {
			indicatorDots: false,
			autoplay: false,
			interval: 2000,
			duration: 500,
			windowHeight: 0,
			windowWidth: 0,
			pictureInfo: [],
			shoucang: 'wwi-icon-case-noshoucang'
		};
	},
	onLoad() {
		let self = this;
		uni.getSystemInfo({
			success: function(res) {
				self.windowHeight = res.windowHeight;
				self.windowWidth = res.windowWidth;
				console.log(res.windowHeight);
			}
		});
		uni.request({
			url: 'https://www.qianmeng1688.com/mo_bile/index.php?app=default&wwi=case_details', //仅为示例，并非真实接口地址。
			data: {
				id: 48
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded' //自定义请求头信息
			},
			method: 'POST',
			success: res => {
				this.pictureInfo = res.data.datas.picture_info;
				console.log(res.data);
				uni.setNavigationBarTitle({
					title: res.data.datas.picture_info.title
				});
			}
		});
	},
	methods: {
		share() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSenceTimeline',
				type: 2,
				imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png',
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
		collect() {
			if (this.shoucang === 'wwi-icon-case-noshoucang') {
				this.shoucang = 'wwi-icon-case-yshoucang y-shoucang';
			} else {
				this.shoucang = 'wwi-icon-case-noshoucang';
			}
		}
	}
};
</script>

<style>
.case .wwi-icon {
	line-height: 1.5;
}
.page-section-spacing {
	padding: 0;
}
.y-shoucang {
	color: red;
}
.swiper-item {
	width: 100%;
	height: 100%;
}
.swiper-item image {
	width: 100%;
	height: 100%;
}
.case {
	position: relative;
}
.header {
	height: 120upx;
	background-color: #000;
	opacity: 0.5;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20upx;
	box-sizing: border-box;
}
.header-left {
	display: flex;
	align-items: center;
}
.header-left-icon {
	width: 50upx;
	height: 50upx;
}
.header-left-icon image {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.header-left-state {
	color: #fff;
	font-size: 35upx;
	margin-left: 20upx;
}

.header-right {
	width: 200upx;
	height: 50upx;
	color: #4cd964;
	border-radius: 10upx;
	border: 2upx solid #4cd964;
	display: flex;
	align-items: center;
	justify-content: center;
}
.header-right-icon {
	text-align: center;
	line-height: 50upx;
}
.header-right-icon .wwi-icon {
	font-size: 28upx;
}
.header-right-state {
	font-size: 25upx;
	margin-left: 10upx;
}

.state {
	min-height: 150upx;
	background-color: #000;
	opacity: 0.5;
	position: absolute;
	bottom: 100upx;
	left: 0;
	width: 100%;
}
.bottom {
	height: 100upx;
	background-color: #010101;
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	display: flex;
	align-items: center;
	padding: 0 20upx;
	color: #fff;
	font-size: 16px;
	box-sizing: border-box;
}
.bottom .input {
	width: 50%;
	height: 60%;
	background-color: #333333;
	padding-left: 20upx;
	display: flex;
	align-items: center;
	color:#DFDFDF;
	font-size: 24upx;
}
.bottom .wwi-icon{
	font-size: 30upx;
}
.bottom .input-text{
	margin-left: 30upx;
}
.bottom-pl,
.bottom-sc,
.bottom-fx {
	margin-left: 30upx;
	width: 100upx;
	height: 66upx;
	text-align: center;
	line-height: 66upx;
}
.bottom-pl {
	position: relative;
}
.bottom-pl .badge {
	position: absolute;
	width: 52upx;
	right: -10upx;
	top: 2upx;
	line-height: 28upx;
	border-radius: 10upx;
	text-align: center;
	font-size: 24upx;
	background-color: #39b54a;
}
.bottom .icon {
	font-size: 45upx;
}

.bottom-fx {
	padding: 0;
	background: transparent !important;
	color: #fff;
}
.state {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	font-size: 25upx;
	padding: 20upx 20upx;
	box-sizing: border-box;
}
</style>
