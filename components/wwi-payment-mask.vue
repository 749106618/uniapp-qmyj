<template>
	<view class="wwi-payment-popup newBody">
		<view :class="{'popupMask':showPayMask}" @click="PaymaskClick" catchtouchmove="true"></view>
    <view class="wwi-payment-popup-content bg flex flexcol" :class="{'wwi-payment-popup-view-show':showPayMask}">
	  <view class="wwi-payment-popup-head flex flexcol">
		  <view class="pay-totail flex flexrow">本次交易需在线支付<view class="em">{{payNum}}</view>元</view>
		  <view class="wwi-payment-sn">交易编号:{{paySn}}</view>
	  </view>
		<scroll-view scroll-y class="wwi-payment-popup-main" style="margin: 0.5em 0; box-sizing: border-box;" :style="{'max-height': windowHeight+'px'}">
			<view class="wwi-payment-popup-viddle">
				<block v-if="pdPayShow || rcbPayShow">
				<view class="title">站内支付</view>
				<view v-if="!pdPwdShow" class="pdShowPWD" @click="GosetPwd">未设置支付密码，无法使用站内支付，请先设置支付密码操作!点击设置支付密码</view>
				<view class="pay-Weblist" v-if="pdPwdShow">
					<view class="li" :class="{'ok':rcbPay}" @click="payListslect('rcbPay')" v-if="rcbPayShow"><view class="span">充值卡支付</view><view class="em">(余额:{{rcbPayNum}})</view>
					<view class="wwi-icon wwi-icon-jiaobiaoxuanzhong jb"></view>
					</view>
					<view class="li" :class="{'ok':pdPay}" @click="payListslect('pdPay')" v-if="pdPayShow"><view class="span">预存款支付</view><view class="em">(余额:{{pdPayNum}})</view>
					<view class="wwi-icon wwi-icon-jiaobiaoxuanzhong jb"></view></view>
				</view>
				<view class="title" v-if="rcbPay || pdPay">输入支付密码</view>
				<view class="p-input" v-if="rcbPay || pdPay" style="font-size: 28upx;"><input type="text" password="true" v-model="pdPassword" placeholder="输入支付密码" :disabled="!pdPwdShow" /></view>
				</block>
				<view class="title">在线支付</view>
				<view class="pay-list">
					<view class="li we" :class="{'ok':payCode=='wxpay'}" @click="paymentSlect('wxpay')" v-if="wxpay"><view class="wwi-icon wwi-icon-weixinzhifu we"></view><view class="wwi-icon wwi-icon-jiaobiaoxuanzhong jb"></view></view>
					<view class="li ali" :class="{'ok':payCode=='alipay'}" @click="paymentSlect('alipay')" v-if="alipay"><view class="wwi-icon wwi-icon-zhifubao ali"></view><view class="wwi-icon wwi-icon-jiaobiaoxuanzhong jb"></view></view>
				</view>
			</view>
		</scroll-view>
        <view class="wwi-payment-popup-bottom flex flexJcc flexAic" @click="paymentButton">确认支付</view>
    </view>
	</view>
</template>

<script>
	export default {
	  data() {
		return {
		  showPayMask:false,
		  windowHeight:'',
		  pdPassword:'',
		  paymentCode:'',
		  payCode:'',
		  pdPay:0,
		  pdPayShow:false,
		  pdPayNum:0,
		  rcbPayNum:0,
		  rcbPay:0,
		  rcbPayShow:true,
		  pdPwdShow:true,
		  key:'',
		  payNum:0,
		  app:'',
		  wwi:'',
		  paySn:'',
		  alipay:false,
		  wxpay:false
		};
	  },
	  methods:{
		show(e) {
		  setTimeout(() => {
			this.key = uni.getStorageSync('key');
			this.app= e.app;
			this.wwi = e.wwi;
			this.paySn = e.paySn;
			this.getInfo();
			const res = uni.getSystemInfoSync();
			this.windowHeight = res.screenHeight *0.58;
		  }, 0);
		},
		getInfo:function(){
			if(!this.app && !this.wwi && !this.paySn){
				return false;
			}
			uni.request({
				url: this.ApiUrl+'/index.php?app='+this.app+'&wwi='+this.wwi,
				method: 'POST',
				header: {'content-type': 'application/x-www-form-urlencoded'},
				data: {key:this.key,pay_sn:this.paySn},
				success: res => {
					this.checkLogin(res.data.login);
					if(res.data.datas.error){
						uni.showToast({
							title: res.data.datas.error,icon:"none"
						});
						return false;
					}
					this.payNum = res.data.datas.pay_info.pay_amount;
					if(!res.data.datas.pay_info.member_paypwd){
						this.pdPwdShow = false;
					}
					 if (parseFloat(res.data.datas.pay_info.payed_amount) <= 0) {
							 if (parseFloat(res.data.datas.pay_info.member_available_rcb) != 0) {
								 this.rcbPayShow = true;
								 this.rcbPayNum = parseFloat(res.data.datas.pay_info.member_available_rcb).toFixed(2);
							 }
							 
							 if (parseFloat(res.data.datas.pay_info.member_available_pd) != 0) {
								 this.pdPayShow = true;
								 this.pdPayNum = parseFloat(res.data.datas.pay_info.member_available_pd).toFixed(2);
							 }
					}

             if (!this.isEmptyObject(res.data.datas.pay_info.payment_list)) {
                var readytoWXPay = false;
                var readytoAliPay = false;
								// #ifdef H5
								var ua = navigator.userAgent.toLowerCase();
								if(ua.match(/MicroMessenger/i)=="micromessenger") {
									readytoWXPay = true;
								} else {
									readytoAliPay = true;
								}								
								// #endif
								
								// #ifdef MP-WEIXIN
								readytoWXPay = true;
								// #endif
								
								// #ifdef APP-PLUS
								readytoWXPay = true;
								readytoAliPay = true;
								// #endif

                 for (var i=0; i<res.data.datas.pay_info.payment_list.length; i++) {
                     var _payment_code = res.data.datas.pay_info.payment_list[i].payment_code;
                     if (_payment_code == 'alipay' && readytoAliPay) {
						 this.alipay = true;
						 if(!this.payCode){
							 this.payCode = 'alipay';
							 this.paymentCode = 'alipay'; 
						 }

                     }
                     if (_payment_code == 'wxpay_jsapi' && readytoWXPay) {
                        this.wxpay = true;
						 if(!this.payCode){
							 this.payCode = 'wxpay';
							 this.paymentCode = 'wxpay'; 
						 }
                     }
                 }
             }
					this.showPayMask = true
				}
			});
		},
		paymentButton:function(){
			if(this.payCode == ''){
				uni.showToast({
					title: '请选择在线支付方式',icon:"none"
				});
				return false;
			}
			if(this.pdPay || this.rcbPay){
				if(this.pdPassword == ''){
					uni.showToast({
						title: '请输入支付密码',icon:"none"
					});
					return false;
				}
				uni.request({
					url: this.ApiUrl+'/index.php?app=member_buy&wwi=check_pd_pwd',
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key,password:this.pdPassword},
					success: res => {
                             if (res.data.datas.error) {
								uni.showToast({
									title: res.data.datas.error,icon:"none"
								});
                                 return false;
                             }
							this.goToPayment(this.paySn,this.app == 'member_buy' ? 'pay_new' : 'vr_pay_new');
					}
				});
			}else{
				this.goToPayment(this.paySn,this.app == 'member_buy' ? 'pay_new' : 'vr_pay_new');
			}
		},
		goToPayment(pay_sn,op) {
			if(this.payCode=='wxpay'){
				this.paymentCode = 'wxpay_jsapi';
			}
			// #ifdef H5
			location.href = this.ApiUrl+'/index.php?app=member_payment&wwi='+op+'&key=' + this.key + '&pay_sn=' + pay_sn + '&password=' + this.pdPassword + '&rcb_pay=' + this.rcbPay + '&pd_pay=' + this.pdPay + '&payment_code=' + this.paymentCode;
			// #endif
			// #ifdef MP-WEIXIN
			var _this = this;
			var payvik = op=='pay_new'?'mini_wx_pay3':'mini_wx_vr_pay3';
			uni.login({
					provider: 'weixin',
					success: function(loginRes) {
			uni.request({
				url: _this.ApiUrl+'/index.php?app=member_payment&wwi='+payvik,
				method: 'POST',
				header : {'content-type':'application/x-www-form-urlencoded'},
				data: {key:_this.key,pay_sn:pay_sn,code:loginRes.code,password:_this.pdPassword,rcb_pay:_this.rcbPay,pd_pay:_this.pdPay},
				success: res => {
					if(res.data.datas.error){
						uni.showToast({
							title: res.data.datas.error,icon:"none"
						});
						return false;
						_this.PaymaskConfirm();
					}
						uni.requestPayment({
							timeStamp: res.data.datas.timeStamp,
							nonceStr: res.data.datas.nonceStr,
							package: res.data.datas.package,
							signType: 'MD5',
							paySign: res.data.datas.paySign,
							success: (res) => {
								uni.showToast({
									title: "支付成功"
								})
								_this.PaymaskConfirm();
							},
							fail: (res) => {
								uni.showModal({
									content: "支付失败,原因为: " + res.errMsg,
									showCancel: false
								})
								_this.PaymaskConfirm();
							},
							complete: () => {
								this.loading = false;
							}
						})
				}
			});						
						}
			});
			// #endif
			
			// #ifdef APP-PLUS
			var _this = this;
			if(this.payCode=='wxpay'){
				var payvik = op=='pay_new'?'wx_app_pay3':'wx_app_vr_pay3';
			}else{
				var payvik = op=='pay_new'?'alipay_native_pay':'alipay_native_vr_pay';
			}
			
			uni.request({
				url: _this.ApiUrl+'/index.php?app=member_payment&wwi='+payvik,
				method: 'POST',
				header:{'content-type':'application/x-www-form-urlencoded'},
				data: {pay_sn:pay_sn,key:_this.key},
				success: res => {
					if(res.data.datas.error){
						uni.showModal({
							title: '提示',
							content: '支付失败，请稍后重新支付',
							showCancel: false,
							success: res => {
								_this.PaymaskConfirm();
							}
						});
					}
					if(_this.payCode=='wxpay'){
						 var orderinfo = res.data.datas;
					}else{
						 var orderinfo = res.data.datas.signStr;
						 console.log(res.data.datas.signStr);
					}
					uni.requestPayment({
						provider: _this.payCode,
						orderInfo: orderinfo,
						success: ress => {
							if(ress.data.datas.error){
								uni.showModal({
									title: '提示',
									content: '支付失败，请稍后重新支付',
									showCancel: false,
									success: res => {
										_this.PaymaskConfirm();
									}
								});
								return;
							}
								uni.showModal({
									title: '提示',
									content: '订单支付成功',
									showCancel: false,
									success: res => {
										_this.PaymaskConfirm();
									}
								});
						},
						fail: (e) => {
								uni.showModal({
									title: '提示',
									content: '支付失败，原因是:'+e.errMsg,
									showCancel: false,
									success: res => {
										_this.PaymaskConfirm();
									}
								});
						}
					});
				}
			});
			// #endif

        },
		paymentSlect:function(e){
			if(this.payCode== e){
				return false;
			}
			this.payCode = e;
			this.paymentCode = e;
		},
		payListslect:function(e){
			if(e=='pdPay'){
				this.pdPay = !this.pdPay;
			}else{
				this.rcbPay = !this.rcbPay;
			}
		},
		GosetPwd:function(){
			uni.navigateTo({
				url: '/pages/my/paypwd',
				success: res => {this.PaymaskCancel();}
			});
		},
		PaymaskClick() {
		  this.PaymaskCancel();
		},
		PaymaskCancel() {
		  this.showPayMask = false;
		  this.$emit('onCancel');
		},
		PaymaskConfirm(e) {
		  this.showPayMask = false;
		  this.$emit('onConfirm');
		},
	  }
	}
</script>

<style>
.wwi-payment-popup{color: #21285d;}
.wwi-payment-popup .popupMask {position: fixed;z-index: 998;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.6);}
.wwi-payment-popup .wwi-payment-popup-content {position: fixed;bottom: 0;left: 0;width: 100%;transition: all 0.3s ease;transform: translateY(100%);z-index: 999;max-height: 100%; background: #FFFFFF;}
.wwi-payment-popup .wwi-payment-popup-view-show {transform: translateY(0);}
.wwi-payment-popup .wwi-payment-popup-head {padding: 25upx 20upx;background-color: #fff;min-height: 110upx;}
.wwi-payment-popup .wwi-payment-popup-head .pay-totail{ font-size: 30upx; height: 70upx; align-items: center; justify-content: center; width: 100%;}
.wwi-payment-popup .wwi-payment-popup-head .pay-totail .em{color: #FF0036; font-size: 42upx; margin:0 10upx; font-weight: bold;}
.wwi-payment-popup .wwi-payment-popup-head .wwi-payment-sn{font-size: 24upx; height: 40upx; display: flex; align-items: center; justify-content: center; color: #d5d5d6;}
.wwi-payment-popup .wwi-payment-popup-bottom{padding:10upx 30upx;background-color: #fff;text-align: center;font-size: 32upx;background: #FF0036; color: #fff;  height: 64upx; min-height: 64upx;}
.wwi-payment-popup .wwi-payment-popup-viddle{padding:0 20upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .title{font-size: 30upx; font-weight:bold; margin-bottom: 20upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist{display: flex; flex-direction: row; margin-bottom: 20upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li{width: 50%; border: 1px solid #eee; padding: 10upx 0; display: flex; flex-direction: column; align-items: center; position: relative; color: #607d8b; box-sizing: border-box;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li:first-child{margin-right: 20upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li .span{font-size: 32upx; line-height: 40upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li .em{font-size: 24upx; line-height: 40upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li .jb{position: absolute; right: -0.13em; bottom: -0.13em; font-size: 50upx;color:#eee;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li.ok{border-color:#12194C; color: #12194C;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-Weblist .li.ok .jb{color:#12194C;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list{display: flex; flex-direction: row; margin-bottom: 20upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .li:first-child{margin-right: 20upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .li{width: 50%; box-sizing: border-box; border: 1px solid #EEEEEE; padding: 20upx 0; display: flex; flex-direction: column; align-items: center;position: relative;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .li .ali{color: #607d8b; font-size: 80upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .li .we{color: #607d8b; font-size: 80upx;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .li .jb{position: absolute; right: -0.13em; bottom: -0.13em; font-size: 60upx; color: #eee;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .we.ok{border-color:#02ac21;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .we.ok .we{color: #02ac21;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .we.ok .jb{color: #02ac21;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .ali.ok{border-color:#00adf4;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .ali.ok .ali{color: #00adf4;}
.wwi-payment-popup .wwi-payment-popup-viddle .pay-list .ali.ok .jb{color: #00adf4;}
.wwi-payment-popup .pdShowPWD{color: #FF0036; font-size: 28upx;}
</style>
