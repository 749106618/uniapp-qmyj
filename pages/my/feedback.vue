<template>
	<view class="content">
        <view class='feedback-title'>
            <text>问题和意见</text>
            <text class="feedback-quick" @tap="chooseMsg">快速键入</text>
        </view>
        <view class="feedback-body">
            <textarea placeholder="请详细描述你的问题和意见..." v-model="content" class="feedback-textare" />
        </view>
		<view class="btn-row">
		<button type="primary" class="wwibtn" @tap="send">提交</button></view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				msgContents: ["界面显示错乱", "启动缓慢，卡出翔了", "UI无法直视，丑哭了", "偶发性崩溃"],
				content:'',
				key:''
			}
		},
		methods:{
            chooseMsg() { //快速输入
                uni.showActionSheet({
                    itemList: this.msgContents,
                    success: (res) => {
                        this.content = this.msgContents[res.tapIndex];
                    }
                })
            },
            send() { //发送反馈
					if (this.content.length < 5) {
						uni.showToast({
							icon: 'none',
							title: '反馈内容不得低于5个字符'
						});
						return;
					}
			//#ifdef MP-WEIXIN
			var client='wechat';
			//#endif
			//#ifdef APP-PLUS
			var client=uni.getSystemInfoSync().platform;
			//#endif
					this.wwiopt({
						url: "/index.php?app=member_feedback&wwi=feedback_add",
						method: 'POST',
						data: {key:this.key,feedback:this.content+client},
						success: res => {
							if(!res.data.datas.error){
								uni.showToast({title: '提交成功',icon:'none'});
								setTimeout(function(){   uni.navigateBack();  }, 3000);
							}else{
								uni.showToast({title: res.data.datas.error,icon:'none'});
							}
						}
					});

            }
			
		},
		onShow:function(){
				this.key = uni.getStorageSync('key');
				if (!this.key) {
					uni.navigateTo({
						url: '/pages/web/login'
					});
				}
		}
		
	}
</script>

<style>
page {	background: #FFFFFF;}
</style>
