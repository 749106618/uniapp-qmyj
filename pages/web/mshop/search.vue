<template>
	<view class="newBody">
		<!-- 固定在顶部的导航栏 -->
		<uni-nav-bar color="#333333" background-color="#FFFFFF" shadow="false" rightText="搜索" fixed="true"  @clickRight="Gonext">
				<view class="input-view">
					<view class="wwi-icon wwi-icon-sousuo"></view>
					<input class="input" type="text" placeholder="请输入搜索关键词" v-model="keyword" confirm-type="search" @confirm="Gonext" />
				</view>
		</uni-nav-bar>
		<!-- 占位用的导航栏 -->
		<uni-nav-bar background-color="rgba(0,0,0,0)" status-bar="true"></uni-nav-bar>		
        <navigator :url="'/pages/web/mshop/list?msid='+mid" class="categroy-all flex flexJcs">
			<view class="title">全部商品</view>
			<view class="wwi-icon wwi-icon-xuanzeqixiayige"></view>
		</navigator>
		<view class="store_category flex flexrow">
			<block v-for="(gc,v1) in goodsClass" :key="index">
				<block v-for="(gc2,v2) in gc.class" :key="v2">
			<navigator :url="'/pages/web/mshop/list?msid='+mid+ '&gcid='+v2" class="category-frist flex flexJcs">
				<view class="title">{{gc2.gc_name}}</view>
				<view class="span">查看全部</view>
			</navigator>
			<navigator :url="'/pages/web/mshop/list?msid='+mid+ '&gcid='+v3" v-for="(gc3,v3) in gc2.class" :key="v3" class="category-seciond">
				<view class="title">{{gc3.gc_name}}</view>
			</navigator>
			</block>
			</block>
		</view>
		<view style="height: 100upx;"></view>
		<view class="foot-bottom flex flexAic flexrow">
			<navigator open-type="redirect" :url="'/pages/web/mshop/index?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-cangku"></view>首页</navigator>
			<view class="li cur flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-yingyongAPP"></view>分类</view>
			<navigator open-type="redirect" :url="'/pages/web/mshop/cart?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-baoguo_yidong"></view>购物车</navigator>
			<navigator open-type="redirect" :url="'/pages/web/mshop/member?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-gerentouxiang"></view>我的</navigator>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../../components/uni-nav-bar.vue'
	export default {
		data(){
			return{
				keyword:'',
				goValue:'',
				mid:'',
				goodsClass:[]
			}
		},
		components: {
			uniNavBar
		},
		methods:{
			Inlimine:function(){
			  this.wwiopt({
					url: "/index.php?app=distribute&wwi=get_jfx_class",
					method: 'POST',
					data: {
						jfx_id: this.mid
					},
					success: res => {
						this.goodsClass = res.data.datas.gc_list;
					}
				});
			},
			Goback(){
				var page = getCurrentPages();
				if(page.length > 1){
				  uni.navigateBack();
				}else{
					uni.redirectTo({
						url:'/pages/web/mshop/index?msid='+this.mid
					})
				}
			},
			Gonext(){
				if(this.keyword == ''){
					return false;
				}
				uni.navigateTo({
					url:'/pages/web/mshop/list?msid='+this.mid+'&keyword='+this.keyword
				})
			}
		},
		onLoad:function(e){
			if(e.msid){
				this.mid = e.msid;
				uni.setStorageSync('msid',e.msid);
			}else{
				this.mid = uni.getStorageSync('msid');
			}
			if(!this.mid){
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
				return;
			}
			this.Inlimine();
			
		},
		onShow:function(){
			this.hisSearch = uni.getStorageSync('hisSearch');
			// #ifdef H5
			document.title = '-店内搜索-'+this.siteTitle;
			// #endif
			
		}
	}
</script>

<style>
page{background: #F8F8F8;}
.key-top{font-size: 16px; background: #FFFFFF; height: ;}
.input-view {position: absolute;width: 100%;top: 50%;transform: translateY(-50%);align-items: center;display: flex;flex-direction: row;background-color: #F8F8F8;height: 30px;border-radius: 0.78125em;padding: 0 0.3125em; font-size: 0.875em;box-sizing: border-box;}
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
.foot-bottom{position: fixed; bottom: 0; left: 0; right: 0;height: 90upx; font-size: 28upx; background: #F8F8F8; z-index: 99; }
.foot-bottom .li{flex: 1; height: 90upx; line-height: 30upx;}
.foot-bottom .li.cur{color: #FF0036;}
</style>
