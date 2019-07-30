<template>
	<view class="newBody maxBody">
		<view class="wwiapp-store-info flex flexrow">
			<view class="store-avatar">
				<image :src="info.store_avatar"></image>
			</view>
			<view class="store-base">
				<view class="title">{{info.store_name}}</view>
				<view class="class">类型：{{info.sc_name}}</view>
				<view class="type"><block v-if="info.is_own_mall">平台自营</block> <block v-else>普通店铺</block></view>
			</view>
			<view class="store-collect">
				<view class="btn" :class="{'ok':info.is_favorate}" @click="favStore(info)"><block v-if="info.is_favorate">已收藏</block> <block v-else>收藏</block></view>
				<view class="span">{{info.store_collect}}人收藏</view>
			</view>
		</view>
		<view class="wwiapp-store-block" v-if="!info.is_own_mall">
			<view class="credit">
				<view class="li flex flexrow" :class="info.store_credit.store_desccredit.percent_class">
					<view class="h4">描述相符</view>
					<view class="span flex flexrow">
						<view class="strong">{{info.store_credit.store_desccredit.credit}}</view>
						<block v-if="info.store_credit.store_desccredit.percent_class == 'equal'">与同行业持平</block>
						<block v-else>{{info.store_credit.store_desccredit.percent_text}}同行业</block>
						<view class="em">{{info.store_credit.store_desccredit.percent}}</view>
					</view>
				</view>
				<view class="li flex flexrow" :class="info.store_credit.store_servicecredit.percent_class">
					<view class="h4">服务态度</view>
					<view class="span flex flexrow">
						<view class="strong">{{info.store_credit.store_servicecredit.credit}}</view>
						<block v-if="info.store_credit.store_servicecredit.percent_class == 'equal'">与同行业持平</block>
						<block v-else>{{info.store_credit.store_servicecredit.percent_text}}同行业</block>
						<view class="em">{{info.store_credit.store_servicecredit.percent}}</view>
					</view>
				</view>
				<view class="li flex flexrow" :class="info.store_credit.store_deliverycredit.percent_class">
					<view class="h4">物流服务</view>
					<view class="span flex flexrow">
						<view class="strong">{{info.store_credit.store_deliverycredit.credit}}</view>
						<block v-if="info.store_credit.store_deliverycredit.percent_class == 'equal'">与同行业持平</block>
						<block v-else>{{info.store_credit.store_deliverycredit.percent_text}}同行业</block>
						<view class="em">{{info.store_credit.store_deliverycredit.percent}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wwiapp-store-block">
			<view class="ul">
				<view class="li" v-if="info.store_company_name">
					<view class="h4">公司名称</view>
					<view class="span">{{info.store_company_name}}</view>
				</view>
				<view class="li" v-if="info.area_info">
					<view class="h4">所在地</view>
					<view class="span">{{info.area_info}}</view>
				</view>
				<view class="li" v-if="info.store_time_text">
					<view class="h4">开店时间</view>
					<view class="span">{{info.store_time_text}}</view>
				</view>
				<view class="li" v-if="info.store_zy">
					<view class="h4">主营商品</view>
					<view class="span">{{info.store_zy}}</view>
				</view>
			</view>
		</view>
		<view class="wwiapp-store-block">
			<view class="ul">
				<view class="li" v-if="info.store_phone">
					<view class="h4">联系电话</view>
					<view class="span">{{info.store_phone}}</view>
				</view>
				<view class="li" v-if="info.store_workingtime">
					<view class="h4">工作时间</view>
					<view class="span">{{info.store_workingtime}}</view>
				</view>
				<view class="li" v-if="info.store_qq">
					<view class="h4">联系方式</view>
					<view class="span">{{info.store_qq}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info:{
					store_credit:{
						store_deliverycredit:[],
						store_servicecredit:[],
						store_desccredit:[]
					}
				},
				storeId:'',
				key:''
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: "/index.php?app=store&wwi=store_intro",
					method: 'POST',
					data: {key: this.key, store_id: this.storeId},
					success: res => {
						this.info = res.data.datas.store_info;
						uni.setNavigationBarTitle({
							title:res.data.datas.store_info.store_name
						})
					}
				});
				},
			favStore:function(e){
				if(!this.key){
					uni.showModal({
						title: '提示',
						content: '请登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '登入',
						success: res => {
							if(res.confirm){
								uni.redirectTo({
									url:'/pages/web/login'
								})
							}
						}
					});
					return false;
				}
				if(e.is_favorate){
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites_store&wwi=favorites_del',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,store_id:e.store_id},
						success: res => {
							if (res.data.code == 200) {
								    e.is_favorate=false;
									e.store_collect-=1;
								}else{
									uni.showToast({
										title: res.data.datas.error,icon:"none"
									});
								}
						}
					});
				}else{
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_favorites_store&wwi=favorites_add',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,store_id:e.store_id},
						success: res => {
							if (res.data.code == 200) {
								e.store_collect+=1;
								    e.is_favorate=true;
								}else{
									uni.showToast({
										title: res.data.datas.error,icon:"none"
									});
								}
						}
					});
				}
			}
		},
		onLoad:function(e){
			if(e.id){
				this.storeId = e.id
			}else{
				uni.showToast({
					title: '参数错误',icon:"none",
					success() {
						setTimeout(function() {
							var page = getCurrentPages();
							if(page.length > 1){
							  uni.navigateBack();
							}else{
							  uni.switchTab({  url:'/pages/index' });
							}
						}, 1000);
					}
				});
			}
			this.key = uni.getStorageSync('key');
			this.Inlimine();
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
		}
	}
</script>

<style>
	page{background: #F8F8F8;}
.wwiapp-store-info{padding: 20upx; background: #FFFFFF;}
.wwiapp-store-info .store-avatar{width: 150upx; height: 150upx; border: 1px solid #ddd; padding: 10upx; border-radius:20upx ;}
.wwiapp-store-info .store-avatar image{width:150upx; height: 150upx;}
.wwiapp-store-info .store-base{flex: 1; margin-left: 20upx;}
.wwiapp-store-info .store-base .title{font-size: 34upx; margin-bottom: 10upx;}
.wwiapp-store-info .store-base .class{font-size: 26upx;}
.wwiapp-store-info .store-base .type{height: 40upx;padding: 0 8upx;font-size: 24upx;line-height: 40upx;background-color: #ED5564;color: #FFF;border-radius: 6upx; display: initial;}
.wwiapp-store-info .store-collect{}
.wwiapp-store-info .store-collect .btn{background: #FF0036; color: #FFFFFF; font-size: 28upx; display: initial; padding: 5upx 18upx; border-radius:24upx ;}
.wwiapp-store-info .store-collect .btn.ok{background: #DDDDDD;}
.wwiapp-store-info .store-collect .span{font-size: 24upx;}
.wwiapp-store-block{background-color: #FFF;border-bottom: solid 1px #EEE;border-top: solid 1px #EEE;margin-top: 20upx;}
.wwiapp-store-block .credit,.wwiapp-store-block .ul{padding: 10upx 0 10upx 20upx;}
.wwiapp-store-block .credit .li{min-height: 40upx;padding: 10upx 0;line-height:40upx;white-space: nowrap;}
.wwiapp-store-block .ul .li{min-height: 40upx;padding: 20upx 0;line-height: 40upx;white-space: nowrap; display: flex; flex-direction: row;}
.wwiapp-store-block .credit .li .h4,.wwiapp-store-block .ul .li .h4{font-size: 28upx; color: #777; width: 130upx;}
.wwiapp-store-block .credit .li .span{font-size: 28upx; margin-left: 28upx; flex: 1; color: #FF0036;}
.wwiapp-store-block .ul .li .span{font-size: 28upx; margin-left: 28upx; flex: 1;}
.wwiapp-store-block .credit .li .span.low { color: #48CFAE;}
.wwiapp-store-block .credit .li .span .strong{margin-right: 30upx;}
.wwiapp-store-block .credit .li .span .em{margin-left: 30upx;}
</style>
