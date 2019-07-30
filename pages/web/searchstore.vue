<template>
	<view class="index">
		<view class="select-city flex flexrow flexJcs">
			<view class="flex flexrow">
				<view class="nowcent">店铺所在地:</view>
				<view class="flex flexrow select-b flexAic" @tap="showMulLinkageThreePicker">
					<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
				<picker @change="bindPickerChange1" :value="cityId" :range="cityList" range-key="area_name" v-if="cityList.length > 0">
					<view class="ss">{{cityList[cityId].area_name}}</view>
				</picker>
					</view>
			</view>
			<view class="flex flexrow flexAic">
				<picker @change="bindPickerChange" :value="classId" :range="classList" range-key="sc_name" v-if="classList.length > 0">
					<view class="ss">{{classList[classId].sc_name}}</view>
				</picker>
				<view class="wwi-icon wwi-icon-jiantou_liebiaozhankai"></view>
			</view>
		</view>
		<scroll-view scroll-y class="store-list" @scrolltolower="loadList">
				<view v-if="!storeList.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">没有相关店铺</view>
							<view class="dd">换个条件试试吧</view>
						</view>
					</view>
				</view>
				<view class="item flex flexcol" v-for="(item,index) in storeList" :key="index">
					<view class="hd flex flexrow">
						<navigator :url="'/pages/web/store?storeid='+item.store_id" class="flex flexrow" style="flex: 1;">
						<image :src="item.store_avatar" ></image>
						<view class="info">
							<view class="tp">{{item.store_name}}</view>
							<view class="bp">已经有{{item.store_collect}}人收藏</view>
						</view></navigator>
						<view class="btn">收藏</view>
					</view>
					<navigator :url="'/pages/web/store?storeid='+item.store_id" class="bd flex flexrow">
						<view class="li" v-for="(goods,v) in item.commend_goods_list" :key="v">
							<image :src="goods.goods_image" lazy-load=""></image>
							<view class="price">&yen;{{goods.goods_promotion_price}}</view>
						</view>
					</navigator>
				</view>      
		</scroll-view>
		<view class="bottom flex flexrow flexJcs">
			<input type="text" class="2"  placeholder-style="min-height:1em" v-model="keyword" placeholder="关键词搜索店铺"  />
			<view class="btn" @click="btnGo">搜索</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                cityId:0,
				classId:0,
				classList:[],
				cityList:[],
				hasmore:true,
				curpage:1,
				keyword:'',
				storeList:[],
				cityPickerValueDefault: [0, 0, 0]
			};
		},
		methods:{
			loadList:function(){
				if (!this.hasmore) {
					return false
				}
				this.hasmore = false;
				var param = {};
				param.page = 10;
				param.curpage = this.curpage;
				if (this.classId != 0) {
					param.sc_id = this.classList[this.classId].sc_id;
				}
				if (this.keyword != "") {
					param.keyword = this.keyword
				}
				if (this.cityId != 0) {
					param.area_id = this.cityList[this.cityId].area_id;
				}
				this.wwiopt({
					url: "/index.php?app=store&wwi=store_list",
					data: param,
					success: res => {
						if(res.data.code==200){
							res.data.datas.store_list.forEach(item=>{
								this.storeList.push(item);
							})
						}
					},
					
				});
			},
			bindPickerChange: function(e) {
				if(e.target.value == this.classId){
					return false;
				}
				this.classId = e.target.value;
				this.hasmore = true;
				this.curpage = 1;
				this.storeList = [];
				this.loadList()
			},
			bindPickerChange1: function(e) {
				if(e.target.value == this.cityId){
					return false;
				}
				this.cityId = e.target.value;
				this.hasmore = true;
				this.curpage = 1;
				this.storeList = [];
				this.loadList()
			},
			btnGo:function(){
				this.hasmore = true;
				this.curpage = 1;
				this.storeList = [];
				this.loadList()
			},
			getClass:function(){
				uni.request({
					url: this.ApiUrl + "/index.php?app=store&wwi=store_class_list",
					success: res => {
						this.classList = res.data.datas.class_list;
						this.classList.unshift({sc_id:0,sc_name:'全部分类'});
					}
				});
			},
			getCity:function(){
				  uni.request({
					url: this.ApiUrl+'/index.php?app=area&wwi=area_list',
					success: res => {
						this.cityList = res.data.datas.area_list;
						this.cityList.unshift({area_id:0,area_name:'全国'});
					},
				 });
			}
		},
		onLoad:function(){
			this.getClass();
			this.getCity();
			this.loadList();
		}
	}
</script>

<style>
page{background-color: #F8F8F8; display: flex;}
.index {display: flex;flex: 1;flex-direction: column;}
.select-city{height: 44px; line-height: 24px; background: #03a9f4; color: #FFFFFF; padding: 10px; box-sizing: border-box;}
.select-city .wwi-icon{font-size: 18px;}
.select-city .nowcent{font-size: 12px;}
.select-city .ss{font-size: 14px;}
.store-list{width: 100%; height: calc(100% - 88px); flex: 1;}
.bottom{height: 44px; background: #03a9f4; padding:0 10px; box-sizing: border-box;align-items: center;}
.bottom input{background: #FFFFFF; flex: 1; font-size: 13px; height: 30px; line-height: 30px;}

.bottom .btn{font-size: 13px; display: flex; justify-content: center; align-items: center; color: #FFFFFF; margin-left: 16px;}
.store-list .item{background: #FFFFFF; margin-bottom: 20upx;}
.store-list .item .hd{padding: 20upx; border-bottom: 2upx solid #eee;}
.store-list .item .hd image{width: 160upx; height: 160upx}
.store-list .item .hd .info{flex: 1; padding: 20upx;}
.store-list .item .hd .info .tp{font-size: 36upx; font-weight: bold;}
.store-list .item .hd .info .bp{font-size: 28upx; color: #777;}
.store-list .item .hd .btn{border:1px solid #eee ; height: 50upx; padding:0 20upx; font-size: 28upx; border-radius:20upx ; display: flex; align-items: center; justify-content: center; color: #777;}
.store-list .item .bd{padding: 20upx 0;}
.store-list .item .bd .li{width: 187.5upx; display: flex; flex-direction: column; align-items: center; justify-content: center;}
.store-list .item .bd .li image{width: 160upx; height: 160upx; margin: 20upx auto;}
.store-list .item .bd .li .price{color: #FF0036; font-size: 0.7em;}
</style>

