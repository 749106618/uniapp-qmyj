<template>
	<view class="login-content">
		<view v-if="isBull == 2" class="input-s-title">您当前的手机号是{{phone}}</view>
		<view class="input-group">
			<view v-if="isBull == 1" class="input-row border">
				<text class="title">手机号：</text>
				<input type="number" v-model="phone" placeholder="请输入手机号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="phone.length > 0" @click="phone=''"></view>
			</view>
			<view v-if="isBull != 3" class="input-row border">
				<text class="title">验证码：</text>
				<input class="code" type="text" v-model="code" maxlength="4" placeholder="请输入验证码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="code.length > 0" @click="code=''"></view>
				<image class="codeimg" :src="codeImg" @click="getCode"></image>
			</view>
			<view v-if="isBull != 3" class="input-row border">
				<text class="title">动态码：</text>
				<input class="code" type="number" v-model="mobilecode" maxlength="6" placeholder="请输入动态码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="mobilecode.length > 0" @click="mobilecode=''"></view>
				<view class="again" @click="sendsms">{{smstext}}</view>
			</view>
            <view v-if="isBull == 3" class="input-row border">
                <text class="title">新密码：</text>
                <input type="text" :password="showPassword" v-model="password" placeholder="请输入密码">
				<view class="wwi-icon wwi-icon-yanjing_xianshi ico" :class="[!showPassword ? 'uni-active' : '']" @click="showPassword = !showPassword"></view>
            </view>
            <view v-if="isBull == 3" class="input-row border">
                <text class="title">确认密码：</text>
                <input type="text" :password="showPassword1" v-model="password1" placeholder="请再次输入密码">
				<view class="wwi-icon wwi-icon-yanjing_xianshi ico" :class="[!showPassword1 ? 'uni-active' : '']" @click="showPassword1 = !showPassword1"></view>
            </view>
		</view>
		<view class="btn-row">
			<button v-if="isBull!=3" type="primary" class="wwibtn" @tap="nextGo" :disabled="mobilecode.length>0 ? false:true">{{subtext}}</button>
			<button v-if="isBull==3" type="primary" class="wwibtn" @tap="nextGo" :disabled="password.length>0 && password1.length>0 ? false:true">{{subtext}}</button>

		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				phone:'',
				code:'',
				password:'',
				password1:'',
				mobilecode:'',
				codeImg:'',
				codeKey:'',
				isBull:'',
				key:'',
				showPassword:true,
				showPassword1:true,
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
							}else{
								this.isBull = 1;
								this.getCode();
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
									title: '验证成功',icon:'none'
								});
								this.isBull=3;
								this.subtext='确定修改';
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
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
						url: this.ApiUrl+"/index.php?app=member_account&wwi=modify_password_step3",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,auth_code:this.mobilecode},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '验证成功',icon:'none'
								});
								this.isBull=3;
								this.subtext='确定修改';
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
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
					if (this.password != this.password1) {
						uni.showToast({
							icon: 'none',
							title: '两次输入的密码不同，请重新输入'
						});
						return;
					}
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=modify_password_step5",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,password:this.password,password1:this.password1},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '密码修改成功',icon:'none'
								});
								uni.navigateBack();
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
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
				}else{
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_account&wwi=modify_password_step2",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,captcha:this.code,codekey:this.codeKey},
						success: res => {
							if(res.data.code==200){
								uni.showToast({
									title: '发送成功',icon:'none'
								});
							this.smsStatus = true;
							this.timer = setInterval(() => {
								if (this.smsTime === 0) {
									this.timer && this.clearTimer();
									this.smsTime = 60;//res.data.datas.sms_time
									this.reset();
									
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
			},
			loading() {
				this.smsTime -= 1;
				this.smstext = '发送成功(' + this.smsTime + ')';
			},
			clearTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
			clearIcon: function(e) {
				e = "";
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
	page{background: #FFFFFF;}
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
</style>
