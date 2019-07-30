		Vue.prototype.siteTitle = 'ShopWWI';
		Vue.prototype.siteEmail = 'admin@shopwwi.com';
		Vue.prototype.sitePhone = '4008298669';
		Vue.prototype.siteWechat = 'phcent';
		Vue.prototype.SiteUrl = 'https://demo.shopwwi.com';
		Vue.prototype.ApiUrl = 'https://demo.shopwwi.com/mo_bile';
		Vue.prototype.WapSiteUrl = 'https://demo.shopwwi.com/m';
export default{
		beforeCreate(){
			const domModule = weex.requireModule('dom')
			domModule.addRule('fontFace', {
			    'fontFamily': "wwi-icon",
			    'src': "url('https://at.alicdn.com/t/font_1118159_mwqkcygxayc.ttf')",
			});
		},
	methods: {

		wwiopt(opt){
			opt = opt || {};
			opt.url = opt.url || '';
			opt.data = opt.data || null;
			opt.method = opt.method || 'GET';
			if(opt.method=='POST'){
				opt.header = {'content-type':'application/x-www-form-urlencoded'};
			}else{
				opt.header = opt.header;
			}
			
			opt.dataType = opt.dataType;
			opt.success = opt.success || function () {};
			uni.showLoading({title:'数据加载中...'});
			uni.request({
				url: Vue.prototype.ApiUrl + opt.url,
				data: opt.data,
				method: opt.method,
				header: opt.header,
				dataType: opt.dataType,
				success: function (res) {
					opt.success(res);
				},
				fail: function () {
					uni.showModal({
						title: '提示',
						content: '数据请求失败，请重试',
						showCancel: false,
						confirmText: '好的'
					});
				},
				complete() {
					uni.hideLoading();
				}
			});
		},
		goUrl(e){
			uni.navigateTo({
				url:e.target.attr.url
			})
		}
		
	}
}