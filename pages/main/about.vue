<template>
	<view>
		<view class="about-top">
			<image class="img" src="../../static/logo.png"></image>
			<view class="store-name">{{siteTitle}}</view>
			<view class="store-ver" v-if="version">V.{{version}}</view>
		</view>
		<view class="wwi-default-list mt10">
			<view class="li border">
				<view class="a" @tap="set(1)">
					<view class="h4">联系我们</view>
					<view class="right">{{siteEmail}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border">
				<navigator :url="'/pages/web/tourl?url='+SiteUrl" class="a">
					<view class="h4">电脑版</view>
					<view class="right">{{SiteUrl}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<view class="a" @tap="set(2)">
					<view class="h4">公众号</view>
					<view class="right">{{siteWechat}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border">
				<view class="a" @tap="tel">
					<view class="h4">客服电话</view>
					<view class="right">{{sitePhone}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="li border">
				<view class="a" @tap="app">
					<view class="h4">APP评分</view>
					<view class="right">{{siteTitle}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="about-bottom">
			<navigator url="/pages/web/document?code=agreement" class="a">服务协议</navigator>
			<view class="copyright">Copyright © 上海象讯网络科技有限公司(shopwwi.com)</view>
			<view class="copyright">All Rights Reserved</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version: '',
				siteEmail:this.siteEmail,
				sitePhone:this.sitePhone,
				siteWechat:this.siteWechat,
				siteTitle:this.siteTitle,
				SiteUrl:this.SiteUrl
			};
		},
		methods: {
			tel() {
				uni.makePhoneCall({
					phoneNumber: this.sitePhone //仅为示例
				});
			},
			set(e) {
				if (e == 1) {
					var data = this.siteEmail;
					var title = '邮箱复制成功，快去联系吧';
				} else {
					var data = this.siteWechat;
					var title = '公众号已复制，打开微信搜索吧';
				}
				uni.setClipboardData({
					data: data,
					success: function() {
						uni.showToast({
							title: title,
							icon: 'none'
						});
					}
				});
			},
			app() {
				// #ifdef APP-PLUS
				switch (plus.os.name) {
					case "Android":
						{
							//url = "market://details?id=com.dheaven.helloh5";
							url = "market://details?id=io.dcloud.HelloH5";
							//url = "market://search?q=HelloH5";
							//url = "market://search?q=pub:HelloH5";
						}
						break;
					case "iOS":
						{
							url = "itms-apps://itunes.apple.com/cn/app/hello-h5+/id682211190?l=zh&mt=8";
						}
						break;
				}
				plus.runtime.openURL(url);
				// #endif
			}

		},
		onLoad: function(e) {
			// #ifdef APP-PLUS
			this.version = plus.runtime.version;
			// #endif
		}
	}
</script>

<style>
.about-top,.about-bottom {display: flex;width: 100%;flex-direction: column;justify-content: center;align-items: center;padding-top: 80upx;}
.about-top .img {width: 200upx;height: 200upx;border-radius: 50%;}
.about-top .store-name {font-size: 36upx;line-height: 80upx;font-weight: bold;}
.about-top .store-ver {font-size: 28upx;}
.about-bottom .a{color: #FF0036;}
.about-bottom .copyright{font-size: 26upx; color: #888888;}
.wwi-default-list .li .right{color: #888888;}
</style>
