<template>
	<view>
		<view class="activity-list flex flexcol">
				<view v-if="!avList.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">未查询到相关活动</view>
							<view class="dd">您可以浏览其他页面信息</view>
						</view>
					</view>
				</view>
			<navigator :url="'/pages/web/activityInfo?id='+item.activity_id" class="item flex flexcol" v-for="(item,index) in avList" :key="index">
				<view class="hd">{{item.activity_title}}</view>
				<view class="bd">{{item.activity_desc}}</view>
				<view class="piclist flex flexrow">
					<view class="li" v-for="(img,index2) in item.goods_list">
						<image :src="img.goods_image"></image>
						<view class="span">&yen;{{img.goods_price}}</view>
					</view>
				</view>
			</navigator>
			<view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avList:[],
				curpage:1,
				hasmore:true,
				loadMore: '加载更多...',
				showloadMore: false,
				showPageTop: false
			};
		},
		methods:{
			Inlimine:function(action = 'refresh'){
				if(!this.hasmore){
					return;
				}
				this.wwiopt({
					url:'/index.php?app=activity&wwi=list',
					data: {page:10,curpage:this.curpage},
					success: res => {
						if(res.data.code==200){
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.hd_list.forEach(item => {
									this.avList.push(item);
								});
							} else {
								this.avList = res.data.datas.hd_list;
								uni.stopPullDownRefresh();
								if (res.data.hasmore) {
									this.showloadMore = true;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					}
				});
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			}
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadMore = '没有更多数据了！';
			}
		},
		onLoad: function() {
			this.Inlimine();
		},
		onUnload: function() {
			this.hasmore = true,
			this.curpage = 1,
			this.avList = [],
			this.loadMore = '加载更多...';
		},
		onPageScroll: function(e) {
			if (e.scrollTop > 300) {
				this.showPageTop = true;
			} else if (e.scrollTop < 300) {
				this.showPageTop = false;
			}
		},
		onNavigationBarButtonTap:function(e){
			console.log(e)
		}
	}
</script>

<style>
.activity-list{padding-bottom: 20upx;}
.activity-list .item{margin: 20upx; padding: 20upx; background: #FFFFFF; margin-bottom: 0; border-radius:15upx ;}
.activity-list .item .hd{font-size: 32upx; font-weight: bold;}
.activity-list .item .bd{font-size: 28upx;line-height: 1.25em;max-height: 2.5em;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal; margin-top: 10upx; color: #888888;}
.activity-list .item .piclist{margin-top: 15upx;}
.activity-list .item .piclist .li{width: 216.66upx; margin-right: 10upx;}
.activity-list .item .piclist .li:last-child{margin-right: 0;}
.activity-list .item .piclist .li image{width: 216.66upx; height: 216.66upx;}
.activity-list .item .piclist .li .span{color: #FF0036; font-size: 28upx;}
</style>
