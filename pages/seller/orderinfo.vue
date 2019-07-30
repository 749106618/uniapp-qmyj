<template>
	<view>
		<view class="mask" v-show="showMask" catchtouchmove="false"></view>
		<view class="popup popup-middle" v-show="showMask" catchtouchmove="true">
                 <view class="s-dialog-content flex flexcol">
					 <view class="h4">操作订单</view>
					 <scroll-view scroll-y style="height: 300upx;" class="flex flexcol">
					 <view class="li">订单编号：{{orderInfo.order_sn}}</view>
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
		<view class="wwiapp-order-list">
			<view class="wwiapp-order-detail-block">
				<view class="wwi-icon wwi-icon-zhangdan_xiangqing lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">订单状态</view>
					<view class="state">{{orderInfo.state_desc}}</view>
					</view>
				<view class="bd" v-if="orderInfo.order_tips != ''">{{orderInfo.order_tips}}</view>
				</view>
			</view>
			<view class="wwiapp-oredr-detail-delivery" v-if="orderInfo.if_deliver">
				<navigator :url="'/pages/my/orderdelivery?orderId='+orderInfo.order_id" class="timeline-item">
					<view class="wwi-icon wwi-icon-huoche lt"></view>
					<view class="dl">
						<view class="dt">{{deliverInfo.context}}</view>
						<view class="dd">{{deliverInfo.time}}</view>
					</view>
					<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou rt"></view>
				</navigator>
			</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="wwiapp-oredr-detail-add">
					<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
					<view class="dl">
						<view class="dt">
							<view class="span">收货人：</view>
							<view class="span strong">{{orderInfo.reciver_name}}</view>
							<view class="span strong">{{orderInfo.reciver_phone}}</view>
						</view>
						<view class="dd">收货地址：{{orderInfo.reciver_addr}}</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block" v-if="orderInfo.order_message">
				<view class="wwi-icon wwi-icon-duanxin lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">买家留言</view>
					</view>
				<view class="bd">{{orderInfo.order_message}}</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block" v-if="orderInfo.invoice">
				<view class="wwi-icon wwi-icon-rili lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">发票信息</view>
					</view>
				<view class="bd">{{orderInfo.invoice}}</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block" v-if="orderInfo.payment_name != ''">
				<view class="wwi-icon wwi-icon-zijinxunhuan lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">付款方式</view>
					</view>
				<view class="bd">{{orderInfo.payment_name}}</view>
				</view>
			</view>
					<view class="wwiapp-order-item">
						<view class="wwiapp-order-item-head">
							<view class="store">
								<view class="wwi-icon wwi-icon-tuwen"></view><text class="em">商品列表</text>
							</view>
						</view>
						<view class="wwiapp-order-item-con">
							<block  v-for="(goods,index) in orderInfo.goods_list" :key="index">
							<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="goods-block">
								<image :src="goods.image_url" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{goods.goods_name}}</view>
									<view class="goods-type" v-if="goods.goods_spec!=null" >{{goods.goods_spec}}</view>
								</view>
								<view class="goods-subtotal">
									<view class="goods-price">
										<view>￥</view><text class="em">{{goods.goods_price}}</text>
									</view>
									<text class="goods-num">x{{goods.goods_num}}</text>
								</view>
							</navigator>
							</block>
							<view class="goods-gift" v-if="orderInfo.zengpin_list&&orderInfo.zengpin_list.length > 0">
								<view class="em">赠品</view>
								<view class="span">
									<view class="p wwi-ellipsis" v-for="(zp,index2) in zengpin_list" :key="index2">{{zp.goods_name}}</view>
								</view>
							</view>
							<view class="goods-subtotle">
								<view class="dl" v-if="promotion.length > 0">
									<view class="dt">优惠</view>
									<view class="dd" style="flex-direction: column; justify-content: flex-end;">
										<view class="span" v-for="(item,index3) in promotion" :key="index3">
											{{item.log}}
										</view>
										</view>
								</view>
								<view class="dl">
									<view class="dt">运费</view>
									<view class="dd">￥<view class="em">{{orderInfo.shipping_fee}}</view></view>
								</view>
								<view class="dl t">
									<view class="dt">实付款（含运费）</view>
									<view class="dd">￥<view class="em">{{orderInfo.real_pay_amount}}</view></view>
								</view>
							</view>
						</view>
					</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="nul">
				<view class="nli">订单编号：{{orderInfo.order_sn}}</view>
				<view class="nli">创建时间：{{orderInfo.add_time}}</view>
				<view class="nli" v-if="orderInfo.payment_time">付款时间：{{orderInfo.payment_time}}</view>
				<view class="nli" v-if="orderInfo.shipping_time">发货时间：{{orderInfo.shipping_time}}</view>
				<view class="nli" v-if="orderInfo.finnshed_time">完成时间：{{orderInfo.finnshed_time}}</view>
				</view>
			</view>
			<view style="height: 100upx;"></view>
		</view>
<view class="wwiapp-oredr-detail-bottom">
	<view v-if="orderInfo.if_lock" class="p">退款/退货中...</view>
	<view v-if="orderInfo.if_store_cancel" class="o-btn cancel-order" @click="cancelOrder">取消订单</view>
	<navigator v-if="orderInfo.if_store_send" :url="'/pages/my/refundall?oid='+orderInfo.order_id" class="o-btn all_refund_order">设置发货</navigator>
	</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				key:'',
				orderId:0,
				orderInfo:[],
				zengpin:[],
				deliverInfo:[],
				promotion:[],
				showMask:false,
				cancelOrderKey:{
					msg:'',
					gmsg:''
				}
			};
		},
		methods:{
			Inlimine(){
				this.wwiopt({
					url: "/index.php?app=seller_order&wwi=order_info",
					data: {
						key:this.key,
						order_id:this.orderId
					},
					method: 'POST',
					success: res => {
						this.orderInfo = res.data.datas;
					}
				});
			},
			cancelOrder(e) {
				this.showMask = true;
			},
			btnMsg:function(e){
				this.cancelOrderKey.msg = e;
			},
			cancelOrderBtn:function(e){
				if(e=='ok'){
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
						url: "/index.php?app=seller_order&wwi=order_cancel",
						method: 'POST',
						data: {
							key: this.key,
							order_id: this.orderInfo.order_id,
							reason:reason
						},
						success: res => {
							if (res.data.datas && res.data.datas == 1) {
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
						msg:'',
						gmsg:''
					}
				}
				
			},
			tel(e){
				uni.makePhoneCall({
					phoneNumber: e //仅为示例
				});
			}
			
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
			if(e.orderId > 0){
				this.orderId = e.orderId;
				this.Inlimine();
			}else{
				uni.showToast({
					title: '数据错误',
					icon: "none",
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				});
			}
		},
		onShow: function() {
			this.key = uni.getStorageSync('seller_key');
		}
	}
</script>

<style>
 page{background: #f8f8f8;}
.wwiapp-order-detail-block{ background: #fff; position: relative; display: flex; flex-direction: row; padding: 16upx 0;border-bottom: solid 2upx #EEE; color: #333333;}
.wwiapp-order-detail-block .lt{width: 80upx;align-items: center; justify-content:center; display: flex;}
.wwiapp-order-detail-block .rt{flex: 1;}
.wwiapp-order-detail-block .hd{ display: flex; flex-direction:  row; justify-content: space-between;}
.wwiapp-order-detail-block .hd .h3{font-size: 32upx;display: flex; justify-content: center; align-items: center;}
.wwiapp-order-detail-block .hd .state{font-size: 28upx; display: flex; align-items: center; color: #FF0036; margin-right: 20upx;}
.wwiapp-order-detail-block .bd{align-items: center;font-size: 28upx;}
.wwiapp-order-detail-block .nul{margin: 0 20upx;}
.wwiapp-order-detail-block .nul .nli {font-size: 26upx;line-height: 36upx;color: #999;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add{display: flex; flex-direction: row;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .wwi-icon{width: 80upx;align-items: center; justify-content:center; display: flex;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl{display: flex; flex-direction: column; flex: 1;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl .dt{display: flex; flex-direction: row; align-items: center; font-size: 32upx;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl .dt .span{margin-right: 10upx;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl .dd{font-size: 28upx;}
.wwiapp-oredr-detail-bottom { position: fixed; z-index: 1; top: auto; left: 0; right: 0; bottom: 0; height: 100upx;background-color: rgba(255,255,255,0.75); border-top: solid 2upx #EEE; display: flex; justify-content: flex-end; align-items: center;}
.wwiapp-oredr-detail-bottom .o-btn {height: 48upx; border: 2upx solid #ddd; border-radius:20upx ; padding: 0 16upx; margin-right:16upx; line-height: 48upx; color: #555; background: #FFFFFF; font-size: 28upx;}
.wwiapp-oredr-detail-bottom .p { font-size: 28upx; color: #FF0036; margin-right: 20upx;}
.refund{display: flex; flex-direction: row; justify-content: flex-end; align-items: center;}
.refund .goods-refund{padding: 4upx 15upx; border: 2upx solid #FF0036; font-size: 28upx; border-radius:15upx ; color: #FF0036; margin-right: 15upx;}

.wwiapp-oredr-detail-delivery{width: 100%; padding: 16upx 0; background: #FFFFFF;}
.wwiapp-oredr-detail-delivery .timeline-item{display: flex; flex-direction: row;}
.wwiapp-oredr-detail-delivery .timeline-item .dl{flex: 1; margin: 0 10upx;}
.wwiapp-oredr-detail-delivery .timeline-item .dl .dt{color: #1AAD19; font-size: 32upx;}
.wwiapp-oredr-detail-delivery .timeline-item .dl .dd{font-size: 28upx; color: #DDDDDD;}
.wwiapp-oredr-detail-delivery .lt{width: 80upx; align-items: center; justify-content:center; display: flex;color: #1AAD19;}
.wwiapp-oredr-detail-delivery .rt{width: 60upx; align-items: center; justify-content:center; display: flex;}
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
