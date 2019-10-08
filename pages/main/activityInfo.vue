<template>
	<view>
		<view class="pic"><image :src="info.activity_banner_url" mode="widthFix"></image></view>
		<view class="activiti-info flex flexcol">
			<view class="hd">{{info.activity_title}}</view>
			<view class="bd">{{info.activity_desc}}</view>
			<view class="list">
				<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="li flex flexcol" v-for="(item,index) in info.list" :key="index">
					<image :src="item.goods_image_url" ></image>
					<view class="title">{{item.goods_name}}</view>
					<view class="span">&yen;{{item.goods_price}}</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avId:'',
				info:{
					list:[]
				}
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: '/index.php?app=activity&wwi=index',
					data: {activity_id:this.avId},
					success: res => {
						if(res.data.datas.error){
							uni.showModal({
								title: '提示',
								content: res.data.datas.error,
								showCancel: false,
								success: res => {
									uni.navigateBack();
								}
							});
							return;
						}
						if(res.data.code==200){
							this.info = res.data.datas;
							uni.stopPullDownRefresh();
						}
					}
				});
			}
		},
		onLoad:function(e){
			if(e.id){
				this.avId = e.id;
				this.Inlimine();
			}else{
				uni.showToast({
					title: '活动ID不存在',
					icon: "none",
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				});
			}
		},
		onPullDownRefresh:function(){
			this.Inlimine()
		}
		
	}
</script>

<style>
	page{background: #FFFFFF;}
.pic{width:100% ;}
.pic image{width: 100%;}
.activiti-info{padding: 20upx;}
.activiti-info .hd{font-size: 32upx; font-weight: bold; margin-bottom: 0.5em;}
.activiti-info .bd{font-size: 28upx; color: #777;}
.activiti-info .list{display: flex; flex-direction: row; flex-wrap: wrap;}
.activiti-info .list .li{margin:10upx; width: 355upx; box-sizing: border-box; flex: 1;}
.activiti-info .list .li image{width: 335upx; height: 335upx;}
.activiti-info .list .li .title{font-size: 28upx; margin: 5upx 0;line-height: 1.25em;max-height: 2.5em;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;}
.activiti-info .list .li .span{color: #FF0036; font-size: 34upx;}
</style>
