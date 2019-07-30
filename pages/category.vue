<template>
	<view>
		<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar color="#333333" background-color="#FFFFFF" search-tsok="true" @click-search="goSearch" disabled="true" :placeholder="goKey" shadow="false"
		 status-bar="false" fixed="false">
		</uni-nav-bar>
		<!-- 占位用的导航栏 -->
		<!-- #endif -->
		
			<view class="page-body">
				<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
					<view class="nav-left-item" @click="categoryClickMain('brand','b')" :class="'b'==categoryActive?'active':''">
						品牌推荐
					</view>
					<view class="nav-left-item" @click="categoryClickMain(item.gc_id,index3)" :key="index3" :class="index3==categoryActive?'active':''"
					 v-for="(item,index3) in categoryList">
						{{item.gc_name}}
					</view>
				</scroll-view>
				<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'"
				 scroll-with-animation>
					<view class="nav-right-center">
						<view :id="index2==0?'first':''" class="nav-right-item" v-if="!isBrand" v-for="(item,index2) in subCategoryList" :key="index2">
							<view class="module-title">
								<view class="module-classname">{{item.gc_name}}</view>
								<navigator class="module-more"  :url="'/pages/web/glist?gcid=' + item.gc_id">更多>></navigator>
							</view>
							<view class="module-center">
								<navigator class="module-item" v-for="(subitem,sd) in item.child" :key="sd" :url="'/pages/web/glist?gcid=' + subitem.gc_id">
									<image :src="subitem.gc_image ?subitem.gc_image:'../static/nopic.png'" />
									<view>{{subitem.gc_name}}</view>
								</navigator>
							</view>
						</view>
						<navigator class="brand-item" v-if="isBrand" v-for="(item,index2) in subCategoryList" :key="index2" :url="'/pages/web/glist?bid=' + item.brand_id">
							<image :src="item.brand_pic?item.brand_pic:'../static/nopic.png'" />
							</image>
							<view class="brand-name">{{item.brand_name}}</view>
						</navigator>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../components/uni-nav-bar.vue'
	import uniIcon from '../components/uni-icon.vue'
	export default {
		data() {
			return {
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 'b',
				scrollTop: 0,
				scrollHeight: 0,
				scrollBottom: 0,
				isBrand: 1,
				goKey: "搜索关键词"
			}
		},
		components: {
			uniNavBar,
			uniIcon
		},
		methods: {
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				if (categroy == 'brand') {
					this.getBrandlist();
				} else {
					this.getSubcate(categroy);
				}

				this.scrollTop = -this.scrollHeight * index;
			},
			getCategory: async function() {
					uni.request({
						url: this.ApiUrl + '/index.php?app=goods_class',
						success: (result) => {
							var data = result.data.datas.class_list;
							for (var i = 0; i < data.length; i++) {
								this.categoryList.push({
									"gc_id": data[i].gc_id,
									"gc_name": data[i].gc_name
								})
							}
						},
						fail: (data, code) => {
							console.log('fail' + JSON.stringify(data));
						}
					});
				},
				getSubcate(id) {
					this.wwiopt({
						url: '/index.php?app=goods_class&wwi=get_child_all',
						data: {
							gc_id: id
						},
						success: (result) => {
							var data = result.data.datas.class_list;
							this.subCategoryList = data;
							this.isBrand = 0;
						}
					});
				},
				getBrandlist() {
					this.wwiopt({
						url: '/index.php?app=brand&wwi=recommend_list',
						success: (brandok) => {
							var datam = brandok.data.datas.brand_list;
							this.subCategoryList = datam;
							this.isBrand = 1;
						}
					});
				},
				goSearch(){
				uni.navigateTo({
					url: '/pages/web/search'
				})
				}



		},
		onLoad: function() {
			this.getCategory();
			this.getBrandlist();
			//#ifdef MP-WEIXIN
			this.height = uni.getSystemInfoSync().windowHeight- 44; //-56
			//#endif
			//#ifdef APP-PLUS
			this.height = uni.getSystemInfoSync().windowHeight-uni.getSystemInfoSync().statusBarHeight- 44; //-56
			//#endif
			// #ifdef H5
			this.height = uni.getSystemInfoSync().windowHeight; //-56
			// #endif
		},
		onShow:function(){
			this.getCartCount();
			// #ifdef H5
			document.title = '商品分类'+this.siteTitle;
			// #endif
		},
		onShareAppMessage:function(){
			return {
				title: '商品分类-'+this.siteTitle,
				path: '/pages/category'
			}
		},
		onReady:function(){
			this.wwiopt({
				url: '/index.php?app=index&wwi=search_hot_info',
				success: (result) => {
					var data = result.data.datas.hot_info;
					this.goKey = data.name;
					this.getChatCount();
					this.rightSup = uni.getStorageSync('chat_count');
					// #ifdef H5
					document.querySelector('.uni-page-head-search-placeholder').innerHTML=data.name;
					// #endif
					// #ifdef APP-PLUS  
					let pages = getCurrentPages();  
					let page = pages[pages.length - 1];  
					let currentWebview = page.$getAppWebview();  
					let titleObj = currentWebview.getStyle().titleNView; 
					if(this.rightSup){
					  titleObj.buttons[0].redDot=true; 	
					}
					titleObj.searchinput.placeholder =data.name;
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
		onNavigationBarSearchInputClicked:function(){
			this.goSearch();
		},
		onNavigationBarButtonTap:function(e) {
			if(e.index == 0){
			if(!uni.getStorageSync('key')){
				uni.showModal({
					title: '提示',
					content: '您还没有登入,请先登入后操作',
					showCancel: true,
					cancelText: '取消',
					confirmText: '登入',
					success: res => {
						if(res.confirm){
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
			}else{
				this.scanCode();
			}
		}
	}
</script>
<style>
	@import "../common/css/category.css";
</style>
