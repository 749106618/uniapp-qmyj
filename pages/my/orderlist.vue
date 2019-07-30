<template>
	<view class="order-content newBody">
		<view class="top-nav">
			<view class="hd">
				<view :class="['li',stateType=='' ? 'on' : '']" @click="swichNav('')">
					<view class="p">全部</view>
				</view>
				<view :class="['li',stateType=='state_new' ? 'on' : '']" @click="swichNav('state_new')">
					<view class="p">待付款</view>
				</view>
				<view :class="['li',stateType=='state_send' ? 'on' : '']" @click="swichNav('state_send')">
					<view class="p">待收货</view>
				</view>
				<view :class="['li',stateType=='state_notakes' ? 'on' : '']" @click="swichNav('state_notakes')">
					<view class="p">待自提</view>
				</view>
				<view :class="['li',stateType=='state_noeval' ? 'on' : '']" @click="swichNav('state_noeval')">
					<view class="p">待评价</view>
				</view>
			</view>
		</view>
		<scroll-view class="order-main" scroll-y @scrolltolower="Inlimine">
			<view class="wwiapp-order-list">
				<view v-if="!order_group_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">您还没有相关的订单</view>
							<view class="dd">可以去看看哪些想要买的</view>
						</view>
						<navigator open-type="switchTab" url="/pages/index" class="a">逛一逛</navigator>
					</view>
				</view>
				<view class="li mt10" v-for="(list,index) in order_group_list" :key="index">
					<view class="wwiapp-order-item" v-for="(item,index2) in list.order_list" :key="index2">
						<view class="wwiapp-order-item-head">
							<navigator :url="'/pages/web/store?storeid='+item.store_id" class="store">
								<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{item.store_name}}</text>
							</navigator>
							<view class="span">{{item.state_desc}}</view>
						</view>
						<view class="wwiapp-order-item-con">
							<navigator :url="'/pages/my/orderinfo?orderId='+item.order_id" class="goods-block" v-for="(goods,index3) in item.extend_order_goods"
							 :key="index3">
								<image :src="goods.goods_image_url" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{goods.goods_name}}</view>
									<view class="goods-type">{{goods.goods_spec}}</view>
								</view>
								<view class="goods-subtotal">
									<view class="goods-price">
										<view>￥</view><text class="em">{{goods.goods_price}}</text>
									</view>
									<text class="goods-num">x{{goods.goods_num}}</text>
								</view>
							</navigator>
							<view class="goods-gift" v-if="item.zengpin_list&&item.zengpin_list.length > 0">
								<view class="em">赠品</view>
								<view class="span">
									<view class="p wwi-ellipsis" v-for="(zp,key) in item.zengpin_list" :key="key">{{zp.goods_name}}</view>
								</view>
							</view>
						</view>
						<view class="wwiapp-order-item-footer">
							<view class="store-totle">
								<view class="span">共{{item.goods_num}}件商品,合计</view>
								<view class="sum">
									<view>￥</view><text class="em">{{item.goods_amount}}</text>
								</view>
								<view class="freight">(含运费￥{{item.shipping_fee}})</view>
							</view>
							<view class="handle">
								<view class="lt">
									<view class="del" v-if="item.if_delete" @click="deleteOrder(item)">
										<view class="wwi-icon wwi-icon-shanchu"></view>移除
									</view>
									<view class="p" v-if="item.if_lock">退款/退货中...</view>
								</view>
								<view class="rt">
									<view v-if="item.if_cancel" @click="cancelOrder(item)" class="o-btn cancel-order">取消订单</view>
									<navigator v-if="item.if_deliver" :url="'/pages/my/orderdelivery?oid='+item.order_id" class="o-btn viewdelivery-order">查看物流</navigator>
									<view v-if="item.if_receive" @click="sureOrder(item)" class="o-btn key sure-order">确认收货</view>
									<navigator v-if="item.if_evaluation"  :url="'/pages/my/evaluation?oid='+item.order_id" class="o-btn key evaluation-order">评价订单</navigator>
									<navigator v-if="item.if_evaluation_again"  :url="'/pages/my/evaluationagain?oid='+item.order_id" class="o-btn evaluation-again-order">追加评价</navigator>
								</view>
							</view>
						</view>
					</view>
					<view class="btn" v-if="list.pay_amount" @click="payMent(list.pay_sn)">订单支付<text class="em">(￥{{list.pay_amount}})</text></view>
				</view>
			</view>
			<view class="loadMore">{{loadMore}}</view>
			<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
		</scroll-view>
        <wwi-payment-mask ref="wwiPaymentMask" @onConfirm="payNowOk" ></wwi-payment-mask>
	</view>
</template>

<script>
	import wwiPaymentMask from '../../components/wwi-payment-mask.vue';
	export default {
		components:{
			wwiPaymentMask
		},
		data() {
			return {
				key: '',
				order_group_list: [],
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
					url: "/index.php?app=member_order&wwi=order_list&page=10&curpage=" + this.curpage,
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
							this.order_group_list = res.data.datas.order_group_list;
							if (res.data.page_total > 1) {
								this.loadMore = '加载更多...'
							}
						} else {
							res.data.datas.order_group_list.forEach(item => {
								this.order_group_list.push(item);
							});
							if (!this.hasMore) {
								this.loadMore = '没有更多了'
							}
						}
						this.order_group_list.forEach((item) => {
							item.order_list.forEach((item2) => {
								let num = 0;
								item2.extend_order_goods.forEach((item3) => {
									num += parseInt(item3.goods_num);
								});
								this.$set(item2, 'goods_num', num);

							});
						});

					}
				});
			},
			swichNav(e) {
				if (e == this.stateType) {
					return false;
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
			payMent(e){
				var toPay = {
					app:'member_buy',
					wwi:'pay',
					paySn:e
				}
				this.$refs.wwiPaymentMask.show(toPay);
			},
			cancelOrder(e) {
				uni.showModal({
					title: '提示',
					content: '确定取消' + e.order_sn + '订单？',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: this.ApiUrl + "/index.php?app=member_order&wwi=order_cancel",
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
			},
			sureOrder(e) {
				uni.showModal({
					title: '提示',
					content: '确定收到' + e.order_sn + '订单？',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: this.ApiUrl + "/index.php?app=member_order&wwi=order_receive",
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
			},
			deleteOrder(){
				uni.showModal({
					title: '是否移除订单',
					content: '电脑端订单回收站可找回订单！',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: this.ApiUrl + "/index.php?app=member_order&wwi=order_delete",
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
			},
			payNowOk:function(){
				this.reset = true;
				this.loadMore = '';
				this.Inlimine();
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
				this.order_group_list = [];
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
.order-content .top-nav{flex: 1;  width: 100%; border-bottom: 1px solid #F8F8F8; background: #FFFFFF;}
.order-content .top-nav .hd{display: flex;flex-direction: row; height: 44px; }
.order-content .top-nav .li{flex: 1;align-items: center; justify-content: center; display: flex;}
.order-content .top-nav .li .p{ line-height: 42px; height: 42px; color: #232326; font-size: 15px;}
.order-content .top-nav .li.on .p{border-bottom:2px solid #F23030; color:#F23030;}
.order-main{flex: 1;  height: calc(100% - 44px);position: relative;}
</style>
