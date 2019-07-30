<template>
	<view class="newBody maxBody">
		<view class="mask" v-show="showMask" @click="hide" catchtouchmove="true"></view>
		<view class="wwi-scroll-tab" style="position: fixed; left: 0;right: 0; z-index: 999;">
			<view class="hd">
			<view class="lt">
			<scroll-view id="tab-bar" class="tab" scroll-x :scroll-left="scrollLeft">
			<block v-for="(tab,index) in tabs" :key="index">
				<view :class="['tab-li',currentTab==index ? 'on' : '']" :id="'s'+tab.gc_id" :data-current="index" @tap="swichNav(index)">
					<view class="p">{{tab.gc_name}}</view>
				</view>
			</block>
				</scroll-view>
				</view>
			<view class="rt" id="listMore" @click="hide"><view class="wwi-icon wwi-icon-xuanzeqizhankai"></view></view>
			</view>
			<view class="bd" v-show="showMask">
          <view class="all-tab J-show">
			  <block v-for="(tab,index2) in tabs" :key="index2">
			  <view :class="['li',currentTab==index2 ? 'on' : '']" :data-current="index2" @tap="swichSNav(index2)">
				  <view class="a">{{tab.gc_name}}</view>
			  </view>
			  </block>
		</view>
		</view>
		<view class="clear"></view>
		</view>
		<view class="goods-list">
				<view v-if="!goodsList.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">没有相关拼团商品</view>
							<view class="dd">选择其他分类试试哦~</view>
						</view>
					</view>
				</view>
			<navigator :url="'/pages/web/item?goodsid='+vv.goods_id" class="item" v-for="(vv,v) in goodsList" :key="v">
				<view class="pic"><image :src="vv.goods_image_url"></image></view>
				<view class="goods-info">
					<view class="goods-name">{{vv.goods_name}}</view>
					<view class="goods-pinfo">{{vv.pintuan_name}}</view>
					<view class="price flex flexrow"><view class="em">{{vv.min_num}}人拼</view><view class="span flex flexrow">&yen;<view class="i">{{vv.pintuan_price}}</view></view></view>
					<view class="del">&yen; {{vv.goods_price}}</view>
					<view class="btn">去开团</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs:[],
				scrollLeft:0,
				showMask:false,
				currentTab:0,
				curpage:1,
				hasmore:true,
				goodsList:[]
			};
		},
		methods:{
			hide() {
				if(this.showMask){
					this.showMask = false
				}else{
					this.showMask = true
				}
			},
			getCategory: async function() {
					uni.request({
						url: this.ApiUrl + '/index.php?app=goods_class',
						success: (result) => {
							var data = result.data.datas.class_list;
							for (var i = 0; i < data.length; i++) {
								this.tabs.push({
									"gc_id": data[i].gc_id,
									"gc_name": data[i].gc_name
								})
							}
							this.tabs.unshift({gc_id:0,gc_name:'全部'});
							this.loadMore(this.currentTab);
						}
					});
				},
			getWidth: function (id) { //得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			swichNav: async function (e) { //点击tab-bar
				if (this.currentTab === e) {
					return false;
				} else {
					let tabBar = await this.getWidth("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
						console.log(tabBar)
					this.scrollLeft = tabBarScrollLeft;
					this.currentTab = e;
					this.hasmore = true;
					this.curpage = 1;
					this.goodsList = [];
					this.loadMore(e);
					
				}
			},
			swichSNav: async function (e) { //点击tab-bar
				if (this.currentTab === e) {
					return false;
				} else {
				let tabBar = await this.getWidth("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;

				let width = 0;

				for (let i = 0; i < e; i++) {
					let result = await this.getWidth('s'+this.tabs[i].gc_id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getWidth('s'+this.tabs[e].gc_id),
					nowWidth = nowElement.width,
					navElet = await this.getWidth('listMore'),
					navWidth = navElet.width,
					navWin= winWidth-navWidth;
					

				if (width + nowWidth - tabBarScrollLeft > navWin) {
					this.scrollLeft = width + nowWidth - navWin;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
					this.currentTab = e;
					this.hasmore = true;
					this.curpage = 1;
					this.goodsList = [];
					this.loadMore(e);
					
				}
			},
			loadMore:function(e){
				if(!this.hasmore){
					return false;
				}
				this.wwiopt({
					url: "/index.php?app=pintuan&wwi=list",
					data: {page:10,curpage:this.curpage,gc_id:this.tabs[e].gc_id},
					success: res => {
						if(res.data.code==200){
							this.curpage +=1;
							res.data.datas.goods_list.forEach(item=>{
								this.goodsList.push(item);
							})
							this.hasmore = res.data.hasmore;
							console.log(this.goodsList)
						}
					}
				});
			}
		},
		onLoad:function(){
			this.getCategory();
		},
		onReachBottom:function(){
			if (this.hasmore) {
				this.loadMore(this.currentTab);
			}
		}
	}
</script>

<style>
page{}
.mask {position: fixed;z-index: 998;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(255, 255, 255, .01);}
.goods-list{padding-top:44px; background: #FFFFFF;}
.goods-list .item{display: flex; flex-direction: row; height: 300upx;}
.goods-list .item .pic{width: 280upx; height: 280upx;}
.goods-list .item .pic image{width: 280upx; height: 280upx;}
.goods-list .item .goods-info{height: 280upx;flex: 1; box-sizing: border-box; margin-left: 20upx; padding-top: 20upx;position: relative; border-bottom: 2upx solid #eee;}
.goods-list .item .goods-info .goods-name{margin: 0 30upx 14upx 0;color: #333;font-size: 28upx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;}
.goods-list .item .goods-info .goods-pinfo{display: inline-block;padding: 0 20upx;height: 30upx;line-height: 30upx;color: #999;font-size: 24upx;background-color: #f7f7f7;border-radius: 16upx;vertical-align: top;}
.goods-list .item .goods-info .price{bottom: 60upx;line-height: 30upx; position: absolute; left: 0; color: #e93b3d;}
.goods-list .item .goods-info .price .em{font-size: 24upx;}
.goods-list .item .goods-info .price .span{font-size: 24upx; margin-left: 20upx; align-items: baseline;}
.goods-list .item .goods-info .price .span .i{font-size: 36upx; font-weight: bold;}
.goods-list .item .goods-info .del{ position: absolute;bottom: 20upx;left: 0;color: #999;font-size: 24upx;max-width: 200upx;text-decoration: line-through;}
.goods-list .item .goods-info .btn {position: absolute;bottom: 30upx;right: 30upx;width: 160upx;height: 60upx;line-height: 60upx;color: #fff;font-size: 28upx;text-align: center;border-radius: 50upx;background: -webkit-gradient(linear,left top,right top,from(#e93b3d),to(#ff9474));background: -webkit-linear-gradient(left,#e93b3d,#ff9474);background: linear-gradient(90deg,#e93b3d,#ff9474);box-shadow: 0 12upx 20upx rgba(233,59,61,.2);}
</style>
