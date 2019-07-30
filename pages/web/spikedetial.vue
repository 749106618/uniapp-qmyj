<template>
	<view class="newBody maxBody">
		<view class="skill-ban">
			<image :src="spikeInfo.spike_banner" mode="widthFix"></image>
			<view class="flex flexrow flexAic flexJcc" style="background:#795548; padding:20upx 0; ">
				<view class="endTime">距结束:</view>
				<view style="font-size: 36upx;">
				<wwi-count-down :timer="spikeInfo.to_time" v-if="spikeInfo.to_time > 0" borderColor="#FFFFFF" splitorColor="#FFF" fontColor="#FFFFFF" bgrColor="none"></wwi-count-down></view>
			</view>
			
		</view>
		<view class="goods-list">
			<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="item flex flexrow" v-for="(item,index) in goodsList" :key="index">
				<view class="skill-pic">
					<image :src="item.goods_img_url"></image>
				</view>
				<view class="goods-info flex flexcol">
					<view class="goods-title">{{item.goods_name}}</view>
					<view class="g-price flex flexrow"><view class="i">&yen;</view>{{item.spike_price}}</view>
					<view class="skill-price flex flexrow flexJcs"><view class="oldprice">&yen;{{item.goods_price}}</view>
					<view class="skill-lod flex flexrow">
						已秒{{item.spike_percent}}%<view class="span"><progress :percent="item.spike_percent" stroke-width="10" color="#ff0036" active/></view></view></view>
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
				spikeId:'',
				curpage:'',
				hasmore:true,
				goodsList:[],
				spikeInfo:[],
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
					url: '/index.php?app=spike&wwi=spike_brands',
					data: {page:10,curpage:this.curpage,brand_id:this.spikeId},
					success: res => {
						this.curpage +=1;
						if(this.info_stat){
							this.spikeInfo = res.data.datas.spike_info;
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
			this.spikeId = e.id;
			this.Inlimine();				
			}
		},
		onReachBottom:function(){
			this.Inlimine();
		}
	}
</script>

<style>
.skill-ban image{width: 100%; vertical-align: middle;}
.goods-list{background: #fff; padding: 20upx;}
.goods-list .item{padding: 20upx 0; border-bottom: 1px solid #eee;}
.goods-list .item .skill-pic{width: 180upx; height: 180upx;}
.goods-list .item .skill-pic image{width: 180upx; height: 180upx;}
.goods-list .item .goods-info{flex: 1; margin-left: 20upx;}
.goods-list .item .goods-info .goods-title{height: 80upx;overflow: hidden;font-size: 30upx;color: #252525;line-height: 40upx;margin-bottom: 10upx;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
.goods-list .item .goods-info .g-price{color: #FF0036;font-size: 36upx; align-items: baseline;}
.goods-list .item .goods-info .g-price .i{font-size: 24upx;}
.goods-list .item .goods-info .skill-price .oldprice{color: #777; text-decoration: line-through; font-size: 24upx;}
.goods-list .item .goods-info .skill-lod{font-size: 24upx;align-items: center; color: #777;}
.goods-list .item .goods-info .skill-lod .span{width: 140upx; margin-left: 20upx;}
.endTime{color: #fff; font-size: 24upx;}
</style>
