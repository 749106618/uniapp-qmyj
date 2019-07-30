<template>
	<view>
		正在加载…
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad:function(e){
			alert('支付操作完成！如果您的订单状态没有改变，请耐心等待支付网关的返回结果。');
			if(e.attach=='v'){
				uni.redirectTo({
					url: '/pages/my/vrorderList'
				});
			}else if(e.attach=='p'){
				uni.redirectTo({
					url: '/pages/my/pdrlist'
				});
			}else{
				uni.redirectTo({
					url: '/pages/my/orderlist?pay=wxpay_jsapi'
				});
			}
		}
		
	}
</script>

<style>

</style>
