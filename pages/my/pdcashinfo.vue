<template>
	<view>
	 <view class="wwiapp-default-list-tit">我的提现单据</view>
      <view class="wwi-default-list">
		<view class="li border">
				<view class="a">
					<view class="h4">申请单号</view>
				</view>
					<view class="right">{{info.pdc_sn}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">提现金额</view>
					</view>
					<view class="right">{{info.pdc_amount}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">收款银行</view>
					</view>
					<view class="right">{{info.pdc_bank_name}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">收款账号</view>
					</view>
					<view class="right">{{info.pdc_bank_no}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">开户人姓名</view>
					</view>
					<view class="right">{{info.pdc_bank_user}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">创建时间</view>
					</view>
					<view class="right">{{info.pdc_add_time_text}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">提现状态</view>
					</view>
					<view class="right">{{info.pdc_payment_state_text}}</view>
			</view>
		<view class="li border" v-if="info.pdc_payment_time_text">
				<view class="a">
					<view class="h4">通过时间</view>
					</view>
					<view class="right">{{info.pdc_payment_time_text}}</view>
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
					url: '/index.php?app=member_fund&wwi=pdcashinfo',
					data: {key:this.key,pdc_id:this.pid},
					success: res => {
						this.info = res.data.datas.info;
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
page{background: #F8F8F8;}
.wwi-default-list .li{flex-direction: row; justify-content: space-between;}
.wwi-default-list .li .a{width: auto; flex: 1;}
.wwi-default-list .li .right{font-size: 28upx; margin-right: 20upx; display: flex; justify-content: flex-end; flex: 1;}
.wwi-default-list .li .right .img{width: 100upx; height: 100upx; margin-right: 20upx;}
.wwiapp-default-list-tit{padding: 20upx; font-size: 32upx;}
</style>
