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
				newsId: 0,
				content: ''
			};
		},
		methods: {

			Inlimine() {
				this.wwiopt({
					url: "/index.php?app=index&wwi=tzx_show",
					data: {
						article_id: this.newsId
					},
					success: res => {
						if (res.data.code == 200) {
							uni.setNavigationBarTitle({
								title: res.data.datas.article_title
							})
							this.content = res.data.datas.article_content
						} else {
							uni.showToast({
								title: '文章不存在',
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
			}

		},
		onLoad: function(e) {
			if (e.newid) {
				this.newsId = e.newid;
				this.Inlimine()
			} else {
				uni.showToast({
					title: '文章不存在',
					icon: 'none',
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
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
