<template>
	<view>
		<view class="wwiapp-asset-info packet">
			<view class="container">
		<view class="i wwi-icon wwi-icon-hongbao"></view>
			<view class="dl rule">
				<view class="dd"></view>
				<view class="dd"></view>
			</view>
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-icon">
			<view class="icon-li color-hui"><view class="wwi-icon  wwi-icon-hongbao"></view><text>我的红包</text></view>
			<navigator class="icon-li" url="/pages/my/redpacketpwex"  open-type="redirect" ><view class="wwi-icon wwi-icon-zijinxunhuan color-qs"></view><text>领取红包</text></navigator>
		</view>
		<view class="clear mt10"></view>
		<view class="voucher-list">
			<view class="wwi-tab">
				<view class="tab-li" :class="{'wwi-this':tabId=='unused'}" @click="newList('unused')">可用</view>
				<view class="tab-li" :class="{'wwi-this':tabId=='used'}"  @click="newList('used')">已使用</view>
				<view class="tab-li" :class="{'wwi-this':tabId=='expire'}"  @click="newList('expire')">已过期</view>
				</view>
			<view v-if="!log_list.length" class="no-data">未查询到红包数据</view>
			<navigator :url="'/pages/my/redpacketinfo?rpt_id='+item.rpacket_id" class="li" :class="{'ysy':item.rpacket_state>'1'}" v-for="(item,index) in log_list" :key="index">
				<view class="tikect-info">
					<image :src="item.rpacket_customimg_url" class="img"></image>
					<view class="dl">
						<view class="dt">
							<view class="em">￥</view>
							<view class="strong">{{item.rpacket_price}}</view><view class="span" v-if="item.rpacket_limit">满{{item.rpacket_limit}}可用</view>
							<view class="span" v-else>不限制金额可用</view>
							</view>
						<view class="dd">{{item.rpacket_usetype_text}}</view>
						<view class="dd date">{{item.rpacket_start_date_text}}-{{item.rpacket_end_date_text}}</view>
					</view>
				</view>
				<view class="store-info">
					<view v-if="item.rpacket_state==1" class="span">去使用</view>
					<view v-else-if="item.rpacket_state==2" class="span">已使用</view>
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
				tabId:'unused'
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				this.wwiopt({
					url: '/index.php?app=member_redpacket&wwi=redpacket_list',
					method: 'POST',
					data: {
						key: this.key,
						page: this.page,
						rp_state:this.tabId,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.redpacket_list.forEach(item => {
									this.log_list.push(item);
								});
							} else {
								this.log_list = res.data.datas.redpacket_list;
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
