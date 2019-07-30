<template>
	<view>
		<view class="tradinfo-hd">
			<view class="tradinfo-info">
				<view class="hd flex flexJcs">
					<view class="flex flexrow">
						<image :src="baseData.publish_info.member_avatar" class="user-logo" mode=""></image>
						<view class="user-name">{{baseData.publish_info.member_name}}</view>
					</view>
					<navigator :url="'/pages/my/chatinfo?tid='+ baseData.publish_info.member_id" class="msg flex flexrow flexAic flexJcc">
						<view class="wwi-icon wwi-icon-xiaoxi2"></view>
						<view class="">在线沟通</view>
					</navigator>
					
				</view>
				<view class="bd">
					<view class="title">{{baseData.publish_info.publish_name}}</view>
					<view class="tips flex flexrow"><view class="project-state"><view class="wwi-icon" :class="'wwi-icon-gongchengjindu-'+baseData.publish_info.status_rate"></view>{{baseData.publish_info.status}}</view>
					<view class="span flex flexrow"><view class="num">{{baseData.publish_info.count}}</view>人参与</view>
					<view class="span flex flexrow" v-if="baseData.publish_info.day > 0"><view class="num">{{baseData.publish_info.day}}</view>天后截止 </view>
					<view class="span flex flexrow" v-else>已截止 </view>
					</view>
					<view class="info">{{baseData.publish_info.context}}</view>
					<view class="enclosure">
						<view class="title">附件：</view>
						<view class="list flex flexrow">
							<view class="pic"></view>
							<view class="word"></view>
						</view>
					</view>
				</view>
			</view>
			<navigator url="/pages/web/" class="publish flex flexAic flexJcc">立即参与</navigator>
		</view>
		<view class="tradinfo-bd">
			<view class="tab flex flexrow" >
				<view class="span ok">参与该需求的服务商({{baseData.publish_info.count}})</view>
				<view class="span">留言({{baseData.publish_info.messagecount}})</view>
			</view>
			<view class="list" v-if="baseData.mytblist">
				<view class="li flex flexrow flexAic flexJcc " v-for="(item,v) in baseData.mytblist" :key="v">
					<image :src="item.store_avatar" mode="" class="img"></image>
					<view class="s-info">
						<view class="s-title">{{item.store_name}}</view>
						<view class="s-rate flex flexrow flexAic">
							<view class="span">{{item.store_type}}</view>案例 {{item.picture_num}} | 商品 {{item.goods_count}} 
						</view>
					</view>
					<navigator :url="'/pages/web/jstore?storeId='+ item.store_id" class="flex flexAic flexJcc msg">进店咨询</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseData:{
					publish_info:[],
					mytblist:[]
				},
				trad_id:''
			}
		},
		methods: {
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=service&wwi=tradesdemandinfo',
					data:{publish_id:this.trad_id},
					success: res => {
						this.baseData = res.data.datas;
					},
				});
			}
		},
		onLoad:function(e){
			if(e.trad_id){
				this.trad_id = e.trad_id;
			}
			this.Inlimine();
		},
		onPullDownRefresh:function(){
			this.Inlimine();
		}
	}
</script>

<style>
	page{background: #fff;}
.tradinfo-hd{background: #61cf9c; padding: 20upx;}
.tradinfo-hd .publish{font-size: 28upx; height: 80upx; font-weight: bold; color: #fff;}
.tradinfo-hd .tradinfo-info{background: #fff; padding: 20upx; border-radius: 20upx;}
.tradinfo-hd .tradinfo-info .hd{padding-bottom: 20upx; border-bottom: 1px solid #61cf9c;}
.tradinfo-hd .tradinfo-info .hd .user-logo{width: 50upx; height: 50upx; border-radius: 50upx;}
.tradinfo-hd .tradinfo-info .hd .user-name{font-size: 28upx; line-height: 50upx; margin-left: 20upx; color: #666;}
.tradinfo-hd .tradinfo-info .hd .msg{border: 1px solid #61cf9c; font-size: 26upx; color: #61cf9c; padding: 5upx 15upx; border-radius: 15upx;}
.tradinfo-hd .tradinfo-info .hd .msg .wwi-icon{}
.tradinfo-hd .tradinfo-info .bd{padding: 20upx 0;}
.tradinfo-hd .tradinfo-info .bd .title{font-size: 32upx;line-height: 38upx;max-height: 76upx;overflow: hidden;-o-text-overflow: ellipsis;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal; font-weight: bold;}
.tradinfo-hd .tradinfo-info .bd .tips{padding: 20upx 0;}
.tradinfo-hd .tradinfo-info .bd .tips .project-state{font-size: 24upx; font-weight: bold;  margin-bottom: 10upx; padding: 0 10upx; color: #fff; background: #2cb476; height: 50upx; display: flex; justify-content: center; align-items: center; border-radius: 25upx;}
.tradinfo-hd .tradinfo-info .bd .tips .project-state .wwi-icon{color: #fff; font-size: 34upx; margin-right: 10upx;}
.tradinfo-hd .tradinfo-info .bd .tips .span{margin-left: 20upx; color: #a6a6a6;}
.tradinfo-hd .tradinfo-info .bd .tips .span .num{font-weight: bold; color: #2CB476;}
.tradinfo-hd .tradinfo-info .bd .info{color: #666;}
.tradinfo-hd .tradinfo-info .bd .enclosure{padding-top: 20upx;}
.tradinfo-hd .tradinfo-info .bd .enclosure .title{font-size: 28upx;}
.tradinfo-bd{padding:20upx 40upx;}
.tradinfo-bd .tab{font-size: 28upx; height: 100upx; border-bottom: 1px solid #F8F8F8; font-weight: bold;}
.tradinfo-bd .tab .span{flex: 1; display: flex; align-items: center; justify-content: center; border-bottom: 4upx solid transparent;}
.tradinfo-bd .tab .span.ok{border-color: #2CB476; color: #2CB476;}
.tradinfo-bd .list .li{padding: 20upx 0;  border-bottom: 1px solid #F8F8F8; }
.tradinfo-bd .list .li .img{width: 80upx; height: 80upx; border-radius: 80upx;}
.tradinfo-bd .list .li .s-info{flex: 1; margin:0 15upx;}
.tradinfo-bd .list .li .s-info .s-title{font-size: 32upx; font-weight: bold;}
.tradinfo-bd .list .li .s-info .s-rate{font-size: 24upx; color: #666; margin-top: 10upx;}
.tradinfo-bd .list .li .s-info .s-rate .span{color: #2CB476; font-weight: bold; font-size:28upx ; margin-right: 15upx;}
.tradinfo-bd .list .li .msg{border: 1px solid #2CB476; padding: 5upx 10upx; height: 40upx; font-weight: bold; color: #2CB476; border-radius: 10upx; font-size: 24upx;}
</style>
