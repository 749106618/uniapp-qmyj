<template>
	<view class="">
		<form @submit="submitGoods">
			<block v-if="sgogo=='2'">
			<view class="class-nav flex flexrow  animation-slide-right"><view class="step flex flexJcc flexAic" :class="{'now':selctClass.deep==0}" @click="selNav('0')">{{selctClass.gc_name1}}</view><view class="step flex flexJcc flexAic" :class="{'now':selctClass.deep==1}" @click="selNav('1')">{{selctClass.gc_name2}}</view><view class="step flex flexJcc flexAic" :class="{'now':selctClass.deep==2}" @click="selNav('2')">{{selctClass.gc_name3}}</view></view>
			<view class="class-select animation-slide-right">
				<view class="cu-btn round item" :class="{'line-cyan shadow':item.gc_id==selctClass.gc_id}" v-for="(item,index) in gc_class" :key="index" @click="selClass(item.gc_id,item.gc_name)">{{item.gc_name}}</view>
			</view>
			</block>
			<block v-if="sgogo=='1'">
			<view class="goods-form animation-slide-left">
			<view class="goods-input-one flex flexrow" style="background: #FFFFFF; padding: 20upx;" @tap="chickClass">
				<view class="title" style="margin-right: 20upx;">商品分类</view>
				<view class="input">{{selctClass.gc_info}}</view>
				<input type="text" :value="selctClass.gc_id" name="cate_id" style="display: none;" />
				<input type="text" :value="selctClass.gc_info" name="cate_name" style="display: none;" />
			</view>
			<view class="goods-input-one">
				<view class="title">*商品名称</view>
				<view class="input"><input type="text" name="g_name" :value="info.goodscommon_info.goods_name" maxlength="50" placeholder="请输入商品名称(50字内)" /></view>
			</view>
			<view class="goods-input-one">
				<view class="title">商品卖点</view>
				<view class="input"><textarea placeholder="输入商品卖点(140字内)" auto-height maxlength="140" name="g_jingle" :value="info.goodscommon_info.goods_jingle" /></view>
			</view>
			<view class="flex flexrow">
			<view class="goods-input-one">
				<view class="title">*商品价格</view>
				<view class="input"><input type="number" @input="changeGprice($event,1)" v-model="info.goodscommon_info.goods_price" name="g_price" :value="info.goodscommon_info.goods_price" maxlength="50" placeholder="0.00" /></view>
			</view>
			<view class="goods-input-one" style="margin-left: 20upx;">
				<view class="title">*市场价</view>
				<view class="input"><input type="number" @input="changeGprice($event,2)" v-model="info.goodscommon_info.goods_marketprice" name="g_marketprice" :value="info.goodscommon_info.goods_marketprice" maxlength="10" placeholder="0.00" /></view>
			</view>
			</view>
			<view class="flex flexrow">
			<view class="goods-input-one">
				<view class="title">成本价</view>
				<view class="input"><input type="number" name="g_costprice" :value="info.goodscommon_info.goods_costprice" maxlength="10" placeholder="0.00" /></view>
			</view>
			<view class="goods-input-one" style="margin-left: 20upx;">
				<view class="title">折扣</view>
				<view class="input flex flexrow flexAic" style=" background: #dcdcdc; padding-right: 10upx;"><input type="number" name="g_discount" disabled :value="info.goodscommon_info.goods_discount" v-model="info.goodscommon_info.goods_discount" maxlength="10" placeholder="0.00" />%</view>
			</view>
			</view>
			<view class="flex flexrow">
			<view class="goods-input-one">
				<view class="title">*商品库存</view>
				<view class="input"><input type="number" name="g_storage" :value="info.goodscommon_info.g_storage" maxlength="50" placeholder="0" /></view>
			</view>
			<view class="goods-input-one" style="margin-left: 20upx;">
				<view class="title">库存预警值</view>
				<view class="input"><input type="number" name="g_alarm" :value="info.goodscommon_info.goods_storage_alarm" maxlength="10" placeholder="0" /></view>
			</view>
			</view>
			<view class="flex flexrow">
			<view class="goods-input-one">
				<view class="title">商家货号</view>
				<view class="input"><input type="text" name="g_serial" :value="info.goodscommon_info.goods_serial" maxlength="20" placeholder="商家货号" /></view>
			</view>
			<view class="goods-input-one" style="margin-left: 20upx;">
				<view class="title">商品条形码</view>
				<view class="input"><input type="text" name="g_barcode" :value="info.goodscommon_info.goods_barcode" maxlength="20" placeholder="商品条形码" /></view>
			</view>
			</view>
			<view class="goods-input-one mt10 flex flexrow flexJcs" style="background: #FFFFFF; padding: 20upx;">
				<view class="title">商品图片</view>
				<view class="input">{{imgList.length}}/5</view>
			</view>
			<view class="goods-input-one flex flexrow flexJcs" style="background: #FFFFFF; padding: 20upx;">
				<view class="g-img flex">
					<view class="bg-img" :style="'background-image:url(' + item.url +')'" v-for="(item,index) in imgList"
					 :key="index" @tap="ViewImage" :data-url="item.url">
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='wwi-icon wwi-icon-guanbi'></text>
						</view>
					</view>
					<view class="solids flex flexJcc flexAic" @tap="ChooseImage"  v-if="imgList.length<5">
						<text class='wwi-icon wwi-icon-tupianshangchuan'></text>
					</view>
				</view>
			</view>
			<view class="goods-input-one">
				<view class="title">商品详情</view>
				<view class="input"><textarea placeholder="输入商品详情" auto-height maxlength="14000" name="g_body" :value="info.goodscommon_info.goods_body" /></view>
			</view>
			<view class="goods-input-one">
				<view class="title">物流费用</view>
				<view class="input"><input type="number" name="g_freight" :value="info.goodscommon_info.goods_freight" maxlength="10" placeholder="0" /></view>
			</view>
			
			<view class="goods-input-one flex flexrow mt5" style="background: #FFFFFF; padding: 20upx;">
				<view class="title" style="margin-right: 20upx;">商品发布</view>
				<view class="input"><radio-group name="g_state">
				<label style="margin-right: 20upx;"><radio value="1" checked/>立即发布</label>
				<label><radio value="0"/>放入仓库</label></radio-group>
			</view>
			</view>
			<view class="goods-input-one flex flexrow" style="background: #FFFFFF; padding: 20upx;">
				<view class="title" style="margin-right: 20upx;">商品推荐</view>
				<view class="input"><radio-group name="g_commend">
				<label style="margin-right: 20upx;"><radio value="1"/>是</label>
				<label><radio value="0" checked/>否</label></radio-group>
			</view>
			</view>
			</view>
			<view class="btn-area">
				<button formType="submit" type="primary" class="wwibtn">提交商品</button>
			</view>
			</block>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			key:'',
			goodsid:'',
			info:{
				goodscommon_info:{
					goods_name:'',
					goods_jingle:'',
					goods_price:0.00,
					goods_marketprice:0.00,
					goods_costprice:0.00,
					goods_discount:0,
					g_storage:0,
					goods_storage_alarm:0,
					goods_freight:0,
					brand_id:0,
					brand_name:''
				}
			},
			gc_class:[],
			selctClass:{
				deep:0,
				gc_id1:0,
				gc_id2:0,
				gc_id3:0,
				gc_name1:'一级分类',
				gc_name2:'二级分类',
				gc_name3:'三级分类',
				gc_id:'',
				gc_name:'',
				gc_info:''
			},
			imgList:[],
			sgogo:1
			};
		},
		methods:{
			chickClass:function(){
					this.selctClass={
						deep:0,
						gc_id1:0,
						gc_id2:0,
						gc_id3:0,
						gc_name1:'一级分类',
						gc_name2:'二级分类',
						gc_name3:'三级分类',
						gc_id:'',
						gc_name:'',
						gc_info:''
					}
				  this.selClass(0);
				  this.sgogo =2;
				  console.log(this.sgogo);
			},
			selClass:function(id,name,g){
				var gcId = 0;
				if(id && name){
					if(this.selctClass.deep=='0'){
						this.selctClass.gc_id1 = id;
						this.selctClass.gc_name1 = name;
						this.selctClass.gc_info += name +'>';
					}else if(this.selctClass.deep=='1'){
						this.selctClass.gc_id2 = id;
						this.selctClass.gc_name2 = name;
						this.selctClass.gc_info += name +'>';
					}else if(this.selctClass.deep=='2'){
						this.selctClass.gc_id3 = id;
						this.selctClass.gc_name3 = name;
						this.selctClass.gc_info += name;
					}
					this.selctClass.deep +=1;
					this.selctClass.gc_id = id;
					this.selctClass.gc_name = name;	
					gcId = id;
				}
				if(this.selctClass.deep > 2){
					this.sgogo = 1;
					return false;
				}
				this.wwiopt({
					url: '/index.php?app=seller_goods_class&wwi=class_list',
					method: 'POST',
					data: {gc_id:gcId,deep:this.selctClass.deep,client:'mobile',key:this.key},
					success: res => {
						if(res.data.datas.class_list.length == 0){
							this.sgogo = 1;
							 return false;
						}
						this.gc_class = res.data.datas.class_list;
					}
				});
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						var imageSrc = res.tempFilePaths[0];
						const uploadTask = uni.uploadFile({
							url: this.ApiUrl + '/index.php?app=seller_album&wwi=image_upload2',
							filePath: imageSrc,
							name: 'file',
							formData: {
								'key': this.key,
								name:'file'
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
								this.imgList.push({
									'name':obj.datas.name,
									'url':obj.datas.thumb_name
								});
							}
						});
						uploadTask.onProgressUpdate((res) => {
							uni.showToast({
								title: '上传进度' + res.progress,icon:"none"
							});
						});
						
						console.log(this.imgList);
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '召唤师',
					content: '确定要删除这段回忆吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			selNav:function(e){
				if(e=='0' && this.selctClass.deep > '0'){
					this.selctClass={
						deep:0,
						gc_id1:0,
						gc_id2:0,
						gc_id3:0,
						gc_name1:'一级分类',
						gc_name2:'二级分类',
						gc_name3:'三级分类',
						gc_id:'',
						gc_name:'',
						gc_info:''
					}
					this.selClass(0);
				}else if(e=='1' && this.selctClass.deep > '1'){
					this.selctClass.deep = 0;
					this.selctClass.gc_id2 = 0;
					this.selctClass.gc_id2 = 0;
					this.selctClass.gc_name2 = '二级分类';
					this.selctClass.gc_name3 = '三级分类';
					this.selctClass.gc_name = this.selctClass.gc_name1;
					this.selctClass.gc_id = this.selctClass.gc_id1;
					this.selctClass.gc_info = '';
					this.selClass(this.selctClass.gc_id1,this.selctClass.gc_name1);
				}
			},
			getGoodsinfo:function(){
				this.wwiopt({
					url: '/index.php?app=seller_goods&wwi=goods_info',
					method: 'POST',
					data: {key:this.key,goods_commonid:this.goodsid},
					success: res => {
						if(res.data.datas.error){
							uni.showModal({
								title: '提示',
								content: res.data.datas.error,
								showCancel: false,
								success: res => {
									uni.navigateBack();
								}
							});
							return false;
						}
						this.info =res.data.datas;
						this.selctClass.gc_id = res.data.datas.goodscommon_info.gc_id;
						var cat_name=res.data.datas.goodscommon_info.gc_name.replace(new RegExp("&amp;gt;","g"),">");
                        this.selctClass.gc_info = cat_name.replace(new RegExp("&gt;","g"),">");
					}
				});
			},
			getGoodsImg:function(){
				this.wwiopt({
					url: '/index.php?app=seller_goods&wwi=goods_image_info',
					method: 'POST',
					data: {key:this.key,goods_commonid:this.goodsid},
					success: res => {
						var imgnow = res.data.datas.image_list[0].images;
						    imgnow.forEach(item=>{
								this.imgList.push({
									'name':item.goods_image,
									'url':item.goods_image_url
								})
							})
						console.log(res)
					}
				});
			},
			changeGprice:function(e,g){
				var _price = parseInt(this.info.goodscommon_info.goods_price);
				var _marketprice = parseInt(this.info.goodscommon_info.goods_marketprice);
				if(g==1){
					_price = event.target.value;
				}else{
					_marketprice = event.target.value;
				}
// 				if(_price > _marketprice){
// 					uni.showModal({
// 						content: '商品价格不得大于市场价格',
// 						showCancel: false
// 					});
// 					return false;
// 				}
				this.info.goodscommon_info.goods_discount = parseInt(_price/_marketprice*100);
			},
			submitGoods:function(e){
				if(this.imgList.length < 1){
					uni.showModal({
						content: '至少上传一张主图',
						showCancel: false
					});
					return false;
				}
				var rurl  = '/index.php?app=seller_goods&wwi=goods_add';
				var imgurl = [];
				    this.imgList.forEach((item,index)=>{
						imgurl[index]=item.name;
					})
				var parem = {};
				    parem = e.mp.detail.value;
				    parem.attr = '';
					parem.custom = '';
					parem.m_body = e.mp.detail.value.g_body;
					parem.province_id = 0;
					parem.city_id = 0;
					parem.freight = 0;
					parem.transport_title = '';
					parem.sgcate_id = '';
					parem.plate_top = 0;
					parem.plate_bottom = 0;
					parem.g_vat=0;
					parem.is_gv=0;
					parem.g_vlimit=0;
					parem.g_vinvalidrefund=0;
					parem.sup_id=0;
					parem.type_id='';
					parem.key = this.key;
					parem.b_id=0;
					parem.b_name='';
					parem.image_path=this.imgList[0].name;
					parem.starttime='2017-03-27';
					parem.starttime_H='00';
					parem.starttime_i='05';
					parem.goods_sel_type = 'single';
					parem.image_all=imgurl.toString();
					if(this.goodsid){
						parem.commonid= this.goodsid;
						rurl = '/index.php?app=seller_goods&wwi=goods_edit';
					}

				
				if(parem.g_name.length < 3){
					uni.showModal({
						content: '商品名称至少需要输入三个字',
						showCancel: false
					});
					return false;
				}
				if(Number(parem.g_price) < 0.01 || Number(parem.g_marketprice) < 0.01 || Number(parem.g_price) > Number(parem.g_marketprice)){
					uni.showModal({
						content: '商品价格需小于或等于市场价，且都不得小于0.01',
						showCancel: false
					});
					return false;
				}
				this.wwiopt({
					url: rurl,
					method: 'POST',
					data: parem,
					success: res => {
						if(res.data.datas.error){
							uni.showModal({
								content: res.data.datas.error,
								showCancel: false
							});
							return false;
						}
						uni.showModal({
							content: '商品操作成功',
							showCancel: false,
							success: res => {
								uni.navigateBack();
							}
						});
					}
				});
			}
		},
		onLoad:function(e){

			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				this.checksellerLogin(0);
			}
			if(e.goodsid){
				this.goodsid = e.goodsid;
				this.getGoodsinfo();
				this.getGoodsImg();
			}
		},
		onShow:function(){
			this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				this.checksellerLogin(0);
			}
		}
		}
</script>

<style>
page{background: #F8F8F8;}
.goods-form{padding: 20upx; font-size: 28upx;}
.goods-form .goods-input-one{flex: 1;}
.goods-form .goods-input-one .title{font-size: 30upx;}
.goods-form .goods-input-one .input{background: #FFFFFF;}
.goods-form .goods-input-one .input input{padding: 10upx 20upx;}
.goods-form .goods-input-one .input input:disabled{background: #F8F8F8;}
.goods-form .goods-input-one .input textarea{line-height: 40upx; padding: 20upx; width: auto;}
.class-nav{background: #FFFFFF; height: 88upx;}
.class-nav .step{flex: 1; position: relative; font-size: 28upx;}
.class-nav .step.now{color: #00bcd4}
.class-nav .step.now:after{content: '';font-family:"wwi-icon"; height: 4upx; background: #00bcd4; width: 50%; position: absolute; bottom: 0;}
.class-select{background: #FFFFFF; padding: 20upx;}
.class-select .item{margin-right: 20upx; margin-bottom: 20upx;}
.g-img .solids{width: 118upx; height: 118upx; border: 4upx solid #eee;}
.g-img .solids .wwi-icon{font-size: 88upx; color: var(--grey);}
.g-img .bg-img {background-size: cover;background-position: center;background-repeat: no-repeat; width: 118upx; height: 118upx; margin-right: 20upx; position: relative;}
.g-img .bg-img:last-child{margin-right: 0;}
.g-img .bg-img .cu-tag {position: absolute;right: 0;top: 0;border-bottom-left-radius: 3upx;padding: 6upx 12upx;height: auto;background-color: rgba(0, 0, 0, 0.5); }
.g-img .bg-img .cu-tag .wwi-icon{font-size: 24upx;}
</style>
