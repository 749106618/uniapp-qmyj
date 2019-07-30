<template>
	<view>
	 <view class="wwiapp-default-list-tit">我的提现单据</view>
      <view class="wwi-default-list">
		<view class="li border">
				<view class="a">
					<view class="h4">申请单号</view>
				</view>
					<view class="right">{{info.tradc_sn}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">提现金额</view>
					</view>
					<view class="right">{{info.tradc_amount}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">收款银行</view>
					</view>
					<view class="right">{{info.tradc_bank_name}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">收款账号</view>
					</view>
					<view class="right">{{info.tradc_bank_no}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">开户人姓名</view>
					</view>
					<view class="right">{{info.tradc_bank_user}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">创建时间</view>
					</view>
					<view class="right">{{info.tradc_add_time_txt}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">提现状态</view>
					</view>
					<view class="right">{{info.tradc_payment_state_txt}}</view>
			</view>
		<view class="li border" v-if="info.tradc_payment_time">
				<view class="a">
					<view class="h4">付款时间</view>
					</view>
					<view class="right">{{info.tradc_payment_time_text}}</view>
			</view>
	  </view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				pid:'',
				info: []
			};
		},
		methods: {
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=member_distri&wwi=cash_info',
					method:"POST",
					data: {key:this.key,tradc_id:this.pid},
					success: res => {
						if(!res.data.datas.error){
							this.info = res.data.datas;
						}else{
							uni.showToast({
								title: res.data.datas.error,icon:"none",
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
						
					}
				});
			}
		},
		onLoad: function(e) {
			if (e.id) {
				this.pid = e.id;
			}
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
			document.title = '佣金提现详情-'+this.siteTitle;
			// #endif
			
		}
	}
</script>

<style>
page{background: #F8F8F8;}
.wwi-default-list .li{flex-direction: row; justify-content: space-between;}
.wwi-default-list .li .a{width: auto; flex: 1;}
.wwi-default-list .li .right{font-size: 28upx; margin-right: 20upx; display: flex; justify-content: flex-end; flex: 1;}
.wwi-default-list .li .right .img{width: 100upx; height: 100upx; margin-right: 20upx;}
.wwiapp-default-list-tit{padding: 20upx; font-size: 32upx;}
</style>
