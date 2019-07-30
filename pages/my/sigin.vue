<template>
	<view>
		<view class="mask" v-show="showMask" @click="hide" catchtouchmove="true"></view>
		<view class="popup popup-middle" v-show="showMask" catchtouchmove="true">
                 <view class="s-dialog-content flex flexcol">
					 <view class="h4">活动说明</view>
					 <scroll-view scroll-y style="height: 300upx;" class="flex flexcol">
					 <view class="li">1、每人每天最多签到一次，签到后有机会获得积分。</view>
					 <view class="li">2、网站可根据活动举办的实际情况，在法律允许的范围内，对本活动规则变动或调整。</view>
					 <view class="li">3、对不正当手段（包括但不限于作弊、扰乱系统、实施网络攻击等）参与活动的用户，网站有权禁止其参与活动，取消其获奖资格（如奖励已发放，网站有权追回）。</view>
					 <view class="li">4、活动期间，如遭遇自然灾害、网络攻击或系统故障等不可抗拒因素导致活动暂停举办，网站无需承担赔偿责任或进行补偿。</view>
					 </scroll-view>
					 <view class="s-dialog-btn flex" @click="hide">确定</view>
				 </view>
		</view>
		<view class="member-top">
			<view class="my-pointnum">
				<view class="span">我的积分</view>
				<view class="em">{{pointsNum}}</view>
			</view>
			<view class="sigin-box">
				<view class="sigin-btn" @click="siginPost" v-if="!isSigin">
				<view class="h2">签到</view>
				<view class="h6">+{{pointsSigin}} 积分</view>
				</view>
				<view class="sigin-btn" v-else>
				<view class="h2">已签到</view>
				<view class="h6">坚持哦!</view>
				</view>
			</view>
			<view class="sigin-help"  @click="hide"><view class="span">活动说明</view> <view class="wwi-icon wwi-icon-bangzhu" style="color: #FFFFFF;"></view></view>
			<image src="http://shopwwig.oss-cn-shanghai.aliyuncs.com/app-icon-walf.gif" class="wave-gif" mode=""></image>
		</view>
		<view class="sigin-list flex flexcol">
			<view class="h3 flex flexrow">
				<view class="span">签到日志</view>
				<navigator url="/pages/my/points" class="em">查看我的积分</navigator>
			</view>
			<view class="wwiapp-default-list flex flexcol">
			<view class="li flex flexrow border" v-for="(item,index) in logList" :key="index">
				<view class="title">会员积分</view>
				<view class="em">+{{item.sl_points}}</view>
				<view class="span">{{item.sl_addtime_text}}日签到获得</view>
			</view>
			<view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				logList:[],
				pointsNum:0,
				pointsSigin:0,
				isSigin:false,
				showMask: false,
				hasmore: true,
				curpage: 1,
				showloadMore: false,
				loadMore: '加载更多...'
			}
		},
		methods:{
			Inlimine:function(){
				uni.request({
					url: this.ApiUrl + '/index.php?app=member_index&wwi=my_asset',
					data: {key:this.key , fields:'point'},
					success: res => {
						this.pointsNum = res.data.datas.point;
					}
				});
				uni.request({
					url: this.ApiUrl + '/index.php?app=member_signin&wwi=checksignin',
					data: {key :this.key},
					success: res => {
						if(res.data.code == 200){
							this.pointsSigin = res.data.datas.points_signin;
							this.isSigin = false;
						}else{
							if (res.data.state == 'isclose') {
								    uni.navigateBack();
								}else{
									this.isSigin = true;
								}
						}
					}
				});
				this.getSigninLog();
			},
			hide:function(){
				if(this.showMask){
					this.showMask = false;
				}else{
					this.showMask = true;
				}
			},
			getSigninLog:function(action = 'refresh'){
				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url: '/index.php?app=member_signin&wwi=signin_list',
					data: {
						key: this.key,
						page: 10,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
						this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.signin_list.forEach(item => {
									this.logList.push(item);
								});
								console.log('123')
							} else {
								this.logList = res.data.datas.signin_list;
								if (res.data.hasmore) {
									this.showloadMore = true;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					},
					})
				
			},
			siginPost:function(){
				uni.request({
					url: this.ApiUrl + '/index.php?app=member_signin&wwi=signin_add',
					data: {key:this.key},
					success: res => {
						this.pointsNum = res.data.datas.point;
						this.isSigin = true;
						this.hasmore = true;
						this.curpage = 1;
						this.getSigninLog();
					}
				});
			}
		},
		onReachBottom() {
			if (this.hasmore) {
				this.getSigninLog('onbot');
			} else {
				this.loadMore = '没有更多数据了！';
			}
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		}
	}
</script>

<style>
page{background: #fffdfb;}
.member-top {background-color:#ff9800;background-size: cover;  text-align: center; width: 100%; height: 400upx; display: flex; flex-direction: row; position: relative;}
.member-top .my-pointnum,.member-top .sigin-help{ display: flex; flex-direction: column; width: 200upx;text-shadow: 2upx 2upx 0 rgba(0,0,0,0.15); margin-top: 60upx;}
.member-top .my-pointnum .span,.member-top .sigin-help .span{ font-size: 28upx; display: flex; align-items: center; justify-content: center; color: #fff;}
.member-top .my-pointnum .em{    font-size: 24upx; font-weight: 600; color: #FF0;}
.member-top .sigin-box{flex: 1; display: flex; justify-content: center; align-items: center;}
.member-top .sigin-box .sigin-btn{width: 200upx; height: 200upx; border-radius:50% ; display: flex; justify-content: center; align-items: center; flex-direction: column;background: #fff; color: #FFFFFF;border: 2upx solid rgba(255,255,255,0.4);line-height: 70upx;box-shadow: inset 0 2upx 0 0 rgba(255,255,255,0.5),  0 0 2upx 2upx rgba(255,255,255,0.8), 0 0 0 12upx rgba(0,0,0,0.06), 0 0 0 6upx rgba(0,0,0,0.1); background-image: linear-gradient(-45deg,#ff7637, #FF9800, #f9d4b2);}
.member-top .sigin-box .sigin-btn .h2{font-size: 34upx; width: 100%; border-bottom: 2upx solid #e0aa67;}
.member-top .sigin-box .sigin-btn .h6{font-size: 24upx;}
.sigin-list .h3{justify-content: space-between; padding: 0 20upx; height: 100upx; align-items: center;},
.sigin-list .h3 .span{font-size: 32upx;}
.sigin-list .h3 .em{font-size: 28upx;}
.wwiapp-default-list{    padding: 0 0 0 20upx;  background-color: #FFF;  border-top: solid 2upx #EEE; border-bottom: solid 2upx #EEE;},
.wwiapp-default-list .li{padding: 20upx 0; align-items: center;}
.wwiapp-default-list .li .title{font-size: 28upx;},
.wwiapp-default-list .li .em{font-size: 38upx; color: #FF0036; margin-left: 20upx; margin-right: 40upx; font-weight: bold;},
.wwiapp-default-list .li .span{font-size: 26upx; color: #888888;}
.mask {position: fixed;z-index: 998;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, .3);}
.popup {position: absolute;z-index: 999;background-color: #ffffff;-webkit-box-shadow: 0 0 30upx rgba(0, 0, 0, .1);box-shadow: 0 0 30upx rgba(0, 0, 0, .1);}
.popup-middle {width: 600upx;height: 480upx;border-radius: 10upx;top: 0;right: 0;bottom: 0;left: 0;margin: auto;}
.s-dialog-content{ padding: 20upx;}
.s-dialog-content .h4{font-size: 28upx; height: 60upx;},
.s-dialog-content .li{font-size: 24upx;},
.s-dialog-content .s-dialog-btn{align-items: center; justify-content: center; color: #007AFF; height: 80upx;}
</style>
 