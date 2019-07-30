import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.siteTitle = '千盟商城';
Vue.prototype.siteEmail = 'admin@shopwwi.com';
Vue.prototype.sitePhone = '4008298669';
Vue.prototype.siteWechat = 'phcent';
Vue.prototype.SiteUrl = 'https://www.qianmeng1688.com';
Vue.prototype.ApiUrl = 'https://www.qianmeng1688.com/mo_bile';
Vue.prototype.WapSiteUrl = 'https://www.qianmeng1688.com/m';
Vue.prototype.checkLogin = function(state) {
	if (state == 0) {
		uni.removeStorageSync('key');
		uni.navigateTo({
			url: '/pages/web/login'
		});
		return false;
	} else {
		return true;
	}
};
Vue.prototype.checksellerLogin = function(state) {
	if (state == 0) {
		uni.removeStorageSync('seller_key');
		uni.navigateTo({
			url: '/pages/seller/login'
		});
		return false;
	} else {
		return true;
	}
};
Vue.prototype.wwiopt = function(opt){
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
	
};
Vue.prototype.isEmptyObject = function(obj) {
	for (var key in obj) {
		return false;
	}
	return true;
};
Vue.prototype.tapPicView = function(obj) {
	uni.previewImage({
		urls:obj
	})
};
Vue.prototype.addCookie = function(name,value,expireHours){
	var cookieString=name+"="+escape(value)+"; path=/";
	if(expireHours>0){
		var date=new Date();
		date.setTime(date.getTime()+expireHours*3600*1000);
		cookieString=cookieString+";expires="+date.toGMTString();
	}
	document.cookie=cookieString;
};
Vue.prototype.getCookie = function(name){
	var strcookie=document.cookie;
	var arrcookie=strcookie.split("; ");
	for(var i=0;i<arrcookie.length;i++){
	var arr=arrcookie[i].split("=");
	if(arr[0]==name)return unescape(arr[1]);
	}
	return null;
};
Vue.prototype.delCookie = function(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
};
Vue.prototype.getQueryString = function(name){
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
};
Vue.prototype.getCartCount = function() {
	var key = uni.getStorageSync('key');
	var cartnum = '' + Number(uni.getStorageSync('cart_count'));
	if (key) {
		uni.request({
			url: this.ApiUrl + '/index.php?app=member_cart&wwi=cart_count',
			method: 'POST',
			header: {'content-type': 'application/x-www-form-urlencoded'	},
			data: {key: key},
			success: res => {
				if (typeof(res.data.datas.cart_count) != 'undefined') {
					uni.setStorageSync('cart_count', res.data.datas.cart_count);
					cartnum = '' + Number(res.data.datas.cart_count);
					
				}
			}
		});
	}
	setTimeout(
	function(){
	uni.removeTabBarBadge({ index: 2,success:function(){
		if(cartnum >0){
			if(cartnum > '99'){
				cartnum = '99';
			}
			uni.setTabBarBadge({index: 2,text: cartnum});
		}
	} });		
	},100)

};
Vue.prototype.getChatCount = function(key) {
	var key = uni.getStorageSync('key');
	if (key) {
		uni.request({
			url: this.ApiUrl + '/index.php?app=member_chat&wwi=get_msg_count',
			data: {
				key: key
			},
			success: res => {
				if (res.data.datas > 0) {
					uni.setStorageSync('chat_count', res.data.datas);
				}else{
					uni.removeStorageSync('chat_count');
				}
			}
		});
	}
};
App.mpType = 'app'

const app = new Vue({
		store,
    ...App
})
app.$mount();
			// #ifdef H5
		   var okey = uni.getStorageSync('key');
			var ref_url = document.referrer;
			if (ref_url) {
				ref_url = ref_url.replace("timeline", '0');
				ref_url = ref_url.replace("groupmessage", '0');
				ref_url = ref_url.replace("singlemessage", '0');
				ref_url = ref_url.replace("isappinstalled", '1');
				ref_url = encodeURIComponent(ref_url);
			}
			var userName = Vue.prototype.getQueryString('username');
			var l_inviteid =uni.getStorageSync('invite')?uni.getStorageSync('invite'):'0';
			var ua = navigator.userAgent.toLowerCase();
			if (!okey && !userName && ua.match(/MicroMessenger/i) == 'micromessenger') {
			   window.location.href = Vue.prototype.ApiUrl+'/index.php?app=connect&wwi=index&ref_url='+ref_url+'&inviteid='+ l_inviteid;
			}
				// #endif