<template>
	<view>
		<view class="wwiapp-asset-info" style="background: #8bc34a;">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">冻结佣金:{{info.freeze_trad}}</view>
				<view class="dd flex flexrow" style="justify-content: flex-end;">佣金余额:<view class="em">{{info.available_trad}}</view></view>
			</view>
			
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-list tx">
			<view class="title">提现记录</view>
			<view v-if="!info.cash_list.length" class="no-data">暂无数据</view>
			<view class="li" v-for="(item,index) in info.cash_list" :key="index">
				<navigator :url="'/pages/invite/cashInfo?id='+item.tradc_id">
				<view class="dl"><view class="dt">提现状态:{{item.tradc_payment_state_txt}}</view>
                <view class="dd">提现单号：{{item.tradc_sn}}</view>
				</view>
				<text class="money" :class="item.tradc_payment_state=='1'?'add':'reduce'">{{item.tradc_amount}}</text>
                <text class="date">{{item.tradc_add_time_txt}}</text>
				<view class="arrow-r wwi-icon wwi-icon-xuanzeqixiayige"></view>
				</navigator>
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
				key: '',
				info: {
					cash_list:[]
				},
				hasmore: true,
				curpage: 1,
				points:0,
				loadingType:0,
				contentText: {
					contentdown:'上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop:false
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
					url: '/index.php?app=member_distri&wwi=jfx_cash',
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
								res.data.datas.cash_list.forEach(item => {
									this.info.cash_list.push(item);
								});
								this.loadingType = 0;
							} else {
								this.info = res.data.datas;
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
				this.checkLogin(0)
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0)
			}
			document.title = '佣金提现记录-'+this.siteTitle;
		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.info = [],
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
page {	background: #F8F8F8;}
</style>
