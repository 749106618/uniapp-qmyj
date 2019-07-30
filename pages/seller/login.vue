<template>
	<view>
		<view class="seller-login">
			<image src="http://shopwwig.oss-cn-shanghai.aliyuncs.com/app-icon-walf.gif" class="wave-gif" mode=""></image>
		</view>
	<view class="login-content new-login">

		<view class="login-logo">
			<image class="img" src="../../static/logo.png"></image>
		</view>
		<view class="login-input">
			  <view class="input-row border">
				<text class="wwi-icon title wwi-icon-user"></text>
				<input v-model="account" placeholder="请输入商家账号">
				<view class="wwi-icon wwi-icon-anniu_guanbi icon-lock" v-if="account.length > 0" @click="account=''"></view>
			</view>
			<view class="input-row border">
				<text class="wwi-icon title wwi-icon-private"></text>
				<input type="text" :password="showPassword" v-model="password" placeholder="请输入密码">
				<view class="wwi-icon  icon-lock" :class="[{'wwi-icon-yanjing_yincang':!showPassword,'wwi-icon-yanjing_xianshi':showPassword}]"
				 @click="showPassword=!showPassword"></view>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="wwibtn" @tap="bindLogin">登录</button>
		</view>
	</view>
	</view>
</template>
<script>
	import md5 from '../../common/md5';
	export default {
		data() {
			return {
				hasProvider: false,
				account: '',
				password: '',
				inputClearValue: "",
				showClearIcon: false,
				showPassword: true,
				positionTop: 0,
				providerList: [],
				hasUserInfo: false,
				userInfo: {},
				wcode:''
			}
		},
		methods: {
			bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.account.length < 3) {
					uni.showToast({
						icon: 'none',
						title: '请输入账号/手机号/邮箱'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '请输入至少6位密码'
					});
					return;
				}
				var client = 'wap';
				//#ifdef MP-WEIXIN
				var client = 'wechat';
				//#endif
				//#ifdef APP-PLUS
				var client = uni.getSystemInfoSync().platform;
				//#endif
				this.wwiopt({
					url: '/index.php?app=seller_login',
					method: 'POST',
					data: {
						seller_name: this.account,
						password: md5(this.password),
						client: client
					},
					dataType: 'json',
					success: res => {
						console.log(res);
						var data = res.data.datas;
						if (!data.error) {

							if (typeof(data.key) == 'undefined') {
								return false;
							} else {
								uni.setStorageSync('seller_name', data.seller_name);
								uni.setStorageSync('store_name', data.store_name);
								uni.setStorageSync('seller_key', data.key);
								var page = getCurrentPages();
								if (page.length > 1) {
									uni.navigateBack();
								} else {
									uni.redirectTo({
										url: '/pages/seller/index'
									});
								}
							}
						} else {
							uni.showModal({
								content: data.error,
								confirmText: '我知道了'
							});
						}
					},
					error: () => {}
				});
			}
		},
		onShow: function() {
			var key = uni.getStorageSync('seller_key');
			if (key) {
				var page = getCurrentPages();
				if (page.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/index'
					});
				}
			}
		},
		onLoad:function(){
		}
	}
</script>

<style>
	page {background: #ffffff;}
	.new-login .input-group{background: transparent;}
	.login-input{background: rgba(255,255,255,0.5); border-radius:20upx ; margin-top: 80upx;}
	.login-input .title{color: #03a9f4; font-size: 48upx; width: 80upx; padding-left: 20upx;}
	.login-input .icon-lock{color: #888888;}
	.login-input input{padding: 20upx; height: 40upx; line-height: 40upx; font-size: 28upx;}
	.seller-login{background: #03a9f4; position: relative; height: 200upx;}
</style>
