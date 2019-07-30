<template>
	<view class="content">
		<view class="input-h-title">{{title}}</view>
		<view v-if="isBull == 2" class="input-s-title">{{phone}}</view>
		<view class="input-group">
			<view v-if="isBull == 1" class="input-row border">
				<text class="title">手机号：</text>
				<input type="number" v-model="phone" placeholder="请输入手机号" :value="inputClearValue" @input="bindClearInput">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="phone.length > 0" @click="phone='' "></view>
			</view>
			<view v-if="isBull == 1" class="input-row border">
				<text class="title">验证码：</text>
				<input class="code" type="text" v-model="code" maxlength="4" placeholder="请输入验证码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="code.length > 0" @click="code='' "></view>
				<image class="codeimg" :src="codeImg" @click="getCode"></image>
			</view>
			<view v-if="isBull == 2" class="input-row border">
				<text class="title">动态码：</text>
				<input class="code" type="number" v-model="mobilecode" maxlength="6" placeholder="请输入动态码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="mobilecode.length > 0" @click="mobilecode='' "></view>
				<view class="again" @click="sendsms">{{smstext}}</view>
			</view>
            <view v-if="isBull == 3" class="input-row border">
                <text class="title">密码：</text>
                <input type="text" :password="showPassword" v-model="password" placeholder="请输入密码">
				<view class="wwi-icon wwi-icon-yanjing_xianshi" :class="[!showPassword ? 'uni-active' : '']" @click="rchangePassword"></view>
            </view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="nextGo">{{subtext}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				code: '',
				mobilecode: '',
				codeKey: '',
				codeImg: '',
				password:'',
				title: '第一步:填写正确的手机号完成验证',
				smstext: '再次获取短信',
				subtext: '获取验证码',
				inputClearValue: "",
				showClearIcon: false,
				showPassword: true,
				isBull: '1',
				smsTime: '',
				timer: '',
				status: false
			}
		},
		methods: {
			bindClearInput: function(e) {
				this.inputClearValue = e.target.value;
				if (e.target.value.length > 0) {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearIcon: function() {
				this.inputClearValue = "";
				this.showClearIcon = false;
			},
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
			sendsms() {
				if (this.status) {
					return
				}
				this.status = true;
				uni.request({
					url: this.ApiUrl + "/index.php?app=connect&wwi=get_sms_captcha",
					data: {
						type: 3,
						phone: this.phone,
						sec_val: this.code,
						sec_key: this.codeKey
					},
					success: res => {
						if (!res.data.datas.error) {
							this.isBull = 2;
							this.title = '第二步:填写正确的手机动态码完成验证';
							this.subtext = '下一步';
							this.loading();

							uni.showToast({
								icon:'none',title: '发送成功'
							});
							this.timer = setInterval(() => {
								if (this.smsTime === 0) {
									this.timer && this.clearTimer();
									this.reset();
									this.smsTime = res.data.datas.sms_time;
								} else {
									this.loading();
								}
							}, 1000);
						} else {
							this.getCode();
							uni.showToast({
								icon:'none',title: res.data.datas.error
							});
							this.status = false;
						}
					}
				});
			},
			checkSms() {
				uni.request({
					url: this.ApiUrl + "/index.php?app=connect&wwi=check_sms_captcha",
					method: 'GET',
					data: {
						type: 3,
						phone: this.phone,
						captcha: this.mobilecode
					},
					success: res => {
						if (!res.data.datas.error) {
							this.isBull = 3;
							this.title = '第三步:输入新密码完成密码找回';
							this.subtext = '确定';
						} else {
							this.getCode();
							uni.showToast({
								icon:'none',title: res.data.datas.error
							});
						}
					}
				});
			},
			changePassword(){
			var client='wap';
			//#ifdef MP-WEIXIN
			 client='wechat';
			//#endif
			//#ifdef APP-PLUS
			 client=uni.getSystemInfoSync().platform;
			//#endif
				uni.request({
					url: this.ApiUrl+'/index.php?app=connect&wwi=find_password',
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {phone: this.phone,password: this.password, captcha:this.mobilecode,client:client},
					success: res => {
                    if(!res.data.datas.error){
						uni.setStorageSync('username',res.data.datas.username);
						uni.setStorageSync('key',res.data.datas.key);
                        uni.navigateBack({ delta: 2});
                    }else{
							uni.showToast({
								icon:'none',title: res.data.datas.error
							});
                    }
					}
				});
			},
			rchangePassword: function () {
				this.showPassword = !this.showPassword;
			},
			nextGo() {
				if (this.isBull == 1) {
					if (this.phone.length != 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号'
						});
						return;
					}
					if (this.code.length < 4) {
						uni.showToast({
							icon: 'none',
							title: '请输入4位图形验证码'
						});
						return;
					}
					this.sendsms();
				}else if(this.isBull == 2){
					if (this.mobilecode.length < 6) {
						uni.showToast({
							icon: 'none',
							title: '请输入6位短信动态码'
						});
						return;
					}
					this.checkSms();
				}else if(this.isBull == 3){
					if (this.password.length < 6) {
						uni.showToast({
							icon: 'none',
							title: '请输入不低于6位数密码'
						});
						return;
					}
					this.changePassword();
				}
			},
			reset() {
				this.status = false;
				this.smstext = '再次获取短信';
			},
			loading() {
				this.smsTime -= 1;
				this.smstext = '发送成功(' + this.smsTime + ')';
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			}

		},
		onLoad: function() {
			this.getCode();
		},
		onUnload: function() {
			this.timer && this.clearTimer();
		}
	}
</script>

<style>
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
</style>
