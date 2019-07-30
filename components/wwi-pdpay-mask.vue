<template>
	<view class="wwi-payment-popup newBody">
		<view :class="{'popupMask':showPayMask}" @click="PaymaskClick" catchtouchmove="true"></view>
    <view class="wwi-payment-popup-content bg flex flexcol" :class="{'wwi-payment-popup-view-show':showPayMask}">
	  <view class="wwi-payment-popup-head flex flexcol">
		  <view class="pay-totail flex flexrow">本次充值需在线支付<view class="em">{{payNum}}</view>元</view>
		  <view class="wwi-payment-sn">充值编号:{{paySn}}</view>
	  </view>
		<scroll-view scroll-y class="wwi-payment-popup-main" style="margin: 0.5em 0; box-sizing: border-box;" :style="{'max-height': windowHeight+'px'}">
			<view class="wwi-payment-popup-viddle">
				<view class="title">在线支付</view>
				<view class="pay-list">
					<view class="li we" :class="{'ok':payCode=='wxpay'}" @click="paymentSlect('wxpay')" v-if="wxpay"><view class="wwi-icon wwi-icon-weixinzhifu we"></view><view class="wwi-icon wwi-icon-jiaobiaoxuanzhong jb"></view></view>
					<view class="li ali" :class="{'ok':payCode=='alipay'}" @click="paymentSlect('alipay')" v-if="alipay"><view class="wwi-icon wwi-icon-zhifubao ali"></view><view class="wwi-icon wwi-icon-jiaobiaoxuanzhong jb"></view></view>
				</view>
			</view>
		</scroll-view>
        <view class="wwi-payment-popup-bottom" @click="paymentButton">确认支付</view>
    </view>
	</view>
</template>

<script>
	export default {
	  data() {
		return {
		  showPayMask:false,
		  windowHeight:'',
			paymentCode:'',
		  payCode:'',
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
								readytoWXPay = true;
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
					title: '请选择在线充值方式',icon:"none"
				});
				return false;
			}
				this.goToPayment(this.paySn);
		},
		goToPayment(pay_sn,op) {
			if(this.payCode=='wxpay'){
				this.paymentCode = 'wxpay_jsapi';
			}
			// #ifdef H5
             location.href = this.ApiUrl+'/index.php?app=member_payment&wwi=pay_new&key=' + this.key + '&pay_sn=' + pay_sn + '&pdr=1&payment_code=' + this.paymentCode;
            // #endif
			// #ifdef MP-WEIXIN
			var _this = this;
			uni.login({
					provider: 'weixin',
					success: function(loginRes) {
			uni.request({
				url: _this.ApiUrl+'/index.php?app=member_payment&wwi=pay_new',
				method: 'POST',
				header : {'content-type':'application/x-www-form-urlencoded'},
				data: {key:_this.key,pay_sn:pay_sn,code:loginRes.code},
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
					console.log(res.data)
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
.wwi-payment-popup .wwi-payment-popup-head {padding: 25upx 20upx;background-color: #fff;}
.wwi-payment-popup .wwi-payment-popup-head .pay-totail{ font-size: 30upx; height: 70upx; align-items: center; justify-content: center; width: 100%;}
.wwi-payment-popup .wwi-payment-popup-head .pay-totail .em{color: #FF0036; font-size: 42upx; margin:0 10upx; font-weight: bold;}
.wwi-payment-popup .wwi-payment-popup-head .wwi-payment-sn{font-size: 24upx; height: 40upx; display: flex; align-items: center; justify-content: center; color: #d5d5d6;}
.wwi-payment-popup .wwi-payment-popup-bottom{padding:10upx 30upx;background-color: #fff;text-align: center;font-size: 32upx;background: #FF0036; color: #fff;  height: 64upx;}
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
