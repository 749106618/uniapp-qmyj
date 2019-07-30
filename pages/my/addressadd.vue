<template>
<view >
		<view class="input-group mt10">
			<view class="input-row border">
				<text class="title">收货人：</text>
				<input type="text" v-model="name" placeholder="请输入收货人姓名">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="name.length > 0" @click="name=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">手机号：</text>
				<input type="number" v-model="phone" placeholder="请输入手机号">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="phone.length > 0" @click="phone=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">选择地区：</text>
				<view class="city-input flex flexAic" @click="showMulLinkageThreePicker">{{areaInfo}}</view>
			</view>
			<view class="input-row border">
				<text class="title">详细地址：</text>
				<input type="text" v-model="address" placeholder="请填写详细地址" auto-height>
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="address.length > 0" @click="address=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">默认地址：</text>
				<view style="margin-top: 15upx;"><switch :checked="is_default" @change="switch1Change" /></view>
				
			</view>
       </view>
	   		<view class="btn-row">
	   			<button type="primary" class="wwibtn" @tap="nextGo" :disabled="name.length>0&&phone.length>0&&address.length>0 ? false:true">提交</button>
	   		</view>
			<wwi-city-select :themeColor="themeColor" ref="wwiCitySelect" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel"
					@onConfirm="onConfirm"></wwi-city-select>
</view>
</template>

<script>
	import wwiCitySelect from '../../components/wwi-city-select.vue'
	export default {
         components: {
            wwiCitySelect
        },
		data() {
			return {
        cityPickerValueDefault: [0, 0, 0],
        themeColor: '#007AFF',
				key: '',
				addressId:'',
				name:'',
				phone:'',
				address:'',
				areaInfo:'',
				areaId:'',
				cityId:'',
				is_default:false
			};
		},
		methods: {
			switch1Change: function (e) {
				this.is_default =e.target.value;
				console.log(this.is_default)
			},
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=member_address&wwi=address_info',
					method: 'POST',
					data: {
						key: this.key,
						address_id: this.addressId
					},
					success: res => {
						this.checkLogin(res.data.login);
						this.name=res.data.datas.address_info.true_name;
						this.phone=res.data.datas.address_info.mob_phone;
						this.areaInfo=res.data.datas.address_info.area_info;
						this.address=res.data.datas.address_info.address;
						this.areaId=res.data.datas.address_info.area_id;
						this.cityId=res.data.datas.address_info.city_id;
						this.is_default=res.data.datas.address_info.is_default == '1' ? true : false;
					}
				});
			},
			nextGo(){
					if (this.name.length < 1) {
						uni.showToast({
							icon: 'none',
							title: '请输入收货人姓名'
						});
						return;
					}
					if (this.phone.length != 11) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确的手机号'
						});
						return;
					}
					if (this.areaInfo.length < 1) {
						uni.showToast({
							icon: 'none',
							title: '请选择正确的收货地区'
						});
						return;
					}
				if(this.addressId){
					
				this.wwiopt({
					url: "/index.php?app=member_address&wwi=address_edit",
					method: 'POST',
					data: {
						key:this.key,
						true_name:this.name,
						mob_phone:this.phone,
						city_id:this.cityId,
						area_id:this.areaId,
						address:this.address,
						area_info:this.areaInfo,
						is_default:this.is_default?'1':'0',
						address_id:this.addressId
					},
					success: res => {
						uni.navigateBack()
					}
				});
					
				}else{
					
				
				this.wwiopt({
					url: "/index.php?app=member_address&wwi=address_add",
					method: 'POST',
					data: {
						key:this.key,
						true_name:this.name,
						mob_phone:this.phone,
						city_id:this.cityId,
						area_id:this.areaId,
						address:this.address,
						area_info:this.areaInfo,
						is_default:this.is_default?'1':'0',
					},
					success: res => {
							uni.navigateBack()
					}
				});
				
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
				this.areaInfo=e.label;
				this.areaId=e.areaCode;
				this.cityId=e.cityCode;
            }
			
			
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			if(e.id){
				this.addressId=e.id;
				this.Inlimine();
			}
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
		},
        onUnload() {
            if (this.$refs.wwiCitySelect.showPicker) {
                this.$refs.wwiCitySelect.pickerCancel()
            }
        }
	}
</script>

<style>
page{background-color: #F8F8F8;}
.input-row .title {width: 200upx;}
.input-row input {	width: 470upx;}
.input-row input.code {	width: 260upx;}
.input-row .city-input{flex: 1; font-size: 28upx;}
</style>
