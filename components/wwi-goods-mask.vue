<template>
	<view class="wwi-goods-popup newBody">
		<view :class="{'popupMask':showGmask}" @click="maskClick" catchtouchmove="true"></view>
    <view class="wwi-popup-content flex flexcol" :class="{'wwi-popup-view-show':showGmask}">
		<view class="bg">
	  <view class="wwi-popup-head flex flexrow">
               <view class="mask-goods-pic"><image :src="info.goods_image[0]" mode="widthFix"></image></view>
			   <view class="info" v-if="info.goods_info.pintuan_promotion == '1'">
				   <view class="price flex flexrow">￥{{info.goods_info.pintuan_goods_price}} <view class="em">拼团</view> </view>
				   <view class="freight">库存:{{info.goods_info.goods_storage}}件</view>
				   <block v-if="info.goods_info.goods_spec">
				   	<block v-if="info.goods_map_spec.length>0">
					<view class="freight">已选:
					          <block v-for="(spec,k) in info.goods_map_spec" :key="k">
								 <block v-for="(value,k2) in spec.goods_spec_value" :key="k2">
				   				<block v-if="info.goods_info.goods_spec[value.specs_value_id]">"{{value.specs_value_name}}"</block>
				   			</block> 
							  </block>
					</view>
				   	</block>
				   </block>
				   <view class="freight" v-else="">已选:"默认"</view>
			   </view>
			   <view class="info" v-else>
				   <view class="price flex flexrow" v-if="info.goods_info.promotion_type">￥{{info.goods_info.promotion_price}} 
				   <view class="em" v-if="info.goods_info.promotion_type=='groupbuy'">团购</view> 
				   <view class="em" v-if="info.goods_info.promotion_type=='xianshi'">限时折扣</view>
				   <view class="em" v-if="info.goods_info.promotion_type=='spike'">秒杀</view>
				   <view class="em" v-if="info.goods_info.promotion_type=='flash'">闪购</view>
				   <view class="em" v-if="info.goods_info.promotion_type=='sole'">手机专享</view>
				   <view class="em" v-if="info.goods_info.promotion_type=='member'">会员价</view>
				   </view>
				   <view class="price flex flexrow" v-else>￥{{info.goods_info.goods_price}}</view>
				   <view class="freight">库存:{{info.goods_info.goods_storage}}件</view>
				   <block v-if="info.goods_info.goods_spec">
				   	<block v-if="info.goods_map_spec.length>0">
					<view class="freight">已选:
					          <block v-for="(spec,k) in info.goods_map_spec" :key="k">
								 <block v-for="(value,k2) in spec.goods_spec_value" :key="k2">
				   				<block v-if="info.goods_info.goods_spec[value.specs_value_id]">"{{value.specs_value_name}}"</block>
				   			</block> 
							  </block>
					</view>
				   	</block>
				   </block>
				   <view class="freight" v-else="">已选:"默认"</view>
			   </view>
			   <view class="wwi-icon wwi-icon-guanbi" @click="maskClick"></view>
	  </view>
		<scroll-view scroll-y class="wwi-popup-main" style="margin: 0.5em 0; box-sizing: border-box;" :style="{'max-height': windowHeight+'px'}">
			<view class="wwi-popup-viddle">
				<view class="spec flex flexcol" v-if="info.goods_map_spec.length>0" v-for="(item,vi) in info.goods_map_spec" :key="vi">
					<view class="dt">{{item.goods_spec_name}}</view>
					<view class="dd flex flexrow">
						<view class="span" @click="clickSpec(spec,item.goods_spec_value)" :class="{'ok':spec.current}" v-for="(spec,vi2) in item.goods_spec_value" :key="vi2">{{spec.specs_value_name}}</view>
					</view>
				</view>
				<block v-if="info.goods_info.is_virtual == '1'">
				<view class="spec flex flexcol">
					<view class="dt">提货方式</view>
					<view class="dd flex flexrow">
						<view class="span ok">电子兑换券</view>
					</view>
				</view>
				<view class="spec flex flexcol">
					<view class="dt">有效期</view>
					<view class="dd flex flexrow">
						<view class="span ok">即日起 到 {{info.goods_info.virtual_indate_str}} <block v-if="info.goods_info.buyLimitation && info.goods_info.buyLimitation > 0">（每人次限购 {{info.goods_info.buyLimitation}} 件）</block></view>
					</view>
				</view>
				</block>
				<block v-else>
				<view class="spec flex flexcol" v-if="info.goods_info.is_presell == '1'">
					<view class="dt">预售</view>
					<view class="dd flex flexrow">
						<view class="span ok">{{info.goods_info.presell_deliverdate_str}} 日发货</view>
					</view>
				</view>
				<view class="spec flex flexcol" v-if="info.goods_info.is_fcode == '1'">
					<view class="dt">购买类型</view>
					<view class="dd flex flexrow">
						<view class="span ok">F码优先购买（每个F码优先购买一件商品）</view>
					</view>
				</view>
				</block>
			</view>
		</scroll-view>
		<view class="goods-mask-num flex flexrow flexJcs"><view class="title">购买数量</view>
		<view class="box-num"><number-box :num="goodsNum" :min="1" :max="goodsMax" @change="onNumberChange"></number-box></view>
		</view>
		<view class="goods-mask-bottom flex flexrow flexJcs" :class="{'no':noBuy}" v-if="info.goods_info.pintuan_promotion == '1'">
			<view class="cart flex flexcol" @click="_cale('buy')">
				<view class="em">￥{{info.goods_info.pintuan_goods_price}}</view>
				<view class="span">单独购买</view>
				</view>
			<view class="buy flex flexcol"  @click="_cale('buy','1')">
				<view class="em">￥{{info.goods_info.pintuan_price}}</view>
				<view class="span" v-if="logId > 0">参与拼单</view>
				<view class="span" v-else>发起拼单</view>
				</view>
		</view>
		<view class="goods-mask-bottom flex flexrow flexJcs" :class="{'no':noBuy}" v-else>
			<view class="cart" @click="_cale('cart')">加入购物车</view>
			<view class="buy"  @click="_cale('buy')">立即购买</view>
		</view>

		</view>
    </view>
	</view>
</template>

<script>
	import numberBox from './number-box.vue'
	export default {
        components: {
            numberBox
        },
	  data() {
		return {
		  showGmask:false,
		  windowHeight:'',
		  info:{
			  goods_map_spec:{
				  goods_spec_value:[]
			  },
			  goods_image:[],
			  goods_info:[]
		  },
		  goodsNum:1,
		  goodsMax:1,
		  key:'',
		  noBuy:false,
		  goodsId:this.goods
		};
	  },
	  props: {
		goods: {
			type: Number,
			default: 0
		},
		logId: {
			type: Number,
			default: 0
		},
		buyerId: {
			type: Number,
			default: 0
		},
		fid: {
			type: Number,
			default: 0
		},
	  },
	  watch:{
		  goodsId(val){
			  this.goodsId = val;
			  this.$emit('change', val);
			}
	  },
	  methods:{
		show(e) {
		  setTimeout(() => {
			this.key = uni.getStorageSync('key');
			this.goodsId=this.goods;
			this.getGoodsInfo();
			const res = uni.getSystemInfoSync();
			this.windowHeight = res.screenHeight *0.4;
		  }, 0);
		},
		maskClick() {
		  this.pickerCancel();
		},
		pickerCancel() {
		  this.showGmask = false;
		  this.$emit('onCancel');
		},
		pickerConfirm(e) {
		  this.showGmask = false;
		  this.$emit('onConfirm');
		},
		onNumberChange(e){
			this.goodsNum = e;
		},
		_cale(type,pin){
			if(this.noBuy){
				return;
			}
			if(type==='cart'){
				var quantity = this.goodsNum;
				if(!this.key){
                     var goods_info = decodeURIComponent(uni.getStorageSync('goods_cart'));
                     if (goods_info == null) {
                         goods_info = '';
                     }
                     var cart_count = 0;
                     if(!goods_info){
                         goods_info = this.info.goods_info.goods_id+','+quantity;
                         cart_count = 1;
                     }else{
                         var goodsarr = goods_info.split('|');
                         for (var i=0; i<goodsarr.length; i++) {
                             var arr = goodsarr[i].split(',');
                             if(this.contains(arr,this.info.goods_info.goods_id)){
                                        goodsarr.splice(i,1);
                                        goods_info = goodsarr.join('|');
                                        if (this.info.goods_info.goods_storage>=quantity+parseInt(arr[1])) {
                                            quantity = quantity+parseInt(arr[1]);
                                        }
                                        break;

                             }
                         }
                         goods_info+='|'+this.info.goods_info.goods_id+','+quantity;
                         cart_count = goodsarr.length;
                     }
					 uni.showToast({
					 	title:"加入购物车成功" ,icon:"none"
					 })
                     uni.setStorageSync('goods_cart',goods_info);
                     uni.setStorageSync('cart_count',cart_count);
                     this.getCartCount();
					 this.$emit('onCart');
				}else{
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_cart&wwi=cart_add",
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,goods_id:this.info.goods_info.goods_id,quantity:quantity},
						success: res => {
							if(!res.data.datas.error){
								uni.showToast({
									title:"加入购物车成功" ,icon:"none"
								})
								uni.removeStorageSync('cart_count');
                                this.getCartCount();
								this.$emit('onCart');
							}else{
								if(res.data.spike){
									this.noBuy = true;
								}
								uni.showToast({
									title: res.data.datas.error,icon:"none"
								});
							}
						}
					});
				}
				
			}else if(type==='buy'){
				if(!this.key){
					uni.showModal({
						title: '提示',
						content: '请先登入后操作',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if(res.confirm){
								uni.navigateTo({
									url:'/pages/web/login/login'
								})
							}else{
								uni.navigateBack();
							}
							this.showGmask = false;
						}
					});
					return false;
				}
				
				if(this.goodsNum < 1){
					uni.showToast({title: '参数错误',icon:"none"});
					return;
				}
				if (this.goodsNum > parseInt(this.info.goods_info.goods_storage)) {
					uni.showToast({title: '库存不足',icon:"none"});
					return;
				}
				if (this.info.goods_info.is_virtual == '1') {

					 if (parseInt(this.info.goods_info.buyLimitation) > 0 && this.goodsNum > parseInt(this.info.goods_info.buyLimitation)) {
						uni.showToast({title: '超过限购数量！',icon:"none"});
						return;
					}
					uni.request({
						url: this.ApiUrl + '/index.php?app=member_vr_buy&wwi=buy_step1',
						method: 'POST',
						header : {'content-type':'application/x-www-form-urlencoded'},
						data: {key:this.key,cart_id:this.goodsId,quantity:this.goodsNum},
						success: res => {
							if (res.data.datas.error) {
								uni.showToast({title: res.data.datas.error,icon:"none"});
								}else{
									uni.navigateTo({
										url:'/pages/buy/vrbuystep?goodsId='+this.goodsId+'&quantity='+this.goodsNum
									});
								}
						}
					});
					
				 }else{
						var u = '/pages/buy/buystep?goodsId=' + this.goodsId + '&buynum=' + this.goodsNum;
						if (pin) u += '&pintuan=1&logId=' + this.logId + '&buyerId=' + this.buyerId;
						uni.navigateTo({
							url:u
						});
				}
			}
			this.showGmask = false;
		},
		clickSpec:function(e,list){
			if(e.current){
				return false;
			}
			list.forEach(item=>{
				if(item.specs_value_id==e.specs_value_id){
					item.current = true;
				}else{
					item.current = false;
				}
			});
			var curSpec = [];
			this.info.goods_map_spec.forEach(item=>{
				item.goods_spec_value.forEach(vv=>{
					if(vv.current==true){
						curSpec.push(parseInt(vv.specs_value_id) || 0);
					}
				})
			});
			var spec_string = curSpec.sort(function(a, b) { return a - b; }).join("|");
			this.goodsId = this.info.spec_list[spec_string];
			this.getGoodsInfo();
		},
	unixTimeToDateString:function(ts, ex) {
        ts = parseFloat(ts) || 0;
        if (ts < 1) {
            return '';
        }
        var d = new Date();
        d.setTime(ts * 1e3);
        var s = '' + d.getFullYear() + '-' + (1 + d.getMonth()) + '-' + d.getDate();
        if (ex) {
            s += ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        }
        return s;
    },
    buyLimitation:function(a, b) {
        a = parseInt(a) || 0;
        b = parseInt(b) || 0;
        var r = 0;
        if (a > 0) {
            r = a;
        }
        if (b > 0 && r > 0 && b < r) {
            r = b;
        }
        return r;
    },
		getGoodsInfo(){
				this.wwiopt({
					url: "/index.php?app=goods&wwi=goods_detail",
					method: 'GET',
					data: {key:this.key,goods_id:this.goodsId,jfx_id:this.fid},
					success: res => {
						var data = res.data.datas;
						if (!data.error) {
						  this.key = uni.getStorageSync('key');
						  this.goodsMax = parseInt(data.goods_info.goods_storage);
						  this.goodsNum = '1';
						  if(data.goods_info.is_fcode == '1'){
							  this.goodsMax = '1';
						  }
						  if(data.goods_info.goods_storage < 1){
							  this.noBuy = true;
						  }else{
							  this.noBuy = false;
						  }
						  
							if (data.goods_image) {
								var goods_image = data.goods_image.split(",");
								data.goods_image = goods_image;
							} else {
								data.goods_image = [];
							}
							if (data.goods_info.spec_name) {
								let goods_map_spec = [];

								for (let key in data.goods_info.spec_name) {
									var goods_specs = {};
									goods_specs["goods_spec_id"] = key;
									goods_specs['goods_spec_name'] = data.goods_info.spec_name[key];
									if (data.goods_info.spec_value) {
										for (let okey in data.goods_info.spec_value) {
											if (key == okey) {
												var specs_value = [];
												for (let fkey in data.goods_info.spec_value[okey]) {
													var current = false;
													if(data.goods_info.goods_spec[fkey]){
														current = true;
													}
													specs_value.push({
														specs_value_id: fkey,
														specs_value_name: data.goods_info.spec_value[okey][fkey],
														current:current
													})
												}
												goods_specs['goods_spec_value'] = specs_value;
											}
										}
										goods_map_spec.push(goods_specs);
									} else {
										data.goods_info.spec_value = [];
									}
								}
								data.goods_map_spec = goods_map_spec;
							} else {
								data.goods_map_spec = [];
							}
              if (data.goods_info.is_virtual == '1') {
                  data.goods_info.virtual_indate_str = this.unixTimeToDateString(data.goods_info.virtual_indate, true);
                  data.goods_info.buyLimitation = this.buyLimitation(data.goods_info.virtual_limit, data.goods_info.upper_limit);
              }
              if (data.goods_info.is_presell == '1') {
                  data.goods_info.presell_deliverdate_str = this.unixTimeToDateString(data.goods_info.presell_deliverdate);
              }
							this.info = data;
							this.showGmask = true;
						}else{
							uni.showToast({
								title:data.error,icon:"none"
							})
						}
					}
				});
		},
		contains(arr, str) {
	    var i = arr.length;
	    while (i--) {
           if (arr[i] === str) {
	           return true;
           }
	    }
	    return false;
	  }
	  },
	}
</script>

<style>
.wwi-goods-popup{color: #21285d;}
.wwi-goods-popup .popupMask {position: fixed;z-index: 998;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.6);}
.wwi-goods-popup .wwi-popup-content {position: fixed;bottom: 0;left: 0;width: 100%;transition: all 0.3s ease;transform: translateY(100%);z-index: 999;max-height: 100%;}
.wwi-goods-popup .wwi-popup-view-show {transform: translateY(0);}
.wwi-goods-popup .wwi-popup-view {position: relative;bottom: 0;left: 0;width: 100%;height: 238px;background-color: rgba(255, 255, 255, 1);}
.wwi-goods-popup .wwi-popup-head {display: flex;padding: 25upx 20upx;background-color: #fff;position: relative;flex: 1; justify-content: space-between;}
.wwi-goods-popup .wwi-popup-head .mask-goods-pic{background: #FFFFFF; border: 1px solid #eee; position: absolute; margin-top: -80upx; border-radius:10upx ; padding: 6upx;}
.wwi-goods-popup .wwi-popup-head .mask-goods-pic image{width: 180upx; vertical-align: middle; border-radius:10upx ;}
.wwi-goods-popup .wwi-popup-head:after{ content: ''; height: 1px; position: absolute; background: #efefef; bottom: 0; left: 10upx; right: 10upx;}
.wwi-goods-popup .wwi-popup-head .info{flex: 1; margin-left: 210upx; min-height: 4em;}
.wwi-goods-popup .wwi-popup-head .info .price{color: #FF0036; font-size: 40upx; align-items: center;}
.wwi-goods-popup .wwi-popup-head .info .price .em{background: #FF0036; color: #FFFFFF; border-radius:14upx ; font-size: 24upx; padding: 10upx; height: 30upx; line-height: 30upx; margin-left:10upx;}
.wwi-goods-popup .wwi-popup-head .info .freight{ font-size: 26upx; line-height: 35upx; margin-top: 10upx;}
.wwi-goods-popup .wwi-popup-head .wwi-icon{}
.wwi-goods-popup .wwi-popup-content .bg{background: #fff; margin-top: 80upx;}
.wwi-goods-popup .wwi-popup-viddle{padding:0 20upx;}
.wwi-goods-popup .wwi-popup-viddle .spec{padding: 15upx 0; border-bottom: 1px solid #fdfdfd;}
.wwi-goods-popup .wwi-popup-viddle .spec .dt{font-size: 28upx;}
.wwi-goods-popup .wwi-popup-viddle .spec .dd{ flex-wrap: wrap;}
.wwi-goods-popup .wwi-popup-viddle .spec .dd .span{background: #f9f9f9; border-radius:20upx; margin-right: 20upx; padding:5upx 20upx ; margin-top: 15upx; font-size: 24upx; border: 1px solid #FDFDFD;}
.wwi-goods-popup .wwi-popup-viddle .spec .dd .span.ok{color: #FF0036; border-color:#FF0036 ;}
.wwi-goods-popup .goods-mask-num{padding: 20upx 0; margin:0 20upx 40upx 20upx; border-top:1px solid #efefef ;}
.wwi-goods-popup .goods-mask-num .title{font-size: 28upx; }
.wwi-goods-popup .goods-mask-bottom{background: #FF0036; height: 88upx; align-items: center; color: #FFFFFF;}
.wwi-goods-popup .goods-mask-bottom .cart{width: 52%; background: #FF9800; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 28upx;}
.wwi-goods-popup .goods-mask-bottom .buy{flex: 1; display: flex; align-items: center; justify-content: center; font-size: 28upx;}
.wwi-goods-popup .goods-mask-bottom .em{line-height: 35upx; font-size: 26upx;}
.wwi-goods-popup .goods-mask-bottom .span{line-height: 35upx; font-size:26upx;}
.wwi-goods-popup .goods-mask-bottom.no { filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale"); /* Firefox 3.5+ */ -webkit-filter: grayscale(100%); -moz-filter: grayscale(100%); -ms-filter: grayscale(100%); -o-filter: grayscale(100%); filter: grayscale(100%); filter: gray; opacity: 0.8;}
</style>
