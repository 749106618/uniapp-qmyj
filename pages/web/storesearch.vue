<template>
	<view class="newBody">
		<!-- #ifdef MP-WEIXIN -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" rightText="搜索" fixed="true" @clickRight="Gonext">
				<view class="input-view">
					<view class="wwi-icon wwi-icon-sousuo"></view>
					<input class="input" type="text" placeholder="请输入搜索关键词" @input="SearchKey" confirm-type="search" @confirm="Gonext" />
				</view>
		</uni-nav-bar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" leftIcon="xiangzuo" rightText="搜索" fixed="true" @click-left="Goback" @clickRight="Gonext">
				<view class="input-view">
					<view class="wwi-icon wwi-icon-sousuo"></view>
					<input class="input" type="text" placeholder="请输入搜索关键词" v-model="keyword" confirm-type="search" @confirm="Gonext" />
				</view>
		</uni-nav-bar>
		<!-- 占位用的导航栏 -->
		<uni-nav-bar background-color="rgba(0,0,0,0)" status-bar="true"></uni-nav-bar>		
		<!-- #endif -->
        <navigator :url="'/pages/web/storegoods?sid='+datas.store_info.store_id" class="categroy-all flex flexJcs">
			<view class="title">全部商品</view>
			<view class="wwi-icon wwi-icon-xuanzeqixiayige"></view>
		</navigator>
		<view class="store_category flex flexrow">
			<block v-for="(item,index) in datas.store_goods_class" :key="index">
			<navigator :url="'/pages/web/storegoods?sid='+datas.store_info.store_id+'&cid='+item.id" class="category-frist flex flexJcs" v-if="item.level == 1">
				<view class="title">{{item.name}}</view>
				<view class="span">查看全部</view>
			</navigator>
			<navigator :url="'/pages/web/storegoods?sid='+datas.store_info.store_id+'&cid='+item.id" class="category-seciond" v-else>
				<view class="title">{{item.name}}</view>
			</navigator>
			</block>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../components/uni-nav-bar.vue'
	export default {
		data(){
			return{
				datas:{
					store_info:[]
				},
				keyword:'',
				goValue:'',
				storeId:'1'
			}
		},
		components: {
			uniNavBar
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: "/index.php?app=store&wwi=store_goods_class",
					method:"POST",
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {store_id: this.storeId},
					success: res => {
						this.datas = res.data.datas;
					}
				});
			},
			Goback(){
				var page = getCurrentPages();
				if(page.length > 1){
				  uni.navigateBack();
				}else{
					uni.redirectTo({
						url:'/pages/web/store?storeid='+this.storeId
					})
				}
			},
			Gonext(){
				if(this.keyword == ''){
					return false;
				}
				uni.navigateTo({
					url:'/pages/web/storegoods?sid='+this.storeId+'&keyword='+this.keyword
				})
			}
		},
		onLoad:function(e){
			if(!e.id){
				this.Inlimine();
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
			this.hisSearch = uni.getStorageSync('hisSearch');
		}
	}
</script>

<style>
	page{background: #F8F8F8;}
.key-top{font-size: 16px; background: #FFFFFF; height: ;}
.input-view {position: absolute;width: 100%;top: 50%;transform: translateY(-50%);align-items: center;display: flex;flex-direction: row;background-color: #F8F8F8;height: 1.875em;border-radius: 0.78125em;padding: 0 0.3125em; font-size: 0.875em;box-sizing: border-box;}
.input-view .wwi-icon{font-size: 24px;}
.input {flex: 1;padding: 0 0.46875em;}
.categroy-all{padding: 20upx; background: #FFFFFF; margin-top: 20upx;}
.categroy-all .title{font-size: 30upx;}
.store_category{background: #FFFFFF; flex-wrap: wrap; margin-top: 20upx;}
.store_category .category-frist{width: 94%;padding: 20upx 3%;color: #333;}
.store_category .category-frist .title{font-size: 32upx;}
.store_category .category-frist .span{font-size: 26upx; color: #777;}
.store_category .category-seciond{width: 39.5%;padding: 20upx 3%;margin: 0 0 20upx 3%;background-color: #FAFAFA;}
.store_category .category-seciond .title{ font-size: 24upx;}
</style>
