<template>
	<view>
		<block v-for="(item,v) in info" :key="v">
			<swiper class="adv_list" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" v-if="item.adv_list">
				<swiper-item v-for="(pic,k) in item.adv_list.item" :key="k">
					<navigator :url="pic.url" class="swiper-item">
						<image :src="pic.image" mode="widthFix" lazy-load></image>
					</navigator>
				</swiper-item>
			</swiper>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home1">
				<view class="tit-bar" v-if="item.home1.title">{{item.home1.title}}</view>
				<navigator :url="item.home1.url" class="item-pic">
					<image :src="item.home1.image" mode="widthFix" lazy-load></image>
				</navigator>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home2">
				<view class="tit-bar" v-if="item.home2.title">{{item.home2.title}}</view>
				<view class="item-r2 flex flexrow">
					<navigator :url="item.home2.square_url" class="li">
						<image :src="item.home2.square_image" lazy-load></image>
					</navigator>
					<view class="li border-left flex flexcol">
						<navigator :url="item.home2.rectangle1_url" class="span border-bottom">
							<image :src="item.home2.rectangle1_image" mode="" lazy-load></image>
						</navigator>
						<navigator :url="item.home2.rectangle2_url" class="span">
							<image :src="item.home2.rectangle2_image" mode="" lazy-load></image>
						</navigator>
					</view>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home3">
				<view class="tit-bar" v-if="item.home3.title">{{item.home3.title}}</view>
				<view class="item-pic-list flex flexrow">
					<navigator :url="pic.url" class="li" v-for="(pic,s) in item.home3.item" :key="s">
						<image :src="pic.image" mode="widthFix" lazy-load></image>
					</navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home4">
				<view class="tit-bar" v-if="item.home4.title">{{item.home4.title}}</view>
				<view class="item-r2 flex flexrow">
					<view class="li flex flexcol">
						<navigator :url="item.home4.rectangle1_url" class="span border-bottom">
							<image :src="item.home4.rectangle1_image" mode="" lazy-load></image>
						</navigator>
						<navigator :url="item.home4.rectangle2_url" class="span">
							<image :src="item.home4.rectangle2_image" mode="" lazy-load></image>
						</navigator>
					</view>
					<navigator :url="item.home4.square_url" class="li border-left">
						<image :src="item.home4.square_image" lazy-load></image>
					</navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.home5">
				<view class="title flex flexrow">
					<image :src="item.home5.lcurl" lazy-load></image>
					<view class="span">{{item.home5.title}}</view>
					<view class="stit">{{item.home5.stitle}}</view>
				</view>
				<view class="item-r2 flex flexrow">
					<navigator :url="item.home5.square_url" class="li">
						<image :src="item.home5.square_image"></image>
					</navigator>
					<view class="li border-left">
						<navigator :url="item.home5.rectangle1_url" class="span">
							<image :src="item.home5.rectangle1_image" mode="" lazy-load></image>
						</navigator>
						<view class="spanTwo flex flexrow">
							<navigator :url="item.home5.rectangle2_url" class="item-con">
								<image :src="item.home5.rectangle2_image" mode="" lazy-load></image>
							</navigator>
							<navigator :url="item.home5.rectangle3_url" class="item-con">
								<image :src="item.home5.rectangle3_image" mode="" lazy-load></image>
							</navigator>
						</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.goods">
				<view class="tit-bar" v-if="item.goods.title">{{item.goods.title}}</view>
				<view class="goods-list flex flexrow">
					<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="li" v-for="(goods,k2) in item.goods.item" :key="k2">
						<view class="image">
							<image :src="goods.goods_image" mode="widthFix" lazy-load></image>
						</view>
						<view class="goods-info">
							<view class="goods-title">{{goods.goods_name}}</view>
							<view class="goods-price">￥{{goods.goods_promotion_price}}</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol xianshi" v-if="item.goods1">
				<view class="tit-xianshi" v-if="item.goods1.title">{{item.goods1.title}}</view>
				<view class="sale-goods-list ">
					<scroll-view class="list-main" scroll-x>
						<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="li" v-for="(goods,k4) in item.goods1.item"
						 :key="k4">
							<view class="image">
								<image :src="goods.goods_image" mode="widthFix" lazy-load></image>
							</view>
							<view class="goods-info flex flexcol">
								<view class="goods-title">{{goods.goods_name}}</view>
								<view class="goods-sale">
									<view class="span flex flexrow">
										<view class="em">限时</view>￥{{goods.goods_promotion_price}}
									</view>
								</view>
							</view>
						</navigator>
					</scroll-view>
				</view>
			</view>
			<view class="wwiapp-home-block flex flexcol" v-if="item.goods2">
				<view class="tit-bar" v-if="item.goods2.title">{{item.goods2.title}}</view>
				<view class="sale-goods-list">
					<scroll-view class="list-main" scroll-x>
						<navigator :url="'/pages/web/item?goodsid='+goods.goods_id" class="li" v-for="(goods,k3) in item.goods2.item"
						 :key="k3">
							<view class="image">
								<image :src="goods.goods_image" mode="widthFix" lazy-load></image>
							</view>
							<view class="goods-info">
								<view class="goods-title">{{goods.goods_name}}</view>
								<view class="goods-price">￥{{goods.goods_promotion_price}}</view>
							</view>
						</navigator>
					</scroll-view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: [],
				specialId: ''
			};
		},
		methods: {
			Inlimine() {
				this.wwiopt({
					url: '/index.php?app=index&wwi=special',
					data: {
						special_id: this.specialId
					},
					success: res => {
						if (res.data.datas.special_desc) {
							uni.setNavigationBarTitle({
								title: res.data.datas.special_desc
							})
							res.data.datas.list.forEach((k, v) => {
								for (let kk in k) {
									switch (kk) {
										case 'adv_list':
											k.adv_list.item.forEach(item => {
												item.url = this.buildUrl(item.type, item.data)
											})
											break;
										case 'home3':
											k.home3.item.forEach(item => {
												item.url = this.buildUrl(item.type, item.data)
											})
											break;
										case 'home1':
											k.home1.url = this.buildUrl(k.home1.type, k.home1.data);
											break;
										case 'home4':
											k.home4.square_url = this.buildUrl(k.home4.square_type, k.home4.square_data);
											k.home4.rectangle1_url = this.buildUrl(k.home4.rectangle1_type, k.home4.rectangle1_data);
											k.home4.rectangle2_url = this.buildUrl(k.home4.rectangle2_type, k.home4.rectangle2_data);
											break;
										case 'home2':
											k.home2.square_url = this.buildUrl(k.home2.square_type, k.home2.square_data);
											k.home2.rectangle1_url = this.buildUrl(k.home2.rectangle1_type, k.home2.rectangle1_data);
											k.home2.rectangle2_url = this.buildUrl(k.home2.rectangle2_type, k.home2.rectangle2_data);
											break;
										case 'home5':
											k.home5.square_url = this.buildUrl(k.home5.square_type, k.home5.square_data);
											k.home5.rectangle1_url = this.buildUrl(k.home5.rectangle1_type, k.home5.rectangle1_data);
											k.home5.rectangle2_url = this.buildUrl(k.home5.rectangle2_type, k.home5.rectangle2_data);
											k.home5.rectangle3_url = this.buildUrl(k.home5.rectangle3_type, k.home5.rectangle3_data);
											break;
									}
								}

							});
							this.info = res.data.datas.list;
						} else {
							uni.showToast({
								title: '专题不存在或错误',
								icon: "none",
								success() {
									setTimeout(function() {
										uni.navigateBack();
									}, 1000);
								}
							});
						}
					}
				});
			},
			buildUrl: function(type, data) {
				switch (type) {
					case 'keyword':
						return '/pages/web/glist?keyword=' + encodeURIComponent(data);
					case 'special':
						return '/pages/web/special?speid=' + data;
					case 'goods':
						return '/pages/web/item?goodsid=' + data;
					case 'lottery':
						return '/pages/web/lottery?lotid=' + data;
					case 'url':
						return '/pages/web/tourl?url=' + data;
				}
			}

		},
		onLoad: function(e) {
			if (e.speid) {
				this.specialId = e.speid;
			} else {
				uni.showToast({
					title: '专题ID不存在',
					icon: "none",
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				});
			}
			this.Inlimine();
		}
	}
</script>

<style>
	@import "../../common/css/index.css";
</style>
