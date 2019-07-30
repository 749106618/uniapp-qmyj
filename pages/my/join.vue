<template>
	<view>
		<view class="join-adv"><image :src="advPic" mode="widthFix"></image></view>
		<view class="join-nav flex flexrow flexAic flexJcc mt10">
			<view class="join-li flex flexrow flexAic flexJcc" :class="{'ok':joinType==1}" @click="selectJoin('1')"><view class="wwi-icon wwi-icon-gerenruzhu"></view>个人/团队</view>
			<view class="join-li bl flex flexrow flexAic flexJcc" :class="{'ok':joinType==2}" @click="selectJoin('2')"><view class="wwi-icon wwi-icon-ruzhuqiye"></view>企业</view>
		</view>
		<view class="join-from">
			<form @submit="formSubmit">
				<view class="title mt10">您需要填写商铺基本信息</view>
				<view class="mt10 list">
					<view class="join-input flex flexrow" v-if="joinType==2">
						<label>企业名称</label>
						<input type="text" name="company_name" placeholder="请输入企业名称"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top" v-if="joinType==2">
						<label>营业执照号</label>
						<input type="text" name="business_licence_number" placeholder="请输入营业执照统一信用代码"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top" v-if="joinType==2">
						<label>营业执照图</label>
						<view class="inp">
							<view class="img flex flexAic flexJcc" style="width: 80upx; height: 80upx;" @tap="chooseImage">
								<view class="wwi-icon wwi-icon-paishefuwu" v-if="!business_licence_number_elc"></view>
								<image :src="business_licence_number_elc" style="width: 80upx; height: 80upx;" mode="widthFix" v-if="business_licence_number_elc"></image>
							</view>
						</view>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>联系人</label>
						<input type="text" name="contacts_name" placeholder="请输入联系人"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>联系电话</label>
						<input type="number" name="contacts_phone" placeholder="请输入联系电话" maxlength="11" class="inp"/>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>所在城市</label>
						<view class="inp flex flexAic" @click="showMulLinkageThreePicker">{{areaInfo}}</view>
					</view>
					<view class="join-input flex flexrow border-top" v-if="joinType==2">
						<label>详细地址</label>
						<input type="text" name="company_address_detail" placeholder="请输入详细地址"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>商家账号</label>
						<input type="text" name="seller_name" placeholder="请输入商家账号"  class="inp"  />
					</view>
					<view class="border-top" style="color: #FF0036;">此账号为日后登入并管理商家中心时使用，注册后不可修改，请牢记。密码与会员登入密码相同。</view>
				</view>
				<view class="title mt10">您需要提交商铺经营资料</view>
				<view class="mt10 list">
					<view class="join-input flex flexrow">
						<label>店铺名称</label>
						<input type="text" name="store_name" placeholder="请输入店铺名称"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>店铺简介</label>
						<textarea name="store_jieshao"  class="inp" placeholder=".." auto-height />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>店铺等级</label>
						<view class="inp">
							<radio-group @change="sgChange" name="sg_id">
								<label class="flex flexrow" style="width: 100%;" v-for="(item,index) in gradeList" :key="item.id">
									<view style="width:80upx;">
										<radio :value="item.id" color="#2CB476"  :checked="index === sdIndex"/>
									</view>
									<view style="flex: 1;">
										<view :class="{'ok':index === sdIndex}" style="font-weight: bold;">{{item.name}}</view>
										<view class="">商品数：{{item.goods_nums}};模板数：{{item.meiyue_nums}};收费标准：{{item.total_price}}元/年；附加功能：{{item.extra}}</view>
									</view>
								</label>
							</radio-group>
						</view>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>开店时长</label>
						<view class="inp">
							<radio-group  name="joinin_year" class="flex flexrow flexwrap">
								<label class="flex flexrow flexAic" style="margin-bottom:20upx ;" v-for="item in yearList" :key="item.id" v-if="yearList">
									<view><radio :value="item.id" color="#2CB476" /></view>
									<view>{{item.year}}</view>
								</label>
							</radio-group>
						</view>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>店铺分类</label>
						<view class="inp">
							<picker @change="bindPickerStoreclass" :value="index" :range="storeList" range-key="name" v-if="storeList.length">
								<view class="uni-input">{{storeList[index].name}}</view>
							</picker>
						</view>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>服务类目<view >(可多选)</view></label>
						<view class="inp">
							<view class="selec">
								<checkbox-group name="service" @change="checkboxService" class="flex flexrow flexwrap">
									<label v-for="item in serviceList" :key="item.id" class="lb">
										<view class="lp" :class="{'ck':item.checked}">
										<checkbox :value="item.id"  style="display: none;"  />{{item.name}}
										</view>
									</label>
								</checkbox-group>
								<view class="li"></view>
							</view>
						</view>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>技能标签<view >(可多选)</view></label>
						<view class="inp">
							<view class="selec">
								<checkbox-group name="tag" @change="checkboxTag" class="flex flexrow flexwrap">
									<label v-for="item in tagList" :key="item.id" class="lb">
										<view class="lp" :class="{'ck':item.checked}">
										<checkbox :value="item.id"  style="display: none;"  />{{item.name}}
										</view>
									</label>
								</checkbox-group>
								<view class="li"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="join-storeClass mt10">
					<view class="btn flex flexrow flexAic flexJcc" @tap="showClassAdd">
						<view class="wwi-icon wwi-icon-fabuxuqiu"></view>产品经营类目
					</view>
					<view class="add-list">
						<view class="add-li flex flexJcs" v-for="(item,index) in subListSel" :key="index">
							<view class="">{{item.name}}</view>
							<view class="del" @click="delSubList(index)">删除</view>
						</view>
					</view>
				</view>
				<view class="btn-area">
					<button formType="submit" class="btn-s">提交</button>
				</view>
			</form>
			
		</view>
			<wwi-city-select :themeColor="themeColor" ref="wwiCitySelect" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel"
					@onConfirm="onConfirm"></wwi-city-select>
		<wwi-mask-up ref="showClass" title="选择经营类目" bottomText="确定">
			<view class="select-class flex flexrow">
            <view class="hd">
				<view class="li flex flexJcc" style="color: #999;">选择一级</view>
				<view class="li flex flexJcc" :class="{'ok':item.checked}" v-for="item in classList1" :key="item.id" @click="checkClassselct(1,item)">{{item.name}}</view>
			</view>
			<view class="bd">
				<view class="li flex flexJcc" style="color: #999;">选择二级</view>
				<view class="li flex flexJcc" :class="{'ok':item.checked}" v-for="item in classList2" :key="item.id" @click="checkClassselct(2,item)">{{item.name}}</view>
			</view>
			<view class="cd">
				<view class="li flex flexJcc" style="color: #999;">选择三级</view>
				<view class="li flex flexJcc" :class="{'ok':item.checked}" v-for="item in classList3" :key="item.id" @click="checkClassselct(3,item)">{{item.name}}</view>
			</view>
			</view>
		</wwi-mask-up>
	</view>
</template>

<script>
	import wwiCitySelect from '@/components/wwi-city-select.vue';
	import wwiMaskUp from '@/components/wwi-mask-up.vue';
	export default {
		components: {
			wwiMaskUp,
			wwiCitySelect
		},
		data(){
			return{
				key:'',
				jstype:10,
				serviceList:[],
				tagList:[],
				gradeList:[],
				yearList:[],
				storeList:[],
				classList1:[],
				classList2:[],
				classList3:[],
				subClassSel:'',
				subClassSel2:'',
				subClassSelid:'',
				subClassSel2id:0,
				subListSel:[],
				areaInfo:'点击选择所在城市',
				areaId:'',
				cityId:'',
				sdIndex:0,
				index:0,
				joinType:1,
				advPic:'https://static.qianmeng1688.com/mall/adv/06149497507805932.png',
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				business_licence_number_elc:''
			}
		},
		methods:{
			loadInfo:function(){
				this.wwiopt({
					url: '/index.php?app=join&wwi=search_storeinfo',
					method: 'POST',
					data: {key:this.key},
					success: res => {
						var newData = res.data.datas;
						if(newData.error){
							uni.showModal({
								title: '提示',
								content: newData.error,
								showCancel: false,
								success:function(){
									uni.navigateBack();
								}
							});
							return false;
						}
						this.advPic = newData.advpic;
						this.gradeList = newData.list1;
						this.tagList = newData.list5;
						this.serviceList = newData.list4;
						this.yearList = newData.list2;
						this.storeList = newData.list3;
						this.classList1 = newData.list6;
					},
					fail: () => {},
					complete: () => {}
				});
			},
			checkboxService:function(e){
				var items = this.serviceList,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.id)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			checkboxTag:function(e){
				var items = this.tagList,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.id)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			checkClassselct:function(e,ss){
				var _this = this;
				if(e==1){
					var items = this.classList1;
					for (var i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i],
						      inNow = ss.id;
						if(inNow.includes(item.id)){
							if(item.checked == true){
								return;
							}
							this.$set(item,'checked',true);
							this.subClassSelid = ss.id;
							this.subClassSel = ss.name;
							this.classList3 = [];
							this.classList2 = [];
							this.wwiopt({
								url: '/index.php?app=join&wwi=search_productinfo',
								method: 'POST',
								data: {key:this.key,id:ss.id},
								success: res => {
									this.classList2 = res.data.datas.list;
								}
							});
						}else{
							this.$set(item,'checked',false)
						}
					}
				}else if(e==2){
					var items = this.classList2;
					for (var i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i],
						      inNow = ss.id;
						if(inNow.includes(item.id)){
							if(item.checked == true){
								return;
							}
							this.wwiopt({
								url: '/index.php?app=join&wwi=search_productinfo',
								method: 'POST',
								data: {key:this.key,id:ss.id},
								success: res => {
									_this.classList3 = res.data.datas.list;
									if(_this.classList3.length){
									for(let i = 0; i < _this.classList3.length; i ++){
										_this.$set(_this.classList3[i], 'checked', false);
										for(let j = 0; j < _this.subListSel.length; j ++){
												if (_this.classList3[i].id == _this.subListSel[j].id) {
													_this.classList3[i].checked = true;
												}
											}
										}
									}
								}
							});
							this.$set(item,'checked',true);
							this.subClassSel2 = ss.name;
							this.subClassSel2id = ss.id;
						}else{
							this.$set(item,'checked',false)
						}
					}
				}else{
					var items = this.classList3;
					var ListSel = this.subListSel;
					for (var i = 0, lenI = items.length; i < lenI; ++i) {
						const item = items[i];
						if(ss.id==item.id){
							if(item.checked == true){
									this.$set(item,'checked',false);
									for (var ii = 0, lenII = ListSel.length; ii < lenII; ++ii) {
										const inGt = ListSel[ii];
										if(item.id == inGt.id){
											ListSel.splice(ii,1);
										}
									}
								}else{
									this.$set(item,'checked',true);
									ListSel.push({
										 'id':item.id,
										 'subid':this.subClassSel2id,
										 'subname':this.subClassSel2,
										 'tid':this.subClassSelid,
										 'tname':this.subClassSel,
										 'title':ss.name,
										 'name':this.subClassSel+'>'+this.subClassSel2+'>'+ss.name
									});
								}
						}else{
							if(item.checked == true){
								this.$set(item,'checked',true);
							}else{
								this.$set(item,'checked',false);
							}
						}
					}
				}
			},
			chooseImage: async function() {
				uni.chooseImage({
					count:1,
					success: (res) => {
						this.business_licence_number_elc = res.tempFilePaths[0];
					}
				})
			},
			bindPickerStoreclass:function(e){
				this.index = e.target.value;
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
            },
			sgChange(evt) {
				for (let i = 0; i < this.yearList.length; i++) {
					if (this.yearList[i].id === evt.target.value) {
						this.sdIndex = i;
						break;
					}
				}
			},
			delSubList:function(e){
				this.subListSel.splice(e,1);
				var _this =this;
				for(let i = 0; i < _this.classList3.length; i ++){
					_this.$set(_this.classList3[i], 'checked', false);
					for(let j = 0; j < _this.subListSel.length; j ++){
							if (_this.classList3[i].id == _this.subListSel[j].id) {
								_this.classList3[i].checked = true;
							}
						}
					}
			},
			showClassAdd:function(){
				this.$refs.showClass.show();
			},
			selectJoin:function(e){
				if(e==this.joinType){
					return false;
				}
				this.joinType = e;
			},
			formSubmit:function(e){
				var _this = this;
				var parem = {};
				    parem = e.detail.value;
					parem.area_id = this.areaId;
					parem.area_info = this.areaInfo;
					parem.city_id = this.cityId;
					parem.key = this.key;
					parem.sc_id = this.storeList[this.index].id;
					parem.jiaose_type = this.jstype;
					parem.join_type = this.joinType;
					parem.store_class = '';
					parem.store_class_name = '';
					for(let j = 0; j < _this.subListSel.length; j ++){
						var ggId = _this.subListSel[j].tid+','+_this.subListSel[j].subid+','+_this.subListSel[j].id;
						var ggIdname = _this.subListSel[j].tname+','+_this.subListSel[j].subname+','+_this.subListSel[j].title;
							parem.store_class += ggId+'|';
							parem.store_class_name += ggIdname+'|';
					}
					parem.tag = parem.tag.join(',');
					parem.service = parem.service.join(',');
				if(parem.join_type==2){
					if(!_this.business_licence_number_elc){
						uni.showModal({
							title: '提示',
							content: '营业执照图片未上传',
							showCancel: false
						});
						return false;
					}
					if(parem.company_name.length < 3){
						uni.showModal({
							title: '提示',
							content: '企业名称不得少于3个字符',
							showCancel: false
						});
						return false;
					}
					if(parem.business_licence_number.length < 9){
						uni.showModal({
							title: '提示',
							content: '统一信用代码未填写或少于9个字符',
							showCancel: false
						});
						return false;
					}
					if(parem.company_address_detail.length < 9){
						uni.showModal({
							title: '提示',
							content: '详细地址未填写或少于6个字符',
							showCancel: false
						});
						return false;
					}
				}
				if(parem.store_name.length < 6){
					uni.showModal({
						title: '提示',
						content: '店铺名称不得为空或少于6个字符',
						showCancel: false
					});
					return false;
				}
				if(parem.seller_name.length < 6){
					uni.showModal({
						title: '提示',
						content: '商家不得少于6个字符',
						showCancel: false
					});
					return false;
				}
				if(parem.contacts_name.length < 2){
					uni.showModal({
						title: '提示',
						content: '联系人不得少于2个字符',
						showCancel: false
					});
					return false;
				}
				if(parem.contacts_phone.length < 8){
					uni.showModal({
						title: '提示',
						content: '联系电话格式不正确',
						showCancel: false
					});
					return false;
				}
				if(!parem.city_id){
					uni.showModal({
						title: '提示',
						content: '请选择所在城市',
						showCancel: false
					});
					return false;
				}
				if(!parem.joinin_year){
					uni.showModal({
						title: '提示',
						content: '请选择开店时长',
						showCancel: false
					});
					return false;
				}
				if(parem.store_class.length < 1){
					uni.showModal({
						title: '提示',
						content: '请选择产品经营类目',
						showCancel: false
					});
					return false;
				}
				if(parem.service.length < 1){
					uni.showModal({
						title: '提示',
						content: '请选择服务类目',
						showCancel: false
					});
					return false;
				}
				if(parem.tag.length < 1){
					uni.showModal({
						title: '提示',
						content: '请选择技能标签',
						showCancel: false
					});
					return false;
				}
				
				if(parem.join_type==1){
					_this.wwiopt({
						url: '/index.php?app=join&wwi=join_save',
						method: 'POST',
						data: parem,
						success: res => {
							if(res.data.datas.error){
								uni.showModal({
									title: '提示',
									content: res.data.datas.error,
									showCancel: false
								});
								return false;
							}
							_this.loadInfo();
						}					
					});
					
				}else{
					uni.uploadFile({
							url: _this.ApiUrl + '/index.php?app=join&wwi=join_save',
							filePath: _this.business_licence_number_elc,
							name: 'file',
							formData: parem,
							success: (res) => {
								var obj = JSON.parse(res.data);
								if(obj.datas.error){
									uni.showModal({
										title: '提示',
										content: res.data.datas.error,
										showCancel: false
									});
									return false;
								}
								_this.loadInfo();
							}
					})
				}
					console.log(parem)
			}
		},
		onLoad:function(e){
			if(e.state){
				this.jstype = e.state;
			}
			this.key = uni.getStorageSync('key');
			this.loadInfo();
		}
		}
</script>

<style>
	.join-adv image{width: 100%; height: auto; vertical-align: middle;}
	.join-nav{height: 100upx; background: #fff;}
	.join-nav .join-li{flex: 1; color: #999; font-size: 30upx;}
	.join-nav .join-li .wwi-icon{ font-size: 58upx; margin-right: 15upx;}
	.join-nav .join-li.bl{border-left: 2upx solid #F8F8F8;}
	.join-nav .join-li.ok{color: #333;}
	.join-nav .join-li.ok .wwi-icon{color: #e9b224;}
	.join-nav .join-li.bl.ok .wwi-icon{color: #08a6fb;}
	.join-from{}
	.join-from .title{border-left: 4upx solid #2CB476; padding-left: 20upx; margin-left: 20upx; color: #999; font-weight: bold;}
	.join-from .list{padding: 20upx; background: #FFFFFF;}
	.join-from .list .border-top{border-top:1px solid #F8F8F8 ;}
	.join-from .join-input{line-height: 80upx;}
	.join-from .join-input label{ width: 150upx; color: #666;}
	.join-from .join-input .inp{flex: 1; height: auto; line-height: 50upx; padding: 15upx 0;}
	.join-from .join-input .inp.disabled{color: #999;}
	.join-from .join-input .inp .selec .lb{width: auto;}
	.join-from .join-input .inp .selec .lp{border: 1px solid transparent; padding: 5upx 20upx; margin-right:20upx ; margin-bottom: 20upx; color: #333;}
	.join-from .join-input .inp .selec .lp.ck{color: #2CB476; border-color: #2CB476 ; border-radius: 20upx;}
	.join-from .join-input .inp .ok{color: #2CB476;}
	.join-storeClass{padding: 20upx; background: #ffffff;}
	.join-storeClass .btn{ font-size: 32upx; height: 80upx;}
	.join-storeClass .btn .wwi-icon{color: #2CB476; margin-right: 15upx;}
	.join-storeClass .add-list{border-top: 1px solid #F8F8F8;}
	.join-storeClass .add-list .add-li{line-height: 60upx;}
	.join-storeClass .add-list .add-li .del{color: #2CB476;}
	.btn-area{background: #FFFFFF;padding: 20upx;}
	.btn-area .btn-s{background: #2CB476; color: #FFFFFF;}
	.select-class .li{line-height: 50upx;}
	.select-class .li.ok{color: #2CB476;}
	.select-class .hd{width: 30%;}
	.select-class .bd{width: 30%;}
	.select-class .cd{width: 40%;}
</style>
