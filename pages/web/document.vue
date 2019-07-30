<template>
	<view>
		<view class="wwi-news-content">
			<rich-text :nodes="content"></rich-text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '',
				content: ''
			};
		},
		methods: {

			Inlimine() {
				uni.request({
					url: this.ApiUrl + "/index.php?app=document&wwi=agreement",
					data: {
						code: this.code
					},
					success: res => {
						if (res.data.code == 200) {
							uni.setNavigationBarTitle({
								title: res.data.datas.doc_title
							})
							this.content = res.data.datas.doc_content
						} else {
							uni.showToast({
								title: '文章不存在',
								icon: 'none',
								complete() {
									uni.navigateBack()
								}
							});
						}

					}
				});
			}

		},
		onLoad: function(e) {
			if (e.code) {
				this.code = e.code;
				this.Inlimine()
			} else {
				uni.showToast({
					title: '文章不存在',
					icon: 'none',
					complete() {
						uni.navigateBack()
					}
				});

			}
		}
	}
</script>

<style>
	.wwi-news-content {
		padding: 20upx;
	}
</style>
