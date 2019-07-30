<template>
	<view>
	<view class="special-tips">
		<view class="p">特别提示：评价晒图选择直接拍照或从手机相册上传图片时，请注意图片尺寸控制在1M以内，超出请压缩裁剪后再选择上传！</view>
	</view>
	<form @submit="fromSubmit">
		<view class="wwiapp-evaluation-goods">
			<view class="li" v-for="(item,index) in infoDatas.evaluate_goods">
				<view class="evaluation-info">
					<view class="goods-pic"><image :src="item.geval_goodsimage"></image></view>
					<view class="goods-info">
						<view class="goods-name">{{item.geval_goodsname}}</view>
						<view class="goods-rate">{{item.geval_content}}</view>
						</view>
				</view>
				<view class="evaluation-inp-block">
					<input type="text" :name="'goods['+item.geval_id+'][comment]'" placeholder="亲，写点什么吧，您的意见对其他买家有很大帮助！"/>
				</view>
				<view class="evaluation-upload-block">
					<view class="em"><view class="wwi-icon wwi-icon-tupianshangchuan"></view><view class="span">晒图</view></view>
					<view class="uploadImg" v-for="(pic,index2) in item.newPic" :key="index2">
						<block v-if="pic.file_url">
							<image :src="pic.file_url" class="image" mode="aspectFit"></image>
						</block>
						<block v-else>
							<view class="image-plus image-plus-nb" @tap="chooseImage(index,index2)">
								<view class="image-plus-horizontal"></view>
								<view class="image-plus-vertical"></view>
							</view>
						</block>
						<input :name="'goods['+item.geval_id+'][evaluate_image]['+index2+']'" :value="item.file_name" style="display: none;" />
					</view>
				</view>
			</view>
		</view>

		<view class="btn-row">
			<button type="primary" class="primary" formType="submit">提交</button>
		</view>
	</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId:'',
				key: '',
				infoDatas:[]
			}
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: '/index.php?app=member_evaluate&wwi=again',
					data: {key:this.key,order_id:this.orderId},
					success: res => {
						if(res.data.datas.error){
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
							return false;
						}
						
						res.data.datas.evaluate_goods.forEach(item => {
								var newPic =[{'file_id':''},{'file_id':''},{'file_id':''},{'file_id':''},{'file_id':''}];
								this.$set(item, 'newPic', newPic);
						    });
						this.infoDatas = res.data.datas;
					}
				});
				
			},
			chooseImage: function(e,ee) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						var imageSrc = res.tempFilePaths[0];
						const uploadTask = uni.uploadFile({
							url: this.ApiUrl + '/index.php?app=sns_album&wwi=file_upload',
							filePath: imageSrc,
							name: 'file',
							formData: {
								'key': this.key
							},
							success: (res) => {
								var obj = JSON.parse(res.data);
								if (obj.datas.err) {
									uni.showToast({
										title: '上传失败',
										icon: 'noen'
									});
									return false;
								}
								//file_idfile_namefile_urlorigin_file_name
								this.infoDatas.evaluate_goods[e].newPic.splice(ee, 1 , obj.datas);
							}
						});
						uploadTask.onProgressUpdate((res) => {
							uni.showToast({
								title: '上传进度' + res.progress,icon:"none"
							});
						});

					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			fromSubmit:function(e){
				var param = {};
				var	param = e.detail.value;
				    param.key = this.key;
				    param.order_id = this.orderId;
				this.wwiopt({
					url: '/index.php?app=member_evaluate&wwi=save_again',
					method: 'POST',
					data: param,
					success: res => {
					this.checkLogin(res.data.login);
                    if (res.data.datas.error) {
						uni.showToast({ title: res.data.datas.error,icon:"none" });
                        return false;
                    }
					uni.navigateBack();
					}
				});
			}
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			if (e.oid) {
				this.orderId = e.oid;
				this.Inlimine();
			} else {
				uni.showToast({
					title: '数据错误,请返回',
					icon: 'none',
					complete() {
						uni.navigateBack()
					}
				});
			}
		},
		onShow: function() {
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
 page{background: #f8f8f8;}
 .special-tips{padding: 20upx 50upx;}
 .special-tips .p{font-size: 28upx;padding: 10upx 20upx;background: #AAA;color: #FFF;border-radius: 20upx;}
.wwiapp-evaluation-goods {}
.wwiapp-evaluation-goods .li {padding: 20upx; background-color: #FFF; border-bottom: solid 2upx #EEE; margin-bottom: 10upx;display: flex; flex-direction: column; }
.evaluation-info {display: flex; flex-direction: row; padding: 14upx 0;}
.evaluation-info .goods-pic { width: 150upx; height: 150upx;}
.evaluation-info .goods-pic image { width: 100%; height: 100%;}
.evaluation-info .goods-info { flex: 1; margin-left: 20upx;}
.evaluation-info .goods-info .goods-name {  height: 70upx; font-size: 28upx;line-height: 35upx; overflow: hidden; margin-bottom: 20upx; color: #333;}
.evaluation-info .goods-info .goods-rate {font-size: 25upx; color: #888; display: flex; flex-direction: row; align-items: center;}
.evaluation-info .goods-info .goods-rate .wwi-icon-star-full{color: #FF0036;}
.evaluation-info .star-level { display: inline-block; vertical-align: top; font-weight: 0; margin-left: 0.2rem;}
.evaluation-info .star-level i { display: inline-block; vertical-align: top; width: 0.75rem; height: 0.75rem; background-repeat: no-repeat; background-position: 50% 50%; background-size: 90%;}
.evaluation-inp-block { margin: 0 0 0.4rem 0; display: flex; flex-direction: row;}
.evaluation-inp-block input[type="text"] { flex: 1; height: 60upx; padding: 10upx; background-color: #F5F5F5; border: none; border-radius: 15upx; font-size: 26upx; line-height: 36upx; resize:none}
.wwiapp-evaluation-store { background-color: #FFF; padding: 0.5rem;}
.wwiapp-evaluation-store dl { position: relative; z-index: 1; display: block; height: 1.6rem;}
.wwiapp-evaluation-store dt { position: absolute; z-index: 1; top: 0.4rem; left: 2rem; display: block; width: 3rem; height: 0.9rem; font-size: 0.7rem; line-height: 0.9rem;}
.wwiapp-evaluation-store dd { display: block; margin: 0 0 0 6rem; padding-top: 0.4rem; height: 0.9rem;}
.wwiapp-evaluation-store .star-level { display: inline-block; vertical-align: top; font-weight: 0; margin-left: 0.2rem;}
.evaluation-upload-block{display: flex; flex-direction: row; width: 100%;}
.evaluation-upload-block .em{display: flex; flex-direction: column; width: 100upx; align-items: center;color: #888;}
.evaluation-upload-block .em .span{}
.evaluation-upload-block .uploadImg{border: 2upx solid #ddd; margin-right: 10upx;}
.evaluation-upload-block .uploadImg .image-plus,.evaluation-upload-block .uploadImg .image{width: 100upx; height: 100upx;}

</style>
