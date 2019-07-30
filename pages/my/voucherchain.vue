<template>
	<view>
		<view class="wwiapp-asset-info voucher">
			<view class="container">
		<view class="i wwi-icon wwi-icon-qiaquan"></view>
			<view class="dl rule">
				<view class="dd"></view>
				<view class="dd"></view>
			</view>
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-icon">
			<navigator class="icon-li" url="/pages/my/voucherlist" open-type="redirect"><view class="wwi-icon wwi-icon-qiaquan color-cs"></view><text>店铺代金券</text></navigator>
			<view class="icon-li color-hui"><view class="wwi-icon wwi-icon-yizhan"></view><text>门店代金券</text></view>
			<navigator class="icon-li" url="/pages/my/voucherpwex"  open-type="redirect" ><view class="wwi-icon wwi-icon-zhangdan-wancheng color-qs"></view><text>领取代金券</text></navigator>
		</view>
		<view class="clear mt10"></view>
		<view class="voucher-list">
			<view class="wwi-tab">
				<view class="tab-li" :class="{'wwi-this':tabId=='1'}" @click="newList('1')">可用</view>
				<view class="tab-li" :class="{'wwi-this':tabId=='2'}"  @click="newList('2')">已使用</view>
				<view class="tab-li" :class="{'wwi-this':tabId=='3'}"  @click="newList('3')">已过期</view>
				</view>
			<view v-if="!log_list.length" class="no-data">未查询到代金券数据</view>
			<navigator url="#" class="li" :class="{'ysy':item.voucher_state>'1'}" v-for="(item,index) in log_list" :key="index">
				<view class="tikect-info">
					<image :src="item.voucher_t_customimg" class="img"></image>
					<view class="dl">
						<view class="dt">
							<view class="em">￥</view>
							<view class="strong">{{item.voucher_price}}</view><view class="span" v-if="item.voucher_limit">满{{item.voucher_limit}}可用</view>
							<view class="span" v-else>不限制金额可用</view>
							</view>
						<view class="dd">店铺代金券</view>
						<view class="dd date">{{item.voucher_start_date_text}}-{{item.voucher_end_date_text}}</view>
					</view>
				</view>
				<view class="store-info">
					<view v-if="item.voucher_state==1" class="span">去使用</view>
					<view v-else-if="item.voucher_state==2" class="span">已使用</view>
					<view v-else=""  class="span">已过期</view>
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
				key: '',
				log_list: [],
				page: '10',
				hasmore: true,
				curpage: 1,
				loadMore: '加载更多...',
				showloadMore: false,
				showPageTop:false,
				tabId:'1'
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url: '/index.php?app=member_voucher&wwi=chain_voucher_list',
					method: 'POST',
					data: {
						key: this.key,
						page: this.page,
						voucher_state:this.tabId,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.voucher_list.forEach(item => {
									this.log_list.push(item);
								});
							} else {
								this.log_list = res.data.datas.voucher_list;
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
			newList(e){
				this.tabId=e;
			this.hasmore = true;
			this.curpage = 1;
			this.loadMore = '加载更多...';
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
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
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
	page{background-color: #F8F8F8;}
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
	.input-group{margin-top: 0;}
	.wwi-tab .tab-li.wwi-this:after {border-color:#FB6E52;}
	.wwi-tab .tab-li.wwi-this{color: #FB6E52;}
</style>
