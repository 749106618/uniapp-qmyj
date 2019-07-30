<template>
	<view>
		<view class="wwiapp-asset-info rcard">
			<view class="container">
		<view class="i wwi-icon wwi-icon-yinhangqia"></view>
			<view class="dl rule">
				<view class="dd">请输入已知平台充值卡号码</view>
				<view class="dd">充值后可以在购物结算时选取使用充值卡余额进行支付</view>
			</view>
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-icon">
			<navigator class="icon-li" url="/pages/my/rechargecardlist" open-type="redirect"><view class="wwi-icon wwi-icon-zhangdan color-cs"></view><text>充值卡明细</text></navigator>
			<view class="icon-li color-hui" ><view class="wwi-icon wwi-icon-zijinxunhuan"></view><text>充值卡充值</text></view>
		</view>
		<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">充值卡号：</text>
				<input type="text" v-model="rcSn" placeholder="请输入平台充值卡号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="rcSn.length > 0" @click="rcSn=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">验证码：</text>
				<input class="code" type="text" v-model="code" maxlength="4" placeholder="请输入验证码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="code.length > 0" @click="code=''"></view>
				<image class="codeimg" :src="codeImg" @click="getCode"></image>
			</view>
		</view>
				<view class="btn-row">
					<button type="primary" class="rcard" @tap="nextGo" :disabled="rcSn.length>0 &&code.length > 0 ? false:true">提交</button>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				rcSn:'',
				code:'',
				codeImg:'',
				codeKey:''
			};
		},
		methods: {
			getCode() {
				uni.request({
					url: this.ApiUrl + "/index.php?app=seccode&wwi=makecodekey",
					async: false,
					dataType: 'json',
					success: res => {
						this.codeKey = res.data.datas.codekey;
						this.codeImg = this.ApiUrl + '/index.php?app=seccode&wwi=makecode&k=' + this.codeKey + '&t=' + Math.random();
					}
				});
			},
			nextGo(){
					if (this.rcSn.length < 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入平台充值卡号'
						});
						return;
					}
					if (this.code.length != 4) {
						uni.showToast({
							icon: 'none',
							title: '请输入4位图形验证码'
						});
						return;
					}
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_fund&wwi=rechargecard_add",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,rc_sn:this.rcSn,captcha:this.code,codekey:this.codeKey},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '充值成功',icon:'none'
								});
								uni.redirectTo({
									url:'/pages/member/rechargecardList/rechargecardList'
								});
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
							}
						}
					});
			}
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.getCode();
		}
	}
</script>

<style>
	page{background-color: #F8F8F8;}
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
	.input-group{margin-top: 0;}
</style>
