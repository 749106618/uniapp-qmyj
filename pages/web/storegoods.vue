<template>
	<view class="index flex flexcol newBody">
		<view class="top-skciy" :class="{'stick':sct.scollDowns,'stickUp':sct.scollTops}">
			<view class="min-bar-scoll-head">
		<view class="goods-search-hd">
			<view class="hd">
				<view class="left-btn wwi-icon wwi-icon-xiangzuo" @click="Goback"></view>
				<view class="navbar-container">
					<view class="search-input" @tap="goSearch">
						<view class="wwi-icon wwi-icon-sousuo"></view>
						<input type="text" :placeholder="keyName" disabled="" />
					</view>
				</view>
				<view class="right-btn wwi-icon" :class="{'wwi-icon-yingyongAPP':plist,'wwi-icon-liebiao':!plist}" @click="toPlist"></view>
			</view>
		</view>
		<view class="goods-search-nav">
			<view class=" flex flexrow flexAic flexAcc flexJcc sore-nav">
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_default'}" id="sort_default" @click="orderShow">{{defaultSort}}<text class="i"></text></view>
				<view class="li flex flexJcc flexAic" :class="{'now':ordershow=='sort_num'}" id="sort_num" data-order="2" data-key="3"  @click="orderShow">销量优先</view>
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_show'}" id="sort_show"  @click="orderShow">筛选<view class="i"></view>
				</view>
			</view>
			<view class="goods-sort-inner flex flexcol" v-show="sortMask"  catchtouchmove="true">
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='综合排序'}" data-name="综合排序" data-order='' data-key='' @click="sortShow">综合排序<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从高到低'}" data-name="价格从高到低" data-order='2' data-key='2' @click="sortShow">价格从高到低<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从低到高'}" data-name="价格从低到高" data-order='1' data-key='2' @click="sortShow">价格从低到高<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='人气排序'}" data-name="人气排序" data-order='2' data-key='5' @click="sortShow">人气排序<view class="wwi-icon wwi-icon-duihao"></view></view>
			
		</view><view class="mask" v-show="sortMask" @click="sortMask=false"></view>
		</view>
		</view>
		</view>
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

		<view class="index-bd" :class="{'grid':plist,'list':!plist}">
			<view class="goods-secrch-list">
				<view v-if="!goods_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">没有查询到相关商品</view>
							<view class="dd">你可以换个关键词或条件查询</view>
						</view>
					</view>
				</view>
				<view class="goods-item" v-for="(item,index ) in goods_list" :key="index" v-if="goods_list.length > 0">
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
                  <view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
			</view>
		</view>
		<navigator url="/pages/my/viewlist" class="wwi-icon wwi-icon-zuji RightICo"></navigator>
		<view v-show="sct.offset > 300" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sct:{
					scollTops:false,
					offset:0,
					scollDowns:false
				},
				nkey:'',
				goKey: "搜索关键词",
				sid: 0,
				keyword: '',
				cid: '',
				key: '',
				order: '',
				keyName:'搜索商品',
				goods_list:[],
				hasmore: true,
				curpage: 1,
				plist:false,
				showloadMore:false,
				loadMore:'加载更多..',
				defaultSort:'综合排序',
				ordershow:'sort_default',
				sortMask:false,
				showDv:0,
				advShow:{
					price_from:'',
					price_to:''
				}
			}
		},
		methods: {
			get_list(action = 'refresh') {
				if (!this.hasmore) {
					return false;
				}
				this.hasmore = false;
				var param = {};
				param.page = 10;
				param.curpage = this.curpage;
				if (this.sid != '') {
					param.store_id = this.sid;
				}
				if (this.keyword != '') {
					param.keyword = this.keyword;
				}
				if (this.cid != '') {
					param.stc_id = this.cid;
				}
				if (this.key != '') {
					param.key = this.key;
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
							if (action == 'onbot') {
								res.data.datas.goods_list.forEach(item => {
									this.$set(item,'click',false);
									this.$set(item,'is_load',false);
									this.$set(item,'is_fav',false);
									this.goods_list.push(item);
								});
							} else {
								res.data.datas.goods_list.forEach(item=>{
									this.$set(item,'click',false);
									this.$set(item,'is_load',false);
									this.$set(item,'is_fav',false);
								});
								this.goods_list = res.data.datas.goods_list;
								if (res.data.hasmore) {
									this.showloadMore = true;
								}
							}
						this.hasmore = res.data.hasmore;
						if(!res.data.hasmore){
							this.loadMore = '加载完成，没有更多了..'
						}else{
							this.loadMore = '加载更多..'
						}
						}else{
							uni.showToast({
								title: '列表加载异常',icon:"none"
							});
						}

					}
				});
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/web/storesearch'
				})
			},
			toPlist(){
				if(this.plist){
					this.plist = false;
				}else{
					this.plist = true;
				}
			},
			Goback(){
				var page = getCurrentPages();
				if(page.length > 1){
				  uni.navigateBack();
				}else{
					uni.redirectTo({
						url:'/pages/web/store?storeid='+this.sid
					})
				}
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
					this.key = e.target.dataset.key;
					this.hasmore = true;
					this.curpage = 1;
					this.sortMask= false;
					this.showloadMore = false;
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
			storeFav:function(e){
				e.click=!e.click;
				if(!e.is_load){
					if(this.nkey){
				uni.request({
					url: this.ApiUrl + "/index.php?app=member_favorites&wwi=favorites_info",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key: this.nkey, fav_id: e.goods_id},
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
				if(!this.nkey){
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								uni.redirectTo({
									url:'/pages/web/login/login'
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
						data: {key:this.nkey,fav_id:e.goods_id},
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
						data: {key:this.nkey,goods_id:e.goods_id},
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
			changeBo:function(e){
				if(e.target.id=="price_from"){
					if(e.target.value > 0){
						this.advShow.price_from = e.target.value;
					}else{
						uni.showToast({ title: '输入最低价必须大于0',icon:"none"});
						this.advShow.price_from = '';
					}
				}
				if(e.target.id=="price_to"){
					if(e.target.value > this.advShow.price_from){
						this.advShow.price_to = e.target.value;
					}else{
						uni.showToast({ title: '输入最高价必须大于最低价',icon:"none"});
						this.advShow.price_to = '';
					}
				}
			},
			sortShow:function(e){
				this.defaultSort = e.target.dataset.name;
					this.order = e.target.dataset.order;
					this.key = e.target.dataset.key;
					this.hasmore = true;
					this.curpage = 1;
					this.sortMask= false;
					this.showloadMore = false;
					this.get_list();
				    uni.pageScrollTo({
				    	scrollTop: 0,
				    	duration: 300
				    });
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
					this.showloadMore = false;
					this.get_list();
				}
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.sct.scollDowns = false;
			}
			
		},
		onLoad(e) {
			if (e.sid) {
				this.sid = e.sid;
			}
			if(!e.sid){
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
			if(e.cid){
				this.cid = e.cid;
			}
			if(e.keyword){
				this.keyword = e.keyword;
				this.keyName = e.keyword;
			}
			this.get_list()
		},
		onShow:function(){
			this.nkey = uni.getStorageSync('key');
		},
		onReachBottom:function(){
			this.get_list('onbot');
		},
		onPageScroll: function(e){
				if(e.scrollTop < this.sct.offset){
					this.sct.scollTops = true;
				}else{
					this.sct.scollTops = false;
				}
				this.sct.offset = e.scrollTop;
				if(this.sct.offset >30){
					this.sct.scollDowns = true;
				}else{
					this.sct.scollDowns = false;
					this.sct.scollTops = false;
				}
		}
	}
</script>

<style>
	@import "../../common/css/glist.css";
</style>
