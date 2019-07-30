<template>
	<view>
		<view class="wwi-mask" v-show="mask" @click="hideMask"></view>
		<view class="wwi-popup-content2"  v-show="mask">
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
		<navigator url="/pages/my/pointorder" class="wwi-icon wwi-icon-weibiaoti1 pageTop"></navigator>
		<view class="integral-01 flex flexrow">
			<view class="account-image flex flexrow">
				<image class="image-shadow" :src="!info.avatar?'../../static/member_w.png':info.avatar"  mode="widthFix"></image>
				<view class="fl flex flexcol">
					<navigator url="/pages/web/login" class="h1" style="margin-top:40upx" v-if="!key">立即登入</navigator>
					<view class="h1 flex flexrow" v-if="key">
						<view class="name">{{info.user_name}}</view>
						<view class="level image-shadow-s flex flexrow">Lv.<view class="b">{{info.level}}</view></view>
					</view>
					<view class="h2" v-if="key">经验值: {{info.member_exppoints}}</view>
				</view>
			</view>
			<navigator url="/pages/web/pgoodscart" class="integral-cart" v-if="key"><view class="span" v-if="cartnum > 0"></view></navigator>
		</view>
		<view class="integral-data flex flexrow">
			<navigator url="/pages/my/points" class="li flex flexcol" style="border-left: none;"><view class="h1">{{pointnum}}</view><view class="h2">我的积分</view></navigator>
			<navigator url="/pages/my/voucherlist" class="li flex flexcol"><view class="h1">{{voucher}}</view><view class="h2">可用代金券</view></navigator>
			<navigator url="/pages/my/redpacketlist" class="li flex flexcol"><view class="h1">{{redpacket}}</view><view class="h2">可用红包</view></navigator>
		</view>
		<view class="integral-02 flex flexcol" v-if="voucherList.length > 0">
			<view class="top-link flex flexrow">
				<view style="font-weight: bold;">代金券</view>
				<navigator class="gray-word" style="font-size: 28upx;" url="/pages/web/pvoucher">更多>></navigator>
			</view>
			<view class="integral-list">
				<view class="li flex flexrow" v-for="(item,index) in voucherList" :key="index">
					<view class="fl flex flexrow">
						<image :src="item.voucher_t_customimg"></image>
						<view class="u-content flex flexcol">
							<view class="hd flex flexrow">
								<view class="red-word flex flexrow">&yen; <view class="b">{{item.voucher_t_price}}</view></view>
								<view class="span red-word">满{{item.voucher_t_limit}}元可用</view>
							</view>
							<view class="">官方店铺</view>
							<view class="gray-word" style="font-size: 24upx;">需{{item.voucher_t_points}}积分,有效期至{{item.voucher_t_end_date}}</view>
						</view>
					</view>
					<view class="fr flex flexcol">
						<view class="progress flex flexcol">
							<view class="flex" style="align-items: center; justify-content: center; height: 50upx;">已抢{{item.bfb}}%</view>
				            <progress :percent="item.bfb" color="#ff0036" active stroke-width="10" />
			            </view>
						<view class="o-btn" @click="getVoucher(item)">立即兑换</view>
					</view>
					<view class="level flex flexrow" v-if="item.voucher_t_mgradelimit > 0">Lv.<view class="b">{{item.voucher_t_mgradelimit}}</view></view>
				</view>
				</view>
		</view>
		<view class="integral-02 flex flexcol" v-if="redpacketList.length > 0">
			<view class="top-link flex flexrow">
				<view style="font-weight: bold;">平台红包</view>
				<navigator class="gray-word" style="font-size: 28upx;" url="/pages/web/predpacket">更多>></navigator>
			</view>
			<view class="integral-list redpacket">
				<view class="li flex flexrow" v-for="(item,index2) in redpacketList" :key="index2">
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
		</view>
		<view class="integral-02 flex flexcol" v-if="pointsprod.length>0">
			<view class="top-link flex flexrow">
				<view style="font-weight: bold;">精选礼品</view>
				<navigator class="gray-word" style="font-size: 28upx;" url="/pages/web/pgoodslist">更多>></navigator>
			</view>
			<view class="goods-point flex flexrow flexJcs">
				<navigator :url="'/pages/web/pgoodsinfo?id='+item.pgoods_id" class="bargin-item flex flexcol" v-for="(item,index3) in pointsprod" :key="index3">
					<image :src="item.pgoods_image"></image>
					<view class="title">{{item.pgoods_name}}</view>
					<view class="flex flexcol">
						<view class="bargin-item-price gray-word">所需积分:</view>
						<view class="bargin-item-p">{{item.pgoods_points}}</view>
					</view>
					<view class="bargin-new-price flex flexrow flexJcs flexAcc flexAic">
						<view class="bargin-old-price">&yen;{{item.pgoods_price}}</view>
						<view class="bargin-btn">兑换</view>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				info:[],
				pointnum:0,
				cartnum:0,
				voucher:0,
				redpacket:0,
				pointsprod:[],
				redpacketList:[],
				voucherList:[],
				mask:false,
				maskMsg:[]
			}
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: "/index.php?app=points",
					method: 'POST',
					data: {key:this.key},
					success: res => {
						if(this.key){
							this.info = res.data.datas.member_info;
							this.pointnum = res.data.datas.member_info.member_points;
							this.voucher = res.data.datas.vouchercount;
						    this.redpacket = res.data.datas.redpacketcount;
							this.cartnum = res.data.datas.pointcart_count;
						}
						this.pointsprod = res.data.datas.pointsprod;
						res.data.datas.redpacket.forEach(item => {
							var num2 = parseFloat((item.rpacket_t_giveout / item.rpacket_t_total * 10000) / 100.00).toFixed(2);
							this.$set(item, 'bfb', num2);
						});
						this.redpacketList = res.data.datas.redpacket;
						res.data.datas.voucher.forEach(item => {
							var num = parseFloat((item.voucher_t_giveout / item.voucher_t_total * 10000) / 100.00).toFixed(2);
							this.$set(item, 'bfb', num);
						});
						this.voucherList = res.data.datas.voucher;
						
					}
				});
			},
			getRpacket:function(e){
			if (!this.key) {
				uni.navigateTo({	url: '/pages/web/login' });
				return false;
			}
			if(parseInt(e.rpacket_t_giveout) < parseInt(e.rpacket_t_total)){
				if(parseInt(e.rpacket_t_points) > parseInt(this.pointnum)){
					uni.showToast({	title: '您的积分不足，暂时不能兑换该红包',icon:"none"});
					return false;
				}
				if(parseInt(e.rpacket_t_mgradelimit) > parseInt(this.info.level)){
					uni.showToast({	title: '您的会员级别不够，暂时不能兑换该红包',icon:"none"});
					return false;
				}
				var b_msg = '';
				b_msg += e.rpacket_t_price+'元平台红包，消费满'+e.rpacket_t_limit+'元减'+e.rpacket_t_price+'元，有效期至'+e.rpacket_t_end_date+',';
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
			getVoucher:function(e){
			if (!this.key) {
				uni.navigateTo({	url: '/pages/web/login'});
				return false;
			}
			if(parseInt(e.voucher_t_giveout) < parseInt(e.voucher_t_total)){
				if(parseInt(e.voucher_t_points) > parseInt(this.info.member_points)){
				uni.showToast({	title: '您的积分不足，暂时不能兑换该代金券',icon:"none"});
				return false;
				}
				if(parseInt(e.voucher_t_mgradelimit) > parseInt(this.info.level)){
				uni.showToast({	title: '您的会员级别不够，暂时不能兑换该代金券',icon:"none"});
				return false;
				}
				var b_msg = '';
				b_msg +='店铺('+e.voucher_t_storename+')'+e.voucher_t_price+'元店铺代金券，消费满'+e.voucher_t_limit+'元减'+e.voucher_t_price+'元，有效期至'+e.voucher_t_end_date+',';
				var limit_count = '不限量';
				if(parseInt(e.voucher_t_eachlimit) > 0){
					limit_count = e.voucher_t_eachlimit+'张';
				}
				
				b_msg += '每个ID限领取:'+limit_count;
				var url =this.ApiUrl+"/index.php?app=member_points&wwi=voucherexchange";
				this.maskMsg =({
					title:'兑换代金券',
					msgA:'您将兑换'+e.voucher_t_price+'元优惠券一张，这将花费您'+e.voucher_t_points+'积分',
					msgB:b_msg,
					btnA:'兑换',
					btnB:'取消',
					url:url,
					id: e.voucher_t_id
				});
				this.mask =true;
				
			}else{
				uni.showToast({	title: '代金券已兑换完',icon:"none"});
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
			}
			
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			this.Inlimine();
		}
	}
</script>

<style>
 @import "../../common/css/integral.css";
</style>
 