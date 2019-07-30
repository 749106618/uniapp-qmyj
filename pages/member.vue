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
			<view class="dl mt5" v-for="(item,index2) in viewList" :key="index2">
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
				isLogin: ''
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
									name: '我的财产',
									subclass: 'five-url cc',
									subitem: [{
											name: '预存款',
											icon: 'wodecaichan-yufukuan',
											url: '/pages/my/pdlist'
										},
										{
											name: '充值卡',
											icon: 'wodecaichan-chongzhika',
											url: '/pages/my/rechargecardlist'
										},
										{
											name: '代金券',
											icon: 'wodecaichan-daijinquan',
											url: '/pages/my/orderlist?state=state_notakes'
										},
										{
											name: '红包',
											icon: 'wodecaichan-hongbao',
											url: '/pages/my/redpacketlist'
										},
										{
											name: '积分',
											icon: 'wodecaichan-jifen',
											url: '/pages/my/points'
										}
									]
								},
								{
										name: '我的项目',
										subclass: 'five-url cc c4',
										subitem: [{
												name: '我的项目',
												icon: 'wodexiangmu-wodexiangmu',
												url: '/pages/my/publist?state=1'
											},
											{
												name: '待付款',
												icon: 'wodexiangmu-daifukuan',
												num: data.member_info.pub_nopay_count,
												url: '/pages/my/publist?state=10'
											},
											{
												name: '待验收',
												icon: 'wodexiangmu-daiyanshou',
												num:data.member_info.pub_noreceipt_count,
												url: '/pages/my/publist?state=20'
											},
											{
												name: '待评价',
												icon: 'wodexiangmu-daipingjia',
												num:data.member_info.pub_noeval_count,
												url: '/pages/my/publist?state=40'
											}
										]
									},
									{
											name: '我要入驻',
											subclass: 'about-url cc',
											subitem: [{
													name: '厂商入驻',
													icon: 'woyaoruzhu-changshangruzhu',
													url: '/pages/my/join?state=10'
												},
												{
													name: '园林公司入驻',
													icon: 'wodexiangmu-daifukuan',
													url: '/pages/my/join?state=13'
												},
												{
													name: '施工入驻',
													icon: 'woyaoruzhu-shigongruzhu',
													url: '/pages/my/join?state=15'
												},
												{
													name: '维保入驻',
													icon: 'woyaoruzhu-weibaoruzhu',
													url: '/pages/my/join?state=16'
												},
												{
													name: '设计入驻',
													icon: 'woyaoruzhu-shejiruzhu',
													url: '/pages/my/join?state=14'
												},
												{
													name: '风水入驻',
													icon: 'woyaoruzhu-fengshuiruzhu',
													url: '/pages/my/join?state=17'
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
										icon: 'yanzhengma',
										url: '/pages/my/vrorderlist'
									},
									{
										name: '我的资产',
										icon: 'jinbi',
										url: '/pages/my/mypro'
									}, {
										name: '收货地址',
										icon: 'shouhuodizhi',
										url: '/pages/my/addresslist'
									}, {
										name: '我的推广',
										icon: 'yewurenyuanxinxiguanli',
										url: '/pages/invite/index'
									},
									{
										name: '充值卡',
										icon: 'yinhangqia',
										url: '/pages/my/rechargecardlist'
									},
									{
										name: '实名认证',
										icon: 'shimingrenzheng',
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
						uni.setNavigationBarTitle({ title: data.member_info.user_name});
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
							name: '我的财产',
							subclass: 'five-url cc',
							subitem: [{
									name: '预存款',
									icon: 'wodecaichan-yufukuan',
									url: '/pages/web/login'
								},
								{
									name: '充值卡',
									icon: 'wodecaichan-chongzhika',
									url: '/pages/web/login'
								},
								{
									name: '代金券',
									icon: 'wodecaichan-daijinquan',
									url: '/pages/web/login'
								},
								{
									name: '红包',
									icon: 'wodecaichan-hongbao',
									url: '/pages/web/login'
								},
								{
									name: '积分',
									icon: 'wodecaichan-jifen',
									url: '/pages/web/login'
								}
							]
						},
						{
								name: '我的项目',
								subclass: 'five-url cc c4',
								subitem: [{
										name: '我的项目',
										icon: 'wodexiangmu-wodexiangmu',
										url: '/pages/web/login'
									},
									{
										name: '待付款',
										icon: 'wodexiangmu-daifukuan',
										url: '/pages/web/login'
									},
									{
										name: '待验收',
										icon: 'wodexiangmu-daiyanshou',
										url: '/pages/web/login'
									},
									{
										name: '待评价',
										icon: 'wodexiangmu-daipingjia',
										url: '/pages/web/login'
									}
								]
							},
							{
									name: '我要入驻',
									subclass: 'about-url cc',
									subitem: [{
											name: '厂商入驻',
											icon: 'woyaoruzhu-changshangruzhu',
											url: '/pages/my/join?state=10'
										},
										{
											name: '园林公司入驻',
											icon: 'wodexiangmu-daifukuan',
											url: '/pages/my/join?state=13'
										},
										{
											name: '施工入驻',
											icon: 'woyaoruzhu-shigongruzhu',
											url: '/pages/my/join?state=15'
										},
										{
											name: '维保入驻',
											icon: 'woyaoruzhu-weibaoruzhu',
											url: '/pages/my/join?state=16'
										},
										{
											name: '设计入驻',
											icon: 'woyaoruzhu-shejiruzhu',
											url: '/pages/my/join?state=14'
										},
										{
											name: '风水入驻',
											icon: 'woyaoruzhu-fengshuiruzhu',
											url: '/pages/my/join?state=17'
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
								icon: 'yanzhengma',
								url: '/pages/web/login'
							},
							{
								name: '我的资产',
								icon: 'jinbi',
								url: '/pages/web/login'
							},  {
										name: '收货地址',
										icon: 'shouhuodizhi',
										url: '/pages/web/login'
									}, {
										name: '我的推广',
										icon: 'yewurenyuanxinxiguanli',
										url: '/pages/web/login'
									},
									{
										name: '充值卡',
										icon: 'yinhangqia',
										url: '/pages/web/login'
									},
									{
										name: '实名认证',
										icon: 'shimingrenzheng',
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
			if(o.key){
				this.key = o.key;
				uni.setStorageSync('username', o.username);
				uni.setStorageSync('userid', o.userid);
				uni.setStorageSync('key', o.key);
			}else{
				this.key = uni.getStorageSync('key');
			}
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
			// #ifdef APP-PLUS
			let pages = getCurrentPages();  
			let page = pages[pages.length - 1];  
			let currentWebview = page.$getAppWebview();  
			if(uni.getStorageSync('chat_count')){
			  currentWebview.hideTitleNViewButtonRedDot({index:1})
			}else{
			  currentWebview.removeTitleNViewButtonBadge({index:1})
			}
			// #endif

		},
		onPullDownRefresh:function(){
			this.key = uni.getStorageSync('key');
			if (this.key) {
				this.getMember();
			}else{
				this.reMember();
			}
			uni.stopPullDownRefresh();
		},
		onNavigationBarButtonTap:function(e) {
			if(!uni.getStorageSync('key')){
				uni.showModal({
					title: '提示',
					content: '请先登入后操作',
					showCancel: true,
					cancelText: '取消',
					confirmText: '登入',
					success: res => {
						if(res.confirm){
						uni.navigateTo({
							url: '/pages/web/login'
						});	
						}
					}
				});
				return;
			}
			switch (e.index){
				case 0:
				uni.navigateTo({
					url: '/pages/my/account'
				});
					break;
				case 1:
				uni.navigateTo({
					url: '/pages/my/chatlist'
				});
					break;
				default:
				uni.navigateTo({
					url: '/pages/seller/index'
				});
					break;
			}
		}
	}
</script>

<style>
page {	background: #FFFFFF;height: auto; min-height: 100%;}
.member-top { background-color:#03A9F4; text-align: center; width: 100%; overflow: hidden;}
.member-info { width: 100%; height: 300upx;  position: relative;animation: memberInfoDown 1000ms  ease-in; -webkit-animation: memberInfoDown 1000ms ease-in; display: flex; padding: 130upx 28upx 0; box-sizing: border-box;}@keyframes  memberInfoDown{0% { top: -50%;}30% { top: -10%}75% { top: 55%}85% { top: 47%}95% { top: 52%}100% { top: 50%;}}@-webkit-keyframes  memberInfoDown{0% { top: -50%;}30% { top: -10%}75% { top: 55%}85% { top: 47%}95% { top: 52%}100% { top: 50%;}}

.member-info .member-info-collect{width: 100%; display: flex; position: relative; clear: both; }
.member-info .member-info-collect .avatar{width: 120upx; height: 120upx; border-radius:50% ; border: 4upx solid #ffffff;}
.member-info .member-info-collect .member-info-detail{display: flex; flex-direction: column; align-items: flex-start; justify-content: center; margin-left: 30upx;height: 120upx;}
.member-info .member-info-collect .member-info-detail .member-name{display: flex; align-items: center; margin-bottom: 20upx; color: #ffffff; font-size: 36upx;}
.member-info .member-info-collect .member-info-detail .sup{display: flex; align-items: center; color: #ffffff; background: rgba(0,0,0,0.4); padding: 0 15upx; font-size: 24upx; border-radius: 15upx;}
.member-info .member-info-collect .member-id{position: absolute; top: 50upx; right: -28upx; background: rgba(0,0,0,0.6); color: #FFFFFF; padding: 0 15upx; font-size: 24upx; border-radius:15upx 0 0 15upx ;}
.member-info:after{position: absolute;content: '$@#';z-index: 0;top: 150upx;right: 0;display: block;width: 100upx;height: 100upx;line-height: 100upx;vertical-align: middle;transform: rotate(120deg);font-size: 150px;color: #2188b7;opacity: 0.3; }
.member-info:before{position: absolute;content: '\e764';z-index: 0;bottom: -0upx;left: -10px;display: block;width: 100upx;height: 100upx;line-height: 100upx;vertical-align: middle;transform: rotate(0deg);font-size: 750upx; opacity: 0.3;color: #35c0ff;font-family:"wwi-icon"}

.member-collect {height: 130upx;display: flex;}
.member-collect .span { height: 100upx; padding: 20upx 0; display: flex;}
.member-collect .a {width: 33.33%; display: flex; flex-direction: column; align-items: center; justify-content: center;  position: relative; padding-bottom: 0.32rem;}
.member-collect .em {display: block;  width: 100%; text-align: center; font-size: 40upx; line-height: 45upx;  color: #FFFFFF;  font-weight: bold;}
.member-collect .em.wwi-icon{font-size: 40upx; line-height: 45upx;}
.member-collect .p {display: block; width: 100%; text-align: center; font-size: 28upx; color: #FFFFFF;}

.member-center {}
.member-center .dl { background-color: #FFF;margin:0 20upx; border-bottom: 1px solid #F8F8F8;}
.member-center .dl.mt5{margin-top: 10upx;}
.member-center .dt { line-height: 40upx; display: block; height: 40upx; padding: 20upx 0;}
.member-center .dt:last-child { border-bottom: none;}
.member-center .dt .a { display: block;}
.member-center .dt .h3 { font-size: 30upx; color: #222; vertical-align: top; display: inline-block;font-weight: bold;}
.member-center .dt .h5 { font-size: 24upx; color: #999; float: right; display: flex; align-items: center;}
.member-center .dt .h5 .wwi-icon{display: inline-block; vertical-align: middle;}
.member-center .dd { 	display: flex;flex-direction: row;flex-wrap: wrap;padding: 10upx 0;}
.member-center .dd .li {display: flex;flex-direction: column; align-items: center; justify-content: center; width: 20%; padding: 0 0 20upx 0;}
.member-center .dd .li .p { font-size: 26upx; color: #888;}
.member-center .dd.five-url .wwi-icon{font-size: 60upx;  color: #03A9F4; position: relative;}
.member-center .dd.five-url .wwi-icon .em{background: #03A9F4; position: absolute; font-size: 24upx; height: 16upx; display: flex; justify-content: center; align-items: center; color: #fff; top: 0; right: -10upx; border-radius:50% ; padding: 8upx;}
.member-center .dd.two-url .wwi-icon{font-size: 60upx;padding: 10upx; color: #FFFFFF; background: var(--gradualOrange); position: absolute; left: 30upx; z-index: 1; border-radius:50% ; width: 80upx; height: 80upx; display: flex; justify-content: center; align-items: center;}
.member-center .dd.two-url .li.m1 .wwi-icon{background: var(--gradualGreen);}
.member-center .dd.two-url .li .p{color: #222222;}
.member-center .dd.two-url .li .p,.member-center .dd.two-url .li .pp{margin-left: 80upx;display: flex; justify-content: flex-start;}
.member-center .dd.two-url .li .pp{font-size: 24upx; color: #888888;}
.member-center .dd.two-url .li{width: 50%; position: relative; height: 120upx;}
.member-center .dd.all-url .li{width: 25%;}
.member-center .dd.all-url .wwi-icon{font-size: 60upx; line-height: 1.45em; color: #FF0036;}
.member-center .dd.all-url .li.m0 .wwi-icon{color: var(--yellow);}
.member-center .dd.all-url .li.m1 .wwi-icon{color: var(--olive);}
.member-center .dd.all-url .li.m2 .wwi-icon{color: var(--green);}
.member-center .dd.all-url .li.m3 .wwi-icon{color: var(--cyan);}
.member-center .dd.all-url .li.m4 .wwi-icon{color: var(--red);}
.member-center .dd.all-url .li.m5 .wwi-icon{color: var(--cyan);}
.member-center .dd.all-url .li.m6 .wwi-icon{color: var(--orange);}
.member-center .dd.all-url .li.m7 .wwi-icon{color: var(--blue);}
.member-center .dd.about-url .li{width: 33.33%;}
.member-center .dd.about-url.cc .li{border: 1px solid #F8F8F8; box-sizing: border-box; margin:0 0 20upx 20upx; border-radius:15upx ; padding: 20upx; width: 223.33upx;}
.member-center .dd.about-url.cc .li.m0,.member-center .dd.about-url.cc .li.m3{margin-left: 0;}
.member-center .dd.about-url.cc .li .wwi-icon{ background: #a8ef43; color: #FFFFFF; width: 80upx; height: 80upx ; border-radius: 100upx; display: flex; justify-content: center; align-items: center;}
.member-center .dd.about-url.cc .li.m1 .wwi-icon{background: #ff6880;}
.member-center .dd.about-url.cc .li.m2 .wwi-icon{background: #26e8c8;}
.member-center .dd.about-url.cc .li.m3 .wwi-icon{background: #f5d511;}
.member-center .dd.about-url.cc .li.m4 .wwi-icon{background: #fb77dc;}
.member-center .dd.about-url.cc .li.m5 .wwi-icon{background: #11a6ff;}
.member-center .dd.five-url.cc .li.m0 .wwi-icon{color: #e72024;}
.member-center .dd.five-url.cc .li.m1 .wwi-icon{color: #eab323;}
.member-center .dd.five-url.cc .li.m2 .wwi-icon{color: #583d8d;}
.member-center .dd.five-url.cc .li.m3 .wwi-icon{color: #d61b59;}
.member-center .dd.five-url.cc .li.m4 .wwi-icon{color: #c1d21d;}
.member-center .dd.five-url.cc .wwi-icon .em{background: #2cb476;}
.member-center .dd.five-url.c4 .li{width: 25%;}
</style> 
