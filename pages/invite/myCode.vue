<template>
	<view>
		<view class="code-info flex flexcol flexJcc flexAic">
			<view class="image"><image :src="img" mode=""></image></view>
		<view class="">长按上面的二维码，点击识别图中二维码</view>
		<view class="">或打开微信扫描图中二维码</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mid:'',
				img:''
			};
		},
		methods:{
			getCode:function(){
				this.wwiopt({
					url: "/index.php?app=index&wwi=get_invite_wx_code",
					method: 'POST',
					data: {invite_id: this.mid},
					success: res => {
						if(res.data.datas.img){
							this.img = res.data.datas.img;
						}
					}
				});
			}
			
		},
		onLoad:function(e){
			if(e.id){
				this.mid = e.id;
				this.getCode();
			}else{
				uni.showToast({
					title: '页面打开错误',
					icon: 'none',
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
	}
</script>

<style>
.code-info{font-size: 28upx;}
.code-info .image,.code-info .image image{width: 650upx; height: 650upx;}
</style>
