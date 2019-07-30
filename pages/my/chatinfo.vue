<template>
	<view>
		<view class="wwiapp-chat-con">
			<!-- #ifdef MP-WEIXIN -->
			<view class="get-old-msg" @click="getMsgOld">点击查看更多历史消息..</view>
			<!-- #endif -->
			
			<view  :class="[{'dl':!item.goods_id,'goods flex flexrow':item.goods_id},item.class]" v-for="(item,index) in msgInfo" :key="index">
				<block v-if="!item.goods_id">
				<view class="dt">
					<image :src="item.avatar"></image>
				</view>
				<view class="dd"><rich-text :nodes="item.t_msg"></rich-text></view>
				</block>
				<block v-else>
				<view class="goods-images"><image :src="item.pic24"></image></view>
				<view class="goods-info">
					<view class="goods-name">{{item.goods_name}}</view>
					<view class="goods-price">￥{{item.goods_promotion_price}}</view>
				</view>
				</block>
			</view>
			<navigator :url="'/pages/web/item?goodsid='+chatgoods.goods_id" class="goods flex flexrow" v-if="chatgoods">
				<view class="goods-images"><image :src="chatgoods.pic24"></image></view>
				<view class="goods-info">
					<view class="goods-name">{{chatgoods.goods_name}}</view>
					<view class="goods-price">￥{{chatgoods.goods_promotion_price}}</view>
				</view>
			</navigator>
			<view :style="{'height': mt+'px'}" id="btm"></view>
		</view>
		<view class="msg-bottom">
			<view class="hd">
			<view class="wwi-icon wwi-icon-xiaolian-line" @click="smiliesOpen"></view>
			<view class="input">
				<input type="text" v-model="msg" placeholder="输入消息.." />
			</view>
			<view class="btn" @click="submit">发送</view></view>
			<view class="bd flex flexrow" v-show="!smiliesclose">
				<view class="li" v-for="(ing,index2) in smilies" :key="index2" @click="smilieBtn(ing[1])"><image :src="resourceSiteUrl+'/js/smilies/images/'+ing[2]" mode=""></image></view>
			</view>
		</view>
	</view>
</template>

<script>
	import io from '@/common/socket.js';
	var socket = '';
	var connect = 0;
	var smilies_array = new Array();
	smilies_array[1] = [
		['1', ':smile:', 'smile.gif', '28', '28', '28', '微笑'],
		['2', ':sad:', 'sad.gif', '28', '28', '28', '难过'],
		['3', ':biggrin:', 'biggrin.gif', '28', '28', '28', '呲牙'],
		['4', ':cry:', 'cry.gif', '28', '28', '28', '大哭'],
		['5', ':huffy:', 'huffy.gif', '28', '28', '28', '发怒'],
		['6', ':shocked:', 'shocked.gif', '28', '28', '28', '惊讶'],
		['7', ':tongue:', 'tongue.gif', '28', '28', '28', '调皮'],
		['8', ':shy:', 'shy.gif', '28', '28', '28', '害羞'],
		['9', ':titter:', 'titter.gif', '28', '28', '28', '偷笑'],
		['10', ':sweat:', 'sweat.gif', '28', '28', '28', '流汗'],
		['11', ':mad:', 'mad.gif', '28', '28', '28', '抓狂'],
		['12', ':lol:', 'lol.gif', '28', '28', '28', '阴险'],
		['13', ':loveliness:', 'loveliness.gif', '28', '28', '28', '可爱'],
		['14', ':funk:', 'funk.gif', '28', '28', '28', '惊恐'],
		['15', ':curse:', 'curse.gif', '28', '28', '28', '咒骂'],
		['16', ':dizzy:', 'dizzy.gif', '28', '28', '28', '晕'],
		['17', ':shutup:', 'shutup.gif', '28', '28', '28', '闭嘴'],
		['18', ':sleepy:', 'sleepy.gif', '28', '28', '28', '睡'],
		['19', ':hug:', 'hug.gif', '28', '28', '28', '拥抱'],
		['20', ':victory:', 'victory.gif', '28', '28', '28', '胜利'],
		['21', ':sun:', 'sun.gif', '28', '28', '28', '太阳'],
		['22', ':moon:', 'moon.gif', '28', '28', '28', '月亮'],
		['23', ':kiss:', 'kiss.gif', '28', '28', '28', '示爱'],
		['24', ':handshake:', 'handshake.gif', '28', '28', '28', '握手']
	];
	export default {

		data() {
			return {
				key: '',
				tid: '',
				goodsId: '',
				url: '',
				nodeSiteUrl: '',
				memberInfo: [],
				userInfo: [],
				resourceSiteUrl: '',
				msgInfo: [],
				smilies:[],
				windowHeight:'',
				scrollIn:'',
				mt:'44',
				smiliesclose:true,
				data_c:[],
				msg:'',
				title:'',
				wap:true,
				chatgoods:''
			}
		},
		methods: {
			restarGet: function() {
				this.wwiopt({
					url: '/index.php?app=member_chat&wwi=get_node_info',
					data: {
						key: this.key,
						u_id: this.tid,
						chat_goods_id: this.goodsId
					},
					success: res => {
						this.checkLogin(res.data.login);
						var data = res.data.datas;
						this.nodeSiteUrl = data.node_site_url;
						this.memberInfo = data.member_info;
						this.userInfo = data.user_info;
						this.resourceSiteUrl = data.resource_site_url;
						this.smilies = smilies_array[1];
						uni.setNavigationBarTitle({
							title:this.userInfo.store_name != '' ? this.userInfo.store_name : this.userInfo.member_name
						});
						if(!data.node_chat){
							uni.showModal({
								title: '提示',
								content: '在线聊天系统暂时未启用',
								showCancel: false,
								confirmText: '好的',
								success: res => {
									uni.navigateBack();
								}
							});
							return false;
						}
						this.connentNode();
						if (!this.isEmptyObject(res.data.datas.chat_goods)) {
							var goods = res.data.datas.chat_goods;
							this.chatgoods=goods;
						}
					}
				});
			},
			connentNode: function() {
				var _this = this;
				connect_node();

				function connect_node() {
					var connect_url = _this.nodeSiteUrl; //连接状态
					var member = {};

					member['u_id'] = _this.memberInfo.member_id;
					member['u_name'] = _this.memberInfo.member_name;
					member['avatar'] = _this.memberInfo.member_avatar;
					member['s_id'] = _this.memberInfo.store_id;
					member['s_name'] = _this.memberInfo.store_name;
					member['s_avatar'] = _this.memberInfo.store_avatar;

					socket = io(connect_url, {
						'path': '/socket.io',
						'reconnection': false
					});
					socket.on('connect', function() {
						connect = 1;
						socket.emit('update_user', member);
						socket.on('get_msg', function(data) {
							get_msg(data);
						});
						socket.on('disconnect', function() {});
					});

					function node_del_msg(max_id, f_id) {
						if (connect === 1) {
							socket.emit('del_msg', {
								'max_id': max_id,
								'f_id': f_id
							});
						}
					}
					// 接收消息
					function get_msg(data) {
						var max_id;
						for (var k in data) {
							var msgData = data[k];
							if (data[k].f_id != _this.tid) {
								continue;
							}
							max_id = k;
							msgData.avatar = (!_this.isEmptyObject(_this.userInfo.store_id) ? _this.userInfo.store_avatar : _this.userInfo.member_avatar);
							msgData.class = 'msg-other';
							_this.insert_html(msgData);
						}
						if (typeof(max_id) != 'undefined') {
							node_del_msg(max_id, _this.tid);
						}
					}
				}


			},
			submit:function(){
				if(this.msg.length < 1){
					uni.showToast({
						title: '请输入要对话的内容',icon:"none"
					});
					return false;
				}
				this.node_send_msg({key:this.key,t_id:this.tid,t_name:this.userInfo.member_name,t_msg:this.msg,chat_goods_id:this.goodsId});
				this.smiliesclose = true;
				this.mt = 44;
				this.msg='';
			},
			 node_send_msg:function(data) {
				if (connect === 1) {
					this.wwiopt({
						url: '/index.php?app=member_chat&wwi=send_msg',
						method: 'POST',
						data: data,
						success: res => {
							if (res.data.code == 200) {
								var msgData = res.data.datas.msg;
								socket.emit('send_msg', msgData);
								msgData.avatar = this.memberInfo.member_avatar;
								msgData.class = 'msg-me';
								this.insert_html(msgData);
							} else {
								uni.showToast({
									title: res.data.datas.error,
									icon: "none"
								});
								return false;
							}
						}
					});
				}
			},
			insert_html:function(msgData) {
					msgData.t_msg = this.update_chat_msg(msgData.t_msg);
					this.msgInfo.push(msgData);
					if (!this.isEmptyObject(msgData.goods_info)) {
						var goods = msgData.goods_info;
						this.msgInfo.push(msgData);
					}
                    this.scrollIn = 'btm';
					setTimeout(function(){
					uni.pageScrollTo({
						scrollTop: 10000,
						duration: 0
					});	
					},100)
			},
				// 表情
			update_chat_msg:function(msg) {
					if (typeof smilies_array !== "undefined") {
						msg = '' + msg;
						for (var i in smilies_array[1]) {
							var s = smilies_array[1][i];
							var re = new RegExp("" + s[1], "g");
							var smilieimg = '<img title="' + s[6] + '" alt="' + s[6] + '" src="' + this.resourceSiteUrl + '/js/smilies/images/' +
								s[2] + '">';
							msg = msg.replace(re, smilieimg);
						}
					}
					return msg;
				},
			getMsgOld:function(){
				this.wwiopt({
					url: '/index.php?app=member_chat&wwi=get_chat_log&page=50',
					method: 'POST',
					data: {key:this.key,t_id:this.tid,t:30},
					success: res => {
                    if(res.data.code == 200){
                        if (res.data.datas.list.length == 0) {
							uni.showToast({
								title: '暂无聊天记录',icon:"none"
							});
                            return false;
                        }
                        res.data.datas.list.reverse();
						this.msgInfo = [];
                        for (var i=0; i<res.data.datas.list.length; i++) {
                            var _list = res.data.datas.list[i];
                            if (_list.f_id != this.tid) {
                                var data = {};
                                data.class = 'msg-me';
                                data.avatar = this.memberInfo.member_avatar;
                                data.t_msg = _list.t_msg;
                                this.insert_html(data);
                            } else {
                                var data = {};
                                data.class = 'msg-other';
                                data.avatar = this.userInfo.store_avatar == '' ? this.userInfo.member_avatar : this.userInfo.store_avatar;
                                data.t_msg = _list.t_msg;
                                this.insert_html(data);
                            }
                        }
						
                    } else {
						uni.showModal({
							content: res.data.datas.error,
							showCancel: false
						});
                        return false;
                    }
					}
				});
			},
			smiliesOpen:function(){
				this.smiliesclose = !this.smiliesclose;
				if(this.smiliesclose == true){
					this.mt = 44;
				}else{
					this.mt = 165;
				}
			},
			smilieBtn:function(e){
				this.msg = this.msg+e;
			}
		},
		onLoad(e) {
			this.key = uni.getStorageSync('key');
			if(e.goodsId){
				this.goodsId = e.goodsId;
			}
			if(e.tid){
				this.tid = e.tid;
			}
			
			if(!this.key){
				uni.navigateTo({
					url: '/pages/web/login'
				});
			}

			this.restarGet();
		},
        onNavigationBarButtonTap:function(e) {
			this.getMsgOld();
		}
	}
</script>

<style>
page{background: #F8F8F8;}
.wwiapp-chat-con {}
.wwiapp-chat-con .get-old-msg{height: 80upx; font-size: 28upx; color: #777; display: flex; align-items: center; justify-content: center;}
.wwiapp-chat-con .goods{padding: 20upx; margin: 20upx; background: #FFFFFF;}
.wwiapp-chat-con .goods .goods-images,.wwiapp-chat-con .goods .goods-images image{width: 120upx; height: 120upx;}
.wwiapp-chat-con .goods .goods-info{margin-left: 20upx;}
.wwiapp-chat-con .goods .goods-info .goods-name{font-size: 24upx;}
.wwiapp-chat-con .goods .goods-info .goods-price{color: #FF0036; font-size: 26upx; font-weight: 600;}
.wwiapp-chat-con .dl {position: relative;min-height: 88upx;padding: 8upx 0;margin-bottom:8upx;overflow: hidden;}
.wwiapp-chat-con .dl.msg-other {animation: optionMsgLeft 0.5s ease-in-out;-webkit-animation: optionMsgLeft 0.5s ease-in-out;}@keyframes optionMsgLeft {from {opacity: 0.5;left: -100%;right: 100%;}to {opacity: 1;left: 0;right: 0;}}@-webkit-keyframes optionMsgLeft {from {opacity: 0.5;left: -100%;right: 100%;}to {opacity: 1;left: 0;right: 0;}}
.wwiapp-chat-con .dl.msg-me {animation: optionMsgRight 0.5s ease-in-out;-webkit-animation: optionMsgRight 0.5s ease-in-out;}@keyframes optionMsgRight {from {opacity: 0.5;left: 100%;right: -100%;}to {opacity: 1;left: 0;right: 0;}}@-webkit-keyframes optionMsgRight {from {opacity: 0.5;left: 100%;right: -100%;}to {opacity: 1;left: 0;right: 0;}}
.wwiapp-chat-con .dl .dt {width: 80upx;height: 80upx;position: absolute;z-index: 1;top: 0.3rem;}
.wwiapp-chat-con .dl .dt i {width: 0.5rem;height: 0.5rem;position: absolute;z-index: 1;top: 0.5rem;background-repeat: no-repeat;background-position: 50% 50%;background-size: 100%;}
.wwiapp-chat-con .dl .dt image {max-width: 80upx;max-height: 80upx;border-radius: 100%;}
.wwiapp-chat-con .dl.msg-other .dt {left: 16upx;}
.wwiapp-chat-con .dl.msg-me .dt {right: 16upx;}
.wwiapp-chat-con .dl .dd {display: block;max-width: 375upx;padding: 16upx 24upx;border-radius: 16upx;min-height: 36upx;font-size: 28upx;line-height: 36upx;color: #000;word-wrap: break-word; position: relative;}
.wwiapp-chat-con .dl .dd:after{content: '';width: 0; height: 0; position: absolute; border-width: 16upx; top: 20upx;}
.wwiapp-chat-con .dl.msg-me .dd:after{border-color: transparent transparent transparent #FFD779;border-style: dashed dashed  dashed solid; right: -28upx;}
.wwiapp-chat-con .dl.msg-other .dd:after{border-color: transparent #FFFFFF transparent transparent ;border-style: dashed solid dashed  dashed ; left: -28upx;}
.wwiapp-chat-con .dl .dd image {background: #FFF;max-width: 320upx;max-height: 320upx;padding: 8upx;border-radius: 12upx;vertical-align: text-bottom;margin: 0 8upx;}
.wwiapp-chat-con .dl.msg-other .dd {margin-left: 120upx;float: left;background-color: #FFF;}
.wwiapp-chat-con .dl.msg-me .dd {margin-right: 120upx;float: right;background-color: #FFD779;}
.msg-bottom{ background: #FFFFFF; position: fixed; z-index: 99; bottom: 0;left: 0; right: 0; transition: 2s; }
.msg-bottom .hd{display: flex; flex-direction: row;height: 44px;}
.msg-bottom .wwi-icon{font-size: 36px; width: 40px;display: flex; align-items: center; justify-content: center;}
.msg-bottom .input{flex: 1;display: flex; align-items: center; justify-content: center; margin-right:10px; }
.msg-bottom .input input{height: 29px; background: #F8F8F8;width: 100%; line-height: 29px; font-size: 15px; border-radius:5px ; padding: 3px 5px;}
.msg-bottom .btn{background: #007AFF; color: #FFFFFF; font-size: 15px; width: 45px; display: flex; align-items: center; justify-content: center;}
.msg-bottom .bd{ padding: 10px; flex-wrap: wrap; border-top:1px solid #F8F8F8 ; height: 100px;}
.msg-bottom .bd .li{width: 12.5%; display: flex; align-items: center; justify-content: center;}
.msg-bottom .bd .li image{width: 28px; height: 28px;}
.msg-title{height: 44px;display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; flex-direction: row; position: relative;}
.msg-title .title{margin:0 80upx;display: flex; align-items: center; justify-content: center; flex: 1; }
.msg-title .rightIco{width: 45px;display: flex; align-items: center; justify-content: center; position: absolute;right: 0;}
.msg-title .rightIco .wwi-icon{font-size: 24px;}
</style>
