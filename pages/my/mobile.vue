<template>
	<view class="content">
		<view v-if="isBull == 2" class="input-s-title">您当前的手机号是{{phone}}</view>
		<view class="input-group">
			<view v-if="isBull == 1" class="input-row border">
				<text class="title">手机号：</text>
				<input type="number" v-model="phone" placeholder="请输入手机号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="phone.length > 0" @click="phone=''"></view>
			</view>
			<view v-if="isBull == 3" class="input-row border">
				<text class="title">支付密码：</text>
				<input type="text" :password="showPassword" v-model="password" placeholder="请输入支付密码">
				<view class="wwi-icon wwi-icon-yanjing_xianshi ico" :class="[!showPassword ? 'active' : '']" @click="showPassword = !showPassword"></view>
			</view>
			<view  class="input-row border">
				<text class="title">验证码：</text>
				<input class="code" type="text" v-model="code" maxlength="4" placeholder="请输入验证码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="code.length > 0" @click="code=''"></view>
				<image class="codeimg" :src="codeImg" @click="getCode"></image>
			</view>
			<view v-if="isBull!=3" class="input-row border">
				<text class="title">动态码：</text>
				<input class="code" type="number" v-model="mobilecode" maxlength="6" placeholder="请输入动态码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="mobilecode.length > 0" @click="mobilecode=''"></view>
				<view class="again" @click="sendsms">{{smstext}}</view>
			</view>
          <view v-if="isBull!=3" class="textRight" @click="clearGo('paypwd')">使用支付密码验证</view> 
		  <view v-if="isBull==3" class="textRight" @click="clearGo('phone')">使用手机验证</view> 
		</view>
		<view class="btn-row">
			<button type="primary" class="wwibtn" @tap="nextGo" :disabled="mobilecode.length>0 ? false:true">{{subtext}}</button>
		</view>
		<view v-if="isBull!=3" class="input-h-title">小提示：通过手机验证后，可用于快速找回登录密码及支付密码，接收账户资产变更等提醒。</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				phone:'',
				code:'',
				mobilecode:'',
				codeImg:'',
				codeKey:'',
				isBull:'',
				key:'',
				password:'',
				showPassword: true,
				subtext:'下一步',
				smstext:'获取短信验证',
				smsTime: 60,
				timer: null,
				smsStatus:false
			}
		},
		methods:{
			Inlimine(){
				this.wwiopt({
					url: '/index.php?app=member_account&wwi=get_mobile_info',
					data: {key:this.key},
					success: res => {
						if(res.data.code == 200){
							this.subtext='下一步';
							if(res.data.datas.state){
								this.phone = res.data.datas.mobile;
								this.isBull = 2;
								this.getCode();
								uni.setNavigationBarTitle({ title: '手机解绑'});
							}else{
								this.isBull = 1;
								this.getCode();
								uni.setNavigationBarTitle({ title: '手机绑定'});
							}
						}
					}
				});
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
			nextGo(){
				console.log(this.isBull);
				if(this.isBull==1){
					if (this.phone.length != 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号'
						});
						return;
					}
					if (this.mobilecode.length != 6) {
						uni.showToast({
							icon: 'none',
							title: '请输入6位短信动态码'
						});
						return;
					}
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=bind_mobile_step2",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,auth_code:this.mobilecode},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '绑定成功',icon:'none'
								});
								uni.navigateBack();
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
						}
					});
				}else if(this.isBull==2){
					if (this.mobilecode.length != 6) {
						uni.showToast({
							icon: 'none',
							title: '请输入6位短信动态码'
						});
						return;
					}
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=modify_mobile_step3",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,auth_code:this.mobilecode},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '解绑成功',icon:'none'
								});
								this.Inlimine();
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
						}
					});
				}else{
					if (this.password.length < 6) {
						uni.showToast({
							icon: 'none',
							title: '请输入不少于6位密码'
						});
						return;
					}
					if (this.code.length < 4) {
						uni.showToast({
							icon: 'none',
							title: '请输入图形验证码'
						});
						return;
					}
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=check_paypwd",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,password:this.password,captcha:this.code,codekey:this.codekey},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '解绑成功',icon:'none'
								});
								this.Inlimine();
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
						}
					});
				}
			},
			sendsms(){
					if (this.code.length < 4) {
						uni.showToast({
							icon: 'none',
							title: '请输入图形验证码'
						});
						return;
					}
				if(this.smsStatus){
					return
				}
				if(this.isBull==1){
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=bind_mobile_step1",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,mobile:this.phone,captcha:this.code,codekey:this.codeKey},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '发送成功',icon:'none'
								});
								this.loading();
							this.timer = setInterval(() => {
								if (this.smsTime === 0) {
									this.timer && this.clearTimer();
									this.reset();
									this.smsTime = 60;
								} else {
									this.loading();
								}
							}, 1000);
							this.smsStatus = true;
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
						}
					});
				}else{
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=modify_mobile_step2",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,mobile:this.phone,captcha:this.code,codekey:this.codeKey},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '发送成功',icon:'none'
								});
								this.smsTime = res.data.datas.sms_time;
								this.loading();
							this.timer = setInterval(() => {
								if (this.smsTime === 0) {
									this.timer && this.clearTimer();
									this.reset();
									this.smsTime = 60;
								} else {
									this.loading();
								}
							}, 1000);
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
						}
					});
				}
			},
			reset() {
				this.smsStatus = false;
				this.smstext = '再次获取短信';
				this.getCode();
			},
			loading() {
				this.smsTime -= 1;
				this.smstext = '发送成功(' + this.smsTime + ')';
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			clearGo: function(e) {
				if(e=='paypwd'){
					this.isBull=3;
					this.getCode();
					this.code='';
					uni.setNavigationBarTitle({ title: '支付密码验证'});
				}else{
					this.Inlimine();
				}
			}
			
			
			
		},
		onShow:function(){
			this.key=uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
		}
		
		
	}
</script>

<style>
page {	background: #FFFFFF;}
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
</style>
