<template>
	<view>
		<view class="invite-goods-list">
				<view v-if="!goods_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-daohang"></view>
						<view class="dl">
							<view class="dt">没有查询到相关商品</view>
							<view class="dd">你可以换个关键词或条件查询</view>
						</view>
					</view>
				</view>
			<view class="li flex flexrow" v-for="(item,index) in goods_list" :key="index">
				<view class="invite-goods-img"><image :src="item.goods_image_url" lazy-load></image></view>
				<view class="invite-goods-info">
					<view class="invite-goods-name">{{item.goods_name}}</view>
					<view class="invite-goods-price flex flexJcs"><view class="price">¥{{item.goods_price}}</view> <view class="goods-num">销量:{{item.sale_count}}</view></view>
					<view class="invite-goods-rmis flex flexJcs"><view class="em">佣金比例:{{item.jfx_commis_rate}}%</view> <view class="">佣金:￥{{item.jfx_commis_amount}}</view></view>
					<view class="btn flex"><view class="span" @click="itemAdd(item.goods_commonid)">加入小店</view><navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="span" style="background: #9e9e9e;">查看商品</navigator></view>
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
				curpage:1,
				hasmore:true,
				gcid:'',
				bid:"",
				keyword:"",
				goods_list:[]
			};
		},
		methods:{
			getList(action = 'refresh'){
				if (!this.hasmore) {
					return false;
				}
				this.hasmore = false;
				var param = {};
				param.page = 10;
				param.curpage = this.curpage;
				if (this.gcid != '') {
					param.gc_id = this.gcid;
				} else if (this.keyword != '') {
					param.keyword = this.keyword;
				} else if (this.bid != '') {
					param.b_id = this.bid;
				}
				if (this.key != '') {
					param.key = this.key;
				}

				this.wwiopt({
					url: '/index.php?app=member_distri&wwi=search',
					data: param,
					success: res => {
						if(res.data.code==200){
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.goods_list.forEach(item => {
									this.$set(item,'click',false);
									this.goods_list.push(item);
								});

							} else {
								res.data.datas.goods_list.forEach(item=>{
									this.$set(item,'click',false);
								});
								this.goods_list = res.data.datas.goods_list;
								if (res.data.hasmore) {
									this.showloadMore = true;
								}
							}
						this.hasmore = res.data.hasmore;
						if(!res.data.hasmore){
							this.loadMore = '加载完成，没有更多了..'
						}else{
							this.loadMore = '加载更多..'
						}
						}else{
							uni.showToast({
								title: '列表加载异常',icon:"none"
							});
						}
					}
				});
			},
			itemAdd(e){
				uni.request({
					url: this.ApiUrl + '/index.php?app=member_distri&wwi=jfx_add_goods',
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key,id:e},
					success: res => {
						this.checkLogin(res.data.login);
						if(res.data.datas.error){
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
							return false;
						}
						if(res.data.datas==1){
							uni.showToast({
								title: '加入小店商品成功',icon:"none"
							});
						}
						
					}
					
				});
			}
		},
		onLoad:function(e){
			if (e.gcid) {
				this.gcid = e.gcid;
			}
			if(e.bid){
				this.bid = e.bid;
			}
			if(e.keyword){
				this.keyword = e.keyword;
				}
			this.key = uni.getStorageSync('key');
			this.getList()
		},
		onShow:function(){
			document.title = '选择推广商品-'+this.siteTitle;
		}
	}
</script>

<style>
.invite-goods-list{}
.invite-goods-list .li{padding: 20upx; background: #FFFFFF; border-bottom: 1px solid #EFEFEF;}
.invite-goods-list .li .invite-goods-img{width: 180upx; height: 180upx;}
.invite-goods-list .li .invite-goods-img image{width: 180upx; height: 180upx;}
.invite-goods-list .li .invite-goods-info{margin-left: 20upx; flex: 1;}
.invite-goods-list .li .invite-goods-info .invite-goods-name{font-size: 28upx;}
.invite-goods-list .li .invite-goods-info .invite-goods-price{font-size: 26upx;}
.invite-goods-list .li .invite-goods-info .invite-goods-price .price{font-weight: bold;}
.invite-goods-list .li .invite-goods-info .invite-goods-rmis{font-size: 28upx;}
.invite-goods-list .li .invite-goods-info .invite-goods-rmis .em{ color: #FF0036;}
.invite-goods-list .li .invite-goods-info .btn{}
.invite-goods-list .li .invite-goods-info .btn .span{background: #2196f3; color: #FFFFFF; padding: 5upx 15upx; font-size: 28upx;}
</style>
