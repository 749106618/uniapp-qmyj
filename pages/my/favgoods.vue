<template>
	<view class="grid">
		<view class="goods-secrch-list fav-list">
				<view v-if="!favorites_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-shoucang"></view>
						<view class="dl">
							<view class="dt">暂无收藏商品</view>
							<view class="dd">可以去看看哪些想要买的</view>
						</view>
						<navigator class="a" open-type="switchTab" url="/pages/index">随便逛逛</navigator>
					</view>
				</view>
			<view class="goods-item" v-for="(item,index) in favorites_list" :key="index">
				<view class="goods-pic">
					<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
						<image lazy-load :src="item.goods_image_url" mode="widthFix" />
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
							<view class="goods-price">￥<text class="em">{{item.goods_price}}</text>
							</view>
						</navigator>
					</view>
				</view>
				<view class="wwi-icon wwi-icon-shanchu fav-del" @click="clearGoods(index,item.fav_id)"></view>
			</view>
			<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
import wwiLoadMore from '../../components/wwi-load-more.vue';
	export default {
		components: {
           wwiLoadMore
        },
		data() {
			return {
				key: '',
				favorites_list: [],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadingType: 3,
				contentText: {
					contentdown:'上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop:false
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
					url: '/index.php?app=member_favorites&wwi=favorites_list',
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
								res.data.datas.favorites_list.forEach(item => {
									this.favorites_list.push(item);
								});
								this.loadingType = 0;
							} else {
								this.favorites_list = res.data.datas.favorites_list;
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
			clearGoods(index, e) {
				if (e <= 0) {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				}
				this.wwiopt({
					url: '/index.php?app=member_favorites&wwi=favorites_del',
					method: 'POST',
					data: {
						key: this.key,
						fav_id: e
					},
					success: res => {
						if (res.data.datas == 1) {
							this.favorites_list.splice(index, 1);
							uni.showToast({
								title: '商品取消收藏成功',
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
			this.loadingType = 0;
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadingType = 2;
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
				this.loadingType = 3;
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
	page {
		background: #F8F8F8;
	}
</style>
