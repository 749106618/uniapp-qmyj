<template>
	<view>
		<view class="wwiapp-order-item mt5">
			<view class="wwiapp-order-item-head">
				<navigator :url="'/pages/web/store?storeid='+info.order.store_id" class="store">
					<view class="wwi-icon wwi-icon-dianpu"></view><text class="em">{{info.order.store_name}}</text>
				</navigator>
			</view>
			<view class="wwiapp-order-item-con">
				<navigator :url="'/pages/web/item?goodsid='+info.goods.goods_id" class="goods-block">
					<image :src="info.goods.goods_img_360" class="goods-pic"></image>
					<view class="goods-info">
						<view class="goods-name">{{info.goods.goods_name}}</view>
						<view class="goods-type" v-if="info.goods.goods_spec!=null">{{info.goods.goods_spec}}</view>
					</view>
					<view class="goods-subtotal">
						<view class="goods-price">
							<view>￥</view><text class="em">{{info.goods.goods_price}}</text>
						</view>
						<text class="goods-num">x{{info.goods.goods_num}}</text>
					</view>
				</navigator>
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
					<picker @change="bindPickerChange" :value="index" :range="info.reason_list" range-key="reason_info" v-if="info.reason_list.length">
						<view class="input">{{info.reason_list[index].reason_info}}</view>
					</picker>
				</view>
			</view>
			<view class="input-row border">
				<text class="title">退款金额</text>
				<input class="code" type="text" pattern="[0-9.]*" v-model="amount" placeholder="退款金额不能超过可退金额">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="amount.length > 0" @click="amount=''"></view>
				<view class="note">
					<view class="em">￥{{info.goods.goods_pay_price}}</view>
					<view class="span">最多可退金额</view>
				</view>
			</view>
			<view class="input-row border">
				<text class="title">退货数量</text>
				<input class="code" type="number" pattern="[0-9.]*" v-model="num" placeholder="退货数量不能超过可退数量">
				<view class="wwi-icon wwi-icon-anniu_guanbi ico-code" v-if="num.length > 0" @click="num=''"></view>
				<view class="note">
					<view class="em">最多{{info.goods.goods_num}}件</view>
					<view class="span">最多可退数量</view>
				</view>
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
				index: 0,
				message: '',
				img: [{}, {}, {}],
				info: {
					order:{},
					goods:{},
					reason_list:[]
				},
				amount: '',
				num:'',
				orderId: 0,
				orderGid: 0
			};
		},
		methods: {
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=member_refund&wwi=refund_form',
					data: {
						key: this.key,
						order_id: this.orderId,
						order_goods_id: this.orderGid
					},
					success: res => {
						this.checkLogin(res.data.login);
						this.info = res.data.datas;
						this.amount = res.data.datas.goods.goods_pay_price;
						this.num = res.data.datas.goods.goods_num;
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
				if (parseFloat(this.amount) > parseFloat(this.info.goods.goods_pay_price) || isNaN(parseFloat(this.amount)) ||
					parseFloat(this.amount) == 0) {
					uni.showToast({
						icon: 'none',
						title: '退款金额不能为空，或不能超过可退金额'
					});
					return;
				}
            if (isNaN(this.num) || parseInt(this.num) == 0 || parseInt(this.num) > parseInt(this.info.goods.goods_num)) {
					uni.showToast({
						icon: 'none',
						title: '退款数量不能为空，或不能超过可退数量'
					});
					return;
            }
				if (this.message.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请填写退款说明'
					});
					return;
				}
				var reason_id = this.info.reason_list[this.index].reason_id;
				var param = {};
				var	param = e.detail.value;
				    param.key = this.key;
				    param.order_id = this.orderId;
					param.order_goods_id = this.orderGid;
					param.refund_type = 2;
					param.reason_id = reason_id;
					param.buyer_message = this.message;
					param.refund_amount = this.amount;
					param.goods_num = this.num;
				this.wwiopt({
					url: "/index.php?app=member_refund&wwi=refund_post",
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
							url: '/pages/my/tuihuan?id=return'
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
			if (e.oid && e.gid) {
				this.orderId = e.oid;
				this.orderGid = e.gid;
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
