<template>
	<view class="newBody">
		<view class="chain-banner"><image :src="info.chain_info.chain_banner" mode="widthFix"></image></view>
		<view class="chain-info flex flexrow">
			<view class="store-avatar"><image :src="info.chain_info.chain_img"></image></view>
			<view class="detail-item">
				<view class="dl flex flexrow">
					<view class="dt">店铺名称:</view>
					<view class="dd">{{info.chain_info.chain_name}}</view>
				</view>
				<view class="dl flex flexrow">
					<view class="dt">门店地址:</view>
					<view class="dd">{{info.chain_info.area_info}}{{info.chain_info.chain_address}}</view>
				</view>
				<view class="dl flex flexrow">
					<view class="dt">联系电话:</view>
					<view class="dd">{{info.chain_info.chain_phone}}</view>
				</view>
				<view class="dl flex flexrow">
					<view class="dt">营业时间:</view>
					<view class="dd">{{info.chain_info.chain_opening_hours}}</view>
				</view>
			</view>
		</view>
		<view class="detail-item2 flex flexrow flexAic" @click="showVoucher" style="border-top-width: 0.05em; border-top-style: solid; border-top-color: rgb(238, 238, 238); background: #FFFFFF;" v-if="info.voucher_list.length">
			<view class="item-name">领券</view>
			<view class="item-con"><view class="dt flex flexrow">
			   <view class="li flex flexrow" v-for="(item,vv) in info.voucher_list">
					 <view class="wwi-icon wwi-icon-bian"></view>
					 <view class="flex flexAic" style="background: #FF0036;font-size: 0.6em; height: 100%; padding: 0 0.5em;">满{{info.voucher_t_limit}}减{{info.voucher_t_price}}</view>
					 <view class="wwi-icon wwi-icon-bian-copy"></view>
					 </view> 
			</view></view>
			<view class="wwi-icon wwi-icon-iosgengduo"></view>
		</view>
		<view class="detail-item2 flex flexrow flexAic" @click="openLocation(info.chain_info)" style="border-top-width: 0.05em; border-top-style: solid; border-top-color: rgb(238, 238, 238); background: #FFFFFF;">
			<view class="item-name">地图</view>
			<view class="item-con"><view class="dt">查看地图</view></view>
			<view class="wwi-icon wwi-icon-iosgengduo"></view>
		</view>
		<view class="chain-goods-list">
			<view class="li flex flexrow" v-for="(item,k) in goodsList" :key="k">
				<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="goods-image"><image :src="item.goods_image" mode=""></image></navigator>
				<view class="goods-info">
					<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="goods-name">{{item.goods_name}}</navigator>
					<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="goods-sub-name">{{item.goods_jingle}}</navigator>
					<view class="sale flex flexrow flexJcs">
						<view class="price-info">
							<view class="price"><view class="em">￥</view>{{item.chain_price}}</view>
							<view class="goods-sold">销量<view class="em">{{item.goods_salenum}}</view></view>
						</view>
						<view class="btn" @click="cartBuy(item)"><view class="span">立即购买</view></view>
					</view>
				</view>
			</view>
		</view>
		<wwi-mask-up ref="wwiMaskUp" leftText="取消" title="领取代金券">
			<view class="wwiapp-voucher-list">
         <view v-if="info.voucher_list.length <= 0" class="wwi-nodata" style="position: sticky;padding: 2em 0;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-qiaquan"></view>
						<view class="dl">
							<view class="dt">暂无代金券可以领取</view>
							<view class="dd">店铺代金券可享受商品折扣</view>
						</view>
					</view>
				</view>
				<view class="li flex flexrow" @click="getVoucher(item)" v-for="(item,vvv) in info.voucher_list" :key="vvv">
					<view class="item-left flex flexrow">
						<view class="wwi-icon wwi-icon-bian"></view>
						<view class="price-info">
							<view class="price flex flexrow"><view class="em">￥</view>{{item.voucher_t_price}}</view>
							<view class="condition">满{{item.voucher_t_limit}}元可用</view>
						</view>
					</view>
					<view class="item-right">
						<view class="coupons-name"><view class="i">{{item.voucher_t_price}}元优惠券</view></view>
						<view class="coupons-text"><view class="time">有效期至{{item.voucher_t_end_date}}</view></view>
						<view class="coupons-text flex" style="justify-content: flex-end;"><view class="goto-receive">点击领取</view></view>
					</view>
				</view>
			</view>
		</wwi-mask-up>
	</view>
</template>

<script>
	import wwiMaskUp from '../../components/wwi-mask-up.vue';
	export default {
		components: {
			wwiMaskUp
		},
		data() {
			return {
				chainId:'',
				info:{
					chain_info:[],
					voucher_list:[]
				},
				goodsList:[],
				hasmore:true,
				curpage:1
			};
		},
		methods:{
			Inlimine() {
				this.wwiopt({
					url:"/index.php?app=chain",
					method: 'POST',
					data: {chain_id: this.chainId},
					success: res => {
						uni.setNavigationBarTitle({
							title:res.data.datas.chain_info.chain_name
						});
						this.info = res.data.datas;
					}
				});
				},
				getGlist(){
					if(!this.hasmore){
						return false;
					}
					this.wwiopt({
						url: '/index.php?app=chain&wwi=goods_list',
						data: {page:10,curpage:this.curpage,chain_id:this.chainId},
						success: res => {
                     this.curpage+=1;
										 res.data.datas.goods_list.forEach(item=>{
											   this.goodsList.push(item)
										 })
										 this.hasmore =res.data.hasmore;
						}
					});
				},
			openLocation: function(e) {
				var t = this.bd_decrypt(e.chain_lng, e.chain_lat);
				uni.openLocation({
					longitude: Number(t.lng),
					latitude: Number(t.lat),
					name: e.chain_name,
					address: e.chain_address
				})
			},
			bd_decrypt(bd_lng, bd_lat) {
				var X_PI = Math.PI * 3000.0 / 180.0;
				var x = bd_lng - 0.0065;
				var y = bd_lat - 0.006;
				var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
				var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
				var gg_lng = z * Math.cos(theta);
				var gg_lat = z * Math.sin(theta);
				return {
					lng: gg_lng,
					lat: gg_lat
				}
			},
			showVoucher(){
				this.$refs.wwiMaskUp.show();
			},
			getVoucher(e){
				var key =uni.getStorageSync('key');
				if(key){
				this.wwiopt({
					url: "/index.php?app=chain&wwi=get_voucher",
					method: 'POST',
					data: {key:key, tid:e.voucher_t_id},
					success: res => {
						 if(!res.data.datas.error){
							     uni.showToast({
							     title: '领取成功',icon:"none"
							     });
							 }else{
								 uni.showToast({
								 	title: res.data.datas.error,icon:"none"
								 });
							 }
					}
				});
			}else{
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								this.checkLogin(0);
							}
						}
					});
					return false;
			}
			},
			cartBuy(e){
				var key =uni.getStorageSync('key');
         if(!key){
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								this.checkLogin(0);
							}
						}
					});
					return false;
			}else{
	    if (e.stock < 1) {
				uni.showToast({
					title: '库存不足',icon:"none"
				});
	        return;
	    }
	    var parem = {};
	    parem.key = key;
	    parem.cart_id = e.goods_id + '|1';
			uni.request({
				url: this.ApiUrl + '/index.php?app=member_buy&wwi=buy_step1',
				method: 'POST',
				header: {'content-type': 'application/x-www-form-urlencoded'},
				data: parem,
				success: res => {
					if (res.data.datas.error) {
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
						}else{
							uni.navigateTo({
								url:'/pages/buy/buystep?goodsId='+e.goods_id+'&buynum=1&ifchain=1&chainId='+e.chain_id
							})
						}
				}
			});
			}
			
			}
				
		},
		onLoad:function(e){
			if(e.id){
				this.chainId = e.id;
				this.Inlimine();
				this.getGlist();
			}else{
				uni.showToast({
					title: '参数错误',icon:"none",
					success() {
						setTimeout(function() {
							var page = getCurrentPages();
							if(page.length > 1){
							  uni.navigateBack();
							}else{
							  uni.switchTab({  url:'/pages/index' });
							}
						}, 1000);
					}
				});
			}
			
		},
		onReachBottom:function(){
			if(this.hasmore){
				this.getGlist();
			}
		}
	}
</script>

<style>
	page{background: #F8F8F8;}
.chain-banner{width: 20em;}
.chain-banner image{width: 20em; vertical-align: middle;}
.chain-info{padding: 0.5em; background: #FFFFFF;}
.chain-info .store-avatar{width: 4em;}
.chain-info .store-avatar image{width: 4em; height: 4em;}
.chain-info .detail-item{flex: 1; margin-left: 0.5em;}
.chain-info .detail-item .dl{font-size: 0.65em;}
.chain-info .detail-item .dl .dt{ margin-right: 0.45em; color: #777;}
.chain-info .detail-item .dl .dd{flex: 1;}
.detail-item2{padding: 0.4em 0.5em;}
.detail-item2 .item-name{color: #777; font-size: 0.7em;}
.detail-item2 .item-con{flex: 1;}
.detail-item2 .item-con .dt{font-size: 0.7em; margin-left: 0.5em;}
.detail-item2 .item-con .dt .li{color: #FFFFFF; position: relative; height: 1.8em; margin-right: 0.5em;}
.detail-item2 .item-con .dt .wwi-icon{font-size: 10em; color: #FF0036; width: 10upx;height:100%; overflow: hidden;}
.wwiapp-voucher-list .li{margin-bottom: 0.5em;}
.wwiapp-voucher-list .li .item-left{width: 40%; height: 5em; color: #fff;}
.wwiapp-voucher-list .li .item-left .wwi-icon{font-size: 7em; width: 0.03em; overflow: hidden; color:  #6393d0;}
.wwiapp-voucher-list .li .item-left .price-info{background: linear-gradient(to right, #6393d0, #6a79d6); display: flex; flex-direction: column; justify-content: center; flex: 1; align-items: center;}
.wwiapp-voucher-list .li .item-left .price-info .price .em{font-size: 0.45em;}
.wwiapp-voucher-list .li .item-left .price-info .price{align-items: baseline; justify-content: center; font-size: 1.3em;}
.wwiapp-voucher-list .li .item-left .price-info .condition{font-size: 0.6em;}
.wwiapp-voucher-list .li .item-right{flex: 1; padding: 0.5em; background: #f8f8f8;}
.wwiapp-voucher-list .li .item-right .coupons-name{display: flex;}
.wwiapp-voucher-list .li .item-right .coupons-name .i{background: #6292d0; font-size: 0.65em; color: #FFFFFF; border-radius:0.25em ; padding: 0.125em 0.25em;}
.wwiapp-voucher-list .li .item-right .coupons-text{margin-top: 0.25em; display: flex;}
.wwiapp-voucher-list .li .item-right .coupons-text .time{font-size: 0.65em; color: #777;}
.wwiapp-voucher-list .li .item-right .coupons-text .goto-receive{color: #6292d0; border: 0.05em solid #6292d0; font-size: 0.6em; padding: 0 0.25em; border-radius: 0.5em; }
.chain-goods-list{background: #FFFFFF; margin-top: 0.5em;}
.chain-goods-list .li{}
.chain-goods-list .li .goods-image{padding: 0.5em;}
.chain-goods-list .li .goods-image image{width: 5em; height: 5em; vertical-align: middle;}
.chain-goods-list .li .goods-info{flex: 1;padding: 0.5em; border-bottom: 0.05em solid #eee; box-sizing: border-box; overflow: hidden;}
.chain-goods-list .li .goods-info .goods-name{    font-size: 0.75em;line-height: 1.2em;height: 2.4em;overflow: hidden;}
.chain-goods-list .li .goods-info .goods-sub-name  {font-size: 0.65em;color: #999;line-height: 1.2em;height:1.2em;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.chain-goods-list .li .goods-info .sale{}
.chain-goods-list .li .goods-info .sale .price-info{flex: 1;}
.chain-goods-list .li .goods-info .sale .price-info .price{display: flex; flex-direction: row; color: #FF0036; font-size: 0.95em; align-items: baseline;}
.chain-goods-list .li .goods-info .sale .price-info .price .em{font-size: 0.45em;}
.chain-goods-list .li .goods-info .sale .price-info .goods-sold{display: flex; flex-direction: row;font-size: 0.75em; align-items: baseline; color: #777;}
.chain-goods-list .li .goods-info .sale .price-info .goods-sold .em{color: #333; font-weight: bold;}
.chain-goods-list .li .goods-info .sale .btn{ color: #FFFFFF; display: flex; flex-direction: row; align-items: flex-end;}
.chain-goods-list .li .goods-info .sale .btn .span{background: #FF0036; font-size: 0.75em; padding: 0.125em 0.25em; border-radius:0.5em ; }
</style>
