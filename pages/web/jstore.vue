<template>
	<view>
		<view class="advPic">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="picSwipe">
				<swiper-item class="img" v-for="item in hdList.slide_list.slide_list" :key="item">
					<image :src="item" mode="widthFix"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="navList" :class="{'stick':scrollTop > 100}">
			<scroll-view scroll-x class="list-main">
				<view class="li" @tap="changMenu(item.id)" :class="{'ok':item.id==menuId}" v-for="item in hdList.menu_list" :key="item.id">{{item.name}}</view>
			</scroll-view>
		</view>
		<view class="indexMain" v-if="menuId==1">
			<view class="storeInfo bmtt mt10">
				<view class="hd flex flexrow pt10 ptb10">
					<view class="storeImg">
						<image :src="indexData.store_info.logo" mode="widthFix"></image>
					</view>
					<view class="storeTit">
						<view class="tit flex flexrow flexAic">{{indexData.store_info.store_name}}
							<view class="tag">营</view>
							<view class="tag">认</view>
						</view>
						<view class="sloe">案例：{{indexData.store_info.case_num}} 商品：{{indexData.store_info.goods_num}} 口碑：{{indexData.store_info.koubei_num}}</view>
					</view>
				</view>
				<view class="serviceList">
					<scroll-view scroll-x class="list-main">
						<view class="li" v-for="(item,vgg) in indexData.service_list" :key="vgg">
							<view class="wwi-icon s1">
								<image :src="item.pic" mode="widthFix"></image>
							</view>
							<view class="span">{{item.name}}</view>
						</view>
					</scroll-view>
				</view>
				<view class="bd flex flexrow">
					<view class="wwi-icon wwi-icon-dizhi"></view>
					<view class="areaInfo">{{indexData.store_info.address}}</view>
					<view class="wwi-icon wwi-icon-dianhua tel" @tap="tel(hdList.slide_list.store_phone)"></view>
				</view>
				<view class="bd flex flexrow">
					<view class="wwi-icon wwi-icon-jianjie"></view>
					<view class="about">{{indexData.store_info.desc}}</view>
				</view>
			</view>
			<view class="bmtt mt10 jylm" v-if="indexData.jykm_list.length">
				<view class="title flex flexJcs">
					<view class="lt">经营科目</view>
				</view>
				<scroll-view scroll-x class="list-main">
					<view class="li" v-for="(item,vvv) in indexData.jykm_list" :key="vvv">
						<view class="wwi-icon s1">
							<image :src="item.pic" mode="widthFix"></image>
						</view>
						<view class="span">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="bmtt mt10 alzs">
				<view class="title flex flexJcs" @tap="changMenu('4')">
					<view class="lt">案例展示</view>
					<view class="rt">全部{{indexData.case_list.case_num}}个 > </view>
				</view>
				<view class="list-main flex flexrow flexwrap">
					<view class="li" v-for="item in indexData.case_list.case_list" :key="item.id">
						<image :src="item.pic" class="img" mode="widthFix"></image>
						<view class="text">{{item.name}}</view>
					</view>
				</view>
			</view>
			<view class="bmtt mt10 qyzz">
				<view class="title flex flexJcs">
					<view class="lt">企业资质</view>
				</view>
				<scroll-view scroll-x class="list-main">
					<view class="li" v-for="(item,vv)  in indexData.qiye_list" :key="vv">
						<image :src="item.pic" class="img" mode="widthFix"></image>
						<view class="span">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="bmtt mt10 tdjs">
				<view class="title flex flexJcs">
					<view class="lt">团队介绍</view>
					<view class="rt">全部{{indexData.td_list.tuandui_num}}个 > </view>
				</view>
				<scroll-view scroll-x class="list-main">
					<view class="li" v-for="(item,v)  in indexData.td_list.tuandui_list" :key="v">
						<image :src="item.pic" class="img"></image>
						<view class="span strong">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="bmtt mt10 cpfw">
				<view class="title flex flexJcs">
					<view class="lt">产品服务</view>
				</view>
				<view class="list-main flex flexrow flexwrap">
					<navigator :url="'/pages/web/item?goodsid='+item.id" class="li" v-for="item in indexData.goods_list" :key="item.id">
						<image :src="item.pic" class="img"></image>
						<view class="price flex flexJcs">
							<view class="num">￥{{item.price}}</view>
							<view>成交{{item.salenum}}次</view>
						</view>
						<view class="text">{{item.title}}</view>
					</navigator>

				</view>
			</view>
			<view class="bmtt mt10 dpzx">
				<view class="title flex flexJcs" @tap="changMenu('6')">
					<view class="lt">店铺资讯</view>
					<view class="rt">更多 > </view>
				</view>
				<view class="list-main flex flexrow flexwrap">
					<navigator :url="'/pages/web/tzxinfo?id='+item.id" class="li" v-for="item in indexData.article_list" :key="item.id">
						<image :src="item.pic" class="img"></image>
						<view class="text">{{item.title}}</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="goodsList" v-if="menuId==2">
			<view class="menu flex flexrow">
				<view class="li flex flexrow" @click="chengeGsearch('1')" :class="{'ok': gsearch.key==1}"><view class="span flex flexrow flexAic flexJcc">新品<view class="rate" :class="gsearch.order==1?'up':'down'"></view></view></view>
				<view class="li flex flexrow" @click="chengeGsearch('2')" :class="{'ok': gsearch.key==2}"><view class="span flex flexrow flexAic flexJcc">价格<view class="rate" :class="gsearch.order==1?'up':'down'"></view></view></view>
				<view class="li flex flexrow" @click="chengeGsearch('3')" :class="{'ok': gsearch.key==3}"><view class="span flex flexrow flexAic flexJcc">销量<view class="rate" :class="gsearch.order==1?'up':'down'"></view></view></view>
				<view class="li flex flexrow" @click="chengeGsearch('4')" :class="{'ok': gsearch.key==4}"><view class="span flex flexrow flexAic flexJcc">收藏<view class="rate" :class="gsearch.order==1?'up':'down'"></view></view></view>
				<view class="li flex flexrow" @click="chengeGsearch('5')" :class="{'ok': gsearch.key==5}"><view class="span flex flexrow flexAic flexJcc">人气<view class="rate" :class="gsearch.order==1?'up':'down'"></view></view></view>
			</view>
			<view class="list-main flex flexrow flexwrap">
				<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="li" v-for="item in goodsList" :key="item.goods_id">
					<image :src="item.goods_image_url" class="img"></image>
					<view class="price flex flexJcs">
						<view class="num">￥{{item.goods_price}}</view>
						<view>成交{{item.goods_salenum}}次</view>
					</view>
					<view class="text">{{item.goods_name}}</view>
				</navigator>

			</view>
		</view>
		<view class="evaList" v-if="menuId==3">
			<view class="eva-info">
				<view class="title flex flexAic flexJcc">用户口碑</view>
				<view class="flex flexrow flexAic flexJcc">	<view class="star flex flexrow">
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':evaData.credit_average > 0}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':evaData.credit_average > 1}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':evaData.credit_average > 2}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':evaData.credit_average > 3}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':evaData.credit_average > 4}"></view>
				</view><view class="num">{{evaData.credit_average}}</view>分
				</view>
				<view class="flex flexAic flexJcc">来自{{evaData.goods_count}}人点评</view>
				<view class="flex flexAic flexJcc">描述：{{evaData.desccredit}}分 服务：{{evaData.servicecredit}}分 物流：{{evaData.deliverycredit}}分</view>
			</view>
			<view class="eva-li flex flexrow" v-for="(item,vg) in evaList" :key="vg">
				<view class="lt"><image :src="item.avatar" mode=""></image></view>
				<view class="rt">
					<view class="hd  flex flexrow flexAic"><view class="name">{{item.member}}</view>
						<view class="star flex flexrow">
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="0 < item.scores ? 'ok' : ''"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="1 < item.scores ? 'ok' : ''"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="2 < item.scores ? 'ok' : ''"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="3 < item.scores ? 'ok' : ''"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="4 < item.scores ? 'ok' : ''"></view>
				</view><view class="num">{{item.scores}}</view>分</view>
				<view class="bd">{{item.message}}</view>
				<view class="pic" v-if="item.message_image.length">
					<view class="li" v-for="(pic,vpic) in item.message_image" :key="vpic" @click="tapPicView(item.message_image)"><image :src="pic" mode=""></image></view>
				</view>
				<view class="time">{{item.time}}</view>
				
				</view>
			</view>
		</view>
		<view class="caseList" v-if="menuId==4">
			<view class="num">全部：{{caseCount}}个</view>
			<view class="flex flexrow flexwrap">
				<navigator :url="'/pages/web/galleryinfo?pid='+item.id" class="case-li" v-for="item in caseList" :key="item.id">
					<view class="hd">
						<image :src="item.image" mode=""></image>
					</view>
					<view class="bd">{{item.title}}</view>
				</navigator>
			</view>
		</view>
		<view class="cretMain" v-if="menuId==5">
			<view class="cret">
				<view class="info">
				<view class="hd flex flexAic flexJcc"><image :src="cretData.bgimage" mode=""></image></view>
				<view class="cret-name flex flexAic flexJcc">千盟园景信用等级证书</view>
				<view class="cret-sname flex flexAic flexJcc">经千盟园景网信用评估系统评定</view>
				<view class="store-ava flex flexAic flexJcc"><image :src="cretData.avatar" mode=""></image></view>
				<view class="store-name flex flexAic flexJcc">{{cretData.storename}}</view>
				<view class="store-rate flex flexAic flexJcc">
						<view class="star flex flexrow">
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':cretData.credit_average > 0}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':cretData.credit_average > 1}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':cretData.credit_average > 2}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':cretData.credit_average > 3}"></view>
					<view class="wwi-icon wwi-icon-pingjiaxingxing-dianliangzhuangtai" :class="{'ok':cretData.credit_average > 4}"></view>
				</view>
				</view>
				<view class="store-span flex flexAic flexJcc"><view class="num">{{cretData.store_number}}</view>分可安心交易</view>
				<view class="store-time flex flexAic flexJcc">更新时间：{{cretData.update_time}}</view>
				</view>
			</view>
			<view class="store-info">
				<view class="span">店铺名称：{{cretData.storename}}</view>
				<view class="span">店铺等级：{{cretData.store_grade}}</view>
				<view class="amoun-info flex flexrow">
					<view class="li flex flexAic flexcol">
						<view class="num">{{cretData.total_amount}}</view>
						<view class="em">交易总金额</view>
					</view>
					<view class="li flex flexAic flexcol">
						<view class="num">{{cretData.store_number}}</view>
						<view class="em">交易好评率</view>
					</view>
					<view class="li flex flexAic flexcol">
						<view class="num">{{cretData.zhongbaiocount}}</view>
						<view class="em">中标总次数</view>
					</view>
				</view>
				<view class="span-rate flex flexrow flexAic">交易安全：
				<view class="alite flex flexrow flexAic" :class="{'no':cretData.store_baozhengjin!='2'}">诚信保证金<view class="wwi-icon" :class="cretData.store_baozhengjin=='2'?'wwi-icon-icok':'wwi-icon-close'"></view></view></view>
				<view class="span-rate flex flexrow flexAic">真实身份：<view class="alite flex flexrow flexAic" :class="{'no':cretData.store_renzheng!=1}">企业认证<view class="wwi-icon" :class="cretData.store_renzheng==1?'wwi-icon-icok':'wwi-icon-close'"></view></view></view>
				<view class="span-rate flex flexrow flexAic">联系可用：<view class="alite flex flexrow flexAic" :class="{'no':cretData.mobile_bind!=1}">手机认证<view class="wwi-icon" :class="cretData.mobile_bind==1?'wwi-icon-icok':'wwi-icon-close'"></view></view><view class="alite flex flexrow flexAic" :class="{'no':cretData.email_bind!=1}">邮箱认证<view class="wwi-icon" :class="cretData.email_bind==1?'wwi-icon-icok':'wwi-icon-close'"></view></view></view>
				<view class="t-info flex flexrow flexAic flexJcc">近一个月退款率为<view class="num">{{cretData.tuikuan}}%</view>,纠纷率为<view class="num">{{cretData.jiufen}}%</view></view>
			</view>
			<view class="about">
				<view class="title">证书说明：</view>
				<view class="span">1.该千盟园景的信用积分和等级计算是千盟园景网信用评估系统融合以上“信用明细”所有要素经过一套复杂的运算自动所得，有效期为永久性，且积分和等级并非一成不变（每日会根据该千盟园景最新交易情况和其他表现进行实时变化）</view>
				<view class="span">2.本证书只证明该千盟园景网上的以往信用表现，只作为双方交易的参考，不作为日后发生交易纠纷的书面证据。本证书最终解释权归一品千盟园景网络科技有限公司所有</view>
			</view>

		</view>
		<view class="picList" v-if="menuId==6">
			<navigator :url="'/pages/web/tzxinfo?id='+item.id" class="pic-li" v-for="item in picList" :key="item.id">
				<view class="lt">
					<image :src="item.image" mode=""></image>
				</view>
				<view class="rt">
					<view class="title">{{item.title}}</view>
					<view class="info">{{item.abstract_title}}</view>
					<view class="time">日期:{{item.time}}</view>
				</view>
			</navigator>
		</view>
		<wwi-load-more :loadingType="loadingType" :contentText="contentText"></wwi-load-more>
		<view style="height: 100upx;"></view>
		<view class="jstoreBottom flex flexrow flexAic flexJcc">
			<view class="li" @tap="tel(hdList.slide_list.store_phone)">电话联系</view>
			<navigator :url="'/pages/web/storeinfo?id='+storeId" class="li">店铺详情</navigator>
			<view class="li" @click="showVoucher">免费领券</view>
			<navigator :url="'/pages/my/chatinfo?tid='+storeId" class="li">联系客服</navigator>
		</view>
		<wwi-mask-up ref="wwiMaskUp" leftText="取消" title="领取代金券">
			<view class="wwiapp-voucher-list">
				<view v-if="voucherList.length <= 0" class="wwi-nodata" style="padding: 2em 0; position: relative;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">暂无代金券可以领取</view>
							<view class="dd">店铺代金券可享受商品折扣</view>
						</view>
					</view>
				</view>
				<view class="li flex flexrow" v-for="(vc,ck) in voucherList" :key="ck">
					<view class="dl">
						<view class="money flex flexrow">面额<view class="em">{{vc.voucher_t_price}}</view>元</view>
						<view class="need">需消费{{vc.voucher_t_limit}}使用</view>
						<view class="time">至{{vc.voucher_t_end_date_text}}前使用</view>
					</view>
					<view class="btn" @click="getFreeVoucher(vc)">
						<view class="span">领取</view>
					</view>
				</view>
			</view>
		</wwi-mask-up>
	</view>
</template>

<script>
	import wwiMaskUp from '@/components/wwi-mask-up.vue';
	import wwiLoadMore from '@/components/wwi-load-more.vue';
	export default {
		data() {
			return {
				key: '',
				storeId: '',
				hdList: {
					slide_list: []
				},
				menuId: 1,
				indexData: {
					store_info: {},
					case_list: [],
					jykm_list: [],
					qiye_list: [],
					service_list: [],
					td_list: [],
					goods_list: [],
					article_list: []
				},
				voucherList: [],
				caseList: [],
				caseCount: 0,
				cretData: [],
				picList: [],
				evaList:[],
				goodsList:[],
				evaData:[],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadingType: 3,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				scrollTop:0,
				gsearch:{
					order:0,
					key:0,
					keyword:''
				}
			}
		},
		components: {
			wwiMaskUp,
			wwiLoadMore
		},
		methods: {
			loadData: function() {
				uni.request({
					url: this.ApiUrl + '/index.php?app=default&wwi=store_slide',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: this.storeId
					},
					success: res => {
						this.hdList = res.data.datas;
					},
					fail: () => {
						uni.showModal({
							title: '提示',
							content: '数据请求失败，请重试',
							showCancel: false,
							confirmText: '好的'
						});
						uni.navigateBack();
					}
				});
			},
			loadDefault: function(action = 'refresh') {
				if (this.menuId == 1) {
					this.wwiopt({
						url: '/index.php?app=default&wwi=store_index',
						method: 'POST',
						data: {
							id: this.storeId
						},
						success: res => {
							this.indexData = res.data.datas;
						}
					});
				} else if (this.menuId == 5) {
					this.wwiopt({
						url: '/index.php?app=service&wwi=show_store_credit',
						method: 'POST',
						data: {
							s_id: this.storeId
						},
						success: res => {
							this.cretData = res.data.datas.info;
						}
					});
				} else if (this.menuId == 6) {
					if (!this.hasmore) {
						this.loadingType = 2;
						return;
					}
					this.loadingType = 1;
					this.wwiopt({
						url: '/index.php?app=service&wwi=show_store_news',
						method: 'POST',
						data: {
							s_id: this.storeId,
							page: this.page,
							curpage: this.curpage
						},
						success: res => {
							if (res.data.code == '200') {
								this.curpage += 1;
								if (action == 'onbot') {
									res.data.datas.article_list.forEach(item => {
										this.picList.push(item);
									});

									this.loadingType = 0;
								} else {
									this.picList = res.data.datas.article_list;
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
				} else if (this.menuId == 4) {
					if (!this.hasmore) {
						this.loadingType = 2;
						return;
					}
					this.loadingType = 1;
					this.wwiopt({
						url: '/index.php?app=service&wwi=show_store_case',
						method: 'POST',
						data: {
							s_id: this.storeId,
							page: this.page,
							curpage: this.curpage
						},
						success: res => {
							if (res.data.code == '200') {
								this.caseCount = res.data.datas.count;
								this.curpage += 1;
								if (action == 'onbot') {
									res.data.datas.store_prcture.forEach(item => {
										this.caseList.push(item);
									});

									this.loadingType = 0;
								} else {
									this.caseList = res.data.datas.store_prcture;
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
				} else if (this.menuId == 3) {
					if (!this.hasmore) {
						this.loadingType = 2;
						return;
					}
					this.loadingType = 1;
					this.wwiopt({
						url: '/index.php?app=service&wwi=store_comments_goods',
						method: 'POST',
						data: {
							s_id: this.storeId,
							page: this.page,
							curpage: this.curpage
						},
						success: res => {
							if (res.data.code == '200') {
								this.evaData = res.data.datas.store_eva_info;
								this.curpage += 1;
								if (action == 'onbot') {
									res.data.datas.goodsevallist.forEach(item => {
										this.evaList.push(item);
									});

									this.loadingType = 0;
								} else {
									this.evaList = res.data.datas.goodsevallist;
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
				} else if (this.menuId == 2) {
					
					if (!this.hasmore) {
						this.loadingType = 2;
						return;
					}
					this.loadingType = 1;
					this.wwiopt({
						url: '/index.php?app=store&wwi=store_goods',
						data: {
							store_id: this.storeId,
							key:this.gsearch.key,
							order:this.gsearch.order,
							page: this.page,
							curpage: this.curpage
						},
						success: res => {
							console.log(res);
							if (res.data.code == '200') {
								this.curpage += 1;
								if (action == 'onbot') {
									res.data.datas.goods_list.forEach(item => {
										this.goodsList.push(item);
									});

									this.loadingType = 0;
								} else {
									this.goodsList = res.data.datas.goods_list;
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
				}
			},
			changMenu: function(e) {
				if (this.menuId == e) {
					return false;
				}
				this.menuId = e;
				this.hasmore = true;
				this.curpage = 1;
				this.loadingType = 3;
				this.loadDefault();
			},
			tel(e) {
				uni.makePhoneCall({
					phoneNumber: e
				});
			},
			showVoucher() {
				uni.request({
					url: this.ApiUrl + '/index.php?app=voucher&wwi=voucher_tpl_list',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						store_id: this.storeId,
						gettype: 'free'
					},
					success: res => {
						if (res.data.code == 200) {
							this.voucherList = res.data.datas.voucher_list;
						}
					}
				});
				this.$refs.wwiMaskUp.show();
			},
			getFreeVoucher(e) {
				if (!this.key) {
					this.checkLogin(0);
					return;
				}
				uni.request({
					url: this.ApiUrl + "/index.php?app=member_voucher&wwi=voucher_freeex",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						tid: e.voucher_t_id,
						key: this.key
					},
					success: res => {
						this.checkLogin(res.data.login);
						var msg = '领取成功';
						if (res.data.datas.error) {
							msg = '领取失败' + res.data.datas.error;
						}
						uni.showToast({
							title: msg,
							icon: "none"
						});
					}
				});
			},
			tapPicView:function(urls){
				uni.previewImage({
					urls:urls
				})
			},
			chengeGsearch:function(ee){
				if(this.gsearch.key ==ee){
					this.gsearch.order = this.gsearch.order==0?'1':'0';
				}
				this.gsearch.key = ee;
				this.hasmore = true;
				this.curpage = 1;
				this.loadingType = 3;
				this.loadDefault();
				console.log(this.gsearch)
			}
		},
		onLoad: function(e) {
			if (e.storeId) {
				this.storeId = e.storeId;
			}
			this.loadData();
			this.loadDefault();
		},
		onPullDownRefresh: function() {
			this.hasmore = true;
			this.curpage = 1;
			this.loadDefault();
		},
		onReachBottom: function() {
			if (this.hasmore) {
				this.loadDefault('onbot');
			} else {
				this.loadingType = 3;
			}
		},
		onPageScroll(e) {
			this.scrollTop= e.scrollTop
		}
	}
</script>

<style>
.bmtt{ background: #FFFFFF; padding: 20upx;}
.bmtt .title{padding: 20upx 0;}
.bmtt .title .lt{ font-weight: bold; font-size: 32upx;}
.advPic .picSwipe{ overflow: hidden;height: 400upx;}
.advPic .picSwipe .img image{ vertical-align: middle; width: 100%;}
.navList{   padding:20upx 20upx 0 ;overflow: hidden; width: 100%; box-sizing: border-box; background: #fff;}
.navList.stick{position: fixed;		top: 0;z-index: 999;}
.navList .list-main{    width: auto;  white-space: nowrap;}
.navList .li.ok{ color: #2CB476;}
.navList .li{ width: auto; display: inline-block; padding: 20upx 40upx; overflow: hidden; vertical-align: middle; font-weight: bold;}
.indexMain .storeInfo .hd{padding-bottom: 20upx;}
.indexMain .storeInfo .hd .storeImg{width: 120upx; height: 120upx; margin-right: 20upx;}
.indexMain .storeInfo .hd .storeImg image{ border-radius: 120upx;}
.indexMain .storeInfo .hd .storeTit{padding: 20upx 0;}
.indexMain .storeInfo .hd .storeTit .tit{font-size: 32upx; font-weight: bold;}
.indexMain .storeInfo .hd .storeTit .tit .tag{background: #FF5722; color: #FFFFFF;margin-left: 15upx; width: 35upx; height:35upx; text-align: center; font-size: 24upx;line-height: 35upx;}
.indexMain .storeInfo .hd .storeTit .sloe{color: #999;}
.indexMain .storeInfo .serviceList{   padding:20upx 20upx 0 ;overflow: hidden; width: 100%; box-sizing: border-box; border-top:1px solid #F8F8F8}
.indexMain .storeInfo .serviceList .list-main{    width: auto;  white-space: nowrap;}
.indexMain .storeInfo .serviceList .li{ width: auto; display: inline-block; padding: 20upx 40upx; overflow: hidden; vertical-align: middle; border-right:2upx solid #F8F8F8 ;}
.indexMain .storeInfo .serviceList .li .wwi-icon{width: 60upx; height: 60upx; padding: 20upx;display: flex; justify-content: center; align-items: center;background-position: 50%; border-radius:60upx; position: relative; z-index: 1;}
.indexMain .storeInfo .serviceList .li .span{font-size: 26upx; margin-top: 10upx; text-align: center;}
.indexMain .storeInfo .serviceList .li:last-child{border: none;}
.indexMain .storeInfo .bd{border-top:1px solid #F8F8F8 ; padding: 20upx 0; color: #999;}
.indexMain .storeInfo .bd .wwi-icon{color: #ccc; padding-right: 20upx;}
.indexMain .storeInfo .bd .areaInfo{flex: 1;}
.indexMain .storeInfo .bd .tel{padding: 0 20upx; border-left: 1px solid #F8F8F8; color: #2CB476;}
.indexMain .jylm  .list-main{ padding: 20upx 0;   width: auto;white-space: nowrap;}
.indexMain .jylm  .list-main .li{ width: 190upx; display: inline-block; padding: 20upx 20upx; box-sizing: border-box; height: 190upx; overflow: hidden; vertical-align: middle; border:2upx solid #F8F8F8 ; border-radius: 190upx; margin-right: 20upx;}
.indexMain .jylm  .list-main .li .wwi-icon{width: 60upx; height: 60upx; padding:10upx 40upx;display: flex; justify-content: center; align-items: center;background-position: 50%; border-radius:60upx; position: relative; z-index: 1;}
.indexMain .jylm  .list-main .li .span{font-size: 26upx; margin-top: 10upx; text-align: center; line-height: 35upx; color: #999;white-space: normal;}
.indexMain .alzs  .list-main{ padding: 20upx 0;   width: auto;}
.indexMain .alzs  .list-main .li{width: 345upx; margin-bottom: 20upx;}
.indexMain .alzs  .list-main .li .img{ width: 345upx; height: 200upx; border-radius: 30upx;}
.indexMain .alzs  .list-main .li:nth-child(even){margin-left: 20upx;}
.indexMain .alzs  .list-main .li .text{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
.indexMain .qyzz  .list-main{ padding: 20upx 0;   width: auto;}
.indexMain .qyzz  .list-main .li{ width: 290upx; display: inline-block;margin-right: 20upx;}
.indexMain .qyzz  .list-main .li .img{ width: 290upx; height: 200upx;}
.indexMain .qyzz  .list-main .li .span{font-size: 26upx; margin-top: 10upx; text-align: center; line-height: 35upx; color: #999;}
.indexMain .tdjs  .list-main{ padding: 20upx 0;   width: auto;}
.indexMain .tdjs  .list-main .li{ width: 190upx; display: inline-block;margin-right: 20upx;}
.indexMain .tdjs  .list-main .li .img{ width: 150upx; height: 150upx; border-radius: 150upx; margin:0 20upx;}
.indexMain .tdjs  .list-main .li .span{font-size: 26upx; margin-top: 10upx; text-align: center; line-height: 35upx; color: #999;}
.indexMain .tdjs  .list-main .li .span.strong{font-size: 32upx; font-weight: bold; color: #333;}
.indexMain .dpzx  .list-main{ padding: 20upx 0;   width: auto;}
.indexMain .dpzx  .list-main .li{width: 345upx; margin-bottom: 20upx;}
.indexMain .dpzx  .list-main .li .img{ width: 345upx; height: 250upx;}
.indexMain .dpzx  .list-main .li:nth-child(even){margin-left: 20upx;}
.indexMain .dpzx  .list-main .li .text{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden; height: 100upx;line-height: 45upx;}

.indexMain .cpfw  .list-main{ padding: 20upx 0;   width: auto;}
.indexMain .cpfw  .list-main .li{width: 345upx; margin-bottom: 20upx;}
.indexMain .cpfw  .list-main .li .img{ width: 345upx; height: 345upx; border-radius: 30upx;}
.indexMain .cpfw  .list-main .li:nth-child(even){margin-left: 20upx;}
.indexMain .cpfw  .list-main .li .text{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden; height: 90upx;line-height: 45upx;}
.indexMain .cpfw  .list-main .li .price{color: #999;}
.indexMain .cpfw  .list-main .li .price .num{color: #FF0000; font-weight: bold; font-size: 32upx;}
.jstoreBottom{position: fixed; bottom: 0; left: 0; right: 0; height: 100upx; background: #FFFFFF;}
.jstoreBottom .li{flex: 1;border-left: 1px solid #F8F8F8; text-align: center;}
.jstoreBottom .li:nth-child(1){border-left: none;}
.picList{}
.picList .pic-li{margin-top: 20upx; padding: 20upx; background: #fff; flex-direction: row; display:flex ;}
.picList .pic-li .lt{width: 300upx; height: 200upx; margin-right: 20upx;}
.picList .pic-li .lt image{width: 300upx; height: 200upx;}
.picList .pic-li .rt{flex: 1;}
.picList .pic-li .rt .title{font-weight: bold; display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;}
.picList .pic-li .rt .info{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;overflow: hidden; color: #999;}
.picList .pic-li .rt .time{color: #999;}
.caseList{background: #fff;}
.caseList .num{height: 80upx;line-height: 80upx; padding-left: 20upx; background: #F8F8F8;}
.caseList .case-li{width: 335upx; margin: 20upx; box-sizing: border-box; float: left;}
.caseList .case-li .hd image{width: 100%; height: 200upx; border-radius: 30upx;}
.cretMain{margin: 20upx;}
.cretMain .cret{ padding: 20upx; background: #fff; border-radius: 30upx; box-shadow: 0px 0px 6px #ccc;}
.cretMain .cret .info{border: 2px #F8F8F8 dashed; border-radius: 30upx; padding: 20upx;}
.cretMain .cret .info .hd image{width: 300upx; height: 300upx;}
.cretMain .cret .cret-name{color: #2CB476; font-size: 42upx; font-weight: bold;}
.cretMain .cret .cret-sname{color: #2CB476; font-size: 30upx; }
.cretMain .cret .cret-sname:after{width: 80upx; height: 2upx; content: ''; background: #2CB476;}
.cretMain .cret .cret-sname:before{width: 80upx; height: 2upx; content: ''; background: #2CB476;}
.cretMain .cret .store-ava{padding: 50upx 0 20upx 0;}
.cretMain .cret .store-ava image{width: 150upx; height: 150upx; border-radius: 150upx; border: 1px solid #ccc;}
.cretMain .cret .store-name{font-size: 32upx;}
.cretMain .cret .store-rate{color: #ccc; margin-top: 15upx;}
.cretMain .cret .store-rate .ok{color: #FF5722;}
.cretMain .cret .store-span{margin-top: 15upx;}
.cretMain .cret .store-span .num{color: #2CB476; font-weight: bold; font-size: 32upx; margin-right: 10upx;}
.cretMain .cret .store-time{color: #999;}
.cretMain .store-info{padding: 40upx; background: #fff; margin-top: 20upx;}
.cretMain .store-info .amoun-info{border: solid #F8F8F8; border-width: 1px 0; padding: 20upx 0; margin: 20upx 0;}
.cretMain .store-info .amoun-info .li{flex: 1;}
.cretMain .store-info .amoun-info .li .num{color: #2CB476; font-weight: bold; font-size: 32upx;}
.cretMain .store-info .t-info{color: #999; font-size: 32upx; margin-top: 20upx;}
.cretMain .store-info .t-info .num{color: #FF0036;}
.cretMain .store-info .span-rate{height: 80upx;}
.cretMain .store-info .span-rate .alite{background: #edfbf5; padding: 5upx 15upx; border: 1px solid #2CB476; margin-right: 20upx;}
.cretMain .store-info .span-rate .alite .wwi-icon{ color: #2CB476; margin-left: 10upx; font-size: 42upx;}
.cretMain .store-info .span-rate .alite.no{background: #F8F8F8; border-color: #ccc;}
.cretMain .store-info .span-rate .alite.no .wwi-icon{color: #FF0036;}
.cretMain .about{color: #888;}
.cretMain .about .title{font-size: 32upx; margin-top: 20upx;}
.cretMain .about .span{margin-top: 20upx;}

.evaList{}
.evaList .eva-info{padding: 20upx; background: #FFFFFF; margin: 20upx; box-shadow: 0px 0px 6px #ccc; border-radius: 30upx;}
.evaList .eva-info .title{font-size: 32upx; height: 100upx; flex: 1;}
.evaList .eva-info .title:after{width: 100upx; height: 4upx; background: #ccc; content: ''; margin-left: 20upx;}
.evaList .eva-info .title:before{width: 100upx; height: 4upx; background: #ccc; content: ''; margin-right: 20upx;}
.evaList .eva-info {color: #999;}
.evaList .eva-info .star .wwi-icon{font-size: 42upx;}
.evaList .eva-info .star .ok{color: #FF5722;}
.evaList .eva-info .num{color: #FF7135; font-weight: bold; font-size: 32upx; margin-left: 10upx; margin-right: 10upx;}
.evaList .eva-li{background: #fff; padding: 20upx; border-bottom: 1px solid #F8F8F8;}
.evaList .eva-li .lt{width: 120upx; margin-right: 20upx; }
.evaList .eva-li .lt image{width: 120upx; height: 120upx; border-radius: 120upx;}
.evaList .eva-li .rt{width: 570upx;}
.evaList .eva-li .rt .hd{ font-size: 28upx; color: #999;}
.evaList .eva-li .rt .hd .name{font-size: 34upx; font-weight: bold; margin-right: 20upx; color: #333;}
.evaList .eva-li .rt .hd .star .ok{color: #FF5722;}
.evaList .eva-li .rt .hd .star .wwi-icon{font-size: 42upx;}
.evaList .eva-li .rt .hd .num{font-weight: bold; font-size: 32upx; color: #999; margin-left: 20upx; margin-right: 10upx;}
.evaList .eva-li .rt .pic{display: flex; flex-direction: row;}
.evaList .eva-li .rt .pic .li{width: 170upx; margin-right: 20upx;}
.evaList .eva-li .rt .pic .li image{width: 170upx; height: 170upx; border-radius: 30upx;}
.evaList .eva-li .rt .bd{margin: 20upx 0; color: #999;}
.evaList .eva-li .rt .time{color: #999;}
.goodsList .menu .li{ width: 150upx; height: 100upx;justify-content: center; align-items: center;}
.goodsList .menu .li .span{ display: flex; justify-content: center; align-items: center; width: 100%; height: 70upx; }
.goodsList .menu .li.ok .span{background: #fff; border-radius: 50upx; color: #2CB476;}
.goodsList .menu .li .span .rate{width: 20upx; position: relative; height: 70upx; margin-left: 10upx;}
.goodsList .menu .li .span .rate:after{width: 0; height: 0; border-style: solid; border-width: 0 10upx 10upx 10upx; border-color: transparent transparent #12194C transparent; content: ""; position: absolute; top: 22upx; right: 0}
.goodsList .menu .li .span .rate:before{width: 0; height: 0; border-style: solid; border-width: 10upx 10upx 0 10upx; border-color: #12194C  transparent  transparent transparent ; content: ""; position: absolute; bottom: 22upx; right: 0;}
.goodsList .menu .li.ok .span .rate.down:before{ border-color: #2CB476  transparent  transparent transparent ;}
.goodsList .menu .li.ok .span .rate.up:after{ border-color: transparent transparent #2CB476 transparent;}
.goodsList .list-main{ padding: 20upx; background: #fff;}
.goodsList .list-main .li{width: 345upx; margin-bottom: 20upx;}
.goodsList .list-main .li .img{ width: 345upx; height: 345upx; border-radius: 30upx;}
.goodsList .list-main .li:nth-child(even){margin-left: 20upx;}
.goodsList .list-main .li .text{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden; height: 90upx;line-height: 45upx;}
.goodsList .list-main .li .price{color: #999;}
.goodsList .list-main .li .price .num{color: #FF0000; font-weight: bold; font-size: 32upx;}
</style>
