<template>
	<view>
		<view class="invite-m-menu flex flexrow">
			<view class="li" :class="{'ok':state=='1'}" @click="Gostate('1')">一级成员</view>
			<view class="li" :class="{'ok':state=='2'}" @click="Gostate('2')">二级成员</view>
			<view class="li" :class="{'ok':state=='3'}" @click="Gostate('3')">三级成员</view>
		</view>
		<view class="invite-m-list">
			<view class="star-s flex flexrow">
				<view class="s1 flex">ID</view>
				<view class="s2 flex">会员名称</view>
				<view class="s3 flex">订单</view>
				<view class="s4 flex">返利</view>
			</view>
			<view class="li flex flexrow" v-for="(item,index) in list" :key="index">
				<view class="s1 flex flexJcc">{{item.member_id}}</view>
				<view class="s2 flex flexJcc">{{item.member_name}}</view>
				<navigator :url="'/pages/invite/memberOrder?buyerID='+item.member_id" class="s3 flex flexJcc">查看</navigator>
				<navigator :url="'/pages/invite/memberOrderBill?buyerID='+item.member_id" class="s4 flex flexJcc">查看</navigator>
			</view>
			<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
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
				state:'1',
				list:[],
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
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=member_invite&wwi=new_member',
					data: {key: this.key,page: 10,curpage: this.curpage,state:this.state},
					method:"POST",
					success: res => {
						if(res.data.datas.error){
								uni.showToast({
									title: res.data.datas.error,icon:"none"
								});
								return false;
							}
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.list.forEach(item => {
									this.list.push(item);
								});
								this.loadingType = 0;
							} else {
								this.list = res.data.datas.list;
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
			Gostate(e){
				if(e==this.state){
					return false;
				}
				this.state = e;
				this.hasmore = true;
				this.curpage = 1;
				this.loadingType = 0;
				this.Inlimine();
			}
			
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.loadingType = 0;
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadingType = 2;
			}
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0)
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0)
			}
			// #ifdef H5
			document.title = '我的组员-'+this.siteTitle;
			// #endif
			
		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.billList = [],
				this.key = '',
				this.loadingType = 3;
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
.invite-m-menu{background: #FFFFFF; height: 80upx;}
.invite-m-menu .li{flex: 1; font-size: 28upx; display: flex; justify-content: center; align-items: center; position: relative;}
.invite-m-menu .li:after{content: ''; height: 4upx; background: #efefef; position: absolute; bottom: 0; width: 100%;}
.invite-m-menu .li.ok{color: #00bcd4;}
.invite-m-menu .li.ok:after{background: #00bcd4;}
.invite-m-list{background: #FFFFFF; margin-top: 20upx;}
.invite-m-list .star-s{height: 80upx; font-size: 24upx; display: flex; align-items: center;}
.invite-m-list .star-s .s1{width: 150upx; justify-content: center;}
.invite-m-list .star-s .s2{flex: 1; justify-content: center;}
.invite-m-list .star-s .s3{width:100upx ; justify-content: center;}
.invite-m-list .star-s .s4{width:200upx ; justify-content: center;}
.invite-m-list .li{height: 80upx; font-size: 24upx; display: flex; align-items: center;}
.invite-m-list .li:nth-child(even){background: #f6fcfd;}
.invite-m-list .li .s1{width: 150upx;}
.invite-m-list .li .s2{flex: 1;}
.invite-m-list .li .s3{width:100upx ;}
.invite-m-list .li .s4{width:200upx ; color: #FF0036; font-weight: bold;}
</style>
