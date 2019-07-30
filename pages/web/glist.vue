<template>
	<view class="index flex flexcol">
		<view class="top-skciy"  :class="{'stick':sct.scollDowns,'stickUp':sct.scollTops}">
			<view class="min-bar-scoll-head">
		<view class="goods-search-hd">
			<view class="hd">
				<view class="left-btn wwi-icon wwi-icon-xiangzuo" @tap="goBack"></view>
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
				<view class="li flex flexJcc flexAic" :class="{'now':ordershow=='sort_num'}" id="sort_num" data-order="2" data-key="1"  @click="orderShow">销量优先</view>
				<view class="li flex flexrow flexJcc flexAic sort" :class="{'now':ordershow=='sort_show'}" id="sort_show"  @click="orderShow">筛选<view class="i"></view>
				</view>
			</view>
			<view class="goods-sort-inner flex flexcol" v-show="sortMask"  catchtouchmove="true">
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='综合排序'}" data-name="综合排序" data-order='' data-key='' @click="sortShow">综合排序<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从高到低'}" data-name="价格从高到低" data-order='2' data-key='3' @click="sortShow">价格从高到低<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='价格从低到高'}" data-name="价格从低到高" data-order='1' data-key='3' @click="sortShow">价格从低到高<view class="wwi-icon wwi-icon-duihao"></view></view>
			<view class="span flex flexJcs flexAic" :class="{'now':defaultSort=='人气排序'}" data-name="人气排序" data-order='2' data-key='2' @click="sortShow">人气排序<view class="wwi-icon wwi-icon-duihao"></view></view>
			
		</view>
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
					<view class="dl">
						<view class="dt">商品所在地</view>
						<view class="dd flex flexrow flexAic">
							<picker v-if="advData.area_list.length>0" @change="bindPickerChange" :value="city" :range="advData.area_list" range-key="area_name">
								<view class="uni-input">{{advData.area_list[city].area_name}}</view>
							</picker>
						</view>
					</view>
					<view class="dl">
						<view class="dt">商品类型</view>
						<view class="dd flex flexrow flexAic">
							<view class="ago" :class="{now:advShow.gift==1}" id="gift" @click="changeBo">赠品</view>
							<view class="ago" :class="{now:advShow.groupbuy==1}" id="groupbuy" @click="changeBo">团购</view>
							<view class="ago" :class="{now:advShow.xianshi==1}" id="xianshi" @click="changeBo">限时折扣</view>
							<view class="ago" :class="{now:advShow.virtual==1}" id="virtual" @click="changeBo">虚拟</view>
						</view>
					</view>
					<view class="dl">
						<view class="dt">店铺类型</view>
						<view class="dd flex flexrow flexAic">
							<view class="ago" :class="{now:advShow.own_mall==1}" id="own_mall" @click="changeBo">平台自营</view>
						</view>
					</view>
					<view class="dl" v-if="advData.contract_list.length >0">
						<view class="dt">商品类型</view>
						<view class="dd flex flexrow flexAic">
							<block v-for="(con,kk) in advData.contract_list" :key="kk">
							<view class="ago" :class="{now:con.click}" :data-key="kk" id="ci" @click="changeBo">{{con.name}}</view>
							</block>
						</view>
					</view>
				</scroll-view>
				<view class="sea-btn flex flexrow">
					<button class="btn-g btnA" @click="searchBtn('reset')">重置</button>
					<button class="btn-g btnB" @click="searchBtn('go')">确定</button>
				</view>

			</view>
		</view>

		<view class="index-bd" :class="{'grid':plist,'list':!plist}" :style="{'padding-top':ptop}">
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
							<navigator class="a flex flexcol" :url="'/pages/web/item?goodsid='+item.goods_id">
								<text class="h4">{{item.goods_name}}</text>
								<text class="h6" v-if="item.goods_jingle">{{item.goods_jingle}}</text>
							</navigator>
						</view>
						<view class="goods-sale">
							<navigator :url="'/pages/web/item?goodsid='+item.goods_id"  class="flex flexJcs flexAic">
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
							<navigator class="goods-sold" :url="'/pages/web/item?goodsid='+item.goods_id">销量
								<text class="em">{{item.goods_salenum}}</text>
							</navigator>
							<view class="goods-store">
								<text class="mall" v-if="item.is_own_mall == 1">自营</text>
								<navigator v-else="" :url="'/pages/web/store?storeid='+item.store_id">{{item.store_name}}</navigator>
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
				goKey: "搜索关键词",
				gcid: 0,
				keyword: '',
				bid: '',
				key: '',
				order: '',
				city: 0,
				keyName:'搜索商品',
				advData: {
					area_list:[],
					contract_list:[]
					},
				
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
					price_to:'',
					area_id:'',
					groupbuy:0,
					xianshi:0,
					virtual:0,
					gift:0,
					own_mall:0,
					ci:''
				},
				ptop:0,
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
				if (this.gcid != '') {
					param.gc_id = this.gcid;
				} else if (this.keyword != '') {
					param.keyword = this.keyword;
				} else if (this.bid != '') {
					param.b_id = this.bid;
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
				if(this.advShow.area_id > 0){
					param.area_id = this.advShow.area_id;
				}
				if(this.advShow.groupbuy > 0){
					param.groupbuy = this.advShow.groupbuy;
				}
				if(this.advShow.xianshi > 0){
					param.xianshi = this.advShow.xianshi;
				}
				if(this.advShow.virtual > 0){
					param.virtual = this.advShow.virtual;
				}
				if(this.advShow.gift > 0){
					param.gift = this.advShow.gift;
				}
				if(this.advShow.own_mall > 0){
					param.own_mall = this.advShow.own_mall;
				}
				if(this.advShow.ci !=''){
					param.ci = this.advShow.ci;
				}
				this.wwiopt({
					url: '/index.php?app=goods&wwi=goods_list',
					data: param,
					success: res => {
						if(res.data.code==200){
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.goods_list.forEach(item => {
									this.$set(item,'click',false);
									this.goods_list.push(item);
								});
							} else {
								res.data.datas.goods_list.forEach(item=>{
									this.$set(item,'click',false);
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
					url: '/pages/web/search'
				})
			},
			toPlist(){
				if(this.plist){
					this.plist = false;
				}else{
					this.plist = true;
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
					if(this.showDv=='0'){
						this.getAdv();
					}
					if(this.showDv != 1){
						this.showDv = 1;
					}else{
						this.showDv = 2;
					}
				}
				this.ordershow = e.target.id;
				console.log(e)
			},
			getAdv:function(){
				uni.request({
					url: this.ApiUrl + '/index.php?app=index&wwi=search_adv',
					success: res => {
						if(res.data.code==200){
							if(res.data.datas.contract_list.length > 0){
								res.data.datas.contract_list.forEach(item=>{
									this.$set(item, 'click', false);
								})
							}
							res.data.datas.area_list.unshift({area_id:0,area_name:'选择区域'});
							this.advData = res.data.datas;
							
							console.log(this.area_list);
						}
						
					}
				});
			},
			bindPickerChange:function(e){
				this.city = e.target.value;
				this.advShow.area_id = this.advData.area_list[e.target.value].area_id;
				console.log(e)
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
				if(e.target.id=="gift"){
					if(this.advShow.gift==1){
						this.advShow.gift = 0;
					}else{
						this.advShow.gift = 1;
					}
				}
				if(e.target.id=="groupbuy"){
					if(this.advShow.groupbuy==1){
						this.advShow.groupbuy = 0;
					}else{
						this.advShow.groupbuy = 1;
					}
				}
				if(e.target.id=="xianshi"){
					if(this.advShow.xianshi==1){
						this.advShow.xianshi = 0;
					}else{
						this.advShow.xianshi = 1;
					}
				}
				if(e.target.id=="virtual"){
					if(this.advShow.virtual==1){
						this.advShow.virtual = 0;
					}else{
						this.advShow.virtual = 1;
					}
				}
				if(e.target.id=="own_mall"){
					if(this.advShow.own_mall==1){
						this.advShow.own_mall = 0;
					}else{
						this.advShow.own_mall = 1;
					}
				}
				if(e.target.id=="ci"){
					if(this.advData.contract_list[e.target.dataset.key].click){
						this.$set(this.advData.contract_list[e.target.dataset.key], 'click', false);
					}else{
	                    this.$set(this.advData.contract_list[e.target.dataset.key], 'click', true);
                     }
				}
				console.log(this.advData)
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
						price_to:'',
						area_id:'',
						groupbuy:0,
						xianshi:0,
						virtual:0,
						gift:0,
						own_mall:0,
						ci:''
					}
					if(this.advData.contract_list.length > 0){
						this.advData.contract_list.forEach(item=>{
							this.$set(item, 'click', false);
						})
					}
				}else{
					this.hasmore = true;
					this.curpage = 1;
					this.showDv= 2;
					this.showloadMore = false;
					if(this.advData.contract_list.length > 0){
						this.advData.contract_list.forEach(item=>{
							if(item.click){
								this.advShow.ci += item.id + '_';
							}
						})
					}

					this.get_list();
				}
			},
			getKeyname:function(){
				uni.request({
						url: this.ApiUrl + '/index.php?app=index&wwi=search_hot_info',
						success: (result) => {
							var data = result.data.datas.hot_info;
							this.keyName = data.name;
						},
				});
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
					this.sct.scollDowns = false;
					this.sct.scollTops = false;
			},
			goBack:function(){
				var page = getCurrentPages();
				if(page.length > 1){
					uni.navigateBack();
				}else{
					uni.switchTab({  url:'/pages/index' });
				}
			}
			
		},
		onLoad(e) {
			if (e.gcid) {
				this.gcid = e.gcid;
			}
			if(e.bid){
				this.bid = e.bid;
			}
			if(e.keyword){
				this.keyword = e.keyword;
				this.keyName = e.keyword;
				var oldSearch = uni.getStorageSync('hisSearch');
				if(oldSearch.length > 0){
					var isSearch = true;
					oldSearch.forEach(item=>{
					if(item == e.keyword){
						 isSearch = false;
					}
				  })
					if(isSearch){
						oldSearch.push(e.keyword);
						uni.setStorageSync('hisSearch',oldSearch);
					}
				}else{
					oldSearch=[];
					oldSearch.push(e.keyword);
					uni.setStorageSync('hisSearch',oldSearch)
				}
          console.log(uni.getStorageSync('hisSearch'))
				
				
			}else{
				this.getKeyname();
			}
			
			this.get_list()
		},
		onReachBottom:function(){
			this.get_list('onbot');
		},
		onPageScroll: function(e){
				if(e.scrollTop < this.sct.offset){
					this.sct.scollTops = true;
					this.ptop = '44px';
				}else{
					this.sct.scollTops = false;
					this.ptop = '88px';
				}
				this.sct.offset = e.scrollTop;
				if(this.sct.offset >30){
					this.sct.scollDowns = true;
					this.ptop = '88px';
				}else{
					this.sct.scollDowns = false;
					this.sct.scollTops = false;
					this.ptop = 0;
				}
		}
	}
</script>

<style>

	@import "../../common/css/glist.css";
</style>
