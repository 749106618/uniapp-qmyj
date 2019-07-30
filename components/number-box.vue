<template>
	<view class="uni-numbox">
		<view class="uni-numbox-minus" :class="{'uni-numbox-disabled': disableSubtract}" @click="_calcValue('subtract')">-</view>
		<input class="uni-numbox-value" type="number" :disabled="disabled" v-model="inputValue" @blur="_onBlur">
		<view class="uni-numbox-plus" :class="{'uni-numbox-disabled': disableAdd}" @click="_calcValue('add')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			num: {
				type: [String,Number],
				default: 0
			},
			min: {
				type: [String,Number],
				default: -Infinity
			},
			max: {
				type: [String,Number],
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.num
			}
		},
		computed: {
			disableSubtract() {
				return this.inputValue <= this.min
			},
			disableAdd() {
				return this.inputValue >= this.max
			}
		},
		watch: {
			num(val) {
				this.inputValue = val;
			},
			inputValue(val) {
				this.$emit('change', val);
				if(this.num){
				if(this.num!=this.inputValue){
					this.inputValue = this.num;
				}}
			}
		},
		methods: {
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;

				if (type === 'subtract') {
					value -= step
				} else if (type === 'add') {
					value += step
				}
				if (value < this.min || value > this.max) {
					return
				}
				this.inputValue = value / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					this.inputValue = 0;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
.uni-numbox {display: flex;flex-direction: row;justify-content: flex-start;height: 25px;}
.uni-numbox-minus,.uni-numbox-plus {margin: 0;background-color: #f7f7f7;width: 25px;height: 100%;line-height: 25px;text-align: center;color: #555555; font-size: 24upx;}
.uni-numbox-minus {border: 1px solid #fff;border-right: none;border-top-left-radius: 5px;border-bottom-left-radius: 5px;}
.uni-numbox-plus {border: 1px solid #fff;border-left: none;border-top-right-radius: 5px;border-bottom-right-radius: 5px;}
.uni-numbox-value {border: 1px solid #fff;background-color: #f7f7f7;width: 30px;height: 100%;text-align: center; font-size: 14px;}
.uni-numbox-disabled {color: #c0c0c0; background: #fdfdfd;}
</style>
