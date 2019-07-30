<template>
	<view>
		<view class="wwiapp-order-item mt5">
			<view class="wwiapp-order-item-head">
				<navigator :url="'/pages/web/store?storeid='+info.order.store_id" class="store">
					<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{info.order.store_name}}</text>
				</navigator>
			</view>
			<view class="wwiapp-order-item-con">
				<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="goods-block" v-for="(item,index) in info.goods_list" :key="index">
					<image :src="item.goods_img_360" class="goods-pic"></image>
					<view class="goods-info">
						<view class="goods-name">{{item.goods_name}}</view>
						<view class="goods-type" v-if="item.goods_spec!=null">{{item.goods_spec}}</view>
					</view>
					<view class="goods-subtotal">
						<view class="goods-price">
							<view>￥</view><text class="em">{{item.goods_price}}</text>
						</view>
						<text class="goods-num">x{{item.goods_num}}</text>
					</view>
				</navigator>
							<view class="goods-gift" v-if="info.gift_list.length > 0">
								<view class="em">赠品</view>
								<view class="span">
									<view class="p wwi-ellipsis" v-for="(zp,key) in info.gift_list" :key="key">{{zp.goods_name}} x {{zp.goods_num}}</view>
								</view>
							</view>
			</view>
		</view>
		<view class="special-tips">
			<view class="p">特别提示：退款凭证选择直接拍照或从手机相册上传图片时，请注意图片尺寸控制在1M以内，超出请压缩裁剪后再选择上传！</view>
		</view>
		<form @submit="nextGo">
		<view class="input-group mt10">
			<view class="input-row border">
				<text class="title">退款原因</text>
				<view class="picker">
						<view class="input">取消订单，全部退款</view>
				</view>
			</view>
			<view class="input-row border">
				<text class="title">退款金额</text>
				<input class="code" type="text" pattern="[0-9.]*" :value="amount" readonly="readonly">
			</view>
			<view class="input-row border">
				<text class="title">退款说明</text>
				<input type="text" v-model="message" placeholder="输入您要退款的说明文字">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico" v-if="message.length > 0" @click="message=''"></view>
			</view>
			<view class="input-row border">
				<text class="title">退款凭证</text>
				<view class="wwiapp-upload">
					<view class="uploadImg" v-for="(item,index2) in img" :key="index2">
						<block v-if="item.pic">
							<image :src="item.pic" class="image" mode="aspectFit"></image>
						</block>
						<block v-else>
							<view class="image-plus image-plus-nb" @tap="chooseImage(index2)">
								<view class="image-plus-horizontal"></view>
								<view class="image-plus-vertical"></view>
							</view>
						</block>
						<input :name="'refund_pic['+index2+']'" :value="item.file_name" style="display: none;" />
					</view>
				</view>
			</view>
			<view class="btn-row">
				<button type="primary" class="primary" formType="submit">提交</button>
			</view>
			</view>
		</form>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				key: '',
				message: '',
				img: [{}, {}, {}],
				info: {
					order:{},
					goods_list:[{}],
					gift_list:[{}]
				},
				amount: '',
				orderId: 0
			};
		},
		methods: {
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=member_refund&wwi=refund_all_form',
					data: {
						key: this.key,
						order_id: this.orderId
					},
					success: res => {
						this.checkLogin(res.data.login);
						this.info = res.data.datas;
						this.amount = res.data.datas.order.allow_refund_amount;
					}
				});
			},
			chooseImage: function(e) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: (res) => {
						var imageSrc = res.tempFilePaths[0];
						uni.uploadFile({
							url: this.ApiUrl + '/index.php?app=member_refund&wwi=upload_pic',
							filePath: imageSrc,
							name: 'refund_pic',
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
								this.img.splice(e, 1 , obj.datas);
							}
						});
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
					}
				})
			},
			nextGo: function (e) {
				if (this.message.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请填写退款说明'
					});
					return;
				}
            var param = {};
			var	param = e.detail.value;
                param.key = this.key;
                param.order_id = this.orderId;
				param.buyer_message = this.message;
				this.wwiopt({
					url: "/index.php?app=member_refund&wwi=refund_all_post",
					method: 'POST',
					data: param,
					success: res => {
						if (res.data.datas.error) {
							uni.showToast({
								icon: 'none',
								title: res.data.datas.error
							});
							return;
						}
						uni.redirectTo({
							url: '/pages/my/tuihuan?id=refund'
						});

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
	.input-row .title {width: 200upx;}
	.input-row input {	width: 470upx;}
	.input-row input.code {	width: 260upx;}
	.note{display: flex; flex: 1; flex-direction: column; margin-right: 20upx; justify-content: flex-end; align-items: flex-end;}
	.note .em{font-size: 28upx; font-weight: 600; color: #36BC9B;}
	.note .span{font-size: 24upx;color: #999;}
	.picker{flex: 1;align-items: center; display: flex; font-size: 28upx;}
	.picker .input{flex: 1; width: 100%;}
	.wwiapp-upload{flex: 1; display: flex; flex-direction: row; margin: 20upx 0;}
	.wwiapp-upload .uploadImg{border: 2upx solid #ddd; margin-right: 10upx;}
	.wwiapp-upload .uploadImg .image-plus,.wwiapp-upload .uploadImg .image{width: 100upx; height: 100upx;}
</style>
