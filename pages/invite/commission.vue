<template>
	<view>
		<view class="wwiapp-asset-info" style="background: #03a9f4;">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">冻结佣金:{{info.freeze_trad}}</view>
				<view class="dd flex flexrow" style="justify-content: flex-end;">佣金余额:<view class="em">{{info.available_trad}}</view></view>
			</view>
			
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-list">
			<view class="title">佣金明细</view>
			<view v-if="!info.list.length" class="no-data">暂无数据</view>
			<view class="comi-li" v-for="(item,index) in info.list" :key="index">
				<view class="comi-info">
					<view class="comi-info-title">{{item.lg_desc}}</view>
					<view class="comi-info-date">{{item.lg_add_time_txt}}</view>
				</view>
				<view class="comi-slider flex flexrow">
					<view class="fly flex flexrow">余额:<view class="fly-t add" v-if="item.lg_av_amount>0">+{{item.lg_av_amount}}</view><view class="fly-t reduce" v-else>{{item.lg_av_amount}}</view></view>
					<view class="fly flex flexrow">冻结:<view class="fly-t add" v-if="item.lg_freeze_amount>0">+{{item.lg_freeze_amount}}</view><view class="fly-t reduce" v-else>{{item.lg_freeze_amount}}</view></view>
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
				key: '',
				info:{
					list:{}
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
					url: '/index.php?app=member_distri&wwi=commission',
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
								res.data.datas.list.forEach(item => {
									this.info.list.push(item);
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
			// #ifdef H5
			document.title = '佣金明细-'+this.siteTitle;
			// #endif
			
		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.log_list = [],
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
.wwiapp-log-list .comi-li{padding: 20upx 0; border-bottom: 1px solid #eee;}
.wwiapp-log-list .comi-li .comi-info .comi-info-title{font-size: 28upx;}
.wwiapp-log-list .comi-li .comi-info .comi-info-date{font-size: 24upx; color: #BBBBBB;}
.wwiapp-log-list .comi-li .comi-slider{}
.wwiapp-log-list .comi-li .comi-slider .fly{flex: 1; display: flex; align-items: center; justify-content: center; height: 80upx; font-size: 28upx;}
.wwiapp-log-list .comi-li .comi-slider .fly .fly-t{font-size: 36upx; margin-left: 10upx;}
.wwiapp-log-list .comi-li .comi-slider .fly .fly-t.reduce{color: #8bc34a;}
.wwiapp-log-list .comi-li .comi-slider .fly .fly-t.add{color: #FF0036;}
</style>
