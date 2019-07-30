<template>
	<view>
		<view class="ShopHd">
			<view class="wwi-icon wwi-icon-didiandingwei"></view>
			<view class="b">全部实体分店共{{storeShop.length}}家</view>
		</view>
		<view class="storeShop">
			<view class="li" v-for="(item,index) in storeShop" :key="index">
				<view class="dl" @click="openLocation(item)">
					<view class="dt">{{item.name_info}}
						<view class="b">查看地图</view>
					</view>
					<view class="dd">{{item.address_info}}</view>
				</view>
				<view class="pp wwi-icon wwi-icon-dianhua" @tap="tel(item.phone_info)"></view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId: 1,
				storeShop: []
			};
		},
		methods: {
			Inlimine() {
				this.wwiopt({
					url: "/index.php?app=goods&wwi=store_o2o_addr",
					data: {
						store_id: this.storeId
					},
					success: res => {
						this.storeShop = res.data.datas.addr_list
					}
				});
			},
			tel(e) {
				uni.makePhoneCall({
					phoneNumber: e //仅为示例
				});
			},
			openLocation: function(e) {
				var t = this.bd_decrypt(e.lng, e.lat);
				uni.openLocation({
					longitude: Number(t.lng),
					latitude: Number(t.lat),
					name: e.name_info,
					address: e.address_info
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
			}
		},
		onLoad: function(e) {
			if (e.id > 0) {
				this.storeId = e.id;
				this.Inlimine();
			} else {
				uni.showToast({
					title: '数据错误,请返回',
					icon: 'none',
					complete() {
						uni.navigateBack()
					}
				});
			}
		}
	}
</script>

<style>
 page{background: #f8f8f8;}
.ShopHd{display: flex; flex-direction: row; height: 100upx; font-size: 32upx;align-items: center; font-weight: 600;}
.ShopHd .wwi-icon{display: flex; justify-content: center;align-items: center; width: 60upx; color: #673AB7;}
.ShopHd .b{}
.storeShop{background: #FFFFFF;}
.storeShop .li{display: flex;flex-direction: row; border-bottom: 2upx solid #F8F8F8; }
.storeShop .dl{flex: 1; display: flex; flex-direction: column; font-size: 32upx; padding: 20upx 0 20upx 20upx;}
.storeShop .dl .dt{font-weight: 600; font-size: 36upx; display: flex; flex-direction: row;}
.storeShop .dl .dt .b{font-weight: 600; color: #673AB7; margin-left: 20upx; font-size: 32upx;}
.storeShop .pp{width: 120upx; display: flex; justify-content: center; align-items: center; border-left:2upx solid #F8F8F8 ;}
</style>
