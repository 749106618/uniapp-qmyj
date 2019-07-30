<template>
	<view class="index">
		<scroll-view scroll-y class="swiper-box"  @scroll="scroll" @scrolltolower="getGoodsInfo" :style="{'height': windowHeight+'px'}">
			<view class="goods-tem"  id="goodsMain">
			<view class="goods-detail-top">
				<swiper class="goods-img" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="1000"
				 indicator-color="rgba(255,255,255,0.3)" indicator-active-color="#ff0036">
					<swiper-item class="flex flexAic" style="background: #000;" v-if="info.video_path">
						<video :src="info.video_path" style="width: 750upx; height: 570upx;"></video>
					</swiper-item>
					<swiper-item v-for="(pic,key) in info.goods_image" :key="key" @click="tapPicView(info.goods_image)">
						<view class="swiper-item">
							<image :src="pic" mode="widthFix"></image>
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
					<view class="time flex flexrow"><view class="flex flexAic" style="font-size: 24upx;">距结束</view><wwi-count-down :timer="info.goods_info.pintuan_end_time" v-if="info.goods_info.pintuan_end_time > 0" borderColor="transparent" splitorColor="#fff" bgrColor="#000"></wwi-count-down></view>
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
					<view class="time flex flexrow"><view class="flex flexAic" style="font-size: 24upx;">距结束</view><wwi-count-down :timer="info.goods_info.hdtime_down" v-if="info.goods_info.hdtime_down > 0" borderColor="transparent" splitorColor="#fff" bgrColor="#000"></wwi-count-down></view>
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
									<view class="wwi-icon wwi-icon-didiandingwei"></view>
								</view>
								<view class="dd">{{info.goods_hair_info.content}}</view>
								<view class="dd">销量：{{info.goods_info.goods_salenum}}{{info.goods_info.goods_unit}}</view>
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
							<navigator :url="'/pages/buy/buystep?goodsId='+goodsId+'&buynum=1&ifchain=1&chainId='+chainList[0].chain_id" class="pp wwi-icon wwi-icon-baoguo_yidong"></navigator>
						</view>
						<view class="more flex flexJcs flexrow"  @click="showChain">
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
<!-- 					<view class="goods-detail-store flex flexcol" v-if="info.store_info.is_own_mall != 1">
						<navigator :url="'/pages/web/store/store?id='+info.store_info.store_id" class="flex flexrow flexJcs flexAic">
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
					</view> -->
					</view></view>
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
<!-- 					<view class="goods-detail-recom flex flexcol" id="goodsRecom">
						<view class="h4">店铺推荐</view>
						<view class="ul flex flexrow">
							<navigator :url="'/pages/web/item/item?id='+item.goods_id" class="li flex flexcol" v-for="(item,kk) in  info.goods_commend_list"
							 :key="kk">
								<image :src="item.goods_image_url"></image>
								<view class="dl">
									<view class="dt">{{item.goods_name}}</view>
									<view class="dd flex flexrow">￥ <view class="em">{{item.goods_promotion_price}}</view>
									</view>
								</view>
							</navigator>
						</view>
					</view> -->
					<!-- 商品详情 -->
					<view class="goods-detail-info" id="goodsInfo">
						<view class="h4">继续上滑加载详情</view>
						<view class=""><rich-text :nodes="goodsInfo"></rich-text></view>
					</view>
					<view style="height: 88upx;"></view>
			<view class="goods-bottom flex flexrow">
				<view class="otreh-handle flex flexrow">
					<navigator :url="'/pages/my/chatinfo?tid='+info.store_info.default_im" class="chat flex flexcol flexAic flexJcc">
						<view class="wwi-icon wwi-icon-wangwang"></view>
						<view class="">客服</view>
					</navigator>
					<view class="live flex flexcol flexAic flexJcc" :class="{now:info.is_favorate}" @click="favgoods">
						<view class="wwi-icon wwi-icon-xiai"></view>
						<view class="">收藏</view>
					</view>
				</view>
				<view class="buy-handle flex flexrow flexAic" :class="{'no':!info.goods_hair_info.if_store || info.goods_info.goods_storage == 0}" v-if="info.goods_info.pintuan_promotion == '1'">
					<view class="add-cart flex flexcol flexAic flexJcc" @click="getGoodsmask"><view class="em">￥{{info.goods_info.pintuan_goods_price}}</view>
				<view class="span">单独购买</view></view>
					<view class="buy-now flex flexcol flexAic flexJcc" @click="getGoodsmask"><view class="em">￥{{info.goods_info.pintuan_price}}</view>
				<view class="span" v-if="logId > 0">参与拼单</view>
				<view class="span" v-else>发起拼单</view></view>
				</view>
				<view class="buy-handle flex flexrow flexAic" :class="{'no':!info.goods_hair_info.if_store || info.goods_info.goods_storage == 0}" v-else>
					<view class="add-cart flex flexAic flexJcc" @click="getGoodsmask" v-if="info.goods_info.cart == '1'">加入购物车</view>
					<view class="buy-now flex flexAic flexJcc" @click="getGoodsmask">立即购买</view>
				</view>

			</view>
		</scroll-view>
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
								<view class="dt flex flexrow">{{chain.chain_name}} <view style="color: #007AFF; font-size: 0.65em;">查看</view></view>
								<view class="dd">门店价格：{{chain.shopwwi_chain_price}}</view>
								<view class="dd">门店地址：{{chain.chain_address}}，电话：{{chain.chain_phone}}</view>
							</navigator>
							<navigator :url="'/pages/buy/buystep?goodsId='+goodsId+'&buynum=1&ifchain=1&chainId='+chain.chain_id" class="pp wwi-icon wwi-icon-baoguo_yidong"></navigator>
						</view> 
					</view>
		</wwi-mask-up>
		<wwi-goods-mask ref="wwiGoodsMask" :goods="Number(goodsId)" :fid="Number(fid)" :logId="Number(logId)" :buyerId="Number(buyerId)" @change="getuu"></wwi-goods-mask>
				<wwi-mask-up ref="shareBtn" leftText="取消" title="分享" bottomText="关闭">
					<view class="share-icon-text">
						<!-- #ifdef MP-WEIXIN -->
						<button class="share-li" open-type="share">
							<view class="wwi-icon wwi-icon-fenxiang" style="color: #4caf50;"></view>
							<view class="share-text">分享给微信好友</view>
						</button>
						<!-- #endif -->		
						<view class="share-li" @click="fileImgCanvas">
							<view class="wwi-icon wwi-icon-tupian" style="color: #ed5564;"></view>
							<view class="share-text">生成海报</view>
						</view>
						<view class="share-li" @click="copyLinkBtn">
							<view class="wwi-icon wwi-icon-lianjie"  style="color: #007aff;"></view>
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
		<view style="width: 0px; height: 0px; overflow: hidden; position: fixed; z-index: -1; left:-100%" id="copy">{{copyLink}}</view>
	</view>
</template>

<script>
	import Wwiposter from "../../../components/wwi-poster/lib/Wwiposter.js";
	import wwiCitySelect from '../../../components/wwi-city-select.vue';
	import wwiMaskUp from '../../../components/wwi-mask-up.vue';
	import wwiGoodsMask from '../../../components/wwi-goods-mask.vue';
	import wwiCountDown from "../../../components/wwi-count-down.vue";
	export default {
		components: {
			wwiCitySelect,
			wwiMaskUp,
			wwiGoodsMask,
			wwiCountDown,
			Wwiposter
		},
		data() {
			return {
				offset: '',
				goodsId: '600074',
				key: '',
				fid: 0,
				mid:'',
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
				goodsInfo:'',
				scrollInto: 'goodsMain',
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				voucherList: [],
				virtualList: [],
				chainList: [],
				noBuy:false,
				logId:0,
				buyerId:0,
				titleBg: 0,
				getGinfo:true,
				windowHeight:0,
				canWidth:300,
				canHeight:300,
				canvasImg:'',
				copyLink:''
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
							if(data.goods_info.hdtime){
								data.goods_info.hdtime_down = Number(data.goods_info.hdtime)-Number(Math.round(new Date().getTime()/1000));
							}
							this.info = data;
              if (data.goods_info.is_virtual == '1') {
            	     this.virtual();
              }
               if (data.goods_info.is_chain == '1') {
                        this.chain();
                 }
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
			getWidth: function(id) { //得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			scrollNow: function(e) {
				var _this = this;
				if(e=='goodsInfo'){
					if (e == this.scrollInto) {
						return false;
					} else {
						if(this.getGinfo){
						this.getGoodsInfo();
						setTimeout(function(){
							_this.scrollInto = e;
						},100)
						}else{
							this.scrollInto = e;
						}
					}

				}else{
					if (e == this.scrollInto) {
						return false;
					} else {
						this.scrollInto = e;
					}
				}


			},
			scroll: async  function(e) {
				let nowTop = e.mp.detail.scrollTop;
			this.titleBg = Number(nowTop / 300);
			if ((nowTop / 300 > 0.2)) {
				this.leftColor = '#000000';
				this.rightColor = '#000000';
			} else {
				this.leftColor = '#fff';
				this.rightColor = '#fff';
			}
				let g1 =  await this.getWidth('goodsMain');
				let g2 =  await this.getWidth('goodsEvaluation');
				let g3 =  await this.getWidth('goodsRecom');
				let g4 =  await this.getWidth('goodsInfo');
				var g2h = g1.height + g2.height;
				var g3h = g1.height + g2.height;
				var g4h = g1.height + g2.height + g4.height;
				if(nowTop < g1.height){
					this.scrollInto = 'goodsMain';
				}else if(nowTop > g1.height && nowTop < g2h){
					this.scrollInto = 'goodsEvaluation';
				}else if(g2h < nowTop && nowTop < g3h){
					this.scrollInto = 'goodsRecom';
				}else if(g3h < nowTop && nowTop < g4h){
					this.scrollInto = 'goodsInfo';
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
			showChain(){
				this.$refs.showChain.show();
			},
			getGoodsmask(){
							this.$refs.wwiGoodsMask.show();
					},
			getuu:function(e){
				this.goodsId = e;
				this.Inlimine();
				this.goodsInfo ='';
				this.getGinfo = true;
			},
			getGoodsInfo:function(){
				if(!this.getGinfo){
					return false;
				}
				uni.request({
					url: this.ApiUrl + "/index.php?app=goods&wwi=goods_body",
					data: {goods_id: this.goodsId},
					success: res => {
						res.data=res.data.replace(/\<img/gi, '<img style="max-width:100%;height:auto;vertical-align: middle" ');
						this.goodsInfo = res.data;
						this.getGinfo = false;
					}
				});
			},
			goBack:function(){
				var page = getCurrentPages();
				if(page.length > 1){
					uni.navigateBack();
				}else{
					uni.switchTab({  url:'/pages/index' });
				}
			},
			shareBtn:function(){
				this.$refs.shareBtn.show();
			},
			fileImgCanvas:function(){
				this.$refs.shareBtn.pickerCancel();
				if(this.canvasImg){
					this.$refs.showCan.show();
					return false;
				}
				var img = '';
				var _this =this;
				uni.showLoading({title:'图片生成中'});
				// #ifdef H5
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
							text: '我正在'+this.siteTitle +'购物，你也来吧！',
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
							text: _this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#9e9e9e',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '长按识别二维码',
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
					src:this.info.goods_image[0],
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
							text: '我正在'+this.siteTitle +'购物，你也来吧！',
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
							text: _this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#9e9e9e',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '长按识别二维码',
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
			canDownImg:function(){
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
				// #ifdef MP-WEIXIN
				uni.saveImageToPhotosAlbum({
					filePath: this.canvasImg,
					success: function () {
						uni.showToast({
						  title : "保存成功",
						  icon: "success",
						})
					}
				});
				// #endif
			},
            copyLinkBtn:function(){
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
                        const textarea = document.createElement("textarea") ;
                        textarea.style.position = 'fixed' ;
                        textarea.style.top = 0 ;
                        textarea.style.left = 0 ;
                        textarea.style.border = 'none' ;
                        textarea.style.outline = 'none' ;
                        textarea.style.resize = 'none';
                        textarea.style.background = 'transparent' ;
                        textarea.style.color = 'transparent';
                        textarea.value = text ;// 修改文本框的内容
                        document.body.appendChild(textarea);
                        textarea.select()// 选中文本
                        try { const msg = document.execCommand('copy') ?
                        '复制成功' : '复制失败' ;
						uni.showToast({
							title: msg,
							icon: 'none'
						});
                        } catch (err) { 						
							uni.showToast({
							title: '复制失败',
							icon: 'none'
						}); }
                        document.body.removeChild(textarea)
				// #endif
			}
		},
		onLoad: function(e) {
			if (e.goodsid) {
				this.goodsId = e.goodsid;
			}else{
				uni.showToast({
					title: '商品参数错误',icon:"none",
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
			if(e.fid){
				this.fid = e.fid;
			}
			if(e.logId){
				this.logId = e.logId;
			}
			if(e.buyerId){
				this.buyerId = e.buyerId;
			}
			if(e.invite){
				uni.setStorageSync('invite');
			}
			if(e.msid){
				this.mid = e.msid;
				uni.setStorageSync('msid',e.msid);
			}else{
				this.mid = uni.getStorageSync('msid');
			}
			this.key = uni.getStorageSync('key');
			this.Inlimine();
			this.copyLink = this.WapSiteUrl + '/pages/web/mshop/item?goodsid='+this.goodsId + '&fid='+ this.fid+ '&msid='+ this.mid;
		},
		onShow: function(e) {
			this.key = uni.getStorageSync('key');
		},
		onShareAppMessage:function(){
			var userid = uni.getStorageSync('userid');
			return {
				title: this.info.goods_info.goods_name ? this.info.goods_info.goods_name : this.siteTitle,
				path: '/pages/web/mshop/item?id='+this.goodsId + '&fid='+ this.fid + '&msid='+ this.mid
			}
		}
	}
</script>

<style>
	@import "../../../common/css/item.css";
</style>
