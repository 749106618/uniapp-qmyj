<template>
	<view>
		<view class="point_order_list">
				<view v-if="!info.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-yichangshangbao"></view>
						<view class="dl">
							<view class="dt">没有找到任何相关信息</view>
						</view>
					</view>
				</view>
			<view class="item mt5" v-for="(item,index) in info" :key="index">
				<view class="wwiapp-order-item-head flex flexrow flexJcs">
					<view class="title">兑换单号：{{item.point_ordersn}}</view>
					<view class="state">{{item.point_orderstatetext}}</view>
				</view>
				<view class="wwiapp-order-item-head flex flexrow">
					<view class="title">兑换时间：{{item.add_time}}</view>
				</view>
				<view class="wwiapp-order-item-con">
					<view class="goods-block flex flexrow" v-for="(sub,v) in item.prodlist" :key="v">
						<view class="goods-pic"><image :src="sub.point_goodsimage" ></image></view>
						<view class="goods-info"><view class="goods-name">{{sub.point_goodsname}}</view></view>
						<view class="goods-subtotal flex flexrow flexJcs"><view class="goods-price">积分{{sub.point_goodspoints}}</view><view class="goods-num">x{{sub.point_goodsnum}}</view></view>
					</view>
				</view>
				<view class="wwiapp-order-item-footer flex flexrow">
					<view class="span">合计（积分）</view>
					<view class="em">{{item.point_allpoint}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key:'',
				info:[],
				curpage:1,
				hasmore:true
			};
		},
		methods:{
			Inlimine:function(){
				if(!this.hasmore){
					return false;
				}
				this.wwiopt({
					url: '/index.php?app=member_points&wwi=point_order',
					data: {key:this.key,page:10,curpage:this.curpage},
					success: res => {
						if(res.data.code==200){
							this.curpage +=1;
							res.data.datas.order_list.forEach(item=>{
								this.info.push(item)
							});
							this.hasmore = res.data.hasmore;
						}
					}
				});
			}
		},
		onLoad:function(){
			this.key = uni.getStorageSync('key');
			if(this.key){
				this.Inlimine();
			}else{
				uni.navigateTo({	url: '/pages/web/login'});
			}
		},
		onPullDownRefresh:function(){
			this.curpage = 1;
			this.hasmore =true;
			this.info=[];
			this.Inlimine();
			uni.stopPullDownRefresh();
		},
		onReachBottom:function(){
			this.Inlimine();
		}
	}
</script>

<style>
.point_order_list .item {padding: 0 2.5%; background: #FFFFFF;}
.point_order_list .item .wwiapp-order-item-head{height: 36upx;padding: 20upx 0;border-bottom: solid 1px #EEE;line-height: 36upx;}
.point_order_list .item .wwiapp-order-item-head .title{font-size: 28upx;}
.point_order_list .item .wwiapp-order-item-head .state{font-size: 28upx; color: #FF0036;}
.point_order_list .item .wwiapp-order-item-con .goods-block{padding: 20upx 0;}
.point_order_list .item .wwiapp-order-item-con .goods-pic{margin:0 20upx; width: 160upx; height: 160upx;}
.point_order_list .item .wwiapp-order-item-con .goods-pic image{width: 160upx; height: 160upx;}
.point_order_list .item .wwiapp-order-item-con .goods-info{flex: 1;}
.point_order_list .item .wwiapp-order-item-con .goods-info .goods-name{font-size: 28upx;}
.point_order_list .item .wwiapp-order-item-con .goods-subtotal{width: 180upx; margin-left: 10upx;}
.point_order_list .item .wwiapp-order-item-con .goods-subtotal .goods-price{color: #FF0036; font-size: 28upx;}
.point_order_list .item .wwiapp-order-item-con .goods-subtotal .goods-num{font-size: 28upx;}
.wwiapp-order-item-footer {border-top: solid 1px #EEE;margin-top: 16upx;min-height: 36upx; padding: 20upx 0;justify-content: flex-end ; align-items: baseline;}
.wwiapp-order-item-footer .span{font-size: 28upx;}
.wwiapp-order-item-footer .em{font-size: 36upx; color: #FF0036; font-weight: 600;}
</style>
