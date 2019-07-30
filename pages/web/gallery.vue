<template>
	<view class="">
		<view class="gallery-tab">
			<scroll-view class="menu" scroll-x>
				<view class="li" :class="{'ok':classId==menu.class_id}" v-for="(menu,v) in menu" :key="v" @tap="changeNav(menu.class_id)">
					<view class="wwi-icon">
						<image :src="menu.image" mode="widthFix"></image>
					</view>
					<view class="">{{menu.menu_title}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="gallery-list">
				<view v-if="!listData.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-sousuo2"></view>
						<view class="dl">
							<view class="dt">没有搜索到相关数据</view>
						</view>
					</view>
				</view>
			<navigator :url="'/pages/web/galleryinfo?pid='+item.picture_id" class="li" v-for="(item,vv) in listData" :key="vv">
				<view class="hd">{{item.title}}</view>
				<view class="cd flex flexrow">来源：<view class="store">{{item.form_mer}}</view></view>
				<view class="img"><image :src="item.image" mode="widthFix"></image></view>
				<view class="bd">{{item.content}}</view>
			</navigator>
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
				listData:[],
				menu:[],
				key:'',
				page: '10',
				hasmore: true,
				curpage: 1,
				loadingType: 3,
				classId: 0,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop: false
			}
		},
		methods: {
				inlimine:function(action = 'refresh'){
					if (!this.hasmore) {
						this.loadingType = 2;
						return;
					}
					this.loadingType = 1;
					this.wwiopt({
						url: '/index.php?app=service&wwi=picture_list',
						data:{page: this.page,curpage: this.curpage,class_id:this.classId},
						success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.list.forEach(item => {
									this.listData.push(item);
								});

								this.loadingType = 0;
							} else {
								this.listData = res.data.datas.list;
								this.menu = res.data.datas.menu;
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
				changeNav:function(e){
					if(e==this.classId){
						return false;
					}
					this.classId = e;
					this.hasmore = true;
					this.curpage = 1;
					this.inlimine();
				},
				goPageTop() {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 300
					});
					this.showPageTop = false;
				}
	},
	onLoad:function(){
		this.inlimine();
	},
	onPullDownRefresh: function() {
		this.hasmore = true;
		this.curpage = 1;
		this.inlimine();
	},
	onReachBottom: function() {
		if (this.hasmore) {
			this.inlimine('onbot');
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
	}
	}
</script>

<style>
.gallery-tab{ background: #FFFFFF; margin: 20upx 0; padding:20upx 0;}
.gallery-tab .menu{idth: auto;  white-space: nowrap;}
.gallery-tab .menu .li{width: auto;position: relative;padding:0 30upx;display: inline-block;overflow: hidden; font-size: 28upx; line-height: 60upx; border-right:1px solid #F8F8F8 ;}

.gallery-tab .menu .li .wwi-icon{width: 60upx; height: 60upx; padding: 20upx;display: flex; justify-content: center; align-items: center;background-position: 50%; border-radius:60upx; position: relative; z-index: 1;}
.gallery-tab .menu .li .span{font-size: 26upx; margin-top: 10upx; text-align: center;}
.gallery-tab .menu .li.ok .wwi-icon{background: #d6edeb;}
.gallery-tab .menu .li.ok{color: #2CB476;}
.gallery-list .li{background: #FFFFFF; padding: 20upx; border-bottom: 1px solid #F8F8F8;}
.gallery-list .li .hd{font-size: 32upx; font-weight: bold;line-height: 35upx;max-height:70upx;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;}
.gallery-list .li .cd{color: #ccc; font-size: 26upx; margin: 15upx 0;}
.gallery-list .li .cd .store{color: #2cb476;}
.gallery-list .li .img{width: 100%; }
.gallery-list .li .img image{width: 100%;border-radius: 20upx;}
.gallery-list .li .bd{color: #afafaf; font-size: 26upx;line-height: 40upx;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical;white-space: normal;}
</style>
