<template>
	<view>
		<view class="wwiapp-asset-info mt10">
<view class="box-ling">1</view>
		</view>
		<view class="wwiapp-log-icon">
			<navigator class="icon-li" url="/pages/my/voucherlist"><view class="wwi-icon wwi-icon-qiaquan color-cs"></view><text>我的代金券</text>
			<view class="span">{{my.voucher}}<view class="em">张</view></view>
			</navigator>
			<navigator class="icon-li" url="/pages/my/redpacketlist"><view class="wwi-icon wwi-icon-hongbao color-zs"></view><text>我的红包</text><view class="span">{{my.redpacket}}<view class="em">个</view></view></navigator>
		</view>
		
		<view class="wwi-default-list mt10">
			<view class="li">
				<navigator url="/pages/my/voucherchain" class="a">
					<view class="h4">门店代金券</view>
					<view class="right">
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			</view>
			<view class="clear mt10"></view>
		<view class="voucher-list">
			<view class="wwi-tab">
				<view class="tab-li" :class="{'wwi-this':tabId=='1'}" @click="newList('1')">优惠券</view>
				<view class="tab-li" :class="{'wwi-this':tabId=='2'}"  @click="newList('2')">红包</view>
				</view>
			<view v-if="!log_list.length" class="no-data">未查询到红包数据</view>
			<navigator :url="'/pages/my/redpacketinfo?rpt_id='+item.rpacket_id" class="li" :class="{'ysy':item.rpacket_state>'1'}" v-for="(item,index) in log_list" :key="index" v-if="tabId==2">
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
			<navigator  :url="'/pages/my/voucherinfo?vid='+item.voucher_id" class="li" :class="{'ysy':item.voucher_state>'1'}" v-for="(item,v) in log_list" :key="v" v-if="tabId==1">
				<view class="tikect-info">
					<image :src="item.voucher_t_customimg" class="img"></image>
					<view class="dl">
						<view class="dt">
							<view class="em">￥</view>
							<view class="strong">{{item.voucher_price}}</view><view class="span" v-if="item.voucher_limit">满{{item.voucher_limit}}可用</view>
							<view class="span" v-else>不限制金额可用</view>
							</view>
						<view class="dd">{{item.voucher_usetype_text}}</view>
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
				tabId:'1',
				my:[]
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadMore = '没有更多数据了！';
					return;
				}
				if(this.tabId=='2'){
					var tourl='/index.php?app=member_redpacket&wwi=redpacket_list';
					var datas={key: this.key,page: this.page,curpage: this.curpage,rp_state:'unused'}
				}else{
					var tourl='/index.php?app=member_voucher&wwi=voucher_list';
					var datas={key: this.key,page: this.page,curpage: this.curpage,voucher_state:1}
				}
				this.wwiopt({
					url: tourl,
					method: 'POST',
					data: datas,
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								if(this.tabId=='2'){
								res.data.datas.redpacket_list.forEach(item => {
									this.log_list.push(item);
								});
								}else{
								res.data.datas.voucher_list.forEach(item => {
									this.log_list.push(item);
								});
								}
							} else {
								if(this.tabId=='2'){
								this.log_list = res.data.datas.redpacket_list;
								}else{
								this.log_list = res.data.datas.voucher_list;
								}
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
			getMember(){
				this.wwiopt({
					url: '/index.php?app=member_index&wwi=my_asset',
					data: {key:this.key,fields:'redpacket,voucher'},
					success: res => {
						this.my=res.data.datas;
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
			this.getMember();
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
			this.getMember();
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
