<template>
	<view>
		<uni-notice-bar show-close="true"  single="true" backgroundColor="#FCF8E3" color="#C09853" text="[提示]长按列表可将该列删除哦!"></uni-notice-bar>
		<view class="wwiapp-message-list">
               <view v-if="chatList.length<1" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-wangwang"></view>
						<view class="dl">
							<view class="dt">您还没有相关的聊天记录</view>
						</view>
					</view>
				</view>
					<view class="li" v-for="(item,index) in chatList" :key="index" @longpress="bindClick(item,index)">
						<navigator :url="'/pages/seller/chatinfo?tid='+item.u_id" class="avater"><image :src="item.avatar" mode=""></image>
						<view class="sup" v-if="item.r_state == 2"></view></navigator>
						<navigator :url="'/pages/seller/chatinfo?tid='+item.u_id" class="info">
							<view class="dt">{{item.u_name}} <view class="time">{{item.time}}</view></view>
							<view class="dd">{{item.t_msg}}</view>
						</navigator>
					</view>
		</view>
	</view>
</template>

<script>
	import uniNoticeBar from '@/components/uni-notice-bar.vue'
	export default {
		components: {
			uniNoticeBar
		},
		data() {
			return {
				key:'',
				chatList:[],
				options: [{
					text: '删除',
					style: { backgroundColor: '#03a9f4'}
				}]
				
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: '/index.php?app=seller_chat&wwi=get_user_list',
					method: 'POST',
					data: {key:this.key},
					success: res => {
						this.checksellerLogin(res.data.login);
						this.chatList = res.data.datas.list;
					}
				});
			},
			bindClick:function(item,index){
				
				uni.showActionSheet({
					itemList: ['删除'],
					success: rest => {
						var _this = this;
				this.wwiopt({
					url: '/index.php?app=seller_chat&wwi=del_msg',
					method: 'POST',
					data: {key:_this.key,t_id:item.u_id},
					success: res => {
						if(res.data.code==200){
							this.Inlimine();
						}else{
							uni.showToast({
								title:res.data.datas.error,icon:"none"
							});
							return false;
						}
					}
				});
				}
				});
			}
		},
		onLoad:function(){
			this.key = uni.getStorageSync('seller_key');
		},
		onShow:function(){
			this.key = uni.getStorageSync('seller_key');
			this.Inlimine();
		}
	}
</script>

<style>
.wwiapp-message-list{}
.wwiapp-message-list .li{padding: 20upx; background: #FFFFFF; display: flex; flex-direction: row; position: relative; height:100upx;}
.wwiapp-message-list .li:after{height: 1px; background: #F8F8F8; content: ""; position: absolute; left: 20upx; right: 0; bottom: 0;}
.wwiapp-message-list .li .avater{width: 100upx; height: 100upx;  position: relative;}
.wwiapp-message-list .li .avater image{width: 100upx; height: 100upx; border-radius:50% ;}
.wwiapp-message-list .li .avater .sup{width: 20upx; height: 20upx; border-radius:50%; background: #FF0036; position: absolute; top:0; right: 0;}
.wwiapp-message-list .li .info{flex: 1; margin-left: 20upx;}
.wwiapp-message-list .li .info .dt{font-size: 34upx; display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
.wwiapp-message-list .li .info .time{font-size: 24upx; color: #BBBBBB;}
.wwiapp-message-list .li .info .dd{    height: 44upx;font-size: 28upx;color: #666;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.wwiapp-message-list .li .wwi-icon{display: flex; align-items: center; width: 60upx; justify-content: center; color: #BBBBBB;}
</style>
