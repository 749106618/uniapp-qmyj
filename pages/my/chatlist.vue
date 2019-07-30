<template>
	<view>
		<uni-notice-bar show-close="true"  single="true" backgroundColor="#FCF8E3" color="#C09853" text="[提示]长按列表可将该列删除哦!"></uni-notice-bar>
		<view class="wwiapp-message-list">
					<view class="li">
						<view class="avater wwi-icon wwi-icon-zaojiayusuan s1"></view>
						<view class="info">
							<view class="dt">造价预算咨询</view>
							<view class="dd">最专业的项目预算评估</view>
						</view>
					</view>
					<view class="li">
						<view class="avater wwi-icon wwi-icon-jishuzixun s2"></view>
						<view class="info">
							<view class="dt">施工技术咨询</view>
							<view class="dd">你的问题，专家来帮你解决</view>
						</view>
					</view>
					<view class="li">
						<view class="avater wwi-icon wwi-icon-gongjiagusuan s3"></view>
						<view class="info">
							<view class="dt">施工工价估算</view>
							<view class="dd">工人成本，不再是一头雾水</view>
						</view>
					</view>
					<view class="li">
						<view class="avater wwi-icon wwi-icon-paishefuwu s4"></view>
						<view class="info">
							<view class="dt">720案例拍摄服务</view>
							<view class="dd">全方位展示你的艺术之美</view>
						</view>
					</view>
					<view class="li">
						<view class="avater wwi-icon wwi-icon-xuqiubangzhu s5"></view>
						<view class="info">
							<view class="dt">需求助手</view>
							<view class="dd">及时通知您最新的求购服务</view>
						</view>
					</view>
					<view class="li" v-for="(item,index) in chatList" :key="index" @longpress="bindClick(item,index)">
						<navigator :url="'/pages/my/chatinfo?tid='+item.u_id" class="avater"><image :src="item.avatar" mode=""></image>
						<view class="sup" v-if="item.r_state == 2"></view></navigator>
						<navigator :url="'/pages/my/chatinfo?tid='+item.u_id" class="info">
							<view class="dt">{{item.u_name}}<view class="time">{{item.time}}</view></view>
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
					url: '/index.php?app=member_chat&wwi=get_user_list',
					method: 'POST',
					data: {key:this.key},
					success: res => {
						this.checkLogin(res.data.login);
						this.chatList = res.data.datas.list;
					}
				});
			},
			bindClick:function(item,index){
				
				uni.showActionSheet({
					itemList: ['删除'],
					success: rest => {
				this.wwiopt({
					url: '/index.php?app=member_chat&wwi=del_msg',
					method: 'POST',
					data: {key:this.key,t_id:item.u_id},
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
			this.key = uni.getStorageSync('key');
			this.Inlimine();
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
			this.Inlimine();
		}
	}
</script>

<style>
.wwiapp-message-list{}
.wwiapp-message-list .li{padding: 20upx; background: #FFFFFF; display: flex; flex-direction: row; position: relative; height: 100upx;}
.wwiapp-message-list .li:after{height: 1px; background: #F8F8F8; content: ""; position: absolute; left: 20upx; right: 0; bottom: 0;}
.wwiapp-message-list .li .avater.wwi-icon{background: #ff1612; color: #fff; width: 100upx; height: 100upx; border-radius: 100upx;}
.wwiapp-message-list .li .avater.s1{background: #ff7135;}
.wwiapp-message-list .li .avater.s2{background: #5f8ae8;}
.wwiapp-message-list .li .avater.s3{background: #79dd18;}
.wwiapp-message-list .li .avater.s4{background: #ffa809;}
.wwiapp-message-list .li .avater{width: 100upx; height: 100upx;  position: relative;}
.wwiapp-message-list .li .avater image{width: 100upx; height: 100upx; border-radius:50% ;}
.wwiapp-message-list .li .avater .sup{width: 20upx; height: 20upx; border-radius:50%; background: #FF0036; position: absolute; top:0; right: 0;}
.wwiapp-message-list .li .info{flex: 1; margin-left: 20upx;}
.wwiapp-message-list .li .info .dt{font-size: 34upx; display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
.wwiapp-message-list .li .info .time{font-size: 24upx; color: #BBBBBB;}
.wwiapp-message-list .li .info .dd{    height: 44upx;font-size: 28upx;color: #666;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.wwiapp-message-list .li .wwi-icon{display: flex; align-items: center; width: 60upx; justify-content: center; color: #BBBBBB;}
</style>