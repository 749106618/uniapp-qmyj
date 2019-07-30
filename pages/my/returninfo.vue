<template>
	<view>
	 <view class="wwiapp-default-list-tit">我的退款申请</view>
      <view class="wwi-default-list">
		<view class="li border">
				<view class="a">
					<view class="h4">退款编号</view>
				</view>
					<view class="right">{{info.return_info.refund_sn}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">退款原因</view>
					</view>
					<view class="right">{{info.return_info.reason_info}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">退款金额</view>
					</view>
					<view class="right">{{info.return_info.refund_amount}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">退款说明</view>
					</view>
					<view class="right">{{info.return_info.buyer_message}}
						</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">凭证上传</view>
					</view>
					<view class="right">
						<block v-for="item in info.pic_list">
						<image :src="item" class="img"></image></block></view>
			</view>
	  </view>
	 <view class="wwiapp-default-list-tit">商家退款处理</view>
      <view class="wwi-default-list">
		<view class="li border">
				<view class="a">
					<view class="h4">审核状态</view>
				</view>
					<view class="right">{{info.return_info.seller_state}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">商家备注</view>
				</view>
					<view class="right">{{info.return_info.seller_message}}</view>
			</view>
		</view>	
	 <view class="wwiapp-default-list-tit">商城退款审核</view>
      <view class="wwi-default-list">
		<view class="li border">
				<view class="a">
					<view class="h4">平台确认</view>
				</view>
					<view class="right">{{info.return_info.admin_state}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">平台备注</view>
				</view>
					<view class="right">{{info.return_info.admin_message}}</view>
			</view>
		</view>	
		
		<block v-if="info.detail_array">
	 <view class="wwiapp-default-list-tit">商城退款审核</view>
      <view class="wwi-default-list">
		<view class="li border">
				<view class="a">
					<view class="h4">支付方式</view>
				</view>
					<view class="right">{{info.detail_array.refund_code}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">在线退款金额</view>
				</view>
					<view class="right">{{info.detail_array.pay_amount}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">预存款返还金额</view>
				</view>
					<view class="right">{{info.detail_array.pd_amount}}</view>
			</view>
		<view class="li border">
				<view class="a">
					<view class="h4">充值卡返还金额</view>
				</view>
					<view class="right">{{info.detail_array.rcb_amount}}</view>
			</view>
		</view>	
		</block>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				rid:'',
				info: {
					return_info:[],
					detail_array:[],
					pic_list:[]
				}
			};
		},
		methods: {
			
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=member_return&wwi=get_return_info',
					data: {key:this.key,return_id:this.rid},
					success: res => {
						this.info = res.data.datas;
					}
				});
			}
		},
		onLoad: function(e) {
			if (e.id) {
				this.rid = e.id;
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
