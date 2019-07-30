<template>
	<view class="newBody">
		<view class="cart-list">
				<view v-if="!info.cart_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-yichangshangbao"></view>
						<view class="dl">
							<view class="dt">暂无商品加入对换车</view>
						</view>
					</view>
				</view>
			<view class="item flex flexrow" v-for="(item,index) in info.cart_list" :key="index">
				<view class="goods-pic">
					<image :src="item.pgoods_image" ></image>
				</view>
				<view class="goods-info">
					<view class="goods-name">{{item.pgoods_name}}</view>
					<view class="goods-type">兑换积分{{item.pgoods_points}}</view>
					<view class="goods-subtotal">积分小计{{item.pgoods_pointone}}</view>
					<view class="del wwi-icon wwi-icon-shanchu" @click="del(item,index)"></view>
					<view class="numbox">
						<number-box :num="item.pgoods_choosenum" :min="1" v-on:change="onNumberChange($event,item)"></number-box>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom flex flexrow" v-if="info.cart_list.length">
			<view class="total-money flex flexrow">
				<view class="dt">所需总积分：</view><view class="em">{{info.pgoods_pointall}}</view><view class="span">积分</view>
			</view>
			<navigator url="/pages/web/pcartstep" class="btn">确认兑换</navigator>
		</view>
	</view>
</template>

<script>
	import numberBox from '../../components/number-box.vue'
	export default {
		data() {
			return {
				key:'',
				num:2,
				info:{
					cart_list:[]
				}
			};
		},
		components: {
			numberBox
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: "/index.php?app=member_points&wwi=prod_cart",
					method:"POST",
					data: {key:this.key},
					success: res => {
						this.info = res.data.datas;
					}
				});
			},
			del:function(e,index){
				uni.request({
					url: this.ApiUrl+"/index.php?app=member_points&wwi=prod_drop",
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key,pc_id:e.pcart_id},
					success: res => {
                    if(this.checkLogin(res.data.login)){
                        if(!res.data.datas.error && res.data.datas == "1"){
							this.info.cart_list.splice(index, 1);              
                        }else{
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
                        }
                    }
				   }
				});
			},
			onNumberChange(value,e) {
				if(value==e.pgoods_choosenum){
					return false;
				}
				uni.request({
					url: this.ApiUrl+"/index.php?app=member_points&wwi=update",
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key,cart_id:e.pcart_id,quantity:value},
					success: res => {
						if(!res.data.datas.error){
							e.pgoods_choosenum = res.data.datas.quantity;
							e.pgoods_pointone = res.data.datas.amount;
							this.calculateTotalPrice();
							}else{
								uni.showToast({	title: res.data.datas.error,icon:"none"});
							}
					}
				});
			},
			calculateTotalPrice(){
				var sum = 0;
				this.info.cart_list.forEach(item=>{
					sum+=item.pgoods_pointone;
				});
				this.info.pgoods_pointall =sum;
			}
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
			if(this.key){
				this.Inlimine();
			}else{
				uni.navigateTo({	url: '/pages/web/login'});
			}
		}
	}
</script>

<style>
	page{background: #F8F8F8;}
.bottom{left: 0; right: 0; bottom: 0; height: 80upx; position: fixed; z-index: 995; background: #fff; border-top:1px solid #eee ;}
.bottom .total-money{flex: 1; justify-content: flex-end; align-items: center; margin-right: 20upx;}
.bottom .total-money .dt{font-size: 30upx;}
.bottom .total-money .em{color: #FF0036; font-size: 36upx; font-weight: bold;}
.bottom .total-money .span{font-size: 28upx;color: #FF0036; font-weight: bold;}
.bottom .btn{background: #FF0036; display: flex; justify-content: center; align-items: center; width:240upx; color: #FFFFFF; font-size: 28upx;}
.cart-list{margin-bottom: 80upx;}
.cart-list .item{padding: 20upx; border-bottom: 1px solid #eee; background: #FFFFFF;}
.cart-list .item .goods-pic{width: 160upx; height: 160upx; padding: 10upx; box-sizing: border-box; border: 1px solid #eee; border-radius:20upx ;}
.cart-list .item .goods-pic image{width: 140upx; height: 140upx; border-radius:20upx ;}
.cart-list .item .goods-info{flex: 1; margin-left: 20upx; position: relative;}
.cart-list .item .goods-info .goods-name{font-size: 32upx; line-height: 40upx; height: 80upx; margin-right: 120upx;}
.cart-list .item .goods-info .goods-type{font-size: 24upx}
.cart-list .item .goods-info .goods-subtotal{font-size: 28upx; color: #FF0036; font-weight: bold;}
.cart-list .item .goods-info .del{position: absolute; right: 0;top: 0; color: #777;}
.cart-list .item .goods-info .numbox{position: absolute; right: 0;bottom: 0; color: #777;}
</style>
