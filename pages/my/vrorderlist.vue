<template>
	<view class="order-content">
		<view class="top-nav">
			<view class="hd">
				<view :class="['li',stateType=='' ? 'on' : '']" @click="swichNav('')">
					<view class="p">全部</view>
				</view>
				<view :class="['li',stateType=='state_new' ? 'on' : '']" @click="swichNav('state_new')">
					<view class="p">待付款</view>
				</view>
				<view :class="['li',stateType=='state_pay' ? 'on' : '']" @click="swichNav('state_pay')">
					<view class="p">待使用</view>
				</view>
			</view>
		</view>
		<scroll-view class="order-main" scroll-y @scrolltolower="Inlimine">
			<view class="wwiapp-order-list">
				<view v-if="!order_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">您还没有相关的订单</view>
							<view class="dd">可以去看看哪些想要买的</view>
						</view>
						<navigator open-type="switchTab" url="/pages/index" class="a">逛一逛</navigator>
					</view>
				</view>
				<view class="li mt10" v-for="(item,index) in order_list" :key="index">
					<view class="wwiapp-order-item">
						<view class="wwiapp-order-item-head">
							<navigator :url="'/pages/web/store?storeid='+item.store_id" class="store">
								<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{item.store_name}}</text>
							</navigator>
							<view class="span">{{item.order_state_text}}</view>
						</view>
						<view class="wwiapp-order-item-con">
							<navigator :url="'/pages/my/vrorderinfo?orderId='+item.order_id" class="goods-block">
								<image :src="item.goods_image_url" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{item.goods_name}}</view>
									<view class="goods-type" v-if="item.goods_spec!=null">{{item.goods_spec}}</view>
								</view>
								<view class="goods-subtotal">
									<view class="goods-price">
										<view>￥</view><text class="em">{{item.goods_price}}</text>
									</view>
									<text class="goods-num">x{{item.goods_num}}</text>
								</view>
							</navigator>
						</view>
						<view class="wwiapp-order-item-footer">
							<view class="store-totle">
								<view class="span">合计</view>
								<view class="sum">
									<view>￥</view><text class="em">{{item.order_amount}}</text>
								</view>
							</view>
							<view class="handle">
								<view class="lt"></view>
								<view class="rt">
									<view v-if="item.if_cancel" @click="cancelOrder(item)" class="o-btn cancel-order">取消订单</view>
									<navigator v-if="item.if_evaluation"  :url="'/pages/my/evaluationvr?oid='+item.order_id" class="o-btn key evaluation-order">评价订单</navigator>
								</view>
							</view>
						</view>
					</view>
					<view class="btn" v-if="item.if_pay">订单支付<text class="em">(￥{{item.order_amount}})</text></view>
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
				order_list: [],
				curpage: 1,
				orderKey: '',
				hasMore: true,
				loadMore: '',
				stateType: '',
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
				this.wwiopt({
					url: "/index.php?app=member_vr_order&wwi=order_list&page=10&curpage=" + this.curpage,
					method: 'POST',
					data: {
						key: this.key,
						state_type: this.stateType,
						order_key: this.orderKey
					},
					success: res => {
						this.checkLogin(res.data.login);
						this.curpage += 1;
						this.hasMore = res.data.hasmore;
						if (this.reset) {
							this.reset = false;
							this.order_list = res.data.datas.order_list;
							if (res.data.page_total > 1) {
								this.loadMore = '加载更多...'
							}
						} else {
							res.data.datas.order_list.forEach(item => {
								this.order_list.push(item);
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
                switch (e){
                	case 'state_new':
					uni.setNavigationBarTitle({title:'待付款虚拟订单'});
                		break;
                	case 'state_pay':
					uni.setNavigationBarTitle({title:'待使用虚拟订单'});
                		break;
                	default:
					uni.setNavigationBarTitle({title:'全部虚拟订单'});
                		break;
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
			cancelOrder(e) {
				uni.showModal({
					title: '提示',
					content: '确定取消' + e.order_sn + '订单？',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: this.ApiUrl + "/index.php?app=member_vr_order&wwi=order_cancel",
								method: 'POST',
								header: {'content-type': 'application/x-www-form-urlencoded'},
								data: {
									key: this.key,
									order_id: e.order_id
								},
								success: res => {
									if (res.data.datas && res.data.datas == 1) {
										this.reset = true;
										this.loadMore = '';
										this.Inlimine();
									} else {
										uni.showToast({
											title: res.data.datas.error,
											icon: "none"
										});
									}
								}
							});
						}
					}
				});
			}
		},
		onShow: function() {

			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
		},
		onLoad: function(e) {
			if (e.state) {
				this.stateType = e.state;
			}
		},
		onUnload: function() {
				this.order_list = [];
				this.curpage= 1;
				this.orderKey= '';
				this.hasMore= true;
				this.loadMore= '';
				this.stateType= '';
				this.reset= true;
				this.showPageTop= false;
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
</style>
