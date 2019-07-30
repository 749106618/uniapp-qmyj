<template>
	<view>
		<view class="input-group mt10">
			<view class="input-row border">
				<text class="title">退款说明</text>
				<input type="text" v-model="message" placeholder="输入您要退款的说明文字">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="message.length > 0" @click="message=''"></view>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" @tap="nextGo">提交</button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				key: '',
				message: '',
				orderId: 0
			};
		},
		methods: {
			nextGo() {
				if (this.message.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请填写退款说明'
					});
					return;
				}
				this.wwiopt({
					url: "/index.php?app=member_refund&wwi=vr_refund",
					method: 'POST',
					data: {
						key: this.key,
						order_id: this.orderId,
						buyer_message: this.message
					},
					success: res => {
						if (res.data.datas.error) {
							uni.showToast({
								icon: 'none',
								title: res.data.datas.error
							});
							return;
						}
						uni.redirectTo({
							url: '/pages/my/vrorderinfo?id='+this.orderId
						});

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
			if (e.oid) {
				this.orderId = e.oid;
				this.Inlimine();
			} else {
				uni.showToast({
					title: '数据错误,请返回',
					icon: 'none',
					complete() {
						uni.navigateBack()
					}
				});
			}
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
  page{background: #f8f8f8;}
.special-tips{padding: 20upx 50upx;}
.special-tips .p{font-size: 28upx;padding: 10upx 20upx;background: #AAA;color: #FFF;border-radius: 20upx;}
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
	.note{display: flex; flex: 1; flex-direction: column; margin-right: 20upx; justify-content: flex-end; align-items: flex-end;}
	.note .em{font-size: 28upx; font-weight: 600; color: #36BC9B;}
	.note .span{font-size: 24upx;color: #999;}
	.picker{flex: 1;align-items: center; display: flex; font-size: 28upx;}
	.picker .input{flex: 1; width: 100%;}
</style>
