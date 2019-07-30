<template>
	<view>
		<view class="wwiapp-asset-info pre">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">我的余额</view>
				<view class="dd"><view class="em">{{my.predepoit}}</view></view>
			</view>
			
	</view><view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-icon">
			<navigator class="icon-li" url="/pages/my/pdadd"><view class="wwi-icon wwi-icon-cunkuan color-red"></view><text>充值</text></navigator>
			<navigator class="icon-li" url="/pages/my/pdout"><view class="wwi-icon wwi-icon-zijinxunhuan color-ql"></view><text>提现</text></navigator>
		</view>
		<view class="wwi-default-list mt10">
			<view class="li border">
				<navigator url="/pages/my/pdlist" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-zhangdan"></view>账单记录</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/pdrlist" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-zhangdan_xinzeng"></view>充值记录</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/pdcashlist" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>提现记录</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/rechargecardlist" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-yinhangqia"></view>充值卡余额</view>
					<view class="right">{{my.available_rc_balance}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<view class="li border">
				<navigator url="/pages/my/points" class="a">
					<view class="h4"><view class="wwi-icon wwi-icon-qiandao"></view>会员积分</view>
					<view class="right">{{my.point}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				my:[],
				showPageTop:false
			};
		},
		methods: {
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			},
			getMemberPoints(){
				this.wwiopt({
					url: '/index.php?app=member_index&wwi=my_asset',
					data: {key:this.key},
					success: res => {
						this.my=res.data.datas;
						uni.stopPullDownRefresh();
					}
				});
			}
			
		},
		onPullDownRefresh() {
			this.getMemberPoints();
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.getMemberPoints();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		},
		onUnload: function() {
				this.key = ''
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
page {	background: #F8F8F8;}
</style>
