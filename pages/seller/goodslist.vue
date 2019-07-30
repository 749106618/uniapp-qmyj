<template>
	<view class="order-content newBody">
		<view class="top-nav">
			<view class="hd">
				<view :class="['li',stateType=='' ? 'on' : '']" @click="swichNav('')">
					<view class="p">出售中</view>
				</view>
				<view :class="['li',stateType=='offline' ? 'on' : '']" @click="swichNav('offline')">
					<view class="p">仓库中</view>
				</view>
				<view :class="['li',stateType=='lockup' ? 'on' : '']" @click="swichNav('lockup')">
					<view class="p">违规的</view>
				</view>
				<view :class="['li',stateType=='wait_verify' ? 'on' : '']" @click="swichNav('wait_verify')">
					<view class="p">待审核</view>
				</view>
			</view>
		</view>
		<scroll-view class="order-main" scroll-y @scrolltolower="Inlimine">
			<view class="wwiapp-goods-list">
				<view v-if="!goods_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">没有找到</view>
							<view class="dd">该类型下没有商品哦！</view>
						</view>
					</view>
				</view>
				<view class="li mt10" v-for="(item,index) in goods_list" :key="index">
					<view class="hd flex flexrow">
						<image :src="item.goods_image" class="goods-img" mode="widthFix"></image>
						<view class="info">
							<view class="goods-name">{{item.goods_name}}</view>
						</view>
						<view class="goods-subtotal">
							<view class="goods-price flex flexrow">
								<view class="em">￥</view>{{item.goods_price}}
							</view>
							<view class="goods-strong">{{item.goods_storage_sum}}</view>
							</view>
					</view>
					<view class="bd flex flexrow flexJcs">
						<view class="add-ime">{{item.goods_addtime}}</view>
						<view class="btn flex flexrow">
							<navigator :url="'/pages/seller/aegoods?goodsid='+item.goods_commonid" class="edit span">编辑</navigator>
							<view class="offline span" @click="goodsOffine('unshow',item.goods_commonid,index)" v-if="item.goods_state ==1">下架</view>
							<view class="offline span" @click="goodsOffine('show',item.goods_commonid,index)" v-else-if="item.goods_state ==0">上架</view>
							<view class="del span" @click="delgoods(item.goods_commonid,index)">删除</view>
							<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="view span">查看</navigator>
						</view>
					</view>
				</view>
			</view>
			<view class="loadMore">{{loadMore}}</view>
			<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				goods_list: [],
				curpage: 1,
				orderKey: '',
				hasMore: true,
				loadMore: '',
				stateType: '',
				reset: true,
				showPageTop: false
			};
		},
		methods: {

			Inlimine() {
				if (this.reset) {
					this.curpage = 1;
					this.hasMore = true;
				}
				if (!this.hasMore) {
					return false;
				}
				this.hasMore = false;
				this.wwiopt({
					url: "/index.php?app=seller_goods&wwi=goods_list&page=10&curpage=" + this.curpage,
					method: 'POST',
					data: {
						key: this.key,
						goods_type: this.stateType
					},
					success: res => {
						this.checksellerLogin(res.data.login);
						this.curpage += 1;
						this.hasMore = res.data.hasmore;
						if (this.reset) {
							this.reset = false;
							this.goods_list = res.data.datas.goods_list;
							if (res.data.page_total > 1) {
								this.loadMore = '加载更多...'
							}
						} else {
							res.data.datas.goods_list.forEach(item => {
								this.goods_list.push(item);
							});
							if (!this.hasMore) {
								this.loadMore = '没有更多了'
							}
						}
					}
				});
			},
			swichNav(e) {
				if (e == this.stateType) {
					return false;
				}
				this.stateType = e;
				this.reset = true;
				this.loadMore = '';
				this.Inlimine();
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			},
			goodsOffine:function(e,g,i){
				if(e=='show'){
					this.wwiopt({
						url: '/index.php?app=seller_goods&wwi=goods_show',
						method: 'POST',
						data: {key: this.key,commonids:g},
						success: res => {
							if(res.data.datas.error){
								uni.showModal({
									content: res.data.datas.error,
									showCancel: false
								});
								return;
							}
								uni.showModal({
									content: '上架成功',
									showCancel: false
								});
								this.goods_list.splice(i, 1);
						}
					});
				}else{
					this.wwiopt({
						url: '/index.php?app=seller_goods&wwi=goods_unshow',
						method: 'POST',
						data: {key: this.key,commonids:g},
						success: res => {
							if(res.data.datas.error){
								uni.showModal({
									content: res.data.datas.error,
									showCancel: false
								});
								return;
							}
								uni.showModal({
									content: '下架成功',
									showCancel: false
								});
								this.goods_list.splice(i, 1);
						}
					});
				}
			},
			delgoods:function(e,i){
					this.wwiopt({
						url: '/index.php?app=seller_goods&wwi=goods_drop',
						method: 'POST',
						data: {key: this.key,commonids:g},
						success: res => {
							if(res.data.datas.error){
								uni.showModal({
									content: res.data.datas.error,
									showCancel: false
								});
								return;
							}
								uni.showModal({
									content: '删除成功',
									showCancel: false
								});
								this.goods_list.splice(i, 1);
						}
					});
			}
			
		},
		onShow: function() {

			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
			this.Inlimine();
		},
		onLoad: function(e) {
			if (e.state) {
				this.stateType = e.state;
			}
		},
		onPageScroll: function(e) {
			if (e.scrollTop > 300) {
				this.showPageTop = true;
			} else if (e.scrollTop < 300) {
				this.showPageTop = false;
			}
		}

	}
</script>

<style>
page{background: #F8F8F8;}
.order-content{display: flex;  width: 100%; height: 100%; flex-direction: column;}
.order-content .top-nav{flex: 1;  width: 100%; border-bottom: 1px solid #F8F8F8; background: #FFFFFF;}
.order-content .top-nav .hd{display: flex;flex-direction: row; height: 44px; }
.order-content .top-nav .li{flex: 1;align-items: center; justify-content: center; display: flex;}
.order-content .top-nav .li .p{ line-height: 42px; height: 42px; color: #232326; font-size: 15px;}
.order-content .top-nav .li.on .p{border-bottom:2px solid #F23030; color:#F23030;}
.order-main{flex: 1;  height: calc(100% - 44px);position: relative;}
.wwiapp-goods-list{font-size: 28upx;}
.wwiapp-goods-list .li{background: #FFFFFF; padding: 20upx;}
.wwiapp-goods-list .li .hd .goods-img{width: 120upx;}
.wwiapp-goods-list .li .hd .info{margin-left: 20upx; flex: 1;}
.wwiapp-goods-list .li .hd .info .goods-name{line-height: 45upx; height: 90upx; overflow: hidden;}
.wwiapp-goods-list .li .hd .goods-subtotal{margin-left: 10upx;}
.wwiapp-goods-list .li .hd .goods-subtotal .goods-price{color: #FF0036; font-size: 32upx;  font-weight: 600; align-items: baseline;}
.wwiapp-goods-list .li .hd .goods-subtotal .goods-price .em{font-size: 24upx;}
.wwiapp-goods-list .li .hd .goods-subtotal .goods-strong{display: flex; justify-content: center; background:#F8F8F8; border-radius:15upx ; color: #999999;}
.wwiapp-goods-list .li .bd{border-top:1px solid #F8F8F8; margin-top: 20upx; padding-top: 20upx;}
.wwiapp-goods-list .li .bd .add-ime{color: #888888;}
.wwiapp-goods-list .li .bd .btn{}
.wwiapp-goods-list .li .bd .btn .span{background: #F8F8F8; margin-left: 15upx; padding:0 15upx ;}
.wwiapp-goods-list .li .bd .btn .span.edit{background: #03a9f4; color: #FFFFFF;}
.wwiapp-goods-list .li .bd .btn .span.del{background: #f44336; color: #FFFFFF;}
.wwiapp-goods-list .li .bd .btn .span.offline{background: #00bcd4; color: #FFFFFF;}
</style>
