<template>
	<view class="list">
		<view class="goods-secrch-list fav-list">
				<view v-if="!goodsbrowse_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zuji"></view>
						<view class="dl">
							<view class="dt">暂无您的浏览记录</view>
							<view class="dd">可以去看看哪些想要买的</view>
						</view>
						<navigator class="a" open-type="switchTab" url="/pages/index">随便逛逛</navigator>
					</view>
				</view>
			<view class="goods-item" v-for="(item,index) in goodsbrowse_list" :key="index">
				<view class="goods-pic">
					<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
						<image lazy-load :src="item.goods_image_url" />
						</image>
					</navigator>
				</view>
				<view class="goods-info">
					<view class="goods-name">
						<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
							<text class="h4">{{item.goods_name}}</text>
						</navigator>
					</view>
					<view class="goods-sale">
						<navigator :url="'/pages/web/item?goodsid='+item.goods_id">
							<view class="goods-price">￥<text class="em">{{item.goods_promotion_price}}</text>
							</view>
						</navigator>
					</view>
				</view>

			</view>
			<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
		</view>
		<view class="wwi-icon wwi-icon-shanchu clearView" @click="clearGoods"></view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
import wwiLoadMore from '@/components/wwi-load-more.vue';
	export default {
		components: {
           wwiLoadMore
        },
		data() {
			return {
				key: '',
				goodsbrowse_list: [],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadingType: 3,
				contentText: {
					contentdown:'上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop: false
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=member_goodsbrowse&wwi=browse_list',
					data: {
						key: this.key,
						page: this.page,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.goodsbrowse_list.forEach(item => {
									this.goodsbrowse_list.push(item);
								});

								this.loadingType = 0;
							} else {
								this.goodsbrowse_list = res.data.datas.goodsbrowse_list;
								uni.stopPullDownRefresh();
								this.loadingType = 0;
								if (!res.data.hasmore) {
									this.loadingType = 3;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					}
				});
			},
			clearGoods() {
				this.wwiopt({
					url:'/index.php?app=member_goodsbrowse&wwi=browse_clearall',
					method: 'POST',
					data: {
						key: this.key
					},
					success: res => {
						if (res.data.datas == 1) {
							this.hasmore = true;
							this.curpage = 1;
							this.Inlimine();
							uni.showToast({
								title: '清除足迹成功',
								icon: 'none'
							});
						} else {
							uni.showToast({
								title: res.data.datas.error,
								icon: 'none'
							});
						}
					}
				});
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			}
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadingType = 3;
			}
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.favorites_list = [],
				this.key = '',
				this.loadMore = '加载更多...';
		},
		onPageScroll: function(e) {
			if (e.scrollTop > 300) {
				this.showPageTop = true;
			} else if (e.scrollTop < 300) {
				this.showPageTop = false;
			}
		}


	}
</script>

<style>
page {	background: #F8F8F8;}
.clearView{width: 60upx; height: 60upx; border-radius:50% ; background: rgba(0,0,0,0.6); position: fixed; z-index: 99; bottom: 170upx; right: 10upx; color: #FFFFFF;text-align: center; line-height: 60upx !important;}
/*大图模式*/
.grid .goods-secrch-list { font-size: 0; display: flex; flex-wrap: wrap; width: 100%; flex-direction: row;}
.grid .goods-secrch-list .goods-item { background-color: #FFF; display: flex; margin-bottom: 10upx; box-shadow: 0 2upx 0 rgba(0,0,0,0.05); position: relative; z-index: 1; overflow: hidden;flex-direction: column; width: 49.25%; box-sizing: border-box;}
.grid .goods-secrch-list .goods-item:nth-of-type(even) { margin-left: 1.5%;}
/*商品图片*/
.grid .goods-secrch-list .goods-pic {width: 100%; height: 100%;}
.grid .goods-secrch-list .goods-pic .a {width: 100%; height: 100%;display: flex; justify-content: center;align-items: center;}
.grid .goods-secrch-list .goods-pic image { width: 370upx; height: 370upx; }
/*下方商品介绍*/
.grid .goods-secrch-list .goods-info { display: block; padding: 0 20upx;}
/*商品名称*/

.grid .goods-secrch-list .goods-name {height: 116upx; width: 100%; overflow: hidden; }
.grid .goods-secrch-list .goods-name .a{display: flex; width: 100%; flex-wrap: wrap;}
.grid .goods-secrch-list .goods-name .h4 { font-size: 28upx; line-height: 36upx; height: 72upx; display: -webkit-box;  overflow: hidden;  color: #333;   text-overflow: ellipsis;  -webkit-line-clamp: 2; -webkit-box-orient: vertical; word-break: break-all; margin: 8upx 0;}
.grid .goods-secrch-list .goods-name .h6 { font-size: 24upx; color: #999; line-height: 36upx; height: 36upx; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;}
/*商品价格与促销*/
.grid .goods-secrch-list .goods-sale { display: block; height: 40upx; padding: 10upx 0; overflow: hidden;}
.grid .goods-secrch-list .goods-price { color: #EC5464; font-size: 26upx; line-height: 40upx; display: block; float: left;}
.grid .goods-secrch-list .goods-price .em { font-size: 36upx; line-height: 40upx; vertical-align: top; display: inline-block;}
.grid .goods-secrch-list .goods-price .phone-sale { font-size: 20upx; line-height: 24upx; vertical-align: top; display: inline-block; height:24upx; padding-right: 4upx; margin-top: 2upx; border: solid #EC5464 2upx; }
.grid .goods-secrch-list .goods-price .phone-sale .wwi-icon { vertical-align: middle; margin-right: 4upx; width: 24upx; height: 24upx; font-size: 20upx;}
.grid .goods-secrch-list .sale-type {  display: none;}
/*商品收藏列表删除*/
.fav-list .goods-name { height: 90upx !important; }
.grid .goods-secrch-list .fav-del { position: absolute; z-index: 1; bottom: 10upx; right: 10upx; width: 40upx; height: 40upx;font-size: 42upx;}
</style>
