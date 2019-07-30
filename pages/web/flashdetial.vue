<template>
	<view class="newBody maxBody">
		<view class="wwi-banner">
			<image :src="flashInfo.flash_banner_url" mode="widthFix"></image>
		</view>
		<view class="time-count">
			<view class="title flex flexAic flexJcc">距离结束还剩</view>
			<view class="time flex flexJcc flexAic">
				<view style="font-size: 32upx; background: #ffffff; position: absolute; z-index: 1; top: 50%; margin-top: -0.6em;">
				<wwi-count-down :timer="flashInfo.to_time" v-if="flashInfo.to_time > 0" borderColor="transparent" splitorColor="#6d6d6d"></wwi-count-down></view>
			</view>
		</view>
		<view class="goods-list flex flexrow">
			<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="li" v-for="(goods,k2) in goodsList" :key="k2">
				<view class="image">
					<image :src="goods.goods_img_url" mode="widthFix" lazy-load></image>
				</view>
				<view class="goods-info">
					<view class="goods-title">{{goods.goods_name}}</view>
					<view class="goods-price flex flexrow flexJcs">
						<view class="flex flexrow flexAic"><view class="em">￥{{goods.flash_price}}</view> <view class="i">{{goods.goods_price}}</view></view>
						<view class="span">{{goods.flash_discount}}</view>
						</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import wwiCountDown from "../../components/wwi-count-down.vue";
	export default {
		data() {
			return {
				flashId:'',
				curpage:'',
				hasmore:true,
				goodsList:[],
				flashInfo:[],
				info_stat:true
			};
		},
		components: {
			wwiCountDown
		},
		methods:{
			Inlimine(){
				if (!this.hasmore) {
					return false;
				}
				this.hasmore = false;
				this.wwiopt({
					url: '/index.php?app=flash&wwi=flash_detial',
					data: {page:10,curpage:this.curpage,flash_id:this.flashId},
					success: res => {
						this.curpage +=1;
						if(this.info_stat){
							this.flashInfo = res.data.datas.flash_info;
							this.info_stat = false;
						}
						res.data.datas.goods_list.forEach(item=>{
							this.goodsList.push(item);
						});
						this.hasmore = res.data.hasmore;
					}
				});
			}
		},
		onLoad:function(e){
			if(e.id){
			this.flashId = e.id;
			this.Inlimine();				
			}else{
				uni.showToast({
					title: '数据不存在或错误',
					icon: 'none',
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				});
			}
		},
		onReachBottom:function(){
			this.Inlimine();
		}
	}
</script>

<style>
	page{background: #FFFFFF;}
.wwi-banner image{width: 100%;}
.time-count{color: #6d6d6d; width: 100%;}
.time-count .title{font-size: 24upx;}
.time-count .time{position: relative; height: 40upx;}
.time-count .time:after{content: ''; width: 100%; height: 1px; background: #eee;position: absolute; top: 50%; z-index: 0;}
.goods-list{flex-wrap: wrap;}
.goods-list .li{width: 375upx; background: #FFFFFF; border-top:1px solid #eee ; box-sizing: border-box; overflow: hidden;}
.goods-list .li:nth-child(even){border-left:1px solid #eee ;}
.goods-list .li .image{width: 335upx; height: 335upx; margin: 20upx;}
.goods-list .li .image image{width: 335upx;}
.goods-list .li .goods-info{margin: 20upx;}
.goods-list .li .goods-info .goods-title{font-size: 26upx; line-height: 34upx; max-height: 68upx; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;}
.goods-list .li .goods-info .goods-price{font-size: 28upx; color: #333;}
.goods-list .li .goods-info .goods-price .span{color: #FF0036; border: 1px solid #FF0036; font-size: 24upx;}
.goods-list .li .goods-info .goods-price .em{}
.goods-list .li .goods-info .goods-price .i{text-decoration: line-through; color: #8c8c8c; font-size: 24upx; margin-left: 10upx;}
</style>
