<template>
	<view>
		<view class="wwiapp-asset-info" style="background: #FF0036;">
			<view class="container">
		<view class="i wwi-icon wwi-icon-jinbi"></view>
			<view class="dl">
				<view class="dt">我的余额</view>
				<view class="dd"><view class="em">{{points}}</view></view>
			</view>
			
	</view><view class="box-ling">1</view>
	</view>
	<view class="pdadd-input flex flexrow flexAic flexJcc">
		<view class="dt">￥</view>
		<view class="dd"><input type="number" v-model="amount" placeholder="请输入充值金额" /></view>
	</view>
	<view class="btn-row">
		<button type="primary" class="primary" @tap="nextGo" :disabled="amount.length>0 ? false:true">确定</button>
	</view>
	<wwi-pdpay-mask ref="wwiPdpayMask" ></wwi-pdpay-mask>
	</view>
</template>

<script>
	import wwiPdpayMask from '../../components/wwi-pdpay-mask.vue';
	export default {
		components:{
			wwiPdpayMask
		},
		data() {
			return {
				points:0,
				amount:'',
				submit:0,
				key:''
			};
		},
		methods:{
			getMemberPoints(){
				this.wwiopt({
					url: '/index.php?app=member_index&wwi=my_asset',
					data: {key:this.key,fields:'predepoit'},
					success: res => {
						this.points=res.data.datas.predepoit;
					}
				});
			},
			nextGo:function(){
				if(this.submit){
					uni.showToast({
						title: '正在处理中，请勿重复点击！',icon:"none"
					});
					return false;
				}
				this.submit = 1;
				this.wwiopt({
					url: '/index.php?app=member_fund&wwi=pd_add',
					method: 'POST',
					data: {key:this.key,amount:this.amount},
					success: res => {
						this.checkLogin(res.data.login);
						if (res.data.datas.error) {
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
							this.submit = 0;
							return false;
						}
						var toPay = {
							app:'member_fund',
							wwi:'pd_pay',
							paySn:res.data.datas.pay_sn
						}
						this.$refs.wwiPdpayMask.show(toPay);
					}
				});
			}
		},
		onLoad:function(){
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
				return false;
			}
			this.getMemberPoints()
		}
	}
</script>

<style>
page{background: #FFFFFF;}
.pdadd-input{padding: 20upx;}
.pdadd-input .dt{font-size: 48upx;}
.pdadd-input .dd{margin-left: 20upx;}
.pdadd-input .dd input{font-size: 42upx;}
</style>
