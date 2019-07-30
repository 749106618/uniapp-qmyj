<template>
	<view style="padding-bottom: 88upx;">
		<view class="fcode-container" v-if="fcodeDom.isShow">
			<view class="fcode-bg">
				<view class="con flex flexcol">
					<view class="h3">您正在购买“F码”商品</view>
					<view class="h5">
						<view class="">请输入所知的F码序列号并提交验证</view>
						<view class="">系统效验后可继续完成下单</view>
					</view>
					<input type="text" class="input" v-model="fcodeDom.value" placeholder="" />
					<view class="btn" @click="fcodeCheck">提交验证</view>
				</view>
			</view>
		</view>
		<view class="wwiapp-cart-block mt5" v-if="!receiveList.chain">
			<view class="wwiapp-oredr-detail-add" @click="addressShow">
				<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
				<view class="dl">
					<view class="dt">
						<view class="span">收货人：</view>
						<view class="span strong">{{info.address_info.true_name}}</view>
						<view class="span strong">{{info.address_info.mob_phone}}</view>
					</view>
					<view class="dd">收货地址：{{info.address_info.area_info}}</view>
				</view>
				<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou" style="color: #777;"></view>
			</view>
		</view>
		<view class="wwiapp-cart-block mt5" v-if="receiveList.chain">
			<view class="wwiapp-oredr-detail-add" @click="seChainClick">
				<view class="wwi-icon wwi-icon-ditu_dingwei"></view>
				<view class="dl">
					<view class="dt">
						<view class="span">收货人：</view>
						<view class="span strong">{{receiveList.true_name}}</view>
						<view class="span strong">{{receiveList.mob_phone}}</view>
					</view>
					<view class="dd">{{receiveList.area_info}}</view>
				</view>
				<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou" style="color: #777;"></view>
			</view>
		</view>
		<view class="wwiapp-cart-block mt5">
			<view class="wwiapp-loop-list" @click="receiveListClick" v-if="receiveList.isShow">
				<view class="h3">
					<view class="wwi-icon wwi-icon-gouwudai icon"></view>
					<view style="font-size: 32upx;">配送方式:</view>
				</view>
				<view class="u-content flex flexAic">{{receiveList.name[receiveList.chain]}}</view>
				<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou" style="color: #777;"></view>
			</view>
		</view>
		<view class="wwiapp-cart-block mt5">
			<view class="wwiapp-loop-list" @click="paydataClick">
				<view class="h3">
					<view class="wwi-icon wwi-icon-qianbao icon"></view>
					<view style="font-size: 32upx;">支付方式:</view>
				</view>
				<view class="u-content flex flexAic">{{payList[payName].name}}</view>
				<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou" style="color: #777;"></view>
			</view>
		</view>
		<view class="wwiapp-cart-block mt5" v-if="info.ifshow_inv==1">
			<view class="wwiapp-loop-list" @click="invinfoClick">
				<view class="h3">
					<view class="wwi-icon wwi-icon-orders icon"></view>
					<view style="font-size: 32upx;">发票信息:</view>
				</view>
				<view class="u-content flex flexAic">{{info.inv_info.content}}</view>
				<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou" style="color: #777;"></view>
			</view>
		</view>

		<view class="wwiapp-buy-container mt5" v-for="(item,index) in info.store_cart_list" :key="index">
			<view class="wwiapp-cart-store">
				<view class="dt flex flexrow">
					<view class="wwi-icon wwi-icon-dianpu"></view>
					<view class="title">{{item.store_name}}</view>
					<view class="tips" v-if="item.isoffle">（该商品不在配送范围）</view>
				</view>
				<view class="dd flex flexrow" v-if="item.store_mansong_rule_list != null && item.store_mansong_rule_list.desc != null">
					<view class="em">满即送</view>
					<view class="">{{item.store_mansong_rule_list.desc.desc}}</view>
					<block v-if="item.store_mansong_rule_list.desc.url">,送<image :src="item.store_mansong_rule_list.desc.url"></image>
					</block>
				</view>
			</view>
			<view class="wwiapp-cart-item">
				<view class="li flex flexrow" v-for="(goods,index2) in item.goods_list" :key="index2">
					<view class="goods-image">
						<image :src="goods.goods_image_url" mode=""></image>
					</view>
					<view class="goods-info flex flexcol">
						<view class="goods-name">{{goods.goods_name}}</view>
						<view class="goods-spec">{{goods.goods_spec}}</view>
						<view class="goods-subtotal flex flexrow flexJcs">
							<view class="goods-price flex flexrow">
								<view class="em">￥</view>{{goods.goods_price}}
							</view>
							<view class="goods-num flex flexrow flexAic">
								<view class="em">{{goods.goods_num}}</view>件
							</view>
						</view>
						<view class="goods-gift flex flexrow" v-for="(m,index3) in goods.gift_list" :key="index3" v-if="goods.gift_list">
							<view class="em">赠品</view>
							<view class="">{{m.gift_goodsname}}</view>
						</view>
						<view class="tips" v-if="transportId[goods.transport_id]">该商品不在配送范围</view>

					</view>

				</view>
			</view>
			<view class="jjg-goods" v-if="item.jjg">
				<view class="jjg-item flex flexrow" v-for="(jjg,vt) in item.jjg" :key="vt">
					<view class="jjg-gpic">
						<image :src="jjg.imgUrl"></image>
					</view>
					<view class="jjg-info">
						<view class="jjg-name">{{jjg.name}}
							<view class="pp">换购</view>
							<view class="em">x 1</view>
						</view>
						<view class="price flex flexrow">&yen;{{jjg.jjgPrice}}
							<view class="del">&yen;{{jjg.price}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="wwiapp-cart-subtotal">
				<view class="dl flex flexJcs flexrow" v-if="item.store_voucher_info.length">
					<view class="dt" v-if="item.store_voucher_info.voucher_store_id">店铺代金券</view>
					<view class="dt" v-else>门店代金券</view>
					<view class="dd">节省{{item.store_voucher_info.voucher_price}}元</view>
				</view>
				<view class="dl flex flexJcs flexrow">
					<view class="dt">物流配送</view>
					<view class="dd">运费{{info.address_api.content[index]}}元</view>
				</view>
				<view class="message">
					<textarea @blur="bindTextAreaBlur($event,index)" maxlength="500" class="text" placeholder="店铺订单留言" auto-height />
					</view>
					<view class="store-total flex flexrow">本店合计:<view class="em">{{info.store_final_total_list[index]}}</view>元</view>
				</view>
			</view>
				<view class="wwiapp-cart-subtotal" style="background: #FFFFFF;" v-if="info.order_date_list.length > 0">
					<view class="dl flex flexJcs flexrow" @click="reciverClick">
						<view class="dt">希望配送日期</view>
						<view class="dd flex flexrow flexAic">
							<block v-for="(kk,vv) in info.order_date_list" :key="vv">
								<block v-if="kk==reciverDateMsg">{{kk}}</block>
							</block>
						<view class="wwi-icon wwi-icon-xuanzeqixiayige"></view>
						</view>
					</view>
					<view class="store-total flex flexrow" style="padding-top: 20upx;">{{info.order_date_msg}}</view>
				</view>
			<view class="wwiapp-cart-block mt5" v-if="info.rpt_info.length">
				<view class="wwiapp-loop-list" style="padding: 20upx;">
					<view class="h3 flexAic" style="font-size: 32upx;">平台红包<switch  @change="rptChange($event , info.rpt_info)" /></view>
					<view class="u-content flex flexAic">
						<block v-if="parseFloat(info.rpt_info.rpacket_limit) > 0">{{'满' + parseFloat(info.rpt_info.rpacket_limit).toFixed(2) + '元，'}}</block>优惠{{parseFloat(info.rpt_info.rpacket_price).toFixed(2)}}元
					</view>
				</view>
			</view>
		 <view class="buyer-bottom flex flexrow" >
		 	<view class="total-money flex flexrow">
		 		<view class="dt">合计总金额：</view><view class="em">￥</view><view class="span">{{alltotal}}</view>
		 	</view>
		 	<view class="btn" :class="{'no':noBuy}" @click="buyNowto"><view >提交订单</view></view>
		 </view>
		 <!-- 选择地址 -->
		 <wwi-mask-left ref="addressAdd" title="选择地址" btitle="新增收货地址" @onClickBottom="addressAddbtn">
					<view class="wwiapp-cart-block mt5" v-for="(adr,vv) in addressList" :key="vv">
						<view class="wwiapp-oredr-detail-add"  @click="seletHim(adr)">
							<view class="wwi-icon" :class="{'wwi-icon-duihao':addressId == adr.address_id}"></view>
							<view class="dl">
								<view class="dt">
									<view class="span">收货人：</view>
									<view class="span strong">{{adr.true_name}}</view>
									<view class="span strong">{{adr.mob_phone}}</view>
								</view>
								<view class="dd">收货地址：{{adr.area_info}}</view>
							</view>
						</view>
					</view> 			 
		 </wwi-mask-left>
		 <!-- 选择配送时间 -->
		 <wwi-mask-left ref="reciverDateMsg" title="选择配送期间">
			        <view class="select-title">希望配送时间</view>
					<view class="select-mask flex flexrow">
						<view class="li" @click="reciverSelect(kk)" :class="{'ok':kk==reciverDateMsg}" v-for="(kk,vv) in info.order_date_list" :key="vv">
						{{kk}}
						<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':kk==reciverDateMsg,'wwi-icon-jiaobiaoweixuanzhong':kk!=reciverDateMsg}"></view>
						</view>
					</view> 			 
		 </wwi-mask-left>
		 <!-- 配送方式 -->
		 <wwi-mask-left ref="receiveList" title="配送方式">
			        <view class="select-title">选择配送方式</view>
					<view class="select-mask flex flexrow">
						<view class="li" @click="receiveListSelect(v4)" :class="{'ok':v4==receiveList.chain}" v-for="(kk,v4) in receiveList.name" :key="v4">
						{{kk}}
						<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':v4==receiveList.chain,'wwi-icon-jiaobiaoweixuanzhong':v4!=receiveList.chain}"></view>
						</view>
					</view> 			 
		 </wwi-mask-left>
		 <!-- 自提列表 -->
		 <wwi-mask-left ref="seChainList" title="使用自提门店" btitle="确定" @onClickBottom="onClickseChain" @onClickCannel="onCannelChain">
			        <view class="select-title">选择自提门店</view>
				     <view class="invot-add">
							 <view class="li">
								 <view class="dt">收货人</view>
								 <view class="dd">
									 <input type="text" v-model="receiveList.true_name" placeholder="收货人姓名" />
								 </view>
							 </view>
							 <view class="li">
								 <view class="dt">手机号</view>
								 <view class="dd">
									 <input type="number" v-model="receiveList.mob_phone" maxlength="11" placeholder="收货人手机号码" />
								 </view>
							 </view>
							 <view class="li">
								 <view class="dt">地区选择</view>
								 <view class="dd">
									 <input type="text" v-model="receiveList.areaInfo" placeholder="请选择地区" @click="showChainList">
								 </view>
							 </view></view>
							 <view class="seChain-list">
								 <view class="nobody" v-if="!receiveList.chain_list.length">未选择地区或该地区暂无门店</view>
								 <view class="li" @click="stepChain(sk)" :class="{'ok':receiveList.chainId==sk.chain_id}" v-for="(sk,vh) in receiveList.chain_list" :key="vh">
									 <view class="dt">门店名称：<view class="span">{{sk.chain_name}}</view></view>
									 <view class="dd">门店价格：￥<view class="span">{{sk.shopwwi_chain_price}}</view> ，地址：<view class="span">{{sk.chain_address}}</view></view>
									 <view class="wwi-icon wwi-icon-jiaobiaoxuanzhong"></view>
								 </view>
							 </view>
					  			 
		 </wwi-mask-left>
		 <wwi-city-select :themeColor="themeColor" ref="wwiCitySelect" :pickerValueDefault="cityPickerValueDefault" @onCancel="onCancel"
		 		@onConfirm="onConfirm"></wwi-city-select>
		 <!-- 支付方式 -->
		 <wwi-mask-left ref="paydataList" title="支付方式">
			        <view class="select-title">选择支付方式</view>
					<view class="select-mask flex flexrow">
						<view class="li" v-if="kk.ifshow" @click="paydataSelect(v3)" :class="{'ok':v3==payName}" v-for="(kk,v3) in payList" :key="v3">
						{{kk.name}}
						<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':v3==payName,'wwi-icon-jiaobiaoweixuanzhong':v3!=payName}"></view>
						</view>
					</view> 			 
		 </wwi-mask-left>
		 <!-- 发票信息 -->
		 <wwi-mask-left ref="invinfo" title="发票管理" btitle="确定" @onClickBottom="onClickinvot">
			        <view class="select-title">是否开具发票</view>
					<view class="select-mask flex flexrow">
						<view class="li" @click="invotClick('no')" :class="{'ok':invclick.invot=='no'}">不需要发票
						<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':invclick.invot=='no','wwi-icon-jiaobiaoweixuanzhong':invclick.invot!='no'}"></view>
						</view>
						<view class="li" @click="invotClick('yes')" :class="{'ok':invclick.invot=='yes'}">需要并填写发票信息
						<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':invclick.invot=='yes','wwi-icon-jiaobiaoweixuanzhong':invclick.invot!='yes'}"></view>
						</view>
					</view>
					<view class="invot-lost" v-if="invclick.invot=='yes'">
						<view class="li"  @click="invotClick('','',gg.inv_id)" v-for="(gg,g) in invclick.invoice_list" :key="g">
							<view class="wwi-icon wwi-icon-duihao sel" :class="{'ok':invclick.liked==gg.inv_id}"></view>
							<view class="title">{{gg.inv_title}}{{gg.inv_code}}{{gg.inv_content}}</view>
							<view class="wwi-icon wwi-icon-shanchu" @click="delInvoice(gg,g)"></view>
						</view>
						<view class="li"  @click="invotClick('','','0')">
							<view class="wwi-icon wwi-icon-duihao sel" :class="{'ok':invclick.liked==0}"></view>
							<view class="title">新增发票内容</view>
						</view>
					</view>
				     <view class="invot-add" v-if="invclick.invot=='yes' && invclick.liked==0">
						 <view class="li">
							 <view class="dt">发票类型</view>
							 <view class="dd flex flexrow">
								 <view class="span" @click="invotClick('','person')" :class="{'ok':invclick.insect=='person'}">个人<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':invclick.insect=='person','wwi-icon-jiaobiaoweixuanzhong':invclick.insect!='person'}"></view></view>
								 <view class="span" @click="invotClick('','company')" :class="{'ok':invclick.insect=='company'}">企业<view class="wwi-icon" :class="{'wwi-icon-jiaobiaoxuanzhong':invclick.insect=='company','wwi-icon-jiaobiaoweixuanzhong':invclick.insect!='company'}"></view></view>
							 </view>
							 </view>
							 <view class="li" v-if="invclick.insect=='company'">
								 <view class="dt">发票抬头</view>
								 <view class="dd">
									 <input type="text" v-model="invclick.inv_title" placeholder="输入单位或企业名称" />
								 </view>
							 </view>
							 <view class="li" v-if="invclick.insect=='company'">
								 <view class="dt"></view>
								 <view class="dd">
									 <input type="text" v-model="invclick.company_code" placeholder="输入纳税人识别号" />
								 </view>
							 </view>
							 <view class="li">
							 <view class="dt">发票内容</view>
							 <view class="dd flex flexrow">
								 <view class="changed"><picker @change="bindinvotChange" :value="invclick.index" :range="invclick.invoice_content_list" v-if="invclick.invoice_content_list.length">
						<view class="input">{{invclick.invoice_content_list[invclick.index]}}</view>
					</picker></view>
								 <view class="wwi-icon wwi-icon-xuanzeqizhankai sel"></view>
							 </view>
						 </view>
					 </view>
		 </wwi-mask-left>
		 <wwi-payment-mask ref="wwiPaymentMask" @onConfirm="Golist" @onCancel="Golist"></wwi-payment-mask>

	</view>
</template>

<script>
	import wwiMaskLeft from '../../components/wwi-mask-left.vue';
	import wwiCitySelect from '../../components/wwi-city-select.vue';
	import wwiPaymentMask from '../../components/wwi-payment-mask.vue';
	export default {
		components: {
			wwiMaskLeft,
			wwiCitySelect,
			wwiPaymentMask
		},
		data() {
			return {
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF',
				key:'',
				goodsId:'',
				ifcart:'',
				ifchain:0,
				addressId:'',
				chainId:0,
				pintuan:0,
				cartId:0,
				jjg:'',
				logId:0,
				buyerId:0,
				pdPay:0,
				info:{
					address_info:[],
					order_date_list:[],
					store_cart_list:[],
					rpt_info:[]
				},
				vatHash:'',
				offpayHash:'',
				offpayHashBatch:'',
				showDv:0,
				addressList:[],
				alltotal:0,
				buystep:false,
				message:{},
				rcbPay:0,
				rpt:'',
				fcode:'',
				fcodeDom:{
					isShow:false,
					value:"",
					
				},
				voucher:'',
				password:'',
				payName:'online',
				payList:{
					online:{
						ifshow:true,
						name:'在线支付'
					},
					offline:{
						ifshow:false,
						name:'货到付款'
					},
					chain:{
						ifshow:false,
						name:'门店支付'
					}
				},
				reciverDateMsg:'',
				invclick:{
					invot:"no",
					insect:'person',
					liked:0,
					index:0,
					invoice_content_list:[],
					invoice_list:[],
                    inv_title:'',
                    company_code:''
				},
				noBuy:false,
				receiveList:{ //配送方式
					isShow:false,
					chain:0,
					chainId:0,
					name:['快递到家','门店自提'],
					true_name:'',
					mob_phone:'',
					area_info:'',
					chain_list:[],
					areaInfo:'',
					areaId:'',
					cityId:'',
				},
				ifshow_offpay:0,
				transportId:[]
				
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: '/index.php?app=member_buy&wwi=buy_step1',
					method: 'POST',
					data: {key:this.key,cart_id:this.cartId,ifcart:this.ifcart,ifchain:this.ifchain,chain_id:this.chainId,address_id:this.addressId,pintuan:this.pintuan,jjg:this.jjg},
					success: res => {
						this.checkLogin(res.data.login);
						if (res.data.datas.error) {
							uni.showToast({
								title: res.data.datas.error,icon:"none",
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
							return false;
						}
						for(let k in res.data.datas.store_cart_list){
							res.data.datas.store_cart_list[k].isoffle = false;
							res.data.datas.store_cart_list[k].jjg = [];
						}

						if(!this.isEmptyObject(res.data.datas.jjgValidSkus)){
							for(let jjg in res.data.datas.jjgValidSkus){
								var jjg_item = res.data.datas.jjgValidSkus[jjg];
								for(let jjg2 in jjg_item){
									res.data.datas.store_cart_list[jjg_item[jjg2].store_id].jjg.push(jjg_item[jjg2]);
								}
								
							}
						}

						this.info =res.data.datas;
						console.log(this.info);
						if (typeof(res.data.datas.ifshow_offpay) != 'undefined') {
							this.ifshow_offpay = res.data.datas.ifshow_offpay;
						}
						if (res.data.datas.address_api.allow_offpay == 1 && this.ifshow_offpay) {
							this.payList['offline'].ifshow=true;
						}else{
							this.payList['offline'].ifshow=false;
						}
  						if(this.isEmptyObject(res.data.datas.address_info) && this.ifchain=='0'){
							uni.showModal({
								title: '提示',
								content: '请先添加收货地址~',
								showCancel: true,
								cancelText: '取消',
								confirmText: '确定',
								success: res => {
									if(res.confirm){
										uni.navigateTo({
											url:'/pages/my/addressadd'
										})
									}else{
										uni.navigateBack();
									}
								}
								
							});
						}else{
							this.addressId = res.data.datas.address_info.address_id;
						}
						this.vatHash = res.data.datas.vat_hash;
						this.offpayHash = res.data.datas.address_api.offpay_hash;
            this.offpayHashBatch = res.data.datas.address_api.offpay_hash_batch;
							if(this.fcode==''){
							
									// F码商品
									for (var k in res.data.datas.store_cart_list) {
											if (res.data.datas.store_cart_list[k].goods_list[0].is_fcode == '1') {
												this.fcodeDom.isShow = true;
											}
											break;
									}
							}
						
						this.alltotal=0;
						for (var k in res.data.datas.store_final_total_list) {
							this.alltotal += parseFloat(res.data.datas.store_final_total_list[k]);
							// 留言
							this.message[k] = '';
							if(this.message[k]){
								this.message[k] = this.message[k];
							}
						}
						if (!this.isEmptyObject(res.data.datas.rpt_info)) {
							this.rcbPay = 1;
							if(this.rpt){
								this.alltotal -= parseFloat(res.data.datas.rpt_info.rpacket_price);
							}
						} 
						if(res.data.datas.order_date_list.length > 0){
							this.reciverDateMsg = res.data.datas.order_date_list[0];
						}
						var address_api = res.data.datas.address_api;
						
						if (!this.isEmptyObject(address_api.no_send_tpl_ids)) {
							this.noBuy = true;
							for (var i=0; i<address_api.no_send_tpl_ids.length; i++) {
								var ii = address_api.no_send_tpl_ids[i];
								this.transportId[ii] = 1;
							}
						} else {
							this.noBuy = false;
						}
						if (res.data.datas.ifchain == '1') {//商品支持门店自提
						 this.receiveList.isShow =true;
						 this.receiveList.chainId = this.chainId;
						 if(this.ifchain=='1' && this.chainId > 0 && typeof(res.data.datas.chain_info) != 'undefined'){
							 if(this.receiveList.true_name == '') this.$refs.seChainList.show();
							 this.receiveList.areaInfo =res.data.datas.chain_info.area_info;
							 this.receiveList.chain_list[0] = res.data.datas.chain_info;
							 this.receiveList.area_info = '[门店]'+res.data.datas.chain_info.chain_name+''+res.data.datas.chain_info.shopwwi_chain_price;
						 }else{
							 this.receiveList.area_info = '请选择门店';
						 }
						}
                var voucher_temp = [];
                for (var k in res.data.datas.store_cart_list) {
                    voucher_temp.push([res.data.datas.store_cart_list[k].store_voucher_info.voucher_t_id + '|' + k + '|' + res.data.datas.store_cart_list[k].store_voucher_info.voucher_price]);
                }
                this.voucher = voucher_temp.join(',');
						
						
						
					},
					error: () => {
						uni.showModal({
							content: '数据加载异常',
							showCancel: false,
							confirmText: '好的',
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
						return false;
					}
				});
			},
			bindTextAreaBlur:function(e,i){
				this.message[i] = e.mp.detail.value;
				console.log(this.message)
			},
			rptChange:function(e,info){
				if(e.mp.detail.value==true){
					this.rpt = info.rpacket_t_id+ '|' +parseFloat(info.rpacket_price);
					this.alltotal -= parseFloat(info.rpacket_price);
				}else{
					this.rpt = '';
					this.alltotal += parseFloat(info.rpacket_price);
				}
			},
			addressShow:function(){
					uni.request({
						url: this.ApiUrl+"/index.php?app=member_address&wwi=address_list",
						method: 'POST',
						data: {key:this.key},
						header: {'content-type': 'application/x-www-form-urlencoded'},
						success: res => {
							this.checkLogin(res.data.login);
							if(res.data.datas.address_list==null){
								return false;
							}
							this.addressList = res.data.datas.address_list;
						}
					});
					this.$refs.addressAdd.show();
			},
			seletHim:function(e){
				this.info.address_info = e;
				this.addressId = e.address_id;
				this.$refs.addressAdd.hide();
				this.Inlimine();
			},
			addressAddbtn:function(){
				
				uni.navigateTo({
					url: '/pages/my/addressadd'
				});
				this.$refs.addressAdd.hide();
			},
			reciverClick:function(){
				this.$refs.reciverDateMsg.show();
			},
			reciverSelect:function(e){
				if(e==this.reciverDateMsg){
					return false;
				}
				this.reciverDateMsg = e;
				this.$refs.reciverDateMsg.hide();
			},
			paydataClick:function(){
				this.$refs.paydataList.show();
			},
			paydataSelect:function(v){
				if(v==this.payName){
					return false;
				}
				this.payName = v;
				this.$refs.paydataList.hide();
			},
			invinfoClick:function(){
				this.$refs.invinfo.show();
			},
			invotClick:function(e,v,b){
				if(e){
					if(e==this.invclick.invot){
						return false;
					}
				this.invclick.invot = e;
				if(this.invclick.invot=='yes'){
					if(!this.invclick.invoice_content_list.length){
					uni.request({
						url: this.ApiUrl+'/index.php?app=member_invoice&wwi=invoice_content_list',
						method: 'POST',
						header: {'content-type': 'application/x-www-form-urlencoded'},
						data: {key:this.key},
						success: res => {
							this.checkLogin(res.data.login);
							this.invclick.invoice_content_list = res.data.datas.invoice_content_list;
						}
					});
					}
					uni.request({
						url: this.ApiUrl+'/index.php?app=member_invoice&wwi=invoice_list',
						method: 'POST',
						header: {'content-type': 'application/x-www-form-urlencoded'},
						data: {key:this.key},
						success: res => {
							this.checkLogin(res.data.login);
							this.invclick.invoice_list = res.data.datas.invoice_list;
						}
					});
				}else{
					this.invclick.liked = 0;
				}
			}
			if(v){
				if(v==this.invclick.insect){
					return false;
				}
				this.invclick.insect = v;
			}
			if(b){
				if(b==this.invclick.liked){
					return false;
				}
				this.invclick.liked = b;
			}
			},
			delInvoice(e,index){
					uni.request({
						url: this.ApiUrl+'/index.php?app=member_invoice&wwi=invoice_del',
						method: 'POST',
						header: {'content-type': 'application/x-www-form-urlencoded'},
						data: {key:this.key,inv_id:e.inv_id},
						success: res => {
							this.checkLogin(res.data.login);
							this.invclick.invoice_list.splice(index, 1);
						}
					});
			},
			bindinvotChange(e){
				this.invclick.index = e.mp.target.value;
			},
			onClickinvot:function(){
				if(this.invclick.invot=='yes'){
					if(this.invclick.liked==0){
							var param = {};
							param.key = this.key;
							param.inv_title_select = this.invclick.insect;
							param.inv_title = this.invclick.inv_title;
							param.company_code = this.invclick.company_code;
							param.inv_content = this.invclick.invoice_content_list[this.invclick.index];
							if (param.inv_title_select == 'person') {
								param.inv_title = '个人';
								} else {
								if (param.inv_title=='') {
									uni.showToast({ title: '请输入单位或企业名称',icon:"none" });
									return false;
								}
								if (param.company_code=='') {
									uni.showToast({	title: '请输入纳税人识别号',icon:"none"});
									return false;
								}
							}
							uni.request({
								url: this.ApiUrl+'/index.php?app=member_invoice&wwi=invoice_add',
								method: 'POST',
								header : {'content-type':'application/x-www-form-urlencoded'},
								data: param,
								success: res => {
									if(res.data.datas.inv_id>0){
										 this.invclick.liked = res.data.datas.inv_id;
										 this.invclick.invoice_list.push({
											 inv_code:param.company_code,
											 inv_content:param.inv_content,
											 inv_id:res.data.datas.inv_id,
											 inv_title:param.inv_title
										 });
						this.invclick.invoice_list.forEach(item=>{
							if(item.inv_id == this.invclick.liked ){
								this.info.inv_info.content =item.inv_title +' '+item.inv_code +' '+item.inv_content
							}
						});
									}
								}
							});
					}else{
						this.invclick.invoice_list.forEach(item=>{
							if(item.inv_id == this.invclick.liked ){
								this.info.inv_info.content =item.inv_title +' '+item.inv_code +' '+item.inv_content
							}
						});
					}
					
				}else{
					this.info.inv_info.content = '不需要发票';
				}
				this.$refs.invinfo.hide();
			},
			receiveListClick:function(){
				this.$refs.receiveList.show()
			},
			receiveListSelect:function(e){
				if(this.receiveList.chain ==e){
					return false;
				}
				this.receiveList.chain = e;
				if(e=='1'){
					this.payList.chain.ifshow = true;
					this.ifchain = 1;
					if(!this.receiveList.chainId){
						this.$refs.seChainList.show()
					}else{
					
					this.chainId = this.receiveList.chainId;
					this.Inlimine();
					}
				}else{
					this.ifchain = 0;
					this.chainId = 0;
					this.payList.chain.ifshow = false;
					this.payName='online';
					this.Inlimine();
				}
				this.$refs.receiveList.hide()
			},
			seChainClick:function(){
				this.$refs.seChainList.show()
			},
			onClickseChain:function(){
				if(this.receiveList.true_name.length < '1'){
					uni.showToast({
						title: '请输入收货人姓名',icon:"none"
					});
					return false;
				}
				if(this.receiveList.mob_phone.length != '11'){
					uni.showToast({
						title: '请输入收货人11位手机号码',icon:"none"
					});
					return false;
				}
				if(this.receiveList.chainId < '1'){
					uni.showToast({
						title: '请选择门店',icon:"none"
					});
					return false;
				}
				if(this.receiveList.chainId != this.chainId){
					this.chainId = this.receiveList.chainId;
				}
				this.ifchain = '1';
				this.Inlimine();
				this.$refs.seChainList.hide()
				
			},
			onCannelChain:function(){
				if(this.receiveList.chainId!=this.chainId){
                       this.Inlimine();
				}
			},
            onCancel(e) {
                console.log(e);
            },
			showChainList:function(){
				this.$refs.wwiCitySelect.show();
			},
            onConfirm(e) {
				this.receiveList.areaInfo=e.label;
				this.receiveList.areaId=e.areaCode;
				this.receiveList.cityId=e.cityCode;
				this.getChainShowList();
            },
			getChainShowList:function(){
				uni.request({
					url: this.ApiUrl+"/index.php?app=member_buy&wwi=load_chain",
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key:this.key,area_id:this.receiveList.areaId,goods_id:this.goodsId},
					success: res => {
                        this.checkLogin(res.data.login);
                        if(res.data.datas.chain_list==null){
                            return false;
                        }
						this.receiveList.chain_list=res.data.datas.chain_list;
					}
				});
			},
			stepChain:function(e){
				if(e.chain_id == this.receiveList.chainId){
					 return false;
				}
				this.receiveList.chainId=e.chain_id;
			},
			fcodeCheck:function(){
				if (this.fcodeDom.value == '') {
					uni.showModal({
						content: '请填写F码',
						showCancel: false,
						confirmText: '好的'
					});
						return false;
				}
				uni.request({
					url: this.ApiUrl+'/index.php?app=member_buy&wwi=check_fcode',
					method: 'POST',
					header : {'content-type':'application/x-www-form-urlencoded'},
					data: {key:this.key,goods_id:this.goodsId,fcode:this.fcodeDom.value},
					success: res => {
							if (res.data.datas.error) {
								uni.showModal({
									content: res.data.datas.error,
									showCancel: false,
									confirmText: '好的'
								});
									return false;
							}
								uni.showToast({
									title: '验证成功',icon:"none"
								});
								this.fcodeDom.isShow = false;
								this.fcode = this.fcodeDom.value;
					}
				});
			},
			buyNowto:function(){
				if(this.noBuy){
					return false;
				}
				if(this.buystep){
					uni.showModal({
						title: '提示',
						content: '数据处理中,请勿重复点击',
						showCancel: true,
						cancelText:"继续等待",
						confirmText: '跳过',
						success: res => {
							if (res.confirm) {
								uni.redirectTo({ url: '/pages/my/orderlist'});
					         }
						}
					});
					return false;
				}
				var chainID='';
				if(this.ifchain == '1'){
					if(this.chainId < 1){
					uni.showModal({
						content: '请选择门店',
						showCancel: false,
						confirmText: '好的'
					});
						return false;
					}
					if(this.receiveList.mob_phone.length!='11' && this.receiveList.true_name.length < '1'){
						uni.showModal({
							content: '请完善门店收货人及手机号',
							showCancel: false,
							confirmText: '好的'
						});
						return false;
					}
					chainID = this.chainId;
				}else{
					if(!this.addressId){
						uni.showModal({
							content: '请选择收货地址',
							showCancel: false,
							confirmText: '好的'
						});
						return false;
					}
				}
				
			//	this.buystep = true;
			var msg = '';
        for (var k in this.message) {
            msg += k + '|' + this.message[k] + ',';
        }
				this.wwiopt({
					url: '/index.php?app=member_buy&wwi=buy_step2',
					method: 'POST',
					data: {
						key:this.key,//
						ifcart:this.ifcart,//
						cart_id:this.cartId,//
						address_id:this.addressId,
						"chain[id]":chainID,
						"chain[buyer_name]":this.receiveList.true_name,
						"chain[mob_phone]":this.receiveList.mob_phone,
						"chain[tel_phone]":'',
						pintuan:this.pintuan,//
						log_id:this.logId,//
						buyer_id:this.buyerId,//
						vat_hash:this.vatHash,//
						offpay_hash:this.offpayHash,//
						offpay_hash_batch:this.offpayHashBatch,//
						pay_name:this.payName,//
						invoice_id:this.invclick.liked,//
						voucher:this.voucher,
						pd_pay:this.pdPay,
						password:this.password,
						fcode:this.fcode,
						rcb_pay:this.rcbPay,
						rpt:this.rpt,//
						pay_message:msg,
						reciver_date_msg:this.reciverDateMsg,
						jjg:this.jjg
					},
					success: res => {
						this.checkLogin(res.data.login);
						if (res.data.datas.error) {
							uni.showModal({
								content: res.data.datas.error,
								showCancel: false
							});
							this.buystep = false;
							return false;
						}
						if (res.data.datas.payment_code == 'offline' || res.data.datas.payment_code == 'chain') {
							uni.redirectTo({
								url: '/pages/my/orderlist'
							});
						} else {
							uni.removeStorageSync('cart_count');
							
								var toPay = {
									app:'member_buy',
									wwi:'pay',
									paySn:res.data.datas.pay_sn
								}
								this.$refs.wwiPaymentMask.show(toPay);
						}
					}
				});
				
				
				
			},
			Golist:function(){
				uni.redirectTo({
					url: '/pages/my/orderlist'
				});
			}
		},
		onLoad:function(e){
			this.key = uni.getStorageSync('key');
			if(!this.key){
				uni.showModal({
					title: '提示',
					content: '请登入后操作',
					showCancel: false,
					confirmText: '好的',
					success: res => {
						var page = getCurrentPages();
							if(page.length > 1){
							  uni.navigateBack();
							}else{
							  uni.switchTab({  url:'/pages/index' });
							}
					}
				});
				return false;
			}
			if(e.goodsId){
				this.goodsId = e.goodsId;
			}
			if(e.buynum){
				this.goodsNum = e.buynum;
			}
			if(e.ifcart && e.cartId){
				this.ifcart = e.ifcart;
				this.cartId = e.cartId;
			}else{
				this.cartId = e.goodsId+'|'+e.buynum;
			}
			if(e.jjg){
				this.jjg = e.jjg;
			}
			if(e.ifchain){
				this.ifchain = e.ifchain;
				this.receiveList.chain = 1;
			}
			if(e.chainId){
				this.chainId = e.chainId;
			}
			if(e.pintuan){
				this.pintuan = e.pintuan;
			}
			if(e.logId && e.buyerId){
				this.logId = e.logId;
				this.buyerId = e.buyerId;
			}
			
		},
		onShow:function(e){
			this.key = uni.getStorageSync('key');
			if(!this.key){
				uni.showModal({
					title: '提示',
					content: '请登入后操作',
					showCancel: false,
					confirmText: '好的',
					success: res => {
						var page = getCurrentPages();
							if(page.length > 1){
							  uni.navigateBack();
							}else{
							  uni.switchTab({  url:'/pages/index' });
							}
					}
				});
				return false;
			}
			this.Inlimine();
		}
	}
</script>

<style>
	@import "../../common/css/buystep.css";
</style>
