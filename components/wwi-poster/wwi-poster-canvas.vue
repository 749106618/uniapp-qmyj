<template>
	<view>
		<canvas canvas-id="mycanvas" :style="{'width':width+'px','height':height+'px'}"></canvas>
	</view>
</template>
<script>
import Wwiposter from "./lib/Wwiposter.js";
import Downloader from './lib/downloader';
const util = require('./lib/util');
const downloader = new Downloader();
const MAX_PAINT_COUNT = 5;
	export default {
		components: {
			Wwiposter,
			Downloader
		},
        props: {
            width: {
                type: Number,
                default: 300
            },
            height: {
                type: Number,
                default: 500
            }
        },
		data() {
			return {
			}
		},
		onLoad: function() {

		},
		methods: {
			onCreatePoster() {
				this.ctx = uni.createCanvasContext('mycanvas');
				const poster = new Wwiposter(this.ctx, this.width, this.height);
				console.log(this.ctx)
				poster.background({
					background: '#ffffff'
				});
				poster.doBorder({
					borderRadius: poster.toPx('20'),
					borderWidth: poster.toPx('80'),
					borderColor: '#ff0036',
					width: this.width,
					height: this.height,
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
					text: '发现好货 推荐给您',
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
					text: '新建项目选择小程序项目，选择代码存放的硬盘路径，填入刚刚申请到的小程序的 AppID，给你的项目起一个好听的名字。',
					fontWeight: 'bold',
					type: 'text'
				});
				poster.fillAbsText({
					top: poster.toPx('228'),
					left: poster.toPx('20'),
					color: '#ff0036',
					fontSize: poster.toPx('28'),
					align: 'left',
					text: '￥',
					type: 'text'
				});
				poster.fillAbsText({
					top: poster.toPx('218'),
					left: poster.toPx('60'),
					color: '#ff0036',
					fontSize: poster.toPx('40'),
					align: 'left',
					text: '520.00',
					bold: true,
					type: 'text'
				});
				poster.drawAbsImage({
					url: 'https://demo.shopwwi.vip/data/upload/mall/store/goods/2/2_05584550587458504_360.jpg',
					sWidth: 360,
					sHeight: 360,
					width: this.width,
					height: this.width,
					type: 'image',
					top: poster.toPx('278')
				});
				poster.drawQRCode({
					content: this.WapSiteUrl+'/pages/web/item/item?goods_id=20057',
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
					text: 'ShopWWI商城小程序',
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
				this.ctx.draw()
			}
		}
	}
</script>

<style>
	.canvas-element {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
	}
</style>
