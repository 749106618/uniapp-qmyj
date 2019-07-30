<template>
	<view class="newBody">
		<view style="padding-bottom: 80upx;">
				<view v-if="!cartList.cart_list.length" class="wwi-nodata">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-weibiaoti--"></view>
						<view class="dl">
							<view class="dt">购物车空空如也~~</view>
						</view>
					</view>
				</view>
				<view class="login-cart" v-if="!key && cartList.cart_list.length">
					<view class="title flex flexAic flexJcc">登入后购物车商品会自动添加到你的购物车</view>
					<view class="btn flex flexrow flexAic flexJcc">
						<navigator url="/pages/web/login" class="span">登入</navigator>
						<navigator url="/pages/web/register" class="span" style="color: #FF0036;">注册</navigator></view>
				</view>
		<view class="wwiapp-cart-container flex flexcol" v-for="(item,index) in cartList.cart_list" :key="index" v-if="cartList.cart_list.length > 0">
			<view class="wwiapp-cart-store flex flexcol">
				<view class="dt flex flexrow" style="justify-content: space-between;">
				<view class="store-hd flex flexrow">
				 <view class="wwi-icon wwi-icon-duihao click" :class="{ok:item.click}" @click="selectItem('store',item)"></view>
				<view class="wwi-icon wwi-icon-dianpu"></view>
				<view class="shop">{{item.store_name}}</view>
				</view>
				<view class="handle flex flexrow" @click="showMulLinkageThreePicker(item)" v-if="item.voucher">
					<view class="wwi-icon wwi-icon-qiaquan"></view>
					<view class="span">领券</view>
				</view>
				</view>
				<view class="dd flex flexrow" v-if="item.free_freight">
					<view class="em">免运费</view>
					<view class="span">{{item.free_freight}}</view>
				</view>
				<view class="dd flex flexrow" v-if="item.mansong" @click="mansong(item)">
						<view class="em">满即送</view>
						<view class="span" :class="{nohide:item.msclick}" style="flex-wrap: wrap;">
							<view class="flex i flexrow" style="height: 40upx; line-height: 40upx; width: 100%;" v-for="(k,v) in item.mansong" :key="v">{{k.desc}}
							<block v-if="k.url">
							<image style="width: 40upx; height: 40upx;" :src="k.url"></image>
							</block></view>
						</view>
						<view style="color: #ccc;" class="wwi-icon" :class="{'wwi-icon-jiantou_liebiaozhankai':item.msclick,'wwi-icon-jiantou_liebiaoshouqi':!item.msclick}"></view>
				</view>
				<view class="dd flex flexrow" v-if="item.jjg && item.jjg.jjgRank &&item.jjg.price >=item.jjg.mincost">
					<view class="em">加价购</view>
					<view class="span">已购满 {{item.jjg.mincost}} 元，再加 {{item.jjg.plus}} 元，<view class="b-btn" style="color: #ff0036; margin-left: 10upx;" @click="selectJjg(item.jjg.goods,item.jjg.maxcou)">点击选择换购</view></view>
				</view>
				<view class="jjg-goods" v-if="item.jjg">
					<view class="jjg-item flex flexrow" v-if="jjg.click" v-for="(jjg,v) in item.jjg.goods" :key="v">
					<view class="jjg-gpic"><image :src="jjg.imgurl"></image></view>
					<view class="jjg-info">
						<view class="jjg-name">{{jjg.name}}<view class="pp">换购</view><view class="em">x 1</view></view>
						<view class="price flex flexrow">&yen;{{jjg.price}}<view class="del">&yen;{{jjg.oldprice}}</view></view>
					</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-cart-item flex flexcol">
				<view class="cart-litemw-cnt" :class="{'jjg':kk.jjgRank> 0}" v-for="(kk,vv) in item.goods" :key="vv">
					<view class=" flex flexrow">
					<view class="wwi-icon wwi-icon-duihao click" :class="{ok:kk.click}" @click="selectItem('goods',kk,item)"></view>
					<navigator :url="'/pages/web/item?goodsid='+kk.goods_id" class="goods-pic"><image :src="kk.goods_image_url"></image>
					<view class="no-storage" v-if="Number(kk.goods_num) > Number(kk.goods_storage) || Number(kk.goods_storage) < 1">库存不足</view>
					</navigator>
					<view class="goods-info flex flexcol">
						<view class="goods_name flex flexrow"><navigator :url="'/pages/web/item?goodsid='+kk.goods_id" class="goods-name">{{kk.goods_name}}</navigator>
						<view class="wwi-icon wwi-icon-shanchu" @click="del(kk)"></view> </view>
						<view class="goods-spec">{{kk.goods_spec}}</view>
						<view class="goods-subtotal flex flexrow flexJcs">
							<view class="goods-price flex flexrow">
								<view class="price flex flexrow"><view class="sapn">￥</view><view class="em">{{kk.goods_price}}</view></view>
								<view class="sale-price flex flexrow">
									<view class="em" v-if="kk.groupbuy_info && kk.groupbuy_info.length">团购</view>
									<view class="em" v-if="kk.promotion_info && kk.promotion_info.promotion_type==2">限时折扣</view>
									<view class="em" v-if="kk.promotion_info && kk.promotion_info.promotion_type==3">秒杀</view>
									<view class="em" v-if="kk.promotion_info && kk.promotion_info.promotion_type==4">闪购</view>
									<view class="em" v-if="kk.sole_info && kk.sole_info.length">手机专享</view>
									</view>
							</view>
							<view class="num"><number-box :num="kk.goods_num" :min="1" :max="kk.goods_storage" v-on:change="onNumberChange($event,kk)"></number-box>
								</view>
						</view>
					</view>
					</view>
					<view class="goods-gift" v-if="kk.gift_list && kk.gift_list.length > 0">
						<view class="span flex flexrow" v-for="(sk,sv) in kk.gift_list" :key="sv"><view class="em">赠品</view>{{sk.gift_goodsname}} x {{sk.gift_amount}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom flex flexrow"  v-if="cartList.cart_list.length > 0 &&key">
			<view class="wwi-icon wwi-icon-duihao click" :class="{ok:cartList.click}" @click="selectItem('all')"></view>
			<view class="total flex flexrow"><view class="dt">合计：</view> <view class="dd flex flexrow">￥<view class="em">{{cartList.sum}}</view></view></view>
			<view class="btn" :class="{no:!btnGo}" @click="goBuy">确认信息</view>
		</view>
		</view>
		<wwi-mask-up ref="wwiMaskUp" leftText="取消" title="领取代金券" >
			<view class="wwiapp-voucher-list">
				<view v-if="voucherList.length <= 0" class="wwi-nodata" style="position: sticky;padding: 2em 0;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">暂无代金券可以领取</view>
							<view class="dd">店铺代金券可享受商品折扣</view>
						</view>
					</view>
				</view>
				<view class="li flex flexrow" v-for="(vc,ck) in voucherList" :key="ck">
					<view class="dl">
						<view class="money flex flexrow">面额<view class="em">{{vc.voucher_t_price}}</view>元</view>
						<view class="need">需消费{{vc.voucher_t_limit}}使用</view>
						<view class="time">至{{vc.voucher_t_end_date}}前使用</view>
					</view>
					<view class="btn" @click="getFreeVoucher(vc)"><view class="span">领取</view></view>
				</view>
			</view>
		</wwi-mask-up>
		<wwi-mask-up ref="wwiJjg" leftText="取消" title="选择换购商品" >
			<view class="jjg-goods jjg-goods">
				<view v-if="jjgGoods.length <= 0" class="wwi-nodata" style="position: sticky;padding: 2em 0;">
					<view class="no-main">
						<view class="wwi-icon wwi-icon-zhangdan_quxiao"></view>
						<view class="dl">
							<view class="dt">未查询到可用换购</view>
							<view class="dd">你可以稍后再试,或勾选换购产品</view>
						</view>
					</view>
				</view>
					<view class="jjg-item flex flexrow" v-for="(jjg,vvj) in jjgGoods" :key="vvj" @click="selectJjgGoods(jjg)">
					<view class="wwi-icon wwi-icon-anniu_xuanzhong" :class="{ok:jjg.click}"></view>
					<view class="jjg-gpic"><image :src="jjg.imgurl"></image></view>
					<view class="jjg-info">
						<view class="jjg-name">{{jjg.name}}<view class="pp">换购</view><view class="em">x 1</view></view>
						<view class="price flex flexrow">&yen;{{jjg.price}}<view class="del">&yen;{{jjg.oldprice}}</view></view>
					</view>
					</view>
				</view>
		</wwi-mask-up>
	</view>
</template>

<script>
	import numberBox from '../components/number-box.vue';
	import wwiMaskUp from '../components/wwi-mask-up.vue';
	export default {
		data() {
			return {
				key: '',
				cartList:{cart_list:{ goods:{	gift_list:[] }}},
				btnGo:true,
				voucherList:[],
				goodsArray:[],
				jjgGoods:[],
				maxcou:0
			}
		},
		components: {
			numberBox,
			wwiMaskUp
		},
		methods:{
			Inlimine:function(){
				if(this.key){
					this.wwiopt({
						url: "/index.php?app=member_cart&wwi=cart_list",
						method: 'POST',
						data: {key:this.key},
						success: res => {
							if(this.checkLogin(res.data.login)){
								if(!res.data.datas.error){
									if(res.data.datas.cart_list.length == 0){
										uni.setStorageSync('cart_count',0);
									}
									this.$set(res.data.datas,'click',true);
									res.data.datas.cart_list.forEach(item=>{
										this.$set(item,'click',true);
										this.$set(item,'msclick',true);
										let jjgPrice = parseFloat("0.00");
										let jjgRank = 0;
										    item.goods.forEach(item2=>{
												this.$set(item2,'click',true);
												if(item2.jjgRank > 0){
													jjgPrice += parseFloat(item2.goods_total);
													jjgRank=item2.jjgRank;
												}
											});
										if(jjgRank > 0){
											var r = {
												jjgRank: jjgRank,
												id:1,
												maxcou:0,
												storeId: res.data.datas.jjgDetails.cou[jjgRank].info.store_id,
												mincost: res.data.datas.jjgDetails.cou[jjgRank].firstLevel.mincost,
												plus: res.data.datas.jjgDetails.cou[jjgRank].firstLevel.plus,
												price:jjgPrice.toFixed(2),
												goods:[]
											};
											
											if(jjgPrice >= r.mincost ){
												let jjkh = res.data.datas.jjgDetails.cou[jjgRank].levels;
												for (var v in jjkh){
													if (jjgPrice < jjkh[v].mincost) {
														break;
													}
													r.id = v;
													r.mincost = jjkh[v].mincost;
													r.plus = jjkh[v].plus;
													r.maxcou = jjkh[v].maxcou;
												}
												
												let jjg_goods = res.data.datas.jjgDetails.cou[jjgRank].levelSkus[r.id];
												for (var kk in jjg_goods){
													jjg_goods[kk].name = res.data.datas.jjgDetails.items[kk].name;
													jjg_goods[kk].oldprice = res.data.datas.jjgDetails.items[kk].price;
				                                    jjg_goods[kk].imgurl = res.data.datas.jjgDetails.items[kk].imgUrl;
													jjg_goods[kk].storage  = res.data.datas.jjgDetails.items[kk].storage;
													jjg_goods[kk].click  = 0;
													}
													r.goods = jjg_goods;
												
											}
											this.$set(item,'jjg',r);
										}		
									})
									this.cartList = res.data.datas;
								 }else{
									 uni.showToast({
									 	title: res.data.datas.error,icon:"none"
									 });
								 }
							}
						}
					});
				}else{
					
        var goods = decodeURIComponent(uni.getStorageSync('goods_cart'));
        if (goods != null) {
            var goodsarr = goods.split('|');
        } else {
            goodsarr = {};
        }
        var cart_list = new Array();
        var sum = 0;
        if(goodsarr.length>0){
            for(var i=0;i<goodsarr.length;i++){
                var info = goodsarr[i].split(',');
                if (isNaN(info[0]) || isNaN(info[1])) continue;
                var data = this.getGoods(info[0], info[1]);
				
                 if (this.isEmptyObject(data)) continue;
                if (cart_list.length > 0) {
                    var has = false
                    for (var j=0; j<cart_list.length; j++) {
                        if (cart_list[j].store_id == data.store_id) {
                            cart_list[j].goods.push(data);
                            has = true
                        }
                    }
                    if (!has) {
                        var datas = {};
                        datas.store_id = data.store_id;
                        datas.store_name = data.store_name;
                        datas.goods_id = data.goods_id;
                        var goods = new Array();
                        goods = [data];
                        datas.goods = goods;
                        cart_list.push(datas);
                    }
                } else {
                    var datas = {};
                    datas.store_id = data.store_id;
                    datas.store_name = data.store_name;
                    datas.goods_id = data.goods_id;
                    var goods = new Array();
                    goods = [data];
                    datas.goods = goods;
                    cart_list.push(datas);
                }
                
                sum += parseFloat(data.goods_sum);
            }
        }
		this.cartList = {cart_list:cart_list, sum:sum.toFixed(2), cart_count:goodsarr.length, check_out:false};
		
				}
			},
			onNumberChange(value,e) {
				if(value==e.goods_num){
					return false;
				}
				if(this.key){
				this.wwiopt({
					url: "/index.php?app=member_cart&wwi=cart_edit_quantity",
					method: 'POST',
					data: {key:this.key,cart_id:e.cart_id,quantity:value},
					success: res => {
						if(!res.data.datas.error){
							e.goods_num = res.data.datas.quantity;
							e.goods_total = res.data.datas.total_price;
							this.calculateTotalPrice();
							}else{
								uni.showToast({	title: res.data.datas.error,icon:"none"});
							}
					}
				});
				}else{
					var goods = decodeURIComponent(uni.getStorageSync('goods_cart'));
					
					if (goods != null) {
						var goodsarr = goods.split('|');
					} else {
						goodsarr = {};
					}
					var goods_id = e.goods_id;
					for(var i=0;i<goodsarr.length;i++){
						var info = goodsarr[i].split(',');
						if (info[0] == goods_id) {
							info[1] = value;
							goodsarr[i] = info[0] + ',' + info[1];
						}
					}
					uni.setStorageSync('goods_cart',goodsarr.join('|'));
					e.goods_num = value;
				}
			},
			del(e){
				if(this.key){
				this.wwiopt({
					url: "/index.php?app=member_cart&wwi=cart_del",
					method: 'POST',
					data: {key:this.key,cart_id:e.cart_id},
					success: res => {
                    if(this.checkLogin(res.data.login)){
                        if(!res.data.datas.error && res.data.datas == "1"){
                            this.Inlimine();
							uni.removeStorageSync('cart_count')
                            // 更新购物车中商品数量
                            this.getCartCount();
                        }else{
							uni.showToast({
								title: res.data.datas.error,icon:"none"
							});
                        }
                    }
					}
				});
				}else{
                    var goods_id = e.goods_id;
					var goods = decodeURIComponent(uni.getStorageSync('goods_cart'));
					if (goods != null) {
						var goodsarr = goods.split('|');
					} else {
						goodsarr = {};
					}
                    for(var i=0;i<goodsarr.length;i++){
                        var info = goodsarr[i].split(',');
                        if (info[0] == goods_id) {
                            goodsarr.splice(i,1);
                            break;
                        }
                    }
                    uni.setStorageSync('goods_cart',goodsarr.join('|'));
                    uni.setStorageSync('cart_count',goodsarr.length);
					this.Inlimine();
				}

			},
			selectItem(e,item ,top){
				if(e=='store'){
					if(item.click==true){
						item.click = false;
						item.goods.forEach(v=>{v.click = false;});
					}else{
						item.click = true;
						item.goods.forEach(v=>{v.click = true;});
					}
				}else if(e=='goods'){
					if(item.click==true){
						item.click = false;
					}else{
						item.click = true;
					}
						var okGo=true;
						top.goods.forEach(god=>{
							if(god.click==false){
								okGo = false;
							}
						});
						if(okGo){
							top.click = true;
						}else{
							top.click = false;
						}						
				}else{
					if(this.cartList.click==true){
						this.cartList.click = false;
						this.cartList.cart_list.forEach(bb=>{
							bb.click = false;
								bb.goods.forEach(mm=>{
									mm.click = false;
								})
						});
					}else{
						this.cartList.click = true;
						this.cartList.cart_list.forEach(bb=>{
							bb.click = true;
								bb.goods.forEach(mm=>{
									mm.click = true;
								})
						});
					}
				}
				var okALL = true;
				this.cartList.cart_list.forEach(all=>{
					if(all.click==false){
						okALL = false;
					}
				});
				if(okALL){
					this.cartList.click = true;
				}else{
					this.cartList.click = false;
				}
				this.calculateTotalPrice();
			},
			calculateTotalPrice(){
				var totalPrice = parseFloat("0.00");
				var btnGo = false;
				this.cartList.cart_list.forEach(bb=>{
					let jjgPrice = parseFloat("0.00");
					let jjgRank = 0;
						bb.goods.forEach(mm=>{
							if(mm.click == true){
								totalPrice += parseFloat(mm.goods_total);
								btnGo =true;
							if(mm.jjgRank > 0){
								jjgPrice += parseFloat(mm.goods_total);
								jjgRank=mm.jjgRank;
							}
							}
						});
					if(jjgRank > 0){
						var r = {
							jjgRank: jjgRank,
							id:1,
							maxcou:0,
							storeId: this.cartList.jjgDetails.cou[jjgRank].info.store_id,
							mincost: this.cartList.jjgDetails.cou[jjgRank].firstLevel.mincost,
							plus: this.cartList.jjgDetails.cou[jjgRank].firstLevel.plus,
							price:jjgPrice.toFixed(2),
							goods:[]
						};
						
						if(jjgPrice >= r.mincost ){
							let jjkh = this.cartList.jjgDetails.cou[jjgRank].levels;
							for (var v in jjkh){
								if (jjgPrice < jjkh[v].mincost) {
									break;
								}
								r.id = v;
								r.mincost = jjkh[v].mincost;
								r.plus = jjkh[v].plus;
								r.maxcou = jjkh[v].maxcou;
							}
							
							let jjg_goods = this.cartList.jjgDetails.cou[jjgRank].levelSkus[r.id];
							for (var kk in jjg_goods){
								jjg_goods[kk].name = this.cartList.jjgDetails.items[kk].name;
								jjg_goods[kk].oldprice = this.cartList.jjgDetails.items[kk].price;
								jjg_goods[kk].imgurl = this.cartList.jjgDetails.items[kk].imgUrl;
								jjg_goods[kk].storage  = this.cartList.jjgDetails.items[kk].storage;
								jjg_goods[kk].click  = 0;
								}
								r.goods = jjg_goods;
						}
						bb.jjg = r;
						}
				});
				
				this.cartList.sum = totalPrice.toFixed(2);
				if(btnGo== true){
					this.btnGo = true;
				}else{
					this.btnGo = false;
				}
			},
			mansong(e){
				if(e.msclick == true){
					e.msclick = false;
				}else{
					e.msclick = true;
				}
			},
            showMulLinkageThreePicker(e) {
				if(e.voucher){
					this.voucherList = e.voucher;
					
					this.$refs.wwiMaskUp.show();
				}
                
            },
			getFreeVoucher(e) {
			if (!this.key) { this.checkLogin(0); return; }
			this.wwiopt({
				url: "/index.php?app=member_voucher&wwi=voucher_freeex",
				method: 'POST',
				data: {tid:e.voucher_t_id,key:this.key},
				success: res => {
					this.checkLogin(res.data.login);
					var msg = '领取成功';
					if(res.data.datas.error){
						msg = '领取失败' + res.data.datas.error;
					}
					uni.showToast({
						title: msg,icon:"none"
					});
				}
			});
			},
			getGoods(goods_id, goods_num){
				var data = {
					cart_id:'',
					store_id:'',
					store_name:'',
					goods_id:'',
					goods_name:'',
					goods_price:"",
					goods_num:'',
					goods_image_url:"",
					goods_sum:""
				};
				this.wwiopt({
					url: '/index.php?app=goods&wwi=goods_detail',
					data: {goods_id:goods_id},
					success: res => {
						var result =res.data;
						if (result.datas.error) {
							return false;
						}
						var pic = result.datas.goods_image.split(',');
							data.cart_id = goods_id;
							data.store_id = result.datas.store_info.store_id;
							data.store_name = result.datas.store_info.store_name;
							data.goods_id = goods_id;
							data.goods_name = result.datas.goods_info.goods_name;
							data.goods_price = result.datas.goods_info.goods_price;
							data.goods_num = goods_num;
							data.goods_image_url = pic[0];
							data.goods_sum = (parseInt(goods_num)*parseFloat(result.datas.goods_info.goods_price)).toFixed(2);
							
					}
				});
				return data;
			},
			goBuy:function(){
				if(!this.btnGo){
					return false;
				}
				var cartIdArr = [];
				var jjg = [];
				this.cartList.cart_list.forEach(bb=>{
					bb.goods.forEach(mm=>{
						if(mm.click==true){
							var cartIdNum = mm.cart_id+"|"+ mm.goods_num;
							cartIdArr.push(cartIdNum);
						}
					});
					if(bb.jjg && bb.jjg.jjgRank > '0'){
						for(let k in bb.jjg.goods){
							if(bb.jjg.goods[k].click){
								var jjgIdNum = bb.jjg.jjgRank+"|"+ bb.jjg.id +"|"+ k;
								jjg.push(jjgIdNum);
							}
						}
					}
				});
            var cart_id = cartIdArr.toString();
			var jjg_id = jjg.toString();
			var url = '/pages/buy/buystep?ifcart=1&cartId='+cart_id;
			if(!this.isEmptyObject(jjg)){
				url += '&jjg='+jjg_id;
			}
			uni.navigateTo({
				url: url
			});
			},
			selectJjg:function(e,v){
				if(e){
					this.jjgGoods = e;
					this.maxcou = v;
					this.$refs.wwiJjg.show();
				}
				
			},
			selectJjgGoods:function(e){
				if(e.storage < '1' && !e.click){
					uni.showToast({
						title: '库存不足',icon:'none'
					});
					return false;
				}
				if(this.maxcou > '0' && !e.click){
					var nowcou = 0;
					for(let jj in this.jjgGoods){
						if(this.jjgGoods[jj].click){
							nowcou +=1;
						}
					}
					if(nowcou >= this.maxcou){
					uni.showToast({
						title: '您只能选择'+this.maxcou+'件换购商品',icon:'none'
					});
					return false;
					}
				}

				e.click = !e.click;
				var totalPrice = parseFloat("0.00");
				this.cartList.cart_list.forEach(bb=>{
						bb.goods.forEach(mm=>{
							if(mm.click == true){
								totalPrice += parseFloat(mm.goods_total);
							}
						});
						if(bb.jjg && !this.isEmptyObject(bb.jjg.goods)){
							for(let k in bb.jjg.goods){
								if(bb.jjg.goods[k].click){
									totalPrice += parseFloat(bb.jjg.goods[k].price);
								}
							}
						}
				});
				
				this.cartList.sum = totalPrice.toFixed(2);
			}
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
		},
		onShow: function() {
			this.key = uni.getStorageSync('key');
			this.Inlimine();
			this.getCartCount();
			// #ifdef H5
			document.title = '购物车-'+this.siteTitle;
			// #endif
		}
	}
</script>

<style>
page{background: #f8f8f8;height: auto; min-height: 100%;}
.wwiapp-cart-container{ background: #fff; margin-bottom:20upx;}
.wwiapp-cart-container .wwiapp-cart-store{border-bottom: solid 1px #EEE;}
.wwiapp-cart-container .wwiapp-cart-store .dt{height: 72upx;}
.wwiapp-cart-container .wwiapp-cart-store .store-hd{align-items: center;}
.wwiapp-cart-container .wwiapp-cart-store .store-hd .shop{font-size: 32upx; margin-left: 10upx}

.newBody .click{background: #F5F5F5; border: 2upx solid #ccc; border-radius:50%; font-size: 28upx; font-weight: bold; padding: 5upx; width:28upx; height: 28upx; margin: 0 20upx; color: #eaeaea;}
.newBody .click.ok{background: #FF0036; color: #FFFFFF; border-color:#FF0036 ;}
.wwiapp-cart-container .wwiapp-cart-store .handle{ border-left: solid 2upx #EEE;background-color: #FCFCFC; height: 72upx; padding: 0 20upx; align-items: center; color: #888; }
.wwiapp-cart-container .wwiapp-cart-store .handle .span{font-size: 32upx;}
.wwiapp-cart-container .wwiapp-cart-store .dd{border-top: solid 2upx #EEE;padding: 5upx 20upx;}
.wwiapp-cart-container .wwiapp-cart-store .dd .em{background: #FF0036; font-size: 25upx; color: #FFFFFF;margin: auto 5upx; padding: 5upx 10upx; border-radius:14upx ;}
.wwiapp-cart-container .wwiapp-cart-store .dd .span{font-size: 24upx; margin-left: 15upx; flex: 1; display: flex; align-items: center;  line-height: 35upx; color: #888888;}
.wwiapp-cart-container .wwiapp-cart-store .dd .span.nohide{height: 40upx; overflow: hidden;}
.wwiapp-cart-container .wwiapp-cart-store .dd .span .i{width: 100%;}
.wwiapp-cart-item{border-bottom: solid 2upx #EEE;}
.wwiapp-cart-item .cart-litemw-cnt{ padding: 20upx 0; border-bottom: solid #EEE 2upx;}
.wwiapp-cart-item .cart-litemw-cnt.jjg{background: #fffffb;}
.wwiapp-cart-item .cart-litemw-cnt .goods-pic{width: 140upx; height: 140upx; border-radius:14upx; padding: 10upx;    border: solid 2upx #EEE; position: relative;}
.wwiapp-cart-item .cart-litemw-cnt .goods-pic image{width: 100%; height: 100%; border-radius:15upx; }
.wwiapp-cart-item .cart-litemw-cnt .goods-pic .no-storage{position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.5); color: #ffeb3b; font-size: 28upx;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info{flex: 1; margin-left: 20upx;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-name{ font-size:28upx;line-height:35upx;height:70upx;overflow:hidden;margin-bottom:10upx; flex: 1;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods_name .wwi-icon{color: #888; width: 80upx; display: flex; align-items: center; justify-content: center;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-spec{font-size: 24upx; height: 40upx; color: #888;text-overflow: ellipsis;overflow: hidden; white-space: nowrap; width: 70%;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal{margin-right: 20upx;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal .goods-price{color: #FF0036; font-weight:600 ; align-items: center; }
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal .goods-price .price{ align-items: baseline;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal .goods-price .price .sapn{align-items: center; font-size: 24upx;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal .goods-price .price .em{font-size: 32upx;align-items: center;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal .goods-price .sale-price{color: #fff;}
.wwiapp-cart-item .cart-litemw-cnt .goods-info .goods-subtotal .goods-price .sale-price .em{ background: #FF0036; font-size: 24upx; padding:0 5upx; height:40upx; line-height: 40upx; margin-left: 20upx;}
.wwiapp-cart-item .cart-litemw-cnt .goods-gift{    padding: 8upx;margin: 20upx 20upx 0 20upx;border: dashed 1px #EEE;background-color: #FCFCFC;}
.wwiapp-cart-item .cart-litemw-cnt .goods-gift .span{font-size: 24upx;line-height: 40upx;height: 40upx;    color: #888;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.wwiapp-cart-item .cart-litemw-cnt .goods-gift .span .em{display: inline-block;height: 0.5rem;vertical-align: middle;padding: 0.1rem 0.2rem;margin-right: 0.2rem;background: #BBB;font-size: 24upx;line-height: 0.5rem;color: #FFF;border-radius: 0.1rem;}
.bottom{position: fixed;left: 0; right: 0; height: 88upx; width: 100%; z-index: 999; bottom: var(--window-bottom); background: #FFFFFF; align-items: center; border-top:1px solid #F8F8F8 ;}
.bottom .btn{background: #FF0036; color: #FFFFFF; width: 200upx; font-size: 32upx; height: 100%; display: flex;align-items: center; justify-content: center;}
.bottom .btn.no{background: #BBBBBB;}
.bottom .total{flex: 1; justify-content: flex-end; align-items: baseline; margin-right: 20upx;}
.bottom .total .dt{font-size: 30upx;}
.bottom .total .dd{font-size: 24upx; align-items: baseline; color: #FF0036; font-weight: bold;}
.bottom .total .dd .em{font-size: 40upx;}
.wwiapp-voucher-list .li{margin: 20upx 0;}
.wwiapp-voucher-list .li .dl{flex: 1;}
.wwiapp-voucher-list .li .dl .money{color: #FF0036; font-size: 36upx; line-height: 50upx; align-items: baseline;}
.wwiapp-voucher-list .li .dl .money .em{font-size: 50upx; margin: 0 5upx;}
.wwiapp-voucher-list .li .dl .need{font-size: 28upx; line-height: 35upx; color: #333;}
.wwiapp-voucher-list .li .dl .time{font-size: 26upx;line-height: 30upx;color: #888;}
.wwiapp-voucher-list .li .btn{width: 100upx; display: flex; justify-content: flex-end; align-items: center;}
.wwiapp-voucher-list .li .btn .span{border:2upx solid #eee; color: #777; padding: 5upx 14upx; font-size: 30upx;}
.login-cart{padding: 20upx;}
.login-cart .title{color: #12194c; font-size: 28upx; height: 80upx;}
.login-cart .title .btn{}
.login-cart .btn .span{ background: #FFFFFF; padding: 0 30upx; margin-left: 20upx; font-size: 28upx;}
.jjg-goods{}
.jjg-goods .wwi-icon{color:  #efe1b9; display: flex; justify-content: center; align-items: center; padding-right: 15upx;}
.jjg-goods .wwi-icon.ok{color: #ff5722;}
.jjg-goods .jjg-item{padding: 15upx; background: #FFF9E8;border-top: dashed 1px #FFE1D3;}
.jjg-goods .jjg-item .jjg-gpic,.jjg-goods .jjg-item .jjg-gpic image{width: 120upx; height: 120upx;}
.jjg-goods .jjg-item .jjg-info{margin-left: 20upx;}
.jjg-goods .jjg-item .jjg-name{font-size: 24upx; }
.jjg-goods .jjg-item .jjg-name .em{ display: inline-block; color: #007AFF;}
.jjg-goods .jjg-item .jjg-name .pp{display: inline-flex; color: #FFFFFF; line-height: 38upx;background-color: #FF875A;vertical-align: top;padding: 0 5px;}
.jjg-goods .jjg-item .jjg-info .price{color: #FF0036; font-size: 28upx;}
.jjg-goods .jjg-item .jjg-info .price .del{color: #777; text-decoration: line-through; margin-left: 20upx;}
</style>
 