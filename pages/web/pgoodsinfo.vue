<template>
	<view class="newBody maxBody">
		<image class="goods-pic" :src="info.pgoods_info.pgoods_image_max" mode="widthFix" lazy-load=""></image>
		<view class="padding flex flexcol">
			<view style="padding: 0.5em 0.5em 0 0.5em;">
		<view class="goods-detail-name">{{info.pgoods_info.pgoods_name}}</view>
		<view class="goods-detail-price flex flexJcs">
			<view class="dt flex flexrow">{{info.pgoods_info.pgoods_points}}<view class="em">积分</view> </view>
			<view class="span">剩余:&nbsp;{{info.pgoods_info.pgoods_storage}}&nbsp;件</view>
		</view></view>
		<view class="goods-detail-item flex flexrow">
			<view class="dt">市场参考价</view>
			<view class="dd">{{info.pgoods_info.pgoods_price}}元</view>
		</view>
		</view>
		<view class="padding flex flexcol" style="margin-top: 0.5em;">
		<view class="goods-detail-item flex flexrow">
			<view class="dt bt"><view class="wwi-icon wwi-icon-weibiaoti1"></view>礼品描述</view>
		</view>
		<view class="goods-detail-item flex flexrow">
			<rich-text :nodes="info.pgoods_info.pgoods_body"></rich-text>
		</view>
		<view class="goods-detail-item flex flexrow">
			<view class="dt">礼品编号</view>
			<view class="dd">{{info.pgoods_info.pgoods_serial}}</view>
		</view>
		<view class="goods-detail-item flex flexrow">
			<view class="dt">添加时间</view>
			<view class="dd">{{info.pgoods_info.pgoods_add_time}}</view>
		</view>
		<view class="goods-detail-item flex flexrow">
			<view class="dt">浏览人次</view>
			<view class="dd">{{info.pgoods_info.pgoods_view}}</view>
		</view>
		</view>
		<view class="padding flex flexcol" style="margin-top: 0.5em; margin-bottom: 2em;">
			<view class="goods-detail-item flex flexrow">
				<view class="dt bt"><view class="wwi-icon wwi-icon-tuwen"></view>兑换记录</view>
			</view>
			<view class="goods-detail-item flex flexcol">
				<view class="li flex flexrow" v-for="(item,index) in buyList" :key="index">
					<image class="orderPic" :src="item.member_avatar"></image>
					<view class="orderInfo">
						<view class="m-name">{{item.member_name}}</view>
						<view class="m-time">{{item.point_addtime}} 兑换了{{item.point_goodsnum}}件</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom flex flexrow">
			<navigator url="/pages/web/pgoodscart" class="flex flexcol cart"><view class="wwi-icon wwi-icon-baoguo_yidong"></view> <view class="sup" v-if="info.pointcart_count">{{info.pointcart_count}}</view><view class="span">兑换车</view></navigator>
			<view class="btn" @click="toCart">加入兑换车</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{
					pgoods_info:[]
				},
				key:'',
				pgoodsId:'',
				hasmore:true,
				curpage:1,
				buyList:[]
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url:  "/index.php?app=points&wwi=pgoods_detial",
					data: {key:this.key,pgoods_id:this.pgoodsId},
					success: res => {
						if(!res.data.datas.error){
							res.data.datas.pgoods_info.pgoods_body=res.data.datas.pgoods_info.pgoods_body.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
							this.info = res.data.datas;
							
							this.loadList()
						}else{
							uni.showToast({
								title: res.data.datas.error,
								icon: 'none',
								complete() {
									uni.navigateBack()
								}
							});
						}
					}
				});
			},
			loadList:function(){
				if(!this.hasmore){
					return false;
				}
				this.wwiopt({
					url: "/index.php?app=points&wwi=pgoods_order",
					data: {page:10, curpage:this.curpage, pgoods_id:this.pgoodsId},
					success: res => {
						if(res.data.code==200){
							this.curpage +=1;
							res.data.datas.order_list.forEach(item=>{
								this.buyList.push(item)
							})
							this.hasmore = res.data.hasmore;
						}
					}
				});
			},
			toCart:function(){
				if(!this.key){
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								uni.navigateTo({	url: '/pages/web/login'});
								return false;
							}
						}
					});
				}else{
					uni.request({
						url: this.ApiUrl + "/index.php?app=member_points&wwi=prodexchange",
						method:"POST",
						header: {'content-type': 'application/x-www-form-urlencoded'},
						data: {key:this.key,id: this.pgoodsId},
						success: res => {
							if (this.checkLogin(res.data.login)) {
								if (!res.data.datas.error) {
                                       this.info.pointcart_count+=1;
								} else {
									uni.showToast({
										title: res.data.datas.error,
										icon: 'none'
									});
								}
							}
						}
					});
				}
			}
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('key');
			if(e.id){
				this.pgoodsId = e.id;
				this.Inlimine()
			}else{
				uni.showToast({
					title: '页面打开错误',
					icon: 'none',
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
			this.loadList();
		}
	}
</script>

<style>
	page{background: #f8f8f8;}
.goods-pic{width: 100%; vertical-align: middle;}
.padding{ background: #fff;}
.goods-detail-name{ font-size: 36upx;}
.goods-detail-price{margin-top: 10upx;}
.goods-detail-price .dt{font-size: 40upx; color: #ff0036; align-items: baseline;}
.goods-detail-price .dt .em{font-size: 24upx; margin-left: 20upx;}
.goods-detail-price .span{font-size: 28upx;}
.goods-detail-item{ color: #777; align-items: baseline; padding: 20upx; border-bottom: 1px solid #eee; overflow: hidden;}
.goods-detail-item image{width: 100%;}
.goods-detail-item .dt{font-size: 32upx;}
.goods-detail-item .dd{font-size: 28upx; font-weight: bold; margin-left: 20upx;}
.goods-detail-item .bt .wwi-icon{background: #000; color: #FFFFFF; border-radius:10upx ; font-size: 36upx;}
.goods-detail-item .bt{color: #000; font-weight: bold;}
.goods-detail-item .li{width: 100%;}
.goods-detail-item .li .orderPic{width: 120upx; height: 120upx; border-radius:50% ; border: 1px solid #eee; margin: 20upx 0;}
.goods-detail-item .li .orderInfo{flex: 1; margin-left: 20upx; margin-top: 10upx; border-bottom:1px solid #eee ;}
.goods-detail-item .li .m-name{font-size: 32upx;  color: #000;}
.goods-detail-item .li .m-time{font-size:26upx;}
.bottom{position: fixed; z-index: 998; background: #fff; left: 0; right: 0; bottom: 0; height: 80upx; border-top: 1px solid #eee;}
.bottom .btn{background: #ff0036; color: #FFFFFF; font-weight: bold; display: flex; align-items: center; justify-content: center; flex: 1; font-size:32upx;}
.bottom .cart{width: 120upx; display: flex; justify-content: center; align-items: center; position: relative;}
.bottom .cart .sup{position: absolute; background: #FF0036; color: #FFFFFF; height: 24upx;min-width: 24upx; border-radius:50% ; padding:5upx; display: flex; justify-content: center; align-items: center; font-size: 20upx; top: 0; right: 10upx;}
.bottom .cart .wwi-icon{line-height: 48upx;}
.bottom .cart .span{font-size: 24upx;line-height: 24upx;}
</style>
