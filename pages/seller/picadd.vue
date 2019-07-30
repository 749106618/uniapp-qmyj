<template>
	<view>
		<view class="pubedit-from">
			<form @submit="formSubmit">
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>发布分类</label>
						<view class="inp flex flexrow flexwrap">
							<view class="sel-li" :class="{'ok':checkClassId==item.class_id}" @tap="checkClass(item.class_id)" v-for="item in dataBase.class_list" :key="item.class_id">{{item.menu_title}}</view>
						</view>
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>标&nbsp;&nbsp;&nbsp;&nbsp;题</label>
						<input type="text" name="title" placeholder="标题限定在24个字符内" maxlength="24" class="inp" style="height: 80upx; min-height: 80upx;" />
					</view>
					<view class="pubedit-input flex flexrow border-top">
						<label>摘&nbsp;&nbsp;&nbsp;&nbsp;要</label>
						<textarea name="desc" placeholder="摘要限定在240个字以内" maxlength="240"  class="inp" auto-height />
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>图片上传</label>
						<view class="inp">
							<view class="picList" v-for="(item,v) in picList" :key="v">
								<input type="text" :name="'file['+v+'][file_url]'" :value="item.file_url" style="display: none;">
								<input type="text" :name="'file['+v+'][file_desc]'" :value="item.file_desc" style="display: none;">
								<input type="text" :name="'file['+v+'][is_default]'" :value="item.is_default" style="display: none;">
								<input type="text" :name="'file['+v+'][file_name]'" :value="item.file_name" style="display: none;">
								<input type="text" :name="'file['+v+'][file_path]'" :value="item.file_path" style="display: none;">
								<view class="sli flex flexrow">
									<image :src="item.file_url" mode=""></image>
									<textarea placeholder="请添加图片描述,限定在140个字内" v-model="item.file_desc" class="text" maxlength="140" />
								</view>
								<view class="sbtn flex flexrow">
									<view class="sbtn-li flex flexrow flexAic" :class="{'ok':item.is_default==1}" @tap="changeDefaul(v)"><view class="wwi-icon wwi-icon-tupian"></view>封面</view>
									<view class="sbtn-li flex flexrow flexAic" @tap="delPic(item.file_name,v)"><view class="wwi-icon wwi-icon-shanchu"></view>删除</view>
								</view>
							</view>
							<view class="addPic" @tap="chooseImage">图片上传</view>
						</view>
					</view>
				</view>
				<view class="mt10 list">
					<view class="pubedit-input flex flexrow">
						<label>分类标签<view class="">(可多选)</view></label>
						<view class="inp">
							<view class="selec">
								<checkbox-group name="tag" @change="checkboxTag" class="flex flexrow flexwrap">
									<label v-for="item in tagList" :key="item.tid" class="lb">
										<view class="lp" :class="{'ck':item.checked}">
										<checkbox :value="item.tid"  style="display: none;"  />{{item.title}}
										</view>
									</label>
								</checkbox-group>
							</view>
						</view>
					</view>
				</view>
				<view class="btn-area">
					<button formType="submit" class="btn-s">提交</button>
				</view>
			</form>
			
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return{
				key:'',
				dataBase:{},
				checkClassId:0,
				tagList:[],
				picList:[]
			}
		},
		methods:{
			getData:function(){
				this.wwiopt({
					url: '/index.php?app=seller_picture&wwi=add_picture',
					method: 'POST',
					data: {key:this.key},
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
						this.tagList = res.data.datas.tag_list;
					}
				});
			},
			checkboxTag:function(e){
				var items = this.tagList,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(values.includes(item.tid)){
						this.$set(item,'checked',true)
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			chooseImage:function(){
				var _this = this;
				uni.chooseImage({
					count:1,
					success: (res) => {
						var imageSrc = res.tempFilePaths[0];
						uni.uploadFile({
							url: _this.ApiUrl + '/index.php?app=seller_picture&wwi=image_upload',
							filePath: imageSrc,
							name: 'file',
							formData: {
								'key': this.key
							},
							success: (res) => {
								var obj = JSON.parse(res.data);
								if (obj.datas.error) {
									uni.showToast({
										title: '上传失败',
										icon: 'noen'
									});
									return false;
								}
								_this.picList.push({
									file_name: obj.datas.file_name,
									file_desc: '',
									file_url:  obj.datas.file_url,
									file_path: obj.datas.file_path,
									is_default: '0'
								});
								console.log(_this.picList)
							}
						});
					}
				})
			},
			changeDefaul:function(e){
				var items = this.picList;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(e==i){
						this.$set(item,'is_default','1')
					}else{
						this.$set(item,'is_default','0')
					}
				}
			},
			checkClass:function(e){
				if(e==this.checkClassId){
					return false;
				}
				this.checkClassId = e;
			},
			delPic:function(name,e){
				this.wwiopt({
					url: '/index.php?app=seller_picture&wwi=image_delete',
					method: 'POST',
					data: {key:this.key,image_name:name},
					success: res => {
						if(res.data.datas.error){
							uni.showModal({
								title: '提示',
								content: '图片删除失败',
								showCancel: false
							});
							return false;
						}
						this.picList.splice(e, 1);
					}
				});
			},
			formSubmit:function(e){
				var parem = {};
				    parem = e.detail.value;
					parem.key = this.key;
					parem.class_id = this.checkClassId;
					this.wwiopt({
						url: '/index.php?app=seller_picture&wwi=picture_save',
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
								content: '发布案例成功',
								showCancel: false,
								success: res => {
									uni.navigateBack();
								}
							});
						}
					});
			}
		},
		onLoad:function(){
			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
			this.getData();
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
	.pubedit-from .pubedit-input .inp{flex: 1;line-height: 80upx;}
	.pubedit-from .pubedit-input .inp.disabled{color: #999;}
	.pubedit-from .pubrate{background: #2CB476; color: #fff; height: 50upx; border-radius: 50upx; padding: 0 15upx; margin:15upx 0;}
	.pubedit-from .pubedit-input .inp .pic{width: 80upx; height: 80upx; position: relative; border: 2upx solid #FF0000;}
	.pubedit-from .pubedit-input .inp image{width: 80upx; height: 80upx;}
	.pubedit-from .pubedit-input .inp .pic .wwi-icon{position: absolute; top: -15upx; right: -15upx; background: #FF0000; font-size: 28upx; color: #fff; border-radius: 100upx; }
	.pubedit-from .pubedit-input .inp .select{font-size: 24upx;width: 180upx;  align-items: center;}
	.pubedit-from .pubedit-input .inp .select .wwi-icon-danxuanweixuanzhong{color: #ccc;}
	.pubedit-from .pubedit-input .inp .select .wwi-icon-danxuanxuanzhong{color: #2CB476;}
	.pubedit-from .pubedit-input .inp .sel-li{padding: 0 20upx; margin-bottom: 20upx; margin-right: 20upx; line-height: 60upx; border: 1px solid transparent; border-radius: 60upx;}
	.pubedit-from .pubedit-input .inp .sel-li.ok{border-color: #2CB476; color: #2CB476;}
	.pubedit-from .pubedit-input .inp .selec .lb{width: auto;line-height: 50upx;}
	.pubedit-from .pubedit-input .inp .selec .lp{border: 1px solid transparent; padding: 5upx 20upx; margin-right:20upx ; margin-bottom: 20upx; color: #333;}
	.pubedit-from .pubedit-input .inp .selec .lp.ck{color: #2CB476; border-color: #2CB476 ; border-radius: 20upx;}
	.pubedit-from .pubedit-input .inp .picList{border-bottom: 1px dashed #F8F8F8;}
	.pubedit-from .pubedit-input .inp .picList .sli{}
	.pubedit-from .pubedit-input .inp .picList .sli image{width: 100upx; height: 100upx; border: 1px solid #F8F8F8; margin-right: 20upx;}
	.pubedit-from .pubedit-input .inp .picList .sli .text{flex: 1; width: auto; height: 60upx;  border: 1px solid #F8F8F8; padding: 20upx; font-size: 24upx;}
	.pubedit-from .pubedit-input .inp .picList .sbtn{ color: #999; font-size: 24upx;}
	.pubedit-from .pubedit-input .inp .picList .sbtn .sbtn-li{margin-right: 20upx;}
	.pubedit-from .pubedit-input .inp .picList .sbtn .sbtn-li .wwi-icon{font-size: 40upx;}
	.pubedit-from .pubedit-input .inp .picList .sbtn .sbtn-li.ok{color: #2CB476;}
	.pubedit-from .pubedit-input .inp .addPic{padding:0 20upx; color: #ffffff; background: #2CB476; width: 150upx; line-height: 60upx; text-align: center; margin-top: 20upx;}
	.pubedit-from .pubedit-input .upload{width: 120upx; color: #2CB476;}
	.btn-area{background: #FFFFFF;padding: 20upx;}
	.btn-area .btn-s{background: #2CB476; color: #FFFFFF;}
	
</style>
