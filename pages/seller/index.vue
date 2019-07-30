<template>
	<view class="newBody">
		<view class="member-top">
			<view class="member-info">
				<navigator class="member-info-collect" :url="userUrl">
					<image class="avatar" :src="userImg"></image>
					<view class="member-info-detail"><text class="member-name">{{userName}}</text>
						<view class="sup">{{userSup}}</view>
					</view>
					<view class="member-id">店名:{{userId}}</view>
				</navigator>
				<image src="http://shopwwig.oss-cn-shanghai.aliyuncs.com/app-icon-walf.gif" class="wave-gif" mode=""></image>
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
				userUrl:'/pages/seller/login',
				userImg: '../static/member_w.png',
				key: '',
				favoriteList: [],
				isLogin: ''
			}
		},
		methods: {
			getMember() {
				this.wwiopt({
					url: '/index.php?app=seller_index',
					method: 'POST',
					data: {
						key: this.key
					},
					dataType: 'json',
					success: res => {
						var data = res.data.datas;
						this.checksellerLogin(res.data.login);
						this.viewList = [{
								name: '我的订单',
								sname: '查看全部订单',
								url: '/pages/seller/order',
								subclass: 'five-url',
								subitem: [{
										name: '待付款',
										icon: 'qianbao',
										num:data.statics.payment,
										url: '/pages/seller/order?state=state_new'
									},
									{
										name: '待发货',
										icon: 'shouhuo',
										num:data.statics.delivery,
										url: '/pages/seller/order?state=state_pay'
									},
									{
										name: '待收货',
										icon: 'daitihuo',
										num:data.statics.receipt,
										url: '/pages/seller/order?state=state_send'
									},
									{
										name: '已完成',
										icon: 'gouwudai',
										url: '/pages/seller/order?state=state_success'
									},
									{
										name: '已取消',
										icon: 'tingzhi',
										url: '/pages/seller/order?state=state_cancel'
									}
								]
							},
							{
								name: '商品管理',
								sname: '查看全部商品',
								url: '/pages/seller/goodslist',
								subclass: 'all-url',
								subitem: [{
										name: '出售中',
										icon: 'gouwu',
										url: '/pages/seller/goodslist'
									},
									{
										name: '仓库中',
										icon: 'daohang',
										url: '/pages/seller/goodslist?state=offline'
									},
									{
										name: '违规商品',
										icon: 'guanyu',
										url: '/pages/seller/goodslist?state=lockup'
									},
									{
										name: '发布商品',
										icon: 'daipingjia',
										url: '/pages/seller/aegoods'
									}
								]
							},
							{
								name: '投标中心',
								subclass: 'all-url',
								subitem: [{
										name: '投标列表',
										icon: 'wodexiangmu-wodexiangmu',
										num: data.statics.toubiaonum,
										url: '/pages/seller/tblist?state=1'
									},
									{
										name: '已投标',
										icon: 'toubiaozhongxin-yitoubiaozhongxin',
										num: data.statics.oktoubiaonum,
										url: '/pages/seller/tblist?state=2'
									},
									{
										name: '交付中',
										icon: 'toubiaozhongxin-jiaofuzhongdexiangmu',
										num: data.statics.jiaofunum,
										url: '/pages/seller/tblist?state=3'
									},
									{
										name: '评价',
										icon: 'toubiaozhongxin-pingjiazhongxin',
										num: data.statics.pingjianum,
										url: '/pages/seller/tblist?state=4'
									}
								]
							},
							{
								name: '快捷导航',
								sname: '',
								url: '#',
								subclass: 'all-url',
								subitem: [{
										name: '商家设置',
										icon: 'quanjushezhi',
										url: '/pages/seller/account'
									}, {
										name: '结算管理',
										icon: 'qiaquan',
										url: '/pages/seller/bill'
									},
									{
										name: '兑码订单',
										icon: 'yanzhengma',
										url: '/pages/seller/vrorder'
									},
									{
										name: '兑码验证',
										icon: 'erweima',
										url: '/pages/seller/vrchange'
									}, {
										name: '发货地址',
										icon: 'shouhuodizhi',
										url: '/pages/seller/address'
									}, {
										name: '物流管理',
										icon: 'huojianjiasu',
										url: '/pages/seller/express'
									},
									{
										name: '兑码结算',
										icon: 'yinhangqia',
										url: '/pages/seller/vrbill'
									},
									{
										name: '发布案例',
										icon: 'tupian',
										url: '/pages/seller/picadd'
									}

								]
							}
						];
						this.userName = data.seller_info.seller_name;
						this.userSup = data.store_info.grade_name;
						this.userImg = data.store_info.store_avatar;
						this.userId = data.store_info.store_name;
						this.userUrl='/pages/my/account';
						this.favoriteList = [
							{
								name: '昨日销量',
								num: data.store_info.daily_sales.ordernum,
								url: '/pages/seller/order'
							}, {
								name: '当月销量',
								num: data.store_info.monthly_sales.ordernum,
								url: '/pages/seller/order'
							},
							{
								name: '出售中',
								num: 0,
								url: '/pages/seller/goodslist'
							}
						]

					}
				});
			},
			reMember(){
				this.viewList= [{
						name: '我的订单',
						sname: '查看全部订单',
						url: '/pages/seller/login',
						subclass: 'five-url',
						subitem: [{
								name: '待付款',
								icon: 'qianbao',
								url: '/pages/seller/login'
							},
							{
								name: '待发货',
								icon: 'shouhuo',
								url: '/pages/seller/login'
							},
							{
								name: '待收货',
								icon: 'daitihuo',
								url: '/pages/seller/login'
							},
							{
								name: '已完成',
								icon: 'gouwudai',
								url: '/pages/seller/login'
							},
							{
								name: '已取消',
								icon: 'tingzhi',
								url: '/pages/seller/login'
							}
						]
					},
					{
						name: '商品管理',
						sname: '查看全部商品',
						url: '/pages/seller/login',
						subclass: 'all-url',
						subitem: [{
								name: '出售中',
								icon: 'gouwu',
								url: '/pages/seller/login'
							},
							{
								name: '仓库中',
								icon: 'daohang',
								url: '/pages/seller/login'
							},
							{
								name: '违规商品',
								icon: 'guanyu',
								url: '/pages/seller/login'
							},
							{
								name: '发布商品',
								icon: 'daipingjia',
								url: '/pages/seller/login'
							}
						]
					},
							{
								name: '投标中心',
								subclass: 'all-url',
								subitem: [{
										name: '投标列表',
										icon: 'wodexiangmu-wodexiangmu',
										url: '/pages/seller/login'
									},
									{
										name: '已投标',
										icon: 'toubiaozhongxin-yitoubiaozhongxin',
										url: '/pages/seller/login'
									},
									{
										name: '交付中',
										icon: 'toubiaozhongxin-jiaofuzhongdexiangmu',
										url: '/pages/seller/login'
									},
									{
										name: '评价',
										icon: 'toubiaozhongxin-pingjiazhongxin',
										url: '/pages/seller/login'
									}
								]
							},
					{
						name: '快捷导航',
						sname: '',
						url: '#',
						subclass: 'all-url',
						subitem: [{
								name: '商家设置',
								icon: 'quanjushezhi',
								url: '/pages/seller/login'
							}, {
								name: '结算管理',
								icon: 'qiaquan',
								url: '/pages/seller/login'
							},
							{
								name: '兑码订单',
								icon: 'yanzhengma',
								url: '/pages/seller/login'
							},
							{
								name: '兑码验证',
								icon: 'erweima',
								url: '/pages/seller/login'
							},  {
								name: '发货地址',
								icon: 'shouhuodizhi',
								url: '/pages/seller/login'
							}, {
								name: '物流管理',
								icon: 'huojianjiasu',
								url: '/pages/seller/login'
							},
							{
								name: '兑码结算',
								icon: 'yinhangqia',
								url: '/pages/seller/login'
							}

						]
					}
				];
				this.userName = '点击登入';
				this.userSup= '默认等级';
				this.userImg= '../../static/member_w.png';
				this.key= '';
				this.userId='官方店铺';
				this.userUrl='/pages/seller/login';
				this.favoriteList= [{
						name: '昨日销量',
						num: 0,
						url: '/pages/seller/login'
					}, {
						name: '当月销量',
						num: 0,
						url: '/pages/seller/login'
					},
					{
						name: '出售中',
						num: 0,
						url: '/pages/seller/login'
					}];
				this.isLogin= '';
			}
		},
		onLoad: function(o) {
			if(o.key){
				this.key = o.key;
				uni.setStorageSync('seller_name', o.seller_name);
				uni.setStorageSync('store_name', o.store_name);
				uni.setStorageSync('seller_key', o.key);
			}else{
				this.key = uni.getStorageSync('seller_key');
			}
		},
		onShow:function(){
			this.key = uni.getStorageSync('seller_key');
			if (this.key) {
				this.getMember();
			}else{
				this.reMember();
			}
			// #ifdef H5
			document.title = '商家中心-'+this.siteTitle;
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
			this.key = uni.getStorageSync('seller_key');
			if (this.key) {
				this.getMember();
			}else{
				this.reMember();
			}
			uni.stopPullDownRefresh();
		},
		onNavigationBarButtonTap:function(e) {
			if(!uni.getStorageSync('seller_key') && e.index < 2){
				uni.showModal({
					title: '提示',
					content: '请先登入后操作',
					showCancel: true,
					cancelText: '取消',
					confirmText: '登入',
					success: res => {
						if(res.confirm){
						uni.navigateTo({
							url: '/pages/seller/login'
						});	
						}
					}
				});
				return;
			}
			switch (e.index){
				case 0:
				uni.navigateTo({
					url: '/pages/seller/account'
				});
					break;
				case 1:
				uni.navigateTo({
					url: '/pages/seller/chatlist'
				});
					break;
				case 2:
				uni.navigateBack();
					break;
			}
		}
	}
</script>

<style>
page {	background: #F8F8F8;height: auto; min-height: 100%;}
/*我的商城*/
.member-top { background-color:#FFFFFF; text-align: center; width: 100%;}
.member-info:before {}
.member-info { width: 100%; height: 300upx;  position: relative; background: #00BCD4; animation: memberInfoDown 1000ms  ease-in; -webkit-animation: memberInfoDown 1000ms ease-in; display: flex; padding: 80upx 28upx 0; box-sizing: border-box;}@keyframes  memberInfoDown{0% { top: -50%;}30% { top: -10%}75% { top: 55%}85% { top: 47%}95% { top: 52%}100% { top: 50%;}}@-webkit-keyframes  memberInfoDown{0% { top: -50%;}30% { top: -10%}75% { top: 55%}85% { top: 47%}95% { top: 52%}100% { top: 50%;}}

.member-info .member-info-collect{width: 100%; display: flex; position: relative; clear: both; }
.member-info .member-info-collect .avatar{width: 120upx; height: 120upx; border-radius:50% ; border: 4upx solid #ffffff;}
.member-info .member-info-collect .member-info-detail{display: flex; flex-direction: column; align-items: flex-start; justify-content: center; margin-left: 30upx;height: 120upx;}
.member-info .member-info-collect .member-info-detail .member-name{display: flex; align-items: center; margin-bottom: 20upx; color: #ffffff; font-size: 36upx;}
.member-info .member-info-collect .member-info-detail .sup{display: flex; align-items: center; color: #ffffff; background: rgba(0,0,0,0.4); padding: 0 15upx; font-size: 24upx; border-radius: 15upx;}
.member-info .member-info-collect .member-id{position: absolute; top: 50upx; right: -28upx; background: rgba(0,0,0,0.6); color: #FFFFFF; padding: 0 15upx; font-size: 24upx; border-radius:15upx 0 0 15upx ;}
.member-collect {height: 130upx;background:#FFFFFF;display: flex;}
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
.member-center .dd.five-url .wwi-icon{font-size: 60upx;  color: #02bcd4; position: relative;}
.member-center .dd.five-url .wwi-icon .em{background: #02bcd4; position: absolute; font-size: 24upx; height: 16upx; display: flex; justify-content: center; align-items: center; color: #fff; top: 0; right: -10upx; border-radius:50% ; padding: 8upx;}
.member-center .dd.two-url .wwi-icon{font-size: 60upx;padding: 10upx; color: #FFFFFF; background-color: #f44336; position: absolute; left: 30upx; z-index: 1; border-radius:50% ; width: 80upx; height: 80upx; display: flex; justify-content: center; align-items: center;}
.member-center .dd.two-url .li.m1 .wwi-icon{background-color: #03a9f4;}
.member-center .dd.two-url .li .p{color: #222222;}
.member-center .dd.two-url .li .p,.member-center .dd.two-url .li .pp{margin-left: 80upx;display: flex; justify-content: flex-start;}
.member-center .dd.two-url .li .pp{font-size: 24upx; color: #888888;}
.member-center .dd.two-url .li{width: 50%; position: relative; height: 120upx;}
.member-center .dd.all-url .li{width: 25%;}
.member-center .dd.all-url .wwi-icon{font-size: 60upx; line-height: 1.45em; color: #FF0036; position: relative;}
.member-center .dd.all-url .wwi-icon .em{background: #2CB476; position: absolute; font-size: 24upx; height: 16upx; display: flex; justify-content: center; align-items: center; color: #fff; top: 0; right: -10upx; border-radius:50% ; padding: 8upx;}
.member-center .dd.all-url .li.m0 .wwi-icon{color: #f44336;}
.member-center .dd.all-url .li.m1 .wwi-icon{color: #ffc107;}
.member-center .dd.all-url .li.m2 .wwi-icon{color: #673ab7;}
.member-center .dd.all-url .li.m3 .wwi-icon{color: #e91e63;}
.member-center .dd.all-url .li.m4 .wwi-icon{color: #cddc39;}
.member-center .dd.all-url .li.m5 .wwi-icon{color: #1AAD19;}
.member-center .dd.all-url .li.m7 .wwi-icon{color: #009688;}
.member-center .dd.all-url .li.m8 .wwi-icon{color: #1AAD19;}
.member-center .dd.about-url .li{width: 33.33%;}
</style> 
