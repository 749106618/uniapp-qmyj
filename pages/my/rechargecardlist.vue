<template>
	<view>
		<view class="wwiapp-asset-info rcard">
			<view class="container">
		<view class="i wwi-icon wwi-icon-yinhangqia"></view>
			<view class="dl">
				<view class="dt">充值卡余额</view>
				<view class="dd"><view class="em">{{points}}</view></view>
			</view>
			
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-icon">
			<view class="icon-li color-hui"><view class="wwi-icon wwi-icon-zhangdan"></view><text>充值卡明细</text></view>
			<navigator class="icon-li" url="/pages/my/rechargecardadd"  open-type="redirect"><view class="wwi-icon wwi-icon-cunkuan color-qs"></view><text>充值卡充值</text></navigator>
		</view>
		<view class="clear mt10"></view>
		<view class="wwiapp-log-list">
			<view class="clear pt10"></view>
			<view class="title">充值卡记录</view>
			<view v-if="!log_list.length" class="no-data">暂无数据</view>
			<view class="li" v-for="(item,index) in log_list" :key="index">
				<view class="detail">{{item.description}}</view>
                <text v-if="item.available_amount>0" class="money add">+{{item.available_amount}}</text>
				<text v-else class="money reduce">{{item.available_amount}}</text>
                <text class="date">{{item.add_time_text}}</text>
            </view>
			<view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	export default {
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
					url: '/index.php?app=member_fund&wwi=rcblog',
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
								res.data.datas.log_list.forEach(item => {
									this.log_list.push(item);
								});
							} else {
								this.log_list = res.data.datas.log_list;
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
					data: {key:this.key,fields:'available_rc_balance'},
					success: res => {
						this.points=res.data.datas.available_rc_balance;
					}
				});
			}
			
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
	page{background-color: #f8f8f8;}
	.wwiapp-log-list{border-radius:20upx 20upx 0 0 ;}
</style>
