<template>
	<view>
		<view class="service-list-baner"><image :src="cData.adv.adv_pic" style="width: 100%;" mode="widthFix"></image></view>
		<view class="wwi-serviceList-nav">
			<scroll-view scroll-x class="list-main">
				<view class="li" @click="changeClass(cate.gc_id)" :class="{'ok':gcId==cate.gc_id}" v-for="(cate,vv) in cData.picture_class"
				 :key="vv">
					<view class="wwi-icon s1">
						<image :src="cate.gc_thumb" mode="widthFix"></image>
					</view>
					<view class="span">{{cate.gc_name}}</view>
				</view>
			</scroll-view>
		</view>
		
		<view class="service-list-data">
			<view class="li" v-for="(item,vv) in listData" :key="vv">
				<view class="hd flex flexrow flexAic">
					<navigator :url="'/pages/web/jstore?storeId='+item.store_id" class="hd-left">
						<view class="store-info flex flexrow flexAic"><image :src="item.mer_logo" mode="" class="img"></image><view class="store-name">{{item.store_name}}</view></view>
						<view class="store-rate flex flexrow">案例数:<view class="num">{{item.store_picture_sum}}</view> | 商品数:<view class="num">{{item.store_goods_sum}}</view> </view>
					</navigator>
					<navigator :url="'/pages/my/chatinfo?tid='+item.store_id" class="hd-right flex flexAic flexJcc">在线沟通</navigator>
				</view>
				<navigator :url="'/pages/web/jstore?storeId='+item.store_id" class="bd flex flexrow">
					<view class="bd-left">
						<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="picSwipe">
							<swiper-item class="img" v-for="(pic,vvv) in item.store_slide" :key="vvv">
								<image :src="pic" mode="widthFix"></image>
							</swiper-item>
						</swiper>
					</view>
					<view class="bd-right">{{item.store_description}}</view>
				</navigator>
			</view>
		</view>
		<wwi-load-more :loadingType="loadingType" :contentText="contentText"></wwi-load-more>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	import wwiLoadMore from '@/components/wwi-load-more.vue';
	export default {
		components: {
			wwiLoadMore
		},
		data() {
			return {
				cData: {
					picture_class:{},
					adv:{}
				},
				jiaoSeType: 0,
				gcId: 0,
				storeName: '',
				listData: [],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadingType: 3,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop: false,
				chickMore: false
			}
		},
		methods: {
			Inlimine(action = 'refresh') {
				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=service&wwi=index',
					data: {
						jiaose_type: this.jiaoSeType,
						gc_id: this.gcId,
						store_name: this.storeName,
						page: this.page,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.store_list.forEach(item => {
									this.listData.push(item);
								});

								this.loadingType = 0;
							} else {
								this.listData = res.data.datas.store_list;
								uni.stopPullDownRefresh();
								this.loadingType = 0;
								if (!res.data.hasmore) {
									this.loadingType = 3;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					}
				});
			},
			getClass: function(id) {
				uni.request({
					url: this.ApiUrl + '/index.php?app=service&wwi=class_adv',
					success: res => {
						this.cData = res.data.datas;
					}
				});
			},
			changeClass:function(e){
				if(e==this.gcId){
					return false;
				}
				this.gcId = e;
				this.hasmore = true;
				this.curpage = 1;
				this.Inlimine();
				
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			}
		},
		onLoad: function(e) {
			if(e.jiaoSeType){
				this.jiaoSeType = e.jiaoSeType;
			}
			this.getClass();
			this.Inlimine();
		},
		onPullDownRefresh: function() {
			this.hasmore = true;
			this.curpage = 1;
			this.Inlimine();
		},
		onReachBottom: function() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadingType = 3;
			}
		},
		onPageScroll: function(e) {
			if (e.scrollTop > 300) {
				this.showPageTop = true;
			} else if (e.scrollTop < 300) {
				this.showPageTop = false;
			}
		},
		onNavigationBarSearchInputConfirmed(e) {
			this.storeName = e.text;
			this.hasmore = true;
			this.curpage = 1;
			this.Inlimine();
		}
	}
</script>

<style>
.wwi-serviceList-nav{   padding:20upx 20upx 0 ;overflow: hidden; width: 100%; box-sizing: border-box;}
.wwi-serviceList-nav .list-main{    width: auto;  white-space: nowrap;}
.wwi-serviceList-nav .li.ok{background: #FFFFFF;}
.wwi-serviceList-nav .li{ width: auto; display: inline-block; padding: 20upx 40upx; overflow: hidden; vertical-align: middle; background: #fff; margin-right: 20upx; border-radius: 15upx;}
.wwi-serviceList-nav .li .wwi-icon{width: 60upx; height: 60upx; padding: 20upx;display: flex; justify-content: center; align-items: center;background-position: 50%; border-radius:60upx; position: relative; z-index: 1;}
.wwi-serviceList-nav .li .span{font-size: 26upx; margin-top: 10upx; text-align: center;}
.wwi-serviceList-nav .li.ok .wwi-icon{background: #d6edeb;}
.wwi-serviceList-nav .li .wwi-icon{background: #e5e5e5;}
.wwi-serviceList-nav .li.ok .span{color: #2CB476;}

.service-list-data{margin: 20upx;}
.service-list-data .li{padding: 20upx; background: #fff; border-radius:15upx ; box-shadow: 0 0 10upx 0 #eee; margin-bottom: 20upx;}
.service-list-data .li .hd{padding: 20upx 0;}
.service-list-data .li .hd .hd-left{flex: 1;}
.service-list-data .li .hd .hd-left .store-info{}
.service-list-data .li .hd .hd-left .store-info .img{width: 50upx; height: 50upx; border-radius: 50upx; border: 1px solid #F8F8F8;}
.service-list-data .li .hd .hd-left .store-info .store-name{font-size: 28upx; font-weight: bold; margin-left: 20upx;}
.service-list-data .li .hd .hd-left .store-rate{font-size: 26upx; color: #ccc; margin-top: 20upx;}
.service-list-data .li .hd .hd-left .store-rate .num{color: #2CB476; margin: 0 20upx; font-weight: bold;}
.service-list-data .li .hd .hd-right{width: 150upx; height: 60upx; background: #2CB476; color: #fff;}
.service-list-data .li .bd{}
.service-list-data .li .bd .bd-left{flex: 1;}
.service-list-data .li .bd .bd-left .picSwipe{border-radius: 15upx; overflow: hidden;height: 250upx;}
.service-list-data .li .bd .bd-left .picSwipe .img image{ vertical-align: middle;}
.service-list-data .li .bd .bd-right{width: 250upx; margin-left: 20upx;overflow: hidden; max-height: 250upx; line-height: 42upx;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 6;-webkit-box-orient: vertical;white-space: normal;}
.service-list-baner{}
</style>
