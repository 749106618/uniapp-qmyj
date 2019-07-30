<template>
	<view>
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
							<navigator :url="'/pages/web/store?storeid='+orderInfo.store_id" class="store">
								<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{orderInfo.store_name}}</text>
							</navigator>
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
							<view class="refund" v-if="goods.refund == 1">
								<navigator :url="'/pages/my/refund?oid='+orderInfo.order_id+'&gid='+goods.rec_id" class="goods-refund">退款</navigator>
								<navigator :url="'/pages/my/return?oid='+orderInfo.order_id+'&gid='+goods.rec_id" class="goods-refund">退货</navigator></view>
							</block>
							<view class="goods-gift" v-if="zengpin.length > 0">
								<view class="em">赠品</view>
								<view class="span">
									<view class="p wwi-ellipsis" v-for="(zp,index2) in zengpin" :key="index2">{{zp.goods_name}}</view>
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
                        <view class="wwiapp-order-item-bottom">
							<navigator :url="'/pages/my/chatinfo?tid='+orderInfo.store_member_id" class="span"><view class="wwi-icon wwi-icon-wangwang"></view><view>联系客服</view> </navigator>
							<view class="span" @click="tel(orderInfo.store_phone)"><view class="wwi-icon wwi-icon-dianhua"></view><view>拨打电话</view></view>
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
	<view v-if="orderInfo.if_cancel" class="o-btn cancel-order" @click="cancelOrder">取消订单</view>
	<navigator v-if="orderInfo.if_refund_cancel" :url="'/pages/my/refundall?oid='+orderInfo.order_id" class="o-btn all_refund_order">订单退款</navigator>
	<navigator v-if="orderInfo.if_deliver" :url="'/pages/my/orderdelivery?oid='+orderInfo.order_id" class="o-btn viewdelivery-order">查看物流</navigator>
	<view v-if="orderInfo.if_receive"  @click="sureOrder" class="o-btn key sure-order">确认收货</view>
    <navigator v-if="orderInfo.if_evaluation"  :url="'/pages/my/evaluation?oid='+orderInfo.order_id" class="o-btn key evaluation-order">评价订单</navigator>
	<navigator v-if="orderInfo.if_evaluation_again"  :url="'/pages/my/evaluationagain?oid='+orderInfo.order_id" class="o-btn evaluation-again-order">追加评价</navigator>
    <navigator v-if="orderInfo.order_type==4 && orderInfo.pintuan_info.pay_time>0" :url="'/pages/my/ptinfo?pid='+orderInfo.pintuan_info.log_id+'&bid='+orderInfo.pintuan_info.buyer_id" class="o-btn pintuan_info">拼团详情</navigator>
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
				promotion:[]
			};
		},
		methods:{
			Inlimine(){
				this.wwiopt({
					url: "/index.php?app=member_order&wwi=order_info",
					data: {
						key:this.key,
						order_id:this.orderId
					},
					success: res => {
						this.orderInfo = res.data.datas.order_info;
						this.zengpin= res.data.datas.order_info.zengpin_list;
						let data = [];
						for(var ii in res.data.datas.order_info.promotion){
							data.push({
								log:res.data.datas.order_info.promotion[ii][1]
							});
						}
						this.promotion = data;
						console.log(this.promotion)
						if(res.data.datas.order_info.if_deliver){
						uni.request({
							url:  this.ApiUrl + "/index.php?app=member_order&wwi=get_current_deliver",
							method: 'POST',
							header: {'content-type': 'application/x-www-form-urlencoded'},
							data: {key:this.key,order_id:this.orderId},
							success: res => {
								let data=res.data && res.data.datas;
								if(data.deliver_info){
									this.deliverInfo = data.deliver_info;
								}
							}
						});
						}
					}
				});
			},
			sureOrder() {
				uni.showModal({
					title: '提示',
					content: '确定收到货物？',
					success: res => {
						if (res.confirm) {
							this.wwiopt({
								url: "/index.php?app=member_order&wwi=order_receive",
								method: 'POST',
								data: {
									key: this.key,
									order_id: this.orderId
								},
								success: res => {
									if (res.data.datas && res.data.datas == 1) {
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
			cancelOrder() {
				uni.showModal({
					title: '提示',
					content: '确定取消订单？',
					success: res => {
						if (res.confirm) {
							this.wwiopt({
								url: "/index.php?app=member_order&wwi=order_cancel",
								method: 'POST',
								data: {
									key: this.key,
									order_id: this.orderId
								},
								success: res => {
									if (res.data.datas && res.data.datas == 1) {
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
			tel(e){
				uni.makePhoneCall({
					phoneNumber: e //仅为示例
				});
			}
			
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
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
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
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
</style>
