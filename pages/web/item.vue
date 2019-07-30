<template>
	<view class="index">
		<view class="wwi-page-header">
			<view class="wwi-page-head wwi-page-head-transparent" :style="{'background':'rgba(255,255,255,'+titleBg+')','borderColor':'rgba(248,248,248,'+titleBg+')','color':'#000'}">
				<view class="wwi-page-head-null">
					<view class="wwi-page-head-hd">
						<view class="wwi-page-head-btn" @click="goBack" :style="{'background':'rgba(0,0,0,'+(0.5-titleBg)+')'}">
							<text class="wwi-icon wwi-icon-xiangzuo" :style="{'color':titleBg > 0.2?'#000':'#fff'}"></text>
						</view>
					</view>
					<view class="wwi-page-head-bd" :style="{'opacity':titleBg}" :class="{'wwi-page-into':!ginfoNow}">
						<view class="wwi-page-head__slider">
							<view :class="['wwi-page-head__slider_item',tabIndex==0 ? 'cur' : '']" :data-current="0" @click="tapTab(0)">商品</view>
							<view :class="['wwi-page-head__slider_item',tabIndex==1 ? 'cur' : '']" :data-current="1" @click="tapTab(1)">详情</view>
							<view :class="['wwi-page-head__slider_item',tabIndex==2 ? 'cur' : '']" :data-current="2" @click="tapTab(2)">评价</view>
						</view>
						<view class="wwi-page-head__title">商品详情</view>
					</view>
					<view class="wwi-page-head-ft">
						<navigator url="/pages/cart" open-type="switchTab" :badge-text="cartCount" class="wwi-page-head-btn" :class="{'wwi-page-head-btn-red-dot':cartCount > 0}"
						 :style="{'background':'rgba(0,0,0,'+(0.5-titleBg)+')'}">
							<text class="wwi-icon wwi-icon-gouwuche1" :style="{'color':titleBg > 0.2?'#000':'#fff'}"></text>
						</navigator>
					</view>
				</view>
			</view>
			<view class="wwi-placeholder" v-if="tabIndex>0 || !ginfoNow "></view>
		</view>
		<wwi-pulldown-refresh ref="wwiPulldownRefresh" class="item-main-box" :top="mainHeight" :refresh="refresh" :reload="reload"
		 @refreshback="onPulldownReresh" @reloadback="onPullupReload" @setEnableScroll="setEnableScroll">
			<swiper :current="tabIndex" style="height: 100%;" :duration="300" @change="changeTab">
				<!-- 商品简介 -->
				<swiper-item>
					<scroll-view style="width: 750upx; height: 100%;" :scroll-y="enableScroll" :scroll-top="scrollInto" @scroll="itemScroll">
						<view class="item-hd-view" v-if="ginfoNow">
							<view class="goods-tem" id="goodsMain">
								<view class="goods-detail-top">
									<swiper class="goods-img" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000"
									 indicator-color="rgba(255,255,255,0.3)" indicator-active-color="#ff0036">
										<swiper-item class="flex flexAic" style="background: #000;" v-if="info.video_path">
											<video :src="info.video_path" style="width: 750upx; height: 570upx;"></video>
										</swiper-item>
										<swiper-item v-for="(pic,key) in info.goods_image" :key="key" @click="tapPicView(info.goods_image)">
											<view class="swiper-item">
												<image :src="pic" mode="widthFix" lazy-load></image>
											</view>
										</swiper-item>
									</swiper>
								</view>
								<view class="goods-detail-cnt flex flexcol">
									<view class="goods-promotion-type flex flexrow flexJcs" v-if="info.goods_info.pintuan_promotion=='1'">
										<view class=" flex flexrow flexAic">
											<view class="wwi-icon  wwi-icon-ziyuan"></view>
											拼团
										</view>
										<view class="time flex flexrow">
											<view class="flex flexAic" style="font-size: 24upx;">距结束</view>
											<wwi-count-down :timer="info.goods_info.pintuan_end_time" v-if="info.goods_info.pintuan_end_time > 0"
											 borderColor="transparent" splitorColor="#fff" bgrColor="#000"></wwi-count-down>
										</view>
									</view>
									<view class="goods-promotion-type flex flexrow flexJcs" v-if="info.goods_info.promotion_type == 'xianshi' || info.goods_info.promotion_type == 'spike' || info.goods_info.promotion_type == 'flash' || info.goods_info.promotion_type == 	'groupbuy'">
										<view class=" flex flexrow flexAic" v-if="info.goods_info.promotion_type == 'xianshi'">
											<view class="wwi-icon  wwi-icon-xianshicuxiao"></view>
											现时折扣
										</view>
										<view class=" flex flexrow flexAic" v-if="info.goods_info.promotion_type == 'flash'">
											<view class="wwi-icon  wwi-icon-weibiaoti-"></view>
											闪购
										</view>
										<view class=" flex flexrow flexAic" v-if="info.goods_info.promotion_type == 'spike'">
											<view class="wwi-icon  wwi-icon-miaosha"></view>
											秒杀
										</view>
										<view class=" flex flexrow flexAic" v-if="info.goods_info.promotion_type == 'groupbuy'">
											<view class="wwi-icon  wwi-icon-shijian"></view>
											团购
										</view>
										<view class="time flex flexrow">
											<view class="flex flexAic" style="font-size: 24upx;">距结束</view>
											<wwi-count-down :timer="info.goods_info.hdtime_down" v-if="info.goods_info.hdtime_down > 0" borderColor="transparent"
											 splitorColor="#fff" bgrColor="#000"></wwi-count-down>
										</view>
									</view>
									<view class="goods-detail-name flex flexcol">
										<view class="dt flex flexrow">
											<view style="flex: 1; font-weight: 600;">
												<block v-if="info.goods_info.pintuan_promotion != '1'">
													<view class="span" v-if="info.goods_info.is_virtual == '1'">虚拟</view>
													<view class="span" v-if="info.goods_info.is_presell == '1'">预售</view>
													<view class="span" v-if="info.goods_info.is_fcode == '1'">F码</view>
												</block>
												{{info.goods_info.goods_name}}
											</view>
											<view class="wwi-icon wwi-icon-fenxiang" @click="shareBtn"></view>
										</view>
										<view class="dd">{{info.goods_info.goods_jingle}}</view>
									</view>
									<view class="goods-batch">
										<!-- 价格 -->
										<block v-if="info.goods_info.is_batch == 1">
											<view class="goods-detail-price flex flexrow">
												<view class="batch-li flex flexcol" v-for="(batch,key2) in info.goods_info.batch_price" :key="key2">
													<view class="batch-num">{{batch.batch}}</view>
													<view class="batch-price flex flexrow">￥<view class="em">{{batch.price}}</view>
													</view>
												</view>
											</view>
										</block>
										<block v-else>
											<block v-if="info.goods_info.pintuan_promotion != '1'">
												<view class="goods-detail-price flex flexrow">
													<block v-if="info.goods_info.promotion_type">
														<view class="dt flex flexrow">
															<view class="">￥</view>
															<view class="em">{{info.goods_info.promotion_price}}</view>
														</view>
														<view class="dd">￥{{info.goods_info.goods_price}}</view>
														<view class="activity flex flexrow" v-if="info.goods_info.promotion_type == 'sole'">
															<view class="wwi-icon wwi-icon-shouji"></view>手机专享
														</view>
														<view class="activity flex flexrow" v-if="info.goods_info.promotion_type == 'member'">
															<view class="wwi-icon wwi-icon-v"></view>会员价
														</view>
													</block>
													<block v-else="">
														<view class="dt flex flexrow">
															<view class="">￥</view>
															<view class="em">{{info.goods_info.goods_price}}</view>
														</view>
														<view class="dd">￥{{info.goods_info.goods_marketprice}}</view>
														<view class="login" v-if="info.goods_info.is_member_price == '1' && !key">登录后确认是否享有会员价</view>
													</block>
												</view>
											</block>
											<block v-else>
												<view class="goods-detail-price flex flexrow">
													<view class="dt flex flexrow">
														<view class="">￥</view>
														<view class="em">{{info.goods_info.pintuan_price}}</view>
													</view>
													<view class="dd">￥{{info.goods_info.goods_price}}</view>
													<view class="activity flex flexrow">
														<view class="wwi-icon wwi-icon-ziyuan" style="margin-right: 10upx;"></view>{{info.goods_info.pintuan_min_num}}人拼
													</view>
												</view>
											</block>

											<block v-if="info.goods_info.promotion_type == 'xianshi' || info.goods_info.promotion_type == 'spike' || info.goods_info.promotion_type == 'flash' || info.goods_info.promotion_type == 	'groupbuy' || (info.mansong_info != null && info.mansong_info.rules) || info.gift_array">
												<!-- 促销 -->
												<view class="goods-detail-item flex flexrow">
													<view class="item-name">促销</view>
													<view class="item-con">
														<view class="goods-detail-sale flex flexcol" v-if="info.goods_info.promotion_type == 'xianshi'">
															<view class="dt flex flexrow">
																<view class="i">{{info.goods_info.title}}</view>
															</view>
															<view class="dd">直降￥{{info.goods_info.down_price}}
																<block v-if="info.goods_info.lower_limit > 0 ">最低{{info.goods_info.lower_limit}}件起，{{info.goods_info.explain}}</block>
															</view>
														</view>
														<view class="goods-detail-sale flex flexcol" v-if="info.goods_info.promotion_type == 'spike'">
															<view class="dt flex flexrow">
																<view class="i">{{info.goods_info.title}}</view>
															</view>
															<view class="dd">直降￥{{info.goods_info.down_price}}
																<block v-if="info.goods_info.upper_limit > 0 ">最多限购{{info.goods_info.upper_limit}}件，{{info.goods_info.remark}}</block>
															</view>
														</view>
														<view class="goods-detail-sale flex flexcol" v-if="info.goods_info.promotion_type == 'flash'">
															<view class="dt flex flexrow">
																<view class="i">{{info.goods_info.title}}</view>
															</view>
															<view class="dd">直降￥{{info.goods_info.down_price}}
																<block v-if="info.goods_info.upper_limit > 0 ">最多限购{{info.goods_info.upper_limit}}件，{{info.goods_info.remark}}</block>
															</view>
														</view>
														<view class="goods-detail-sale flex flexcol" v-if="info.goods_info.promotion_type == 'groupbuy'">
															<view class="dt flex flexrow">
																<view class="i">{{info.goods_info.title}}</view>
															</view>
															<view class="dd">直降￥{{info.goods_info.down_price}}
																<block v-if="info.goods_info.upper_limit > 0 ">最多限购{{info.goods_info.upper_limit}}件，{{info.goods_info.remark}}</block>
															</view>
														</view>
														<view class="goods-detail-sale flex flexcol" v-if="info.mansong_info != null && info.mansong_info.rules">
															<view class="dt flex flexrow">
																<view class="i">满即送</view>
															</view>
															<view class="mansong-rule flex flexrow" v-for="(mansong,kms) in info.mansong_info.rules" :key="kms">单笔订单满<view
																 class="em">{{mansong.price}}</view>元， <block v-if="mansong.discount > 0">立减<view class="em">{{mansong.discount}}</view>元</block>
																<block v-if="mansong.goods_image_url">,送礼品：<image :src="mansong.goods_image_url" style="width: 35upx; height: 35upx;"></image>
																</block>
															</view>
														</view>
														<view class="goods-detail-sale flex flexcol" v-if="info.gift_array">
															<view class="dt flex flexrow">
																<view class="i">赠品</view>
															</view>
															<view class="dd" v-for="(gift,ingift) in info.gift_array" :key="ingift">
																<navigator class="flex flexrow" :url="'/pages/web/item?goodsid='+gift.gift_goodsid">{{gift.gift_goodsname}}
																	<view class="em">&#215;{{gift.gift_amount }}</view>
																</navigator>
															</view>
														</view>

													</view>
												</view>
											</block>
										</block>
										<!-- 领券 -->
										<view class="goods-detail-voucher flex flexrow" @click="showVoucher(info.store_info)" v-if="info.voucher">
											<view class="i">券</view>点击领取店铺代金券
										</view>
										<!-- 地区运费 -->
										<view class="goods-detail-item flex flexrow" @click="showMulLinkageThreePicker">
											<view class="item-name">送至</view>
											<view class="item-con">
												<view class="goods-detail-freight flex flexcol">
													<view class="dt flex flexrow flexJcs">
														<view class="span flex flexrow">{{info.goods_hair_info.area_name}}
															<view class="strong">{{info.goods_hair_info.if_store_cn}}</view>
														</view>
														<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
													</view>
													<view class="dd">{{info.goods_hair_info.content}}</view>
													<view class="dd">销量：{{info.goods_info.goods_salenum}}</view>
												</view>
											</view>
										</view>
										<!-- 实体商家 -->
										<view class="goods-detail-item goods-detail-o2o flex flexcol" v-if="info.goods_info.is_virtual != '0'">
											<view class="tit">商家信息</view>
											<view class="default flex flexrow flexJcs" v-if="virtualList.length">
												<view class="dl">
													<view class="dt">{{virtualList[0].name_info}}</view>
													<view class="dd">{{virtualList[0].address_info}}</view>
												</view>
												<view class="pp wwi-icon wwi-icon-dianhua" @tap="tel(virtualList[0].phone_info)"></view>
											</view>
											<navigator :url="'/pages/web/storeshop?id='+info.store_info.store_id" class="more flex flexJcs flexrow">
												<view>查看全部商家地址</view>
												<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
											</navigator>
										</view>
										<!-- 门店信息 -->
										<view class="goods-detail-item goods-detail-chain flex flexcol" v-if="chainList.length">
											<view class="tit">门店信息（各个门店价格可能会不一样）</view>
											<view class="default flex flexrow flexJcs" v-if="chainList.length">
												<view class="dl flex flexcol">
													<view class="dt">{{chainList[0].chain_name}}</view>
													<view class="dd">门店价格：{{chainList[0].shopwwi_chain_price}}</view>
													<view class="dd">门店地址：{{chainList[0].chain_address}}，电话：{{chainList[0].chain_phone}}</view>
												</view>
												<navigator :url="'/pages/buy/buystep?goodsId='+goodsId+'&buynum=1&ifchain=1&chainId='+chainList[0].chain_id"
												 class="pp wwi-icon wwi-icon-baoguo_yidong"></navigator>
											</view>
											<view class="more flex flexJcs flexrow" @click="showChain">
												<view>查看所在地门店地址</view>
												<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
											</view>
										</view>
										<!-- 选项 -->
										<view class="goods-detail-item flex flexrow" @click="getGoodsmask">
											<view class="item-name">已选</view>
											<view class="item-con flex flexrow flexJcs">
												<view class="goods-detail-sel flex flexrow">
													<block v-if="info.goods_info.goods_spec">
														<block v-if="info.goods_map_spec.length>0">
															<view class="span flex flexrow" v-for="(spec,k) in info.goods_map_spec" :key="k">{{spec.goods_spec_name}}
																<block v-for="(value,k2) in spec.goods_spec_value" :key="k2">
																	<view class="em" v-if="info.goods_info.goods_spec[value.specs_value_id]">{{value.specs_value_name}}</view>
																</block>
															</view>
														</block>
													</block>
													<view class="span flex flexrow" v-else="">默认</view>
												</view>
												<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
											</view>
										</view>
										<!-- 服务 -->
										<view class="goods-detail-item flex flexrow" v-if="info.goods_info.contractlist.length>0">
											<view class="item-name">服务</view>
											<view class="item-con flex flexrow flexJcs">
												<view class="goods-detail-contract">
													<view class="dt">由“{{info.store_info.store_name}}”销售和发货，并享受售后服务</view>
													<view class="dd flex flexrow">
														<view class="span flex flexrow flexAic" v-for="(ctr,jj) in info.goods_info.contractlist" :key="jj">
															<image :src="ctr.cti_icon_url_60" mode=""></image>{{ctr.cti_name}}
														</view>
													</view>
												</view>
											</view>
										</view>
										<!-- 店铺评分 -->
										<view class="goods-detail-store flex flexcol" v-if="info.store_info.is_own_mall != 1">
											<navigator :url="'/pages/web/store?storeid='+info.store_info.store_id" class="flex flexrow flexJcs flexAic">
												<view class="store-name flex flexrow">
													<view class="wwi-icon wwi-icon-dianpu"></view>{{info.store_info.store_name}}
												</view>
												<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
											</navigator>
											<view class="store-rate flex flexrow">
												<view class="span flex flexrow" :class="info.store_info.store_credit.store_desccredit.percent_class">描述相符
													<view class="em">{{info.store_info.store_credit.store_desccredit.credit}}</view>
													<view class="i">{{info.store_info.store_credit.store_desccredit.percent_text}}</view>
												</view>
												<view class="span flex flexrow" :class="info.store_info.store_credit.store_servicecredit.percent_class">服务态度
													<view class="em">{{info.store_info.store_credit.store_servicecredit.credit}}</view>
													<view class="i">{{info.store_info.store_credit.store_servicecredit.percent_text}}</view>
												</view>
												<view class="span flex flexrow" :class="info.store_info.store_credit.store_deliverycredit.percent_class">发货速度
													<view class="em">{{info.store_info.store_credit.store_deliverycredit.credit}}</view>
													<view class="i">{{info.store_info.store_credit.store_deliverycredit.percent_text}}</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<!-- 评价 -->
							<navigator :url="'/pages/web/itemeva?id='+goodsId" class="goods-detail-comment flex flexcol" id="goodsEvaluation">
								<view class="title flex flexrow flexJcs">
									<view class="flex flexrow">商品评价<view class="rate flex flexrow">好评率<view class="em">{{info.goods_evaluate_info.good_percent}}%</view>
										</view>
									</view>
									<view class="flex flexrow">（{{info.goods_info.evaluation_count}}人评价）<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
									</view>
								</view>
								<view class="comment-info flex flexcol">
									<view class="dl" v-for="(gval,jjj) in info.goods_eval_list" :key="jjj">
										<view class="dt flex flexrow flexJcs">
											<view class="star flex flexrow">
												<view class="wwi-icon" :class="0 < gval.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
												<view class="wwi-icon" :class="1 < gval.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
												<view class="wwi-icon" :class="2 < gval.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
												<view class="wwi-icon" :class="3 < gval.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
												<view class="wwi-icon" :class="4 < gval.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
											</view>
											<view class="user-name flex flexrow">{{gval.geval_frommembername}}
												<view class="time">{{gval.geval_addtime_date}}</view>
											</view>
										</view>
										<view class="dd">{{gval.geval_content}}</view>
									</view>
								</view>
							</navigator>
							<!-- 产品推荐 -->
							<view class="goods-detail-recom flex flexcol" id="goodsRecom">
								<view class="h4">店铺推荐</view>
								<view class="ul flex flexrow">
									<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="li flex flexcol" v-for="(item,kk) in  info.goods_commend_list"
									 :key="kk">
										<image :src="item.goods_image_url"></image>
										<view class="dl">
											<view class="dt">{{item.goods_name}}</view>
											<view class="dd flex flexrow">￥ <view class="em">{{item.goods_promotion_price}}</view>
											</view>
										</view>
									</navigator>
								</view>
							</view>
							<!-- 商品详情 -->
							<view class="goods-detail-info" id="goodsInfo">
								<view class="h4">继续上滑加载详情</view>
							</view>
						</view>
						<view class="item-hd-view" v-if="!ginfoNow">
							<view class="item-hd-view-top" :style="'transform:translate3d(0,'+offset+'px, 0);transition:.6s cubic-bezier(0.18, 0.89, 0.32, 1)'">
								<view class="goods-info-d">
									<rich-text :nodes="goodsInfo"></rich-text>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 商品详情 -->
				<swiper-item v-if="ginfoNow">
					<scroll-view style="width: 750upx; height: 100%;" :scroll-y="enableScroll">
						<view class="goods-info-d">
							<rich-text :nodes="goodsInfo"></rich-text>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 商品评论 -->
				<swiper-item v-if="ginfoNow">
					<scroll-view style="width: 750upx; height: 100%;" :scroll-y="enableScroll" @scrolltolower="loadList('onbot')">
						<view class="evaluation-goods-main">
							<view class="wwiapp-tag-nav">
								<view class="li" :class="{'now':type==''}" @click="setType('')">全部评价</view>
								<view class="li" :class="{'now':type=='1'}" @click="setType('1')">好评</view>
								<view class="li" :class="{'now':type=='2'}" @click="setType('2')">中评</view>
								<view class="li" :class="{'now':type=='3'}" @click="setType('3')">差评</view>
								<view class="li" :class="{'now':type=='4'}" @click="setType('4')">订单晒图</view>
								<view class="li" :class="{'now':type=='5'}" @click="setType('5')">追加评价</view>
							</view>
							<view class="evaluation-goods-list">
								<view v-if="!eveList.length" class="wwi-nodata">
									<view class="no-main">
										<view class="wwi-icon wwi-icon-gouwu"></view>
										<view class="dl">
											<view class="dt">暂无评价</view>
											<view class="dd">可以购买晒出第一个评价</view>
										</view>
									</view>
								</view>
								<view class="li" v-for="(item,index) in eveList" :key="index">
									<view class="eval-user flex flexrow flexAic">
										<view class="user-avatar">
											<image :src="item.member_avatar" mode=""></image>
										</view>
										<view class="user-name">{{item.geval_frommembername}}</view>
										<view class="time">{{item.geval_addtime_date}}</view>
									</view>
									<view class="star flex flexrow">
										<view class="wwi-icon" :class="0 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
										<view class="wwi-icon" :class="1 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
										<view class="wwi-icon" :class="2 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
										<view class="wwi-icon" :class="3 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
										<view class="wwi-icon" :class="4 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
									</view>
									<view class="eval-con">
										<view class="dt">{{item.geval_content}}</view>
										<view class="goods_geval" v-if="item.geval_image_240.length">
											<view class="geval-img" v-for="(gva,index2) in item.geval_image_240" :key="index2" @click="tapPicView(item.geval_image_1024)">
												<image :src="gva"></image>
											</view>
										</view>
									</view>
									<view class="eval-explain" v-if="item.geval_explain">
										解释:{{item.geval_explain}}
									</view>
									<block v-if="item.geval_content_again">
										<view class="again-eval flex flexrow">
											<view class="time">{{item.geval_addtime_again_date}}</view>追加评价
										</view>
										<view class="eval-con">
											<view class="dt">{{item.geval_content_again}}</view>
											<view class="goods_geval" v-if="item.geval_image_again_240.length">
												<view class="geval-img" v-for="(gva,index3) in item.geval_image_again_240" :key="index3" @click="tapPicView(item.geval_image_again_1024)">
													<image :src="gva"></image>
												</view>
											</view>
										</view>
										<view class="eval-explain" v-if="item.geval_explain_again">
											解释:{{item.geval_explain_again}}
										</view>
									</block>
								</view>
								<wwi-load-more :loadingType="loadingType" :contentText="contentText"></wwi-load-more>
							</view>
						</view>
					</scroll-view>
					<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
				</swiper-item>
			</swiper>
		</wwi-pulldown-refresh>
		<view class="item-bottom-box">
			<view class="goods-bottom flex flexrow">
				<view class="otreh-handle flex flexrow">
					<navigator :url="'/pages/my/chatinfo?tid='+info.store_info.default_im+'&goodsId='+goodsId" class="chat flex flexcol flexAic flexJcc">
						<view class="wwi-icon wwi-icon-wangwang"></view>
						<view class="">客服</view>
					</navigator>
					<view class="live flex flexcol flexAic flexJcc" :class="{now:info.is_favorate}" @click="favgoods">
						<view class="wwi-icon wwi-icon-shoucang"></view>
						<view class="">收藏</view>
					</view>
				</view>
				<view class="buy-handle flex flexrow flexAic" :class="{'no':!info.goods_hair_info.if_store || info.goods_info.goods_storage == 0}"
				 v-if="info.goods_info.pintuan_promotion == '1'">
					<view class="add-cart flex flexcol flexAic flexJcc" @click="getGoodsmask">
						<view class="em">￥{{info.goods_info.pintuan_goods_price}}</view>
						<view class="span">单独购买</view>
					</view>
					<view class="buy-now flex flexcol flexAic flexJcc" @click="getGoodsmask">
						<view class="em">￥{{info.goods_info.pintuan_price}}</view>
						<view class="span" v-if="logId > 0">参与拼单</view>
						<view class="span" v-else>发起拼单</view>
					</view>
				</view>
				<view class="buy-handle flex flexrow flexAic" :class="{'no':!info.goods_hair_info.if_store || info.goods_info.goods_storage == 0}"
				 v-else>
					<view class="add-cart flex flexAic flexJcc" @click="getGoodsmask" v-if="info.goods_info.cart == '1'">加入购物车</view>
					<view class="buy-now flex flexAic flexJcc" @click="getGoodsmask">立即购买</view>
				</view>
			</view>
			<view class="item-bottom-placeholder"></view>
		</view>

		<wwi-city-select :themeColor="themeColor" ref="wwiCitySelect" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel"
		 @onConfirm="onConfirm"></wwi-city-select>
		<wwi-mask-up ref="wwiMaskUp" leftText="取消" title="领取代金券">
			<view class="wwiapp-voucher-list">
				<view v-if="voucherList.length <= 0" class="wwi-nodata" style="position: sticky;padding: 2em 0;">
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
						<view class="time">至{{vc.voucher_t_end_date}}前使用</view>
					</view>
					<view class="btn" @click="getFreeVoucher(vc)">
						<view class="span">领取</view>
					</view>
				</view>
			</view>
		</wwi-mask-up>
		<wwi-mask-up ref="showChain" leftText="取消" title="门店列表">
			<view class="goods-detail-item goods-detail-chain flex flexcol">
				<view class="default flex flexrow flexJcs" v-for="(chain,ch) in chainList" :key="ch" v-if="chainList.length">
					<navigator :url="'/pages/web/chain?id='+chain.chain_id" class="dl flex flexcol">
						<view class="dt flex flexrow">{{chain.chain_name}}
							<view style="color: #007AFF; font-size: 0.65em;">查看</view>
						</view>
						<view class="dd">门店价格：{{chain.shopwwi_chain_price}}</view>
						<view class="dd">门店地址：{{chain.chain_address}}，电话：{{chain.chain_phone}}</view>
					</navigator>
					<navigator :url="'/pages/buy/buystep?goodsId='+goodsId+'&buynum=1&ifchain=1&chainId='+chain.chain_id" class="pp wwi-icon wwi-icon-baoguo_yidong"></navigator>
				</view>
			</view>
		</wwi-mask-up>
		<wwi-goods-mask ref="wwiGoodsMask" :goods="Number(goodsId)" :fid="Number(fid)" :logId="Number(logId)" :buyerId="Number(buyerId)"
		 @change="getuu" @onCart="clickGoodsMask"></wwi-goods-mask>
		<wwi-mask-up ref="shareBtn" leftText="取消" title="分享" bottomText="关闭">
			<view class="share-icon-text">
				<!-- #ifdef MP-WEIXIN -->
				<button class="share-li" open-type="share">
					<view class="wwi-icon wwi-icon-fenxiang"></view>
					<view class="share-text">分享给微信好友</view>
				</button>
				<!-- #endif -->
				<view class="share-li" @tap="share(value)" v-for="(value,sharekey) in providerList" :key="sharekey" v-if="providerList.length > 0">
					<view class="wwi-icon" :class="'wwi-icon-'+value.icon"  :style="{'color':value.color}"></view>
					<view class="share-text">{{value.name}}</view> 
				</view>
				<view class="share-li" @click="fileImgCanvas">
					<view class="wwi-icon wwi-icon-tupian" style="color: #ed5564;"></view>
					<view class="share-text">生成海报</view>
				</view>
				<view class="share-li" @click="copyLinkBtn">
					<view class="wwi-icon wwi-icon-lianjie" style="color: #007aff;"></view>
					<view class="share-text">复制连接</view>
				</view>
			</view>
		</wwi-mask-up>
		<wwi-mask-up ref="showCan" title="分享海报" bottomText="保存图片到手机" @onConfirm="canDownImg">
			<view class="showCan-mask-info">
				<view class="canvas-img">
					<image :src="canvasImg" mode="widthFix"></image>
				</view>
			</view>
		</wwi-mask-up>
		<view style="width: 0px; height: 0px; overflow: hidden; position: fixed; z-index: -1; left:-100%">
			<canvas canvas-id="mycanvas" :style="{'width':canWidth+'px','height':canHeight+'px'}"></canvas></view>

	</view>
</template>

<script>
	import Wwiposter from "@/components/wwi-poster/lib/Wwiposter.js";
	import wwiCitySelect from '@/components/wwi-city-select.vue';
	import wwiMaskUp from '@/components/wwi-mask-up.vue';
	import wwiGoodsMask from '@/components/wwi-goods-mask.vue';
	import wwiCountDown from "@/components/wwi-count-down.vue";
	import wwiPulldownRefresh from "@/components/wwi-pulldown-refresh";
	import wwiLoadMore from '@/components/wwi-load-more.vue';
	export default {
		components: {
			wwiCitySelect,
			wwiMaskUp,
			wwiGoodsMask,
			wwiCountDown,
			Wwiposter,
			wwiPulldownRefresh,
			wwiLoadMore
		},
		data() {
			return {
				offset: 0,
				refresh: false,
				reload: true,
				scrollInto: 0,
				ginfoNow: true,
				offsetbg: 0,
				enableScroll: true,
				goodsId: '600074',
				key: '',
				fid: 0,
				ifdudu: false,
				info: {
					gift_array: [],
					goods_commend_list: [],
					goods_eval_list: [],
					goods_evaluate_info: [],
					goods_hair_info: [],
					goods_image: [],
					goods_info: {
						contractlist: []
					},
					mansong_info: [],
					spec_list: [],
					store_info: {
						store_credit: {
							store_deliverycredit: [],
							store_desccredit: [],
							store_servicecredit: []
						}
					},
					goods_map_spec: [],
					is_favorate: false
				},
				goodsInfo: '',
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				voucherList: [],
				virtualList: [],
				chainList: [],
				noBuy: false,
				logId: 0,
				buyerId: 0,
				titleBg: 0,
				getGinfo: true,
				windowHeight: 0,
				canWidth: 300,
				canHeight: 300,
				canvasImg: '',
				copyLink: '',
				cartCount: '0',
				tabIndex: 0,
				isClickChange: false,
				mainHeight: '44',
				type: '',
				eveList: [],
				hasmore: true,
				curpage: 1,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop: false,
				loadingType: 0,
				providerList: []
			}
		},
		methods: {
			Inlimine() {
				const res = uni.getSystemInfoSync();
				this.windowHeight = res.windowHeight;
				this.canWidth = res.screenWidth;
				this.canHeight = res.screenHeight;
				this.ctx = uni.createCanvasContext('mycanvas');
				this.wwiopt({
					url: "/index.php?app=goods&wwi=goods_detail",
					data: {
						goods_id: this.goodsId,
						key: this.key,
						jfx_id: this.fid
					},
					success: res => {
						var data = res.data.datas;
						// #ifdef H5
						document.title = res.data.datas.goods_info.goods_name + '-' + this.siteTitle;
						// #endif
						if (!data.error) {
							if (data.goods_image) {
								var goods_image = data.goods_image.split(",");
								data.goods_image = goods_image;
							} else {
								data.goods_image = [];
							}
							if (data.goods_info.spec_name) {
								let goods_map_spec = [];

								for (let key in data.goods_info.spec_name) {
									var goods_specs = {};
									goods_specs["goods_spec_id"] = key;
									goods_specs['goods_spec_name'] = data.goods_info.spec_name[key];
									if (data.goods_info.spec_value) {
										for (let okey in data.goods_info.spec_value) {
											if (key == okey) {
												var specs_value = [];
												for (let fkey in data.goods_info.spec_value[okey]) {

													specs_value.push({
														specs_value_id: fkey,
														specs_value_name: data.goods_info.spec_value[okey][fkey]
													})
												}
												goods_specs['goods_spec_value'] = specs_value;
											}
										}
										goods_map_spec.push(goods_specs);
									} else {
										data.goods_info.spec_value = [];
									}
								}
								data.goods_map_spec = goods_map_spec;
							} else {
								data.goods_map_spec = [];
							}
							if (data.goods_info.hdtime) {
								data.goods_info.hdtime_down = Number(data.goods_info.hdtime) - Number(Math.round(new Date().getTime() / 1000));
							}
							this.info = data;
							if (data.goods_info.is_virtual == '1') {
								this.virtual();
							}
							if (data.goods_info.is_chain == '1') {
								this.chain();
							}
							setTimeout(res => {
								this.getGoodsInfo();
								this.curpage = 1;
								this.hasmore = true;
								this.loadList();
							}, 100)

						}
					}
				});
			},
			loadList: function(action = 'refresh') {
				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=goods&wwi=goods_evaluate',
					data: {
						goods_id: this.goodsId,
						type: this.type,
						page: 10,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.goods_eval_list.forEach(item => {
									this.info.eveList.push(item);
								});
								this.loadingType = 0;
							} else {
								this.eveList = res.data.datas.goods_eval_list;
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
			virtual() {
				uni.request({
					url: this.ApiUrl + '/index.php?app=goods&wwi=store_o2o_addr',
					data: {
						store_id: this.info.store_info.store_id
					},
					success: res => {
						if (!res.data.datas.error) {
							this.virtualList = res.data.datas.addr_list;
						}
					}
				});
			},
			chain() {
				uni.request({
					url: this.ApiUrl + '/index.php?app=goods&wwi=store_chain_addr',
					data: {
						goods_id: this.goodsId
					},
					success: res => {
						if (!res.data.datas.error) {
							this.chainList = res.data.datas.addr_list;
						}
					}
				});

			},
			async tapTab(index) { //点击tab-bar
				if (this.tabIndex === index) {
					return false;
				} else {
					this.isClickChange = true;
					this.tabIndex = index;
					if (this.tabIndex > 0) {
						this.reload = false;
						this.refresh = true;
						this.titleBg = 1;
						this.enableScroll = true;
						// #ifndef APP-PLUS
						this.mainHeight = uni.upx2px(100) + 44;
						// #endif
						// #ifdef APP-PLUS
						this.mainHeight = uni.upx2px(100) + 44 + uni.getSystemInfoSync().statusBarHeight;
						// #endif
					} else {
						this.reload = true;
						this.refresh = false;
						this.titleBg = this.offsetbg;
						this.mainHeight = uni.upx2px(100);
					}
				}
			},
			async changeTab(e) {
				if (!this.ginfoNow) {
					return false;
				}
				let index = e.detail.current;
				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}
				this.isClickChange = false;
				this.tabIndex = index;
				if (this.tabIndex > 0) {
					this.reload = false;
					this.refresh = true;
					this.enableScroll = true;
					this.titleBg = 1;
					// #ifndef APP-PLUS
					this.mainHeight = uni.upx2px(100) + 44;
					// #endif
					// #ifdef APP-PLUS
					this.mainHeight = uni.upx2px(100) + 44 + uni.getSystemInfoSync().statusBarHeight;
					// #endif
				} else {
					this.reload = true;
					this.refresh = false;
					this.titleBg = this.offsetbg;
					this.mainHeight = uni.upx2px(100);
				}
			},
			onPulldownReresh: function() {
				setTimeout(() => {
					if (this.tabIndex == 0) {
						this.ginfoNow = true;
						this.reload = true;
						this.refresh = false;
						this.mainHeight = uni.upx2px(100);
						this.scrollInto = 99999;
					} else if (this.tabIndex == 2) {
						this.curpage = 1;
						this.hasmore = true;
						this.loadList();
					}
					this.$refs.wwiPulldownRefresh && this.$refs.wwiPulldownRefresh.endPulldownRefresh();
				}, 600)
			},
			onPullupReload: function() {
				setTimeout(() => {
					if (this.tabIndex == 0) {
						this.ginfoNow = false;
						this.reload = false;
						this.refresh = true;
						this.titleBg = 1;
						this.scrollInto = 0;
						// #ifndef APP-PLUS
						this.mainHeight = uni.upx2px(100) + 44;
						// #endif
						// #ifdef APP-PLUS
						this.mainHeight = uni.upx2px(100) + 44 + uni.getSystemInfoSync().statusBarHeight;
						// #endif
					}
					this.$refs.wwiPulldownRefresh && this.$refs.wwiPulldownRefresh.endPullupLoad();
				}, 600)
			},
			//设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
			setEnableScroll(enable) {
				if (this.enableScroll != enable) {
					this.enableScroll = enable;
				}
			},
			itemScroll: async function(e) {
				if (this.ginfoNow) {
					let nowTop = e.mp.detail.scrollTop;
					this.titleBg = Number(nowTop / 300);
					this.offsetbg = this.titleBg;
					if ((nowTop / 300 > 0.2)) {
						this.leftColor = '#000000';
						this.rightColor = '#000000';
					} else {
						this.leftColor = '#fff';
						this.rightColor = '#fff';
					}
				}
			},
			favgoods: function() {
				if (!this.key) {
					this.checkLogin(0);
					return;
				}
				if (this.info.is_favorate) {
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites&wwi=favorites_del',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: this.key,
							fav_id: this.goodsId
						},
						success: res => {
							if (res.data.code == 200) {
								uni.showToast({
									title: '已取消收藏',
									icon: "none"
								});
								this.info.is_favorate = false;
							} else {
								uni.showToast({
									title: res.data.datas.error,
									icon: "none"
								});
							}
						}
					});
				} else {
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites&wwi=favorites_add',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: this.key,
							goods_id: this.goodsId
						},
						success: res => {
							if (res.data.code == 200) {
								uni.showToast({
									title: '收藏成功',
									icon: "none"
								});
								this.info.is_favorate = true;
							} else {
								uni.showToast({
									title: res.data.datas.error,
									icon: "none"
								});
							}
						}
					});
				}

			},
			// 城市联动选择
			onCancel(e) {
				console.log(e);
			},

			showMulLinkageThreePicker() {
				this.$refs.wwiCitySelect.show();
			},
			onConfirm(e) {
				this.info.goods_hair_info.area_name = e.label;
				var area_id = e.cityCode == 0 ? e.areaCode : e.cityCode;
				uni.request({
					url: this.ApiUrl + '/index.php?app=goods&wwi=calc',
					data: {
						goods_id: this.goodsId,
						area_id: area_id
					},
					success: res => {
						this.info.goods_hair_info.if_store_cn = res.data.datas.if_store_cn;
						this.info.goods_hair_info.content = res.data.datas.content;
					}
				});
			},
			//end
			showVoucher(e) {
				uni.request({
					url: this.ApiUrl + '/index.php?app=voucher&wwi=voucher_tpl_list',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						store_id: e.store_id,
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
			showChain() {
				this.$refs.showChain.show();
			},
			getGoodsmask() {
				this.$refs.wwiGoodsMask.show();
			},
			clickGoodsMask() {
				if (this.key) {
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_cart&wwi=cart_count',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							key: this.key
						},
						success: res => {
							if (typeof(res.data.datas.cart_count) != 'undefined') {
								uni.setStorageSync('cart_count', res.data.datas.cart_count);
								this.cartCount = Number(res.data.datas.cart_count);

							}
						}
					});
				}
			},
			getuu: function(e) {
				this.goodsId = e;
				this.Inlimine();
				this.goodsInfo = '';
				this.getGinfo = true;
				this.cartCount = uni.getStorageSync('cart_count');
			},
			getGoodsInfo: function() {
				if (!this.getGinfo) {
					return false;
				}
				uni.request({
					url: this.ApiUrl + "/index.php?app=goods&wwi=goods_body",
					data: {
						goods_id: this.goodsId
					},
					success: res => {
						res.data = res.data.replace(/\<img/gi, '<img style="max-width:100%;height:auto;vertical-align: middle" ');
						this.goodsInfo = res.data;
						this.getGinfo = false;
					}
				});
			},
			goBack: function() {
				var page = getCurrentPages();
				if (page.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/index'
					});
				}
			},
			shareBtn: function() {
				this.$refs.shareBtn.show();
			},
			fileImgCanvas: function() {
				this.$refs.shareBtn.pickerCancel();
				if (this.canvasImg) {
					this.$refs.showCan.show();
					return false;
				}
				var img = '';
				var _this = this;
				uni.showLoading({
					title: '图片生成中'
				});
				// #ifdef H5 || APP-PLUS
				uni.request({
					url: this.ApiUrl + '/index.php?app=index&wwi=base64EncodeImage',
					method: 'GET',
					data: {
						img: this.info.goods_image[0]
					},
					success: res => {
						img = res.data.datas;
						var userid = uni.getStorageSync('userid');
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#ffffff'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('20'),
							borderWidth: uni.upx2px('80'),
							borderColor: '#ff0036',
							width: this.canWidth,
							height: this.canHeight,
							top: uni.upx2px('78'),
							type: 'image'
						});
						poster.fillAbsText({
							top: uni.upx2px('20'),
							left: uni.upx2px('360'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('40'),
							color: '#FFFFFF',
							fontSize: uni.upx2px('32'),
							align: 'center',
							text: '发现好货 推荐给您',
							bold: true,
							type: 'text',
							textStyle: 'stroke'
						});
						poster.fillAbsText({
							top: uni.upx2px('108'),
							left: uni.upx2px('20'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('46'),
							maxLines: 2,
							color: '#12194C',
							fontSize: uni.upx2px('32'),
							align: 'left',
							text: _this.info.goods_info.goods_name,
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('228'),
							left: uni.upx2px('20'),
							color: '#ff0036',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '￥',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('218'),
							left: uni.upx2px('60'),
							color: '#ff0036',
							fontSize: uni.upx2px('40'),
							align: 'left',
							text: _this.info.goods_info.goods_promotion_price,
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: 360,
							sHeight: 360,
							width: _this.canWidth,
							height: _this.canWidth,
							type: 'image',
							top: uni.upx2px('278')
						});
						poster.drawQRCode({
							content: _this.copyLink,
							sWidth: 360,
							sHeight: 360,
							width: uni.upx2px('200'),
							height: uni.upx2px('200'),
							type: 'image',
							bottom: uni.upx2px('40'),
							left: uni.upx2px('80'),
							background: '#ffffff',
							color: '#12194C'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('150'),
							left: uni.upx2px('350'),
							color: '#12194C',
							fontSize: uni.upx2px('34'),
							align: 'left',
							text: _this.siteTitle + '小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#9e9e9e',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '长按识别小程序码',
							bold: true,
							type: 'text'
						});
						this.ctx.draw();
						_this.toTempFilePath();
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
					src: this.info.goods_image[0],
					success: res => {

						img = res.path;
						var userid = uni.getStorageSync('userid');
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#ffffff'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('20'),
							borderWidth: uni.upx2px('80'),
							borderColor: '#ff0036',
							width: this.canWidth,
							height: this.canHeight,
							top: uni.upx2px('78'),
							type: 'image'
						});
						poster.fillAbsText({
							top: uni.upx2px('20'),
							left: uni.upx2px('360'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('40'),
							color: '#FFFFFF',
							fontSize: uni.upx2px('32'),
							align: 'center',
							text: '发现好货 推荐给您',
							bold: true,
							type: 'text',
							textStyle: 'stroke'
						});
						poster.fillAbsText({
							top: uni.upx2px('108'),
							left: uni.upx2px('20'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('46'),
							maxLines: 2,
							color: '#12194C',
							fontSize: uni.upx2px('32'),
							align: 'left',
							text: _this.info.goods_info.goods_name,
							fontWeight: 'bold',
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('228'),
							left: uni.upx2px('20'),
							color: '#ff0036',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '￥',
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('218'),
							left: uni.upx2px('60'),
							color: '#ff0036',
							fontSize: uni.upx2px('40'),
							align: 'left',
							text: _this.info.goods_info.goods_promotion_price,
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: 360,
							sHeight: 360,
							width: _this.canWidth,
							height: _this.canWidth,
							type: 'image',
							top: uni.upx2px('278')
						});
						poster.drawQRCode({
							content: _this.copyLink,
							sWidth: 360,
							sHeight: 360,
							width: uni.upx2px('200'),
							height: uni.upx2px('200'),
							type: 'image',
							bottom: uni.upx2px('40'),
							left: uni.upx2px('80'),
							background: '#ffffff',
							color: '#12194C'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('150'),
							left: uni.upx2px('350'),
							color: '#12194C',
							fontSize: uni.upx2px('34'),
							align: 'left',
							text: _this.siteTitle + '小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#9e9e9e',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '长按识别小程序码',
							bold: true,
							type: 'text'
						});
						this.ctx.draw();
						_this.toTempFilePath();
					}
				});
				// #endif
			},
			toTempFilePath: function() {
				var that = this;
				setTimeout(() => {
					uni.canvasToTempFilePath({
						canvasId: 'mycanvas',
						success: function(res) {
							that.canvasImg = res.tempFilePath;
							that.$refs.showCan.show();
							console.log(res.tempFilePath)
						},
						fail: function(err) {
							console.error(JSON.stringify(err))
						}
					})
				}, 300);
				uni.hideLoading();
			},
			canDownImg: function() {
				// #ifdef H5
				var src = this.canvasImg;
				var link = document.createElement('a');
				//设置下载的文件名
				link.download = this.info.goods_info.goods_name;
				link.style.display = 'none';
				//设置下载路径
				link.href = src;
				//触发点击
				document.body.appendChild(link);
				link.click();
				//移除节点
				document.body.removeChild(link);
				// #endif
				// #ifdef MP-WEIXIN || APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: this.canvasImg,
					success: function() {
						uni.showToast({
							title: "保存成功",
							icon: "success",
						})
					}
				});
				// #endif
			},
			copyLinkBtn: function() {
				// #ifndef H5
				uni.setClipboardData({
					data: this.copyLink,
					success: function() {
						uni.showToast({
							title: '复制连接成功',
							icon: 'none'
						});
					}
				});
				// #endif
				// #ifdef H5
				var text = this.copyLink;
				const textarea = document.createElement("textarea");
				textarea.style.position = 'fixed';
				textarea.style.top = 0;
				textarea.style.left = 0;
				textarea.style.border = 'none';
				textarea.style.outline = 'none';
				textarea.style.resize = 'none';
				textarea.style.background = 'transparent';
				textarea.style.color = 'transparent';
				textarea.value = text; // 修改文本框的内容
				document.body.appendChild(textarea);
				textarea.select() // 选中文本
				try {
					const msg = document.execCommand('copy') ?
						'复制成功' : '复制失败';
					uni.showToast({
						title: msg,
						icon: 'none'
					});
				} catch (err) {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					});
				}
				document.body.removeChild(textarea)
				// #endif
			},
			async share(e) {
				let shareOPtions = {
					provider: e.id,
					scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
					type: 0,
					success: (e) => {
						uni.showModal({
							content: '分享成功',
							showCancel:false
						})
					},
					fail: (e) => {
						uni.showModal({
							content: e.errMsg,
							showCancel:false
						})
					},
					complete:function(){
					}
				}
				shareOPtions.summary = this.info.goods_info.goods_jingle ? this.info.goods_info.goods_jingle : this.siteTitle;
				shareOPtions.imageUrl = this.info.goods_image[0] ? this.info.goods_image[0] : this.WapSiteUrl + '/static/logo.png';
				shareOPtions.title = this.info.goods_info.goods_name ? this.info.goods_info.goods_name : this.siteTitle;
				shareOPtions.href = this.copyLink;
				uni.share(shareOPtions);
			}
		},
		onLoad: function(e) {
			if (e.goodsid) {
				this.goodsId = e.goodsid;
			} else {
				uni.showToast({
					title: '商品参数错误',
					icon: "none",
					success() {
						setTimeout(function() {
							var page = getCurrentPages();
							if (page.length > 1) {
								uni.navigateBack();
							} else {
								uni.switchTab({
									url: '/pages/index'
								});
							}
						}, 1000);
					}
				});
			}
			if (e.fid) {
				this.fid = e.fid;
			}
			if (e.logId) {
				this.logId = e.logId;
			}
			if (e.buyerId) {
				this.buyerId = e.buyerId;
			}
			if (e.invite) {
				uni.setStorageSync('invite');
			}
			this.key = uni.getStorageSync('key');
			this.Inlimine();
			this.copyLink = this.WapSiteUrl + '/pages/web/item?goodsid=' + this.goodsId + '&fid=' + this.fid + '&invite=' + uni.getStorageSync('userid');
			this.mainHeight = uni.upx2px(100);

			// #ifdef APP-PLUS
			uni.getProvider({
				service: 'share',
				success: (e) => {
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '微信好友',
									id: 'weixin',
									icon:'weixinicon',
									color:'#39b54a',
									sort: 0
								})
								data.push({
									name: '微信朋友圈',
									id: 'weixin',
									icon:'fenxiangweixinpengyouquan',
									color:'#8dc63f',
									type: 'WXSenceTimeline',
									sort: 1
								})
								break;
							case 'sinaweibo':
								data.push({
									name: '新浪微博',
									id: 'sinaweibo',
									color:'#f37b1d',
									icon:'xinlangweibo',
									sort: 2
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq',
									color:'#0081ff',
									icon:'QQ',
									sort: 3
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data.sort((x, y) => {
						return x.sort - y.sort
					});
				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
					uni.showModal({
						content: '获取分享通道失败',
						showCancel: false
					})
				}
			});
			// #endif
		},
		onShow: function(e) {
			this.key = uni.getStorageSync('key');
			this.cartCount = uni.getStorageSync('cart_count');
		},
		onShareAppMessage: function() {
			var userid = uni.getStorageSync('userid');
			return {
				title: this.info.goods_info.goods_name ? this.info.goods_info.goods_name : this.siteTitle,
				path: '/pages/web/item?goodsid=' + this.goodsId + '&fid=' + this.fid + '&invite=' + userid,
				imageUrl: this.info.goods_image[0] ? this.info.goods_image[0] : this.WapSiteUrl + '/static/logo.png'
			}
		}
	}
</script>

<style>
	@import "../../common/css/item.css";
</style>
