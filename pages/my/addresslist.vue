<template>
	<view>
		<view class="wwiapp-address-list">
			<view class="li" v-for="(item,index) in address_list" :key="index">
				<view class="dl">
					<view class="dt">
						<text class="name">{{item.true_name}}</text>
						<text class="phone">{{item.mob_phone}}</text>
					</view>
					<view class="dd">{{item.area_info}} {{item.address}}</view>
				</view>
				<view class="handle">
					<view class="lt">
						<view v-if="item.is_default==1">默认地址</view>
					</view>
					<view class="rt">
						<navigator :url="'/pages/my/addressadd?id='+item.address_id" class="a">
							<view class="wwi-icon wwi-icon-bianjibiaoge"></view>编辑
						</navigator>
						<view class="a" @click="del(index,item.address_id)">
							<view class="wwi-icon wwi-icon-shanchu"></view>删除
						</view>
					</view>
				</view>
			</view>
			<view class="loadMore" v-if="showloadMore">{{loadMore}}</view>
			<navigator url="/pages/my/addressadd" class="btn-l">新增收货地址</navigator>
		</view>
		<navigator url="/pages/my/addressadd" class="wwi-icon wwi-icon-jiahao clearView"></navigator>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				address_list: [],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadMore: '加载更多...',
				showloadMore: false,
				showPageTop: false
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url:'/index.php?app=member_address&wwi=address_list',
					data: {
						key: this.key,
						page: this.page,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.address_list.forEach(item => {
									this.address_list.push(item);
								});
							} else {
								this.address_list = res.data.datas.address_list;
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
			del(index, e) {
				if (e <= 0) {
					uni.showToast({
						title: '删除失败',
						icon: 'none'
					});
				}
				uni.showModal({
					title: '提示',
					content: '是否确定要删除该收货地址',
					success: res => {
						if (res.confirm) {
							this.wwiopt({
								url: '/index.php?app=member_address&wwi=address_del',
								method: 'POST',
								data: {
									address_id: e,
									key: this.key
								},
								success: res => {
									this.checkLogin(res.data.login);
									if (res.data) {
										this.address_list.splice(index, 1);
										uni.showToast({
											title: '删除地址成功',
											icon: 'none'
										});
									}
								}
							});
						} else if (res.cancel) {
							uni.showToast({
								title: '取消删除',
								icon: 'none'
							});
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
			this.loadMore = '加载更多...';
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
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.hasmore = true;
			this.curpage = 1;
			this.loadMore = '加载更多...';
			this.Inlimine();
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
page{background-color: #F8F8F8;}
/*我的收货地址*/
.wwiapp-address-list {}
.wwiapp-address-list .li { background-color: #FFF; padding: 0 0 0 20upx; margin-bottom:20upx;}
.wwiapp-address-list .li .dl { border-bottom: solid 2upx #EEE; padding:20upx 20upx 20upx 0;}
.wwiapp-address-list .li .dt { height: 50upx; line-height: 50upx; margin-bottom: 12upx;  font-size: 0; display: flex; flex-direction: row;}
.wwiapp-address-list .li .dt .name { min-width: 200upx; font-size: 36upx; font-weight: 600; color: #555;}
.wwiapp-address-list .li .dt .phone {flex: 1; font-size: 28upx; color: #333;}
.wwiapp-address-list .li .dd { min-height: 64upx; font-size: 28upx; line-height:32upx; color: #777;}
.wwiapp-address-list .li .handle { height: 36upx; padding: 20upx 0; z-index: 1; font-size: 24upx; line-height: 36upx; color: #555; display: flex;justify-content: space-between; flex-direction: row;}
.wwiapp-address-list .li .handle .rt { display: flex;}
.wwiapp-address-list .li .handle .rt .a { font-size: 28upx; color: #555; margin-right: 20upx; line-height: 36upx;}
.wwiapp-address-list .li .handle .rt .a .wwi-icon{line-height: 36upx; font-size: 36upx;}
.clearView{width: 60upx; height: 60upx; border-radius:50% ; background: rgba(0,0,0,0.6); position: fixed; z-index: 99; bottom: 170upx; right: 10upx; color: #FFFFFF;text-align: center; line-height: 60upx !important;}

</style>
