<template>
	<view class="newBody">
		<view class="wwi-top-menu flex flexrow">
			<view class="li" :class="{now:dataState=='spiking'}" @click="paremTabs('spiking')"><view class="span">最后疯抢</view></view>
			<view class="li" :class="{now:dataState=='unspike'}" @click="paremTabs('unspike')"><view class="span">活动预告</view></view>
		</view>
		<view class="spike-list">
				<view v-if="!spikeList.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">未查询到秒杀活动</view>
						</view>
					</view>
				</view>
			<view class="item" v-for="(kk,v) in spikeList" :key="v">
				<view class="brand-skill">
					<view class="brand-bgimg"><image :src="kk.spike_common_bg" mode="widthFix"></image></view>
					<navigator :url="'/pages/web/spikedetial?id='+kk.spike_id" class="brand-tit"></navigator>
					<view class="g-small-list flex flexrow">
						<navigator :url="'/pages/web/item?goodsid='+item2.goods_id" class="li" v-for="(item2,index2) in kk.small_list" :key="index2">
							<image :src="item2.goods_img_url"></image>
							<view class="price flex flexJcs flexAic">
								<view class="dt">￥{{item2.spike_price}}</view>
								<view class="dd">￥{{item2.goods_price}}</view>
							</view>
						</navigator>
					</view>
				</view>
			<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="brand-item flex flexrow" v-for="(item,index) in kk.big_list" :key="index">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataState:'spiking',
				curpage:1,
				hasmore:true,
				spikeList:[]
			};
		},
		methods:{
			Inlimine(){
				if (!this.hasmore) {
					return false;
				}
				this.hasmore = false;
			    var param = {};
				param.page = 10;
				param.curpage = this.curpage;
				param.state = this.dataState;
				this.wwiopt({
					url: '/index.php?app=spike&wwi=spike_list',
					data: param,
					success: res => {
						this.curpage +=1;
						res.data.datas.spike_list.forEach((item)=>{
							var small_list = [] ,big_list=[];
							
							 res.data.datas.recommend_goods[item.spike_id].forEach((k,v)=>{
								 if(v<3){
									 small_list.push(k);
								 }else{
									 big_list.push(k);
								 }
							 })
							this.$set(item, 'small_list', small_list);
							this.$set(item, 'big_list', big_list);
							this.spikeList.push(item);
							
						});
						this.hasmore = res.data.hasmore;
					}
				});
			},
			paremTabs:function(e){
				if(this.dataState == e){
					return false;
				}
				this.dataState = e;
				this.curpage = 1;
				this.hasmore = true;
				this.spikeList=[];
				this.Inlimine();
			}
		},
		onLoad:function(e){
			this.Inlimine();				
		},
		onPullDownRefresh:function(){
			this.curpage = 1;
			this.hasmore =true;
			this.flashList=[];
			this.Inlimine();
			uni.stopPullDownRefresh();
		},
		onReachBottom:function(){
			this.Inlimine();
		}
	}
</script>

<style>
	page{background: #F8F8F8;}
.wwi-top-menu{height: 80upx; position: fixed; z-index: 999;left: 0; right: 0; background: #F8F8F8;}
.wwi-top-menu .li{flex: 1; display: flex; justify-content: center; align-items: center;}
.wwi-top-menu .li .span{border-bottom: 4upx solid #F8F8F8; font-size: 28upx; font-weight: bold;}
.wwi-top-menu .li.now .span{border-color:#FF0036 ; color: #FF0036;}
.spike-list{padding-top:80upx ;}
.spike-list .item{background: #FFFFFF; margin-bottom: 20upx;}
.spike-list .item .brand-skill{position: relative; overflow: hidden;}
.spike-list .item .brand-skill .brand-bgimg{width: 100%;}
.spike-list .item .brand-skill .brand-bgimg image{width: 100%; vertical-align: middle;}
.spike-list .item .brand-skill .brand-tit{width: 100%; height: 100%; z-index: 4; left: 0; right: 0; top: 0; position: absolute;}
.spike-list .item .brand-skill .g-small-list{width: 690upx; z-index: 5; position: absolute;left: 0; top: 232upx; margin: 0 30upx; box-sizing: border-box; overflow: hidden;}
.spike-list .item .brand-skill .g-small-list .li{ position: relative; flex: 1; height: 250upx; display: flex; justify-content: center; align-items: center;}
.spike-list .item .brand-skill .g-small-list .li image{width: 200upx; height: 200upx; margin: 0 auto;}
.spike-list .item .brand-skill .g-small-list .li .price{position: absolute; bottom: 0; height: 40upx; background: rgba(251,237,237,0.6); width: 200upx;}
.spike-list .item .brand-skill .g-small-list .li .price .dt{color: #FF0036; font-size: 24upx;}
.spike-list .item .brand-skill .g-small-list .li .price .dd{color: #777; font-size: 24upx; text-decoration:line-through}

.spike-list .item .brand-item{padding: 20upx; border-bottom: 2upx solid #eee;}
.spike-list .item .brand-item .skill-pic{width: 160upx; height: 160upx;}
.spike-list .item .brand-item .skill-pic image{width: 160upx; height: 160upx;}
.spike-list .item .brand-item .goods-info{flex: 1; margin-left: 20upx;}
.spike-list .item .brand-item .goods-info .goods-title{height: 90upx;overflow: hidden;font-size: 30upx;color: #252525;line-height: 45upx;margin-bottom: 0.25em;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
.spike-list .item .brand-item .goods-info .g-price{color: #FF0036;font-size: 34upx; align-items: baseline;}
.spike-list .item .brand-item .goods-info .g-price .i{font-size: 24upx;}
.spike-list .item .brand-item .goods-info .skill-price .oldprice{color: #777; text-decoration: line-through; font-size: 24upx;}
.spike-list .item .brand-item .goods-info .skill-lod{font-size: 24upx;align-items: center; color: #777;}
.spike-list .item .brand-item .goods-info .skill-lod .span{width: 120upx; margin-left: 20upx;}
</style>
