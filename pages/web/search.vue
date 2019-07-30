<template>
	<view>

		<!-- #ifdef MP-WEIXIN -->
		<view class="search-box">
		<mSearch :mode="2" button="inside" :placeholder="goKey" @search="doSearch" @input="inputChange" @confirm="doSearch" v-model="keyword"></mSearch>
		</view>
		<!-- #endif -->


		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<navigator :url="'/pages/web/glist?keyword='+k" class="keyword-entry" hover-class="keyword-entry-tap" v-for="(k,vv) in keywordList" :key="vv">
					<view class="keyword-text">
						{{k}}
					</view>
					<view class="keyword-img">
						<view class="wwi-icon wwi-icon-huojianjiasu"></view>
					</view>
				</navigator>
			</scroll-view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="hisSearch.length>0">
					<view class="keyword-list-header">
						<view>历史搜索</view>
						<view>
							<view @tap="oldDelete" class="wwi-icon wwi-icon-shanchu"></view>
						</view>
					</view>
					<view class="keyword">
						<view v-for="(kk,v) in hisSearch" :key="v"><navigator :url="'/pages/web/glist?keyword='+kk">{{kk}}</navigator></view>
					</view>
				</view>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>热门搜索</view>
						<view>
							<view class="wwi-icon" :class="{'wwi-icon-yanjing_xianshi':forbid,'wwi-icon-yanjing_yincang':!forbid}" @tap="hotToggle"></view>
						</view>
					</view>
					<view class="keyword" v-if="forbid">
						
						<view v-for="(item,index) in datas.list" :key="index"><navigator :url="'/pages/web/glist?keyword='+item">{{item}}</navigator></view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>当前搜热门搜索已隐藏</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	//引用mSearch组件，如不需要删除即可
	import mSearch from '@/components/mehaotian-search-revision.vue';
	import uniNavBar from '@/components/uni-nav-bar.vue'
	export default {
		data() {
			return {
				goKey:'搜索商品',
				goValue:'',
				keyword: "",
				keywordList: [],
				datas:'',
				hisSearch: [],
				forbid: true,
				isShowKeywordList: false
			}
		},
		onLoad() {
			this.init();
		},
		components: {
			mSearch,
			uniNavBar
		},
		methods: {
			init() {
				this.loadDefaultKeyword();
				this.loadHotKeyword();
			},
			blur(){
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
					uni.request({
						url: this.ApiUrl + '/index.php?app=index&wwi=search_hot_info',
						success: (result) => {
							var data = result.data.datas.hot_info;
							this.goKey = data.name;
							this.goValue = data.value;
					this.getChatCount();
					// #ifdef APP-PLUS  
					let pages = getCurrentPages();  
					let page = pages[pages.length - 1];  
					let currentWebview = page.$getAppWebview();  
					let titleObj = currentWebview.getStyle().titleNView; 
					titleObj.searchInput.placeholder =data.name;
					currentWebview.setStyle({  
						titleNView: titleObj
					}); 
					// #endif
						},
						fail: (data, code) => {
							console.log('fail' + JSON.stringify(data));
						}
					})
			},
			//加载热门搜索
			loadHotKeyword() {
				uni.request({
					url: this.ApiUrl + '/index.php?app=index&wwi=search_key_list',
					success: res => {
						this.datas = res.data.datas;
					}
				});
			}, 
			Goback:function(){
				var page = getCurrentPages();
				if(page.length > 1){
					uni.navigateBack();
				}else{
					uni.switchTab({  url:'/pages/index' });
				}
			},
			//监听输入
			inputChange(event) {
				//兼容引入组件时传入参数情况
				var keyword = event.detail?event.detail.value:event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				this.keyword = keyword;
				uni.request({
					url: this.ApiUrl + '/index.php?app=goods&wwi=auto_complete',
					data: {term:keyword},
					success: res => {
						if(!res.data.datas.error){
								if(res.data.datas.list.length > 0) {
									this.keywordList = res.data.datas.list;
								} else {
									this.keywordList=[];
								}
						}
					}
				});
			},
			//清除历史搜索
			oldDelete() {
				uni.removeStorageSync('hisSearch');
				this.hisSearch = uni.getStorageSync('hisSearch');
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = !this.forbid;
			},
			//执行搜索
			doSearch() {
				if(this.keyword == ''){
					uni.navigateTo({
						url:'/pages/web/glist?keyword='+this.goValue
					})
				}else{
					uni.navigateTo({
						url:'/pages/web/glist?keyword='+this.keyword
					})
				}
				uni.hideKeyboard();
			}
		},
		onShow:function(e){
			this.hisSearch = uni.getStorageSync('hisSearch');
		},
		onNavigationBarSearchInputChanged(e) {
				var keyword = e.text;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				this.wwiopt({
					url: '/index.php?app=goods&wwi=auto_complete',
					data: {term:keyword},
					success: res => {
						if(!res.data.datas.error){
								if(res.data.datas.list.length > 0) {
									this.keywordList = res.data.datas.list;
								} else {
									this.keywordList=[];
								}
						}
					}
				});
		},
		onNavigationBarSearchInputConfirmed(e) {
			this.keyword = e.text;
			this.doSearch();
		}
	}
</script>
<style>
	page{background: #F8F8F8;}
	.search-box {width:95%;background-color:#F8F8F8;padding:7.5px 2.5%;display:flex;justify-content:space-between;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:14px;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:30px;}
	.search-box .input-box>input {width:100%;height:30px;font-size:16px;border:0;border-radius:30px;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
	.keyword-list-box {height:calc(100vh - 55px);padding-top:5px;border-radius:10px 10px 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:40px;margin:0 3%;font-size:15px;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1px #e7e7e7;}
	.keyword-entry image {width:30px;height:30px;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:40px;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:90%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
	.keyword-box {height:calc(100vh - 55px);border-radius:10px 10px 0 0;background-color:#fff;}
	.keyword-box .keyword-block {padding:5px 0;}
	.keyword-box .keyword-block .keyword-list-header {width:94%;padding:5px 3%;font-size:13.5px;color:#333;display:flex;justify-content:space-between;}
	.keyword-box .keyword-block .keyword-list-header image {width:20px;height:20px;}
	.keyword-box .keyword-block .keyword {width:94%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
	.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:14px;color:#6b6b6b;}
	.keyword-box .keyword-block .keyword>view {display:flex;justify-content:center;align-items:center;border-radius:30px;padding:0 10px;margin:5px 10px 5px 0;height:30px;font-size:14px;background-color:rgb(242,242,242);color:#6b6b6b;}
</style>
