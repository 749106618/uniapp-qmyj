<template>
	<view>
		<view class="input-group m-setting" v-if="settingNow">
			<view class="input-row border" v-if="settingNow=='1'">
				<text class="title">真实姓名：</text>
				<input type="text" v-model="setting.true_name" placeholder="请输入真实姓名">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="setting.true_name.length > 0" @click="setting.true_name=''"></view>
			</view>
			<view class="input-row border" v-if="settingNow=='3'">
				<text class="title">小店名称：</text>
				<input type="text" v-model="setting.mshop_name" placeholder="请输入小店名称">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="setting.mshop_name.length > 0" @click="setting.mshop_name=''"></view>
			</view>
			<view class="input-row border" v-if="settingNow=='6'">
				<text class="title">小店介绍：</text>
				<input type="text" v-model="setting.mshop_info" maxlength="60" placeholder="请输入小店介绍,60字内">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="setting.mshop_info.length > 0" @click="setting.mshop_info=''"></view>
			</view>
			<view class="input-row border" v-if="settingNow=='4'">
				<text class="title">QQ：</text>
				<input type="number" v-model="setting.member_qq" placeholder="请输入常用QQ号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="setting.member_qq.length > 0" @click="setting.member_qq=''"></view>
			</view>
			<view class="input-row border" v-if="settingNow=='5'">
				<text class="title">阿里旺旺：</text>
				<input type="text" v-model="setting.member_ww" placeholder="请输入常用阿里旺旺">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="setting.member_ww.length > 0" @click="setting.member_ww=''"></view>
			</view>
			<view class="input-row border" v-if="settingNow=='2'">
				<text class="title">性别：</text>
				<view class="m-select flex flexrow">
					<view class="li flex flexrow" :class="{'ok':setting.member_sex==1}" @click="selectSex('1')"><view class="wwi-icon wwi-icon-anniu_xuanzhong"></view>男</view>
					<view class="li flex flexrow" :class="{'ok':setting.member_sex==2}" @click="selectSex('2')"><view class="wwi-icon wwi-icon-anniu_xuanzhong"></view>女</view>
					<view class="li flex flexrow" :class="{'ok':setting.member_sex==3}" @click="selectSex('3')"><view class="wwi-icon wwi-icon-anniu_xuanzhong"></view>保密</view>
				</view>
			</view>
		<view class="btn-row">
			<button type="primary" class="wwibtn" @tap="nextGo">确定</button>
		</view>
		</view>
		<view class="wwi-default-list mt10" v-else-if="!settingNow">
			<view class="li border" @click="settingSel('1')">
				<view class="a">
					<view class="h4">真实姓名</view>
					<view class="right">{{info.true_name}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="getImage">
				<view class="a">
					<view class="h4">头像</view>
					<view class="right">
							<image :src="info.avatar" class="st-avatar"></image>
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="settingSel('2')" v-if="!mshop">
				<view class="a">
					<view class="h4">性别</view>
					<view class="right">
						<block v-if="info.member_sex=='1'">男</block>
						<block v-else-if="info.member_sex=='2'">女</block>
						<block v-else-if="info.member_sex=='3'">保密</block>
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="settingSel('3')" v-if="mshop">
				<view class="a">
					<view class="h4">小店名称</view>
					<view class="right">{{info.mshop_name}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="settingSel('6')" v-if="mshop">
				<view class="a">
					<view class="h4">小店介绍</view>
					<view class="right"><view style="max-width: 480upx;">{{info.mshop_info}}</view>
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="chooseImage" v-if="mshop">
				<view class="a">
					<view class="h4">小店背景</view>
					<view class="right">
							<image :src="info.mshop_bg_image" class="st-avatar" style="border-radius:0;"></image>
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="settingSel('3')" v-if="mshop">
				<navigator :url="'/pages/invite/myCode?id='+info.member_id" class="a">
					<view class="h4">我的二维码</view>
					<view class="right"><view class="wwi-icon wwi-icon-erweima"></view>
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</navigator>
			</view>
			<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange"  v-if="!mshop">
			<view class="li border">
				<view class="a">
					<view class="h4">生日</view>
					<view class="right">{{info.member_birthday}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			</picker>
			<view class="li border" @click="settingSel('4')"  v-if="!mshop">
				<view class="a">
					<view class="h4">QQ</view>
					<view class="right">{{info.member_qq}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			<view class="li border" @click="settingSel('5')" v-if="!mshop">
				<view class="a">
					<view class="h4">阿里旺旺</view>
					<view class="right">{{info.member_ww}}
						<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
					</view>
				</view>
			</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				key:'',
				setting:{
					true_name:'',
					member_sex:'',
					mshop_name:'',
					mshop_info:'',
					avatar:'',
					member_avatar:'',
					member_birthday:'',
					member_qq:'',
					member_ww:'',
				},
				date:currentDate,
				info:[],
				settingNow:0,
				mshop:false
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			loadData:function(){
				this.wwiopt({
					url: '/index.php?app=member_account&wwi=member_setting',
					data: {key:this.key},
					success: res => {
						this.checkLogin(res.data.login);
						res.data.datas.member_info.avatar = res.data.datas.member_info.avatar+'?'+new Date().getTime();
						this.info = res.data.datas.member_info;
					}
				});
			},
			selectSex:function(e){
				this.setting.member_sex = e;
			},
			settingSel:function(e){
				if(e==this.settingNow){
					return;
				}
				this.settingNow = e;
				var title="";
				switch(this.settingNow){
					case '1':
						title = '设置真实姓名';
						 break;
					case '2':
						title = '设置性别';
						 break;
					case '3':
						title = '设置小店名称';
						 break;
					case '4':
						title = '设置QQ';
						 break;
					case '5':
						title = '设置阿里旺旺';
						 break;
					case '6':
						title = '设置小店介绍';
						 break;
				}
				uni.setNavigationBarTitle({title:title});
			},
			nextGo:function(){
				var param = {};
				param.key = this.key;
				switch(this.settingNow){
					case '1':
					if (this.setting.true_name.length < 1) {
						uni.showToast({
							icon: 'none',
							title: '请输入真实姓名'
						});
						return;
					}
					param.member_truename = this.setting.true_name;
						 break;
					case '2':
					if (this.setting.member_sex.length < 1) {
						uni.showToast({
							icon: 'none',
							title: '请选择性别'
						});
						return;
					}
					param.member_sex = this.setting.member_sex;
						 break;
					case '3':
					if (this.setting.mshop_name.length < 1) {
						uni.showToast({
							icon: 'none',
							title: '请输入小店名称'
						});
						return;
					}
					param.mshop_name = this.setting.mshop_name;
						 break;
					case '4':
					if (this.setting.member_qq.length < 5) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的QQ号'
						});
						return;
					}
					param.member_qq = this.setting.member_qq;
						 break;
					case '5':
					if (this.setting.member_ww.length < 3) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的阿里旺旺'
						});
						return;
					}
					param.member_ww = this.setting.member_ww;
						 break;
					case '6':
					if (this.setting.mshop_info.length < 1) {
						uni.showToast({
							icon: 'none',
							title: '请输入小店介绍60字内'
						});
						return;
					}
					param.mshop_info = this.setting.mshop_info;
						 break;
				}
				if(this.setting.member_birthday){
					param.member_birthday = this.setting.member_birthday;
				}
				this.wwiopt({
					url: "/index.php?app=member_account&wwi=member_setting_sub",
					method: 'POST',
					data: param,
					success: res => {
						if(res.data.datas.error){
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
							return false;
						}
					this.setting = {
						true_name:'',
						member_sex:'',
						mshop_name:'',
						mshop_info:'',
						avatar:'',
						member_avatar:'',
						member_qq:'',
						member_ww:'',
					};
					uni.setNavigationBarTitle({title:'个人设置'});
					uni.showToast({
						title: '设置成功',icon:'success'
					});
					this.settingNow = 0;
					this.loadData();
					},
				});
			},
			bindDateChange: function(e) {
				this.setting.member_birthday = e.target.value;
				this.nextGo();
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year - 5;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			},
			getImage: function () {
				uni.chooseImage({
					success: function (res) {
						uni.navigateTo({
							url:'/pages/my/mavatar?img='+res.tempFilePaths[0]
						});
					},
				})
			},
			chooseImage: function (e) {
				var _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						var imageSrc = res.tempFilePaths[0]
						const uploadTask = uni.uploadFile({
							url: _this.ApiUrl+'/index.php?app=member_account&wwi=ajax_upload_image',
							filePath: imageSrc,
							name: 'data',
							formData:{'key':_this.key},
							success: (res) => {
								var obj = JSON.parse(res.data);
								if(obj.datas.err){
									uni.showToast({ title: '上传失败', icon: 'noen'  });
									return false;
								}
								_this.wwiopt({
									url: "/index.php?app=member_account&wwi=member_setting_sub",
									method: 'POST',
									data:{'key':_this.key,'mshop_bg_image':obj.datas.file_name},
									success: res => {
										if(res.data.datas.error){
											uni.showToast({
												title: res.data.datas.error,icon:"none"
											});
											return false;
										}
									_this.setting = {
										true_name:'',
										member_sex:'',
										mshop_name:'',
										mshop_info:'',
										avatar:'',
										member_avatar:'',
										member_qq:'',
										member_ww:'',
									};
									uni.setNavigationBarTitle({title:'个人设置'});
									uni.showToast({
										title: '设置成功',icon:'success'
									});
									_this.settingNow = 0;
									_this.loadData();
									},
								});
							}
						});
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			}
		},
		onLoad:function(e){
			if(e.mshop){
				this.mshop = true;
			}
			this.key= uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		},
		onShow:function(){
			this.key= uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.loadData();
		},
	}
</script>

<style>
page{background: #F8F8F8;}
.m-setting {background: none ;}
.m-setting .input-row{background: #FFFFFF;}
.m-setting .title{width: 200upx;}
.m-setting .input-row input{flex: 1;}
.m-select{font-size: 28upx; align-items: center;}
.m-select .li{margin-right: 10upx;}
.m-select .li .wwi-icon{color: #EFEFEF;}
.m-select .li.ok .wwi-icon{color: #f44336;}
.st-avatar{width: 80upx; height: 80upx; border-radius:50% ;}
</style>
