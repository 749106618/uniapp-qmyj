<template>
	<view class="order-content">
		<view class="top-nav">
			<view class="hd">
				<view :class="['li',stateType=='refund' ? 'on' : '']" @click="swichNav('refund')">
					<view class="p">退款列表</view>
				</view>
				<view :class="['li',stateType=='return' ? 'on' : '']" @click="swichNav('return')">
					<view class="p">退货列表</view>
				</view>
			</view>
		</view>
		<scroll-view class="order-main" scroll-y @scrolltolower="Inlimine">
			<view class="wwiapp-order-list">
				<view v-if="!refund_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">您还没有相关的信息</view>
							<view class="dd">Sorry!No relevant information was searched.</view>
						</view>
					</view>
				</view>
				<view class="li mt10" v-for="(list,index) in refund_list" :key="index">
					<view class="wwiapp-order-item" v-if="stateType=='return'">
						<view class="wwiapp-order-item-head">
							<navigator :url="'/pages/my/returninfo?id='+list.refund_id" class="store">
								<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{list.store_name}}</text>
							</navigator>
							<view class="span">{{list.seller_state}}</view>
						</view>
						<view class="wwiapp-order-item-con">
							<navigator :url="'/pages/my/returninfo?id='+list.refund_id" class="goods-block">
								<image :src="list.goods_img_360" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{list.goods_name}}</view>
									<view class="goods-type">{{list.goods_spec}}</view>
								</view>
							</navigator>
						</view>
						<view class="wwiapp-order-item-footer">
							<view class="store-totle">
								<view class="time">{{list.add_time}}</view>
								<view class="refund-sum">
									<view class="span">退款金额：<text class="em">￥{{list.refund_amount}}</text> </view>
									<view class="span">退货数量：<text class="em">{{list.goods_num}}</text>件</view>
								</view>
							</view>
							<view class="handle">
								<view class="lt"></view>
								<view class="rt">
									<navigator :url="'/pages/my/returninfo?id='+list.refund_id" class="o-btn">退款详情</navigator>
									<view v-if="list.delay_state == 1" @click="delay(list.refund_id)" class="o-btn">延迟</view>
									<navigator v-if="list.ship_state == 1" :url="'/pages/my/returnship?id='+list.refund_id" class="o-btn">退货发货</navigator>
								</view>
							</view>
						</view>
					</view>
					<view class="wwiapp-order-item" v-else>
						<view class="wwiapp-order-item-head">
							<navigator :url="'/pages/my/refundinfo?id='+list.refund_id" class="store">
								<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{list.store_name}}</text>
							</navigator>
							<view class="span">{{list.seller_state}}</view>
						</view>
						<view class="wwiapp-order-item-con">
							<navigator :url="'/pages/my/refundinfo?id='+list.refund_id" class="goods-block" v-for="(goods,index2) in list.goods_list"
							 :key="index2">
								<image :src="goods.goods_img_360" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{goods.goods_name}}</view>
									<view class="goods-type">{{goods.goods_spec}}</view>
								</view>
							</navigator>
						</view>
						<view class="wwiapp-order-item-footer">
							<view class="store-totle">
								<view class="time">{{list.add_time}}</view>
								<view class="refund-sum">
									<view class="span">退款金额：<text class="em">￥{{list.refund_amount}}</text></view>
								</view>
							</view>
							<view class="handle">
								<view class="lt"></view>
								<view class="rt">
									<navigator :url="'/pages/my/refundinfo?id='+list.refund_id" class="o-btn">退款详情</navigator>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="loadMore">{{loadMore}}</view>
			<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				refund_list: [],
				curpage: 1,
				hasMore: true,
				loadMore: '',
				stateType: 'refund',
				reset: true,
				showPageTop: false
			};
		},
		methods: {
			Inlimine() {
				if (this.reset) {
					this.curpage = 1;
					this.hasMore = true;
				}
				if (!this.hasMore) {
					return false;
				}
				this.hasMore = false;
				if (this.stateType == 'return') {
					var wurl = "/index.php?app=member_return&wwi=get_return_list";
				} else {
					var wurl = "/index.php?app=member_refund&wwi=get_refund_list";
				}
				this.wwiopt({
					url: wurl,
					data: {
						key: this.key,
						page: 10,
						curpage: this.curpage
					},
					success: res => {
						this.checkLogin(res.data.login);
						this.curpage += 1;
						this.hasMore = res.data.hasmore;

						if (this.stateType == 'return') {
							var newdata = res.data.datas.return_list;
						} else {
							var newdata = res.data.datas.refund_list;
						}
						if (this.reset) {
							this.reset = false;
							this.refund_list = newdata;
							if (res.data.page_total > 1) {
								this.loadMore = '加载更多...'
							}
						} else {
							newdata.forEach(item => {
								this.refund_list.push(item);
							});
							if (!this.hasMore) {
								this.loadMore = '没有更多了'
							}
						}
					}
				});
			},
			swichNav(e) {
				if (e == this.stateType) {
					return false;
				}
				if (e == 'return') {
					uni.setNavigationBarTitle({
						title: '退货列表'
					})
				} else {
					uni.setNavigationBarTitle({
						title: '退款列表'
					})
				}

				this.stateType = e;
				this.reset = true;
				this.loadMore = '';
				this.Inlimine();
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			},
			delay(e) {
				uni.request({
					url: this.ApiUrl + "/index.php?app=member_return&wwi=delay_form",
					data: {
						key: this.key,
						return_id: e
					},
					success: res => {
						uni.showModal({
							title: '提示',
							content: '发货' + res.data.datas.return_delay + '天后，当商家选择未收到则要进行延迟时间操作;如果超过' + res.data.datas.return_confirm +
								'天不处理按弃货处理，直接由管理员确认退款。',
							success: result => {
								if (result.confirm) {
									uni.request({
										url: this.ApiUrl + "/index.php?app=member_return&wwi=delay_post",
										method: 'POST',
										header: {
											'content-type': 'application/x-www-form-urlencoded'
										},
										data: {
											key: this.key,
											return_id: e
										},
										success: ok => {
											if (ok.data.datas.error) {
												uni.showToast({
													icon: 'none',
													title: ok.data.datas.error
												});
												return;
											}
											this.reset = true;
											this.loadMore = '';
											this.Inlimine();
										}
									});

								}
							}
						});
					}
				});
			}
		},
		onLoad: function(e) {
			if (e.id) {
				this.stateType = e.id;
			}
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
page{background: #F8F8F8;}
.order-content{display: flex;  width: 100%; height: 100%; flex-direction: column;}
.order-content .top-nav{flex: 1;  width: 100%; border-bottom: 2upx solid #F8F8F8; background: #FFFFFF;}
.order-content .top-nav .hd{display: flex;flex-direction: row; height: 100upx; }
.order-content .top-nav .li{flex: 1;align-items: center; justify-content: center; display: flex;}
.order-content .top-nav .li .p{font-size: 28upx; line-height: 96upx; color: #232326;}
.order-content .top-nav .li.on .p{border-bottom:6rpx solid #F23030; color:#F23030;}
.order-main{flex: 1;  height: calc(100% - 102upx);position: relative;}
.store-totle{justify-content: space-between !important;}
.store-totle .time{    font-size: 26upx; color: #BBB;}
.store-totle .refund-sum{display: flex; flex-direction: column; font-size: 28upx;}
.store-totle .refund-sum .span{display: flex; flex-direction: row;}
.store-totle .refund-sum .span .em{color: #FF0036;}
</style>
