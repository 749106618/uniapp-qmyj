<template>
	<view>
		<view class="adv-pic">
			<image :src="advPic" mode="widthFix"></image>
		</view>
		<view class="pub-nav flex flexrow">
			<view class="li ok flex flexAic flexJcc">我发布的任务</view>
			<navigator url="/pages/my/pubtion" class="li flex flexAic flexJcc border-left">参与我的投标</navigator>
		</view>
		<view class="pub-nav-tab flex flexrow">
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==1}" @tap="changeNav('1')">我的项目</view>
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==10}" @tap="changeNav('10')">待付款</view>
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==20}" @tap="changeNav('20')">待验收</view>
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==40}" @tap="changeNav('40')">待评价</view>
		</view>
		<view class="publist-list">
			<block v-if="state_type==1">
			<view class="li" v-for="(item,v) in listData" :key="v">
				<view class="hd">
					<view class="tip flex flexrow"><view class="wwi-icon" :class="'wwi-icon-gongchengjindu-'+item.status_rate"></view>{{item.status}}</view>{{item.fabu_name}}</view>
				<view class="cd flexwrap">
					<view class="tip">参与该项目的服务商：</view>
					<view class="store" v-if="item.servicename.length" v-for="(store,vvv) in item.servicename" :key="vvv">{{store.name}}</view>
				</view>
				<view class="bd flex flexJcs">
					<view>开始时间：{{item.fabu_times}}</view>
					<view>结束时间：{{item.fabu_endtime}}</view>
				</view>
				<view class="pub-btn flex flexrow">
					<navigator :url="'/pages/my/pubedit?pubId='+item.id" class="btn-li flex flexJcc flexAic"><view class="wwi-icon wwi-icon-xiugai"></view>修改项目</navigator>
				</view>
			</view>
			</block>
			<block v-else="">
			<view class="li-new" v-for="(item,vv) in listData" :key="vv">
				<view class="hd flex flexrow">
					<view class="wwi-icon wwi-icon-wodexiangmu-wodexiangmu" style="color: #2CB476;"></view>
					<view class="title">{{item.order_name}}</view>
				</view>
				<view class="hd flex flexrow">
					<view class="wwi-icon wwi-icon-dianpu"></view>
					<view class="flexJcs title statu-rate flexAic"><view>{{item.store_name}}</view><view class="tip">{{item.order_state}}</view></view>
				</view>
				<view class="bd">
					<view class="bd-li" v-for="(nlist,ss) in item.list" :key="ss">
						<view class="statu flex flexJcs">
							<view class="tip">{{nlist.pay_fangshi}}</view>
							<view class="amount">￥{{nlist.total_amount}}</view>
						</view>
						<view class="pay flex flexJcs flexAic">
							<view class="">
								<view class="span">订单编号：{{nlist.order_sn}}</view>
								<view class="span">支付单号：{{nlist.pay_sn}}</view>
							</view>
							<view class="sbtn" v-if="nlist.state==10" @tap="checkPay(nlist.id)">付款</view>
							<view class="sbtn" v-if="nlist.state==20" @tap="checkBefore(nlist.id)">验收</view>
							<navigator :url="'/pages/my/pubeve?id='+nlist.id" class="sbtn" v-if="nlist.state==40">评价</navigator>
						</view>
					</view>
				</view>
			</view></block>
		</view>
		<wwi-load-more :loadingType="loadingType" :contentText="contentText"></wwi-load-more>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
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
				listData:[],
				key:'',
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
				advPic:''
			}
		},
		methods: {
				inlimine:function(action = 'refresh'){
					if (!this.hasmore) {
						this.loadingType = 2;
						return;
					}
					this.loadingType = 1;
					this.wwiopt({
						url: '/index.php?app=publish_order&wwi=publishorder_list',
						method: 'POST',
						data:{key:this.key,	page: this.page,curpage: this.curpage,state_type:this.state_type},
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
				checkBefore:function(e){
					uni.showModal({
						title: '提示',
						content: '确定项目完全验收',
						cancelText: '取消',
						confirmText: '验收',
						success: res => {
							if(res.confirm){
								this.wwiopt({
									url: '/index.php?app=publish_order&wwi=order_confirmoktask',
									method: 'POST',
									data:{key:this.key,	order_id: e},
									success: res => {
										if(res.data.datas.error){
											uni.showModal({
												title: '提示',
												content: res.data.datas.error,
												showCancel: false,
											});
											return false;
										}
										uni.showModal({
											title: '提示',
											content: '项目完成验收成功',
											showCancel: false,
										});
										
									}
								});
							}
						}
					});
				},
				changeNav:function(e){
					if(e==this.state_type){
						return false;
					}
					this.state_type = e;
					this.hasmore = true;
					this.curpage = 1;
					this.inlimine();
				},
				getPic:function(){
					uni.request({
						url: this.ApiUrl+'/index.php?app=publish_order&wwi=publishorder_list',
						method: 'POST',
						header:{'content-type':'application/x-www-form-urlencoded'},
						data:{key:this.key,state_type:4},
						success: res => {
							this.advPic = res.data.datas.advpic;
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
	onLoad:function(e){
		if(e.state){
			this.state_type = e.state;
		}
		this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		this.inlimine();
		this.getPic();
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
.pub-nav{margin: 20upx; background: #fff;padding: 20upx; border-radius: 15upx;}
.pub-nav .li{width: 50%; color: #AAAAAA;}
.pub-nav .li.ok{font-weight: bold; color: #2CB476;}
.pub-nav .li.border-left{border-left:1px solid #ccc ;}
.pub-nav-tab{margin: 20upx;}
.pub-nav-tab .li{width: 25%;border-bottom: 4upx solid transparent; line-height: 60upx;}
.pub-nav-tab .li.ok{color: #2CB476; border-color: #2CB476; }
.publist-list{}
.publist-list .li{padding:40upx 20upx; background: #fff; margin-bottom: 20upx;}
.publist-list .li .hd{font-size: 32upx; font-weight: bold;line-height: 40upx;max-height: 100upx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis;}
.publist-list .li .hd .tip{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display:inline-flex; justify-content: center; align-items: center; border-radius: 35upx; margin-right: 10upx;}
.publist-list .li .hd .tip .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.publist-list .li .cd{display: -webkit-box; line-height: 35upx;max-height: 70upx;overflow: hidden;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis; margin: 20upx 0;}
.publist-list .li .cd .tip{color: #2CB476; display: inline-flex;}
.publist-list .li .cd .store{margin-left: 10upx; color: #666; display: inline-flex;}
.publist-list .li .bd{color: #ccc; font-size: 24upx; border-top: 4upx solid #F8F8F8; padding:15upx 0 ;}
.pub-btn .btn-li{color: #2CB476;font-size: 28upx;}
.pub-btn .btn-li .wwi-icon{font-size: 32upx; margin-right: 10upx; }

.publist-list .li-new{padding:40upx 20upx; background: #fff; margin-bottom: 20upx;}
.publist-list .li-new .hd{border-bottom: 1px solid #F8F8F8; padding: 20upx 0;}
.publist-list .li-new .hd .title{font-size: 32upx; font-weight: bold;line-height: 40upx;max-height: 100upx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis; flex: 1;}
.publist-list .li-new .hd .wwi-icon{width: 70upx;}
.publist-list .li-new .hd .statu-rate{display: flex;}
.publist-list .li-new .hd .statu-rate .tip{color: #2CB476;}
.publist-list .li-new .bd .bd-li{ border-bottom: 1px dotted #ccc; padding: 20upx 0;}
.publist-list .li-new .bd .bd-li .statu{margin: 10upx 0;}
.publist-list .li-new .bd .bd-li .statu .tip{border: 2upx solid #e9b224; color: #e9b224; border-radius: 50upx; padding: 0 10upx;}
.publist-list .li-new .bd .bd-li .statu .amount{color: #ff0000; font-size: 32upx;}
.publist-list .li-new .bd .bd-li .pay{color: #9a9a9a;}
.publist-list .li-new .bd .bd-li .pay .sbtn{background: #2CB476; color: #fff; padding: 0 20upx; height: 50upx;}
.adv-pic{}
.adv-pic image{width: 100%; height: auto;}
</style>
