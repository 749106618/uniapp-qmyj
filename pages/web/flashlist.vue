<template>
	<view class="newBody maxBody">
		<view class="wwi-top-menu flex flexrow">
			<view class="li" :class="{now:dataState==''}" @click="paremTabs('')"><view class="span">今日上新</view></view>
			<view class="li" :class="{now:dataState=='oldflash'}" @click="paremTabs('oldflash')"><view class="span">最后疯抢</view></view>
			<view class="li" :class="{now:dataState=='unflash'}" @click="paremTabs('unflash')"><view class="span">活动预告</view></view>
		</view>
		<view class="brand-list">
				<view v-if="!flashList.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">未查询到闪购活动</view>
						</view>
					</view>
				</view>
				<navigator :url="'/pages/web/flashdetial?id='+item.flash_id" class="item" v-for="(item,index) in flashList" :key="index">
					<view class="pic-from">
					<view class="pic"><image :src="item.flash_pic_url" mode="widthFix"></image></view>
					<view style="position: absolute; top: 0; left: 0; bottom: 0; display: flex; align-items: center; margin-left: 0.5em;">
					<view class="pic-info">
						<view class="title">仅剩{{item.exp_day}}天</view>
						<view class="info-main">
						<view class="image"><image :src="item.flash_brand_url" mode=""></image></view>
						<view class="explain">{{item.flash_name}}</view>
						<view class="price">{{item.flash_explain}}</view></view>
					</view></view>
					</view>
					<view class="goods-list flex flexrow">
						<view class="li" v-for="(goods,index2) in item.g_list">
							<image :src="goods.image_url"></image>
							<view class="price flex flexJcs">
								<view class="dt">￥{{goods.flash_price}}</view>
								<view class="dd">￥{{goods.goods_price}}</view>
							</view>
						</view>
					</view>
				</navigator>
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curpage:1,
				hasmore:true,
				dataState:'oldflash',
				flashList:[]
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
					url: '/index.php?app=flash&wwi=flash_list',
					data: param,
					success: res => {
						this.curpage +=1;
						res.data.datas.flash_list.forEach(item=>{
							this.flashList.push(item);
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
				this.flashList=[];
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
.brand-list {padding-top:80upx ; margin-left: 20upx; margin-right: 20upx;}
.brand-list .item{background: #FFFFFF; border-radius:14upx ; overflow: hidden; margin-bottom: 20upx;}
.brand-list .pic-from{ position: relative;}
.brand-list .pic-from .pic{width: 100%;}
.brand-list .pic-from .pic image{width: 100%; vertical-align: middle;}
.brand-list .pic-from .pic-info{ width: 260upx; background: #FFFFFF; border-radius:14upx ; overflow:hidden ; align-items: center;}
.brand-list .pic-from .pic-info .title{background: #f8f8f8; font-size: 24upx; height: 40upx; display: flex; align-items: center; justify-content: center;}
.brand-list .pic-from .pic-info .info-main{margin: 20upx;}
.brand-list .pic-from .pic-info .image{width: 180upx; height: 80upx; margin: 20upx auto 0;}
.brand-list .pic-from .pic-info .image image{width: 100%; height: 100%;}
.brand-list .pic-from .pic-info .info-main .explain{font-size: 24upx; display: flex; justify-content: center;align-items: center; margin-top:8upx; border-bottom: 2upx solid #F8F8F8;}
.brand-list .pic-from .pic-info .info-main .price{font-weight: 700;font-family: PingFangSC-Semibold;font-size: 24upx;color: #333;line-height: 40upx;text-align: center;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
.brand-list .item .goods-list{min-height: 8upx;}
.brand-list .item .goods-list .li{margin-left: 20upx; margin-top:20upx; margin-bottom: 20upx;position: relative;}
.brand-list .item .goods-list .li image{width: 210upx; height: 210upx; vertical-align: middle;}
.brand-list .item .goods-list .li .price{position: absolute; bottom: 0; height: 40upx; background: rgba(255,255,255,0.9); width: 100%;}
.brand-list .item .goods-list .li .price .dt{color: #FF0036; font-size: 24upx;}
.brand-list .item .goods-list .li .price .dd{color: #777; font-size: 24upx; text-decoration:line-through}
</style>
