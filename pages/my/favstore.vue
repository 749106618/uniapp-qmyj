<template>
	<view>
		<view class="favorite-store">
				<view v-if="!favorites_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-yizhan"></view>
						<view class="dl">
							<view class="dt">暂无收藏店铺</view>
							<view class="dd">可以去看看哪些想要买的</view>
						</view>
						<navigator class="a" open-type="switchTab" url="/pages/index">随便逛逛</navigator>
					</view>
				</view>
			<view class="li" v-for="(item,index) in favorites_list" :key="index">
				<navigator class="dl" :url="'/pages/web/store?storeid='+item.store_id">
					<view class="store-avatar"><image :src="item.store_avatar_url"></image></view>
					<view class="store-info">
                    <text class="store-name">{{item.store_name}}</text>
                    <view class="dd">
						<view class="span">粉丝：<text class="em">{{item.store_collect}}</text>人</view>
						<view class="span">商品：<text class="em">{{item.goods_count}}</text>件</view>
						</view>
				 </view>
                </navigator>
				<view class="wwi-icon wwi-icon-shanchu fav-del" @click="clearStore(index,item.store_id)"></view>
			</view>
		</view>
		<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
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
					url: '/index.php?app=member_favorites_store&wwi=favorites_list',
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
			clearStore(index, e) {
				if (e <= 0) {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				}
				this.wwiopt({
					url: 'index.php?app=member_favorites_store&wwi=favorites_del',
					method: 'POST',
					data: {
						key: this.key,
						store_id: e
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
				this.loadingType = 0;
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