<template>
	<view>
     <view class="login-content state" v-if="isBull == 2">
		 <view class="wwi-icon wwi-icon-guanliyuanrenzheng"></view>
		 <view class="input-h-title">您已完成了实名认证！</view></view>
     <view class="login-content state" v-if="isBull == 1">
		 <view class="wwi-icon wwi-icon-shebeijiance"></view>
		 <view class="input-h-title">您的认证信息正在审核中,请耐心等待！</view></view>
	<view class="login-content" v-if="isBull == 0">
		<view class="input-h-title">您的认证信息未提交或未通过审核，请完善！</view>
		<view class="input-group">
			
			<view class="input-row border">
				<text class="title">姓 名：</text>
				<input type="text" v-model="realname" placeholder="请输入真实姓名" :value="inputClearValue" @input="bindClearInput">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="showClearIcon" @click="clearIcon"></view>
			</view>
			<view class="input-row border">
				<text class="title">证件号：</text>
				<input type="idcard" v-model="idcard" placeholder="请输入身份证号" :value="inputClearValue1" @input="bindClearInput1">
				<view class="wwi-icon wwi-icon-anniu_guanbi" v-if="showClearIcon1" @click="clearIcon1"></view>
			</view>
			<view class="input-row border"><text class="title">正面：</text>
			<view class="cardimg">
				<block v-if="imageSrc">
					<image :src="imageSrc" class="image" mode="aspectFit"></image>
				</block>
				<block v-else>
						<view class="image-plus image-plus-nb" @tap="chooseImage('y')">
							<view class="image-plus-horizontal"></view>
							<view class="image-plus-vertical"></view>
						</view>
						<view class="image-plus-text">{{text}}</view>
				</block>
				</view></view>
			<view class="input-row border"><text class="title">反面：</text>
			<view class="cardimg">
				<block v-if="simageSrc">
					<image :src="simageSrc" class="image" mode="aspectFit"></image>
				</block>
				<block v-else>
						<view class="image-plus image-plus-nb" @tap="chooseImage('n')">
							<view class="image-plus-horizontal"></view>
							<view class="image-plus-vertical"></view>
						</view>
						<view class="image-plus-text">{{stext}}</view>
				</block>
				</view></view>
				
				</view>
		<view class="btn-row">
			<button type="primary" class="wwibtn" @tap="nextGo">提交验证</button>
		</view>
	</view></view>
</template>

<script>
	export default {
		data(){
			return{
				realname:'',
				idcard:'',
				imageSrc:'',
				simageSrc:'',
				imgName:'',
				simgNmae:'',
				text:'选择身份证照片正面',
				stext:'选择身份证照片反面',
				key:'',
				inputClearValue:'',
				inputClearValue1:'',
				showClearIcon1:false,
				showClearIcon:false,
				isBull: '0'
				
			}
		},
		onUnload:function(){
			this.imageSrc = '';
			this.simageSrc = '';
		},
		methods:{
			chooseImage: function (e) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						var imageSrc = res.tempFilePaths[0]
						const uploadTask = uni.uploadFile({
							url: this.ApiUrl+'/index.php?app=member_account&wwi=ajax_upload_image',
							filePath: imageSrc,
							name: 'data',
							formData:{'key':this.key},
							success: (res) => {
								var obj = JSON.parse(res.data);
								if(obj.datas.err){
									uni.showToast({ title: '上传失败', icon: 'noen'  });
									return false;
								}

								if(e=='n'){
									this.simageSrc = obj.datas.file_url;
									this.simgName = obj.datas.file_name;
								}else{
									this.imageSrc = obj.datas.file_url;
									this.imgName = obj.datas.file_name;
								}
							}
						});
						uploadTask.onProgressUpdate((res) => {
							if(e =='n'){
								this.stext = '上传进度' + res.progress
							}else{
								this.text = '上传进度' + res.progress
							}
							});

					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			bindClearInput: function(e) {
				this.inputClearValue = e.target.value;
				if (e.target.value.length > 0) {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearIcon: function() {
				this.inputClearValue = "";
				this.showClearIcon = false;
			},
			bindClearInput1: function(e) {
				this.inputClearValue1 = e.target.value;
				if (e.target.value.length > 0) {
					this.showClearIcon1 = true;
				} else {
					this.showClearIcon1 = false;
				}
			},
			clearIcon1: function() {
				this.inputClearValue1 = "";
				this.showClearIcon1 = false;
			},
			nextGo(){
                if (this.realname.length < 2) {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入至少两位姓名'
                    });
                    return;
                }
                if (this.idcard.length != 18) {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入18位身份证号'
                    });
                    return;
                }
                if (this.imgName.length < 1) {
                    uni.showToast({
                        icon: 'none',
                        title: '请上传身份证正面照片'
                    });
                    return;
                }
                if (this.simgName.length < 1) {
                    uni.showToast({
                        icon: 'none',
                        title: '请上传身份证反面照片'
                    });
                    return;
                }
				uni.request({
					url: this.ApiUrl+"/index.php?app=member_account&wwi=add_idcard",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key:this.key,name:this.realname,code:this.idcard,pic1:this.imgName,pic2:this.simgName},
					success: res => {
						this.checkStatus()
						console.log(res);
					}
				});
			},
			checkStatus(){
				uni.request({
					url: this.ApiUrl+"/index.php?app=member_account&wwi=get_idcard_bind",
					data: {key:this.key},
					success: res => {
						if(res.data.code ==200){
							if (res.data.datas.yes=='1' ||res.data.datas.yes=='2' ) {
								     this.isBull =res.data.datas.yes;
								}else{
									this.isBull = 0;
								}
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
				this.checkStatus();
		}
		
	}
</script>

<style>
page{background: #FFFFFF;}
.input-row .title {width: 200upx;}
.input-row input{width: 470upx;}
.image {width: 470upx;height: 360upx;}
.cardimg{box-sizing: border-box;padding: 30upx;display: flex;height: 420upx; width: 470upx;justify-content: center;align-items: center; flex-direction: column;}
.image-plus-text{display: flex; width: 470upx; align-items: center; justify-content: center;}
.input-group{margin-top: 40upx;}
progress {width: 100%;}
.state{min-height: 1000upx; align-items: center; justify-content: center;}
</style>
