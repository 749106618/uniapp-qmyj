<template>
	<view style="padding-bottom: 88upx;">
		<view class="wwiapp-cart-block mt5">
			<view class="wwiapp-loop-list">
				<view class="h3">
					<view class="wwi-icon wwi-icon-duanxin"></view>
					<view style="font-size: 32upx;">接收方式</view>
				</view>
				<view class="u-content flex flexAic" style="font-size: 24upx; margin-right: 20upx; color: #FF0036;">兑码订单兑换码将以短信形式发送至买家手机</view>
			</view>
			<view class="VRinput">
				<input type="number" v-model="buyerPhone" maxlength="11" value="" placeholder="输入接收者手机号" />
			</view>
		</view>
		<view class="wwiapp-buy-container mt5">
			<view class="wwiapp-cart-store">
				<view class="dt flex flexrow">
					<view class="wwi-icon wwi-icon-dianpu"></view>
					<view class="title">{{goodsInfo.store_name}}</view>
				</view>
			</view>
			<view class="wwiapp-cart-item">
				<view class="li flex flexrow">
					<view class="goods-image">
						<image :src="goodsInfo.goods_image_url" mode=""></image>
					</view>
					<view class="goods-info flex flexcol">
						<view class="goods-name">{{goodsInfo.goods_name}}</view>
						<view class="goods-spec">{{goodsInfo.goods_spec}}</view>
						<view class="goods-subtotal flex flexrow flexJcs">
							<view class="goods-price flex flexrow">
								<view class="em">￥</view>{{goodsInfo.goods_price}}
							</view>
							<view class="goods-num flex flexrow flexAic">
								<view class="em">{{goodsInfo.quantity}}</view>件
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="wwiapp-cart-subtotal">
				<view class="message">
					<textarea v-model="message" placeholder="店铺订单留言" auto-height />
					</view>
					<view class="store-total flex flexrow">本店合计:<view class="em">{{goodsInfo.goods_total}}</view>元</view>
				</view>
			</view>
		 <view class="buyer-bottom flex flexrow" >
		 	<view class="total-money flex flexrow">
		 		<view class="dt">合计总金额：</view><view class="em">￥</view><view class="span">{{goodsInfo.goods_total}}</view>
		 	</view>
		 	<view class="btn":class="{'no':noBuy}" @click="buyNowto"><view >提交订单</view></view>
		 </view>
		 <wwi-payment-mask ref="wwiPaymentMask"></wwi-payment-mask>
	</view>
</template>

<script>
import wwiPaymentMask from '../../components/wwi-payment-mask.vue';
	export default {
		components: {
			wwiPaymentMask
		},
		data() {
			return {
				key:'',
				goodsId:'',
				quantity:'',
				message:'',
				noBuy:false,
				goodsInfo:[],
				buyerPhone:''
			};
		},
		methods:{
			loadData:function(){
				this.wwiopt({
					url: '/index.php?app=member_vr_buy&wwi=buy_step2',
					method: 'POST',
					data: {key:this.key,goods_id:this.goodsId,quantity:this.quantity},
					success: res => {
						var data = res.data.datas;
						if (typeof(data.error) != 'undefined') {
							uni.switchTab({
								url:'/pages/index'
							});
							return;
						}
						this.goodsInfo = data.goods_info;
						this.buyerPhone = data.member_info.member_mobile;
					},
					fail: () => {},
					complete: () => {}
				});
			},
			buyNowto:function(){
				if(this.noBuy){
					uni.showToast({
						title: '数据处理中,请勿重复点击',icon:"none"
					});
					return false;
				}
				if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.buyerPhone))){
					uni.showToast({
						title: '请填写正确的手机号码',icon:"none"
					});
					return false;
				}
				this.noBuy = true;
				var parem = {};
				parem.key = this.key;
				parem.goods_id = this.goodsId;
				parem.quantity = this.quantity;
				parem.buyer_phone = this.buyerPhone;
				parem.buyer_msg = this.message;
				this.wwiopt({
					url: '/index.php?app=member_vr_buy&wwi=buy_step3',
					method: 'POST',
					data: parem,
					success: res => {
						this.checkLogin(res.data.login);
						if (res.data.datas.error) {
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
							this.noBuy = false;
							return false;
						}
						if (res.data.datas.order_id) {
								var toPay = {
									app:'member_vr_buy',
									wwi:'pay',
									paySn:res.data.datas.order_sn
								}
								this.$refs.wwiPaymentMask.show(toPay);
						}
						return false;
					},
					fail: () => {
						uni.showToast({
							title: '网络连接异常或超时，请稍后再试',icon:"none"
						});
						this.noBuy = false;
						return false;
					}
				});

			}
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('key');
			this.goodsId = e.goodsId;
			this.quantity = e.quantity;
			this.loadData();
		}
	}
</script>

<style>
@import "../../common/css/buystep.css";
</style>
