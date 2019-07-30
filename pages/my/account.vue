<template>
	<view>
		<view class="wwi-default-list">
			<view class="li border">
				<navigator url="/pages/my/password" class="a">
					<view class="h4">登录密码</view>
					<view class="h6">建议您定期更改密码以保护账户安全</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/mobile" class="a">
					<view class="h4">手机验证</view>
					<view class="h6">若您的手机已丢失或停用，请立即修改更换</view>
					<view class="right">{{mobile}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/paypwd" class="a">
					<view class="h4">支付密码</view>
					<view class="h6">建议您设置复杂的支付密码保护账户金额安全</view>
					<view class="right">{{paypwdtext}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/realname" class="a">
					<view class="h4">实名认证</view>
					<view class="h6">建议您完成实名认证以便更好的为你服务</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/setting" class="a">
					<view class="h4">个人资料</view>
					<view class="h6">建议您完善个人资料</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="wwi-default-list mt5">
			<view class="li border">
				<navigator url="/pages/my/feedback" class="a">
					<view class="h4">用户反馈</view>
					<view class="h6">您在使用中遇到的问题与建议可向我们反馈</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="wwi-default-list mt5">
			<view class="li border">
				<view class="out" @click="getOut">
					<view class="wwi-icon wwi-icon-kaiguan"></view>
					<view class="h4">注销切换账号</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				mobile: '',
				paypwdtext: ''
			}
		},
		methods: {
			Inlimine() {
				this.key = uni.getStorageSync('key');
				if (!this.key) {
					uni.navigateTo({
						url: '/pages/web/login'
					});
				}
				this.wwiopt({
					url: '/index.php?app=member_account&wwi=get_mobile_info',
					data: {
						key: this.key
					},
					dataType: 'json',
					success: res => {
						if (res.data.code == 200) {
							if (res.data.datas.state) {
								this.mobile = res.data.datas.mobile;
							} else {
								this.mobile = '';
							}
						}
					}
				});
				this.wwiopt({
					url: '/index.php?app=member_account&wwi=get_paypwd_info',
					data: {
						key: this.key
					},
					dataType: 'json',
					success: res => {
						if (res.data.code == 200) {
							if (!res.data.datas.state) {
								this.paypwdtext = '未设置';
							} else {
								this.paypwdtext = '';
							}
						}
					}
				});
			},
			getOut() {
				uni.removeStorageSync('key');
				uni.removeStorageSync('cart_count');
				this.getCartCount();
				uni.navigateBack();
			}


		},
		onLoad: function() {
			this.Inlimine();
		},
		onShow: function() {
			this.Inlimine();
		}


	}
</script>

<style>
	page {
		background: #F8F8F8;
	}
</style>
