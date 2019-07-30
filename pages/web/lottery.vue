<template>
	<view>
		<view class="m-ui-dial" :style="{'background':'url('+lot_info.lot_dial_bg+') no-repeat center /100%'}">
		<view class="pointer" :style="{'background':'url('+lot_info.lot_dial_pointer+') no-repeat center /100%',transform:rotate_angle,transition:rotate_transition}">
				<view class="btn" @click="chou"></view>
		</view>	
		</view>
		<view class="winner-name">
			<view class="winner-title">
				<view class="winner-title-bg"></view>
				<view class="winner-title-con">获奖名单</view></view>
				<view class="winner-inner-tit "><view class="w-zm span">中奖者名单</view><view class="w-zm span">奖品信息</view></view>
				<view class="winner-list">
				<wwiSliderRolling :boxHeight='300' :lineHeight='60' :wwiList='prize_list' :speed='60'>	
					<view class="winner-info" v-for="(item,v3) in prize_list" :key="v3">
						<view class="w-name span">{{item.member_name}}</view>
						<view class="w-prize span">{{item.prize_info}}</view>
					</view></wwiSliderRolling>
				</view>
		</view>
	

	</view>
</template>

<script>
	import wwiSliderRolling from '../../components/wwi-slider-rolling.vue'
	export default {
		components: {
			wwiSliderRolling
		},
		data() {
			return {
				lotId: 1,
				key: '',
				lot_info: [],
				prize_info: [],
				prize_list:[],
				qua_amount: '',
				winnum: '0', //中奖的下标
				click_flag: true, //是否可以旋转抽奖
				start_rotating_degree: 0, //转盘初始旋转角度
				rotate_angle: 0, //转盘将要旋转的角度
				rotate_transition: "", //初始化选中的过度属性控制
			};
		},
		methods: {
			loadData: function() {
				this.wwiopt({
					url: '/index.php?app=lottery_dial&wwi=dial_info',
					method: 'POST',
					data: {
						lot_id: this.lotId,
						key: this.key
					},
					success: res => {
						if (res.data.code == 200) {
							this.lot_info = res.data.datas.dial_info;
							this.prize_list = res.data.datas.prize_list;
							this.qua_amount = parseInt(res.data.datas.dail_qua);
						} else {
							uni.showToast({
								title: res.data.datas.error,
								icon: "none"
							});
						}
					},
					error: () => {
						uni.showToast({
							title: '抽奖超时，请重试',
							icon: "none"
						});
					}
				});
			},
			chou() {
				if (!this.key) {
					uni.navigateTo({
						url: '/pages/web/login'
					});
					return false;
				}
				
				this.rotate_angle = 0;
				this.rotate_transition = "";
				if (!this.click_flag) return;
				let _this = this;
				uni.request({
					url: this.ApiUrl + '/index.php?app=lottery_dial&wwi=dial_prize',
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key: this.key,lot_id: this.lotId},
					success: res => {
						if (res.data.code == 200) {
							var wnum = parseInt(res.data.datas.prize_grade, 10);
							_this.winnum = res.data.datas.prize_grade;
							_this.prize_info = res.data.datas.prize_info;
							if (wnum == -1) {
								uni.showToast({
									title: _this.prize_info.prize_detial,
									icon: "none"
								});
								_this.rotate_angle = 0;
								_this.rotate_transition = "";
								return false;
							}
							_this.rotating(_this.winnum);
							console.log(_this.winnum)
						} else {
							uni.showToast({
								title: res.data.datas.error,
								icon: "none"
							});
							_this.rotate_angle = 0;
							_this.rotate_transition = "";
						}
					},
					fail: () => {
						uni.showToast({
							title: '抽奖超时，请重试',
							icon: "none"
						});
					}
				});
				
			},
			rotating(index) { //转盘转动函数，index值为中奖的下标，后台会返回中奖的id，这边会首先for循环判断中奖的下标
				let _this = this;
				_this.rotate_transition = "transform 6s cubic-bezier(0.25,0.1,0.01,1)";
				if (!_this.click_flag) return;
				var during_time = 5; // 默认为1s
				var result_index = index; // 最终要旋转到哪一块，对应prize_list的下标
				var rand_circle = 6; // 附加多转几圈，2-3
				_this.click_flag = false; // 旋转结束前，不允许再次触发
				var dddd = this.lot_info.prize_size?this.lot_info.prize_size:8;
                    if(this.start_rotating_degree < 0) {
                        this.start_rotating_degree = 0
                    } else {
                        this.start_rotating_degree = this.start_rotating_degree + Math.floor(360 * 100 / dddd) / 200
                    }
                    var rotate_angle = this.start_rotating_degree + 360 * 10 + Math.floor(-360 * 100 / dddd) / 200 - Math.floor(360 * 100 / dddd) * result_index / 100;
                    this.start_rotating_degree = rotate_angle;
                    _this.rotate_angle = "rotate(" + rotate_angle + "deg)";
					// 旋转结束后，允许再次触发
					setTimeout(function() {
						_this.click_flag = true;
						setTimeout(function() {
							_this.game_over();
						}, 100)
					}, during_time * 1000 + 1500); // 延时，保证转盘转完
			},
			game_over() {
				if (this.prize_info != '') {
					this.qua_amount--;
					if (this.qua_amount == 0) {
						uni.showToast({
							title: '您的抽奖机会已用完啦~~~',
							icon: "none"
						});
					}
					if (parseInt(this.prize_info.prize_type) == 0) {
						uni.showToast({
							title: this.prize_info.prize_detial,
							icon: "none"
						});
					} else {
						this.prize_list.push({
							member_name:member_name,
							prize_info:prize_info.prize_detial
						});
						var p_txt = '恭喜您获得：' + this.prize_info.rate_name + '【' + this.prize_info.prize_detial + '】';
						uni.showModal({
							title: '提示',
							content: p_txt,
							showCancel: false,
							confirmText: '确定',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}

				}
			}
		},
		onLoad: function(e) {
			this.lotId = e.id;
			this.key = uni.getStorageSync('key');
			this.loadData()
		}
	}
</script>

<style>
page{background: #f8f8f8;}
.m-ui-dial {width: 700upx;height: 700upx;margin: 50upx auto;position: relative;}
.pointer {position: absolute;top: 50%;left: 50%;display: block;width: 210upx;height: 315upx;margin: -157upx 0 0 -102upx;transform-origin: 102upx 193upx;}
.pointer .btn {position: absolute;left: 0;display: block;padding: 0;background-color: initial;border: none;top: 80upx;width: 210upx;height: 210upx;border-radius: 50%;}
.winner-name{ height:11rem; padding:5px 15px 15px; background-color: #fff; font-size: 12px; -webkit-border-radius: 6px; border-radius: 6px; border: 1px solid #f0f0f0; margin:20px; overflow:hidden;} 
.winner-list{position: relative; height: 140px; margin: 0 5px; overflow: hidden;}
.winner-list::before{content: ""; position: absolute; top: 0; width: 100%; height: 40px; position: absolute; z-index: 1; background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);background: -moz-linear-gradient(top,  rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);background: -webkit-linear-gradient(top,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);background: linear-gradient(to bottom,  rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#00ffffff',GradientType=0 );}
.list-wrap{display: none; position: absolute; top: 0px; width: 100%;}
.winner-title{position: relative; height: 40px; line-height: 40px; text-align: center;}
.winner-title-bg{position: absolute; top: 19px; left: 0; width: 100%; border-top: 2px solid #f34c49;}
.winner-title-con{position: relative; display: inline-block;  padding: 0 10px; font-size:1rem; background-color: #fff; color: #f34c49;}
.winner-inner-tit{overflow: hidden; line-height: 36px;}
.winner-name .span{float: left; width: 39%; padding: 0 5%; white-space: nowrap; overflow: hidden; text-align:center;text-overflow:ellipsis; }
.winner-info{line-height: 38px; border-top: 1px dashed #d9d8d8; overflow: hidden;}
.border-none{border: 0;}
.w-zm{font-size: 16px; color: #9d4e21;}
.w-name{color: #928977; flex: 1;}
.w-prize{color: #f34c49; flex: 1;}
.winner-none{text-align: center; line-height: 300px; color: #666; font-size: 14px;}
</style>
