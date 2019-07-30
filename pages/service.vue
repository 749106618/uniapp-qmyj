<template>
	<view>
		<view class="service-baner"><image :src="baseData.advpic"></image></view>
		<view class="service-tab flex flexrow">
			<view class="li flex flexJcc flexrow flexAic" :class="{'ok':menuId==1}" @tap="changeMenu('1')"><view class="wwi-icon wwi-icon-zhaochanpin"></view>找产品</view>
			<view class="li flex flexJcc flexrow flexAic" :class="{'ok':menuId==2}" @tap="changeMenu('2')"><view class="wwi-icon wwi-icon-zhaofuwushang"></view>找服务商</view>
		</view>
		<view class="page-body" v-show="menuId==1">
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
		<view class="service-list flex flexrow flexwrap" v-show="menuId==2">
			<navigator :url="'/pages/web/serviceList?jiaoSeType='+item.id" class="service-nav" v-for="(item,v) in baseData.list" :key="v">
				<image :src="item.pic" mode="" class="service-nav-img"></image>
				<view class="service-nav-txt">{{item.name}}</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseData:[],
				categoryList: [],
				subCategoryList: [],
				height: 0,
				categoryActive: 'b',
				scrollTop: 0,
				scrollHeight: 0,
				scrollBottom: 0,
				isBrand: 1,
				goKey: "搜索关键词",
				menuId:1
			}
		},
		methods: {
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=default&wwi=servicecenterlist',
					success: res => {
						this.baseData = res.data.datas;
					},
				});
			},
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
				},
			changeMenu:function(e){
				if(this.menuId==e){
					return false;
				}
				this.menuId = e;
			}
			
		},
		onLoad:function(){
			this.Inlimine();
			this.getCategory();
			this.getBrandlist();
			this.getCategory();
			this.getBrandlist();
			//#ifdef MP-WEIXIN
			this.height = uni.getSystemInfoSync().windowHeight- 204; //-56
			//#endif
			//#ifdef APP-PLUS
			this.height = uni.getSystemInfoSync().windowHeight-uni.getSystemInfoSync().statusBarHeight- 160; //-56
			//#endif
			// #ifdef H5
			this.height = uni.getSystemInfoSync().windowHeight-160; //-56
			// #endif
		},
		onPullDownRefresh:function(){
			this.Inlimine();
			this.getCategory();
			this.getBrandlist();
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
					titleObj.searchInput.placeholder =data.name;
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
.service-baner{height: 85px;}
.service-baner image{height: 85px;width: 100%;}
page{background-color: #F8F8F8;height: auto; min-height: 100%;width: 750upx; margin: 0 auto;}
.service-list{margin: 20upx; margin-right: 5upx;}
.service-list .service-nav{width: 166.25upx; background: #FFFFFF; margin-right: 15upx; margin-bottom: 15upx; padding:  20upx 0;border-radius:15upx ; box-shadow: 0 0 4upx 0 #ccc; }
.service-list .service-nav .service-nav-img{width: 56.25upx; height: 56.25upx; margin: 20upx 55upx 20upx 55upx ; vertical-align: middle;}
.service-list .service-nav .service-nav-txt{text-align: center; font-size: 23upx; height: 40upx; display: flex; align-items: center; justify-content: center;}
.service-tab{padding:15px 10px; background: #fff; height: 25px; margin: 10px 0;}
.service-tab .li{flex: 1;color: #999;font-size: 14px;}
.service-tab .li:nth-child(1){border-right: 2upx solid #ccc;}
.service-tab .li .wwi-icon{margin-right: 10upx;}
.service-tab .li.ok{color: #333; font-weight: bold;}
.service-tab .li.ok .wwi-icon{color: #007AFF; font-size: 24px;}
.service-tab .li.ok:nth-child(1) .wwi-icon{color: #fbbd08;}
.page-body {display: flex; background: #FFFFFF;}
.nav {display: flex;width: 100%;}
.nav-left {width: 30%; background: #F8F8F8;}
.nav-left-item {height: 90upx;border-right: solid 2upx #FFFFFF;border-bottom: solid 2upx #FFFFFF;font-size: 26upx;display: flex;align-items: center;justify-content: center; background: #F8F8F8; position: relative;}
.nav-left-item.active:after{content: ""; width: 8upx; height: 20upx; background: #03A9F4; border-radius:5upx ; position: absolute; left: 10upx; top: 35upx;}
.nav-right {width: 70%;}

.active {color: #03A9F4; background: #FFFFFF;font-size: 28upx; font-weight: bold;}
.uni-navbar-btn {width: 1.125em !important;}
.brand-item{    float: left;width: 140upx;margin: 15upx 10upx 0 10upx;overflow: hidden;text-align: left;}
.brand-item image{width: 100%; margin: 15upx 0; height: 70upx; display: flex;}
.brand-item .brand-name{font-size: 22upx;line-height: 1em;white-space: nowrap;text-overflow: ellipsis;text-align: center;overflow: hidden;}

/*分类页商品*/
.module-title{position: relative;width: 100%;text-align: left;margin: 30upx auto 15upx auto;}
.module-title:before {width: 100%;position: absolute;top: 20upx;left: 0;content: '';height: 1px;background: #f2f2f2;}
.module-title .module-classname{display: inline-block;position: relative;height: 26upx;line-height:26upx;font-size: 26upx;vertical-align: middle;padding: 0 15upx; background: #FFFFFF; color: #03A9F4;}
.module-title .module-more{display: block;position: absolute;right: 0;top: 12upx;background: #FFF;padding: 0 15upx 0 10upx;height: 24upx;line-height: 24upx;font-size: 24upx; background: #FFFFFF; color: #858b8e;}
.nav-right-center{padding: 15upx;}
.nav-right-item {width: 100%;text-align: center;font-size: 22upx;}
.nav-right-item image {width: 100upx;height: 100upx;}
.module-center {width: 100%; display: inline-table;}
.module-center .module-item{width:160upx; float: left; color: #666e88;}
</style>
