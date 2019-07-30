<template>
	<view>
		<view class="wwi-trading-nav">
			<scroll-view scroll-x class="list-main">
				<view class="li" @click="changeClass(1,cate.cate_id)" :class="{'ok':changebig==cate.cate_id}" v-for="(cate,vv) in cate_big"
				 :key="vv">
					<view class="wwi-icon s1">
						<image :src="cate.pic" mode="widthFix"></image>
					</view>
					<view class="span">{{cate.cate_name}}</view>
				</view>
			</scroll-view>
		</view>
		<view class="trading-select-bar" v-if="cate_two.length">
			<view class="list-main flex flexrow flexwrap" v-if="!chickMore">
				<view class="li" :class="{'ok':changetwo==cate.id}" @click="changeClass(2,cate.id)" v-for="(cate,vvv) in cate_two"
				 :key="vvv">{{cate.name}}</view>
			</view>
			<view class="list-main flex flexrow flexwrap" v-else>
				<view class="li" :class="{'ok':changetwo==cate.id}" @click="changeClass(2,cate.id)" v-for="(cate,vvv) in cate_two"
				 :key="vvv" v-if="vvv < 8">{{cate.name}}</view>
			</view>
			<view class="list-main mt5 flex flexrow flexwrap" v-if="!chickMore && cate_three.length">
				<view class="li" :class="{'ok':changethree==cate.subid}" @click="changeClass(3,cate.subid)" v-for="(cate,vvvv) in cate_three"
				 :key="vvvv">{{cate.name}}</view>
			</view>
			<view class="more wwi-icon wwi-icon-xuanzeqishouqi flex flexAic flexJcc" @tap="chickMore =!chickMore" v-if="!chickMore"></view>
			<view class="more wwi-icon wwi-icon-xuanzeqizhankai flex flexAic flexJcc" @tap="chickMore =!chickMore" v-else-if="chickMore"></view>
		</view>
		<view class="trading-list">
			<navigator :url="'/pages/web/tradingInfo?trad_id='+item.id" class="li flex flexJcs" v-for="(item,v) in listData" :key="v">
				<view class="li-left">
					<view class="title">{{item.title}}</view>
					<view class="info">{{item.context}}</view>
					<view class="pate-oauth flex flexrow flexwrap">参与该项目的服务商有：<view class="pate-store" v-for="(store,tt) in item.servicename"
						 :key="tt" v-if="item.servicename.length">{{store.name}}</view>
					</view>
				</view>
				<view class="li-right">
					<view class="project-state flex flexrow flexAic">
						<view class="wwi-icon" :class="'wwi-icon-gongchengjindu-'+item.status_rate"></view>{{item.status}}
					</view>
					<view class="project-span flex flexAic">
						<view class="num">{{item.count}}</view>人参与
					</view>
					<view class="project-span flex flexAic">
						<block v-if="item.day > 0">
							<view class="num">{{item.day}}</view>天后截止
						</block>
						<block v-else="">已截至</block>
					</view>
				</view>
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
				cate_big: [],
				cate_two: [],
				cate_three: [],
				changebig: 0,
				changetwo: 0,
				changethree: 0,
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
					url: '/index.php?app=default&wwi=tradesdemandlist',
					data: {
						cate_id: this.changebig,
						id: this.changetwo,
						subid: this.changethree,
						page: this.page,
						curpage: this.curpage
					},
					method: 'POST',
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.order_list.forEach(item => {
									this.listData.push(item);
								});

								this.loadingType = 0;
							} else {
								this.listData = res.data.datas.order_list;
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
					url: this.ApiUrl + '/index.php?app=default&wwi=tradebigclass',
					success: res => {
						this.cate_big = res.data.datas.list;
					}
				});
			},
			changeClass: function(type, id) {
				if (type == '1') {
					if (id == this.changebig) {
						return false;
					}
					this.chickMore = false;
					this.changebig = id;
					this.changetwo = 0;
					this.changethree = 0;
					this.cate_two = '';
					this.cate_three = '';

					this.wwiopt({
						url: '/index.php?app=default&wwi=tradesmallclass',
						data: {
							cate_id: id
						},
						method: 'POST',
						success: res => {
							this.cate_two = res.data.datas.list;
						}
					});
				} else if (type == '2') {
					if (id == this.changetwo) {
						return false;
					}
					this.changetwo = id;
					this.changethree = 0;
					this.cate_three = '';
					if (this.changebig == 3) {
						this.wwiopt({
							url: '/index.php?app=default&wwi=tradesthreeclass',
							data: {
								id: id
							},
							method: 'POST',
							success: res => {
								this.cate_three = res.data.datas.list;
							}
						});
					}
				} else if (type == '3') {
					if (id == this.changethree) {
						return false;
					}
					this.changethree = id;
				}
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
		onLoad: function() {
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
		}
	}
</script>

<style>
page{background-color: #F8F8F8;height: auto; min-height: 100%;width: 750upx; margin: 0 auto;}
.wwi-trading-nav{   padding:20upx 20upx 0 ;overflow: hidden; width: 100%; box-sizing: border-box;}
.wwi-trading-nav .list-main{    width: auto;  white-space: nowrap;}
.wwi-trading-nav .li.ok{background: #FFFFFF;}
.wwi-trading-nav .li{ width: auto; display: inline-block; padding: 20upx 40upx; overflow: hidden; vertical-align: middle;}
.wwi-trading-nav .li .wwi-icon{width: 60upx; height: 60upx; padding: 20upx;display: flex; justify-content: center; align-items: center;background-position: 50%; border-radius:60upx; position: relative; z-index: 1;}
.wwi-trading-nav .li .span{font-size: 26upx; margin-top: 10upx; text-align: center;}
.wwi-trading-nav .li.ok .wwi-icon{background: #d6edeb;}
.wwi-trading-nav .li .wwi-icon{background: #e5e5e5;}
.trading-select-bar{padding: 20upx; background: #FFFFFF;}
.trading-select-bar .list-main{ border: 2upx solid #F8F8F8; border-right:0 ; width: 706upx;}
.trading-select-bar .list-main .li{width: 177upx; box-sizing: border-box; height: 80upx; display: flex; justify-content: center; align-items: center; border-right: 2upx solid #F8F8F8;border-bottom: 2upx solid #F8F8F8; font-size: 26upx;}
.trading-select-bar .list-main .li.ok{color: #2cb476; font-weight: bold;}
.trading-list{margin: 20upx;}
.trading-list .li{background: #FFFFFF; padding:40upx 30upx; border-radius: 20upx; margin-bottom: 20upx;}
.trading-list .li .li-left{width: 500upx;}
.trading-list .li .li-left .title{font-size: 32upx;line-height: 38upx;max-height: 76upx;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal; font-weight: bold;}
.trading-list .li .li-left .info{font-size: 28upx;line-height: 32upx;max-height: 32upx; overflow: hidden; -o-text-overflow: ellipsis;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;white-space: normal; margin : 20upx 0;  color: #808080;}
.trading-list .li .li-left .pate-oauth{border-top: 4upx solid #e9f7f1;font-size: 28upx;line-height: 32upx;max-height: 64upx; overflow: hidden; color: #adadad;padding-top: 20upx;}
.trading-list .li .li-left .pate-store{color: #00a8c1; margin-right: 20upx;}
.trading-list .li .li-right{}
.trading-list .li .li-right .project-state{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display: flex; justify-content: center; align-items: center; border-radius: 35upx;}
.trading-list .li .li-right .project-state .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.trading-list .li .li-right .project-span{justify-content: flex-end; font-size: 24upx; margin-bottom: 10upx; color: #a6a6a6;}
.trading-list .li .li-right .project-span .num{color: #44ba83; font-weight: bold; font-weight: bold; margin-right: 10upx;}
</style>
