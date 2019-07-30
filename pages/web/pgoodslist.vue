<template>
	<view>
		<view class="integral-02">
				<view v-if="!pointsprod.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-yichangshangbao"></view>
						<view class="dl">
							<view class="dt">没有找到任何相关信息</view>
						</view>
					</view>
				</view>
			<view class="goods-point flex flexrow flexJcs" v-if="pointsprod.length >0">
				<navigator :url="'/pages/web/pgoodsinfo?id='+item.pgoods_id" class="bargin-item flex flexcol" v-for="(item,index) in pointsprod" :key="index">
					<image :src="item.pgoods_image"></image>
					<view class="title">{{item.pgoods_name}}</view>
					<view class="flex flexcol">
						<view class="bargin-item-price gray-word">所需积分:</view>
						<view class="bargin-item-p">{{item.pgoods_points}}</view>
					</view>
					<view class="bargin-new-price flex flexrow flexJcs flexAcc flexAic">
						<view class="bargin-old-price">&yen;{{item.pgoods_price}}</view>
						<view class="bargin-btn">兑换</view>
					</view>
				</navigator>
			</view>
				<view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				pointsprod:[],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadMore: '加载更多...',
				showloadMore: false,
				showPageTop: false
			}
		},
		methods:{
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url: '/index.php?app=points&wwi=exchange_pgoods',
					data: {
						page: this.page,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.pointprod_list.forEach(item => {
									this.pointsprod.push(item);
								});
							} else {
								this.pointsprod = res.data.datas.pointprod_list;
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
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
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
 @import "../../common/css/integral.css";
</style>
 