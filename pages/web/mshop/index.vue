<template>
	<view>
		<uni-nav-bar color="#333333" background-color="rgba(255,255,255,0)" search-tsok="true" @click-search="goSearch" disabled="true"
		 placeholder="搜索小店内商品" shadow="false" status-bar="false" hasShadow="true" fixed="true" leftIcon="xiangzuo" leftColor="#ffffff" @clickLeft="clickLeft"
		 rightIcon='wangwang' rightColor="#ffffff" @clickRight="clickRight">
		</uni-nav-bar>
		
		<view class="mshop-header-main">
		<view class="mshop-index-bg">
			<image :src="memberInfo.mshop_bg_image" mode="widthFix"></image>
		</view>
		<view class="mshop-m-info">
			<view class="mshop-btn" @click="shareBtn">关注小店</view>
			<view class="mshop-avatar"><image :src="memberInfo.member_avatar"></image></view>
			<view class="mshop-name">{{memberInfo.mshop_name}}</view>
			<view class="mshop-info">{{memberInfo.mshop_info}}</view>
		</view>
		</view>
			<view class="wwiapp-home-block flex flexcol">
				<view class="tit">店主推荐</view>
				<view class="goods-list flex flexrow">
					<navigator :url="'/pages/web/mshop/item?goodsid='+goods.goods_id+'&fid='+goods.jfx_id+'&msid='+mid" class="li" v-for="(goods,k2) in goodsList" :key="k2">
						<view class="image">
							<image :src="goods.goods_image_url" mode="widthFix" lazy-load></image>
						</view>
						<view class="goods-info">
							<view class="goods-title">{{goods.goods_name}}</view>
							<view class="goods-price">￥{{goods.goods_price}}</view>
						</view>
					</navigator>
				</view>
			</view>
			<view style="height: 120upx;"></view>
		<view class="foot-bottom flex flexAic flexrow">
			<view class="li cur flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-cangku"></view>首页</view>
			<navigator open-type="redirect" :url="'/pages/web/mshop/search?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-yingyongAPP"></view>分类</navigator>
			<navigator open-type="redirect" :url="'/pages/web/mshop/cart?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-baoguo_yidong"></view>购物车</navigator>
			<navigator open-type="redirect" :url="'/pages/web/mshop/member?msid='+mid" class="li flex flexAic flexJcc flexcol"><view class="wwi-icon wwi-icon-gerentouxiang"></view>我的</navigator>
		</view>
				<wwi-mask-up ref="shareBtn" leftText="取消" title="关注小店" bottomText="关闭">
					<view class="share-icon-text">
						<!-- #ifdef MP-WEIXIN -->
						<button class="share-li" open-type="share">
							<view class="wwi-icon wwi-icon-fenxiang" style="color: #4caf50;"></view>
							<view class="share-text">分享给好友</view>
						</button>
						<!-- #endif -->		
						<view class="share-li" @click="fileImgCanvas">
							<view class="wwi-icon wwi-icon-tupian" style="color: #ed5564;"></view>
							<view class="share-text">生成海报</view>
						</view>
						<view class="share-li" @click="copy">
							<view class="wwi-icon wwi-icon-lianjie"  style="color: #007aff;"></view>
							<view class="share-text">复制连接</view>
						</view>
						<view class="share-li" @click="follow" v-if="memberInfo.relation && memberInfo.relation!=3">
							<view class="wwi-icon wwi-icon-shoucang"  style="color: #fb6e52;"></view>
							<view class="share-text" v-if="memberInfo.relation==1">收藏小店</view>
							<view class="share-text" v-else>取消收藏</view>
						</view>
					</view>
		</wwi-mask-up>
		<!-- #ifdef H5 -->
		<wwi-mask-up ref="showCan" title="分享海报" bottomText="长按图片保存到手机" @onConfirm="canDownImg">
			<view class="showCan-mask-info">
				<view class="canvas-img">
				<image :src="canvasImg" mode="widthFix"></image>
				</view>
			</view>
		</wwi-mask-up>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<wwi-mask-up ref="showCan" title="分享海报" bottomText="保存图片到手机" @onConfirm="canDownImg">
			<view class="showCan-mask-info">
				<view class="canvas-img">
				<image :src="canvasImg" mode="widthFix"></image>
				</view>
			</view>
		</wwi-mask-up>		
		<!-- #endif -->

		<view style="width: 0px; height: 0px; overflow: hidden; position: fixed; z-index: -1; left:-100%">
		<canvas canvas-id="mycanvas" :style="{'width':canWidth+'px','height':canHeight+'px'}"></canvas></view>
	</view>
</template>

<script>
	import Wwiposter from "../../../components/wwi-poster/lib/Wwiposter.js";
	import wwiMaskUp from '../../../components/wwi-mask-up.vue';
	import uniNavBar from '../../../components/uni-nav-bar.vue'
	export default {
		data() {
			return {
				mid:'',
				memberInfo:[],
				goodsList:[],
				canWidth:300,
				canHeight:300,
				canvasImg:'',
				key:'',
				copytest:''
			};
		},
		components: {
			uniNavBar,
			wwiMaskUp,
			Wwiposter
		},
		methods:{
			loadData:function(){
				this.wwiopt({
					url: "/index.php?app=distribute&wwi=get_jfx_info",
					method: 'POST',
					data: {jfx_id: this.mid,key:this.key},
					success: res => {
						var data = res.data.datas;
						// #ifdef H5
						var title = data.member_info.member_name + '的小店-' + this.siteTitle;
						document.title = title;
						// #endif
						this.memberInfo = data.member_info;
						this.goodsList = data.goods_list;
					}
				});
			},
			shareBtn:function(){
				this.$refs.shareBtn.show();
			},
			fileImgCanvas:function(){
				this.$refs.shareBtn.pickerCancel();
				if(this.canvasImg){
					this.$refs.showCan.show();
					return false;
				}
				var img = '';
				var _this =this;
				// #ifdef H5
				uni.request({
					url: this.ApiUrl + '/index.php?app=index&wwi=base64EncodeImage',
					method: 'GET',
					data: {
						img: _this.memberInfo.member_avatar
					},
					success: res => {
						uni.showLoading({
							title:'图片生成中'
						});
						img = res.data.datas;
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#03a9f4'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('750'),
							borderWidth: uni.upx2px('80'),
							borderColor: 'rgba(0,188,212,0.47)',
							width: this.canWidth,
							height: this.canHeight,
							top: uni.upx2px('150'),
							type: 'image'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('750'),
							borderWidth: 80,
							borderColor: 'rgba(0,188,212,0.47)',
							width: 1250,
							height: this.canHeight,
							top: uni.upx2px('150'),
							type: 'image'
						});
						poster.fillAbsText({
							top: uni.upx2px('40'),
							left: uni.upx2px('40'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('46'),
							maxLines: 2,
							color: '#ffffff',
							fontSize: uni.upx2px('36'),
							align: 'left',
							text: _this.siteTitle,
							bold:true,
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('158'),
							left: uni.upx2px('280'),
							width: uni.upx2px('450'),
							lineHeight: uni.upx2px('100'),
							maxLines: 1,
							color: '#ffffff',
							fontSize: uni.upx2px('60'),
							align: 'left',
							text: _this.memberInfo.member_name,
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('238'),
							left: uni.upx2px('280'),
							width: uni.upx2px('430'),
							lineHeight: uni.upx2px('50'),
							maxLines:2,
							color: '#ffffff',
							fontSize: uni.upx2px('36'),
							align: 'left',
							text: '这家伙很懒，什么都没有写',
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: res.width,
							sHeight: res.height,
							width: uni.upx2px('200'),
							height: uni.upx2px('200'),
							type: 'image',
							top: uni.upx2px('150'),
							left:uni.upx2px('40'),
							borderRadius: uni.upx2px('200'),
							borderWidth: uni.upx2px('20'),
							borderColor: 'rgba(255,255,255,0.6)'
						});
						poster.drawQRCode({
							content: _this.copytest,
							sWidth: 670,
							sHeight: 670,
							width: uni.upx2px('670'),
							height: uni.upx2px('670'),
							type: 'image',
							top: uni.upx2px('420'),
							left: uni.upx2px('40'),
							background: '#ffffff',
							color: '#12194C',
							borderRadius: uni.upx2px('20'),
							borderWidth: uni.upx2px('20'),
							borderColor: 'rgba(255,255,255,0.6)'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('150'),
							left: uni.upx2px('350'),
							color: '#ffffff',
							fontSize: uni.upx2px('40'),
							align: 'center',
							text: _this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#efefef',
							fontSize: uni.upx2px('28'),
							align: 'center',
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
					src:_this.memberInfo.member_avatar,
					success: res => {
						uni.showLoading({
							title:'图片生成中'
						});
						img = res.path;
						const poster = new Wwiposter(this.ctx, this.canWidth, this.canHeight);
						poster.background({
							background: '#03a9f4'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('750'),
							borderWidth: uni.upx2px('80'),
							borderColor: 'rgba(0,188,212,0.47)',
							width: this.canWidth,
							height: this.canHeight,
							top: uni.upx2px('150'),
							type: 'image'
						});
						poster.doBorder({
							borderRadius: uni.upx2px('750'),
							borderWidth: 80,
							borderColor: 'rgba(0,188,212,0.47)',
							width: 1250,
							height: this.canHeight,
							top: uni.upx2px('150'),
							type: 'image'
						});
						poster.fillAbsText({
							top: uni.upx2px('40'),
							left: uni.upx2px('40'),
							width: uni.upx2px('710'),
							lineHeight: uni.upx2px('46'),
							maxLines: 2,
							color: '#ffffff',
							fontSize: uni.upx2px('36'),
							align: 'left',
							text: _this.siteTitle,
							bold:true,
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('158'),
							left: uni.upx2px('280'),
							width: uni.upx2px('450'),
							lineHeight: uni.upx2px('100'),
							maxLines: 1,
							color: '#ffffff',
							fontSize: uni.upx2px('60'),
							align: 'left',
							text: _this.memberInfo.member_name,
							type: 'text'
						});
						poster.fillAbsText({
							top: uni.upx2px('238'),
							left: uni.upx2px('280'),
							width: uni.upx2px('430'),
							lineHeight: uni.upx2px('50'),
							maxLines:2,
							color: '#ffffff',
							fontSize: uni.upx2px('36'),
							align: 'left',
							text: '这家伙很懒，什么都没有写',
							bold: true,
							type: 'text'
						});
						poster.drawAbsImage({
							url: img,
							sWidth: res.width,
							sHeight: res.height,
							width: uni.upx2px('200'),
							height: uni.upx2px('200'),
							type: 'image',
							top: uni.upx2px('150'),
							left:uni.upx2px('40'),
							borderRadius: uni.upx2px('200'),
							borderWidth: uni.upx2px('20'),
							borderColor: 'rgba(255,255,255,0.6)'
						});
						poster.drawQRCode({
							content: _this.copytest,
							sWidth: 670,
							sHeight: 670,
							width: uni.upx2px('670'),
							height: uni.upx2px('670'),
							type: 'image',
							top: uni.upx2px('420'),
							left: uni.upx2px('40'),
							background: '#ffffff',
							color: '#12194C',
							borderRadius: uni.upx2px('20'),
							borderWidth: uni.upx2px('20'),
							borderColor: 'rgba(255,255,255,0.6)'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('150'),
							left: uni.upx2px('350'),
							color: '#ffffff',
							fontSize: uni.upx2px('40'),
							align: 'center',
							text: _this.siteTitle+'小程序',
							bold: true,
							type: 'text'
						});
						poster.fillAbsText({
							bottom: uni.upx2px('90'),
							left: uni.upx2px('350'),
							color: '#efefef',
							fontSize: uni.upx2px('28'),
							align: 'center',
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
					link.download = this.memberInfo.member_name;
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
			follow:function(){
				if(this.memberInfo.relation=='1'){
					var url = '/index.php?app=member_index&wwi=addfollow';
				}else{
					var url = '/index.php?app=member_index&wwi=delfollow';
				}
				this.wwiopt({
					url:url,
					method: 'POST',
					data: {mid: this.mid,key:this.key},
					success:res=>{
						this.checkLogin(res.data.login);
						if(res.data.datas.error){
							uni.showToast({
								title:res.data.datas.error
							});
							return;
						}
						uni.showToast({
							title:'操作成功',icon:"none"
						});
						this.loadData();
					}
				})
			},
			copy:function(){
				// #ifndef H5
				uni.setClipboardData({
					data: this.copytest,
					success: function() {
						uni.showToast({
							title: '复制连接成功',
							icon: 'none'
						});
					}
				});
				// #endif
				// #ifdef H5
                        var text = this.copytest;
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
			clickRight: function() {
				uni.navigateTo({
					url: '/pages/my/chatinfo?tid='+this.mid
				});
			},
			clickLeft: function() {
				var page = getCurrentPages();
				if(page.length > 1){
					uni.navigateBack();
				}else{
					uni.switchTab({  url:'/pages/index' });
				}
			},
			goSearch:function(){
				uni.redirectTo({
					url:"/pages/web/mshop/search"
				})
			}
		},
		onLoad:function(e){
			if(e.msid){
				this.mid = e.msid;
				uni.setStorageSync('msid',e.msid);
			}else{
				this.mid = uni.getStorageSync('msid');
			}
			if(!this.mid){
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
			const res = uni.getSystemInfoSync();
			this.windowHeight = res.windowHeight;
			this.canWidth = res.screenWidth;
			this.canHeight = res.screenHeight;
			this.ctx = uni.createCanvasContext('mycanvas');
			
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
			this.copytest = this.WapSiteUrl+'/pages/web/mshop/index?msid='+this.mid;
			this.loadData();
		},
		onShareAppMessage:function(){
			return {
				title: this.memberInfo.member_name+'的小店-'+this.siteTitle,
				path: '/pages/web/mshop/index?msid='+this.mid
			}
		}
	}
</script>

<style>
page{background: #F8F8F8;}
.foot-bottom{position: fixed; bottom: 0; left: 0; right: 0;height: 90upx; font-size: 28upx; background: #F8F8F8; z-index: 99; }
.foot-bottom .li{flex: 1; height: 90upx; line-height: 30upx;}
.foot-bottom .li.cur{color: #FF0036;}
.mshop-index-bg{width: 100%; min-height: 300upx; max-height: 500upx; overflow: hidden; background: #000000;}
.mshop-index-bg image{width: 100%; min-height: 300upx; height: auto; vertical-align: middle;}
.mshop-m-info { background: #FFFFFF; position: relative; padding: 20upx; padding-top:100upx;}
.mshop-m-info .mshop-avatar{ background: #FFFFFF; padding: 10upx; border-radius:15upx ; position: absolute; top: -80upx;}
.mshop-m-info .mshop-avatar image{width: 160upx; height: 160upx; vertical-align: middle;}
.mshop-m-info .mshop-name{font-size: 32upx; font-weight: 600;}
.mshop-m-info .mshop-btn{position: absolute; top: 20upx; right: 20upx; font-size: 28upx; color: #ff0036;}
.mshop-m-info .mshop-info{color: #888888; font-size: 28upx;}
.wwiapp-home-block{}
.wwiapp-home-block .tit{height: 50upx; padding: 20upx; display: flex; align-items: center; background: #fff; font-size: 32upx; margin-top: 20upx;}
.wwiapp-home-block .tit:before{width: 14upx; background: #FF0036; margin-right: 20upx; content: ''; height: 30upx;}
.wwiapp-home-block .goods-list{flex-wrap: wrap;}
.wwiapp-home-block .goods-list .li{width: 375upx; background: #FFFFFF; border-top:1px solid #eee ; box-sizing: border-box; overflow: hidden;}
.wwiapp-home-block .goods-list .li:nth-child(even){border-left:1px solid #eee ;}
.wwiapp-home-block .goods-list .li .image{width: 335upx; height: 335upx; margin: 20upx;}
.wwiapp-home-block .goods-list .li .image image{width: 335upx;}
.wwiapp-home-block .goods-list .li .goods-info{margin: 20upx;}
.wwiapp-home-block .goods-list .li .goods-info .goods-title{font-size: 26upx; line-height: 35upx; max-height: 70upx; overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;white-space: normal;}
.wwiapp-home-block .goods-list .li .goods-info .goods-price{font-size: 32upx; color: #FF0036;}
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
