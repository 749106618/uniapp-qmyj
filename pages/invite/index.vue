<template>
	<view>
		<view style="background: #2f303c;padding:10upx 0;">
        <view class="no-invite" v-if="info.jfx_state==0">
			<view class="title">您还不是推广人员，请先申请成为推广员</view>
			<navigator url="/pages/invite/join" class="btn">马上申请</navigator>
		</view>
        <view class="no-invite" v-if="info.jfx_state==1">
			<view class="title">申请正在审核中...预计1个工作日内审核完毕</view>
		</view>
        <view class="no-invite" v-if="info.jfx_state==3">
			<view class="title">申请未通过，请认真填写资料重新申请</view>
			<navigator url="/pages/invite/join" class="btn">马上申请</navigator>
		</view>
		<view class="h-tips"  v-if="info.jfx_state==4">您已经被清退，将无法继续获得佣金</view>
		<navigator url="/pages/my/realname" class="h-tips" v-if="info.id_card_bind==0">您还没有申请实名认证,以免影响您正常提现 》》点击认证</navigator>
		<view class="member-invite-top" v-if="info.jfx_show > 0">
        <navigator :url="'/pages/my/setting?mshop='+info.id" class="member-group-hd flex flexrow">
			<view class="member-avatar"><image :src="info.avatar"></image></view>
			<view class="member-info">
				<view class="member-name">{{info.user_name}}</view>
				<view class="member-class flex flexrow flexAic"><view class="wwi-icon wwi-icon-qunzu"></view>{{info.group_info.group_name}}</view>
				<view class="member-group flex flexrow flexAic" v-if="info.invite_one > 0"><view class="wwi-icon wwi-icon-jingliren"></view>{{info.invite_one}}</view>
			</view>
			<view class="member-code flex flexrow">
				<view class="wwi-icon wwi-icon-erweima"></view>
				<view class="wwi-icon wwi-icon-xuanzeqixiayige"></view>
			</view>
		</navigator>
		<view class="member-group-bd flex flexrow">
			<navigator url="/pages/invite/member" class="span flex flexrow"><view class="wwi-icon wwi-icon-team_member"></view>组员</navigator>
			<navigator url="/pages/invite/cashOut" class="span flex flexrow"><view class="wwi-icon wwi-icon-tixian"></view>提现</navigator>
		</view>
		</view></view>
		<view class="wwi-default-list mt10" v-if="info.jfx_show > 0">
			<view class="li border">
				<navigator url="/pages/invite/memberOrder" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-orders"></view>返利订单</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/invite/memberOrderBill" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-completetheorder"></view>返利结算</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/invite/cash" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-tixian"></view>提现记录</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/invite/commission" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-shouru"></view>佣金明细</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/invite/cashOut" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-tixian"></view>佣金提现</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
		</view>
		<view class="invite-wei" v-if="info.group_info.is_shop>0 && info.jfx_state>0">
			<view class="title">小店管理</view>
			<view class="ul flex flexrow">
				<navigator url="/pages/invite/selectClass" class="li flex flexrow">
					<view class="wwi-icon wwi-icon-ico_kufangguanli_kucunchaxun-"></view>
					<view class="span">商品库</view>
				</navigator>
				<navigator url="/pages/invite/billGoods" class="li flex flexrow">
					<view class="wwi-icon wwi-icon-ico_kufangguanli_caigoushenqingdan"></view>
					<view class="span">小店商品</view>
				</navigator>
				<navigator url="/pages/invite/billOrder" class="li flex flexrow">
					<view class="wwi-icon wwi-icon-orders"></view>
					<view class="span">小店订单</view>
				</navigator>
				<navigator url="/pages/invite/billList" class="li flex flexrow">
					<view class="wwi-icon wwi-icon-ico_kufangguanli_jizhangguanli"></view>
					<view class="span">小店结算</view>
				</navigator>
				<navigator :url="'/pages/web/mshop/index?msid='+info.id" class="li flex flexrow">
					<view class="wwi-icon wwi-icon-yizhan"></view>
					<view class="span">进入小店</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{
					group_info:[]
				},
				key:''
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: '/index.php?app=member_invite&wwi=index',
					method:"POST",
					data: {key:this.key},
					success: res => {
						if(res.data.datas.error){
							uni.showToast({
								title: '数据错误',icon:"none"
							});
							return false;
						}
						this.info = res.data.datas.invite_info;
					}
				});
			}
		},
		onLoad:function(){
			this.key = uni.getStorageSync('key');
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
			this.Inlimine();
			// #ifdef H5
			document.title = '我的推广-'+this.siteTitle;
			// #endif
			
		}
	}
</script>

<style>
page{background: #F8F8F8;}
.member-invite-top{}
.member-invite-top .member-group-hd{padding:40upx 20upx;}
.member-invite-top .member-group-hd .member-avatar{background: #FFFFFF; width: 120upx; height: 120upx; padding: 5upx; border-radius:50% ; overflow: hidden; box-shadow: #607d8b 4upx 4upx 10upx ;}
.member-invite-top .member-group-hd .member-avatar image{width: 120upx; height: 120upx; border-radius:50% ;}
.member-invite-top .member-group-hd .member-info{margin-left: 30upx; flex: 1;}
.member-invite-top .member-group-hd .member-info .member-name{font-size: 32upx; font-weight: bold; color: #FFFFFF;}
.member-invite-top .member-group-hd .member-info .member-class{color: #ffeb3b; font-size: 26upx;}
.member-invite-top .member-group-hd .member-info .member-class .wwi-icon{font-size: 38upx; margin-right: 10upx;}
.member-invite-top .member-group-hd .member-info .member-group{color: #ff5722; font-size: 26upx;}
.member-invite-top .member-group-hd .member-info .member-group .wwi-icon{font-size: 38upx; margin-right: 10upx;}
.member-invite-top .member-group-hd .member-code{align-items: center; justify-content: center; color: #8bc34a;}
.member-invite-top .member-group-hd .member-code .wwi-icon-xuanzeqixiayige{font-size: 34upx;}
.member-invite-top .member-group-bd{ height: 20upx; padding: 20upx; color: #FFFFFF;}
.member-invite-top .member-group-bd .span{flex: 1; align-items: center; justify-content: center; font-size: 28upx;}
.member-invite-top .member-group-bd .span:last-child{border-left:1px solid #EFEFEF ;}
.member-invite-top .member-group-bd .span .wwi-icon{font-size: 44upx; margin-right: 10upx;}
.no-invite{position: fixed; width: 100%; height: 100%; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;}
.no-invite .title{font-size: 28upx;}
.no-invite .btn{font-size: 36upx; color: #FF0036;}

.invite-wei{margin-top: 0upx; background: #FFFFFF; padding: 20upx;}
.invite-wei .title{font-size: 32upx; font-weight: bold; padding-left: 20upx;}
.invite-wei .ul{ flex-wrap: wrap; padding-left: 20upx; padding-top: 20upx;}
.invite-wei .ul .li{ width: 325upx;  background: #efefef;box-sizing: border-box; margin-right: 20upx; margin-bottom: 20upx; height: 70upx; align-items: center; font-size: 28upx;}
.invite-wei .ul .li .wwi-icon{color: #2196f3; font-size: 42upx; margin: 0 10upx;}
.h-tips{background: #fffde7; color: #fdd835; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);; border: 1px solid #fdd835; margin: 20upx; padding:10upx 20upx; font-size: 24upx;}
</style>
