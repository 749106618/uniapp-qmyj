<template>
	<view>
		<view class="puzzle-info flex flexrow">
			<view class="puzzle-img">
				<image :src="info.goods_image_url" lazy-load></image>
			</view>
			<view class="puzzle-name">
				<view class="h5">{{info.goods_name}}</view>
				<view class="puzzle-original" v-if="info.goods_price">
					<view class="puzzle-cost flex flexrow">
						&yen;<view class="em">{{info.goods_price}}</view><view class="cost-unit">元/件</view>
					</view>
					<view class="yuan-price">原价</view>
				</view>
				<view class="puzzle-original puzzle">
					<view class="puzzle-cost flex flexrow">
						&yen;<view class="em">{{info.pintuan_price}}</view><view class="cost-unit">元/件</view>
					</view>
					<view class="yuan-price">{{info.min_num}}人团</view>
				</view>
			</view>
		</view>
		<view class="puzzle-time">
			<block v-if="info.pintuan_end_time">
			<navigator :url="'/pages/web/item?goodsid='+info.goods_id+'&logId='+info.log_id+'&buyerId='+info.buyer_id" class="puzzle-goto">
				<view class="goto-btn">去拼团</view>
			</navigator>
			<view class="puzzle-number flex flexrow flexJcc flexAic">
				<view class="wwi-icon wwi-icon-shijian"></view>已开团，离成团还差<view class="em">{{info.num}}</view>人
			</view>
			<view class="puzzle-Countdown flex flexrow flexJcc flexAic">
				剩<wwi-count-down :timer="info.pintuan_end_time" v-if="info.pintuan_end_time > 0" borderColor="#FFFFFF" splitorColor="#000000" fontColor="#ffffff" bgrColor="#9c9c9c"></wwi-count-down>自动结束
			</view>
			</block>
			<block v-else>
			<view class="puzzle-number flex flexrow flexJcc flexAic">
				<view class="wwi-icon wwi-icon-shijian"></view>拼团已经结束
			</view>
			</block>
			<view class="puzzle-details flex flexrow flexJcc">
				<view class="span">快去邀请好友参团吧！</view>
				<navigator url="/pages/web/document?code=pintuan_doc" class="goto-btn">玩法详情</navigator>
			</view>
		</view>
		<view class="puzzle-record">
			<view class="h5">开团记录</view>
			<view class="ul">
				<view class="li flex flexrow" v-for="(item,index) in info.log_list" :key="index">
					<view class="record-img"><image :src="item.avatar"></image></view>
					<view class="record-text">
						<view class="record">{{item.buyer_name}}</view>
						<view class="p flex flexrow">
							<view class="em">{{item.time_text}}</view>开团
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="puzzle-btn flex flexrow" v-if="info.pintuan_end_time">
			<view class="invite-btn flex flexJcc flexAic" @click="shareBtn">邀请好友参团</view>
			<navigator :url="'/pages/my/orderinfo?orderId='+info.order_id" class="order-btn flex flexJcc flexAic" v-if="info.order_id">查看订单详情</navigator>
			<navigator :url="'/pages/web/item?goodsid='+info.goods_id+'&logId='+info.log_id+'&buyerId='+info.buyer_id" class="order-btn flex flexJcc flexAic" v-else>参团购买</navigator>
    </view>
<wwi-mask-up ref="shareBtn" leftText="取消" title="分享" bottomText="关闭">
					<view class="share-icon-text">
						<!-- #ifdef MP-WEIXIN -->
						<button class="share-li" open-type="share">
							<view class="wwi-icon wwi-icon-fenxiang"></view>
							<view class="share-text">分享给微信好友</view>
						</button>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<view class="share-li" @tap="share(value)" v-for="(value,sharekey) in providerList" :key="sharekey" v-if="providerList.length > 0">
							<view class="wwi-icon" :class="'wwi-icon-'+value.icon"  :style="{'color':value.color}"></view>
							<view class="share-text">{{value.name}}</view> 
						</view>
						<!-- #endif -->
						<view class="share-li" @click="fileImgCanvas">
							<view class="wwi-icon wwi-icon-weixinicon"></view>
							<view class="share-text">生成海报</view>
						</view>
						<view class="share-li" @click="copyLinkBtn">
							<view class="wwi-icon wwi-icon-lianjie" style="color: #007aff;"></view>
							<view class="share-text">复制连接</view>
						</view>
					</view>
		</wwi-mask-up>
		<wwi-mask-up ref="showCan" title="分享海报" bottomText="保存图片到手机" @onConfirm="canDownImg">
			<view class="showCan-mask-info">
				<view class="canvas-img">
				<image :src="canvasImg" mode="widthFix"></image>
				</view>
			</view>
		</wwi-mask-up>
		<view style="width: 0px; height: 0px; overflow: hidden;">
		<canvas canvas-id="mycanvas" :style="{'width':canWidth+'px','height':canHeight+'px'}"></canvas></view>
	</view>
</template>

<script>
	import wwiCountDown from "../../components/wwi-count-down.vue";
	import Wwiposter from "../../components/wwi-poster/lib/Wwiposter.js";
	import wwiMaskUp from '../../components/wwi-mask-up.vue';
	export default {
		components: {
			wwiCountDown,
			wwiMaskUp,
			Wwiposter
		},
		data() {
			return {
				pid:'',
				bid:'',
				key:'',
				info:[],
				canvasImg:'',
				canWidth:300,
				canHeight:450,
				providerList:[],
				copyLink:''
			};
		},
		methods:{
			load:function(){
				const res = uni.getSystemInfoSync();
				this.canWidth = res.screenWidth;
				this.canHeight = res.screenHeight;
				this.ctx = uni.createCanvasContext('mycanvas');
				this.wwiopt({
					url: "/index.php?app=pintuan&wwi=info",
					data: {key: this.key, pintuan_id: this.pid,buyer_id: this.bid},
					success: res => {
						var _info = res.data.datas.pintuan_info;
						this.info = _info;
					},
					fail: () => {
						uni.showToast({
							title: '参数错误',icon:"none",
							success() {
								setTimeout(function() {
									var page = getCurrentPages();
									if(page.length > 1){
									  uni.navigateBack();
									}else{
									  uni.switchTab({  url:'/pages/index' });
									}
								}, 1000);
							}
						});
					}
				});
			},
			shareBtn:function(){
				this.$refs.shareBtn.show();
			},
			fileImgCanvas:function(){
				if(this.canvasImg){
					this.$refs.showCan.show();
					return false;
				}
				var img = '';
				var _this =this;
				uni.getImageInfo({
					src:this.info.goods_image_url,
					success: res => {
						img = res.path;
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#ffffff'
						});
						poster.doBorder({
							borderRadius: poster.toPx('20'),
							borderWidth: poster.toPx('80'),
							borderColor: '#ff0036',
							width: this.canWidth,
							height: this.canHeight,
							top: poster.toPx('78'),
							type: 'image'
						});
						poster.fillAbsText({
							top: poster.toPx('20'),
							left: poster.toPx('360'),
							width: poster.toPx('710'),
							lineHeight: poster.toPx('40'),
							color: '#FFFFFF',
							fontSize: poster.toPx('32'),
							align: 'center',
							text: _this.info.min_num+'人成团@你参与拼团',
							bold: true,
							type: 'text',
							textStyle: 'stroke'
						});
						poster.fillAbsText({
							top: poster.toPx('108'),
							left: poster.toPx('20'),
							width: poster.toPx('710'),
							lineHeight: poster.toPx('46'),
							maxLines: 2,
							color: '#12194C',
							fontSize: poster.toPx('32'),
							align: 'left',
							text: _this.info.goods_name,
							fontWeight: 'bold',
							type: 'text'
						});
						poster.fillAbsText({
							top: poster.toPx('228'),
							left: poster.toPx('20'),
							color: '#ff0036',
							fontSize: poster.toPx('28'),
							align: 'left',
							text: '拼团价',
							type: 'text'
						});
						poster.fillAbsText({
							top: poster.toPx('218'),
							left: poster.toPx('120'),
							color: '#ff0036',
							fontSize: poster.toPx('40'),
							align: 'left',
							text: _this.info.pintuan_price,
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: 240,
							sHeight: 240,
							width: _this.canWidth,
							height: _this.canWidth,
							type: 'image',
							top: poster.toPx('278')
						});
						poster.drawQRCode({
							content: _this.WapSiteUrl + '/pages/my/ptinfo?pid='+_this.pid + '&bid='+_this.bid,
							sWidth: 360,
							sHeight: 360,
							width: poster.toPx('200'),
							height: poster.toPx('200'),
							type: 'image',
							bottom: poster.toPx('40'),
							left: poster.toPx('80'),
							background: '#ffffff',
							color: '#12194C'
						});
						poster.fillAbsText({
							bottom: poster.toPx('150'),
							left: poster.toPx('350'),
							color: '#12194C',
							fontSize: poster.toPx('34'),
							align: 'left',
							text: this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: poster.toPx('90'),
							left: poster.toPx('350'),
							color: '#9e9e9e',
							fontSize: poster.toPx('28'),
							align: 'left',
							text: '长按识别小程序码',
							bold: true,
							type: 'text'
						});
						this.ctx.draw();
						_this.toTempFilePath();
					}
				});
			},
			toTempFilePath: function() {
				var that = this;
				setTimeout(() => {
				uni.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						that.canvasImg = res.tempFilePath;
						that.$refs.showCan.show();
						console.log(res.tempFilePath)
					},
					fail: function(err) {
						console.error(JSON.stringify(err))
					}
				})
				}, 300);
			},
			canDownImg:function(){
				uni.saveImageToPhotosAlbum({
					filePath: this.canvasImg,
					success: function () {
						uni.showToast({
						  title : "保存成功",
						  icon: "success",
						})
					}
				});
			},
			copyLinkBtn: function() {
				// #ifndef H5
				uni.setClipboardData({
					data: this.copyLink,
					success: function() {
						uni.showToast({
							title: '复制连接成功',
							icon: 'none'
						});
					}
				});
				// #endif
				// #ifdef H5
				var text = this.copyLink;
				const textarea = document.createElement("textarea");
				textarea.style.position = 'fixed';
				textarea.style.top = 0;
				textarea.style.left = 0;
				textarea.style.border = 'none';
				textarea.style.outline = 'none';
				textarea.style.resize = 'none';
				textarea.style.background = 'transparent';
				textarea.style.color = 'transparent';
				textarea.value = text; // 修改文本框的内容
				document.body.appendChild(textarea);
				textarea.select() // 选中文本
				try {
					const msg = document.execCommand('copy') ?
						'复制成功' : '复制失败';
					uni.showToast({
						title: msg,
						icon: 'none'
					});
				} catch (err) {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					});
				}
				document.body.removeChild(textarea)
				// #endif
			},
			async share(e) {
				let shareOPtions = {
					provider: e.id,
					scene: e.type && e.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession', //WXSceneSession”分享到聊天界面，“WXSenceTimeline”分享到朋友圈，“WXSceneFavorite”分享到微信收藏     
					type: 0,
					success: (e) => {
						uni.showModal({
							content: '分享成功',
							showCancel:false
						})
					},
					fail: (e) => {
						uni.showModal({
							content: e.errMsg,
							showCancel:false
						})
					},
					complete:function(){
					}
				}
				shareOPtions.summary = '一起来拼团,仅需￥'+this.info.pintuan_price;
				shareOPtions.imageUrl = this.info.goods_image_url ? this.info.goods_image_url : this.WapSiteUrl + '/static/logo.png';
				shareOPtions.title = this.info.goods_name;
				shareOPtions.href = this.copyLink;
				uni.share(shareOPtions);
			}
		},
		onLoad:function(e){
			if(e.pid && e.bid){
				this.pid = e.pid;
				this.bid = e.bid;
			}else{
				uni.showToast({
					title: '参数错误',icon:"none",
					success() {
						setTimeout(function() {
							var page = getCurrentPages();
							if(page.length > 1){
							  uni.navigateBack();
							}else{
							  uni.switchTab({  url:'/pages/index' });
							}
						}, 1000);
					}
				});
			}
			this.key = uni.getStorageSync('key');
			this.copyLink = this.WapSiteUrl + '/pages/my/ptinfo?pid=' + this.pid + '&bid=' + this.bid;
			this.load();
			// #ifdef APP-PLUS
			uni.getProvider({
				service: 'share',
				success: (e) => {
					let data = []
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '微信好友',
									id: 'weixin',
									icon:'weixinicon',
									color:'#39b54a',
									sort: 0
								})
								data.push({
									name: '微信朋友圈',
									id: 'weixin',
									icon:'fenxiangweixinpengyouquan',
									color:'#8dc63f',
									type: 'WXSenceTimeline',
									sort: 1
								})
								break;
							case 'sinaweibo':
								data.push({
									name: '新浪微博',
									id: 'sinaweibo',
									color:'#f37b1d',
									icon:'xinlangweibo',
									sort: 2
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq',
									color:'#0081ff',
									icon:'QQ',
									sort: 3
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data.sort((x, y) => {
						return x.sort - y.sort
					});
				},
				fail: (e) => {
					console.log('获取分享通道失败', e);
					uni.showModal({
						content: '获取分享通道失败',
						showCancel: false
					})
				}
			});
			// #endif
		},
		onShareAppMessage:function(){
			var title = this.info.goods_name ? this.info.goods_name : this.siteTitle;
			return{
				title:'@我一起来拼团['+this.info.goods_name+'],仅需￥'+this.info.pintuan_price,
				path:'/pages/my/ptinfo?pid='+this.pid+'&bid='+this.bid
			}
		}
	}
</script>

<style>
page{background: #f8f8f8;}
.puzzle-info{background: #FFFFFF; padding: 20upx;}
.puzzle-info .puzzle-img{width: 260upx; height: 260upx;}
.puzzle-info .puzzle-img image{width: 100%; height: 100%;}
.puzzle-info .puzzle-name{flex: 1; margin-left: 20upx;}
.puzzle-info .puzzle-name .h5{font-size: 28upx;     text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;overflow: hidden;}
.puzzle-info .puzzle-name .puzzle-original{margin-top: 20upx; position: relative; font-size: 24upx; border:1px solid #e4e4e4; border-radius: 8upx; height: 60upx; text-align: center; color: #999; margin-bottom: 20upx}
.puzzle-info .puzzle-name .puzzle-original:last-child{margin-bottom: 0}
.puzzle-info .puzzle-name .puzzle-original .puzzle-cost{font-size: 24upx;margin-top:20upx; height: 35upx; justify-content: center; align-items: center;}
.puzzle-info .puzzle-name .puzzle-original .puzzle-cost .em{ margin-left:8upx; font-size: 26upx; font-weight: 600}
.puzzle-info .puzzle-name .puzzle-original .puzzle-cost .cost-unit{ margin-left: 0.2rem; }
.puzzle-info .puzzle-name .puzzle-original .yuan-price{font-weight: 600 ;position:absolute; top: -24upx; left: 40%; padding:4upx 20upx; background: #fff;font-size: 24upx;}
.puzzle-info .puzzle-name .puzzle{ border-color: #EC5464 }
.puzzle-info .puzzle-name .puzzle .puzzle-cost .em{color: #EC5464;}
.puzzle-info .puzzle-name .puzzle .yuan-price{ color: #333;}
.puzzle-time{ margin-top: 24upx; padding:16upx 0; background: #fff; position: relative;z-index: 1 }
.puzzle-time .puzzle-number{ font-size: 26upx; color: #333; line-height: 60upx;}
.puzzle-time .puzzle-number .em{margin:0 8upx; color: #EC5464; font-weight: 600 }
.puzzle-time .puzzle-Countdown{ font-size: 24upx;  line-height: 50upx;}
.puzzle-time .puzzle-details{color: #348FE2; font-size: 24upx; line-height: 50upx;}
.puzzle-time .puzzle-details .span{color: #999}
.puzzle-goto{margin-top: 20upx; padding:16upx 0; background: #fff; position: relative;z-index: 1;}
.puzzle-goto .goto-btn{width: 50%; font-size: 28upx; color: #fff; background: #EC5464; border-radius: 8upx; display:block; height: 70upx; line-height: 70upx; text-align: center;border:1px #EC5464 solid; margin:8upx auto }
.puzzle-record{margin-top:24upx; background: #fff; position: relative; z-index: 1; }
.puzzle-record .h5{ height:32upx; line-height: 32upx; padding:15upx; color: #999; border-bottom: 1px #e4e4e4 solid; font-size: 26upx;}
.puzzle-record .ul .li{ overflow: hidden; border-bottom:1px #e4e4e4 solid; padding:15upx; }
.puzzle-record .ul .li:last-child{ border-bottom:0; }
.puzzle-record .ul .li .record-img{width: 70upx; height: 70upx; }
.puzzle-record .ul .li .record-img image{height: 70upx; width: 70upx; border-radius: 50%;}
.puzzle-record .ul .li .record-text{ margin-left:20upx; flex: 1;}
.puzzle-record .ul .li .record-text .p{ font-size: 24upx;line-height: 35upx;color: #999; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;}
.puzzle-record .ul .li .record-text .p .em{ color: #999; margin-right:8upx; }
.puzzle-record .ul .li .record-text .record{color: #333; font-weight: 600; font-size:28upx;}
.puzzle-btn{position: fixed; left: 0; right: 0; bottom: 0; background: #fff; padding:15upx;border-top: 1px #eee solid; z-index: 2}
.puzzle-btn .invite-btn{flex: 1; font-size: 26upx; color: #fff; background: #EC5464; border-radius: 8upx;border:1px #EC5464 solid; height: 70upx;}
.puzzle-btn .order-btn{flex: 1; font-size: 26upx; color: #EC5464; background: #fff; border-radius: 8upx;border:1px #EC5464 solid; height: 70upx; margin-left: 15upx;}
.showCan-mask-info{}
.showCan-mask-info .canvas-img{width: 100%; height: 100%;display: flex; justify-content: center; align-items: center; padding: 20upx 0;}
.showCan-mask-info .canvas-img image{width: 375upx;  box-shadow: 1px 1px 8px 0px;}
.share-icon-text{display: flex; flex-direction: row; flex-wrap: wrap;}
.share-icon-text .share-li{width: 25%; background: transparent;}
.share-icon-text .share-li:after{border: 0;}
.share-icon-text .share-li{display: flex; justify-content: center; align-items: center; flex-direction: column;}
.share-icon-text .share-li .share-text{height: 60upx; line-height: 60upx; font-size: 24upx; color: #ccc;}
.share-icon-text .share-li .wwi-icon{color: #008000; font-size: 70upx;}
</style>
