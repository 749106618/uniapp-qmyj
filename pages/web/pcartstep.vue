<template>
	<view>
			<view class="wwiapp-order-detail-block mt5">
				<view class="wwiapp-oredr-detail-add"  @click="addressShow">
					<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
					<view class="dl">
						<view class="dt">
							<view class="span">收货人：</view>
							<view class="span strong">{{info.address_info.true_name}}</view>
							<view class="span strong">{{info.address_info.mob_phone}}</view>
						</view>
						<view class="dd">收货地址：{{info.address_info.area_info}}</view>
					</view>
					<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou" style="color: #777;"></view>
				</view>
			</view>
			<view class="cart-list mt5">
			<view class="item flex flexrow" v-for="(item,index) in info.pointprod_arr.pointprod_list" :key="index">
				<view class="goods-pic">
					<image :src="item.pgoods_image" ></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{item.pgoods_name}}</view>
					<view class="goods-subtotal">所需积分:{{item.onepoints}}</view>
					<view class="goods-num">{{item.quantity}}件</view>
				</view>
			</view>
			<view class="message">
				<input type="text" v-model="message" placeholder="备注留言" />
			</view>
		 </view>
		 <view class="bottom flex flexrow" >
		 	<view class="total-money flex flexrow">
		 		<view class="dt">所需总积分：</view><view class="em">{{info.pointprod_arr.pgoods_pointall}}</view><view class="span">积分</view>
		 	</view>
		 	<view class="btn" @click="postCart"><view style="font-size: 0.8em;">确认兑换</view></view>
		 </view>
		 
		 <view class="wwiapp-full-mask" v-if="showDv>0" :class="{'hide':showDv==0,'left':showDv==1,'right':showDv==2}"  catchtouchmove="reue">
		 <view class="wwiapp-full-mask-bg" v-show="showDv==1" @click="showDv=2"  catchtouchmove="true"></view>
		 	<view class="wwiapp-full-mask-block flex flexcol">
				<view class="header-title">选择地址</view>
				<scroll-view scroll-y class="mask-bd">
					<view class="wwiapp-order-detail-block mt5" v-for="(adr,vv) in addressList" :key="vv">
						<view class="wwiapp-oredr-detail-add"  @click="seletHim(adr)">
							<view class="wwi-icon" :class="{'wwi-icon-duihao':address_id == adr.address_id}"></view>
							<view class="dl">
								<view class="dt">
									<view class="span">收货人：</view>
									<view class="span strong">{{adr.true_name}}</view>
									<view class="span strong">{{adr.mob_phone}}</view>
								</view>
								<view class="dd">收货地址：{{adr.area_info}}</view>
							</view>
						</view>
					</view> 
				</scroll-view>
				<navigator url="/pages/my/addressadd" class="mask-bottom">新增收货地址</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address_id:'',
				key:'',
				info:{
					address_info:[],
					pointprod_arr:[]
				},
				showDv:0,
				addressList:[],
				message:'',
				post:true
			};
		},
		methods:{
			getInfo:function(){
				this.wwiopt({
					url: '/index.php?app=member_points&wwi=pointcart_step1',
					data: {key:this.key,address_id:this.address_id},
					success: res => {
						this.checkLogin(res.data.login);
						if (res.data.datas.error) {
							uni.showToast({title: '文章不存在',icon: "none",success() {setTimeout(function() {uni.navigateBack();}, 1000);}});
						}
						this.info = res.data.datas;
						
						if(this.isEmptyObject(res.data.datas.address_info)){
							uni.showModal({
								title: '提示',
								content: '请先添加收货地址~',
								showCancel: true,
								cancelText: '取消',
								confirmText: '确定',
								success: res => {
									if(res.confirm){
										uni.navigateTo({
											url:'/pages/my/addressadd'
										})
									}else{
										uni.navigateBack();
									}
								}
								
							});
						}else{
							this.address_id = res.data.datas.address_info.address_id;
						}
					}
				});
			},
			addressShow:function(){
					if(this.showDv != 1){
						this.showDv = 1;
					}else{
						this.showDv = 2;
					}
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_address&wwi=address_list",
						method: 'POST',
						data: {key:this.key},
						header: {'content-type': 'application/x-www-form-urlencoded'},
						success: res => {
							this.checkLogin(res.data.login);
							if(res.data.datas.address_list==null){
								return false;
							}
							this.addressList = res.data.datas.address_list;
						}
					});
			},
			seletHim:function(e){
				this.info.address_info = e;
				this.address_id = e.address_id;
				this.showDv = 2;
			},
			postCart:function(){
                if(!this.post){
					uni.showToast({title: '数据已提交,请耐心等待',icon:"none"});
					return false;
				}
				this.post = false;
				uni.request({
					url: this.ApiUrl+'/index.php?app=member_points&wwi=pointcart_step2',
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key,address_options:this.address_id,pcart_message:this.message},
					success: res => {
						this.checkLogin(res.data.login);
						if (res.data.datas.error) {
							uni.showToast({title: res.data.datas.error,icon:"none"});
							this.post = true;
							return false;
						}
						uni.redirectTo({
							url:'/pages/my/pointorder'
						})
					}
				});
			}
		},
		onShow:function(e){
			this.key = uni.getStorageSync('key');
			if(this.key){
				this.getInfo();
			}else{
				uni.navigateTo({	url: '/pages/web/login'});
			}
		}
	}
</script>

<style>
	.wwiapp-order-detail-block{background: #fff;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add{display: flex; flex-direction: row; padding: 20upx 0;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .wwi-icon{width: 80upx;align-items: center; justify-content:center; display: flex;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl{display: flex; flex-direction: column; flex: 1;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl .dt{display: flex; flex-direction: row; align-items: center; font-size: 32upx;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl .dt .span{margin-right: 10upx;}
.wwiapp-order-detail-block .wwiapp-oredr-detail-add .dl .dd{font-size: 28upx;}
.cart-list{margin-bottom: 2em;}
.cart-list .item{padding: 0.5em; border-bottom: 0.05em solid #eee; background: #FFFFFF;}
.cart-list .item .goods-pic{width: 4em; height: 4em; padding: 0.25em; box-sizing: border-box; border: 0.05em solid #eee; border-radius:0.5em ;}
.cart-list .item .goods-pic image{width: 3.5em; height: 3.5em; border-radius:0.5em ;}
.cart-list .item .goods-info{flex: 1; margin-left: 0.5em; position: relative;}
.cart-list .item .goods-info .goods-name{font-size: 0.8em; line-height: 1.5em; height: 3em; margin-right: 3em;}
.cart-list .item .goods-info .goods-num{position: absolute; bottom: 0; right: 0; font-size: 0.8em; }
.cart-list .item .goods-info .goods-subtotal{font-size: 0.7em; color: #FF0036; font-weight: bold;}
.message {height: 1.6em;padding-top: 0.4em;}
.message input{width: 91%;height: 0.9rem;padding: 2%;margin: 0 2.5%;background-color: #F0F0F0;border: none;border-radius: 0.2rem;line-height: 0.9rem;font-size: 0.6rem;}
.bottom{left: 0; right: 0; bottom: 0; height: 2em; position: fixed; z-index: 995; background: #fff; border-top:0.05em solid #eee ;}
.bottom .total-money{flex: 1; justify-content: flex-end; align-items: center; margin-right: 0.5em;}
.bottom .total-money .dt{font-size: 0.75em;}
.bottom .total-money .em{color: #FF0036; font-size: 1em; font-weight: bold;}
.bottom .total-money .span{font-size: 0.7em;color: #FF0036; font-weight: bold;}
.bottom .btn{background: #FF0036; display: flex; justify-content: center; align-items: center; width:6em; color: #FFFFFF;}
.wwiapp-full-mask-block{background: #fff;}
.wwiapp-full-mask-block .header-title{display: flex; align-items: center; justify-content: center; height: 44px; font-size: 18px;}
.wwiapp-full-mask-block .mask-bd{width: 100%; height: calc(100% - 88px);}
.wwiapp-full-mask-block .mask-bottom{height: 44px; background: #FF0036; color: #FFFFFF;display: flex; align-items: center; justify-content: center;  font-size: 18px;}
</style>
