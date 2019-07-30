<template>
	<view>
		<view class="bill-goods-list">
			
			<view class="li" v-for="(item,index) in billList" :key="index">
				<view class="hd flex flexrow">
					<view class="goods-image"><image :src="item.goods_image_url"></image></view>
					<view class="goods-info">
						<view class="goods-name">{{item.goods_name}}</view>
						<view class="goods-price">￥{{item.goods_price}}</view>
					</view>
					<view class="btn flex flexAic flexJcc" @click="shareBtn(item,index)">操作</view>
				</view>
			</view>
			<wwi-load-more  :loadingType="loadingType" :contentText="contentText" ></wwi-load-more>
		</view>
		<view v-if="showPageTop" class="wwi-icon wwi-icon-jiantou_yemian_xiangshang pageTop" @click="goPageTop"></view>
				<wwi-mask-up ref="shareBtn" leftText="取消" title="商品设置" bottomText="关闭">
					<view class="share-icon-text">
						<view class="share-li" @click="fileImgCanvas">
							<view class="wwi-icon wwi-icon-tupian" style="color: #ed5564;"></view>
							<view class="share-text">生成海报</view>
						</view>
						<view class="share-li" @click="copyLinkBtn">
							<view class="wwi-icon wwi-icon-lianjie"  style="color: #007aff;"></view>
							<view class="share-text">复制连接</view>
						</view>
						<view class="share-li" @click="goodsRecommend">
							<view class="wwi-icon wwi-icon-zan"  style="color: #fb6e52;"></view>
							<view class="share-text" v-if="item.jfx_goods_up != 1" >推荐商品</view>
							<view class="share-text" v-else>取消推荐</view>
						</view>
						<view class="share-li" @click="goodsDel">
							<view class="wwi-icon wwi-icon-CPhezuo"  style="color: #9e9e9e;"></view>
							<view class="share-text">取消推广</view>
						</view>
						<navigator :url="'/pages/web/mshop/item?msid='+this.item.member_id +'&goodsid='+this.item.goods_id +'&fid='+item.jfx_id" class="share-li">
							<view class="wwi-icon wwi-icon-yanjing_xianshi"  style="color: #9e9e9e;"></view>
							<view class="share-text">查看商品</view>
						</navigator>
					</view>
		</wwi-mask-up>
		<wwi-mask-up ref="showCan" title="分享二维码" bottomText="保存图片到手机" @onConfirm="canDownImg">
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
	import Wwiposter from "../../components/wwi-poster/lib/Wwiposter.js";
	import wwiMaskUp from '../../components/wwi-mask-up.vue';
	import wwiLoadMore from '../../components/wwi-load-more.vue';
	export default {
		components: {
			wwiMaskUp,
			wwiLoadMore,
			Wwiposter
		},
		data() {
			return {
				billList:[],
				hasmore: true,
				curpage: 1,
				contentText: {
					contentdown:'上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				loadingType:0,
				showPageTop:false,
				canWidth:300,
				canHeight:450,
				canvasImg:'',
				item:[],
				itemIndex:0,
				copyLink:''
			};
		},
		methods: {
			Inlimine(action = 'refresh') {

				if (!this.hasmore) {
					this.loadingType = 2;
					return;
				}
				this.loadingType = 1;
				this.wwiopt({
					url: '/index.php?app=member_distri&wwi=jfx_goods',
					data: {
						key: this.key,
						page: 10,
						curpage: this.curpage
					},
					success: res => {
						if (res.data.code == '200') {
							this.checkLogin(res.data.login);
							this.curpage += 1;
							if (action == 'onbot') {
								res.data.datas.goods_list.forEach(item => {
									this.billList.push(item);
								});
								this.loadingType = 0;
							} else {
								this.billList = res.data.datas.goods_list;
								uni.stopPullDownRefresh();
								this.loadingType = 0;
								if (!res.data.hasmore) {
									this.loadingType = 3;
								}
							}
							this.hasmore = res.data.hasmore;
						}
					}
				});
			},
			goPageTop() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.showPageTop = false;
			},
			shareBtn:function(e,d){
				this.item = e;
				this.itemIndex = d;
				this.copyLink = this.WapSiteUrl+'/pages/web/mshop/item?goodsid='+e.goods_id +'&fid='+e.jfx_id+'&msid='+e.member_id;
				this.$refs.shareBtn.show();
			},
			goodsDel(){
				uni.showModal({
					title: '提示',
					content: '确定删除推广商品？删除后将无法获取该商品未知收益',
					showCancel: true,
					cancelText: '取消',
					confirmText: '继续',
					success: res => {
						if(res.confirm){
							this.wwiopt({
								url: '/index.php?app=member_distri&wwi=drop_goods',
								method: 'POST',
								data: {key:this.key,jfx_id:this.item.jfx_id},
								success: res => {
									if(res.data.datas.error){
										uni.showToast({
											title: res.data.datas.error,icon:"none"
										});
										return false;
									}else{
										this.billList.splice(this.itemIndex,1);
										this.$refs.shareBtn.maskClick();
										this.item = [];
									}
								}
							});
						}
					}
				});
			},
			fileImgCanvas:function(e){
				var img = '';
				var _this =this;
				uni.showLoading({
					title:'图片生成中'
				});
				// #ifdef H5
				uni.request({
					url: this.ApiUrl + '/index.php?app=index&wwi=base64EncodeImage',
					method: 'GET',
					data: {
						img: _this.item.goods_image_url
					},
					success: res => {
						img = res.data.datas;
						var userid = uni.getStorageSync('userid');
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#ffffff'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('20'),
							borderWidth: uni.upx2px('80'),
							borderColor: '#ff0036',
							width: this.canWidth,
							height: this.canHeight,
							top: uni.upx2px('78'),
							type: 'image'
						});
						poster.fillAbsText({
							top: uni.upx2px('20'),
							left: uni.upx2px('360'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('40'),
							color: '#FFFFFF',
							fontSize: uni.upx2px('32'),
							align: 'center',
							text: '发现好货 推荐给您',
							bold: true,
							type: 'text',
							textStyle: 'stroke'
						});
						poster.fillAbsText({
							top: uni.upx2px('108'),
							left: uni.upx2px('20'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('46'),
							maxLines: 2,
							color: '#12194C',
							fontSize: uni.upx2px('32'),
							align: 'left',
							text: _this.item.goods_name,
							fontWeight: 'bold',
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('228'),
							left: uni.upx2px('20'),
							color: '#ff0036',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '￥',
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('218'),
							left: uni.upx2px('60'),
							color: '#ff0036',
							fontSize: uni.upx2px('40'),
							align: 'left',
							text: _this.item.goods_price,
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: 360,
							sHeight: 360,
							width: _this.canWidth,
							height: _this.canWidth,
							type: 'image',
							top: uni.upx2px('278')
						});
						poster.drawQRCode({
							content: _this.copyLink,
							sWidth: 360,
							sHeight: 360,
							width: uni.upx2px('200'),
							height: uni.upx2px('200'),
							type: 'image',
							bottom: uni.upx2px('40'),
							left: uni.upx2px('80'),
							background: '#ffffff',
							color: '#12194C'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('150'),
							left: uni.upx2px('350'),
							color: '#12194C',
							fontSize: uni.upx2px('34'),
							align: 'left',
							text: _this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#9e9e9e',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '长按识别小程序码',
							bold: true,
							type: 'text'
						});
						this.ctx.draw();
						_this.toTempFilePath();
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				uni.getImageInfo({
					src:_this.item.goods_image_url,
					success: res => {
						img = res.path;
						var userid = uni.getStorageSync('userid');
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#ffffff'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('20'),
							borderWidth: uni.upx2px('80'),
							borderColor: '#ff0036',
							width: this.canWidth,
							height: this.canHeight,
							top: uni.upx2px('78'),
							type: 'image'
						});
						poster.fillAbsText({
							top: uni.upx2px('20'),
							left: uni.upx2px('360'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('40'),
							color: '#FFFFFF',
							fontSize: uni.upx2px('32'),
							align: 'center',
							text: '发现好货 推荐给您',
							bold: true,
							type: 'text',
							textStyle: 'stroke'
						});
						poster.fillAbsText({
							top: uni.upx2px('108'),
							left: uni.upx2px('20'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('46'),
							maxLines: 2,
							color: '#12194C',
							fontSize: uni.upx2px('32'),
							align: 'left',
							text: _this.item.goods_name,
							fontWeight: 'bold',
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('228'),
							left: uni.upx2px('20'),
							color: '#ff0036',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '￥',
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('218'),
							left: uni.upx2px('60'),
							color: '#ff0036',
							fontSize: uni.upx2px('40'),
							align: 'left',
							text: _this.item.goods_price,
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: 360,
							sHeight: 360,
							width: _this.canWidth,
							height: _this.canWidth,
							type: 'image',
							top: uni.upx2px('278')
						});
						poster.drawQRCode({
							content: _this.copyLink,
							sWidth: 360,
							sHeight: 360,
							width: uni.upx2px('200'),
							height: uni.upx2px('200'),
							type: 'image',
							bottom: uni.upx2px('40'),
							left: uni.upx2px('80'),
							background: '#ffffff',
							color: '#12194C'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('150'),
							left: uni.upx2px('350'),
							color: '#12194C',
							fontSize: uni.upx2px('34'),
							align: 'left',
							text: _this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#9e9e9e',
							fontSize: uni.upx2px('28'),
							align: 'left',
							text: '长按识别小程序码',
							bold: true,
							type: 'text'
						});
						this.ctx.draw();
						_this.toTempFilePath();
					}
				});
				// #endif
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
				uni.hideLoading();
			},
			canDownImg:function(){
				// #ifdef H5
					var src = this.canvasImg;
					var link = document.createElement('a');
					//设置下载的文件名
					link.download = this.item.goods_name;
					link.style.display = 'none';
					//设置下载路径
					link.href = src;
					//触发点击
					document.body.appendChild(link);
					link.click();
					//移除节点
					document.body.removeChild(link);
				// #endif
				// #ifdef MP-WEIXIN
				uni.saveImageToPhotosAlbum({
					filePath: this.canvasImg,
					success: function () {
						uni.showToast({
						  title : "保存成功",
						  icon: "success",
						})
					}
				});
				// #endif
			},
			goodsRecommend:function(){
				this.wwiopt({
					url: '/index.php?app=member_distri&wwi=recommentd_goods',
					method: 'POST',
					data: {key:this.key,jfx_id:this.item.jfx_id},
					success: res => {
						this.checkLogin(res.data.login);
						if(res.data.datas.error){
							uni.showToast({
								title:res.data.datas.error,
								icon:"none"
							});
							return;
						}
						//this.$refs.shareBtn.maskClick();
						this.item.jfx_goods_up = res.data.datas;
						uni.showToast({
							title: '操作成功',icon:"none",
							duration:1500
						});
					}
				});
			},
            copyLinkBtn:function(){
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
                        const textarea = document.createElement("textarea") ;
                        textarea.style.position = 'fixed' ;
                        textarea.style.top = 0 ;
                        textarea.style.left = 0 ;
                        textarea.style.border = 'none' ;
                        textarea.style.outline = 'none' ;
                        textarea.style.resize = 'none';
                        textarea.style.background = 'transparent' ;
                        textarea.style.color = 'transparent';
                        textarea.value = text ;// 修改文本框的内容
                        document.body.appendChild(textarea);
                        textarea.select()// 选中文本
                        try { const msg = document.execCommand('copy') ?
                        '复制成功' : '复制失败' ;
						uni.showToast({
							title: msg,
							icon: 'none'
						});
                        } catch (err) { 						
							uni.showToast({
							title: '复制失败',
							icon: 'none'
						}); }
                        document.body.removeChild(textarea)
				// #endif
			},
			
			
		},
		onPullDownRefresh() {
			this.hasmore = true;
			this.curpage = 1;
			this.loadingType = 0;
			this.Inlimine();
		},
		onReachBottom() {
			if (this.hasmore) {
				this.Inlimine('onbot');
			} else {
				this.loadingType = 2;
			}
		},
		onLoad: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0);
			}
			this.Inlimine();
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			if (!this.key) {
				this.checkLogin(0);
			}
			const res = uni.getSystemInfoSync();
			this.canWidth = res.screenWidth;
			this.canHeight = res.screenHeight;
			this.ctx = uni.createCanvasContext('mycanvas');
			// #ifdef H5
			var title = '推广的商品-'+this.siteTitle;
			document.title = title;			
			// #endif

		},
		onUnload: function() {
			this.hasmore = true,
				this.curpage = 1,
				this.billList = [],
				this.key = '',
				this.loadingType = 3;
		},
		onPageScroll: function(e) {
			if (e.scrollTop > 300) {
				this.showPageTop = true;
			} else if (e.scrollTop < 300) {
				this.showPageTop = false;
			}
		}
	}
</script>

<style>
.bill-goods-list{}
.bill-goods-list .li{background: #FFFFFF; border-bottom: dotted 1px #48CFAE ;}
.bill-goods-list .li:last-child{border: none;}
.bill-goods-list .li .hd{padding: 20upx;}
.bill-goods-list .li .hd .goods-image{width: 120upx; height: 120upx;}
.bill-goods-list .li .hd .goods-image image{width: 120upx; height: 120upx;}
.bill-goods-list .li .hd .goods-info{margin-left: 20upx; flex: 1;}
.bill-goods-list .li .hd .goods-name{font-size: 28upx;}
.bill-goods-list .li .hd .goods-info .goods-price{font-size: 28upx; color: #FF0036;}
.bill-goods-list .li .bd{height: 60upx; background: #f8fffd;}
.bill-goods-list .li .bd .goods-add{ display: flex; color: #0A6DBB; font-size: 28upx; align-items: center; justify-content: center; flex: 1;}
.bill-goods-list .li .bd .goods-del{ display: flex; color: #1BBC9D; font-size: 28upx; align-items: center; justify-content: center; flex: 1;}
.bill-goods-list .li .hd .btn{width: 120upx; margin-left: 10upx; font-size: 28upx; justify-content: center; align-items: center; background: #f8fffd;}
.showCan-mask-info{}
.showCan-mask-info .canvas-img{width: 100%; height: 100%;display: flex; justify-content: center; align-items: center; padding: 20upx 0;}
.showCan-mask-info .canvas-img image{width: 375upx;  box-shadow: 1px 1px 8px 0px;}
.share-icon-text{display: flex; flex-direction: row;}
.share-icon-text .share-li{flex: 1; background: transparent;}
.share-icon-text .share-li:after{border: 0;}
.share-icon-text .share-li{display: flex; justify-content: center; align-items: center; flex-direction: column;}
.share-icon-text .share-li .share-text{height: 60upx; line-height: 60upx; font-size: 24upx; color: #ccc;}
.share-icon-text .share-li .wwi-icon{color: #008000; font-size: 70upx;}
</style>
