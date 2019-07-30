<template>
	<view class="index-t maxBody newBody">
		<!-- #ifdef MP-WEIXIN -->
		<uni-nav-bar
			color="#ffffff"
			:status-bar="true"
			:background-color="titleBg"
			search-tsok="true"
			@click-search="goSearch"
			disabled="true"
			:placeholder="goKey"
			shadow="false"
			hasShadow="true"
			fixed="true"
			leftIcon="saoyisao"
			:leftColor="leftColor"
			rightIcon="wangwang"
			:rightColor="rightColor"
			@clickLeft="scanCode"
			@clickRight="clickRight"
			:rightSup="rightSup"
		></uni-nav-bar>

		<!-- #endif -->

		<view class="titlemask"></view>
		<block v-for="(item, vv) in info" :key="vv">
			<swiper class="adv_list" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" v-if="item.adv_list">
				<swiper-item v-for="(pic, k) in item.adv_list.item" :key="k">
					<navigator :url="pic.url" class="swiper-item"><image :src="pic.image" mode="widthFix" lazy-load></image></navigator>
				</swiper-item>
			</swiper>
		</block>
		<view class="wwi-icon-list flex flexrow">
			<navigator url="/pages/service" open-type="switchTab" class="li">
				<view class="wwi-icon s1"><image src="https://static.qianmeng1688.com/app/index-ico1.png" mode="widthFix"></image></view>
				<view class="span">找产品</view>
			</navigator>
			<navigator url="/pages/web/searchstore" class="li">
				<view class="wwi-icon s2"><image src="https://static.qianmeng1688.com/app/index-ico2.png" mode="widthFix"></image></view>
				<view class="span">找设计</view>
			</navigator>
			<navigator class="li" url="/pages/web/activity">
				<view class="wwi-icon s3"><image src="https://static.qianmeng1688.com/app/index-ico3.png" mode="widthFix"></image></view>
				<view class="span">找施工</view>
			</navigator>
			<navigator class="li" url="/pages/web/tzx">
				<view class="wwi-icon s4"><image src="https://static.qianmeng1688.com/app/index-ico4.png" mode="widthFix"></image></view>
				<view class="span">找维保</view>
			</navigator>
			<navigator class="li" url="/pages/web/spikelist">
				<view class="wwi-icon s5"><image src="https://static.qianmeng1688.com/app/index-ico5.png" mode="widthFix"></image></view>
				<view class="span">风水师</view>
			</navigator>
			<navigator class="li" url="/pages/web/gallery">
				<view class="wwi-icon s6"><image src="https://static.qianmeng1688.com/app/index-ico6.png" mode="widthFix"></image></view>
				<view class="span">案例中心</view>
			</navigator>
			<navigator class="li" url="/pages/trading" open-type="switchTab">
				<view class="wwi-icon s7"><image src="https://static.qianmeng1688.com/app/index-ico7.png" mode="widthFix"></image></view>
				<view class="span">交易中心</view>
			</navigator>
			<navigator url="/pages/web/flashlist" class="li">
				<view class="wwi-icon s8"><image src="https://static.qianmeng1688.com/app/index-ico8.png" mode="widthFix"></image></view>
				<view class="span">线下门店</view>
			</navigator>
			<navigator url="/pages/my/join" class="li">
				<view class="wwi-icon s9"><image src="https://static.qianmeng1688.com/app/index-ico9.png" mode="widthFix"></image></view>
				<view class="span">招商加盟</view>
			</navigator>
			<navigator url="/pages/web/tzx" class="li">
				<view class="wwi-icon s10"><image src="https://static.qianmeng1688.com/app/index-ico10.png" mode="widthFix"></image></view>
				<view class="span">行业新闻</view>
			</navigator>
		</view>
		<view class="wwi-index-kuaibao flex flexrow">
			<view class="title flex flexrow">
				交易快报
				<view class="wwi-icon wwi-icon-laba"></view>
			</view>
			<swiper class="info" :circular="true" :vertical="true" :autoplay="true" :duration="3000">
				<swiper-item>
					<navigator url="#" class="item flex flexrow">
						<view class="oauth">湖南绿广景观</view>
						<view class="news-content flex flexrow">接单接单成功了</view>
					</navigator>
				</swiper-item>
				<swiper-item>
					<navigator url="#" class="item flex flexrow">
						<view class="oauth">湖南绿广景观</view>
						<view class="news-content flex flexrow">接单接单成功了</view>
					</navigator>
				</swiper-item>
			</swiper>
		</view>
		<view class="wwi-index-fbxq">
			<view class="title">免费发布需求 官方推荐优质服务商</view>
			<form @submit="fabuSubmit">
				<view class="section"><input name="title" type="text" placeholder="我需要" /></view>
				<view class="section mt10"><input name="phone" type="number" maxlength="11" placeholder="手机号" /></view>
				<button formType="submit" class="submit">马上为我推荐</button>
			</form>
		</view>
		<view class="wwi-index-tit flex flexJcs">
			<view class="h3">经典案例</view>
			<navigator url="/pages/web/gallery" class="more flex flexrow">
				更多
				<view class="wwi-icon wwi-icon-xuanzeqixiayige"></view>
			</navigator>
		</view>
		<block v-for="(item, vv) in info" :key="vv" v-if="item.hot_picture_list">
			<view class="wwi-index-anli">
				<scroll-view class="list-main" scroll-x>
					<view class="li" v-for="(pic, kkk) in item.hot_picture_list" :key="kkk">
						<navigator url="/pages/web/case">
							<image :src="pic.picture_image" mode="" class="img"></image>
							<view class="tit">{{ pic.picture_title }}</view>
						</navigator>
					</view>
				</scroll-view>
			</view>
		</block>
		<view class="wwi-index-tit flex flexJcs"><view class="h3">快捷工具</view></view>
		<view class="wwi-index-kjgj flex flexrow">
			<view class="li">
				<view class="wwi-icon wwi-icon-zaojiayusuan flex flexAic flexJcc" style="font-size: 42upx;"></view>
				<view class="tit flex flexJcc flexAic">造价预算</view>
			</view>
			<view class="li">
				<view class="wwi-icon wwi-icon-jishuzixun flex flexAic flexJcc"></view>
				<view class="tit flex flexJcc flexAic">技术咨询</view>
			</view>
			<view class="li">
				<view class="wwi-icon wwi-icon-gongjiagusuan flex flexAic flexJcc"></view>
				<view class="tit flex flexJcc flexAic">工价估算</view>
			</view>
			<view class="li">
				<view class="wwi-icon wwi-icon-xiangmuzixun flex flexAic flexJcc"></view>
				<view class="tit flex flexJcc flexAic">项目咨询</view>
			</view>
			<view class="li">
				<view class="wwi-icon wwi-icon-shangwuhezuo flex flexAic flexJcc"></view>
				<view class="tit flex flexJcc flexAic">商务合作</view>
			</view>
		</view>
		<!-- 		<view class="wwi-index-gg flex flexrow">
			<view class="title cu-tag light bg-green">商城公告
			</view>
			
			<view class="news-content">
				<swiper class="info bg-olive light" :circular="true" :vertical="true" :autoplay="true" :duration="3000" v-if="msgList.length > 0">
					<swiper-item v-for="(item,v3) in msgList" :key="v3">
						<navigator :url="'/pages/web/tourl?url=' + item.article_url" v-if="item.article_url" class="swiper-item">{{item.article_title}}</navigator>
						<navigator :url="'/pages/web/newsinfo?newid=' + item.article_id" v-else="" class="swiper-item">{{item.article_title}}</navigator>
					</swiper-item>
				</swiper>
			</view>
			<navigator url="/pages/web/question" class="more cu-tag light bg-green">更多</navigator>
		</view> -->
		<block v-for="(item, v) in info" :key="v">
			<view class="wwiapp-home-block flex flexcol" v-if="item.home1">
				<view class="tit-bar" v-if="item.home1.title">{{ item.home1.title }}</view>
				<navigator :url="item.home1.url" class="item-pic"><image :src="item.home1.image" mode="widthFix" lazy-load></image></navigator>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home2">
				<view class="tit-bar" v-if="item.home2.title">{{ item.home2.title }}</view>
				<view class="item-r2 flex flexrow">
					<navigator :url="item.home2.square_url" class="li"><image :src="item.home2.square_image" lazy-load></image></navigator>
					<view class="li border-left flex flexcol">
						<navigator :url="item.home2.rectangle1_url" class="span border-bottom"><image :src="item.home2.rectangle1_image" mode="" lazy-load></image></navigator>
						<navigator :url="item.home2.rectangle2_url" class="span"><image :src="item.home2.rectangle2_image" mode="" lazy-load></image></navigator>
					</view>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home3">
				<view class="tit-bar" v-if="item.home3.title">{{ item.home3.title }}</view>
				<view class="item-pic-list flex flexrow">
					<navigator :url="pic.url" class="li" v-for="(pic, s) in item.home3.item" :key="s"><image :src="pic.image" mode="widthFix" lazy-load></image></navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home4">
				<view class="tit-bar" v-if="item.home4.title">{{ item.home4.title }}</view>
				<view class="item-r2 flex flexrow">
					<view class="li flex flexcol">
						<navigator :url="item.home4.rectangle1_url" class="span border-bottom"><image :src="item.home4.rectangle1_image" mode="" lazy-load></image></navigator>
						<navigator :url="item.home4.rectangle2_url" class="span"><image :src="item.home4.rectangle2_image" mode="" lazy-load></image></navigator>
					</view>
					<navigator :url="item.home4.square_url" class="li border-left"><image :src="item.home4.square_image" lazy-load></image></navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home5">
				<view class="title flex flexrow">
					<image :src="item.home5.lcurl" lazy-load></image>
					<view class="span">{{ item.home5.title }}</view>
					<view class="stit">{{ item.home5.stitle }}</view>
				</view>
				<view class="item-r2 flex flexrow">
					<navigator :url="item.home5.square_url" class="li"><image :src="item.home5.square_image"></image></navigator>
					<view class="li border-left">
						<navigator :url="item.home5.rectangle1_url" class="span"><image :src="item.home5.rectangle1_image" mode="" lazy-load></image></navigator>
						<view class="spanTwo flex flexrow">
							<navigator :url="item.home5.rectangle2_url" class="item-con"><image :src="item.home5.rectangle2_image" mode="" lazy-load></image></navigator>
							<navigator :url="item.home5.rectangle3_url" class="item-con"><image :src="item.home5.rectangle3_image" mode="" lazy-load></image></navigator>
						</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.goods">
				<view class="tit-bar" v-if="item.goods.title">{{ item.goods.title }}</view>
				<view class="goods-list flex flexrow">
					<navigator :url="'/pages/web/item?goodsid=' + goods.goods_id" class="li" v-for="(goods, k2) in item.goods.item" :key="k2">
						<view class="image"><image :src="goods.goods_image" mode="widthFix" lazy-load></image></view>
						<view class="goods-info">
							<view class="goods-title">{{ goods.goods_name }}</view>
							<view class="goods-price">￥{{ goods.goods_promotion_price }}</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol xianshi" v-if="item.goods1">
				<view class="tit-xianshi" v-if="item.goods1.title">{{ item.goods1.title }}</view>
				<view class="sale-goods-list ">
					<scroll-view class="list-main" scroll-x>
						<navigator :url="'/pages/web/item?goodsid=' + goods.goods_id" class="li" v-for="(goods, k4) in item.goods1.item" :key="k4">
							<view class="image"><image :src="goods.goods_image" mode="widthFix" lazy-load></image></view>
							<view class="goods-info flex flexcol">
								<view class="goods-title">{{ goods.goods_name }}</view>
								<view class="goods-sale flex flexrow">
									<view class="light cu-tag bg-orange round">限时</view>
									<view class="cu-tag light bg-pink round">￥{{ goods.goods_promotion_price }}</view>
								</view>
							</view>
						</navigator>
					</scroll-view>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.goods2">
				<view class="tit-bar" v-if="item.goods2.title">{{ item.goods2.title }}</view>
				<view class="sale-goods-list">
					<scroll-view class="list-main" scroll-x>
						<navigator :url="'/pages/web/item?goodsid=' + goods.goods_id" class="li" v-for="(goods, k3) in item.goods2.item" :key="k3">
							<view class="image"><image :src="goods.goods_image" mode="widthFix" lazy-load></image></view>
							<view class="goods-info">
								<view class="goods-title">{{ goods.goods_name }}</view>
								<view class="goods-price">￥{{ goods.goods_promotion_price }}</view>
							</view>
						</navigator>
					</scroll-view>
				</view>
			</view>
		</block>
		<view class="wwi-index-tab">
			<scroll-view class="tab flex flexrow" scroll-x>
				<view class="li" :class="{ ok: menuId == 0 }" @tap="changeLikemenu(0)">猜你喜欢</view>
				<view class="li" :class="{ ok: menuId == item.class_id }" @tap="changeLikemenu(item.class_id)" v-for="item in likeClass" :key="item.class_id">
					{{ item.menu_title }}
				</view>
			</scroll-view>
		</view>
		<view class="wwi-index-list-wrap">
			<block v-if="menuId == 0">
				<navigator :url="'/pages/web/item?goodsid=' + item.goods_id" class="li" v-for="item in likeList" :key="item.goods_id">
					<view class="hd flex flexrow flexAic">
						<image :src="item.goods_image" mode="" class="img"></image>
						<view class="title">{{ item.store_name }}</view>
					</view>
					<view class="cd flex flexrow">
						<view class="tip">{{ item.store_type }}</view>
						<view class="flex flexrow">
							案例数
							<view class="num">{{ item.picture_sum }}</view>
							| 商品数
							<view class="num">{{ item.goods_sum }}</view>
						</view>
					</view>
					<view class="bd flex flexrow">
						<view class="goods-img"><image :src="item.goods_image" mode=""></image></view>
						<view class="goods-info">
							<view class="goods-name">{{ item.goods_name }}</view>
							<view class="goods-late">成交量 {{ item.goods_salenum }} | 评分 {{ item.evaluation_good_star }}</view>
						</view>
					</view>
				</navigator>
			</block>
			<block v-else="">
				<navigator :url="'/pages/web/jstore?storeId=' + item.store_id" class="li" v-for="item in likeList" :key="item.store_id">
					<view class="hd flex flexrow flexAic">
						<image :src="item.goods_image" mode="" class="img"></image>
						<view class="title">{{ item.store_name }}</view>
					</view>
					<view class="cd flex flexrow">
						<view class="tip">{{ item.store_type }}</view>
						<view class="flex flexrow">
							案例数
							<view class="num">{{ item.picture_sum }}</view>
							| 商品数
							<view class="num">{{ item.goods_sum }}</view>
						</view>
					</view>
					<view class="bd flex flexrow">
						<view class="goods-img"><image :src="item.goods_image" mode=""></image></view>
						<view class="goods-info">
							<view class="goods-name">{{ item.goods_name }}</view>
							<view class="goods-late">成交量 {{ item.goods_salenum }} | 评分 {{ item.evaluation_good_star }}</view>
						</view>
					</view>
				</navigator>
			</block>
		</view>
		<view class="bottom-now">我是有底线的</view>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar.vue';
export default {
	data() {
		return {
			info: [],
			goKey: '',
			msgList: [],
			titleBg: 'rgba(3,169,244,0)',
			rightColor: '#ffffff',
			leftColor: '#ffffff',
			key: '',
			rightSup: '0',
			hasSetBg: false,
			menuId: 0,
			likeList: [],
			likeClass: []
		};
	},
	components: {
		uniNavBar
	},
	methods: {
		Inlimine() {
			this.wwiopt({
				url: '/index.php?app=index',
				success: res => {
					res.data.datas.forEach((k, v) => {
						for (let kk in k) {
							switch (kk) {
								case 'adv_list':
									k.adv_list.item.forEach(item => {
										item.url = this.buildUrl(item.type, item.data);
									});
									break;
								case 'home3':
									k.home3.item.forEach(item => {
										item.url = this.buildUrl(item.type, item.data);
									});
									break;
								case 'home1':
									k.home1.url = this.buildUrl(k.home1.type, k.home1.data);
									break;
								case 'home4':
									k.home4.square_url = this.buildUrl(k.home4.square_type, k.home4.square_data);
									k.home4.rectangle1_url = this.buildUrl(k.home4.rectangle1_type, k.home4.rectangle1_data);
									k.home4.rectangle2_url = this.buildUrl(k.home4.rectangle2_type, k.home4.rectangle2_data);
									break;
								case 'home2':
									k.home2.square_url = this.buildUrl(k.home2.square_type, k.home2.square_data);
									k.home2.rectangle1_url = this.buildUrl(k.home2.rectangle1_type, k.home2.rectangle1_data);
									k.home2.rectangle2_url = this.buildUrl(k.home2.rectangle2_type, k.home2.rectangle2_data);
									break;
								case 'home5':
									k.home5.square_url = this.buildUrl(k.home5.square_type, k.home5.square_data);
									k.home5.rectangle1_url = this.buildUrl(k.home5.rectangle1_type, k.home5.rectangle1_data);
									k.home5.rectangle2_url = this.buildUrl(k.home5.rectangle2_type, k.home5.rectangle2_data);
									k.home5.rectangle3_url = this.buildUrl(k.home5.rectangle3_type, k.home5.rectangle3_data);
									break;
							}
						}
					});
					this.info = res.data.datas;
					uni.stopPullDownRefresh();
				}
			});
			this.wwiopt({
				url: '/index.php?app=index&wwi=getgg',
				success: res => {
					this.msgList = res.data.datas.notice.list;
					console.log(this.msgList);
				}
			});
		},
		getLikeList: function() {
			uni.request({
				url: this.ApiUrl + '/index.php?app=index&wwi=get_store',
				data: { class_id: this.menuId },
				success: res => {
					this.likeClass = res.data.datas.class_list;
					this.likeList = res.data.datas.store_list;
				}
			});
		},
		changeLikemenu: function(e) {
			if (this.menuId == e) {
				return false;
			}
			this.menuId = e;
			this.getLikeList();
		},
		buildUrl: function(type, data) {
			switch (type) {
				case 'keyword':
					return '/pages/web/glist?keyword=' + encodeURIComponent(data);
				case 'special':
					return '/pages/web/special?speid=' + data;
				case 'goods':
					return '/pages/web/item?goodsid=' + data;
				case 'lottery':
					return '/pages/web/lottery?lotid=' + data;
				case 'redpacket':
					return '/pages/web/redpacket?rptid=' + data;
				case 'url':
					return '/pages/web/tourl?url=' + data;
			}
			//return '/pages/web/toUrl/toUrl?url=' + this.WapSiteUrl;
		},
		goSearch() {
			uni.navigateTo({
				url: '/pages/web/search'
			});
		},
		scanCode: function() {
			var that = this;
			uni.scanCode({
				success: function(res) {
					var result = res.result;

					if (result.indexOf('http://') == 0 || result.indexOf('https://') == 0) {
						var invite = that.request(result, 'invite');
						var goodsid = that.request(result, 'goodsid');
						goodsid = that.request(result, 'goods_id');
						var storeid = that.request(result, 'storeid');
						storeid = that.request(result, 'store_id');
						var fid = that.request(result, 'fid');
						if (invite) {
							uni.setStorageSync('invite', invite);
						}
						if (goodsid) {
							var url = '/pages/web/item?goodsid=' + goodsid;
							if (fid) {
								url += '&fid=' + fid;
							}
							uni.navigateTo({
								url: url
							});
							return;
						}
						if (result.indexOf('http://weixin.qq.com/q/') == 0) {
							if (!that.key) {
								uni.showModal({
									title: '提示',
									content: '请登入后重试',
									showCancel: false,
									success: res => {
										uni.navigateTo({
											url: '/pages/web/login'
										});
									}
								});
								return;
							}
							that.wwiopt({
								url: '/index.php?app=member_index&wwi=goLogin',
								method: 'POST',
								data: {
									key: that.key,
									type: 1,
									smUrl: result
								},
								success: res => {
									if (res.data.datas.error) {
										uni.showToast({
											title: '扫码失败',
											mask: false,
											duration: 1500
										});
										return;
									} else {
										uni.showModal({
											title: '扫码登入',
											content: '您正在使用扫码登入，请点击确认授权',
											showCancel: false,
											confirmText: '确认授权',
											success: res => {
												that.wwiopt({
													url: '/index.php?app=member_index&wwi=goLogin',
													method: 'POST',
													data: {
														key: that.key,
														type: 2,
														smUrl: result
													},
													success: res => {
														if (res.data.datas.error) {
															uni.showToast({
																title: res.data.datas.error,
																mask: false,
																duration: 1500
															});
															return;
														}
														uni.showToast({
															title: '登入成功',
															mask: false,
															duration: 1500
														});
													}
												});
											}
										});
									}
								}
							});
						} else {
							uni.navigateTo({
								url: '/pages/web/tourl?url=' + result
							});
						}
					} else {
						uni.showModal({
							title: '提示',
							content: '扫码结果:' + result,
							showCancel: false,
							cancelText: '',
							confirmText: '确定',
							success: res => {}
						});
					}
				},
				fail: function(res) {}
			});
		},
		request: function(url, name) {
			return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ''])[1].replace(/\+/g, '%20')) || null;
		},
		clickRight: function() {
			uni.navigateTo({
				url: '/pages/my/chatlist'
			});
		},
		fabuSubmit: function(e) {
			if (!this.key) {
				uni.showModal({
					title: '提示',
					content: '请登入后重试',
					showCancel: false,
					success: res => {
						uni.navigateTo({
							url: '/pages/web/login'
						});
					}
				});
				return;
			}
			if (e.detail.value.title.length < 5) {
				uni.showModal({
					title: '提示',
					content: '请输入您的需求不低于5个字符',
					showCancel: false
				});
				return false;
			}
			if (e.detail.value.phone.length != 11) {
				uni.showModal({
					title: '提示',
					content: '请输入正确的手机号',
					showCancel: false
				});
				return false;
			}
			var newDat = {};
			newDat = e.detail.value;
			newDat.key = this.key;
			this.wwiopt({
				url: '/index.php?app=publish&wwi=fabu',
				data: newDat,
				method: 'POST',
				success: res => {
					if (res.data.datas.error) {
						uni.showModal({
							title: '提示',
							content: res.data.datas.error,
							showCancel: false
						});
						return false;
					}
					uni.showModal({
						title: '提示',
						content: '发布成功',
						showCancel: false
					});
				}
			});
		}
	},
	onLoad: function(e) {
		this.Inlimine();
		if (e.invite) {
			uni.setStorageSync('invite');
		}
		this.getLikeList();
	},
	onPullDownRefresh: function() {
		this.Inlimine();
	},
	onShow: function() {
		this.key = uni.getStorageSync('key');
		// #ifdef H5
		document.title = this.siteTitle;
		// #endif
	},
	onPageScroll: function(e) {
		this.titleBg = 'rgba(62,185,129,' + e.scrollTop / 300 + ')';
		if (e.scrollTop / 300 > 0.2) {
			this.leftColor = '#000000';
			this.rightColor = '#000000';
			this.hasSetBg = false;
		} else {
			this.leftColor = '#fff';
			this.rightColor = '#fff';
			this.hasSetBg = true;
		}
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle(this.hasSetBg ? 'light' : 'dark');

		// #endif
	},
	onShareAppMessage: function() {
		var userid = uni.getStorageSync('userid') ? uni.getStorageSync('userid') : '';
		return {
			title: this.siteTitle,
			path: '/pages/index?invite=' + userid
		};
	},
	onReady: function() {
		this.wwiopt({
			url: '/index.php?app=index&wwi=search_hot_info',
			success: result => {
				var data = result.data.datas.hot_info;
				this.goKey = data.name;
				// #ifdef H5
				document.querySelector('.uni-page-head-search-placeholder').innerHTML = data.name;
				// #endif

				this.getChatCount();
				this.rightSup = uni.getStorageSync('chat_count');
				// #ifdef APP-PLUS
				plus.navigator.setStatusBarStyle('light');
				let pages = getCurrentPages();
				let page = pages[pages.length - 1];
				let currentWebview = page.$getAppWebview();
				let titleObj = currentWebview.getStyle().titleNView;
				if (this.rightSup) {
					currentWebview.hideTitleNViewButtonRedDot({
						index: 0
					});
				} else {
					currentWebview.removeTitleNViewButtonBadge({
						index: 0
					});
				}
				//currentWebview.setTitleNViewSearchInputText(data.name);
				titleObj.searchInput.placeholder = data.name;
				currentWebview.setStyle({
					titleNView: titleObj
				});
				// #endif
			},
			error: (data, code) => {
				console.log('fail' + JSON.stringify(data));
			}
		});
	},
	onNavigationBarSearchInputClicked: function() {
		this.goSearch();
	},
	onNavigationBarButtonTap: function(e) {
		if (e.index == 0) {
			if (!uni.getStorageSync('key')) {
				uni.showModal({
					title: '提示',
					content: '您还没有登入,请先登入后操作',
					showCancel: true,
					cancelText: '取消',
					confirmText: '登入',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/web/login'
							});
						}
					}
				});
				return;
			}
			uni.navigateTo({
				url: '/pages/my/chatlist'
			});
		} else {
			this.scanCode();
		}
	}
};
</script>

<style>
@import '../common/css/index.css';
</style>
