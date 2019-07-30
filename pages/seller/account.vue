<template>
	<view>
		<view class="join-from">
			<form @submit="formSubmit">
				<view class="mt10 list">
					<view style="font-weight: bold; font-size: 32upx;">上传幻灯片图片</view>
					<view style="color: #999;">最多可上传5张图片，建议宽度480px,高度290px,大小4.02M以内的图片</view>
					<view class="pic-list flex flexrow" v-for="(item,vk) in info.slide_list" :key="vk">
								<input type="text" :name="'slide_list['+vk+'][file_url]'" :value="item.file_url" style="display: none;">
								<input type="text" :name="'slide_list['+vk+'][file_name]'" :value="item.file_name" style="display: none;">
						<view class="lt"><image :src="item.file_url" mode=""></image></view>
						<view class="rt">
							<view class="s-btn" @tap="chooseImage(1,item)">图片上传</view>
							<view class="tit">图片连接</view>
							<input type="text" :name="'slide_list['+vk+'][href]'" v-model="item.href" placeholder="http://"  class="inp"  />
						</view>
					</view>
				</view>
				
				<view class="mt10 list">
					<view class="join-input flex flexrow">
						<label>店铺名称</label>
						<input type="text" name="store_name" v-model="info.store_name" placeholder="请输入店铺名称"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>店铺简介</label>
						<textarea name="store_jieshao" v-model="info.store_jieshao"  class="inp" placeholder=".." auto-height />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>服务类目<view >(可多选)</view></label>
						<view class="inp">
							<view class="selec">
								<checkbox-group name="service" @change="checkboxService" class="flex flexrow flexwrap">
									<label v-for="item in info.service_list" :key="item.id" class="lb">
										<view class="lp" :class="{'ck':item.checked}">
										<checkbox :value="item.id" :checked="item.checked"  style="display: none;"  />{{item.name}}
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
									<label v-for="item in info.tag_list" :key="item.id" class="lb">
										<view class="lp" :class="{'ck':item.checked}">
										<checkbox :value="item.id" :checked="item.checked"  style="display: none;"  />{{item.name}}
										</view>
									</label>
								</checkbox-group>
								<view class="li"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="mt10 list">
					<view class="join-input flex flexrow">
						<label>QQ</label>
						<input type="text" name="store_qq" v-model="info.store_qq" placeholder="请输入QQ"  class="inp"  />
					</view>
					<view class="join-input flex flexrow border-top">
						<label>阿里旺旺</label>
						<input type="text" name="store_ww" v-model="info.store_ww" placeholder="请输入阿里旺旺" maxlength="11" class="inp"/>
					</view>
					<view class="join-input flex flexrow border-top">
						<label>店铺电话</label>
						<input type="text" name="store_phone" v-model="info.store_phone" placeholder="请输入店铺电话"  class="inp"  />
					</view>
				</view>
				<view class="mt10 list">
					<view class="join-input flex flexrow">
						<label>SEO关键字</label>
						<input type="text" name="store_keywords" v-model="info.store_keywords" placeholder="请输入SEO关键字Q"  class="inp"  />
					</view>
					<view class="border-top join-input" style="color: #999;">用于店铺搜索引擎的优化，关键词之间请用英文逗号分隔</view>
					<view class="join-input flex flexrow border-top">
						<label>SEO描述</label>
						<input type="text" name="store_description" v-model="info.store_description" placeholder="请输入SEO描述" maxlength="11" class="inp"/>
					</view>
					<view class="border-top join-input" style="color: #999;">用于店铺搜索引擎的优化，建议120字内</view>
				</view>
				<view class="mt10 list">
					<view class="join-input flex flexrow">
						<label>店铺头像</label>
						<view class="inp">
							<view class="picList">
								<view class="sli flex flexrow">
									<image :src="info.store_avatar" mode=""></image>
									<view class="addPic" style="height: 60upx;"  @tap="chooseImage(4)">上传头像</view>
								</view>
							</view>
							
						</view>
					</view>
					<view class="join-input flex flexrow">
						<label>公司资质</label>
						<view class="inp">
							<view class="picList" v-for="(item,v) in info.zizhi_list" :key="v">
								<input type="text" :name="'zizhi_list['+v+'][file_url]'" v-model="item.file_url" style="display: none;">
								<input type="text" :name="'zizhi_list['+v+'][file_desc]'" v-model="item.file_desc" style="display: none;">
								<input type="text" :name="'zizhi_list['+v+'][file_name]'" v-model="item.file_name" style="display: none;">
								<input type="text" :name="'zizhi_list['+v+'][file_path]'" v-model="item.file_path" style="display: none;">
								<view class="sli flex flexrow">
									<image :src="item.file_url" mode=""></image>
									<textarea placeholder="请输入资质名称如:(营业执照)" v-model="item.file_desc" class="text" maxlength="140" />
								</view>
								<view class="sbtn flex flexrow">
									<view class="sbtn-li flex flexrow flexAic" @tap="delPic(1,item.file_name,v)"><view class="wwi-icon wwi-icon-shanchu"></view>删除</view>
								</view>
							</view>
							<view class="addPic"  @tap="chooseImage(2)">增加资质</view>
						</view>
					</view>
					<view class="join-input border-top flex flexrow">
						<label>公司团队</label>
						<view class="inp">
							<view class="picList" v-for="(item,v) in info.tuandui_list" :key="v">
								<input type="text" :name="'tuandui_list['+v+'][file_url]'" v-model="item.file_url" style="display: none;">
								<input type="text" :name="'tuandui_list['+v+'][file_desc]'" v-model="item.file_desc" style="display: none;">
								<input type="text" :name="'tuandui_list['+v+'][file_name]'" v-model="item.file_name" style="display: none;">
								<input type="text" :name="'tuandui_list['+v+'][file_path]'" v-model="item.file_path" style="display: none;">
								<view class="sli flex flexrow">
									<image :src="item.file_url" mode=""></image>
									<textarea placeholder="请输入成员身份,名字如:(业务经理 张三)" v-model="item.file_desc" class="text" maxlength="140" />
								</view>
								<view class="sbtn flex flexrow">
									<view class="sbtn-li flex flexrow flexAic" @tap="delPic(2,item.file_name,v)"><view class="wwi-icon wwi-icon-shanchu"></view>删除</view>
								</view>
							</view>
							<view class="addPic"  @tap="chooseImage(3)">增加成员</view>
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
					<button formType="submit" class="btn-s">保存修改</button>
				</view>
			</form>
			
		</view>
		<wwi-mask-up ref="showClass" title="选择经营类目" bottomText="确定">
			<view class="select-class flex flexrow">
            <view class="hd">
				<view class="li flex flexJcc" style="color: #999;">选择一级</view>
				<view class="li flex flexJcc" :class="{'ok':item.checked}" v-for="item in info.product_list" :key="item.id" @click="checkClassselct(1,item)">{{item.name}}</view>
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
	import wwiMaskUp from '@/components/wwi-mask-up.vue';
	export default {
		components: {
			wwiMaskUp
		},
		data() {
			return {
			key:'',
			info:{
				tuandui_list:[],
				zizhi_list:[],
				service_list:[],
				tag_list:[],
				product_list:[]
			},
			classList2:[],
			classList3:[],
			subClassSel:'',
			subClassSel2:'',
			subClassSelid:'',
			subClassSel2id:0,
			subListSel:[],
			storeAvatar:''
			
			};
		},
		methods:{
			loadData:function(){
				this.wwiopt({
					url: '/index.php?app=seller_store&wwi=storeinfo',
					data: {key:this.key},
					success: res => {
						this.checksellerLogin(res.data.login);
						this.info = res.data.datas.store_info;
					}
				});
			},
			checkboxService:function(e){
				var items = this.info.service_list,
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
				var items = this.info.tag_list,
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
					var items = this.info.product_list;
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
								url: '/index.php?app=seller_store&wwi=search_productinfo',
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
								url: '/index.php?app=seller_store&wwi=search_productinfo',
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
			chooseImage:function(e,item){
				var _this = this;
				if(e==1){
					uni.chooseImage({
						count:1,
						success: (res) => {
							var imageSrc = res.tempFilePaths[0];
							uni.uploadFile({
								url: _this.ApiUrl + '/index.php?app=seller_store&wwi=silde_image_upload',
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
									item.file_name = obj.datas.file_name;
									item.file_url = obj.datas.file_url;
								}
							});
						}
					})
				}else if(e==2){
					uni.chooseImage({
						count:1,
						success: (res) => {
							var imageSrc = res.tempFilePaths[0];
							uni.uploadFile({
								url: _this.ApiUrl + '/index.php?app=seller_store&wwi=gczizhi_upload',
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
									_this.info.zizhi_list.push({
										file_name: obj.datas.file_name,
										file_desc: '',
										file_url:  obj.datas.file_url,
										file_path:  obj.datas.file_path
									});
								}
							});
						}
					})
				}else if(e==3){
					uni.chooseImage({
						count:1,
						success: (res) => {
							var imageSrc = res.tempFilePaths[0];
							uni.uploadFile({
								url: _this.ApiUrl + '/index.php?app=seller_store&wwi=tuandui_upload',
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
									_this.info.tuandui_list.push({
										file_name: obj.datas.file_name,
										file_desc: '',
										file_url:  obj.datas.file_url,
										file_path:  obj.datas.file_path
									});
								}
							});
						}
					})
				}else if(e==4){
					uni.chooseImage({
						count:1,
						success: (res) => {
							this.storeAvatar = res.tempFilePaths[0];
							this.info.store_avatar =  res.tempFilePaths[0];
						}
					})
				}
			},
			delPic:function(e,name,index){
				if(e==1){
					this.wwiopt({
						url: '/index.php?app=seller_store&wwi=zizhi_delete',
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
							this.info.zizhi_list.splice(index, 1);
						}
					});
				}else if(e==2){
					this.wwiopt({
						url: '/index.php?app=seller_store&wwi=tuandui_delete',
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
							this.info.tuandui_list.splice(index, 1);
						}
					});
				}
			},
			formSubmit:function(e){
				var _this = this;
				var parem = {};
				    parem = e.detail.value;
					parem.key = this.key;
					parem.tag = parem.tag.join(',');
					parem.service = parem.service.join(',');
					parem.store_class = '';
					parem.store_class_name = '';
					for(let j = 0; j < _this.subListSel.length; j ++){
						var ggId = _this.subListSel[j].tid+','+_this.subListSel[j].subid+','+_this.subListSel[j].id;
						var ggIdname = _this.subListSel[j].tname+','+_this.subListSel[j].subname+','+_this.subListSel[j].title;
							parem.store_class += ggId+'|';
							parem.store_class_name += ggIdname+'|';
					}
					if(this.storeAvatar){
						uni.uploadFile({
							url: _this.ApiUrl+'/index.php?app=seller_store&wwi=store_edit',
							filePath: this.storeAvatar,
							name: 'store_avatar',
							formData:parem,
							success: res => {
							if(res.data.datas==1){
								uni.showModal({
								title: '提示',
								content: '修改店铺资料成功',
								showCancel: false,
								confirmText: '好的',
								success: res => {
									_this.loadData();
								}
							});
								return false;
							}else{
								uni.showModal({
									title: '提示',
									content: res.data.datas.error,
									showCancel: false,
									confirmText: '我知道了',
								});
							}

							},
						fail: (err) => {
							console.log('chooseImage fail', err)
						},
						});
					}else{
						this.wwiopt({
							url: "/index.php?app=seller_store&wwi=store_edit",
							method: 'POST',
							data: parem,
							success: res => {
								if(res.data.datas.error){
									uni.showModal({
										title: '提示',
										content: res.data.datas.error,
										showCancel: false,
										confirmText: '我知道了',
									});
									return false;
								}
								uni.showModal({
									title: '提示',
									content: '修改店铺资料成功',
									showCancel: false,
									confirmText: '好的',
									success: res => {
										_this.loadData();
									}
								});
								},
						});
					}
			}
		},
		onLoad:function(e){
			this.key= uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
			this.loadData();
		},
		onShow:function(){
			this.key= uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
		},
	}
</script>

<style>
page{background: #F8F8F8;}
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
	.join-from .join-input .inp .picList{border-bottom: 1px dashed #F8F8F8;}
	.join-from .join-input .inp .picList .sli{}
	.join-from .join-input .inp .picList .sli image{width: 100upx; height: 100upx; border: 1px solid #F8F8F8; margin-right: 20upx;}
	.join-from .join-input .inp .picList .sli .text{flex: 1; width: auto; height: 60upx;  border: 1px solid #F8F8F8; padding: 20upx; font-size: 24upx;}
	.join-from .join-input .inp .picList .sbtn{ color: #999; font-size: 24upx;}
	.join-from .join-input .inp .picList .sbtn .sbtn-li{margin-right: 20upx;}
	.join-from .join-input .inp .picList .sbtn .sbtn-li .wwi-icon{font-size: 40upx;}
	.join-from .join-input .inp .picList .sbtn .sbtn-li.ok{color: #2CB476;}
	.join-from .join-input .inp .addPic{padding:0 20upx; color: #ffffff; background: #2CB476; width: 150upx; line-height: 60upx; text-align: center; margin-top: 20upx;}
	.pic-list .lt image{width: 280upx; height: 210upx; margin-right: 15upx;}
	.pic-list .rt .s-btn{background: #2CB476; color: #fff; height: 60upx; width: 180upx; text-align: center; line-height: 60upx;}
	.pic-list .rt .inp{border: 1px solid #ccc; padding: 10upx;}
</style>
