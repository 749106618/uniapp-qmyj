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
			alert('Sorry，支付未完成或失败！');
			if(e.attach=='v'){
				uni.redirectTo({
					url: '/pages/my/vrorderlist'
				});
			}else if(e.attach=='p'){
				uni.redirectTo({
					url: '/pages/my/pdrlist'
				});
			}else{
				uni.redirectTo({
					url: '/pages/my/orderlist'
				});
			}
		}
		
	}
</script>

<style>

</style>
