<template>
	<view>
		<view class="wwi-top-menu flex flexrow">
			<view class="li" :class="{now:dataState=='ordinary'}" @click="paremTabs('ordinary')"><view class="span">普通注册</view></view>
			<view class="li" :class="{now:dataState=='mobile'}" @click="paremTabs('mobile')"><view class="span">手机注册</view></view>
		</view>
        <view style="padding-top:2em ;">
			<block v-if="dataState=='ordinary'">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">用&nbsp;&nbsp;户&nbsp;&nbsp;名：</text>
                <input type="text" v-model="account" placeholder="请输入6-20个字符">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="account.length > 0" @click="account=''"></view>
            </view>
            <view class="input-row border">
                <text class="title">设置密码：</text>
                <input type="text" :password="showPassword" v-model="password" placeholder="请输入6-20位密码">
				<view class="wwi-icon " :class="{'wwi-icon-yanjing_yincang':!showPassword,'wwi-icon-yanjing_xianshi':showPassword}" v-if="password.length >0"  @click="showPassword=!showPassword"></view>
            </view>
            <view class="input-row border">
                <text class="title">确认密码：</text>
                <input type="text" :password="showPassword" v-model="password_confirm" placeholder="请再次输入密码">
				<view class="wwi-icon " :class="{'wwi-icon-yanjing_yincang':!showPassword,'wwi-icon-yanjing_xianshi':showPassword}" v-if="password_confirm.length >0" @click="showPassword=!showPassword"></view>
            </view>
            <view class="input-row border">
                <text class="title">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</text>
                <input type="text" v-model="email" placeholder="请输入常用邮箱">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="email.length > 0" @click="email=''"></view>
            </view>
        </view>
		<view class="doc flex flexrow">
			<view class="wwi-icon wwi-icon-duihao" :class="{ok:regOk}" @click="regOk=!regOk"></view>
			<view class="span">同意</view>
			<navigator class="em" url="/pages/web/document?code=agreement">用户注册协议</navigator>
		</view>
		<view class="btn-row">
			<button type="primary" class="wwibtn" @tap="ordinaryReg">注册</button>
		</view>
		</block>
		<view v-if="dataState=='mobile'">
        <view class="input-group">
			<view v-if="isBull != 3" class="input-row border">
				<text class="title">手机号：</text>
				<input type="number" v-model="phone" :disabled="isBull==2" placeholder="请输入手机号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="phone.length > 0 && isBull!=2" @click="phone=''"></view>
			</view>
			<view  class="input-row border" v-if="isBull!=3">
				<text class="title">验证码：</text>
				<input class="code" type="text" v-model="code" maxlength="4"  placeholder="请输入验证码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="code.length > 0" @click="code=''"></view>
				<image class="codeimg" :src="codeImg" @click="getCode"></image>
			</view>
			<view v-if="isBull!=3" class="input-row border">
				<text class="title">动态码：</text>
				<input class="code" type="number" v-model="mobilecode" maxlength="6"  placeholder="请输入动态码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="mobilecode.length > 0" @click="mobilecode=''"></view>
				<view class="again" @click="sendsms">{{smstext}}</view>
			</view>
            <view class="input-row border" v-if="isBull==3">
                <text class="title">设置密码：</text>
                <input type="text" :password="showPassword" v-model="mpassword" placeholder="请输入6-20位密码">
				<view class="wwi-icon " :class="[{'wwi-icon-yanjing_yincang':!showPassword,'wwi-icon-yanjing_xianshi':showPassword}]" v-if="mpassword.length >0"  @click="showPassword=!showPassword"></view>
            </view>
			</view>
		<view class="doc flex flexrow" v-if="isBull==2">
			<view class="wwi-icon wwi-icon-duihao" :class="{ok:regOk}" @click="regOk=!regOk"></view>
			<view class="span">同意</view>
			<navigator class="em" url="/pages/web/document?code=agreement">用户注册协议</navigator>
		</view>
		<view class="btn-row">
			<button type="primary" :disabled="isBull==1" class="wwibtn" @tap="nextGo">{{subtext}}</button>
		</view>
		</view>
</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				dataState:'ordinary',
				account:'',
				password:'',
				email:'',
				password_confirm:'',
				showPassword:true,
				regOk:true,
				isBull:1,
				phone:'',
				code:'',
				mobilecode:'',
				codeImg:'',
				codeKey:'',
				subtext:'下一步',
				smstext:'获取短信验证',
				smsStatus:false,
				smsTime: 60,
				timer: null,
				mpassword:''
			}
		},
		methods:{
			paremTabs:function(e){
				if(this.dataState==e){
					return false;
				}
				if(e=='mobile'){
					this.getCode();
				}
				this.dataState = e;
			},
			ordinaryReg:function(e){
				var regName=/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4E00-\u9FA5]{5,19}$/;
				if(!regName.test(this.account)){
					uni.showToast({title: '请输入6-20位字母/数字/下划线/中文',icon:"none"});
					return false;
				}
				if(this.password.length < 6 || this.password.length > 20){
					uni.showToast({title: '请输入6-20位密码',icon:"none"});
					return false;
				}
				if(this.password!=this.password_confirm){
					uni.showToast({title: '两次密码输入不一致',icon:"none"});
					return false;
				}
				var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
				if(!reg.test(this.email)){
					uni.showToast({title: '请输入有效邮箱',icon:"none"});
					return false;
				}
				if(!this.regOk){
					uni.showToast({title: '请先同意注册协议',icon:"none"});
					return false;
				}
            var client= 'wap';
			//#ifdef MP-WEIXIN
			    client='wechat';
			//#endif
			//#ifdef APP-PLUS
			    client=uni.getSystemInfoSync().platform;
			//#endif
		     var invite = uni.getStorageSync('invite')?uni.getStorageSync('invite'):'0';
			 this.wwiopt({
			 	url: "/index.php?app=login&wwi=register",
			 	method: 'POST',
			 	data: {username:this.account,password:this.password,password_confirm:this.password_confirm,email:this.email,client:client,inviteid:invite},
			 	success: res => {
					if(!res.data.datas.error){
						if(typeof(res.data.datas.key)=='undefined'){
							return false;
						}else{
                            //
                            this.updateCookieCart(res.data.datas.key);
							uni.setStorageSync('username',res.data.datas.username);
							uni.setStorageSync('userid',res.data.datas.userid);
							uni.setStorageSync('key',res.data.datas.key);
							uni.navigateBack();
						}
					}else{
						uni.showToast({
							title: res.data.datas.error,icon:"none"
						});
					}
				}
			 });
			},
			updateCookieCart: function(key) {
				var cartlist = decodeURIComponent(uni.getStorageSync('goods_cart'));
				if (cartlist) {
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_cart&wwi=cart_batchadd',
						data: {
							key: key,
							cartlist: cartlist
						},
						method: 'POST',
						dataType: 'json',
						async: false
					});
					uni.removeStorageSync('goods_cart');
					uni.removeStorageSync('cart_count');
				}
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
			sendsms:function(){	
				if (this.phone.length < 11) {
					uni.showToast({
						icon: 'none',
						title: '请输入11位手机号码'
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

				if(this.smsStatus){
					return
				}
				uni.request({
					url: this.ApiUrl+'/index.php?app=connect&wwi=get_sms_captcha',
					data: {type:1,phone:this.phone,sec_val:this.code,sec_key:this.codeKey},
					success: res => {
							if(!res.data.datas.error){
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
							this.isBull = 2;
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
					}
				});
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
			nextGo:function(){
				if(this.smsStatus){
					return
				}
				this.smsStatus = true;
				if(this.isBull==2){
					uni.request({
						url: this.ApiUrl + '/index.php?app=connect&wwi=check_sms_captcha',
						data: {type:1,phone:this.phone,captcha:this.mobilecode },
						success: res => {
							if(!res.data.datas.error){
								this.isBull = 3;
								this.subtext = '确认';
							}else{
								uni.showToast({
									title: res.data.datas.error ,icon:'none'
								});
								this.getCode();
								this.code='';
							}
							this.smsStatus = false;
						}
					});
				}else if(this.isBull==3){
					
				if(this.mpassword.length < 6 || this.mpassword.length > 20){
					uni.showToast({title: '请输入6-20位密码',icon:"none"});
					return false;
				}
            var client= 'wap';
			//#ifdef MP-WEIXIN
			    client='wechat';
			//#endif
			//#ifdef APP-PLUS
			    client=uni.getSystemInfoSync().platform;
			//#endif
		     var invite = uni.getStorageSync('invite')?uni.getStorageSync('invite'):'0';
				uni.request({
					url: this.ApiUrl+"/index.php?app=connect&wwi=sms_register",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {phone:this.phone, captcha:this.mobilecode, password:this.mpassword, client:client,inviteid:invite},
					success: res => {
					if(!res.data.datas.error){
						if(typeof(res.data.datas.key)=='undefined'){
							return false;
						}else{
							var data = res.data.datas;
                            this.updateCookieCart(data.key);
							uni.setStorageSync('username',data.username);
							uni.setStorageSync('userid',data.userid);
							uni.setStorageSync('key',data.key);
							uni.navigateBack();
						}
					}else{
						uni.showToast({
							title: res.data.datas.error,icon:"none"
						});
					}
                     this.smsStatus = false;
					}
				});
				}
			}
		},
		onLoad:function(e){
			if(e.invite){
				uni.setStorageSync('invite',e.invite);
			}
			var key=uni.getStorageSync('key');
			if(key){
				uni.switchTab({
					url:'/pages/member'
				});
			}
		}
	}
</script>

<style>
.wwi-top-menu{height: 80upx; position: fixed; z-index: 999;left: 0; right: 0; background: #FFFFFF;}
.wwi-top-menu .li{flex: 1; display: flex; justify-content: center; align-items: center;}
.wwi-top-menu .li .span{border-bottom: 4upx solid #FFFFFF; font-size: 28upx; font-weight: bold;}
.wwi-top-menu .li.now .span{border-color:#03A9F4 ; color: #03A9F4;}
.input-group{margin-top: 40upx;}
.input-row .title {width: 200upx;}
.input-row input {	width: 470upx;}
.input-row input.code {	width: 260upx;}
.doc{padding: 20upx 40upx; align-items: center;}
.doc .wwi-icon{background: #dfe0e0; color: #FFFFFF; border-radius:50%; padding: 5upx; font-size: 28upx;}
.doc .wwi-icon.ok{background: #009A61;}
.doc .span{font-size: 28upx; margin-left: 10upx;}
.doc .em{color: #03A9F4; font-size: 28upx; margin-left: 10upx;}
</style>
