<template>
	<view>
		<uni-notice-bar show-close="true"  single="true" backgroundColor="#ddf0ff" color="#03a9f4" text="[提示]向左滑动可查看更多内容,结算详情请登入PC端操作"></uni-notice-bar>
	<scroll-view scroll-x class="bill-list">
		<view class="bill-list-main">
			<view class="hd">
				<view class="sp">结算单号</view>
				<view class="sp time">起止时间</view>
				<view class="sp">本期应收</view>
				<view class="sp">结算状态</view>
				<view class="sp paytime">付款日期</view>
			</view>
			<view class="bd">
				<view class="li" v-for="(item,index) in billList" :key="index">
				<view class="sp">{{item.ob_id}}</view>
				<view class="sp time">{{item.ob_start_date_txt}} - {{item.ob_end_date_txt}}</view>
				<view class="sp">{{item.ob_result_totals}}</view>
				<view class="sp">{{item.ob_state_txt}}</view>
				<view class="sp paytime">{{item.ob_pay_date_txt}}</view>
				</view>
			</view>
		</view>
	</scroll-view>
	<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
	<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	import wwiLoadMore from '../../components/wwi-load-more.vue';
	import uniNoticeBar from '@/components/uni-notice-bar.vue'
		export default {
			components: {
				wwiLoadMore,
				uniNoticeBar
			},
			data() {
				return {
				key:'',
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
				}
			},
			methods:{
				loadList:function(action = 'refresh'){
				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=seller_bill&wwi=list',
					data: {
						key: this.key,
						page: 20,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checksellerLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.bill_list.forEach(item => {
									this.billList.push(item);
								});
								if (!res.data.hasmore) {
									this.loadingType = 3;
								}else{
									this.loadingType = 0;
								}
							} else {
								this.billList = res.data.datas.bill_list;
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
			onLoad:function(){
				this.key = uni.getStorageSync('seller_key');
				if (!this.key) {
					uni.navigateTo({
						url: '/pages/seller/login'
					});
				}
				this.loadList();
			},
			onPullDownRefresh() {
				this.hasmore = true;
				this.curpage = 1;
				this.loadingType = 0;
				this.loadList();
			},
			onReachBottom() {
				if (this.hasmore) {
					this.loadList('onbot');
				} else {
					this.loadingType = 2;
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
	.bill-list{width: auto;flex: 1;  white-space: nowrap;}
	.bill-list .bill-list-main{width: 100%;}
	.bill-list .bill-list-main .hd{ background: #F8F8F8; width: 100%; height: 100upx;}
	.bill-list .sp{width: 300upx; display: inline-block; text-align: center;}
	.bill-list .sp.time{width: 450upx;}
	.bill-list .sp.paytime{width: 380upx;}
	.bill-list .bill-list-main .hd .sp{font-size: 28upx; font-weight: 600; background: #F8F8F8; height: 100upx; line-height: 100upx;}
	.bill-list .bill-list-main .bd .li{ font-size: 28upx;height: 80upx;}
	.bill-list .bill-list-main .bd .li .sp{line-height: 80upx; height: 80upx;}
	.bill-list .bill-list-main .bd .li:nth-child(even) .sp{background: #eaf6fb;}
</style>
