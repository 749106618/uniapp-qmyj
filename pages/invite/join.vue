<template>
	<view class="join-invite">
		<view class="tips">请认真填写收款信息，一经填写将不允许修改</view>
		<view class="join-body">
			<view class="input-row border">
				<text class="title">用户名：</text>
				<input type="text" :value="info.user_name" disabled="true">
			</view>
			<view class="input-row border">
				<text class="title">手机号：</text>
				<input type="text" :value="info.member_mobile" disabled="true">
				<navigator url="/pages/my/mobile" class="step-no" v-if="!info.member_mobile_bind">点击绑定</navigator>
			</view>
			<view class="input-row border">
				<text class="title">结算类型：</text>
				<view class="lk-btn flex flexrow flexAic"><view class="span" :class="{'ok':bill_type_code=='bank'}" @click="typeCode('bank')">银行账号</view><view class="span" :class="{'ok':bill_type_code=='alipay'}" @click="typeCode('alipay')">支付宝</view></view>
			</view>
			<view class="input-row border">
				<text class="title">收款人：</text>
				<input type="text" v-model="bill_user_name" placeholder="请填写收款人">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="bill_user_name.length > 0" @click="bill_user_name=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">收款账号：</text>
				<input type="text" v-model="bill_type_number" placeholder="请填写收款账号">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="bill_type_number.length > 0" @click="bill_type_number=''"></view>
			</view>
			<view class="input-row border" v-if="bill_type_code=='bank'">
				<text class="title">开户行：</text>
				<input type="text" v-model="bill_bank_name" placeholder="请填写开户行信息">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="bill_bank_name.length > 0" @click="bill_bank_name=''"></view>
			</view>
			</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="nextGo">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bill_user_name:'',
				bill_type_number:'',
				bill_type_code:'bank',
				bill_bank_name:'',
				key:'',
				info:''
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: '/index.php?app=member_invite&wwi=index',
					method: 'GET',
					data: {key:this.key},
					success: res => {
						if(res.data.datas.error){
							uni.showToast({
								title: '数据错误',icon:"none"
							});
							return false;
						}
						this.info = res.data.datas.invite_info;
					}
				});
			},
			typeCode:function(e){
				if(e==this.bill_type_code){
					return false;
				}
				this.bill_type_code = e;
			},
			nextGo:function(){
				if(!this.info.member_mobile_bind){
					uni.showToast({
						title: '请先绑定手机号码操作',icon:"none"
					});
					return false;
				}
				if(this.bill_user_name.length < 1){
					uni.showToast({
						title: '请填写收款人',icon:"none"
					});
					return false;
				}
				if(this.bill_type_number.length < 5){
					uni.showToast({
						title: '请填写收款账号',icon:"none"
					});
					return false;
				}
				uni.request({
					url: this.ApiUrl + '/index.php?app=member_invite&wwi=join_step',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {key:this.key,bill_user_name:this.bill_user_name,bill_type_number:this.bill_type_number,bill_type_code:this.bill_type_code,bill_bank_name:this.bill_bank_name},
					success: res => {
						if(res.data.datas.error){
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
							return false;
						}
						uni.showToast({
							title: '申请成功',icon:"none",
							success() {
								setTimeout(function() {
									var page = getCurrentPages();
									if(page.length > 1){
									  uni.navigateBack();
									}else{
									  uni.switchTab({  url:'/pages/index' });
									}
								}, 1000);
							}
						});
						
					}
				});
			}
		},
		onLoad:function(){
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0)
			}
			this.Inlimine();
			// #ifdef H5
			document.title = '申请推广员-'+this.siteTitle;
			// #endif
			
		}
	}
</script>

<style>
page{background: #FFFFFF;}
.join-invite .tips{display: flex; align-items: center; justify-content: center; padding: 20upx 0; font-size: 28upx; color: #BBBBBB;}
.join-invite .join-body{background: #FFFFFF; padding: 20upx;}
.join-invite .input-row .title {width: 200upx;}
.join-invite .input-row input {	width: 470upx;}
.join-invite .input-row input.code {	width: 260upx;}
.join-invite .input-row .step-no{width: 140upx; font-size: 28upx; display: flex; align-items: center; color: #FF0036; position: absolute; right: 0; height: 100%;z-index: 2;}
.lk-btn{}
.lk-btn .span{ background: #E0E0E0; padding: 5upx 20upx; color: #FFFFFF;}
.lk-btn .span.ok{background: #607d8b;}
</style>
