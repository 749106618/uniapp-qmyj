<template>
	<view>
		<view class="adv-pic">
			<image :src="advPic" mode="widthFix"></image>
		</view>
		<view class="pub-nav-tab flex flexrow">
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==1}" @tap="changeNav('1')">投标中心</view>
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==2}" @tap="changeNav('2')">已投标</view>
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==3}" @tap="changeNav('3')">交付中</view>
			<view class="li flex flexAic flexJcc" :class="{ok:state_type==4}" @tap="changeNav('4')">评价</view>
		</view>
		<view class="tb-list" style="position: relative;">
				<view v-if="!listData" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">您还没有相关的内容</view>
							<view class="dd">请稍后在试</view>
						</view>
					</view>
				</view>
				<block v-if="state_type==1">
				<view class="tb-li" v-for="(item,v) in listData" :key="v">
				<view class="hd">
					<view class="tip flex flexrow"><view class="wwi-icon wwi-icon-gongchengjindu-jiaofuzhong"></view>{{item.status}}</view>{{item.name}}</view>
				<view class="cd flex flexrow">
					<view class="span">发布者：{{item.user_name}}</view>
					<view class="span">所在地：{{item.areatext}}</view>
				</view>
				<view class="bd">
					<view class="span flex flexrow">
						<view class="title">项目类型：</view>
						<view class="info">{{item.fabu_tpye}}</view>
					</view>
					<view class="span flex flexrow">
						<view class="title">结束时间：</view>
						<view class="info cl">{{item.fabu_time}}</view>
					</view>
					<view class="span flex flexrow">
						<view class="title">需求说明：</view>
						<view class="info">{{item.fabu_demand}}</view>
					</view>
				</view>
				<view class="md flex flexJcs">
					<view class="lt flex flexrow">
						<navigator :url="'/pages/seller/tbadd?tbId='+item.id" class="let">我要投标</navigator>
						<navigator :url="'/pages/seller/chatinfo?tid='+item.user_id" class="let">在线沟通</navigator>
					</view>
					<view class="rt flex flexrow">
						<view class="num">{{item.canyu_nums}}</view>人参与
					</view>
				</view>
				</view>
				</block>
				<block v-else-if="state_type==2">
					<view class="ytb-li" v-for="(item,vv) in listData" :key="vv">
						<view class="hd">
							<view class="tip flex flexrow"><view class="wwi-icon wwi-icon-gongchengjindu-jiaofuzhong"></view>{{item.status}}</view>{{item.name}}</view>
						<view class="cd flex flexrow">
							<view class="tips">{{item.is_zb}}</view>￥
							<view class="price">{{item.total_price}}</view>
						</view>
						<view class="bd">
							<view class="span flex flexJcs">
								<view class="flex flexrow">
									<view class="title">项目周期：</view>
									<view class="info">{{item.day}}天</view>
								</view>
								<view class="time">投标时间：{{item.tb_time}}</view>
							</view>
							<view class="span flex flexrow">
								<view class="title">投标描述：</view>
								<view class="info">{{item.describe}}</view>
							</view>
						</view>
						<view class="md flex flexrow">
								<navigator :url="'/pages/seller/chatinfo?tid='+item.user_id" class="let">在线沟通</navigator>
								<navigator :url="'/pages/seller/tbedit?tbId='+item.id" class="lett flex flexrow"><view class="wwi-icon wwi-icon-daipingjia"></view>修改</navigator>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="jhtb-li" v-for="(item,vv) in listData" :key="vv">
						<view class="hd">
							<view class="tip flex flexrow"><view class="wwi-icon wwi-icon-gongchengjindu-jiaofuzhong"></view>{{item.status}}</view>{{item.name}}</view>
							
				<view class="cd flex flexJcs">
					<block v-if="state_type==3">
						<view class="">
						<view class="span">发布者：{{item.fabu_name}}</view>
						<view class="span">发布时间:{{item.fabu_time}}</view>
					</view>
					<navigator :url="'/pages/seller/chatinfo?tid='+item.id" class="btn flex flexAic">在线沟通</navigator>
					</block>
					<block v-else="">
						<view class="flex flexJcs" style="flex: 1;">
						<view class="span">发布者：{{item.fabu_name}}</view>
						<view class="span">发布时间:{{item.fabu_time}}</view>
					</view>
					</block>
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
							<view class="sbtn" v-if="state_type==3">{{nlist.statetext}}</view>
							<block v-else>
							<navigator :url="'/pages/seller/tbeve?id='+nlist.id" class="ssbtn" v-if="nlist.is_evaluation">评价</navigator>
							<view class="ssbtn no" v-else>已评价</view>
							</block>
						</view>
					</view>
				</view>
					</view>
				</block>
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
						url: '/index.php?app=seller_store_tb_center&wwi=index',
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
						url: this.ApiUrl+'/index.php?app=seller_store_tb_center&wwi=index',
						method: 'POST',
						header:{'content-type':'application/x-www-form-urlencoded'},
						data:{key:this.key,state_type:5},
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
		this.key = uni.getStorageSync('seller_key');
		if (!this.key) {
			uni.navigateTo({
				url: '/pages/seller/login'
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
.adv-pic{}
.adv-pic image{width: 100%; height: auto;}
.pub-nav-tab{margin: 20upx;}
.pub-nav-tab .li{width: 25%;border-bottom: 4upx solid transparent; line-height: 60upx;}
.pub-nav-tab .li.ok{color: #2CB476; border-color: #2CB476; }
.tb-list{}
.tb-list .tb-li{padding:40upx 20upx; background: #fff; margin-bottom: 20upx;}
.tb-list .tb-li .hd{font-size: 32upx; font-weight: bold;line-height: 40upx;max-height: 100upx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis;}
.tb-list .tb-li .hd .tip{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display:inline-flex; justify-content: center; align-items: center; border-radius: 35upx; margin-right: 10upx;}
.tb-list .tb-li .hd .tip .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.tb-list .tb-li .cd {color: #999; margin: 10upx 0;}
.tb-list .tb-li .cd .span{margin-right: 20upx;}
.tb-list .tb-li .bd{padding: 20upx 0; border-top: 1px solid #e9f7f1;}

.tb-list .tb-li .bd .span{height: 50upx; line-height: 50upx;}
.tb-list .tb-li .bd .span .title{width: 140upx; font-weight: bold;}
.tb-list .tb-li .bd .span .info{color: #999; flex: 1;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.tb-list .tb-li .bd .span .info.cl{color: #2CB476;font-weight: bold;}
.tb-list .tb-li .md{}
.tb-list .tb-li .md .lt{}
.tb-list .tb-li .md .lt .let{background: #2CB476; color: #fff; padding: 10upx 20upx; margin-right: 20upx;}
.tb-list .tb-li .md .rt{color: #999;}
.tb-list .tb-li .md .rt .num{color: #2CB476; font-weight: bold;}
.tb-list .ytb-li{padding:40upx 20upx; background: #fff; margin-bottom: 20upx;}
.tb-list .ytb-li .hd{font-size: 32upx; font-weight: bold;line-height: 40upx;max-height: 100upx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis;}
.tb-list .ytb-li .hd .tip{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display:inline-flex; justify-content: center; align-items: center; border-radius: 35upx; margin-right: 10upx;}
.tb-list .ytb-li .hd .tip .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.tb-list .ytb-li .cd .tips{color: #e9b224; border: 1px solid #e9b224; padding: 2upx 10upx; border-radius: 35upx; margin-right: 20upx;}
.tb-list .ytb-li .cd .price{color: #FF0000; font-size: 32upx; font-weight: bold;}
.tb-list .ytb-li .cd{color: #FF0000; display: flex; align-items: center; margin: 10upx 0;}
.tb-list .ytb-li .bd{padding: 20upx 0; border-top: 1px solid #e9f7f1;}
.tb-list .ytb-li .bd .span{height: 50upx; line-height: 50upx;}
.tb-list .ytb-li .bd .span .title{width: 140upx; font-weight: bold;}
.tb-list .ytb-li .bd .span .info{color: #999; flex: 1;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.tb-list .ytb-li .bd .span .time{color: #999;}
.tb-list .ytb-li .md .let{background: #2CB476; color: #fff; padding: 10upx 20upx; margin-right: 20upx;}
.tb-list .ytb-li .md .lett{color: #2CB476; align-items: flex-end;}
.tb-list .jhtb-li{padding:40upx 20upx; background: #fff; margin-bottom: 20upx;}
.tb-list .jhtb-li .hd{font-size: 32upx; font-weight: bold;line-height: 40upx;max-height: 100upx;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;text-overflow: ellipsis;}
.tb-list .jhtb-li .hd .tip{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display:inline-flex; justify-content: center; align-items: center; border-radius: 35upx; margin-right: 10upx;}
.tb-list .jhtb-li .hd .tip .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.tb-list .jhtb-li .bd .bd-li{ border-bottom: 1px dotted #ccc; padding: 20upx 0;}
.tb-list .jhtb-li .bd .bd-li .statu{margin: 10upx 0;}
.tb-list .jhtb-li .bd .bd-li .statu .tip{border: 2upx solid #e9b224; color: #e9b224; border-radius: 50upx; padding: 0 10upx;}
.tb-list .jhtb-li .bd .bd-li .statu .amount{color: #ff0000; font-size: 32upx;}
.tb-list .jhtb-li .bd .bd-li .pay{color: #9a9a9a;}
.tb-list .jhtb-li .bd .bd-li .pay .sbtn{ color: #2CB476; padding: 0 20upx; height: 50upx; border:1px solid #2CB476; border-radius: 50upx;}
.tb-list .jhtb-li .bd .bd-li .pay .ssbtn{ background: #2CB476; color: #fff; padding: 0 20upx; height: 50upx;}
.tb-list .jhtb-li .bd .bd-li .pay .ssbtn.no{background: #999;}
.tb-list .jhtb-li .cd{padding: 20upx 0; border-bottom: 2upx solid #e9f7f1;}
.tb-list .jhtb-li .cd .span{color: #999;}
.tb-list .jhtb-li .cd .btn{background: #2CB476; color: #fff; padding:0 20upx; height: 60upx;}
</style>
