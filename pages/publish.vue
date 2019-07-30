<template>
	<view class="">
		<view class="wwi-icon-list flex flexrow">
			<navigator url="/pages/web/glist" class="li">
				<view class="wwi-icon s1">
					<image src="https://static.qianmeng1688.com/app/index-ico1.png" mode="widthFix"></image>
				</view>
				<view class="span">找产品</view>
			</navigator>
			<navigator url="/pages/web/searchstore" class="li">
				<view class="wwi-icon s2">
					<image src="https://static.qianmeng1688.com/app/index-ico2.png" mode="widthFix"></image>
				</view>
				<view class="span">找设计</view>
			</navigator>
			<navigator class="li" url="/pages/web/activity">
				<view class="wwi-icon s3">
					<image src="https://static.qianmeng1688.com/app/index-ico3.png" mode="widthFix"></image>
				</view>
				<view class="span">找施工</view>
			</navigator>
			<navigator class="li" url="/pages/web/tzx">
				<view class="wwi-icon s4">
					<image src="https://static.qianmeng1688.com/app/index-ico4.png" mode="widthFix"></image>
				</view>
				<view class="span">找维保</view>
			</navigator>
			<navigator class="li" url="/pages/web/spikelist">
				<view class="wwi-icon s5">
					<image src="https://static.qianmeng1688.com/app/index-ico5.png" mode="widthFix"></image>
				</view>
				<view class="span">风水师</view>
			</navigator>
		</view>
	<view class="wwi-publish-fbxq">
		<view class="h3 flex flexAic flexJcc">免费发布需求</view>
		<view class="title">千盟大数据算法推荐优质服务商</view>
		<view class="span flex flexrow flexJcc"><view class="num">{{baseData.sum}}</view>人已找到满意的服务商</view>
		<form @submit="fabuSubmit">
			<view class="section"><input name="title" type="text" placeholder="我需要" /></view>
			<view class="section mt10"><input name="mobile" type="number" maxlength="11" placeholder="手机号" /></view>
			<button formType="submit" class="submit">马上为我推荐</button>
		</form>
	</view>
	<view class="wwi-publish-re">
		<view class="title">精选商家</view>
		<view class="list flex flexrow flexwrap">
			<navigator :url="'/pages/web/jstore?storeId='+item.store_id" class="li" v-for="(item,v) in baseData.tuijian_list" :key="v">
				<view class="img">
						<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="picSwipe">
							<swiper-item class="imgs" v-for="(pic,vvv) in item.store_images" :key="vvv">
								<image :src="pic"></image>
							</swiper-item>
						</swiper>
				</view>
				<view class="store-name flex flexrow"><image :src="item.mer_logo" mode=""></image><view class="">{{item.mer_name}}</view></view>
			</navigator>
		</view>
	</view>
	
	</view>
</template>

<script>
		export default {
		data() {
			return {
				baseData:[],
				key:''
			}
		},
		methods: {
				fabuSubmit: function(e) {
					if (!this.key) {
						uni.showModal({
							title: '提示',
							content: '请登入后重试',
							showCancel: false,
							success: res => {
								uni.navigateTo({
									url: '/pages/web/login'
								});
							}
						});
						return;
					}
					if (e.detail.value.title.length < 5) {
						uni.showModal({
							title: '提示',
							content: '请输入您的需求不低于5个字符',
							showCancel: false
						});
						return false;
					}
					if (e.detail.value.phone.length != 11) {
						uni.showModal({
							title: '提示',
							content: '请输入正确的手机号',
							showCancel: false
						});
						return false;
					}
					var newDat = {};
					newDat = e.detail.value;
					newDat.key = this.key;
					this.wwiopt({
						url: "/index.php?app=publish&wwi=fabu",
						data: newDat,
						method: 'POST',
						success: res => {
							if (res.data.datas.error) {
								uni.showModal({
									title: '提示',
									content: res.data.datas.error,
									showCancel: false,
								});
								return false;
							}
							uni.showModal({
								title: '提示',
								content: '发布成功',
								showCancel: false,
							});
						}
				
					})
	            },
				inlimine:function(){
					this.wwiopt({
						url: '/index.php?app=service&wwi=send_demand',
						success: res => {
							this.baseData = res.data.datas;
						}
					});
				}
	},
	onLoad:function(){
		this.key = uni.getStorageSync('key');
		this.inlimine()
	}
	}
</script>

<style>
page{background-color: #F8F8F8;height: auto; min-height: 100%;width: 750upx; margin: 0 auto;}
.wwi-icon-list{  padding:40upx 20upx 20upx ; flex-wrap: wrap; position: relative; z-index: 1;}
.wwi-icon-list .li{ width: 142upx; display: flex; justify-content: center; flex-direction: column; align-items: center; margin-bottom: 20upx; }
.wwi-icon-list .li .wwi-icon{width: 60upx; height: 60upx; padding: 20upx;display: flex; justify-content: center; align-items: center;background-position: 50%; border-radius:60upx; position: relative; z-index: 1;}
.wwi-icon-list .li .span{font-size: 26upx; margin-top: 10upx;}
.wwi-icon-list .li .s1{background: #d6edeb;}
.wwi-icon-list .li .s2{background: #abc6b5;}
.wwi-icon-list .li .s3{background: #e7d4e5;}
.wwi-icon-list .li .s4{background: #ead7d3;}
.wwi-icon-list .li .s5{background: #e5e5e5;}
.wwi-publish-fbxq{background: #FFFFFF; margin: 20upx; padding: 30upx;border-radius:15upx ;box-shadow: 0px 0px 20upx 0px #82d8b0;}
.wwi-publish-fbxq .h3{font-size: 38upx; color: #2cb476; font-weight: bold;}
.wwi-publish-fbxq .title{display: flex; flex-direction: row; justify-content: center; align-items: center; font-size: 32upx; height: 80upx; color: #333; font-weight: bold;}
.wwi-publish-fbxq .title:before{content: ''; width: 50upx; height: 2upx; background: #333; margin-right: 0.25em;}
.wwi-publish-fbxq .title:after{content: ''; width: 50upx; height: 2upx; background: #333; margin-left: 0.25em;}
.wwi-publish-fbxq .span{line-height: 60upx;}
.wwi-publish-fbxq .span .num{color: #2CB476; font-weight: bold ;}
.wwi-publish-fbxq .section input{background: #F8F8F8; padding:10upx 20upx;}
.wwi-publish-fbxq .submit{background: #2cb476; color: #FFFFFF; font-weight:bold ;}
.wwi-publish-re{margin: 20upx;}
.wwi-publish-re .title{font-size: 32upx; line-height: 100upx; font-weight: bold;}
.wwi-publish-re .list{}
.wwi-publish-re .list .li{width: 345upx; margin-bottom: 20upx;}
.wwi-publish-re .list .li:nth-child(even){margin-left: 20upx;}
.wwi-publish-re .list .li .img{width: 345upx; height: 240upx; border-radius: 15upx;}
.wwi-publish-re .list .li .img .picSwipe{border-radius: 15upx; overflow: hidden;height: 240upx;}
.wwi-publish-re .list .li .img .imgs image{ vertical-align: middle; height: 240upx;}
.wwi-publish-re .list .li .store-name{font-size: 28upx; font-weight: bold; margin: 15upx 0;}
.wwi-publish-re .list .li .store-name image{width: 50upx; height: 50upx; border-radius: 50upx; margin-right: 15upx;}
</style>
