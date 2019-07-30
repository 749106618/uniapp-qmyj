<template>
	<view :class="{'site-top':scollDowns,'site-down':scollTops}">
		<view class="goods-search-nav">
			<view class=" flex flexrow flexAic flexAcc flexJcc sore-nav">
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_default'}" id="sort_default"
				 @click="orderShow">{{defaultSort}}<text class="i"></text></view>
				<view class="li flex flexJcc flexAic" :class="{'now':ordershow=='sort_num'}" id="sort_num" data-order="2" data-key="3"
				 @click="orderShow">销量优先</view>
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_show'}" id="sort_show" @click="orderShow">筛选<view
					 class="i"></view>
				</view>
				<view class="li" style="width: 2em; flex: none; font-size: 1.2em;" @click="plist=!plist">
					<view class="wwi-icon" :class="{'wwi-icon-yingyongAPP':plist,'wwi-icon-liebiao':!plist}"></view>
				</view>

			</view>
			<view class="goods-sort-inner flex flexcol" v-show="sortMask" catchtouchmove="true">
				<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='综合排序'}" data-name="综合排序" data-order=''
				 data-key='' @click="sortShow">综合排序<view class="wwi-icon wwi-icon-duihao"></view>
				</view>
				<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从高到低'}" data-name="价格从高到低" data-order='2'
				 data-key='2' @click="sortShow">价格从高到低<view class="wwi-icon wwi-icon-duihao"></view>
				</view>
				<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从低到高'}" data-name="价格从低到高" data-order='1'
				 data-key='2' @click="sortShow">价格从低到高<view class="wwi-icon wwi-icon-duihao"></view>
				</view>
				<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='人气排序'}" data-name="人气排序" data-order='2'
				 data-key='5' @click="sortShow">人气排序
					<view class="wwi-icon wwi-icon-duihao"></view>
				</view>

			</view>

		</view>
		<view class="mask" v-show="sortMask" @click="sortMask=false"></view>
		<view class="wwiapp-full-mask-bg" v-show="showDv==1" @click="showDv=2" catchtouchmove="true"></view>
		<view class="wwiapp-full-mask" v-if="showDv>0" :class="{'hide':showDv==0,'left':showDv==1,'right':showDv==2}"
		 catchtouchmove="reue">
			<view class="wwiapp-full-mask-block flex flexcol">
				<scroll-view class="sea-list" scroll-y>
					<view class="dl">
                        <input type="text" value="" disabled="true" />
						<view class="dt">价格区间</view>
						<view class="dd flex flexAic flexrow">
							<view class="inp-block"><input type="number" v-model="advShow.price_from" id='price_from' placeholder="最低价"
								 placeholder-style="color:#4caf50;" /></view>
							<view class="">-</view>
							<view class="inp-block"><input type="number" :disabled="advShow.price_from < 0.01" v-model="advShow.price_to" id='price_to'
								 placeholder="最高价" placeholder-style="color:#f44336;" /></view>
						</view>
					</view>
				</scroll-view>
				<view class="sea-btn flex flexrow">
					<button class="btn-g btnA" @click="searchBtn('reset')">重置</button>
					<button class="btn-g btnB" @click="searchBtn('go')">确定</button>
				</view>

			</view>
		</view>
		<view class="goods-control" :class="{'grid':plist,'list':!plist}">
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
						<navigator class="a" :url="'/pages/web/mshop/item?msid='+mid +'&goodsid='+item.goods_id+'&fid='+item.jfx_id">
							<image :src="item.goods_image_url" lazy-load />
							</image>
						</navigator>
					</view>
					<view class="goods-info">
						<view class="goods-name">
							<navigator class="a" :url="'/pages/web/mshop/item?msid='+mid +'&goodsid='+item.goods_id+'&fid='+item.jfx_id">
								<text class="h4">{{item.goods_name}}</text>
								<text class="h6">{{item.goods_jingle}}</text>
							</navigator>
						</view>
						<view class="goods-sale">
							<navigator :url="'/pages/web/mshop/item?msid='+mid +'&goodsid='+item.goods_id+'&fid='+item.jfx_id" class="flex flexJcs flexAic">
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
							</navigator>
						</view>
						<view class="goods-assist">
							<navigator class="goods-sold" :url="'/pages/web/mshop/item?msid='+mid +'&goodsid='+item.goods_id+'&fid='+item.jfx_id">销量
								<text class="em">{{item.sale_count}}</text>
							</navigator>
							<view class="goods-store">
								<view class="wwi-icon wwi-icon-gouwuche1" @click="getGoodsmask(item)"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<wwi-goods-mask ref="wwiGoodsMask" :goods="Number(goodsId)" :fid="Number(fid)" @change="getuu"></wwi-goods-mask>
	</view>
</template>

<script>
	import wwiGoodsMask from '../../../components/wwi-goods-mask.vue';
	export default {
		components: {
			wwiGoodsMask
		},
		data() {
			return {
				mid: '',
				memberInfo: [],
				offset: '',
				scollDowns: false,
				scollTops: false,
				defaultSort: '综合排序',
				ordershow: 'sort_default',
				sortMask: false,
				hasmore: true,
				curpage: 1,
				skey: '',
				order: '',
				goods_list: [],
				advShow: {
					price_from: '',
					price_to: ''
				},
				keyword: '',
				gc_id: '',
				showDv: 0,
				plist: false,
				goodsId: '',
				fid: '',
				goodsClass: []
			};
		},
		methods: {
			setScrollNum: function(e) {
				if (e.scrollTop < this.offset) {
					this.scollTops = true;
				} else {
					this.scollTops = false;
				}
				this.offset = e.scrollTop;
				if (this.offset > 80) {
					this.scollDowns = true;
				} else {
					this.scollDowns = false;
					this.scollTops = false;
				}
			},
			get_list() {
				if (!this.hasmore) {
					return false;
				}
				this.hasmore = false;
				var param = {};
				param.page = 10;
				param.curpage = this.curpage;
				if (this.skey != '') {
					param.key = this.skey;
				}
				if (this.order != '') {
					param.order = this.order;
				}
				if (this.advShow.price_from > 0 && this.advShow.price_to > 0) {
					param.price_from = this.advShow.price_from;
					param.price_to = this.advShow.price_to;
				}
				if (this.advShow.keyword != '') {
					param.keyword = this.keyword;
				}
				if (this.advShow.gc_id != '') {
					param.gc_id = this.gc_id;
				}
				param.jfx_id = this.mid;
				this.wwiopt({
					url: '/index.php?app=distribute&wwi=jfx_goods_list',
					data: param,
					success: res => {
						if (res.data.code == 200) {
							this.curpage += 1;
							res.data.datas.goods_list.forEach(item => {
								this.$set(item, 'click', false);
								this.$set(item, 'is_load', false);
								this.$set(item, 'is_fav', false);
								this.goods_list.push(item);
							});
							this.hasmore = res.data.hasmore;
						} else {
							uni.showToast({
								title: '列表加载异常',
								icon: "none"
							});
						}
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
			orderShow(e) {
				if (e.target.id == 'sort_default') {
					this.ordershow = 'sort_default';
					if (this.sortMask == true) {
						this.sortMask = false;
					} else {
						this.sortMask = true;
					}

				} else if (e.target.id == 'sort_num') {
					this.order = e.target.dataset.order;
					this.skey = e.target.dataset.key;
					this.hasmore = true;
					this.curpage = 1;
					this.sortMask = false;
					this.goods_list = [];
					this.get_list();
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
				} else if (e.target.id == 'sort_show') {
					if (this.showDv != 1) {
						this.showDv = 1;
					} else {
						this.showDv = 2;
					}
				}
				this.ordershow = e.target.id;
			},
			sortShow: function(e) {
				this.defaultSort = e.target.dataset.name;
				this.order = e.target.dataset.order;
				this.skey = e.target.dataset.key;
				this.hasmore = true;
				this.curpage = 1;
				this.sortMask = false;
				this.goods_list = [];
				this.get_list();
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			searchBtn: function(e) {
				if (e == 'reset') {
					this.advShow = {
						price_from: '',
						price_to: ''
					}
				} else {
					this.hasmore = true;
					this.curpage = 1;
					this.showDv = 2;
					this.goods_list = [];
					this.get_list();
				}
			},
			getGoodsmask(e) {
				this.goodsId = e.goods_id;
				this.fid = e.jfx_id;
				var _this = this
				setTimeout(function() {
					_this.$refs.wwiGoodsMask.show();
				}, 30)
			},
			getuu: function(e) {
				this.goodsId = e;
			}
		},
		onLoad: function(e) {
			if(e.gcid){
				this.gc_id = e.gcid;
			}
			if(e.keyword){
				this.keyword = e.keyword;
			}
			if (e.msid) {
				this.mid = e.msid;
				this.get_list();
			} else {
				uni.showToast({
					title: '参数错误',
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
		},
		onPageScroll(e) {
			this.setScrollNum(e);
		},
		onReachBottom: function() {
			this.get_list();
		}
	}
</script>

<style>
.small-shop-hd{    position: relative;width: 100%;left: 0;right: 0;margin: 0 auto;max-height: 174px;z-index: 30;overflow: hidden;}
.small-shop-hd .small_header_b_img{    position: absolute;width: 100%;height: 174px;bottom: 0;z-index: 1;}
.small-shop-hd .small_header_b_img image{width: 100%; height: 100%;    filter: blur(20px); }
.small-shop-hd .small-hd-nav{position: relative;width: 100%;left: 0;right: 0;margin: 0 auto;height: 174px;z-index: 30;overflow: hidden;}
.small-shop-hd .small-hd-nav .member-avatar{padding: 20px 0 10px 0;}
.small-shop-hd .small-hd-nav .member-avatar image{width: 100px; height: 100px; border-radius:50% ;}
.small-shop-hd .small-hd-nav .member-name{font-size: 18px; color: #FFFFFF; text-shadow: rgba(0,0,0,0.5) 1px 2px 5px;}
.small-shop-hd .small-hd-nav .wwi-icon{position: absolute; top: 0; left: 0; width: 50px; height: 50px; display:flex; align-items: center; justify-content: center; color: #FFFFFF; text-shadow: rgba(0,0,0,0.5) 1px 2px 5px; font-size: 28px;}
.site-top .small-shop-hd{position: fixed; top: 0;  transition: transform .3s}
.site-top .small-shop-hd .small-hd-nav .wwi-icon{width: 44px; height: 44px;}
.site-top .small-shop-hd .small-hd-nav{display: flex; flex-direction: row; align-items: center; justify-content: center; height: 0px;animation: t-small-hd-nav .3s;}
@keyframes t-small-hd-nav
{
0%   {height:44px;}
25%  {height:34px;}
50%  {height:24px;}
75%  {height:14px;}
100% {height:0px;}
}
.site-top .small-shop-hd .small-hd-nav .member-avatar{padding: 0;}
.site-top .small-shop-hd .small-hd-nav .member-avatar image{width: 30px; height: 30px;}
.site-top .small-shop-hd .small-hd-nav .member-name{margin-left: 10px;}
.site-top .goods-search-nav{position: fixed; left: 0; right: 0; top: 0px; z-index: 30;animation: search-nav .3s;}
@keyframes t-search-nav
{
0%   {top:0px;}
25%  {top:14px;}
50%  {top:24px;}
75%  {top:34px;}
100% {top:44px;}
}
.site-down .goods-search-nav{top: 44px;animation: t-search-nav .3s;}
@keyframes search-nav
{
0%   {top:44px;}
25%  {top:34px;}
50%  {top:24px;}
75%  {top:14px;}
100% {top:0px;}
}
.site-down  .small-shop-hd .small-hd-nav{height: 44px;animation: small-hd-nav .3s;}
@keyframes small-hd-nav
{
0%   {height:0px;}
25%  {height:14px;}
50%  {height:24px;}
75%  {height:34px;}
100% {height:44px;}
}
.site-top .goods-control{margin-top: 174px;}
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
.sea-list .inp-block2{background: #F5F5F5; padding: 10upx 20upx; width: 100%; margin-top: 15upx; border: solid 2upx #EEE; border-radius: 10upx;height: 50upx;}
.mask{position: fixed; width: 100%; height: 100%; background: rgba(0,0,0,0.1); z-index: 20; bottom: 0;}

.m-shop-bottom{position: fixed; z-index: 99; bottom: 0; flex-direction: row; display: flex; height: 88upx; background: #F7F7F7; border-top:1px solid #EEEEEE; width: 100%;}
.m-shop-bottom .item{flex: 1; display: flex; justify-content: center; align-items: center; font-size: 30upx; border-right:1px solid #EEEEEE ; }
.m-shop-bottom .item:last-child{border: none;}
.goods-control{margin-bottom: 88upx;}
.sea-list .dl .dd .slect-class:first-child{border-top:0 ;}
.sea-list .dl .dd .slect-class{}
.sea-list .dl .dd .slect-class .class-name{height: 60upx; border-bottom: 1px solid #eee; display: flex; align-items: center; padding-left:20upx ;}
.sea-list .dl .dd .slect-class .class-name .wwi-icon{font-size: 28upx; padding-right: 20upx;}
.sea-list .dl .dd .slect-class .class-box{border-bottom:1px solid #eee ;}
.sea-list .dl .dd .slect-class .class-box .class-box-name{line-height: 60upx; margin-left: 20upx;}
.sea-list .dl .dd .slect-class .class-box .class-box-name.ok{color: #FF0036;}
.sea-list .dl .dd .slect-class .class-box .class-box-main{display: flex; flex-direction: row; margin:0 15upx 15upx;}
.sea-list .dl .dd .slect-class .class-box .class-box-main .class-box-itme{background: #F7F7F7; width: 140upx; padding: 0 10upx;display: flex; justify-content: center; align-items: center; margin-bottom: 10upx; margin-right: 15upx; border-radius:10upx; font-size: 26upx;}
.sea-list .dl .dd .slect-class .class-box .class-box-main .class-box-itme.ok{background: #FF0036; color: #FFFFFF;}
</style>
