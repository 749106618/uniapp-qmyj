<template>
	<view :class="{'site-top':scollDowns,'site-down':scollTops}">
		<view class="site_header">
			<view class="site_header_b_img_out">
			  <view class="shop_branner_image">
				<image :src="info.store_info.mb_title_img" ></image>
			    </view>
			</view>
		  <view class="site_header_inner">
			<view class="site_header_b_img">
			  <view class="shop_branner_image">
				<image :src="info.store_info.mb_title_img" ></image>
			    </view>
			</view>
			<view class="store-header">
				<!-- #ifndef MP-WEIXIN -->
				<view class="leftIcon" @click="goBack"><view class="wwi-icon wwi-icon-xiangzuo"></view></view>
				<!-- #endif -->
				<view class="search-view">
					<view class="wwi-icon wwi-icon-sousuo"></view>
					<input class="search-input2" type="text" placeholder="搜索店内商品" disabled="true" @click="goSearch"  />
				</view>
				<!-- #ifndef MP-WEIXIN -->
				<view class="rightIcon"><view class="wwi-icon wwi-icon-iosgengduo"></view></view>
				<!-- #endif -->
				
			</view>
			<view class="shop-info flex flexrow">
				<image class="store-ava" :src="info.store_info.store_avatar" mode=""></image>
				<view class="store-int">
					<view class="store-name">{{info.store_info.store_name}}</view>
					<view class="store-extra">{{info.store_info.store_collect}}人收藏</view>
				</view>
				<view class="store-btn no" v-if="info.store_info.is_favorate" @click="favStore(info.store_info)">已收藏</view>
				<view class="store-btn" v-if="!info.store_info.is_favorate" @click="favStore(info.store_info)">收藏</view>
			</view>
			<view class="nav-bar">
				<view class="navbar_inner flex flexrow">
					<view class="li flex flexrow" :class="{'now':navBar=='index'}" @click="clickNavbar('index')"><view class="span">首页</view></view>
					<view class="li flex flexrow " :class="{'now':navBar=='goods'}" @click="clickNavbar('goods')"><view class="span">全部商品</view></view>
					<view class="li flex flexrow " :class="{'now':navBar=='new'}" @click="clickNavbar('new')"><view class="span">商品上新</view></view>
					<view class="li flex flexrow " :class="{'now':navBar=='activity'}" @click="clickNavbar('activity')"><view class="span">店铺活动</view></view>
				</view>
			</view>
		  </view>

		</view>
		<view class="index-control" v-if="navBar=='index'">
				<swiper class="wwiapp-store-sliders" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" v-if="info.store_info.mb_sliders.length">
					<swiper-item v-for="(pic,f) in info.store_info.mb_sliders" :key="f">
						<navigator :url="'/pages/web/tourl?url='+pic.link" class="item" v-if="pic.type == 1"><image :src="pic.imgUrl" mode="widthFix"></image></navigator>
						<navigator :url="'/pages/web/item?goodsid='+pic.link" class="item" v-else-if="pic.type == 2"><image :src="pic.imgUrl" mode="widthFix"></image></navigator> 
						<view class="item" v-else><image :src="pic.imgUrl" mode="widthFix"></image></view>

					</swiper-item>
				</swiper>
			<view class="wwiapp-store-block wwiapp-store-ranking">
				<view class="title">店铺排行榜</view>
				<view class="wwiapp-single-nav">
					<view class="ul flex flexrow">
						<view class="li" :class="{ok:single=='collect'}" @click="clickSingle('collect')"><view class="span">收藏排行</view></view>
						<view class="li" :class="{ok:single=='salenum'}" @click="clickSingle('salenum')"><view class="span">销量排行</view></view>
					</view>
				</view>
				<view class="top-list" v-show="single=='collect'">
					<navigator  :url="'/pages/web/item?goodsid='+coll.goods_id" class="goods-item" v-for="(coll,cv) in rank.collect" :key="cv">
						<view class="dt"><image :src="coll.goods_image_url"></image></view>
						<view class="dd flex flexrow"><view class="span">已售{{coll.goods_salenum}}</view><view class="span">￥{{coll.goods_price}}</view></view>
					</navigator>
				</view>
				<view class="top-list" v-show="single=='salenum'">
					<navigator  :url="'/pages/web/item?goodsid='+coll.goods_id" class="goods-item" v-for="(coll,cc) in rank.salenum" :key="cc">
						<view class="dt"><image :src="coll.goods_image_url"></image></view>
						<view class="dd flex flexrow"><view class="span">已售{{coll.goods_salenum}}</view><view class="span">￥{{coll.goods_price}}</view></view>
					</navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol">
				<view class="tit">店主推荐</view>
				<view class="goods-list flex flexrow">
					<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="li" v-for="(goods,k2) in info.rec_goods_list" :key="k2">
						<view class="image">
							<image :src="goods.goods_image_url" mode="widthFix" lazy-load></image>
						</view>
						<view class="goods-info">
							<view class="goods-title">{{goods.goods_name}}</view>
							<view class="goods-price">￥{{goods.goods_price}}</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="goods-control"  :class="{'grid':plist,'list':!plist}" v-if="navBar=='goods'">
		<view class="goods-search-nav">
			<view class=" flex flexrow flexAic flexAcc flexJcc sore-nav">
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_default'}" id="sort_default" @click="orderShow">{{defaultSort}}<text class="i"></text></view>
				<view class="li flex flexJcc flexAic" :class="{'now':ordershow=='sort_num'}" id="sort_num" data-order="2" data-key="3"  @click="orderShow">销量优先</view>
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_show'}" id="sort_show"  @click="orderShow">筛选<view class="i"></view></view>
				<view class="li" style="width: 2em; flex: none; font-size: 1.2em;" @click="plist=!plist"><view class="wwi-icon" :class="{'wwi-icon-yingyongAPP':plist,'wwi-icon-liebiao':!plist}"></view></view>
				
			</view>
			<view class="goods-sort-inner flex flexcol" v-show="sortMask"  catchtouchmove="true">
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='综合排序'}" data-name="综合排序" data-order='' data-key='' @click="sortShow">综合排序<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从高到低'}" data-name="价格从高到低" data-order='2' data-key='2' @click="sortShow">价格从高到低<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从低到高'}" data-name="价格从低到高" data-order='1' data-key='2' @click="sortShow">价格从低到高<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='人气排序'}" data-name="人气排序" data-order='2' data-key='5' @click="sortShow">人气排序
			<view class="wwi-icon wwi-icon-duihao"></view>
			</view>
			
		</view>
		
		</view><view class="mask" v-show="sortMask" @click="sortMask=false"></view>
		<view class="wwiapp-full-mask-bg" v-show="showDv==1" @click="showDv=2"  catchtouchmove="true"></view>
		<view class="wwiapp-full-mask" v-if="showDv>0" :class="{'hide':showDv==0,'left':showDv==1,'right':showDv==2}"  catchtouchmove="reue">
			<view class="wwiapp-full-mask-block flex flexcol">
				<scroll-view class="sea-list" scroll-y>
					<view class="dl">
						<input type="text" value="" />
						<view class="dt">价格区间</view>
						<view class="dd flex flexAic flexrow">
							<view class="inp-block"><input type="number" @input="changeBo" v-model="advShow.price_from" id='price_from' placeholder="最低价" placeholder-style="color:#4caf50;" /></view>
							<view class="">-</view>
							<view class="inp-block"><input type="number" @input="changeBo" :disabled="advShow.price_from < 0.01" v-model="advShow.price_to" id='price_to' placeholder="最高价" placeholder-style="color:#f44336;" /></view>
						</view>
					</view>
				</scroll-view>
				<view class="sea-btn flex flexrow">
					<button class="btn-g btnA" @click="searchBtn('reset')">重置</button>
					<button class="btn-g btnB" @click="searchBtn('go')">确定</button>
				</view>

			</view>
		</view>
			<view class="goods-secrch-list">
				<view v-if="!goods_list.length" class="wwi-nodata" style="position: absolute; z-index: -1;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">没有查询到相关商品</view>
							<view class="dd">你可以换个关键词或条件查询</view>
						</view>
					</view>
				</view>
				<view class="goods-item" v-for="(item,index2 ) in goods_list" :key="index2" v-if="goods_list.length > 0">
					<view class="goods-pic">
						<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
							<image :src="item.goods_image_url"  lazy-load/></image>
						</navigator>
					</view>
					<view class="goods-info">
						<view class="goods-name">
							<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
								<text class="h4">{{item.goods_name}}</text>
								<text class="h6">{{item.goods_jingle}}</text>
							</navigator>
						</view>
						<view class="goods-sale">
							<view :url="'/pages/web/item?goodsid='+item.goods_id" class="flex flexJcs flexAic">
								<view class="goods-price">￥<text class="em">{{item.goods_price}}</text>
									<view class="phone-sale" v-if="item.sole_flag">
										<view class="wwi-icon wwi-icon-shouji"></view>手机专享
									</view>
								</view>

								<text class="sale-type" v-if="item.is_virtual == 1">虚拟</text>
								<text class="sale-type" v-if="item.is_presell == 1">预</text>
								<text class="sale-type" v-if="item.is_fcode == 1">F</text>
								<text class="sale-type" v-if="item.group_flag || item.xianshi_flag">降</text>
								<text class="sale-type" v-if="item.have_gift == 1">赠</text>
							</view>
						</view>
						<view class="goods-assist">
							<navigator class="goods-sold" :url="'/pages/web/item?goodsid='+item.goods_id">销量
								<text class="em">{{item.goods_salenum}}</text>
							</navigator>
							<view class="goods-store">
								<view class="wwi-icon wwi-icon-iosgengduo" @click="storeFav(item)"></view>
								<view class="store-fav-goods" v-if="item.click">
									<view class="fac-goods-mask" @click="storeFav(item)"></view>
									<view class="btn flex flexcol" :class="{'ok':item.is_fav}" @click="favGoods(item)">
										<view class="wwi-icon wwi-icon-shoucang"></view>
										<view class="test-fav" v-if="item.is_fav">已收藏</view>
										<view class="test-fav" v-if="!item.is_fav">收藏</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="new-goods-control list" v-if="navBar=='new'">
			<view class="goods-secrch-list">
				<view v-if="!new_list.length" class="wwi-nodata" style="position: absolute; z-index: -1;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">商铺最近没有新品上架</view>
							<view class="dd">收藏店铺经常来逛一逛</view>
						</view>
					</view>
				</view>
				<view class="goods-item" v-for="(item,index3 ) in new_list" :key="index3" v-if="new_list.length > 0">
					<view class="goods-pic">
						<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
							<image :src="item.goods_image_url"  lazy-load/></image>
						</navigator>
					</view>
					<view class="goods-info">
						<view class="goods-name">
							<navigator class="a" :url="'/pages/web/item?goodsid='+item.goods_id">
								<text class="h4">{{item.goods_name}}</text>
								<text class="h6">{{item.goods_jingle}}</text>
							</navigator>
						</view>
						<view class="goods-sale">
							<view :url="'/pages/web/item?goodsid='+item.goods_id" class="flex flexJcs flexAic">
								<view class="goods-price">￥<text class="em">{{item.goods_price}}</text>
									<view class="phone-sale" v-if="item.sole_flag">
										<view class="wwi-icon wwi-icon-shouji"></view>手机专享
									</view>
								</view>

								<text class="sale-type" v-if="item.is_virtual == 1">虚拟</text>
								<text class="sale-type" v-if="item.is_presell == 1">预</text>
								<text class="sale-type" v-if="item.is_fcode == 1">F</text>
								<text class="sale-type" v-if="item.group_flag || item.xianshi_flag">降</text>
								<text class="sale-type" v-if="item.have_gift == 1">赠</text>
							</view>
						</view>
						<view class="goods-assist">
							<navigator class="goods-sold" :url="'/pages/web/item?goodsid='+item.goods_id">销量
								<text class="em">{{item.goods_salenum}}</text>
							</navigator>
						</view>
					</view>
				</view>
			</view>
			</view>
			<view class="activity-control" v-if="navBar=='activity'">
				<navigator :url="'/pages/web/storegoods?sid='+storeId" class="store-sale-block" v-if="activity.promotion.mansong">
					<view class="store-sale-tit">
						<view class="h3">{{activity.promotion.mansong.mansong_name}}</view>
						<view class="time">活动时间：{{activity.promotion.mansong.start_time_text}} 至 {{activity.promotion.mansong.end_time_text}}</view>
						</view>
					<view class="sotre-sale-con">
						<view class="mjs">
							<view class="li" v-for="(ms,bv) in activity.promotion.mansong.rules" :key="bv">
								单笔订单消费满<view class="em">{{ms.price}}</view>
								<view class="flex flexrow" v-if="ms.discount">,立减现金<view class="em">{{ms.discount}}</view></view>
								<view class="flex flexrow" v-if="ms.goods_id>0">,还可获赠品<image :src="ms.goods_image_url"></image>&nbsp;。</view>
							</view>
						</view>
						<view class="note" v-if="activity.promotion.mansong.remark">活动说明：{{activity.promotion.mansong.remark}}</view>
					</view>
				</navigator>
				<navigator :url="'/pages/web/storegoods?sid='+storeId" class="store-sale-block" v-if="activity.promotion.xianshi">
					<view class="store-sale-tit">
						<view class="h3">{{activity.promotion.xianshi.xianshi_name}}</view>
						<view class="time">活动时间：{{activity.promotion.xianshi.start_time_text}} 至 {{activity.promotion.xianshi.end_time_text}}</view>
					 </view>
					 <view class="sotre-sale-con">
						 <view class="xs">
							 <view class="li flex flexrow">单件活动商品满<view class="em">{{xianshi.lower_limit}}</view>件即可享受折扣价。</view>
						 </view>
					 </view>
					 <view class="note" v-if="activity.promotion.xianshi.xianshi_explain">活动说明：{{activity.promotion.xianshi.xianshi_explain}}</view>
				</navigator>
				<view v-if="activity.promotion.length <= 0" class="wwi-nodata" style="position: absolute; z-index: -1;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">商铺最近没有促销活动</view>
							<view class="dd">收藏店铺经常来逛一逛</view>
						</view>
					</view>
				</view>
			</view>
		<view class="bottom">
			<view class="ul flex flexrow">
				<navigator url="/pages/web/storesearch" class="li">商品分类</navigator>
				<navigator :url="'/pages/web/storeinfo?id='+info.store_info.store_id" class="li">店铺详情</navigator>
				<view class="li" @click="showVoucher">免费领券</view>
				<navigator :url="'/pages/my/chatinfo?tid='+info.store_info.default_im" class="li">联系客服</navigator>
			</view>
		</view>
		<wwi-mask-up ref="wwiMaskUp" leftText="取消" title="领取代金券" >
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
					<view class="btn" @click="getFreeVoucher(vc)"><view class="span">领取</view></view>
				</view>
			</view>
		</wwi-mask-up>
		<view style="height: 80upx;"></view>
	</view>
</template>

<script>
	import wwiMaskUp from '../../components/wwi-mask-up.vue';
	export default {
		data(){
			return{
				offset: '',
				navBar:'index',
				scollDowns:false,
				scollTops:false,
				key:'',
				storeId:'1',
				info:{
					store_info:{
						mb_sliders:[]
					}
				},
				voucherList:[],
				single:'collect',
				rank:{
					collect:[],
					salenum:[]
				},
				defaultSort:'综合排序',
				ordershow:'sort_default',
				sortMask:false,
				hasmore:true,
				curpage:1,
				skey:'',
				order:'',
				goods_list:[],
				new_list:[],
				hasmore2:true,
				curpage2:1,
				advShow:{
					price_from:'',
					price_to:''
				},
				showDv:0,
				plist:false,
				activity:{
					promotion:[]
				}
				
			}
		},
		components: {
			wwiMaskUp
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: "/index.php?app=store&wwi=store_info",
					method: 'POST',
					data: {key: this.key, store_id: this.storeId},
					success: res => {
						// #ifndef APP-PLUS
						uni.setNavigationBarTitle({
							title:res.data.datas.store_info.store_name
						});
						// #endif

						
						this.info = res.data.datas;
					}
				});
			},
			get_list() {
				if (!this.hasmore) {
					return false;
				}
				this.hasmore = false;
				var param = {};
				param.page = 10;
				param.curpage = this.curpage;
				if (this.storeId != '') {
					param.store_id = this.storeId;
				}
				if (this.skey != '') {
					param.key = this.skey;
				}
				if (this.order != '') {
					param.order = this.order;
				}
				if(this.advShow.price_from > 0 && this.advShow.price_to > 0){
					param.price_from = this.advShow.price_from;
					param.price_to = this.advShow.price_to;
				}
				this.wwiopt({
					url: '/index.php?app=store&wwi=store_goods',
					data: param,
					success: res => {
						if(res.data.code==200){
							this.curpage += 1;
								res.data.datas.goods_list.forEach(item => {
									this.$set(item,'click',false);
									this.$set(item,'is_load',false);
									this.$set(item,'is_fav',false);
									this.goods_list.push(item);
								});
						this.hasmore = res.data.hasmore;
						}else{
							uni.showToast({
								title: '列表加载异常',icon:"none"
							});
						}
					}
				});
			},
			setScrollNum:function(e){
				if(e.scrollTop < this.offset){
					this.scollTops = true;
				}else{
					this.scollTops = false;
				}
				this.offset = e.scrollTop;
				if(this.offset >30){
					this.scollDowns = true;
				}else{
					this.scollDowns = false;
					this.scollTops = false;
				}
				},
			goSearch:function(){
				uni.navigateTo({
					url:'/pages/web/storesearch'
				})
			},
			goBack:function(){
				var page = getCurrentPages();
				if(page.length > 1){
					uni.navigateBack();
				}else{
					uni.switchTab({  url:'/pages/index' });
				}
			},
			showVoucher(){
				uni.request({
					url: this.ApiUrl + '/index.php?app=voucher&wwi=voucher_tpl_list',
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {store_id: this.storeId, gettype: 'free'},
					success: res => {
						if(res.data.code==200){
							this.voucherList = res.data.datas.voucher_list;
						}
					}
				});
				this.$refs.wwiMaskUp.show();
			},
			getFreeVoucher(e) {
			if (!this.key) { this.checkLogin(0); return; }
			uni.request({
				url: this.ApiUrl+"/index.php?app=member_voucher&wwi=voucher_freeex",
				method: 'POST',
				header: {'content-type': 'application/x-www-form-urlencoded'},
				data: {tid:e.voucher_t_id,key:this.key},
				success: res => {
					this.checkLogin(res.data.login);
					var msg = '领取成功';
					if(res.data.datas.error){
						msg = '领取失败' + res.data.datas.error;
					}
					uni.showToast({
						title: msg,icon:"none"
					});
				}
			});
			},
			favStore:function(e){
				if(!this.key){
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								uni.redirectTo({
									url:'/pages/web/login'
								})
							}
						}
					});
					return false;
				}
				if(e.is_favorate){
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites_store&wwi=favorites_del',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,store_id:e.store_id},
						success: res => {
							if (res.data.code == 200) {
								    e.is_favorate=false;
									e.store_collect-=1;
								}else{
									uni.showToast({
										title: res.data.datas.error,icon:"none"
									});
								}
						}
					});
				}else{
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites_store&wwi=favorites_add',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,store_id:e.store_id},
						success: res => {
							if (res.data.code == 200) {
								e.store_collect+=1;
								    e.is_favorate=true;
								}else{
									uni.showToast({
										title: res.data.datas.error,icon:"none"
									});
								}
						}
					});
				}
			},
			clickSingle(e){
				if(e==this.single){
					return false;
				}else{
					this.single = e;
					this.getRank()
				}
			},
			getRank(){
				uni.request({
					url: this.ApiUrl + '/index.php?app=store&wwi=store_goods_rank',
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {store_id: this.storeId, ordertype:this.single+'desc', num:3},
					success: res => {
						if (res.data.code == 200) {
							if(this.single=='collect'){
								this.rank.collect= res.data.datas.goods_list;
							}else{
								this.rank.salenum= res.data.datas.goods_list;
							}
							
						}
					}
				});
			},
			clickNavbar(e){
				if(e==this.navBar){
					return false;
				}
				this.navBar = e;
				if(this.navBar=='goods'){
					this.get_list();
				}else if(this.navBar=='new'){
				this.getNewList();
			    }else if(this.navBar=='activity'){
					this.getActivity()
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			orderShow(e){
				if(e.target.id=='sort_default'){
					this.ordershow = 'sort_default';
					if(this.sortMask == true){
						this.sortMask = false;
					}else{
						this.sortMask = true;
					}
					
				}else if(e.target.id=='sort_num'){
					this.order = e.target.dataset.order;
					this.skey = e.target.dataset.key;
					this.hasmore = true;
					this.curpage = 1;
					this.sortMask= false;
                    this.goods_list=[];
					this.get_list();
				    uni.pageScrollTo({
				    	scrollTop: 0,
				    	duration: 300
				    });
				}else if(e.target.id=='sort_show'){
					if(this.showDv != 1){
						this.showDv = 1;
					}else{
						this.showDv = 2;
					}
				}
				this.ordershow = e.target.id;
			},
			sortShow:function(e){
				this.defaultSort = e.target.dataset.name;
					this.order = e.target.dataset.order;
					this.skey = e.target.dataset.key;
					this.hasmore = true;
					this.curpage = 1;
					this.sortMask= false;
                    this.goods_list=[];
					this.get_list();
				    uni.pageScrollTo({
				    	scrollTop: 0,
				    	duration: 300
				    });
			},
			storeFav:function(e){
				e.click=!e.click;
				if(!e.is_load){
					if(this.key){
				uni.request({
					url: this.ApiUrl + "/index.php?app=member_favorites&wwi=favorites_info",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key: this.key, fav_id: e.goods_id},
					success: res => {
						if(res.data.code==200){
							if (res.data.datas.favorites_info) {
								e.is_fav = true;
							}
						    e.is_load = true;
						}
					}
				});}
				}
			},
			favGoods:function(e){
				if(!this.key){
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								uni.redirectTo({
									url:'/pages/web/login'
								})
							}
						}
					});
					return false;
				}
				if(e.is_fav){
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites&wwi=favorites_del',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,fav_id:e.goods_id},
						success: res => {
							if (res.data.code == 200) {
								    e.is_fav=false;
								}else{
									uni.showToast({
										title: res.data.datas.error,icon:"none"
									});
								}
						}
					});
				}else{
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites&wwi=favorites_add',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,goods_id:e.goods_id},
						success: res => {
							if (res.data.code == 200) {
								    e.is_fav=true;
								}else{
									uni.showToast({
										title: res.data.datas.error,icon:"none"
									});
								}
						}
					});
				}
			},
			searchBtn:function(e){
				if(e=='reset'){
					this.advShow = {
						price_from:'',
						price_to:''
					}
				}else{
					this.hasmore = true;
					this.curpage = 1;
					this.showDv= 2;
					this.goods_list=[];
					this.get_list();
				}
			},
			getNewList(){
				if(!this.hasmore2){
					return false;
				}
				uni.showLoading({	title: '加载中'});
				uni.request({
					url: this.ApiUrl + '/index.php?app=store&wwi=store_new_goods',
					data:{page:10,curpage:this.curpage2,store_id:this.storeId},
					success: res => {
						if(res.data.code==200){
							this.curpage2 += 1;
								res.data.datas.goods_list.forEach(item => {
									this.new_list.push(item);
								});
						this.hasmore2 = res.data.hasmore;
						}else{
							uni.showToast({
								title: '列表加载异常',icon:"none"
							});
						}
					}
				});
				uni.hideLoading();
			},
			getActivity(){
				uni.request({
					url: this.ApiUrl + "/index.php?app=store&wwi=store_promotion",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {store_id: this.storeId},
					success: res => {
						 this.activity = res.data.datas;
					}
				});
			}
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('key');
			if(e.storeid){
				this.storeId =e.storeid;
			this.Inlimine();
			this.getRank();
			}else{
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
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
		},
		onPageScroll(e) {
             this.setScrollNum(e);
		},
		onReachBottom:function(){
			if(this.navBar=='goods'){
			this.get_list();
			}else if(this.navBar=='new'){
				this.getNewList();
			}
			
		}
	}
</script>

<style>
	.search-view .wwi-icon{font-size: 24px;}
.site_header_inner {position: relative;width: 100%;left: 0;right: 0;margin: 0 auto;max-height: 174px;z-index: 30;overflow: hidden;}
.site_header_b_img_out{position: relative;width: 100%;left: 0;right: 0;margin: 0 auto;z-index: -1;top: 0;}
.site_header_b_img{position: absolute;width: 100%;height: 100%;bottom: 0;z-index: -1;}
.shop_branner_image{    width: 100%;height: 250px;overflow: hidden;position: absolute;top: 0;left: 0;background: #666;}
.shop_branner_image::before {content: "";display: block;position: absolute;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0,0,0,.5);z-index: 1;}
.shop_branner_image::after {content: "";display: block;position: absolute;z-index: 2;top: 124px;left: 0;right: 0;bottom: 0;background: linear-gradient(180deg,transparent 0,hsla(0,0%,100%,.8) 80%,#FFFFFF);}
.shop_branner_image image {position: absolute;top: 0;left: 50%;-webkit-transform: translateX(-50%);transform: translateX(-50%);display: block;width: 750upx;height: auto; z-index: 1;}
.shop_branner_image image{    width: 750upx;height: 250px;filter: blur(10px); }
.shop-info{padding:20px 10px 10px 10px; align-items: center;}
.shop-info .store-ava{width: 50px; height: 50px; border-radius:5px ;}
.shop-info .store-int{flex: 1; margin-left: 10px;}
.shop-info .store-int .store-name{color: #FFFFFF; font-size: 18px;}
.shop-info .store-int .store-extra{font-size: 13px; color: #FFFFFF;}
.shop-info .store-btn{background: #FF0036; color: #FFFFFF; font-size: 14px;line-height: 20px; height: 20px;padding: 0 10px; display: flex; align-items: center; border-radius:1em ; justify-content: center;}
.shop-info .store-btn.no{background: #666;}
.nav-bar{}
.nav-bar .navbar_inner {position: relative;box-sizing: border-box;height: 50px;overflow: hidden;flex-wrap: nowrap;}
.nav-bar .navbar_inner .li{flex: 1;text-align: center; color: #FFFFFF; justify-content: center; align-items: center;}
.nav-bar .navbar_inner .li .span{ position: relative;font-size: 14px;}
.nav-bar .navbar_inner .li.now .span{font-weight: bold;}
.nav-bar .navbar_inner .li.now .span:after {content: "";display: block;width: 100%;height: 2px;position: absolute;left: 0;bottom: -5px;background: #fff;border-radius: 5px;}
.store-header{font-size: 16px; height: 44px; display: flex; align-items: center; padding: 0 10px;}
/* #ifdef APP-PLUS */
.site_header .site_header_inner{padding-top:var(--status-bar-height);}
/* #endif */
.store-header .leftIcon .wwi-icon{color: #FFFFFF; font-size: 24px;padding-right:5px;}
.store-header .rightIcon .wwi-icon{color: #FFFFFF;font-size: 24px;padding-left:5px;}
.site-top .site_header_b_img_out, .site-top .site_header_inner{transition: transform .3s,-webkit-transform .3s;}
.site-top .site_header_inner {position: fixed;top: -var(--status-bar-height);transform: translateY(-44px);}
.site-top  .shop-info{display: none;}
.site-top .site_header_b_img_out {position: fixed;top: 0;z-index: -1;transform: translateY(-120px);}
.site-down .site_header_inner {transform: translateY(0); top: 0px;} 
.site-top .goods-search-nav{position: fixed; top: 50px; width: 100%; z-index: 998;transition: top .3s;}
.site-down .goods-search-nav{position: fixed; top: 94px; width: 100%; z-index: 998;transition: top .3s;}
.goods-search-nav .wwi-icon{font-size: 24px;}

.bottom{position: fixed;left: 0;right: 0;bottom: 0;margin: 0 auto;z-index: 20; background: #F5F5F5;}
.bottom .ul{height: 80upx; line-height: 80upx}
.bottom .ul:before{ content: "";height: 0;display: block;border-top: 1px solid #ddd;position: absolute;left: 0;right: 0;top: 0;}
.bottom .ul .li{flex: 1; display: flex; justify-content: center; font-size: 26upx; position: relative;}
.bottom .ul .li:not(:first-child):before {content: "";width: 0;display: block;border-left: 1px solid #ddd;position: absolute;top: 0;bottom: 0;left: 0;}
.search-view {flex: 1; align-items: center;display: flex;flex-direction: row;background-color: rgba(255,255,255,0.9);height: 30px;border-radius: 0.78125em;padding: 0 0.8em; font-size: 0.875em;box-sizing: border-box; margin: 0 auto;}
.search-input2 {flex: 1;padding: 0 0.46875em;}
.wwiapp-home-block{}
.wwiapp-home-block .tit{height: 50upx; padding: 20upx; display: flex; align-items: center; background: #fff; font-size: 32upx; margin-top: 20upx;}
.wwiapp-home-block .tit:before{width: 14upx; background: #FF0036; margin-right: 20upx; content: ''; height: 30upx;}
.wwiapp-home-block .goods-list{flex-wrap: wrap;}
.wwiapp-home-block .goods-list .li{width: 375upx; background: #FFFFFF; border-top:1px solid #eee ; box-sizing: border-box; overflow: hidden;}
.wwiapp-home-block .goods-list .li:nth-child(even){border-left:1px solid #eee ;}
.wwiapp-home-block .goods-list .li .image{width: 335upx; height: 335upx; margin: 20upx;}
.wwiapp-home-block .goods-list .li .image image{width: 335upx;}
.wwiapp-home-block .goods-list .li .goods-info{margin: 20upx;}
.wwiapp-home-block .goods-list .li .goods-info .goods-title{font-size: 26upx; line-height: 35upx; max-height: 70upx; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;}
.wwiapp-home-block .goods-list .li .goods-info .goods-price{font-size: 32upx; color: #FF0036;}
page{background: transparent;}

.wwiapp-voucher-list .li{margin: 20upx 0;}
.wwiapp-voucher-list .li .dl{flex: 1;}
.wwiapp-voucher-list .li .dl .money{color: #FF0036; font-size: 36upx; line-height: 50upx; align-items: baseline;}
.wwiapp-voucher-list .li .dl .money .em{font-size: 50upx; margin: 0 5upx;}
.wwiapp-voucher-list .li .dl .need{font-size: 28upx; line-height: 35upx; color: #333;}
.wwiapp-voucher-list .li .dl .time{font-size: 26upx;line-height: 30upx;color: #888;}
.wwiapp-voucher-list .li .btn{width: 100upx; display: flex; justify-content: flex-end; align-items: center;}
.wwiapp-voucher-list .li .btn .span{border:2upx solid #eee; color: #777; padding: 5upx 14upx; font-size: 30upx;}

.wwiapp-store-block{background-color: #FFF;border-bottom: solid 1px #EEE;border-top: solid 1px #EEE;margin-top: 20upx;}
.wwiapp-store-block .title {font-size: 32upx;padding: 30upx;}
.wwiapp-store-block .wwiapp-single-nav{    width: 98%;height: 80upx;padding: 0 1%;background: #FFF;border-bottom: solid 1px #EEE;}
.wwiapp-store-block .wwiapp-single-nav .ul{height: 100%;}
.wwiapp-store-block .wwiapp-single-nav .ul .li{flex: 1; display: flex; align-items: center; justify-content: center;}
.wwiapp-store-block .wwiapp-single-nav .ul .li .span{border-bottom: 2px solid transparent; height: 100%; font-size: 30upx; display: flex; align-items: center;}
.wwiapp-store-block .wwiapp-single-nav .ul .li.ok .span{border-color:#FF0036 ; color: #FF0036;}
.wwiapp-store-block .top-list{height: 468.75upx; overflow: hidden; margin:20upx; position: relative;}
.wwiapp-store-block .top-list .goods-item:nth-child(1) {width: 468.75upx;height: 468.75upx; position: absolute;left: 0; top: 0;}
.wwiapp-store-block .top-list .goods-item:nth-child(1) image{width:468.75upx;height: 468.75upx; vertical-align: middle;}
.wwiapp-store-block .top-list .goods-item:nth-child(2) {width: 225upx;height:225upx; position: absolute;right: 0; top: 0;}
.wwiapp-store-block .top-list .goods-item:nth-child(2) image{width: 225upx;height: 225upx; vertical-align: middle;}
.wwiapp-store-block .top-list .goods-item:nth-child(3) {width: 225upx;height:225upx; position: absolute;right: 0; top: 243.75upx;}
.wwiapp-store-block .top-list .goods-item:nth-child(3) image{width: 225upx;height: 225upx; vertical-align: middle;}
.wwiapp-store-block .top-list .goods-item .dd {position: absolute;z-index: 1;bottom: 0;left: 0;right: 0;background-color: rgba(0,0,0,0.50);}
.wwiapp-store-block .top-list .goods-item .dd .span {display: inline-block;width: 40%;height: 40upx;padding: 8upx 5%;font-size: 24upx;line-height: 40upx;color: #FFF;}
.wwiapp-store-block .top-list .goods-item:nth-child(2) .dd .span:last-child,.wwiapp-store-block .top-list .goods-item:nth-child(3) .dd .span:last-child{display: none;}
.wwiapp-store-block .top-list .goods-item:nth-child(1) .dd .span:last-child{text-align: right;}

.wwiapp-store-sliders{margin: 20upx;}
.wwiapp-store-sliders .item{width: 710upx;}
.wwiapp-store-sliders .item image{width: 710upx; vertical-align: middle;}

.store-sale-block{margin: 20upx; background: #FFFFFF;}
.store-sale-block .store-sale-tit{padding: 8upx 16upx;}
.store-sale-block .store-sale-tit .h3{color: #FF0036; font-weight: bold; font-size: 32upx;}
.store-sale-block .store-sale-tit .time{color: #777; font-size: 28upx;}
.store-sale-block .sotre-sale-con{padding: 20upx;}
.store-sale-block .sotre-sale-con .mjs{ border-top:dotted 1px #eee ; border-bottom:dotted 1px #eee ;}
.store-sale-block .sotre-sale-con .mjs .li{display: flex; flex-direction: row; font-size: 28upx; flex-wrap: wrap;}
.store-sale-block .sotre-sale-con .mjs .li .em{color: #FF0036; font-weight: bold; margin: 0 10upx;}
.store-sale-block .sotre-sale-con .mjs .li image{width: 40upx ; height: 40upx;}
.store-sale-block .sotre-sale-con .note{font-size: 28upx; color: #777;}
html{background: #F8F8F8;}
.goods-search-nav{background: #fff;height: 44px; line-height: 44px; position: relative; color: #888;}
.goods-search-nav .li{flex: 1; color: #888; position: relative;}
.goods-search-nav .li.now{color: #FF0036;}
.goods-search-nav .li.sort.now:after{border-color: #FF0036 transparent transparent transparent;z-index: 0;}
.goods-search-nav .li.sort:after{line-height: 0;vertical-align: middle;width: 0px;height: 0px;margin-left: 6px;border-width: 5px;border-color: #AAA transparent transparent transparent;border-style: solid dashed dashed dashed; margin-top: 8px; content: '';}
.goods-search-nav .sore-nav{font-size: 15px; background: #FFFFFF;}
.goods-sort-inner{ position: absolute; z-index: 999; width: 100%;}
.goods-sort-inner .span{background: #fff; height: 80upx; font-size: 28upx; border-top:1px solid #EEE ; padding: 0 20upx;}
.goods-sort-inner .span.now{color: #FF0036;}
.goods-sort-inner .span.now .wwi-icon{color: #FF0036; display: block;}
.goods-sort-inner .span .wwi-icon{display: none;}
.sea-btn{height: 80upx; background: #FFFFFF; justify-content: center; align-items: center; border-top:2upx solid #eee; width: 100%;}
.sea-btn .btn-g{padding: 0; margin: 0; background-color: transparent; border-radius:0;}
.sea-btn .btn-g:after{border: 0;}
.sea-btn .btnA{width: 40%;display: flex; justify-content: center; margin: 0; border: none; padding: 0;}
.sea-btn .btnB{height: 80upx; flex: 1;display: flex; justify-content: center; background: #FF0036; align-items: center; color: #FFFFFF;}
.sea-list{flex: 1; height: calc(100% - 81upx);}
.sea-list .dl{background: #FFFFFF; padding: 0 20upx; font-size: 28upx;}
.sea-list .dl .dt{padding-top: 20upx; color: #888888;}
.sea-list .dl .dd{padding-bottom: 20upx; color: #888888; flex-wrap: wrap;}
.sea-list .dl .dd .ago{border: 2upx solid #eee; border-radius: 10upx;  height: 60upx;padding: 0 20upx; margin-top: 15upx; margin-right: 20upx; display: flex; align-items: center; justify-content: center;}
.sea-list .dl .dd .ago.now{background: #FF0036; color: #FFFFFF; border-color: #FF0036;}
.sea-list .dl .dd .uni-input{border: 2upx solid #eee; border-radius: 10upx;  height: 60upx;padding: 0 20upx; margin-top: 15upx; margin-right: 20upx; display: flex; align-items: center; justify-content: center;}
.sea-list .inp-block{background: #F5F5F5; padding: 10upx 20upx; width: 200upx; margin-top: 15upx; border: solid 2upx #EEE; border-radius: 10upx;height: 50upx;}
.store-fav-goods{    position: absolute;z-index: 1;top: 0;right: 0;left: 0;bottom: 0;}
.store-fav-goods .fac-goods-mask{    position: relative;z-index: 1;width: 100%;height: 100%;filter: progid:DXImageTransform.Microsoft.gradient(enabled='true',startColorstr='#E5FFFFFF', endColorstr='#E5FFFFFF');background: rgba(255,255,255,0.9);border: solid 0.05rem #EEE;}
.store-fav-goods .btn{position: absolute;z-index: 1;top: 50%;left: 50%;display: block;width: 3rem;height: 3rem;margin: -1.5rem 0 0 -1.5rem; display: flex; align-items: center; justify-content: center;color: #333;}
.store-fav-goods .btn .wwi-icon{border: 0.05em solid #333; border-radius:50% ; width: 1em;line-height: 1em; height:1em; font-size: 3em;}
.store-fav-goods .btn .test-fav{ font-size: 0.7em;}
.store-fav-goods .btn.ok{color: #FF0036;}
.store-fav-goods .btn.ok .wwi-icon{border-color:#FF0036 ;}
</style>
