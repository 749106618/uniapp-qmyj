<template>
	<view class="">
			<view class="wwiapp-order-detail-block">
				<view class="hd ntit"><view class="h3">第一步</view>确认收货信息及交易详情</view>
			</view>
					<view class="wwiapp-order-item">
						<view class="wwiapp-order-item-head">
							<view class="store">
								<view class="wwi-icon wwi-icon-tuwen"></view><text class="em">{{info.order_sn}}</text>
							</view>
						</view>
						<view class="wwiapp-order-item-con">
							<block  v-for="(goods,index) in info.goods_list" :key="index">
							<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="goods-block">
								<image :src="goods.image_240_url" class="goods-pic"></image>
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
							<view class="goods-gift" v-if="info.zengpin_list&&info.zengpin_list.length > 0">
								<view class="em">赠品</view>
								<view class="span">
									<view class="p wwi-ellipsis" v-for="(zp,index2) in zengpin_list" :key="index2">{{zp.goods_name}}</view>
								</view>
							</view>
							<view class="goods-subtotle">
<!-- 								<view class="dl" v-if="promotion.length > 0">
									<view class="dt">优惠</view>
									<view class="dd" style="flex-direction: column; justify-content: flex-end;">
										<view class="span" v-for="(item,index3) in promotion" :key="index3">
											{{item.log}}
										</view>
										</view>
								</view> -->
								<view class="dl">
									<view class="dt">运费</view>
									<view class="dd">￥<view class="em">{{info.shipping_fee}}</view></view>
								</view>
								<view class="dl t">
									<view class="dt">实付款（含运费）</view>
									<view class="dd">￥<view class="em">{{info.order_amount}}</view></view>
								</view>
							</view>
						</view>
					</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="wwiapp-oredr-detail-add">
					<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
					<view class="dl">
						<view class="dt">
							<view class="span">收货人：</view>
							<view class="span strong">{{info.extend_order_common.reciver_name}}</view>
							<view class="span strong">{{info.extend_order_common.reciver_info.phone}}</view>
						</view>
						<view class="dd">收货地址：{{info.extend_order_common.reciver_info.address}}</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="hd ntit"><view class="h3">第二步</view>确认发货信息<navigator url="/pages/seller/address" class="state">更换</navigator></view>
				</view>
				<view class="wwiapp-order-detail-block">
				<view class="wwiapp-oredr-detail-add">
					<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
					<view class="dl">
						<view class="dt">
							<view class="span">发货人：</view>
							<view class="span strong">{{sendaddress.seller_name}}</view>
							<view class="span strong">{{sendaddress.telphone}}</view>
						</view>
						<view class="dd">发货地址：{{sendaddress.area_info}}{{sendaddress.address}}</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="hd ntit"><view class="h3">第三步</view>选择物流服务</view>
				</view>
				<view class="shipping_list">
					<view class="list flex flexrow"> <view class="lt">无需物流</view><view class="rt flex flexrow"><view class="item" :class="{'ok':expid==0}" @click="selectExp(0)">订单商品无需物流配送</view></view></view>
					<view class="list flexrow flex"> <view class="lt">物流发货</view><view class="rt flex flexrow">
					<view class="item" :class="{ok:exp.id==expid}" v-for="(exp,v) in express " :key="v" @click="selectExp(exp.id)">{{exp.e_name}}</view></view></view>
					<view class="list flex flexrow" v-if="expid > 0"> <view class="lt">物流单号</view><view class="rt flex flexrow"><input type="text" value="" placeholder="请填写物流单号" v-model="shippingcode" class="item" style="flex: 1;" /></view></view>
					<view class="list">
						<button type="primary" class="wwibtn" @click="submitExp">确定发货</button>
					</view>
				</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				orderId:'',
				info: [],
				sendaddress:'',
				express:'',
				expid:0,
				shippingcode:''
			};
		},
		methods:{
			loadList:function(){
				this.wwiopt({
					url: '/index.php?app=seller_express&wwi=get_defaultexpress',
					method: 'POST',
					data: {key:this.key,order_id:this.orderId},
					success: res => {
						if(res.data.datas.error){
							uni.showModal({
								title: '提示',
								content: res.data.datas.error,
								showCancel: false
							});
							return false;
							uni.navigateBack();
						}
						this.info = res.data.datas.orderinfo;
						this.sendaddress = res.data.datas.daddress_info;
						this.express = res.data.datas.express_array;
					}
				});
			},
			selectExp:function(e){
				this.expid = e;
			},
			submitExp:function(){
				var parem ={};
				    parem.key = this.key;
					parem.order_id = this.orderId;
				if(this.expid > 0){
					if(this.shippingcode < 3){
						uni.showModal({
							content: '请填写物流单号在进行发货',
							showCancel: false
						});
						return false;
					}
					parem.shipping_express_id = this.expid;
					parem.shipping_code = this.shippingcode;
					parem.daddress_id = this.sendaddress.address_id;
				}
				
				this.wwiopt({
					url: '/index.php?app=seller_order&wwi=order_deliver_send',
					method: 'POST',
					data: parem,
					success: res => {
						this.checksellerLogin(res.data.login);
						if(res.data.datas.error){
							uni.showModal({
								content: res.data.datas.error,
								showCancel: false
							});
							return false;
						}
						uni.showModal({
							title: '提示',
							content: '发货成功',
							showCancel: false,
							confirmText: '好的',
							success: res => {
								uni.navigateBack();
							}
						});
					}
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
			if(e.oid){
				this.orderId = e.oid
			}
		},
		onShow:function(){
			this.loadList();
		}
		
		}
</script>

<style>
page{background: #F8F8F8;}
.wwiapp-order-detail-block{ background: #fff; position: relative; display: flex; flex-direction: row; padding: 16upx 0;border-bottom: solid 2upx #EEE; color: #333333;}
.wwiapp-order-detail-block .lt{width: 80upx;align-items: center; justify-content:center; display: flex;}
.wwiapp-order-detail-block .rt{flex: 1;}
.wwiapp-order-detail-block .hd{ display: flex; flex-direction:  row; justify-content: space-between;}
.wwiapp-order-detail-block .hd.ntit{font-size: 30upx; font-weight: 600; width: 100%; padding: 0 20upx;}
.wwiapp-order-detail-block .hd.ntit .h3{color: #FF7637; margin-right: 20upx;}
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
.shipping_list{background: #FFFFFF; padding: 20upx;}
.shipping_list .list{ font-size: 28upx; border-bottom: 1px solid #EEEEEE;}
.shipping_list .list .lt{font-size: 32upx; width: 150upx; display: flex; align-items: center; color:#00ADF4 ;}
.shipping_list .list .rt{flex: 1; flex-wrap: wrap;}
.shipping_list .list .rt .item{background: #F8F8F8; line-height: 60upx; padding:  0 15upx; border-radius:30upx ; margin: 20upx 0 10upx 20upx;}
.shipping_list .list .rt .item.ok{background: #d6f1fd; border: 1px dotted #03a9f4; color: #03a9f4;}
</style>
