<script>
	export default {
		onLaunch: function () {
			console.log('App Launch')
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁定
			// #endif
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "common/wwi-icon.css";
	@import "common/wwi_main.css";
</style>
