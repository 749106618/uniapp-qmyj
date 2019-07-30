<template>
	<view>
		<view style="height: 20upx;"></view>
		<view class="rpt-hd">
			<view class="title flex flexAic flexrow">
				￥<view class="price">{{info.rpacket_price}}</view> <view class="state">{{info.rpacket_state_text}}</view>
			</view>
			<view class="dl flex flexrow flexAic">
				<view class="dt">红包编号</view>
				<view class="dd">{{info.rpacket_code}}</view>
			</view>
			<view class="dl flex flexrow flexAic">
				<view class="dt">有&nbsp;效&nbsp;期</view>
				<view class="dd">{{info.rpacket_start_date_text}}-{{info.rpacket_end_date_text}}</view>
			</view>
			<view class="dl flex flexrow flexAic">
				<view class="dt">使用规则</view>
				<view class="dd flex flexrow"><view class="span" v-if="info.rpacket_limit">满{{info.rpacket_limit}}可用</view>
							<view class="span" v-else>不限制金额可用</view></view>
			</view>
			<view class="dl flex flexrow flexAic">
				<view class="dt">特殊限制</view>
				<view class="dd">{{info.rpacket_usetype_text}}</view>
			</view>
			<view class="dl flex flexrow flexAic" v-if="info.rpacket_usetype=='2'">
				<view class="dt">限制分类</view>
				<view class="dd flex flexrow">
					<navigator class="em" :url="'/pages/web/glist?gcid='+gc.gc_id" v-for="(gc,index) in info.rpacket_useinfo" :key="index">{{gc.gc_name}}</navigator>
				</view>
			</view>
		</view>
		<view class="rpt-goods-list" v-if="info.rpacket_usetype=='3'">
			<view class="li flex flexrow" v-for="(item,index2) in info.rpacket_useinfo" :key="index2">
				<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="rpt-gimg"><image :src="item.goods_image_url"></image></navigator>
				<view class="rpt-g-info">
					<navigator :url="'/pages/web/item?goodsid='+item.goods_id" class="rpt-g-title">{{item.goods_name}}</navigator>
					<view class="rpt-g-price flex flexJcs">{{item.goods_promotion_price}} <view class="wwi-icon wwi-icon-gouwuche1" @click="getGoodsmask(item)"></view></view>
				</view>
			</view>
		</view>
		<wwi-goods-mask ref="wwiGoodsMask" :goods="Number(goodsId)" @change="getuu"></wwi-goods-mask>
	</view>
</template>

<script>
	import wwiGoodsMask from '../../components/wwi-goods-mask.vue';
	export default {
		components: {
			wwiGoodsMask
		},
		data() {
			return {
				key:'',
				rptId:'',
				info:[],
				goodsId:'',
			};
		},
		methods:{
			loadData:function(){
				this.wwiopt({
					url: '/index.php?app=member_redpacket&wwi=redpacket_info',
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key:this.key,rpacket_id:this.rptId},
					success: res => {
						this.info = res.data.datas.redpacket_info;
					}
				});
			},
			getGoodsmask(e){
				this.goodsId = e.goods_id;
				var _this = this
				setTimeout(function(){
					_this.$refs.wwiGoodsMask.show();
				},30)
			},
			getuu:function(e){
				this.goodsId = e;
			}
		},
		onLoad:function(e){
			if(e.rpt_id){
				this.rptId=e.rpt_id;
			}
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}
			this.loadData();
		}
	}
</script>

<style>
page{background: #F8F8F8;}
.rpt-hd{background: #FFFFFF;padding: 20upx;}
.rpt-hd .title{font-size: 24upx; color: #FF0036;}
.rpt-hd .title .price{font-size: 42upx; font-weight:600 ;}
.rpt-hd .title .state{background: #000000; color: #FFFFFF; border-radius:10upx ; margin-left: 30upx; padding: 0 10upx;}
.rpt-hd .dl{padding: 20upx 0;}
.rpt-hd .dl .dt{width: 140upx; font-size: 26upx; color: #BBBBBB;}
.rpt-hd .dl .dd{font-size: 28upx; flex-wrap: wrap; flex: 1;}
.rpt-hd .dl .dd .em {margin-right: 20upx;}
.rpt-goods-list{margin-top: 20upx;}
.rpt-goods-list .li{padding: 20upx; background: #FFFFFF;}
.rpt-goods-list .li .rpt-gimg,.rpt-goods-list .li .rpt-gimg image{width: 120upx; height: 120upx;}
.rpt-goods-list .li .rpt-g-info{flex: 1; margin-left: 20upx; border-bottom: 1px solid #eee;}
.rpt-goods-list .li .rpt-g-info .rpt-g-title{font-size: 28upx;line-height: 38upx;max-height: 76upx;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;}
.rpt-goods-list .li .rpt-g-info .rpt-g-price{font-size: 32upx; color: #FF0036;}
</style>
