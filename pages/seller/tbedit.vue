<template>
	<view>
		<view class="pubedit-adv"><image :src="advPic" mode="widthFix"></image></view>
		<view class="pubedit-from">
			<form @submit="formSubmit">
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>发&nbsp;&nbsp;布&nbsp;&nbsp;者</label>
						<input type="text" :value="dataBase.fabu_name" class="inp"  disabled="true"  />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>项目名称</label>
						<input type="text" :value="dataBase.name"   class="inp" disabled="true" />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>项目状态</label>
						<view class="pubrate flex flexrow flexAic flexJcc">
							<view class="wwi-icon" :class="'wwi-icon-gongchengjindu-'+dataBase.status_rate"></view>{{dataBase.statustxt}}
						</view>
						<input type="text" name="status" :value="dataBase.status" style="display: none;" />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>项目周期</label>
						<input type="text" name="day" :value="dataBase.day"   class="inp"/>
						天
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>报&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价</label>
						<input type="number" name="bao_price" :value="dataBase.price" style="color: #FF0000; font-weight: bold;"   class="inp" />
						元
					</view>
					<view style="color: #999;">
						价格必须是1-9999999之间的整数，此价格为投标报价，必填选项
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>所在地区</label>
						<view class="inp flex flexAic" @click="showMulLinkageThreePicker">{{areaInfo}}</view>
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>付款方式</label>
						<view class="inp flex flexrow">
							<view class="select flex flexrow" @tap="payType(1,'1')"><view class="wwi-icon" :class="pay_fangshi.pay_type==1?'wwi-icon-danxuanxuanzhong':'wwi-icon-danxuanweixuanzhong'"></view>全款</view>
							<view class="select flex flexrow" @tap="payType(1,'2')"><view class="wwi-icon" :class="pay_fangshi.pay_type==2?'wwi-icon-danxuanxuanzhong':'wwi-icon-danxuanweixuanzhong'"></view>定金付款</view>
							<view class="select flex flexrow" @tap="payType(1,'3')"><view class="wwi-icon" :class="pay_fangshi.pay_type==3?'wwi-icon-danxuanxuanzhong':'wwi-icon-danxuanweixuanzhong'"></view>分批付款</view>
							<input type="text" name="pay_type" :value="pay_fangshi.pay_type" style="display: none;" />
						</view>
					</view>
					<view class="pubedit-input flex flexrow border-top" v-if="pay_fangshi.pay_type==3">
						<label>付款批数</label>
						<view class="inp flex flexrow">
							<view class="select flex flexrow" @tap="payType(2,'2')"><view class="wwi-icon" :class="pay_fangshi.payselect==2?'wwi-icon-danxuanxuanzhong':'wwi-icon-danxuanweixuanzhong'"></view>分二期付款</view>
							<view class="select flex flexrow" @tap="payType(2,'3')"><view class="wwi-icon" :class="pay_fangshi.payselect==3?'wwi-icon-danxuanxuanzhong':'wwi-icon-danxuanweixuanzhong'"></view>分三期付款</view>
							<input type="text" name="payselect" :value="pay_fangshi.payselect" style="display: none;" />
						</view>
					</view>
					<view class="pubedit-input flex flexrow border-top" v-if="pay_fangshi.pay_type==2">
						<label>定金比例</label>
						<input type="number" name="one_bili" :value="pay_fangshi.one_bili" placeholder="定金比例0.1-100" style="color: #2CB476; font-weight: bold;"   class="inp" />%
					</view>
					<block v-if="pay_fangshi.pay_type==3">
					<view class="pubedit-input flex flexrow border-top">
						<label>一期比例</label>
						<input type="number" name="one_bili" :value="pay_fangshi.one_bili" placeholder="一期比例0.1-100" style="color: #2CB476; font-weight: bold;"   class="inp" />%
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>二期比例</label>
						<input type="number" name="two_bili" :value="pay_fangshi.two_bili" placeholder="二期比例0.1-100" style="color: #2CB476; font-weight: bold;"   class="inp" />%
					</view>
					<view class="pubedit-input flex flexrow border-top" v-if="pay_fangshi.payselect==3">
						<label>三期比例</label>
						<input type="number" name="three_bili" :value="pay_fangshi.three_bili" placeholder="三期比例0.1-100" style="color: #2CB476; font-weight: bold;"   class="inp" />%
					</view></block>
					<view class="pubedit-input flex flexrow border-top">
						<label>描述</label>
						<textarea name="desc"  class="inp"  :value="dataBase.desc" auto-height />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>附件</label>
						<view class="inp flex flexrow" style="padding: 20upx 0;">
							<block v-for="(file,v) in dataBase.file" :key="v">
							<view class="doc" v-if="file.type==2"><view class="wwi-icon wwi-icon-guanbi" @tap="fileDel(v,file.file_name)"></view></view>
							<view class="pic" v-if="file.type==1"><image :src="file.name" mode=""></image><view class="wwi-icon wwi-icon-guanbi" @tap="fileDel(v,file.file_name)"></view></view>
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
	export default {
        components: {
            wwiCitySelect
        },
		data() {
			return{
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				key:'',
				tbId:'',
				dataBase:{},
				advPic:'',
				areaInfo:'',
				areaId:'',
				cityId:'',
				pay_fangshi:{
					pay_type:1,
					one_bili:'',
					two_bili:'',
					three_bili:'',
					payselect:2
				}
				
			}
		},
		methods:{
			getData:function(){
				this.wwiopt({
					url: '/index.php?app=seller_store_tb_center&wwi=search_mytb',
					method: 'POST',
					data: {key:this.key,id:this.tbId},
					success: res => {
						this.checksellerLogin(res.data.login);
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
						this.pay_fangshi.pay_type = res.data.datas.pay_fangshi.pay_type;
						if(res.data.datas.pay_fangshi.pay_type==2){
							this.pay_fangshi.one_bili =  res.data.datas.pay_fangshi.one_bili;
							this.pay_fangshi.two_bili =  res.data.datas.pay_fangshi.two_bili;
						}else if(res.data.datas.pay_fangshi.pay_type==3){
							this.pay_fangshi.one_bili =  res.data.datas.pay_fangshi.one_bili;
							this.pay_fangshi.two_bili =  res.data.datas.pay_fangshi.two_bili;
							this.pay_fangshi.payselect =  res.data.datas.pay_fangshi.payselect;
							this.pay_fangshi.three_bili =  res.data.datas.pay_fangshi.three_bili;
						}
					}
				});
			},
			getAdv:function(){
					uni.request({
						url: this.ApiUrl+'/index.php?app=seller_store_tb_center&wwi=index',
						method: 'POST',
						header:{'content-type':'application/x-www-form-urlencoded'},
						data:{key:this.key,state_type:5},
						success: res => {
							this.advPic = res.data.datas.advpic;
						}
					});
			},
			payType:function(o,e){
				if(o==1){
					if(e==this.pay_fangshi.pay_type){
						return false;
					}
					this.pay_fangshi.pay_type = e;
				}else{
					if(e==this.pay_fangshi.payselect){
						return false;
					}
					this.pay_fangshi.payselect = e;
				}
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
			formSubmit:function(e){
				var parem = {};
				    parem = e.detail.value;
					parem.area_id = this.areaId;
					parem.city_id = this.cityId;
					parem.area_info = this.areaInfo;
					parem.id = this.tbId;
					parem.key = this.key;
					if(parem.pay_type==2){
						if(parem.one_bili > 100){
							uni.showModal({
								title: '提示',
								content: '定金比例不得大于100',
								showCancel: false
							});
							return false;
						}
					}
					if(parem.pay_type==3){
						if(parem.payselect==2){
							var dt = Number(parem.one_bili) + Number(parem.two_bili);
							console.log(dt);
							if(dt!=100){
								uni.showModal({
									title: '提示',
									content: '分期比例相加需要等于100',
									showCancel: false
								});
								return false;
							}
							
						}else if(parem.payselect==3){
							var dt = Number(parem.one_bili) + Number(parem.two_bili) + Number(parem.three_bili);
							if(dt!=100){
								uni.showModal({
									title: '提示',
									content: '分期比例相加需要等于100',
									showCancel: false
								});
								return false;
							}
						}
					}
					this.wwiopt({
						url: '/index.php?app=seller_store_tb_center&wwi=mytb_edit',
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
								url: '/index.php?app=seller_store_tb_center&wwi=file_delete',
								method: 'POST',
								data: {key:this.key,id:this.tbId,file_name:file},
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
			
		},
		onLoad:function(e){
			if(e.tbId){
				this.tbId = e.tbId;
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
			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
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
	.pubedit-from .pubedit-input{line-height: 80upx; width: 100%;}
	.pubedit-from .pubedit-input label{ width: 150upx; color: #666;}
	.pubedit-from .pubedit-input .inp{flex: 1; height: 80upx; line-height: 80upx;}
	.pubedit-from .pubedit-input .inp.disabled{color: #999;}
	.pubedit-from .pubrate{background: #2CB476; color: #fff; height: 50upx; border-radius: 50upx; padding: 0 15upx; margin:15upx 0;}
	.pubedit-from .pubedit-input .inp .pic{width: 80upx; height: 80upx; position: relative; border: 2upx solid #FF0000;}
	.pubedit-from .pubedit-input .inp image{width: 80upx; height: 80upx;}
	.pubedit-from .pubedit-input .inp .pic .wwi-icon{position: absolute; top: -15upx; right: -15upx; background: #FF0000; font-size: 28upx; color: #fff; border-radius: 100upx; }
	.pubedit-from .pubedit-input .inp .select{font-size: 24upx;width: 180upx;  align-items: center;}
	.pubedit-from .pubedit-input .inp .select .wwi-icon-danxuanweixuanzhong{color: #ccc;}
	.pubedit-from .pubedit-input .inp .select .wwi-icon-danxuanxuanzhong{color: #2CB476;}
	.pubedit-from .pubedit-input .upload{width: 120upx; color: #2CB476;}
	.btn-area{background: #FFFFFF;padding: 20upx;}
	.btn-area .btn-s{background: #2CB476; color: #FFFFFF;}
	
</style>
