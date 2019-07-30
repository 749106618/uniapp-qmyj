<template>
	<view class="login-content new-login">
		<view class="login-logo">
			<image class="img" src="../../static/logo.png"></image>
		</view>
		<view class="login-input">
			  <view class="input-row border">
				<text class="wwi-icon title wwi-icon-user"></text>
				<input type="text" v-model="account" placeholder="请输入用户名/手机">
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
			
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary" open-type="getUserInfo" @getuserinfo="initPosition">微信一键快捷登入</button>
			<!-- #endif -->
		<view class="action-row flex flexJcs">
			<navigator open-type="redirect" url="/pages/web/findpwd">忘记密码?</navigator>
			<view class="" @tap="reg">注册</view>
		</view>
			
		</view>
		<!-- #ifdef H5||APP-PLUS -->
		<view class="oauth-row" v-bind:style="{top: positionTop + 'px'}">
			<view class="quick-login">
				<view class="txt-otherLogin">其他登入方式</view>
				<view class="wwi-ping" v-for="(value,key) in providerList" :key="key">
					<!-- #ifdef H5 -->
					<view class="wwi-icon " :class="'wwi-icon-'+value.icon" @tap="oauth(value.url)"></view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view class="wwi-icon " :class="'wwi-icon-'+value.icon" @tap="oauth(value)"></view>
					<!-- #endif -->
					
					<view class="icon-text">{{value.name}}</view>
				</view>
			</view>
			</view>
			
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

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
		computed: {
			...mapState(['hasLogin'])
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
					url: '/index.php?app=login',
					method: 'POST',
					data: {
						username: this.account,
						password: this.password,
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
								// 更新cookie购物车
								this.updateCookieCart(data.key);
								uni.setStorageSync('username', data.username);
								uni.setStorageSync('userid', data.userid);
								uni.setStorageSync('key', data.key);
								var page = getCurrentPages();
								if (page.length > 1) {
									uni.navigateBack();
								} else {
									uni.switchTab({
										url: '/pages/index'
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
			},
			clear() {
				this.hasUserInfo = false;
				this.userInfo = {};
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
			initPosition(e) {
				// #ifdef MP-WEIXIN
				var _this = this;
				var invite = uni.getStorageSync('invite') ? uni.getStorageSync('invite') : '0';
				if (e.detail.errMsg !== 'getUserInfo:ok') {
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + e.detail.errMsg,
						showCancel: false
					});
					return;
				}
				this.wwiopt({
					url: '/index.php?app=connect&wwi=wechat_code',
					data: {
						code: _this.wcode,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						invite: invite
					},
					method:"POST",
					success: res => {
						var data = res.data.datas;
						if (!data.error) {

							if (typeof(data.key) == 'undefined') {
								return false;
							} else {
								// 更新cookie购物车
								_this.updateCookieCart(data.key);
								uni.setStorageSync('username', data.username);
								uni.setStorageSync('userid', data.userid);
								uni.setStorageSync('key', data.key);
								var page = getCurrentPages();
								if (page.length > 1) {
									uni.navigateBack();
								} else {
									uni.switchTab({
										url: '/pages/index'
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
				// #endif
				// #ifdef H5||APP-PLUS
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
				// #endif
			},
			loginRes(){
				var _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						_this.wcode = loginRes.code;
					}
				});
			},
			reg: function() {
				uni.redirectTo({
					url: '/pages/web/register'
				})
			},
			oauth:function(provider){
				// #ifdef H5
				location.href = provider;
				// #endif
				
				// #ifdef APP-PLUS
				var that =this;
				uni.login({
					provider: provider.id,
					success: (res) => {
						console.log('login success:', JSON.stringify(res));
						var inf = plus.push.getClientInfo();
						if(plus.os.name == 'iOS') {
							var client = 'ios';
							var cid = inf.clientid;
							var apn = inf.token;
						}else{
							var client = 'android';
							var cid= inf.clientid;
							var apn='';
						}
						var invite =uni.getStorageSync('invite')?uni.getStorageSync('invite'):'0';
						uni.getUserInfo({
							provider: provider.id,
							success: (result) => {
								console.log('getUserInfo success', JSON.stringify(result.userInfo));
								if(provider.id=='qq'){
									that.wwiopt({
										url:"/index.php?app=connect&wwi=get_qq_shopwwi",
										data:{openid:result.userInfo.openId,nickname:result.userInfo.nickName,headimgurl:result.userInfo.avatarUrl,client:client,apn:apn,cid:cid,inviteid:invite},
										success: res => {
											console.log(JSON.stringify(res))
										var data = res.data.datas;
										if (!data.error) {
											if (typeof(data.key) == 'undefined') {
												return false;
											} else {
												// 更新cookie购物车
												that.updateCookieCart(data.key);
												uni.setStorageSync('username', data.username);
												uni.setStorageSync('userid', data.userid);
												uni.setStorageSync('key', data.key);
												var page = getCurrentPages();
												if (page.length > 1) {
													uni.navigateBack();
												} else {
													uni.switchTab({
														url: '/pages/index'
													});
												}
											}
										} else {
											uni.showModal({
												content: data.error,
												confirmText: '我知道了'
											});
										}
										}
									})
								}else if(provider.id=='weixin'){
									that.wwiopt({
										url:"/index.php?app=connect&wwi=get_wx_shopwwi",
										data:{openid:result.userInfo.openId,nickname:result.userInfo.nickName,headimgurl:result.userInfo.avatarUrl,unionid:result.userInfo.unionId,client:client,apn:apn,cid:cid,inviteid:invite},
										success: res => {
										var data = res.data.datas;
										if (!data.error) {
											if (typeof(data.key) == 'undefined') {
												return false;
											} else {
												// 更新cookie购物车
												that.updateCookieCart(data.key);
												uni.setStorageSync('username', data.username);
												uni.setStorageSync('userid', data.userid);
												uni.setStorageSync('key', data.key);
												var page = getCurrentPages();
												if (page.length > 1) {
													uni.navigateBack();
												} else {
													uni.switchTab({
														url: '/pages/index'
													});
												}
											}
										} else {
											uni.showModal({
												content: data.error,
												confirmText: '我知道了'
											});
										}
										}
									})
								}else if(provider.id=='sinaweibo'){
									that.wwiopt({
										url:"/index.php?app=connect&wwi=get_sina_shopwwi",
										data:{id:result.userInfo.id,screen_name:result.userInfo.screen_name,avatar_large:result.userInfo.avatar_large,client:client,apn:apn,cid:cid,inviteid:invite},
										success: res => {
										var data = res.data.datas;
										if (!data.error) {
											if (typeof(data.key) == 'undefined') {
												return false;
											} else {
												// 更新cookie购物车
												that.updateCookieCart(data.key);
												uni.setStorageSync('username', data.username);
												uni.setStorageSync('userid', data.userid);
												uni.setStorageSync('key', data.key);
												var page = getCurrentPages();
												if (page.length > 1) {
													uni.navigateBack();
												} else {
													uni.switchTab({
														url: '/pages/index'
													});
												}
											}
										} else {
											uni.showModal({
												content: data.error,
												confirmText: '我知道了'
											});
										}
										}
									})
								}

							},
							fail: (error) => {
								console.log('getUserInfo fail', error);
								let content = error.errMsg;
								if (~content.indexOf('uni.login')) {
									content = '请在登录页面完成登录操作';
								}
								uni.showModal({
									title: '获取用户信息失败',
									content: '错误原因' + content,
									showCancel: false
								});
							}
						});
					},
					fail: (err) => {
						console.log('login fail:', err);
					}
				});
				// #endif
				
			}
		},
		onShow: function() {
			var key = uni.getStorageSync('key');
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
			// #ifdef MP-WEIXIN
			this.loginRes();
			// #endif
			
			// #ifdef H5
			document.title = '登入-'+this.siteTitle;
			// #endif
		},
		onLoad:function(){
			// #ifdef H5
			this.wwiopt({
				url: '/index.php?app=connect&wwi=get_state',
				success: res => {
					var ref_url = document.referrer;
					if (ref_url) {
						ref_url = ref_url.replace("timeline", '0');
						ref_url = ref_url.replace("groupmessage", '0');
						ref_url = ref_url.replace("singlemessage", '0');
						ref_url = ref_url.replace("isappinstalled", '1');
						ref_url = encodeURIComponent(ref_url);
					}
					var invite =uni.getStorageSync('invite')?uni.getStorageSync('invite'):'0';
					var ua = navigator.userAgent.toLowerCase();
					var allow_login = 0;
					if (res.data.datas.pc_qq == '1') {
						allow_login = 1;
						var url = this.ApiUrl+'/index.php?app=connect&wwi=get_qq_oauth2&ref_url='+ref_url+'&inviteid='+invite;
						this.providerList.push({
									name: 'QQ',
									icon: 'QQ',
									url: url
						})
					}
					if (res.data.datas.pc_sn == '1') {
						allow_login = 1;
						var url = this.ApiUrl+'/index.php?app=connect&wwi=get_sina_oauth2&ref_url='+ref_url+'&inviteid='+invite;
						this.providerList.push({
									name: '微博',
									icon: 'xinlangweibo',
									url: url
						})
					}
					if ((ua.indexOf('micromessenger') > -1) && res.data.datas.connect_wap_wx == '1') {
						allow_login = 1;
						var url = this.ApiUrl+'/index.php?app=connect&wwi=index&ref_url='+ref_url+'&inviteid='+invite;
						this.providerList.push({
									name: '微信',
									icon: 'weixinicon',
									url: url
						})
					}
				}
			});
			this.initPosition();
			// #endif
			
			// #ifdef APP-PLUS
			uni.getProvider({
				service: 'oauth',
				success: (e) => {
					console.log('oauth..........');
					this.providerList = e.provider.map((value) => {
						let providerName = '';
						let iconset = '';
						switch (value) {
							case 'weixin':
								providerName = '微信登录';
								iconset= 'weixinicon';
								break;
							case 'qq':
								providerName = 'QQ登录';
								iconset= 'QQ';
								break;
							case 'sinaweibo':
								providerName = '微博登录';
								iconset= 'xinlangweibo';
								break;
							case 'xiaomi':
								providerName = '小米登录';
								iconset= 'xinlangweibo';
								break;
							case 'baidu':
								providerName = '百度登录';
								iconset= 'xinlangweibo';
								break;
							case 'alipay':
								providerName = '支付宝登录';
								iconset= 'xinlangweibo';
								break;
						}
						return {
							name: providerName,
							icon:iconset,
							id: value
						}
					})
				},
				fail: (e) => {
					console.log("获取登录通道失败", e);
				}
			});
			this.positionTop = uni.getSystemInfoSync().windowHeight - 200;
			// #endif
			
		},
		onNavigationBarButtonTap:function(e){
			if(e.index==0){
				this.reg()
				}
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
	.action-row{color: #888888;}
	
</style>
