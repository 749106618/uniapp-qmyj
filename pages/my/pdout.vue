<template>
	<view>
		<view class="wwiapp-asset-info pre">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">我的余额</view>
				<view class="dd"><view class="em">{{pdCount}}</view></view>
			</view>
			
	</view>
	<view class="box-ling">1</view>
		</view>
		<view class="input-group">
			<form @submit="formSubmit">
			<view class="input-row border">
				<text class="title">提现金额：</text>
				<input type="number" v-model="amount" name="amount" placeholder="请输入提现金额">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="amount.length > 0" @click="amount=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">收款银行：</text>
				<input type="text" v-model="bankname" name="bankname" placeholder="请填写银行名称或支付宝">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="bankname.length > 0" @click="bankname=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">收款账号：</text>
				<input type="text" v-model="bankno" name="bankno" placeholder="请填写银行账号或支付宝账号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="bankno.length > 0" @click="bankno=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">开户人姓名：</text>
				<input type="text" v-model="bankuser" name="bankuser" placeholder="请填写真实姓名">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="bankuser.length > 0" @click="bankuser=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">支付密码：</text>
				<input type="text" v-model="password"  password name="password" placeholder="请填写本站支付密码">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="password.length > 0" @click="password=''"></view>
			</view>
			<view class="btn-row">
			<button  type="primary" class="primary" formType="submit":disabled="password.length>0 && bankname.length>0 && amount.length>0  && bankno.length>0 ? false:true">提交</button>
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
				pdCount:0,
				amount:'',
				bankname:'',
				bankno:'',
				bankuser:'',
				password:''
			}
		},
		methods:{
			Inlimine:function() {
				this.wwiopt({
					url: '/index.php?app=member_index&wwi=my_asset',
					data: {key:this.key,fields:'predepoit'},
					success: res => {
						this.pdCount = res.data.datas.predepoit;
					}
				});
				
			},
			formSubmit:function(e) {
                 if(parseInt(this.amount) > parseInt(this.pdCount)){
					 uni.showToast({
					 	title: '可用提现金额不足，请重新输入',icon:"none"
					 });
				 }
				var param = {};
				var	param = e.detail.value;
				    param.key = this.key;
				this.wwiopt({
					url: "/index.php?app=member_fund&wwi=pd_out",
					method: 'POST',
					data: param,
					success: res => {
                        if(res.data.code == 200){
							uni.showToast({
								title: '提现成功',icon:"none",
								success() {
									setTimeout(function(){
										uni.navigateBack();
									},1000); 
									
								}
							});
                    	    //   uni.navigateBack();
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
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		}
	}
</script>

<style>
	.input-group{padding: 20upx; margin: 0;}
	.input-row .title {width: 200upx;padding-left: 20upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
</style>
 