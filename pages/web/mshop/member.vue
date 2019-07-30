<template>
	<view class="newBody">
		<view class="member-top">
			<view class="member-info">
				<navigator class="member-info-collect" :url="userUrl">
					<image class="avatar" :src="userImg"></image>
					<view class="member-info-detail"><text class="member-name">{{userName}}</text>
						<view class="sup">{{userSup}}</view>
					</view>
					<view class="member-id">ID:{{userId}}</view>
				</navigator>
			</view>
			<view class="member-collect">
				<navigator v-for="(item,index1) in favoriteList"  :key="index1" class="a" :url="item.url"><text v-if="!item.num" class="em wwi-icon"
					 :class="'wwi-icon-'+item.icon">{{item.num}}</text>
					<text v-if="item.num" class="em">{{item.num}}</text>
					<view class="p">{{item.name}}</view>
				</navigator>
			</view>
		</view>

		<view class="member-center">
			<view class="mt5 dl" v-for="(item,index2) in viewList" :key="index2">
				<view class="dt" v-if="item.name">
					<navigator class="a flex flexJcs flexAic" :url="item.url">
						<view class="h3">{{item.name}}</view>
						<view class="h5" v-if="item.sname">{{item.sname}}
							<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
						</view>
					</navigator>
				</view>
				<view class="dd" :class="item.subclass">
					<navigator class="li" :class="'m'+lod" v-for="(subitem,lod) in item.subitem" :key="lod" :url="subitem.url">
						<view class="wwi-icon" :class="'wwi-icon-'+subitem.icon"><view v-if="subitem.num > 0" class="em">{{subitem.num}}</view></view><text class="p">{{subitem.name}}</text><text v-if="subitem.sname"
						 class="pp">{{subitem.sname}}</text>
					</navigator>
				</view>
			</view>

		</view>
		<view style="height: 100upx;"></view>
		<view class="foot-bottom flex flexAic flexrow">
			<navigator open-type="redirect" :url="'/pages/web/mshop/index?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-cangku"></view>首页</navigator>
			<navigator open-type="redirect" :url="'/pages/web/mshop/search?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-yingyongAPP"></view>分类</navigator>
			<navigator open-type="redirect" :url="'/pages/web/mshop/cart?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-baoguo_yidong"></view>购物车</navigator>
			<view class="li cur flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-gerentouxiang"></view>我的</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				viewList: [],
				userName: '点击登入',
				userSup: '默认等级',
				userId:'888',
				userUrl:'/pages/web/login',
				userImg: '../static/member_w.png',
				key: '',
				favoriteList: [],
				isLogin: '',
				mid:''
			}
		},
		methods: {
			getMember() {
				this.wwiopt({
					url: '/index.php?app=member_index',
					method: 'POST',
					data: {
						key: this.key
					},
					dataType: 'json',
					success: res => {
						var data = res.data.datas;
						this.checkLogin(res.data.login);
						this.viewList = [{
								name: '我的订单',
								sname: '查看全部订单',
								url: '/pages/my/orderlist',
								subclass: 'five-url',
								subitem: [{
										name: '待付款',
										icon: 'qianbao',
										num:data.member_info.order_nopay_count,
										url: '/pages/my/orderlist?state=state_new'
									},
									{
										name: '待收货',
										icon: 'shouhuo',
										num:data.member_info.order_noreceipt_count,
										url: '/pages/my/orderlist?state=state_send'
									},
									{
										name: '待自提',
										icon: 'daitihuo',
										num:data.member_info.order_notakes_count,
										url: '/pages/my/orderlist?state=state_notakes'
									},
									{
										name: '待评价',
										icon: 'daipingjia',
										num:data.member_info.order_noeval_count,
										url: '/pages/my/orderlist?state=state_noeval'
									},
									{
										name: '退款/退货',
										icon: 'tuikuantuihuo',
										num:data.member_info.return,
										url: '/pages/my/tuihuan'
									}
								]
							},
							{
								name: '我的福利',
								subclass: 'two-url',
								subitem: [{
										name: '积分兑换',
										sname: '在线积分换礼品',
										icon: 'weibiaoti1',
										url: '/pages/web/pointmall'
									},
									{
										name: '在线签到',
										sname: '签到赢取积分',
										icon: 'qiandao1',
										url: '/pages/my/sigin'
									}
								]
							},
							{
								name: '快捷导航',
								sname: '',
								url: '#',
								subclass: 'all-url',
								subitem: [{
										name: '用户设置',
										icon: 'quanjushezhi',
										url: '/pages/my/account'
									}, {
										name: '我的卡券',
										icon: 'qiaquan',
										url: '/pages/my/mycard'
									},
									{
										name: '兑码订单',
										icon: 'yunsuancaozuo',
										url: '/pages/my/vrorderlist'
									},
									{
										name: '我的资产',
										icon: 'jinbi',
										url: '/pages/my/mypro'
									}, {
										name: '收货地址',
										icon: 'didiandingwei',
										url: '/pages/my/addresslist'
									}, {
										name: '我的推广',
										icon: 'CPhezuo',
										url: '/pages/invite/index'
									},
									{
										name: '充值卡',
										icon: 'yinhangqia',
										url: '/pages/my/rechargecardlist'
									},
									{
										name: '实名认证',
										icon: 'guanliyuanrenzheng',
										url: '/pages/my/realname'
									}

								]
							},
					{   subclass:'about-url',
						subitem:[{
							name:'关于我们',
							icon:'guanyu',
							url:'/pages/web/about'
						},{
							name:'常见问题',
							icon:'bangzhu',
							url:'/pages/web/question'
						},
						{
							name:'在线反馈',
							icon:'shuliang-zengjia',
							url:'/pages/my/feedback'
						}
						]
					}
						];
						this.userName = data.member_info.user_name;
						this.userSup = data.member_info.level_name + '会员';
						this.userImg = data.member_info.avatar;
						this.userId = data.member_info.id;
						this.userUrl='/pages/my/account';
						this.favoriteList = [{
								name: '商品收藏',
								num: data.member_info.favorites_goods,
								url: '/pages/my/favgoods'
							}, {
								name: '店铺收藏',
								num: data.member_info.favorites_store,
								url: '/pages/my/favstore'
							},
							{
								name: '我的足迹',
								icon: 'zuji',
								url: '/pages/my/viewlist'
							}
						]

					}
				});
			},
			reMember(){
				this.viewList= [{
						name: '我的订单',
						sname: '查看全部订单',
						url: '/pages/web/login',
						subclass: 'five-url',
						subitem: [{
								name: '待付款',
								icon: 'qianbao',
								url: '/pages/web/login'
							},
							{
								name: '待收货',
								icon: 'shouhuo',
								url: '/pages/web/login'
							},
							{
								name: '待自提',
								icon: 'daitihuo',
								url: '/pages/web/login'
							},
							{
								name: '待评价',
								icon: 'daipingjia',
								url: '/pages/web/login'
							},
							{
								name: '退款/退货',
								icon: 'tuikuantuihuo',
								url: '/pages/web/login'
							}
						]
					},
					{
						name: '我的福利',
						subclass: 'two-url',
						subitem: [{
								name: '积分兑换',
								sname: '在线积分换礼品',
								icon: 'weibiaoti1',
								url: '/pages/web/pointmall'
							},
							{
								name: '在线签到',
								sname: '签到赢取积分',
								icon: 'qiandao1',
								url: '/pages/web/login'
							}
						]
					},
					{
						name: '快捷导航',
						sname: '',
						url: '#',
						subclass: 'all-url',
						subitem: [{
								name: '用户设置',
								icon: 'quanjushezhi',
								url: '/pages/web/login'
							}, {
								name: '我的卡券',
								icon: 'qiaquan',
								url: '/pages/web/login'
							},
							{
								name: '兑码订单',
								icon: 'yunsuancaozuo',
								url: '/pages/web/login'
							},
							{
								name: '我的资产',
								icon: 'jinbi',
								url: '/pages/web/login'
							},  {
										name: '收货地址',
										icon: 'didiandingwei',
										url: '/pages/web/login'
									}, {
										name: '我的推广',
										icon: 'CPhezuo',
										url: '/pages/web/login'
									},
									{
										name: '充值卡',
										icon: 'yinhangqia',
										url: '/pages/web/login'
									},
									{
										name: '实名认证',
										icon: 'guanliyuanrenzheng',
										url: '/pages/web/login'
									}

						]
					},
					{   subclass:'about-url',
						subitem:[{
							name:'关于我们',
							icon:'guanyu',
							url:'/pages/web/about'
						},{
							name:'常见问题',
							icon:'bangzhu',
							url:'/pages/web/question'
						},
						{
							name:'在线反馈',
							icon:'shuliang-zengjia',
							url:'/pages/web/login'
						}
						]
					}
				];
				this.userName = '点击登入';
				this.userSup= '默认等级';
				this.userImg= '../static/member_w.png';
				this.key= '';
				this.userId='888';
				this.userUrl='/pages/web/login';
				this.favoriteList= [{
						name: '商品收藏',
						icon: 'shoucang',
						url: '/pages/web/login'
					}, {
						name: '店铺收藏',
						icon: 'dianpu',
						url: '/pages/web/login'
					},
					{
						name: '我的足迹',
						icon: 'zuji',
						url: '/pages/web/login'
					}];
				this.isLogin= '';
			}
		},
		onLoad: function(o) {
			if(o.msid){
				this.mid = o.msid;
				uni.setStorageSync('msid',o.msid);
			}else{
				this.mid = uni.getStorageSync('msid');
			}
			if(!this.mid){
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
// 			if (this.key) {
// 				this.getMember();
// 			}else{
// 				this.reMember();
// 			}
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
			if (this.key) {
				this.getMember();
			}else{
				this.reMember();
			}
			// #ifdef H5
			document.title = '会员中心-'+this.siteTitle;
			// #endif
		}

	}
</script>

<style>
page {	background: #F8F8F8;height: auto; min-height: 100%;}
/*我的商城*/
.member-top { -webkit-animation:changeBg 20s infinite; -moz-animation:changeBg 20s infinite; animation:changeBg 20s infinite;background-color:#ED5564; background-size: cover;background-image: url('data:image/png;base64,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');  text-align: center; width: 100%; height: 390upx; display: flex; position: relative; z-index: 1;}@-webkit-keyframes changeBg{0%{background-color:#ED5564;}10%{background-color:#FB6E52;}20%{background-color:#FFCE55;}30%{background-color:#A0D468;}40%{background-color:#48CFAE;}50%{background-color:#4FC0E8;}60%{background-color:#5D9CEC;}70%{background-color:#AC92ED;}80%{background-color:#EC87BF;}90%{background-color:#ED5564;}}@-moz-keyframes changeBg{0%{background-color:#ED5564;}10%{background-color:#FB6E52;}20%{background-color:#FFCE55;}30%{background-color:#A0D468;}40%{background-color:#48CFAE;}50%{background-color:#4FC0E8;}60%{background-color:#5D9CEC;}70%{background-color:#AC92ED;}80%{background-color:#EC87BF;}90%{background-color:#ED5564;}}@keyframes changeBg{0%{background-color:#ED5564;}10%{background-color:#FB6E52;}20%{background-color:#FFCE55;}30%{background-color:#A0D468;}40%{background-color:#48CFAE;}50%{background-color:#4FC0E8;}60%{background-color:#5D9CEC;}70%{background-color:#AC92ED;}80%{background-color:#EC87BF;}90%{background-color:#ED5564;}}
.member-info:before {}
.member-info { width: 100%; height: 200upx; top: 0; position: absolute; z-index: 1; animation: memberInfoDown 1000ms  ease-in; -webkit-animation: memberInfoDown 1000ms ease-in; display: flex; padding: 70upx 28upx 0; box-sizing: border-box;}@keyframes  memberInfoDown{0% { top: -50%;}30% { top: -10%}75% { top: 55%}85% { top: 47%}95% { top: 52%}100% { top: 50%;}}@-webkit-keyframes  memberInfoDown{0% { top: -50%;}30% { top: -10%}75% { top: 55%}85% { top: 47%}95% { top: 52%}100% { top: 50%;}}

.member-info .member-info-collect{width: 100%; display: flex; position: relative; clear: both; }
.member-info .member-info-collect .avatar{width: 120upx; height: 120upx; border-radius:50% ; border: 4upx solid #ffffff;}
.member-info .member-info-collect .member-info-detail{display: flex; flex-direction: column; align-items: flex-start; justify-content: center; margin-left: 30upx;height: 120upx;}
.member-info .member-info-collect .member-info-detail .member-name{display: flex; align-items: center; margin-bottom: 20upx; color: #ffffff; font-size: 36upx;}
.member-info .member-info-collect .member-info-detail .sup{display: flex; align-items: center; color: #ffffff; background: rgba(0,0,0,0.4); padding: 0 15upx; font-size: 24upx; border-radius: 15upx;}
.member-info .member-info-collect .member-id{position: absolute; top: 50upx; right: -28upx; background: rgba(0,0,0,0.6); color: #FFFFFF; padding: 0 15upx; font-size: 24upx; border-radius:15upx 0 0 15upx ;}
.member-collect {height: 130upx;background:#FFFFFF;position: absolute; bottom: 0; left: 0; right: 0; display: flex;}
.member-collect .span { height: 100upx; padding: 20upx 0; display: flex;}
.member-collect .a {width: 33.33%; display: flex; flex-direction: column; align-items: center; justify-content: center;  position: relative; padding-bottom: 0.32rem;}
.member-collect .em {display: block;  width: 100%; text-align: center; font-size: 40upx; line-height: 45upx;  color: #222;  font-weight: bold;}
.member-collect .em.wwi-icon{font-size: 40upx; line-height: 45upx;}
.member-collect .p {display: block; width: 100%; text-align: center; font-size: 28upx; color: #222;}

.member-center {}
.member-center .dl { background-color: #FFF; box-shadow: 0 2upx 0 rgba(0,0,0,0.05);}
.member-center .dl.mt5{margin-top: 10upx;}
.member-center .dt { line-height: 40upx; display: block; height: 40upx; padding: 20upx;}
.member-center .dt:last-child { border-bottom: none;}
.member-center .dt .a { display: block;}
.member-center .dt .h3 { font-size: 30upx; color: #222; vertical-align: top; display: inline-block;font-weight: bold;}
.member-center .dt .h5 { font-size: 24upx; color: #999; float: right; display: flex; align-items: center;}
.member-center .dt .h5 .wwi-icon{display: inline-block; vertical-align: middle;}
.member-center .dd { 	display: flex;flex-direction: row;flex-wrap: wrap;padding: 10upx 0;}
.member-center .dd .li {display: flex;flex-direction: column; align-items: center; justify-content: center; width: 20%; padding: 0 0 20upx 0;}
.member-center .dd .li .p { font-size: 26upx; color: #888;}
.member-center .dd.five-url .wwi-icon{font-size: 60upx;  color: #FF0036; position: relative;}
.member-center .dd.five-url .wwi-icon .em{background: #FF0036; position: absolute; font-size: 24upx; height: 16upx; display: flex; justify-content: center; align-items: center; color: #fff; top: 0; right: -10upx; border-radius:50% ; padding: 8upx;}
.member-center .dd.two-url .wwi-icon{font-size: 60upx;padding: 10upx; color: #FFFFFF; background-color: #f44336; position: absolute; left: 30upx; z-index: 1; border-radius:50% ; width: 80upx; height: 80upx; display: flex; justify-content: center; align-items: center;}
.member-center .dd.two-url .li.m1 .wwi-icon{background-color: #03a9f4;}
.member-center .dd.two-url .li .p{color: #222222;}
.member-center .dd.two-url .li .p,.member-center .dd.two-url .li .pp{margin-left: 80upx;display: flex; justify-content: flex-start;}
.member-center .dd.two-url .li .pp{font-size: 24upx; color: #888888;}
.member-center .dd.two-url .li{width: 50%; position: relative; height: 120upx;}
.member-center .dd.all-url .li{width: 25%;}
.member-center .dd.all-url .wwi-icon{font-size: 60upx; line-height: 1.45em; color: #FF0036;}
.member-center .dd.all-url .li.m0 .wwi-icon{color: #f44336;}
.member-center .dd.all-url .li.m1 .wwi-icon{color: #ffc107;}
.member-center .dd.all-url .li.m2 .wwi-icon{color: #673ab7;}
.member-center .dd.all-url .li.m3 .wwi-icon{color: #e91e63;}
.member-center .dd.all-url .li.m4 .wwi-icon{color: #cddc39;}
.member-center .dd.all-url .li.m5 .wwi-icon{color: #1AAD19;}
.member-center .dd.all-url .li.m7 .wwi-icon{color: #009688;}
.member-center .dd.all-url .li.m8 .wwi-icon{color: #1AAD19;}
.member-center .dd.about-url .li{width: 33.33%;}
.foot-bottom{position: fixed; bottom: 0; left: 0; right: 0;height: 90upx; font-size: 28upx; background: #F8F8F8; z-index: 99; }
.foot-bottom .li{flex: 1; height: 90upx; line-height: 30upx;}
.foot-bottom .li.cur{color: #FF0036;}
</style>
