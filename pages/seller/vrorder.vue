<template>
	<view class="order-content newBody">
		<view class="mask" v-show="showMask" catchtouchmove="false"></view>
		<view class="popup popup-middle" v-show="showMask" catchtouchmove="true">
                 <view class="s-dialog-content flex flexcol">
					 <view class="h4">操作订单</view>
					 <scroll-view scroll-y style="height: 300upx;" class="flex flexcol">
					 <view class="li">订单编号：{{cancelOrderKey.paysn}}</view>
					 <view class="li">取消缘由:{{cancelOrderKey.msg}}<block v-if="cancelOrderKey.msg=='其他原因'">({{cancelOrderKey.gmsg}})</block></view>
					 <view class="li flex flexrow lice-msg"><view class="span" :class="{'cur':cancelOrderKey.msg=='无法备齐货物'}" @tap="btnMsg('无法备齐货物')">无法备齐货物</view><view class="span" :class="{'cur':cancelOrderKey.msg=='不是有效订单'}" @tap="btnMsg('不是有效订单')">不是有效订单</view><view class="span" :class="{'cur':cancelOrderKey.msg=='买家主动要求'}" @tap="btnMsg('买家主动要求')">买家主动要求</view><view class="span" :class="{'cur':cancelOrderKey.msg=='其他原因'}" @tap="btnMsg('其他原因')">其他原因</view></view>
					 <view class="li" v-if="cancelOrderKey.msg=='其他原因'"><textarea maxlength="60" v-model="cancelOrderKey.gmsg" class="other-msg" placeholder="说明其他原因(60字内)" auto-height /></view>
					 </scroll-view>
					 <view class="s-dialog-btn flex flexrow" @click="showMask=false">
						 <view class="flex flexAic flexJcc cancel-btn" @tap="cancelOrderBtn">取消</view>
						 <view class="flex flexAic flexJcc confirm-btn" @tap="cancelOrderBtn('ok')">确定</view>
					 </view>
				 </view>
		</view>
	
		<view class="top-nav">
			<scroll-view scroll-x class="hd">
				<view :class="['li',stateType=='' ? 'on' : '']" @click="swichNav('')">
					<view class="p">全部</view>
				</view>
				<view :class="['li',stateType=='state_new' ? 'on' : '']" @click="swichNav('state_new')">
					<view class="p">待付款</view>
				</view>
				<view :class="['li',stateType=='state_pay' ? 'on' : '']" @click="swichNav('state_pay')">
					<view class="p">已付款</view>
				</view>
				<view :class="['li',stateType=='state_success' ? 'on' : '']" @click="swichNav('state_success')">
					<view class="p">已完成</view>
				</view>
				<view :class="['li',stateType=='state_cancel' ? 'on' : '']" @click="swichNav('state_cancel')">
					<view class="p">已取消</view>
				</view>
			</scroll-view>
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
					</view>
				</view>
				<view class="li mt10" v-for="(item,index) in order_list" :key="index">
					<view class="wwiapp-order-item">
						<view class="wwiapp-order-item-head">
							<view   class="store" style="font-size: 30upx;">
								<view>编号:</view><text class="em" style="font-size: 28upx;">{{item.order_sn}}</text>
							</view>
							<view class="span">{{item.state_desc}}</view>
						</view>
						<view class="wwiapp-order-item-con">
							<navigator :url="'/pages/seller/vrorderinfo?orderId='+item.order_id" class="goods-block">
								<image :src="item.goods_image_url" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{item.goods_name}}</view>
									<view class="goods-type">{{item.goods_spec}}</view>
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
								<view class="span">共{{item.goods_count}}种商品,合计</view>
								<view class="sum">
									<view>￥</view><text class="em">{{item.order_amount}}</text>
								</view>
								<view class="freight">(含运费￥{{item.shipping_fee}})</view>
							</view>
							<view class="handle">
								<view class="lt">
									<view class="p">{{item.add_time_text}}</view>
								</view>
								<view class="rt">
									<view v-if="item.if_cancel" @click="cancelOrder(item)" class="o-btn cancel-order">取消订单</view>
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
				order_list: [],
				curpage: 1,
				orderKey: '',
				hasMore: true,
				loadMore: '',
				stateType: '',
				reset: true,
				showPageTop: false,
				showMask:false,
				cancelOrderKey:{
					id:'',
					paysn:'',
					msg:'',
					gmsg:''
				}
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
					url: "/index.php?app=seller_vr_order&wwi=order_list&page=10&curpage=" + this.curpage,
					method: 'POST',
					data: {
						key: this.key,
						state_type: this.stateType
					},
					success: res => {
						this.checksellerLogin(res.data.login);
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
				this.cancelOrderKey.id = e.order_id;
				this.cancelOrderKey.paysn = e.order_sn;
				this.showMask = true;
			},
			btnMsg:function(e){
				this.cancelOrderKey.msg = e;
			},
			cancelOrderBtn:function(e){
				if(e=='ok'){
					if(!this.cancelOrderKey.id){
						uni.showModal({
							content: '参数异常，请重试',
							showCancel:false,
							confirmText: '我知道了'
						});
						return;
					}
					if(!this.cancelOrderKey.msg){
						uni.showModal({
							content: '请选择退款原因或选择其他原因填写',
							showCancel:false,
							confirmText: '我知道了'
						});
						return;
					}
					var reason = this.cancelOrderKey.msg;
					if(this.cancelOrderKey.msg=='其他原因'){
						reason +='('+this.cancelOrderKey.gmsg+')';
					}
					this.wwiopt({
						url: "/index.php?app=seller_vr_order&wwi=order_cancel",
						method: 'POST',
						data: {
							key: this.key,
							order_id: this.cancelOrderKey.id,
							reason:reason
						},
						success: res => {
							if (res.data.datas && res.data.datas == 1) {
								this.reset = true;
								this.loadMore = '';
								this.Inlimine();
							} else {
								uni.showModal({
									content: res.data.datas.error,
									showCancel:false,
									confirmText: '我知道了'
								});
							}
						}
					});
				}else{
					this.cancelOrderKey={
						id:'',
						paysn:'',
						msg:'',
						gmsg:''
					}
				}
				
			}
		},
		onShow: function() {

			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
			this.Inlimine();
		},
		onLoad: function(e) {
			if (e.state) {
				this.stateType = e.state;
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
.order-content .top-nav{flex: 1;  width: 100%; border-bottom: 1px solid #F8F8F8; background: #FFFFFF;}
.order-content .top-nav .hd{flex: 1; height: 44px; width: auto;white-space: nowrap; }
.order-content .top-nav .li{  display: inline-block; text-align: center; box-sizing: border-box; padding: 0 10px; white-space: normal; line-height: 38px; height: 44px;}
.order-content .top-nav .li .p{ line-height: 42px; height: 42px; color: #232326; font-size: 15px;}
.order-content .top-nav .li.on .p{border-bottom:2px solid #F23030; color:#F23030;}
.order-main{flex: 1;  height: calc(100% - 44px);position: relative;}
.sure-order{background: #ff0036; color: #FFFFFF !important; border-color:#ff0036 !important;}
.edit-order{background: #03A9F4; color: #FFFFFF !important; border-color:#03A9F4 !important;}
.mask {position: fixed;z-index: 998;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, .3); }
.popup {position: fixed;z-index: 999;background-color: #ffffff;-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, .1);box-shadow: 0 0 30upx rgba(0, 0, 0, .1);}
.popup-middle {width: 600upx;height: 480upx;border-radius: 10upx;top: 0;right: 0;bottom: 0;left: 0;margin: auto;}
.s-dialog-content{ padding: 20upx;}
.s-dialog-content .h4{font-size: 34upx; height: 60upx; text-align: center;},
.s-dialog-content .li{font-size: 28upx;},
.s-dialog-content .s-dialog-btn{align-items: center; justify-content: center; color: #607d8b; height: 80upx; font-size: 36upx;}
.s-dialog-content .s-dialog-btn .cancel-btn{flex: 1;}
.s-dialog-content .s-dialog-btn .confirm-btn{flex: 1; color: #00BCD4;}
.other-msg{background: #F8F8F8; padding: 15upx; font-size: 24upx;}
.lice-msg{flex-wrap: wrap;}
.lice-msg .span{background: #F8F8F8; padding: 2.5upx 10upx; border-radius:15upx; margin-right: 15upx; margin-bottom: 15upx; color: #9e9e9e;}
.lice-msg .span.cur{border: 1px dotted #00BCD4; color: #00BCD4;}
</style>
