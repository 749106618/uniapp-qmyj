<template>
	<view>
		<view class="container">
		<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" status-bar="false" rightText="搜索" fixed="false" @clickRight="Gonext">
				<view class="input-view">
					<view class="wwi-icon wwi-icon-sousuo"></view>
					<input class="input" type="text" placeholder="输入关键词搜索" @input="SearchKey" confirm-type="search" @confirm="Gonext" />
				</view>
		</uni-nav-bar>
			<view class="page-body">
				<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
					<view class="nav-left-item" @click="categoryClickMain('brand','b')" :class="'b'==categoryActive?'active':''">
						品牌选择
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
								<navigator class="module-more"  :url="'/pages/invite/selectGoods?gcid=' + item.gc_id">更多>></navigator>
							</view>
							<view class="module-center">
								<navigator class="module-item" style="padding: 10upx 0;" v-for="(subitem,sd) in item.child" :key="sd" :url="'/pages/invite/selectGoods?gcid=' + subitem.gc_id">
									<view>{{subitem.gc_name}}</view>
								</navigator>
							</view>
						</view>
						<navigator class="brand-item" v-if="isBrand" v-for="(item,index2) in subCategoryList" :key="index2" :url="'/pages/invite/selectGoods?bid=' + item.brand_id">
							<image :src="item.brand_pic?item.brand_pic:'../../static/nopic.png'" />
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
	import uniNavBar from '../../components/uni-nav-bar.vue'
	import uniIcon from '../../components/uni-icon.vue'
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
				keyword:''
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
			SearchKey(e){
				if(!e.mp.detail.value){
					this.keyword = '';
					return false;
				}
				this.keyword = e.mp.detail.value;
			},
				Gonext(){
						uni.navigateTo({
							url:'/pages/invite/selectGoods?keyword='+this.keyword
						})
				},
		},
		onLoad: function() {
			this.getCategory();
			this.getBrandlist();
			this.height = uni.getSystemInfoSync().windowHeight- 44; //-56
		},
		onShow:function(){
			// #ifdef H5
			document.title = '分类选择-'+this.siteTitle;
			// #endif
			
		}
	}
</script>
<style>
.input-view {position: absolute;width: 100%;top: 50%;transform: translateY(-50%);align-items: center;display: flex;flex-direction: row;background-color: #F8F8F8;height: 1.875em;border-radius: 0.78125em;padding: 0 0.3125em; font-size: 0.875em;box-sizing: border-box; line-height: 100%;}
.input-view .wwi-icon{font-size: 24px;}
.page-body {display: flex; background: #FFFFFF;}
.nav {display: flex;width: 100%;}
.nav-left {width: 30%; background: #F8F8F8;}
.nav-left-item {height: 90upx;border-right: solid 2upx #FFFFFF;border-bottom: solid 2upx #FFFFFF;font-size: 26upx;display: flex;align-items: center;justify-content: center; background: #F8F8F8;}
.nav-right {width: 70%;}

.active {color: #ff0036; background: #FFFFFF; border-left: #ff0036 solid 5upx ; font-size: 28upx; font-weight: bold;}
.uni-navbar-btn {width: 1.125em !important;}
.brand-item{    float: left;width: 140upx;margin: 15upx 10upx 0 10upx;overflow: hidden;text-align: left;}
.brand-item image{width: 100%; margin: 15upx 0; height: 70upx; display: flex;}
.brand-item .brand-name{font-size: 22upx;line-height: 1em;white-space: nowrap;text-overflow: ellipsis;text-align: center;overflow: hidden;}

/*分类页商品*/
.module-title{position: relative;width: 100%;text-align: left;margin: 30upx auto 15upx auto;}
.module-title:before {width: 100%;position: absolute;top: 20upx;left: 0;content: '';height: 1px;background: #f2f2f2;}
.module-title .module-classname{display: inline-block;position: relative;height: 26upx;line-height:26upx;font-size: 26upx;vertical-align: middle;padding: 0 15upx; background: #FFFFFF; color: #ff0036;}
.module-title .module-more{display: block;position: absolute;right: 0;top: 12upx;background: #FFF;padding: 0 15upx 0 10upx;height: 24upx;line-height: 24upx;font-size: 20upx; background: #FFFFFF; color: #ff0036;}
.nav-right-center{padding: 15upx;}
.nav-right-item {width: 100%;text-align: center;font-size: 22upx;}
.nav-right-item image {width: 100upx;height: 100upx;}
.module-center {width: 100%; display: inline-table;}
.module-center .module-item{width:160upx; float: left; color: #666e88;}
</style>
