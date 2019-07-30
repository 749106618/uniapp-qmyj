<template>
	<view class="page">
		<form @submit="formSubmit">
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}">
			<view class="uni-list">
				<checkbox-group @change="checkboxChange" name="cexpress[]">
				<block v-for="(list, key) in lists" :key="key">
 					<block v-if="list.datas.length">
						
						<view class="uni-list-cell-divider" :id="list.letter">
							{{list.letter}}
						</view>
						<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in list.datas" :key="item.id"
						 :class="list.datas.length -1 == index ? 'uni-list-cell-last' : ''">
							<label class="uni-list-cell-navigate">
								{{item.e_name}}<view>
						 			<checkbox :value="item.id" :checked="item.checked" />
						 		</view>
							</label>
						</view>
						 
					</block> 
				</block></checkbox-group>
			</view>
		</scroll-view>
		<view class="okbtn" v-if="okbtn">
			<button type="primary" class="okbtn-btn" form-type="submit">保存</button>
		</view>
		</form>
		<view class="uni-indexed-list-bar" :class="touchmove ? 'active' : ''" @touchstart="touchStart" @touchmove="touchMove"
		 @touchend="touchEnd" @touchcancel="touchCancel" :style="{height:winHeight + 'px'}">
			<text v-for="(list,key) in lists" :key="key" class="uni-indexed-list-text" :class="touchmoveIndex == key ? 'active' : ''"
			 :style="{height:itemHeight + 'px',lineHeight:itemHeight + 'px'}">{{list.letter}}</text>
		</view>
		<view class="uni-indexed-list-alert" v-if="touchmove">
			{{lists[touchmoveIndex].letter}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				lists: [],
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				scrollViewId: "A",
				titleHeight: 0,
				okbtn:false
			};
		},
		methods:{
			loadList:function(){
				this.wwiopt({
					url: '/index.php?app=seller_express&wwi=get_slist',
					method: 'GET',
					data: {key:this.key},
					success: res => {
						var data = res.data.datas.express_array;
						var oldDataRule = [];
						data.forEach(el=>{
							var oldObj = {
								letter:el.e_letter,
								datas:[]
							}
						  var dataObj = {
							e_name: el.e_name,
							id: el.id,
							checked: el.checked
						  }
						  oldObj.datas.push(dataObj)
						  oldDataRule.push(oldObj)
						});
						
						var newData = []
						var newObj = {}
						oldDataRule.forEach((el, i) => {
						  if (!newObj[el.letter]) {
							newData.push(el);
							newObj[el.letter] = true;
						  } else {
							newData.forEach(el => {
							  if (el.letter === oldDataRule[i].letter) {
								el.datas = el.datas.concat(oldDataRule[i].datas);
							  }
							})
						  }
						})
						this.lists = newData.sort((a, b) => { return a['letter'].localeCompare(b['letter']) });

						console.log(this.lists)
					}
				});
			},
			touchStart(e) {
				this.touchmove = true;
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.itemHeight);
				let item = this.lists[index];
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1;
			},
			checkboxChange:function(e){
				this.okbtn = true;
			},
			formSubmit:function(e){
				var param = {};
				    param = e.detail.value;
				    param.key = this.key;
					
				this.wwiopt({
					url: '/index.php?app=seller_express&wwi=savedefault',
					method: 'POST',
					data: param,
					success: res => {
						if(res.data.datas.error){
							uni.showModal({
								content: res.data.datas.error,
								showCancel: false,
							});
							return;
						}
						uni.showToast({
							title: '保存成功',
							mask: false,
							duration: 1500
						});
						
					}
				});
				this.okbtn = false;
			}
		},
		onLoad:function(){
			let winHeight = uni.getSystemInfoSync().windowHeight;
			this.itemHeight = winHeight / 26;
			this.winHeight = winHeight;

		},
		onReady:function(){
					this.key = uni.getStorageSync('seller_key');
			if (!this.key) {
				uni.navigateTo({
					url: '/pages/seller/login'
				});
			}
			this.loadList();	
		}
		
		}
</script>

<style>
.page {display: flex;flex-direction: row;}
.scrollList {flex: 1;height: 100vh;}
.uni-indexed-list-bar {width: 46upx;height: 100vh;background-color: lightgrey;display: flex;flex-direction: column;}
.uni-indexed-list-bar.active {background-color: rgb(200, 200, 200);}
.uni-indexed-list-text {color: #aaa;font-size: 22upx;text-align: center;}
.uni-indexed-list-bar.active .uni-indexed-list-text {color: #333;}
.uni-indexed-list-text.active,.uni-indexed-list-bar.active .uni-indexed-list-text.active {color: #007AFF;}
.uni-indexed-list-alert {position: absolute;z-index: 20;width: 160upx;height: 160upx;left: 50%;top: 50%;margin-left: -80upx;margin-top: -80upx;border-radius: 80upx;text-align: center;line-height: 160upx;font-size: 70upx;color: #fff;background-color: rgba(0, 0, 0, 0.5);}
.uni-list-cell-divider {position: relative;display: flex;color: #999;background-color: #f7f7f7;padding:15upx 20upx;}
.uni-list-cell-divider::before {position: absolute;right: 0;top: 0;left: 0;height: 1px;content: '';-webkit-transform: scaleY(.5);transform: scaleY(.5);background-color: #c8c7cc;}
.uni-list-cell-divider::after {position: absolute;right: 0;bottom: 0;left: 0upx;height: 1px;content: '';-webkit-transform: scaleY(.5);transform: scaleY(.5);background-color: #c8c7cc;}
.uni-list-cell-navigate {font-size:30upx;padding: 22upx 30upx;line-height: 48upx;position: relative;display: flex;box-sizing: border-box;width: 100%;flex: 1;justify-content: space-between;align-items: center;padding-right: 36upx;}
.uni-list-cell {position: relative;display: flex;flex-direction: row;justify-content: space-between;align-items: center;}
.uni-list-cell::after {position: absolute;z-index: 3;right: 0;bottom: 0;left: 30upx;height: 1px;content: '';-webkit-transform: scaleY(.5);transform: scaleY(.5);background-color: #c8c7cc;}
.uni-list-cell:last-child::after {height: 0upx;}
.uni-list {
	background-color: #FFFFFF;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.uni-list:after {
	position: absolute;
	z-index: 10;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(.5);
	transform: scaleY(.5);
	background-color: #c8c7cc;
}
.uni-list::before {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(.5);
	transform: scaleY(.5);
	background-color: #c8c7cc;
}
.uni-list-cell-last.uni-list-cell::after {
	height: 0upx;
}
.okbtn {position: absolute;z-index: 20;width: 160upx;height: 160upx;left: 50%;top: 50%;margin-left: -80upx;margin-top: -80upx;border-radius: 80upx;text-align: center;line-height: 160upx;font-size: 70upx;color: #fff;background-color: rgba(0, 0, 0, 0.5);}
.okbtn .okbtn-btn{background: none; line-height: 120upx;}
.okbtn .okbtn-btn:after{border: none;}
</style>
