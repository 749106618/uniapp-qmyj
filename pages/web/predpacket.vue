<template>
	<view>
		<view class="wwi-mask" v-show="mask" @click="hideMask"></view>
		<view class="wwi-popup-content"  v-show="mask">
			<view class="top-title flex flexAic flexJcc">{{maskMsg.title}}</view>
			<view class="msg-content">
				<view style="font-size: 24upx;">{{maskMsg.msgA}}</view>
				<view class="red-word">{{maskMsg.msgB}}</view>
			</view>
			<view class="popup-btn flex flexrow">
				<view class="true" @click="trueMask(maskMsg)">{{maskMsg.btnA}}</view>
				<view class="false" @click="hideMask">{{maskMsg.btnB}}</view>
			</view>
		</view>
		<view class="integral-02">
				<view v-if="!redpacketList.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-yichangshangbao"></view>
						<view class="dl">
							<view class="dt">没有找到任何相关信息</view>
						</view>
					</view>
				</view>
			<view class="integral-list redpacket" v-if="redpacketList.length > 0">
				<view class="li flex flexrow" v-for="(item,index) in redpacketList" :key="index">
					<view class="fl flex flexrow">
						<image :src="item.rpacket_t_customimg_url"></image>
						<view class="u-content flex flexcol">
							<view class="hd flex flexrow">
								<view class="red-word flex flexrow">&yen; <view class="b">{{item.rpacket_t_price}}</view></view>
								<view class="span red-word">需满{{item.rpacket_t_limit}}元</view>
							</view>
							<view class="">平台通用红包</view>
							<view class="gray-word" style="font-size: 24upx;">需{{item.rpacket_t_points}}积分,有效期至{{item.rpacket_t_end_date}}</view>
						</view>
					</view>
					<view class="fr flex flexcol">
						<view class="progress flex flexcol">
							<view class="flex" style="align-items: center; justify-content: center; height: 50upx;">已抢{{item.bfb}}%</view>
				            <progress :percent="item.bfb" color="#ff9800" active stroke-width="10" />
			            </view>
						<view class="o-btn" @click="getRpacket(item)">立即兑换</view>
					</view>
					<view class="level flex flexrow" v-if="item.rpacket_t_mgradelimit > 0">Lv.<view class="b">{{item.rpacket_t_mgradelimit}}</view></view>
				</view>
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
				Minfo:[],
				redpacketList:[],
				mask:false,
				maskMsg:[],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadMore: '加载更多...',
				showloadMore: false,
				showPageTop: false
			}
		},
		methods:{
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url: '/index.php?app=points&wwi=exchange_redpacket',
					data: {
						page: this.page,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.rptlist.forEach(item => {
									item.bfb = parseFloat((item.rpacket_t_giveout / item.rpacket_t_total * 10000) / 100.00).toFixed(2);
									this.redpacketList.push(item);
								});
							} else {
						res.data.datas.rptlist.forEach(item => {
							var num2 = parseFloat((item.rpacket_t_giveout / item.rpacket_t_total * 10000) / 100.00).toFixed(2);
							this.$set(item, 'bfb', num2);
						});
								this.redpacketList = res.data.datas.rptlist;
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
			getMember(){
				if(this.key){
				uni.request({
					url: this.ApiUrl+"/index.php?app=points&wwi=member_info",
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key},
					success: res => {
                this.checkLogin(res.data.login);
                this.Minfo = res.data.datas.member_info;
					}
				});
				}
			},
			getRpacket:function(e){
			if (!this.key) {
				uni.navigateTo({	url: '/pages/web/login' });
				return false;
			}
			if(parseInt(e.rpacket_t_giveout) < parseInt(e.rpacket_t_total)){
				if(parseInt(e.rpacket_t_points) > parseInt(this.Minfo.member_points)){
					uni.showToast({	title: '您的积分不足，暂时不能兑换该红包',icon:"none"});
					return false;
				}
				if(parseInt(e.rpacket_t_mgradelimit) > parseInt(this.Minfo.level)){
					uni.showToast({	title: '您的会员级别不够，暂时不能兑换该红包',icon:"none"});
					return false;
				}
				var b_msg = '';
				b_msg += e.rpacket_t_price+'元平台红包，消费满'+e.rpacket_t_limit+'元减'+e.rpacket_t_price+'元，有效期至'+e.end_date+',';
				var limit_count = '不限量';
				if(parseInt(e.rpacket_t_eachlimit ) > 0){
					limit_count = e.rpacket_t_eachlimit +'张';
				}
				
				b_msg += '每个ID限领取:'+limit_count;
				var url =this.ApiUrl+"/index.php?app=member_points&wwi=redpacketexchange";
				this.maskMsg =({
					title:'兑换代金券',
					msgA:'您将兑换'+e.rpacket_t_price+'元红包券一张，这将花费您'+e.rpacket_t_points+'积分',
					msgB:b_msg,
					btnA:'兑换',
					btnB:'取消',
					url:url,
					id: e.rpacket_t_id
				});
				this.mask =true;
				
			}else{
				uni.showToast({	title: '红包已兑换完',icon:"none"});
				return false;
			}
				
			},
			hideMask(){
				this.maskMsg = [];
				this.mask = false;
			},
			trueMask:function(e){
				uni.request({
					url: e.url,
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key, id:e.id},
					success: res => {
						if(res.data.code == 200){
							uni.showToast({ title: res.data.datas,icon:"none" });
				            this.maskMsg = [];
				            this.mask = false;
						}else{
							uni.showToast({ title: res.data.datas.error,icon:"none" });
				            this.maskMsg = [];
				            this.mask = false;
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
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadMore = '没有更多数据了！';
			}
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			this.getMember();
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
page{background: #f8f8f8;}
.integral-02 .integral-list .li{margin:20upx 20upx 0 20upx; position: relative;}
.red-word { color: #f23030;}
.gray-word {color: #999999;}
.integral-list .li .fl image{width:180upx;height:180upx;}
.integral-list .li .fl{flex: 1; background: #FFFFFF; border-radius:20upx;padding: 20upx; overflow:hidden;}
.integral-list .li .fl .u-content{flex: 1; margin-left: 20upx;font-size: 28upx; overflow:hidden;}
.integral-list .li .fl .u-content .hd{font-size: 24upx;white-space: nowrap; text-overflow: ellipsis; line-height: 60upx;}
.integral-list .li .fl .u-content .hd .b{font-weight: bold; font-size: 42upx;}
.integral-list .li .fl .u-content .hd .span{margin-left: 18upx;}
.integral-list .li{margin:20upx 20upx 0 20upx;}
.integral-list .li .fr{width: 150upx; background: #FF0036; border-radius: 15upx; padding: 20upx;}
.integral-list .li .fr .progress{font-size: 24upx; color: #FFFFFF; margin-top: 20upx;}
.integral-list .li .fr .progress .uni-progress-bar{padding: 2upx; border-radius:10upx ;}
.integral-list .li .fr .progress .uni-progress-inner-bar{ border-radius:10upx ;}
.integral-list .li .fr .o-btn{border: 2upx solid #FFFFFF; border-radius:30upx ;font-size: 28upx; color: #FFFFFF; justify-content: center;align-items: center; display: flex; margin-top: 20upx;}
.integral-list .li .level{position: absolute; left: 0; top: 0;}
.integral-list.redpacket .li .fr{background: #FF9800;}
.integral-list.redpacket .li .fl .red-word{color: #FF9800; }
.wwi-mask {position: fixed;z-index: 998;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, .3);}
.wwi-popup-content{	position:fixed;z-index: 999;background-color: #ffffff;box-shadow: 0 0 30upx rgba(0, 0, 0, .1);display: flex;align-items: center;width: 80%;height: auto;border-radius: 10upx;top: 50%;left: 50%;transform: translate(-50%, -50%);flex-direction: column;}
.wwi-popup-content .top-title{height: 80upx; color: #888888;}
.wwi-popup-content .popup-btn{width: 100%; border-top:2upx solid #F8F8F8 ; height: 80upx;}
.wwi-popup-content .popup-btn .true{color: #007AFF; flex: 1; display: flex; align-items: center; justify-content: center;}
.wwi-popup-content .popup-btn .false{color: #888; flex: 1; display: flex; align-items: center; justify-content: center; border-left:2upx solid #F8F8F8 ;}
.wwi-popup-content .msg-content{flex: 1; padding: 30upx; overflow: hidden;font-size: 26upx;}
</style>
 