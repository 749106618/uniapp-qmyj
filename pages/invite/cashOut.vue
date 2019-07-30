<template>
	<view>
		<view class="wwiapp-asset-info" style="background: #009688;">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">可提现佣金</view>
				<view class="dd"><view class="em">{{my.tradc_amount}}</view></view>
			</view>
			
	</view>
	<view class="box-ling">1</view>
		</view>
		<view class="input-group">
			<form @submit="formSubmit">
			<view class="input-row border">
				<text class="title">开户人姓名：</text>
				<input type="text" :value="my.tradc_bank_user" disabled="true">
			</view>
			<view class="input-row border">
				<text class="title">收款银行：</text>
				<input type="text" :value="my.tradc_bank_name" disabled="true">
			</view>
			<view class="input-row border">
				<text class="title">收款账号：</text>
				<input type="text" :value="my.tradc_bank_no" disabled="true">
			</view>
			<view class="input-row border">
				<text class="title">提现金额：</text>
				<input type="number" v-model="cash_amount" name="cash_amount" placeholder="请输入提现金额">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="cash_amount.length > 0" @click="cash_amount=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">支付密码：</text>
				<input type="text" v-model="pay_pwd" :password="showPassword" name="pay_pwd" placeholder="请填写本站支付密码">
				<view class="wwi-icon " :class="[{'wwi-icon-yanjing_yincang':!showPassword,'wwi-icon-yanjing_xianshi':showPassword}]"
				@click="showPassword=!showPassword"></view>
			</view>
			<view class="btn-row">
			<button  type="primary" class="wwibtn" formType="submit" :disabled="pay_pwd.length>0 && cash_amount.length>0? false:true">提交</button>
			</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				my:[],
				cash_amount:'',
				pay_pwd:'',
				showPassword:true
			}
		},
		methods:{
			Inlimine:function() {
				this.wwiopt({
					url: '/index.php?app=member_distri&wwi=cash_apply_amout',
					data: {key:this.key},
					success: res => {
						this.my = res.data.datas;
					}
				});
				
			},
			formSubmit:function(e) {
                 if(parseInt(this.amount) > parseInt(this.my.tradc_amount)){
					 uni.showToast({
					 	title: '可用提现金额不足，请重新输入',icon:"none"
					 });
				 }
				var param = {};
				var	param = e.detail.value;
				    param.key = this.key;
				uni.request({
					url: this.ApiUrl+"/index.php?app=member_distri&wwi=cash_apply",
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: param,
					success: res => {
                        if(res.data.code == 200){
							uni.showToast({
								title: '提现成功',icon:"none",
								success() {
									setTimeout(function(){
										var page = getCurrentPages();
										if(page.length > 1){
										  uni.navigateBack();
										}else{
										  uni.switchTab({  url:'/pages/index' });
										}
									},1000); 
									
								}
							});
                        }else{
							uni.showToast({
								title: res.data.datas.error,
								icon:"none"
							});
						}
					}
				});
			}
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0)
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0)
			}
			// #ifdef H5
			document.title = '佣金提现-'+this.siteTitle;
			// #endif
			
		}
	}
</script>

<style>
	.input-group{padding: 20upx; margin: 0;}
	.input-row .title {width: 200upx;padding-left: 20upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
</style>
 