<template>
	<view class="content">
		<view class="input-s-title">发货{{delayDay}}天后，当商家选择未收到则要进行延迟时间操作；如果超过{{confirmDay}}天不处理按弃货处理，直接由管理员确认退款。</view>
		<view class="input-group">
		</view>
		<view class="btn-row">
			<button type="primary" class="primary"></button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				delayDay:'20',
				confirmDay:'30'
			};
		},
		methods: {
			Inlimine() {
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
.wwi-default-list .li .right{font-size: 28upx; margin-right: 20upx; display: flex; justify-content: flex-end;}
.wwi-default-list .li .right .img{width: 100upx; height: 100upx; margin-right: 20upx;}
.wwiapp-default-list-tit{padding: 20upx; font-size: 32upx;}
</style>
