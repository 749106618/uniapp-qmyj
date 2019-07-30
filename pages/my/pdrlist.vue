<template>
	<view>
		<view class="wwiapp-asset-info pre">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">我的余额</view>
				<view class="dd"><view class="em">{{points}}</view></view>
			</view>
			
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-list">
			<view class="title">充值记录</view>
			<view v-if="!log_list.length" class="no-data">暂无数据</view>
			<view class="li" v-for="(item,index) in log_list" :key="index" @click="payMent(item)">
				<view class="dl"><view class="dt">状态:{{item.pdr_payment_state_text}}</view>
                <view class="dd">充值单号：{{item.pdr_sn}}</view>
				</view>
                <text v-if="item.pdr_payment_state>0" class="money add">+{{item.pdr_amount}}</text>
				<text v-else class="money reduce">+{{item.pdr_amount}}</text>
                <text class="date">{{item.pdr_add_time_text}}</text>
            </view>
			<view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
		<wwi-pdpay-mask ref="wwiPdpayMask" ></wwi-pdpay-mask>
	</view>
</template>

<script>
	import wwiPdpayMask from '../../components/wwi-pdpay-mask.vue';
	export default {
		components:{
			wwiPdpayMask
		},
		data() {
			return {
				key: '',
				log_list: [],
				page: '10',
				hasmore: true,
				curpage: 1,
				points:0,
				loadMore: '加载更多...',
				showloadMore: false,
				showPageTop:false
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url: '/index.php?app=member_fund&wwi=pdrechargelist',
					data: {
						key: this.key,
						page: this.page,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.list.forEach(item => {
									this.log_list.push(item);
								});
							} else {
								this.log_list = res.data.datas.list;
								uni.stopPullDownRefresh();
								if (res.data.hasmore) {
									this.showloadMore = true;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					}
				});
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			},
			getMemberPoints(){
				uni.request({
					url: this.ApiUrl + '/index.php?app=member_index&wwi=my_asset',
					data: {key:this.key,fields:'predepoit'},
					success: res => {
						this.points=res.data.datas.predepoit;
					}
				});
			},
			payMent(e){
				if(e.pdr_payment_state==0){
				var toPay = {
					app:'member_fund',
					wwi:'pd_pay',
					paySn:e.pdr_sn
				}
				this.$refs.wwiPdpayMask.show(toPay);
				}else{
					return false;
				}
			},
			
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.loadMore = '加载更多...';
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadMore = '没有更多数据了！';
			}
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
			this.getMemberPoints()
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.log_list = [],
				this.key = '',
				this.loadMore = '加载更多...';
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
page {	background: #F8F8F8;}
</style>
