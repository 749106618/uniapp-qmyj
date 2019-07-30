<template>
	<view>
		<view class="vrchange-top">
			<view class="number-input" :class="{'ok':numberTxt}">
				<block v-if="numberTxt">{{numberTxt}}</block>
				<block v-else>请输入买家提供的电子兑换码</block>
				</view>
			<view class="number-box flex flexrow">
			<view class="number-i" @click="chickNum('1')">1</view>
			<view class="number-i" @click="chickNum('2')">2</view>
			<view class="number-i" @click="chickNum('3')">3</view>
			<view class="number-i" @click="chickNum('4')">4</view>
			<view class="number-i" @click="chickNum('5')">5</view>
			<view class="number-i" @click="chickNum('6')">6</view>
			<view class="number-i" @click="chickNum('7')">7</view>
			<view class="number-i" @click="chickNum('8')">8</view>
			<view class="number-i" @click="chickNum('9')">9</view>
			<view class="number-i" @click="chickNum('0')">0</view>
			<view class="number-i" @click="chickNum('qc')">清除</view>
			<view class="number-i" @click="chickNum('ht')">后退</view>
			<view class="number-i wwi-icon wwi-icon-erweima" @click="scanCode"></view>
			<view class="number-i select-ok" @click="searchNumGoods">提交验证</view>
			</view>
			<image src="../../static/wave.gif" class="wave-gif" mode=""></image>
		</view>
		<view class="vrchang-goods" v-for="(item,index) in info" :key="index">
			<view class="hd">订单编号：{{item.order_sn}}</view>
			<view class="goods-info">
				<image :src="item.goods_img" mode="" class="img"></image>
				<view class="goods-name">{{item.goods_name}}</view>
				<view class="goods-spec" v-if="item.goods_spec">{{item.goods_spec}}</view>
			</view>
			<view class="goods-msg" v-if="item.buyer_msg">买家留言：{{item.buyer_msg}}</view>
			<view class="bd">验证码：{{item.number}}</view>
		</view>
		
	</view>
</template>

<script>
		export default {
		data() {
			return {
				key:'',
				numberTxt:'',
				info:[],
				chickOk:true
			}
		},
		methods:{
			chickNum:function(e){
				if(e=='qc'){
					this.numberTxt = "";
				}else if(e=='ht'){
					this.numberTxt = this.numberTxt.slice(0,-1);
				}else{
					this.numberTxt =this.numberTxt+e;
				}
			},
			scanCode: function() {
				var that = this;
				uni.scanCode({
					success: function(res) {
						var result = res.result;
						
						if(result.indexOf('http://')==0  || result.indexOf('https://')==0){
							uni.showModal({
								title: '不支持类型',
								content: '扫码结果:'+result,
								showCancel: false,
								cancelText: '',
								confirmText: '确定',
								success: res => {}
							});
						}else{
							that.numberTxt = result;
						}
					},
					fail: function(res) {}
				})
			},
			searchNumGoods:function(){
				if(!this.chickOk || this.numberTxt.length < '8'){
					uni.showModal({
						content: '兑换码不正确或重复点击',
						showCancel: false,
						confirmText: '确定'
					});
					return;
				}
				this.chickOk = false;
				this.wwiopt({
					url: '/index.php?app=seller_vr_order&wwi=exchange',
					method: 'POST',
					data: {key:this.key,vr_code:this.numberTxt},
					success: res => {
						if(!res.data.datas.error){
							uni.showModal({
								content: '兑换码验证成功',
								showCancel: false,
								confirmText: '确定',
								success:function(){
									this.info.push({
										number:this.numberTxt,
										goods_img:res.data.datas.img_240,
										goods_name:res.data.datas.goods_name,
										goods_spec:res.data.datas.goods_spec,
										order_sn:res.data.datas.order_sn,
										buyer_msg:res.data.datas.buyer_msg
									})
								}
							});
						}else{
							uni.showModal({
								content: res.data.datas.error,
								showCancel: false,
								confirmText: '确定'
							});
						}
						this.chickOk = true;
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
		}
		}
</script>

<style>
	page{background: #fffefb;}
	.vrchange-top{height: 640upx; position: relative;width: 100%; background: #ffc107; display: inline-block; }
	.vrchange-top .number-input{background: #ffffff; padding:20upx ; height: 60upx; line-height: 60upx; margin: 20upx 40upx; box-shadow:2px 4px 10px 0px #ad8305; font-size: 38upx; color: #d8d8d8;}
	.vrchange-top .number-input.ok{color: #FF9800; font-size: 48upx;}
	.vrchange-top .number-box{ margin-left: 40upx; margin-right: 20upx; flex-wrap: wrap;}
	.vrchange-top .number-box .number-i{width: 118upx; height: 118upx; margin-right: 20upx; background: #FFFFFF; margin-bottom: 20upx;display: flex; justify-content: center; align-items: center; box-shadow:2px 4px 10px 0px #b7952f; border-radius:10upx ; font-size: 34upx; color: #ffc107;}
	.vrchange-top .number-box .number-i:active{opacity: 0.9;}
	.vrchange-top .number-box .number-i.select-ok{width: 256upx;background: #ff9800; color: #FFFFFF;}
	.vrchange-top .number-box .number-i.wwi-icon{font-size: 68upx;}
	.vrchang-goods{padding: 20upx 40upx; background: #FFFFFF;}
	.vrchang-goods .hd{font-size: 28upx;}
	.vrchang-goods .goods-info{position: relative; padding: 20upx 0; margin-left: 180upx;}
	.vrchang-goods .goods-info .img{position: absolute; left: -180upx; width: 160upx; height: 160upx; z-index: 8;}
	.vrchang-goods .goods-info .goods-name{font-size: 28upx; line-height: 40upx; height: 80upx; overflow: hidden; margin-bottom: 10upx;}
	.vrchang-goods .goods-info .goods-spec{font-size: 24upx; line-height: 24upx; height: 70upx; overflow: hidden; color: #999999;}
	.vrchang-goods .goods-msg{font-size: 24upx; background: #f8f8f8; padding: 5upx 10upx;}
	.vrchang-goods .bd{font-size: 36upx; color: #007aff; text-align: center;}
</style>
