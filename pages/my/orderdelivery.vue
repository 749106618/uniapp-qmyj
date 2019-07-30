<template>
	<view>
     <view class="wwiapp-order-deivery-info">
		 <view class="wwi-icon wwi-icon-huoche"></view>
		 <view class="dl">
			 <view class="dt">物流公司:{{deliverInfo.express_name}}</view>
			 <view class="dd">运单号码:{{deliverInfo.shipping_code}}</view>
		 </view>
	 </view>
	 <view class="wwiapp-order-deivery-con mt5">
		 <view class="timeline-item" v-for="item in deliver_info">
		 <view class="timeline-item-divider"></view>
		 <view class="timeline-item-content">{{item}}</view>
		 </view>
	 </view>
	 <view class="wwiapp-deivery-tip">
		 <view class="span">以上部分信息来自于第三方，仅供参考</view>
		 <view class="span">如需准确信息可联系卖家或物流公司</view>
	 </view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				key:'',
				orderId:'',
				deliverInfo:[],
				deliver_info:[]
			};
		},
		methods:{
			Inlimine(){
						this.wwiopt({
							url:  "/index.php?app=member_order&wwi=search_deliver",
							method: 'POST',
							data: {key:this.key,order_id:this.orderId},
							success: res => {
								let data=res.data && res.data.datas;
								if(!data){
                                        data = {};
                                        data.err = '暂无物流信息';
									this.deliverInfo = data;
									this.deliver_info = data.deliver_info;
								}
							}
						});
				}
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			if(e.oid > 0){
				this.orderId = e.oid;
				this.Inlimine();
			}else{
				uni.showToast({
					title: '数据出错了,请重试',
					icon: "none",
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				});
			}
		}
	}
</script>

<style>
  page{background: #f8f8f8;}
  .wwiapp-order-deivery-info{display: flex; flex-direction: row; background: #FFFFFF; padding: 10upx 20upx;}
  .wwiapp-order-deivery-info .wwi-icon{width: 90upx; display: flex; align-items: center; justify-content: center;}
  .wwiapp-order-deivery-info .dl{flex: 1; display: flex; flex-direction: column;}
  .wwiapp-order-deivery-info .dl .dt{font-size: 32upx;}
  .wwiapp-order-deivery-info .dl .dd{font-size: 28upx;}
  .wwiapp-deivery-tip{font-size: 26upx; color: #999; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 20upx 0;}
  .timeline-item{display: flex;flex-direction: row;position: relative;padding-bottom: 20upx;box-sizing: border-box;overflow: hidden;}
  .wwiapp-order-deivery-con{padding: 30upx 20upx;background-color: #fff;}
.timeline-item-divider {flex-shrink: 0;position: relative;width: 20upx;height: 20upx;top: 15upx;border-radius: 50%;background-color: #bbb;}
.timeline-item-divider::before,.timeline-item-divider::after {position: absolute;left: 10upx;width: 1upx;height: 100vh;content: '';background: inherit;}
.timeline-item-divider::before {bottom: 100%;}
.timeline-item-divider::after {top: 100%;}
.timeline-item-content {padding-left: 20upx; font-size: 28upx; color: #999;}
</style>
