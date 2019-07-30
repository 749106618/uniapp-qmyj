<template>
	<view>
		<view class="adv-pic">
			<image :src="advPic" mode="widthFix"></image>
		</view>
		<view class="pub-nav flex flexrow">
			<navigator url="/pages/my/publist" class="li flex flexAic flexJcc">我发布的任务</navigator>
			<view class="li ok  flex flexAic flexJcc border-left">参与我的投标</view>
		</view>
		<view class="publist-list">
			<view class="li" v-for="(item,v) in listData" :key="v">
				<view class="hd">
					<view class="tip flex flexrow">
						<view class="wwi-icon wwi-icon-gongchengjindu-jiaofuzhong"></view>{{item.status}}
					</view>{{item.tb_name}}
				</view>
				<view class="bd" v-if="!item.open_list">
					<view class="bd-li" v-for="(slist,vv) in item.list" :key="vv" v-if="vv<2">
						<view class="store-name flex flexJcs flexAic">
							<view class="flex flexrow flexAic">
								<image :src="slist.store_logo" mode=""></image>
								<view class="text">{{slist.store_name}}</view>
							</view>
							<view class="amount">￥{{slist.total_price}}</view>
						</view>
						<view class="time flex flexJcs">
							<view class="flex flexrow">
								<view class="tip">{{slist.is_zhongbaio}}</view>
								<view class="tip">{{slist.pay_fangshi}}</view>
							</view>
							<view>投标时间:{{slist.tb_time}}</view>
						</view>
						<view class="btns flex">
							<navigator :url="'/pages/my/chatinfo?tid='+slist.store_id" class="b-btn">在线沟通</navigator>
							<view class="b-btn" @tap="checkBefore(slist.id)" v-if="slist.is_zhongbaio=='已中标'">选它中标</view>
							<view class="b-btn no" v-else>选它中标</view>
							</block>
						</view>
					</view>
				</view>
				<view class="bd" v-if="item.open_list">
					<view class="bd-li" v-for="(slist,vv) in item.list" :key="vv">
						<view class="store-name flex flexJcs flexAic">
							<view class="flex flexrow flexAic">
								<image :src="slist.store_logo" mode=""></image>
								<view class="text">{{slist.store_name}}</view>
							</view>
							<view class="amount">￥{{slist.total_price}}</view>
						</view>
						<view class="time flex flexJcs">
							<view class="flex flexrow">
								<view class="tip">{{slist.is_zhongbaio}}</view>
								<view class="tip">{{slist.pay_fangshi}}</view>
							</view>
							<view>投标时间:{{slist.tb_time}}</view>
						</view>
						<view class="btns flex">
							<navigator :url="'/pages/my/chatinfo?tid='+slist.store_id" class="b-btn">在线沟通</navigator>
							<view class="b-btn" @tap="checkBefore(slist.id)" v-if="slist.is_zhongbaio=='已中标'">选它中标</view>
							<view class="b-btn no" v-else>选它中标</view>
							</block>
						</view>
					</view>
				</view>
				<view class="more wwi-icon wwi-icon-xuanzeqishouqi flex flexAic flexJcc" @tap="item.open_list =!item.open_list"
				 v-if="item.open_list && item.list.length > 2"></view>
				<view class="more wwi-icon wwi-icon-xuanzeqizhankai flex flexAic flexJcc" @tap="item.open_list =!item.open_list"
				 v-else-if="!item.open_list && item.list.length > 2"></view>
			</view>

		</view>
		<wwi-load-more :loadingType="loadingType" :contentText="contentText"></wwi-load-more>
	</view>
</template>

<script>
	import wwiLoadMore from '@/components/wwi-load-more.vue';
	export default {
		components: {
			wwiLoadMore
		},
		data() {
			return {
				listData: [],
				key: '',
				page: '10',
				hasmore: true,
				curpage: 1,
				loadingType: 3,
				state_type: 1,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop: false,
				advPic: ''
			}
		},
		methods: {
			inlimine: function(action = 'refresh') {
				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=publish_order&wwi=publishorder_list',
					method: 'POST',
					data: {
						key: this.key,
						page: this.page,
						curpage: this.curpage,
						state_type: 2
					},
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.list.forEach(item => {
									this.listData.push(item);
								});

								this.loadingType = 0;
							} else {
								this.listData = res.data.datas.list;
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
			checkBefore: function(e) {
				uni.showModal({
					title: '提示',
					content: '确定选取它中标嘛',
					cancelText: '取消',
					confirmText: '选取中标',
					success: res => {
						if (res.confirm) {
							this.wwiopt({
								url: '/index.php?app=publish_order&wwi=myselecttb',
								method: 'POST',
								data: {
									key: this.key,
									id: e
								},
								success: res => {
									if (res.data.datas.error) {
										uni.showModal({
											title: '提示',
											content: res.data.datas.error,
											showCancel: false,
										});
										return false;
									}
									uni.showModal({
										title: '提示',
										content: '设置中标成功',
										showCancel: false,
									});

								}
							});
						}
					}
				});
			},
			getPic: function() {
				uni.request({
					url: this.ApiUrl + '/index.php?app=publish_order&wwi=publishorder_list',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						key: this.key,
						state_type: 4
					},
					success: res => {
						this.advPic = res.data.datas.advpic;
					}
				});
			}
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.inlimine();
			this.getPic();
		}
	}
</script>

<style>
.pub-nav{margin: 20upx; background: #fff;padding: 20upx; border-radius: 15upx;}
.pub-nav .li{width: 50%; color: #AAAAAA;}
.pub-nav .li.ok{font-weight: bold; color: #2CB476;}
.pub-nav .li.border-left{border-left:1px solid #ccc ;}
.publist-list{}
.publist-list .li{padding:40upx 20upx; background: #fff; margin-bottom: 20upx;}
.publist-list .li .hd{font-size: 32upx; font-weight: bold;line-height: 40upx;max-height: 100upx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis;}
.publist-list .li .hd .tip{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display:inline-flex; justify-content: center; align-items: center; border-radius: 35upx; margin-right: 10upx;}
.publist-list .li .hd .tip .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.publist-list .li .bd{color: #333; font-size: 24upx;padding:15upx 0 ;}
.publist-list .li .bd .bd-li{border: 1px solid #F8F8F8; border-radius: 15upx; margin-bottom: 20upx; padding: 20upx;}
.publist-list .li .bd .bd-li .store-name{font-size: 28upx; font-weight: bold; color: #;}
.publist-list .li .bd .bd-li .store-name image{width: 50upx; height: 50upx; border: 1px solid #F8F8F8; border-radius: 50upx; margin-right: 15upx;}
.publist-list .li .bd .bd-li .store-name .amount{color: #FF0036;}
.publist-list .li .bd .bd-li .time{font-size: 24upx; color: #ccc; margin: 20upx 0;}
.publist-list .li .bd .bd-li .time .tip{color: #e9b224; border: 1px solid #e9b224; border-radius: 15upx; padding:5upx 10upx; margin-right: 15upx;}
.publist-list .li .bd .bd-li .btns{ border-top: 2upx solid #F8F8F8; padding-top: 20upx; justify-content: flex-end;}
.publist-list .li .bd .bd-li .btns .b-btn{background: #2CB476; color: #fff; padding: 10upx 20upx; margin-left: 20upx;}
.publist-list .li .bd .bd-li .btns .b-btn.no{background: #ccc;}
.adv-pic{}
.adv-pic image{width: 100%; height: auto;}
</style>
