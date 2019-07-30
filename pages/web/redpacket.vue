<template>
	<view>
		<view class="redpacket-info">
			<navigator url="/pages/my/redpacketlist" class="redpacket-my"><view class="wwi-icon wwi-icon-bangzhu"></view>我的红包</navigator>
			<view class="redpacket-title">{{info.rpacket_t_title}}</view>
			<view class="price-info flex flexrow flexJcc">{{info.rpacket_t_price}}<view class="em">元</view></view>
			<view class="redpacket-com">需满{{info.rpacket_t_limit}}元即可使用,有效期至{{info.rpacket_t_end_date_text}}</view>
		</view>
		<view class="redpacket-bg-aa"><view class="redpacket-bg-bb"></view></view>
		<view class="redpacket-bg">
			<view class="redpacket-bg-btn-main"><view class="redpacket-bg-btn"  @click="getRpacket(info)">{{info.rpacket_t_gettype_text}}</view></view>
			<view class="redpacket-list">
				<view class="redpacket-list-title" v-if="info.rpacket_t_mgradelimit>0">每人限领取{{info.rpacket_t_mgradelimit}}次</view>
				<view class="redpacket-list-title" v-else>不限次数领取，领完即止</view>
			</view>
		</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tid:'',
				key:'',
				info:[],
				mask:false,
				maskMsg:[],
			};
		},
		methods:{
			loadData:function(){
				this.wwiopt({
					url: "/index.php?app=points&wwi=getredpacket",
					method: 'GET',
					data: {tid:this.tid},
					success: res => {
						this.info=res.data.datas.template_info;
					},
					error: () => {
						uni.showToast({
							title: '访问超时',icon:"none",
							success() {
								setTimeout(function() {
									var page = getCurrentPages();
									if(page.length > 1){
									  uni.navigateBack();
									}else{
									  uni.switchTab({  url:'/pages/index' });
									}
								}, 1000);
							}
						});
					},
				});
			},
			getRpacket:function(e){
			if (!this.key) {
				uni.navigateTo({	url: '/pages/web/login' });
				return false;
			}
			if(parseInt(e.rpacket_t_giveout) < parseInt(e.rpacket_t_total)){
				var b_msg = '';
				b_msg += e.rpacket_t_price+'元平台红包，消费满'+e.rpacket_t_limit+'元减'+e.rpacket_t_price+'元，有效期至'+e.rpacket_t_end_date_text+',';
				var limit_count = '不限量';
				if(parseInt(e.rpacket_t_eachlimit ) > 0){
					limit_count = e.rpacket_t_eachlimit +'张';
				}
				
				b_msg += '每个ID限领取:'+limit_count;
				var url =this.ApiUrl+"/index.php?app=member_points&wwi=redpacketexchange";
				this.maskMsg =({
					title:'领取红包',
					msgA:'您将领取'+e.rpacket_t_price+'元红包券一张',
					msgB:b_msg,
					btnA:'领取',
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
		},
		onLoad:function(e){
			if(e.id){
				this.tid = e.id;
			}else{
				uni.showToast({
					title: '参数错误',icon:"none",
					success() {
						setTimeout(function() {
							var page = getCurrentPages();
							if(page.length > 1){
							  uni.navigateBack();
							}else{
							  uni.switchTab({  url:'/pages/index' });
							}
						}, 1000);
					}
				});
			}
			this.key = uni.getStorageSync('key');
			this.loadData();
		}
	}
</script>

<style>
page{background: #962b24;}
.redpacket-info{background: #ba3523;}
.redpacket-info .redpacket-my{font-size: 28upx; align-items:center; display: flex; justify-content: flex-end; margin-right: 20upx; color: #ffc107;}
.redpacket-info .price-info{font-size: 60upx; color: #FFFFFF; font-weight: bold; align-items: baseline;}
.redpacket-info .price-info .em{font-size: 30upx; margin-left: 15upx;}
.redpacket-info .redpacket-title{font-size: 32upx; color: #fbf2e2; display: flex; justify-content: center; align-items: center;}
.redpacket-info .redpacket-com{font-size: 28upx; color: #fbf2e2; display: flex; justify-content: center; align-items: center;padding: 20upx;}
.redpacket-bg-aa{min-height: 180upx; position: relative; overflow: hidden; }
.redpacket-bg-aa .redpacket-bg-bb{height: 780upx; width: 1280upx; border-radius:0 0 1280upx 1280upx;background: #ba3523;left: -265upx; position: absolute; z-index: 1; bottom: 0;}
.redpacket-bg{position: relative;}
.redpacket-bg .redpacket-bg-btn-main{display: flex;align-items: center; justify-content: center; position: absolute; top:-75upx; z-index: 99; width: 100%;}
.redpacket-bg .redpacket-bg-btn{background: #ffc107; width: 150upx; height: 150upx; border-radius:50% ;display: flex; align-items: center; justify-content: center; font-size: 32upx; font-weight: bold; color: #FFFFFF;}
.redpacket-list{padding: 95upx 20upx; display: flex; justify-content: center; align-items: center;}
.redpacket-list .redpacket-list-title{color: #ffdcda; font-size: 34upx;}
.wwi-mask {position: fixed;z-index: 998;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(0, 0, 0, .3);}
.wwi-popup-content{	position:fixed;z-index: 999;background-color: #ffffff;box-shadow: 0 0 30upx rgba(0, 0, 0, .1);display: flex;align-items: center;width: 80%;height: auto;border-radius: 10upx;top: 50%;left: 50%;transform: translate(-50%, -50%);flex-direction: column;}
.wwi-popup-content .top-title{height: 80upx; color: #888888;}
.wwi-popup-content .popup-btn{width: 100%; border-top:2upx solid #F8F8F8 ; height: 80upx; font-size: 28upx;}
.wwi-popup-content .popup-btn .true{color: #007AFF; flex: 1; display: flex; align-items: center; justify-content: center;}
.wwi-popup-content .popup-btn .false{color: #888; flex: 1; display: flex; align-items: center; justify-content: center; border-left:2upx solid #F8F8F8 ;}
.wwi-popup-content .msg-content{flex: 1; padding: 30upx; overflow: hidden;font-size: 26upx;}
</style>
