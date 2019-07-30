<template>
	<view>
		<view class="evaluation-goods-main">
		<view class="wwiapp-tag-nav">
			<view class="li" :class="{'now':type==''}" @click="setType('')">全部评价</view>
			<view class="li" :class="{'now':type=='1'}" @click="setType('1')">好评</view>
			<view class="li" :class="{'now':type=='2'}" @click="setType('2')">中评</view>
			<view class="li" :class="{'now':type=='3'}" @click="setType('3')">差评</view>
			<view class="li" :class="{'now':type=='4'}" @click="setType('4')">订单晒图</view>
			<view class="li" :class="{'now':type=='5'}" @click="setType('5')">追加评价</view>
		</view>
		<view class="evaluation-goods-list">
			<view class="li" v-for="(item,index) in eveList" :key="index">
				<view class="eval-user flex flexrow flexAic">
					<view class="user-avatar"><image :src="item.member_avatar" mode=""></image></view>
					<view class="user-name">{{item.geval_frommembername}}</view>
					<view class="time">{{item.geval_addtime_date}}</view>
				</view>
				<view class="star flex flexrow">
					<view class="wwi-icon" :class="0 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
					<view class="wwi-icon" :class="1 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
					<view class="wwi-icon" :class="2 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
					<view class="wwi-icon" :class="3 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
					<view class="wwi-icon" :class="4 < item.geval_scores ? 'wwi-icon-star-full' : 'wwi-icon-star-empty'"></view>
				</view>
				<view class="eval-con">
					<view class="dt">{{item.geval_content}}</view>
					<view class="goods_geval" v-if="item.geval_image_240.length">
						<view class="geval-img" v-for="(gva,index2) in item.geval_image_240" :key="index2" @click="tapPicView(item.geval_image_1024)"><image :src="gva"></image></view>
					</view>
				</view>
				<view class="eval-explain" v-if="item.geval_explain">
					解释:{{item.geval_explain}}
				</view>
				<block v-if="item.geval_content_again">
				<view class="again-eval flex flexrow"> <view class="time">{{item.geval_addtime_again_date}}</view>追加评价</view>
				<view class="eval-con">
					<view class="dt">{{item.geval_content_again}}</view>
					<view class="goods_geval" v-if="item.geval_image_again_240.length">
						<view class="geval-img" v-for="(gva,index3) in item.geval_image_again_240" :key="index3" @click="tapPicView(item.geval_image_again_1024)"><image :src="gva"></image></view>
					</view>
				</view>
				<view class="eval-explain" v-if="item.geval_explain_again">
					解释:{{item.geval_explain_again}}
				</view>
				</block>
			</view>
			<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
		</view>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	import wwiLoadMore from '../../components/wwi-load-more.vue';
	export default {
		components: {
			wwiLoadMore
		},
		data() {
			return {
				type:'',
				goodsId:'',
				eveList:[],
				hasmore: true,
				curpage: 1,
				contentText: {
					contentdown:'上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				showPageTop:false,
				loadingType:0
			};
		},
		methods:{
			loadList:function(action = 'refresh'){
				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=goods&wwi=goods_evaluate',
					data: {goods_id:this.goodsId,type:this.type},
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.goods_eval_list.forEach(item => {
									this.info.eveList.push(item);
								});
								this.loadingType = 0;
							} else {
								this.eveList = res.data.datas.goods_eval_list;
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
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			},
			setType:function(e){
				if(e==this.type){
					return false;
				}
				this.type = e;
			this.hasmore = true;
			this.curpage = 1;
			this.loadingType = 0;
			this.loadList();
			}
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.loadingType = 0;
			this.loadList();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.loadList('onbot');
			} else {
				this.loadingType = 2;
			}
		},
		onLoad:function(e){
			this.goodsId = e.id;
			this.loadList()
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
page{  background: #F8F8F8;}
.wwiapp-tag-nav{display: flex; flex-direction: row; flex-wrap: wrap;}
.wwiapp-tag-nav .li{font-size: 28upx; padding: 5upx 15upx; background: #AAAAAA; margin-right: 20upx; margin-bottom: 20upx; border-radius:10upx ; color: #FFFFFF;}
.wwiapp-tag-nav .li.now{background: #FF0036;}
.evaluation-goods-main{padding: 20upx;}
.evaluation-goods-list{}
.evaluation-goods-list .li{background: #FFFFFF; border-radius:20upx; padding: 20upx; margin-bottom: 20upx;}
.evaluation-goods-list .li .eval-user{padding-bottom: 10upx; border-bottom: 1px dotted #DDDDDD; margin-bottom: 15upx;}
.evaluation-goods-list .li .eval-user .user-avatar{}
.evaluation-goods-list .li .eval-user .user-avatar image{width: 60upx; height: 60upx; border-radius:50% ; vertical-align: middle;}
.evaluation-goods-list .li .eval-user .user-name{font-size: 28upx; flex: 1; margin-left: 20upx;}
.evaluation-goods-list .li .eval-user .time{color: #777777; font-size: 24upx;}
.evaluation-goods-list .li .star .wwi-icon{font-size: 30upx; width: 24upx; color: #777777;}
.evaluation-goods-list .li .star .wwi-icon-star-full{color: #FF0036;}
.evaluation-goods-list .li .eval-con{}
.evaluation-goods-list .li .eval-con .dt{font-size: 28upx;}
.evaluation-goods-list .li .eval-con .goods_geval{padding: 20upx; display: flex; flex-direction: row; background: #fbfeff;}
.evaluation-goods-list .li .eval-con .goods_geval .geval-img{ margin-right: 20upx;}
.evaluation-goods-list .li .eval-con .goods_geval .geval-img image{width: 80upx; height: 80upx; vertical-align: middle;}
.big-img-show{position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999;}
.big-img-show .img-mask{position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: rgba(0,0,0,0.5);}
.big-img-show .t-img{ display: flex; justify-content: center; align-items: center; height: 100%;}
.big-img-show .t-img image{width: 750upx; height: 750upx; min-height: 750upx;}
.big-img-show .wwi-icon{position: absolute; z-index: 1; font-size: 58upx; color: #FFFFFF; right: 20upx; top: 20upx;}
.evaluation-goods-list .li .eval-explain{font-size: 24upx; color: #ffab91;padding: 10upx;}
.evaluation-goods-list .li .again-eval{font-size: 26upx; color: #DDDDDD;}
</style>
