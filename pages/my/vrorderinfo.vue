<template>
	<view>
		<view class="wwiapp-order-list">
			<view class="wwiapp-order-detail-block">
				<view class="wwi-icon wwi-icon-zhangdan_xiangqing lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">交易状态</view>
					<view class="state">{{orderInfo.state_desc}}</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block">
				<view class="wwiapp-oredr-detail-add">
					<view class="wwi-icon wwi-icon-shouji"></view>
					<view class="dl">
						<view class="dt">
							<view class="span">买家手机：</view>
							<view class="span strong">{{orderInfo.buyer_phone}}</view>
						</view>
					</view>
					<view  @click="resend" style="border: 2upx solid #eee; background: #F5f5f5; padding: 4upx 8upx; border-radius:10upx ; font-size: 24upx;">重新发送兑换码</view>
				</view>
			</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="wwi-icon wwi-icon-wenben lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">虚拟兑换码</view>
					<view class="state">有效期至{{orderInfo.vr_indate}}</view>
					</view>
				</view>
			</view>
			<view class="vr_code">
				<view class="li" v-for="(code,index) in orderInfo.code_list" :key="index">
					<view class="code_li ok" v-if="code.vr_state == 0 && code.refund_lock != 2 && code.refund_lock != 1">
					<view class="em">有效</view>
					<view class="span">{{code.vr_code}}</view>
					<view class="code wwi-icon wwi-icon-erweima"  @tap="swichCode(index)"></view>
					</view>
					<view class="code_li refund" v-if="code.refund_lock == 1">
					<view class="em">退款中</view>
					<view class="span">{{code.vr_code}}</view>
					</view>
					<view class="code_li no" v-if="code.vr_state != 0 || code.refund_lock == 2">
					<view class="em">失效</view>
					<view class="span">{{code.vr_code}}</view>
					</view>
					<view class="popup popup-middle code_img" :class="{'hide':codeNow!=index}"><view class="close wwi-icon wwi-icon-guanbi"  @tap="swichCode(index)"></view><image :src="code.qr_pic_url"></image></view>
					
				</view>
				</view>
				<block v-if="storeShop.length > 0">
			<view class="wwiapp-order-detail-block mt5">
				<view class="hd">
				<view class="wwi-icon wwi-icon-ditu_dingwei lt"></view>
				<view class="rt">
				<view class="hd">
					<view class="h3">商家信息</view>
					</view>
				</view>
				</view>
			</view>
			<view class="storeShop">
				<view class="dl">
					<view class="dt">{{storeShop[0].name_info}}</view>
					<view class="dd">{{storeShop[0].address_info}}</view>
				</view>
				<view class="pp wwi-icon wwi-icon-dianhua" @tap="tel(storeShop[0].phone_info)"></view>
			</view>
			<navigator class="more-location" :url="'/pages/web/storeshop?id='+orderInfo.store_id"><view class="">查看全部{{storeShop.length}}家分店地址</view><view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view></navigator>
		    </block>
					<view class="wwiapp-order-item mt5">
						<view class="wwiapp-order-item-head">
							<navigator :url="'/pages/web/store?storeid='+orderInfo.store_id" class="store">
								<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{orderInfo.store_name}}</text>
							</navigator>
						</view>
						<view class="wwiapp-order-item-con">
							<navigator :url="'/pages/web/item?goodsid='+orderInfo.goods_id" class="goods-block">
								<image :src="orderInfo.goods_image_url" class="goods-pic"></image>
								<view class="goods-info">
									<view class="goods-name">{{orderInfo.goods_name}}</view>
									<view class="goods-type" v-if="orderInfo.goods_spec!=null" >{{orderInfo.goods_spec}}</view>
								</view>
								<view class="goods-subtotal">
									<view class="goods-price">
										<view>￥</view><text class="em">{{orderInfo.goods_price}}</text>
									</view>
									<text class="goods-num">x{{orderInfo.goods_num}}</text>
								</view>
							</navigator>
						</view>
					</view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="nul">
				<view class="nli">订单编号：{{orderInfo.order_sn}}</view>
				<view class="nli">创建时间：{{orderInfo.add_time}}</view>
				<view class="nli" v-if="orderInfo.payment_time">付款时间：{{orderInfo.payment_time}}</view>
				<view class="nli" v-if="orderInfo.finnshed_time">完成时间：{{orderInfo.finnshed_time}}</view>
				</view>
			</view>
		</view>
<view class="wwiapp-oredr-detail-bottom">
	<view v-if="orderInfo.if_cancel" class="o-btn cancel-order" @click="cancelOrder">取消订单</view>
	<navigator v-if="orderInfo.if_refund" :url="'/pages/my/refundvr?oid='+orderInfo.order_id" class="o-btn all_refund_order">订单退款</navigator>
    <navigator v-if="orderInfo.if_evaluation"  :url="'/pages/my/evaluationvr?oid='+orderInfo.order_id" class="o-btn key evaluation-order">评价订单</navigator>
	</view>

<view class="wwiapp-bottom-mask" :class="{'up':phoneTo==1,'down':phoneTo==2}">
  <view class="wwiapp-bottom-mask-bg" catchtouchmove="true" @tap="resend"></view>
  <view class="wwiapp-bottom-mask-block" catchtouchmove="true">
    <view class="wwiapp-bottom-mask-tip" @tap="resend"><view class="wwi-icon wwi-icon-anniu_jiantouzhankai"></view>点击此处返回</view>
    <view class="wwiapp-bottom-mask-top"><view class="wwiapp-bottom-mask-close wwi-icon wwi-icon-anniu_guanbi" @tap="resend"></view>
    <view class="msg-again-layout">
    <view class="h4">如果您没有收到虚拟商品兑换码或更改其它手机接收信息，请正确输入接收用手机号码并确认发送。</view>
    <view class="h5">系统最多可重新发送5次兑换码提示信息。</view>
        <input type="tel" v-model="buyerPhone" class="inp-tel" autocomplete="off" maxlength="11">
        </view>
        <view class="rpt_error_tip">{{phoneToerr}}</view>
    </view><view @click="tosend" class="btn-l mt20">确认发送</view>
  </view>
</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				key:'',
				orderId:4,
				orderInfo:[],
				buyerPhone:'',
				phoneTo:0,
				phoneToerr:'',
				codeNow:-1,
				storeShop:[]
			};
		},
		methods:{
			Inlimine(){
				this.wwiopt({
					url: "/index.php?app=member_vr_order&wwi=order_info",
					data: {
						key:this.key,
						order_id:this.orderId
					},
					success: res => {
						this.orderInfo = res.data.datas.order_info;
                        this.buyerPhone = res.data.datas.order_info.buyer_phone;
						uni.request({
							url: this.ApiUrl + '/index.php?app=goods&wwi=store_o2o_addr',
							data: {store_id:res.data.datas.order_info.store_id},
							success: res => {
								this.storeShop = res.data.datas.addr_list
							}
						});
					}
				});
			},
			cancelOrder() {
				uni.showModal({
					title: '提示',
					content: '确定取消订单？',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: this.ApiUrl + "/index.php?app=member_vr_order&wwi=order_cancel",
								method: 'POST',
								header: {'content-type': 'application/x-www-form-urlencoded'},
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
			},
			tosend(){
				uni.request({
					url: this.ApiUrl +"/index.php?app=member_vr_order&wwi=resend",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key:this.key,order_id:this.orderId,buyer_phone:this.buyerPhone},
					success: res => {
                if(res.data.datas && res.data.datas == 1){
					this.phoneTo = 2;
                } else {
					this.phoneToerr = res.data.datas.error;
                }
					}
				});
			},
			resend(){
				if(this.phoneTo == 1){
					this.phoneTo = 2;
				}else{
					this.phoneTo = 1;
				}
				
			},
			swichCode(e){
				if(this.codeNow==e){
					this.codeNow = -1;
				}else{
					this.codeNow = e;
				}
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
								title: '数据错误,请返回',
								icon: 'none',
								complete() {
									uni.navigateBack()
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
/* 虚拟码再次发送 */
.msg-again-layout {padding: 20upx 0; display: flex; justify-content: center;align-items: center; flex-direction: column;}
.msg-again-layout .h4 { font-size: 28upx; line-height: 36upx; color: #000;}
.msg-again-layout .h5 { font-size: 24upx; line-height: 36upx; color: #888; margin-bottom: 40upx;}
.msg-again-layout .inp-tel { width: 80%; height: 48upx; padding: 8upx; margin: 4upx auto 0 auto; border: solid #FF0036 2upx; border-radius: 8upx; font-size: 36upx; background-color: #FEF6F7; color: #000;text-align: center;}
.rpt_error_tip { font-size: 0.6rem; color: #DB4453 !important; display: none; text-align: center;}
.vr_code{background: #FFFFFF;}
.vr_code .li{display: flex;}
.vr_code .li .code_li{display: flex; flex-direction: row; align-items: center; height: 100upx;}
.vr_code .li .code_li .em{background: #009A61; color: #FFFFFF; padding: 5upx 10upx; margin: 0 20upx; border-radius:15upx ;}
.vr_code .li .code_li.refund .em{background: #FF0036;}
.vr_code .li .code_li.no .em{background: #555555;}
.vr_code .li .code_li .span{flex: 1;align-items: center; display:flex;}
.vr_code .li .code_li .code{width: 100upx; display: flex; justify-content: center; align-items: center;}
.vr_code .li .code_img{display: flex; background: #fff; flex-direction: column; width: 400upx; height: 500upx; position: fixed; z-index: 1000;}
.vr_code .li .code_img image{justify-content: center; width: 400upx; height: 400upx;}
.vr_code .li .code_img .close{display: flex; justify-content: center; align-items: center; height: 100upx;}
.popup {background-color: #ffffff;-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, .1);box-shadow: 0 0 30upx rgba(0, 0, 0, .1);}
.popup-middle {border-radius: 10upx;top: 0;right: 0;bottom: 0;left: 0;margin: auto;}
.storeShop{display: flex;flex-direction: row; background: #FFFFFF;}
.storeShop .dl{flex: 1; display: flex; flex-direction: column; font-size: 32upx; padding: 20upx 0 20upx 20upx;}
.storeShop .dl .dt{font-weight: 600; font-size: 36upx;}
.storeShop .pp{width: 120upx; display: flex; justify-content: center; align-items: center; border-left:2upx solid #F8F8F8 ;}
.more-location{display: flex; justify-content: space-between; font-size: 30upx; color: #FF0036; font-weight: 600; padding: 20upx; background: #FFFFFF; border-top:2upx solid #F8F8F8 ;}
.more-location .wwi-icon{color: #ddd;justify-content: center; align-items: center;}
</style>
