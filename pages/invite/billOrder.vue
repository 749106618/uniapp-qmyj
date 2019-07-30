<template>
	<view>
		<view class="bill-list">
				<view v-if="billList.length<1" class="wwi-nodata" >
					<view class="no-main">
						<view class="wwi-icon wwi-icon-wangwang"></view>
						<view class="dl">
							<view class="dt">您还没有返利订单</view>
						</view>
					</view>
				</view>
			<view class="li" v-for="(item,index) in billList" :key="index">
				<view class="bill-sn flex flexJcs">
					<view class="">订单编号:{{item.order_sn}}</view>
					<view class="state">{{item.order_state_txt}}</view></view>
				<view class="goods-info flex flexrow">
					<image :src="item.goods_image_url" ></image>
					<view class="goods-name">{{item.goods_name}} x{{item.goods_num}}
					<view class="em flex flexrow">买家:<view class="p">{{item.buyer_name}}</view></view>
					</view>
				</view>
				<view class="flex flexrow">
					<view class="price">
						<view class="tit">支付金额</view>
						<view class="bti">{{item.goods_pay_price}}</view>
					</view>
					<view class="price">
						<view class="tit">商品价格</view>
						<view class="bti">{{item.goods_price}}</view>
					</view>
					<view class="price">
						<view class="tit">佣金比例</view>
						<view class="bti">{{item.jfx_commis_rate}}%</view>
					</view>
				</view>
				<view class="handle-bill flex flexJcs">
					<view class="batch-price flex flexrow">分销佣金:<view class="em">￥{{item.jfx_commis_amount}}</view></view>
					<view class="time">下单时间:{{item.add_time_txt}}</view>
				</view>
			</view>
			<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	import wwiLoadMore from '../../components/wwi-load-more.vue';
	export default {
		components: {
			wwiLoadMore
		},
		data() {
			return {
				billList:[],
				hasmore: true,
				curpage: 1,
				contentText: {
					contentdown:'上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop:false,
				loadingType:0
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=member_distri&wwi=jfx_order',
					data: {
						key: this.key,
						page: 10,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.order_list.forEach(item => {
									this.info.billList.push(item);
								});
								this.loadingType = 0;
							} else {
								this.billList = res.data.datas.order_list;
								uni.stopPullDownRefresh();
								this.loadingType = 0;
								if (!res.data.hasmore) {
									this.loadingType = 3;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					}
				});
				uni.hideLoading();
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			}
			
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.loadingType = 0;
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadingType = 2;
			}
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0);
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0);
			}
			// #ifdef H5
			document.title = '小店订单-'+this.siteTitle;
			// #endif
			
		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.billList = [],
				this.key = '',
				this.loadingType = 3;
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
.bill-list{padding: 20upx;}
.bill-list .li{padding: 20upx; border-bottom:1px solid  #eee ; background: #FFFFFF;}
.bill-list .li:nth-child(even){background: #fbfdfb;}
.bill-list .li .bill-sn{font-size: 28upx; height: 60upx; border-bottom: 1px dashed   #eee;}
.bill-list .li .bill-sn .state{color: #009688;}
.bill-list .li .goods-info{padding: 20upx;border-bottom: 1px dashed   #eee;}
.bill-list .li .goods-info image{width: 100upx; height: 100upx;}
.bill-list .li .goods-info .goods-name{flex: 1; margin-left: 20upx; font-size: 28upx;}
.bill-list .li .goods-info .goods-name .em{font-size: 26upx; color: #BBBBBB;}
.bill-list .li .goods-info .goods-name .em .p{color: #009688;}
.bill-list .li .price{flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20upx 0; font-size: 28upx;}
.bill-list .li .price .tit{font-size: 24upx; color: #BBBBBB;}
.bill-list .li .handle-bill{ border-top: 1px dashed   #eee; padding-top: 20upx;}
.bill-list .li .handle-bill .batch-price{font-size: 26upx; }
.bill-list .li .handle-bill .batch-price .em{font-weight: bold; color: #FF0036;}
.bill-list .li .handle-bill .time{font-size: 24upx; color: #BBBBBB;}
</style>
