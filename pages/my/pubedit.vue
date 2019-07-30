<template>
	<view>
		<view class="pubedit-adv"><image :src="advPic" mode="widthFix"></image></view>
		<view class="pubedit-from">
			<form @submit="formSubmit">
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>项目名称</label>
						<input type="text" name="name" :value="dataBase.name" class="inp"  />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>项目类型</label>
						<input type="text" name="type" :value="dataBase.type"   class="inp disabled" disabled="true" />
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>开始时间</label>
						<input type="text" :value="dataBase.start_time" class="inp disabled" disabled="true"  />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>结束时间</label>
						<view class="inp flex flexrow">
							<picker mode="date" :value="end_time_date" :start="startDate" :end="endDate" @change="bindDateChange">
								<view class="uni-input">{{end_time_date}}</view>
							</picker>
							<picker mode="time" :value="end_time_hour" start="00:01" end="23:59" @change="bindTimeChange">
								<view class="uni-input" style="margin-left: 20upx;">{{end_time_hour}}</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>联系人</label>
						<input type="text" name="contacts" :value="dataBase.contacts" class="inp"/>
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>手机号码</label>
						<input type="text" name="phone" :value="dataBase.phone" maxlength="11"  class="inp"  />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>所在城市</label>
						<view class="inp flex flexAic" @click="showMulLinkageThreePicker">{{areaInfo}}</view>
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>详细地址</label>
						<input type="text" name="address" :value="dataBase.address"  class="inp"  />
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>需求说明</label>
						<textarea name="demand"  class="inp"  :value="dataBase.demand" auto-height />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>附件</label>
						<view class="inp flex flexrow" style="padding: 20upx 0;">
							<block v-for="(file,v) in dataBase.file" :key="v">
							<view class="doc file flex flexAic flexJcc" v-if="file.type==2"><view class="wwi-icon wwi-icon-tianjiafujian"></view>
								<view class="wwi-icon wwi-icon-guanbi" @tap="fileDel(v,file.file_name)"></view></view>
							<view class="pic file" v-if="file.type==1"><image :src="file.name" mode=""></image><view class="wwi-icon wwi-icon-guanbi" @tap="fileDel(v,file.file_name)"></view></view>
							</block>
						</view>
						<view class="upload">上传附件</view>
					</view>
				</view>
				<view class="btn-area">
					<button formType="submit" class="btn-s">提交</button>
				</view>
			</form>
			
		</view>
			<wwi-city-select :themeColor="themeColor" ref="wwiCitySelect" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel"
					@onConfirm="onConfirm"></wwi-city-select>
	</view>
	
</template>

<script>
	import wwiCitySelect from '../../components/wwi-city-select.vue';
	function getDate(type) {
		const date = new Date();
	
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
	
		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
	
		return `${year}-${month}-${day}`;
	}
	export default {
        components: {
            wwiCitySelect
        },
		data() {
			return{
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				key:'',
				pubId:'',
				dataBase:{},
				advPic:'',
				areaInfo:'',
				areaId:'',
				cityId:'',
				end_time_date: getDate({
					format: true
				}),
				startDate:getDate('start'),
				endDate:getDate('end'),
				end_time_hour:'12:01'
			}
		},
		methods:{
			getData:function(){
				this.wwiopt({
					url: '/index.php?app=publish_order&wwi=searchfabuinfo',
					method: 'POST',
					data: {key:this.key,id:this.pubId},
					success: res => {
						this.checkLogin(res.data.login);
						if(res.data.datas.error){
							uni.showModal({
								title: '提示',
								content: res.data.datas.error,
								showCancel: false,
								success: () => {
									uni.navigateBack();
								}
							});
							return false;
						}
						this.dataBase = res.data.datas;
						this.areaInfo =  res.data.datas.area_info;
						this.areaId = res.data.datas.area_id;
						this.cityId = res.data.datas.city_id;
						this.end_time_date = res.data.datas.end_time_date;
						this.end_time_hour = res.data.datas.end_time_hour;
					}
				});
			},
			getAdv:function(){
					uni.request({
						url: this.ApiUrl+'/index.php?app=publish_order&wwi=publishorder_list',
						method: 'POST',
						header:{'content-type':'application/x-www-form-urlencoded'},
						data:{key:this.key,state_type:4},
						success: res => {
							this.advPic = res.data.datas.advpic;
						}
					});
			},
			fileDel:function (e,file) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该附件么，删除后不可恢复',
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if(res.confirm){
							this.wwiopt({
								url: '/index.php?app=publish_order&wwi=delete_file',
								method: 'POST',
								data: {key:this.key,id:this.pubId,file_name:file},
								success: ok => {
									if(ok.data.datas.error){
										uni.showModal({
											title: '提示',
											content: ok.data.datas.error,
											showCancel: false,
										});
										return false;
									}
									uni.showModal({
										title: '提示',
										content: '删除成功',
										showCancel: false,
									});
									this.dataBase.file.splice(e, 1);
								}
							});
						}
					}
				});
				
			},
            onCancel(e) {
                console.log(e);
            },
            // 三级联动选择
            showMulLinkageThreePicker() {
                this.$refs.wwiCitySelect.show();
            },
            onConfirm(e) {
				console.log(e)
				this.areaInfo=e.label;
				this.areaId=e.areaCode;
				this.cityId=e.cityCode;
            },
			bindDateChange: function(e) {
				this.end_time_date = e.target.value
			},
			bindTimeChange: function(e) {
				this.end_time_hour = e.target.value
			},
			formSubmit:function(e){
				var parem = {};
				    parem = e.detail.value;
					parem.area_id = this.areaId;
					parem.city_id = this.cityId;
					parem.area_info = this.areaInfo;
					parem.end_time_date = this.end_time_date;
					parem.end_time_hour = this.end_time_hour;
					parem.id = this.pubId;
					parem.key = this.key;
					this.wwiopt({
						url: '/index.php?app=publish_order&wwi=updatefabuproject',
						method: 'POST',
						data: parem,
						success: res => {
							if(res.data.datas.error){
								uni.showModal({
									title: '提示',
									content: res.data.datas.error,
									showCancel: false,
									success: res => {},
								});
								return false;
							}
							uni.showModal({
								title: '提示',
								content: '编辑成功',
								showCancel: false,
								success: res => {
									uni.navigateBack();
								}
							});
						}
					});
				console.log(parem);
			}
			
		},
		onLoad:function(e){
			if(e.pubId){
				this.pubId = e.pubId;
			}else{
				uni.showModal({
					title: '提示',
					content: '参数错误异常，或不存在',
					showCancel: false,
					confirmText: '返回',
				});
				uni.navigateBack();
				return false;
			}
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
				return false;
			}
			this.getData();
			this.getAdv()
		}
	}
</script>

<style>
	.pubedit-adv image{width: 100%; height: auto;}
	.pubedit-from{}
	.pubedit-from .list{padding: 20upx; background: #FFFFFF;}
	.pubedit-from .list .border-top{border-top:1px solid #F8F8F8 ;}
	.pubedit-from .pubedit-input{line-height: 80upx;}
	.pubedit-from .pubedit-input label{ width: 150upx; color: #666;}
	.pubedit-from .pubedit-input .inp{flex: 1; height: 80upx; line-height: 80upx;}
	.pubedit-from .pubedit-input .inp.disabled{color: #999;}
	.pubedit-from .pubedit-input .inp .file{width: 80upx; height: 80upx; position: relative; border: 2upx solid #FF0000; vertical-align: middle; margin-right:30upx;}
	.pubedit-from .pubedit-input .inp image{width: 80upx; height: 80upx;}
	.pubedit-from .pubedit-input .inp .file .wwi-icon-guanbi{position: absolute; top: -15upx; right: -15upx; background: #FF0000; font-size: 28upx; color: #fff; border-radius: 100upx; }
	.pubedit-from .pubedit-input .upload{width: 120upx; color: #2CB476;}
	.btn-area{background: #FFFFFF;padding: 20upx;}
	.btn-area .btn-s{background: #2CB476; color: #FFFFFF;}
	
</style>
