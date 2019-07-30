<template>
	<view  :class="componentName"  @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd'>
		  <view class="uni-slip-top" :style="'transform:translate3d('+offset+'px, 0, 0);transition:.6s cubic-bezier(0.18, 0.89, 0.32, 1)'" >
			 <slot></slot>
		  </view>
		  <view class="uni-slip_del " :class="delCls" @click="$emit('del-click')"  ref='remove'>
			  <slot name="del"></slot>
			  <view class="span" v-if="delText.length">{{delText}}</view>
		  </view>
	</view>
</template>

<script>
 const COMPONENT_NAME = 'uni-del-item'
  export default {
    name: COMPONENT_NAME,
    data() {
      return {
				startX:0, startY:0, diffX:0, diffY:0,
				deleteSlider:'',
        open: false,
        offset: 0,
        draging: false,
        componentName: COMPONENT_NAME
      }
    },
    props: {
      threshold: {
        type: Number,
        default: 35
      },
      delCls: {
        type: String,
        default: 'uni-slip_del-red'
      },
      delText: {
        type: String,
        default: ''
      },
			delAreaWidth:{
        type: Number,
        default: 70
			}
    },
    methods: {
      getTouch(touch) {
        return touch.mp.changedTouches[0] || touch.mp.targetTouches[0]
      },
      isAngleLeft(diffX, diffY) {
        const x = Math.abs(diffX)
        const y = Math.abs(diffY)
        return !(x < 5 || (x >= 5 && y >= x * 1.73))
      },
      setOpen(type = false) {
        this.open = type
        this.offset = type ? -this.delAreaWidth : 0
      },
      closeOther() {
        this.$parent.$children
          .filter(vNode =>
            vNode.$el.classList.contains(this.componentName) &&
            vNode.open &&
            vNode !== this
          )
          .forEach(vNode => {
            vNode.setOpen(false)
          })
      },
         touchStart(e){
					const { clientX, clientY } = this.getTouch(e)
					this.startX = clientX
					this.startY = clientY
					this.draging = true
         },
         touchMove(e){
					const { clientX, clientY } = this.getTouch(e)
					this.diffX = clientX - this.startX
					this.diffY = clientY - this.startY
					if (
					  this.isAngleLeft(this.diffX, this.diffY) &&
					  Math.abs(this.diffX) <= this.delAreaWidth &&
					  (
						this.diffX < 0 && !this.open ||
						this.diffX > 0 && this.open
					  )
					) {
					  
					  this.offset = this.open ? this.diffX - this.delAreaWidth : this.diffX
					}
              },
         touchEnd(e){
					const { clientX, clientY } =this.getTouch(e)
					this.diffX = clientX - this.startX
					this.diffY = clientY - this.startY
					this.draging = false
					if (
					  this.diffX > 0 && this.diffX > this.threshold ||
					  this.diffX < 0 && this.diffX > -this.threshold
					) {
					  this.open = false
					  this.offset = 0
					} else if (
					  this.isAngleLeft(this.diffX, this.diffY) &&
					  (
						this.diffX > 0 && this.diffX <= this.threshold ||
						this.diffX < 0 && this.diffX <= -this.threshold
					  )
					) {
					  this.open = true
					  this.offset = -this.delAreaWidth
					  this.closeOther.call(this, e)
					  this.$emit('slip-open', this)
					}
                }      
    }
  }
</script>

<style>
    .uni-del-item { position: relative; width: 100%;}
    .uni-slip-top {position: relative;width: 100%;z-index: 1;background-color: #fff;}
    .uni-slip_del {position: absolute;right: 0;top: 0;bottom: 0;color: #fff;z-index: 0;}
		.uni-slip_del .span {position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);text-align: center;}
    .uni-slip_del-red {background-color: #f23030;}
</style>
