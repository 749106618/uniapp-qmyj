<template>
    <view class="uni-navbar" :class="{'uni-navbar-fixed':isFixed,'uni-navbar-shadow':hasShadow}" :style="{'background-color':backgroundColor}" id="header">
        <uni-status-bar v-if="insertStatusBar"></uni-status-bar>
        <view class="uni-navbar-header" :style="{color:color}">
            <view class="uni-navbar-btn uni-navbar-btn-left" @tap="onClickLeft" :class="{'uni-nover':!leftIcon.length}">
                <view v-if="leftIcon.length" class="uni-navbar-btn-icon" :class="{'uni-navbar-btn-icon-left':!leftText.length}">
                    <uni-icon :type="leftIcon" :color="leftColor"></uni-icon>
                </view>
                <view v-if="leftText.length" class="uni-navbar-btn-text" :class="{'uni-navbar-btn-icon-left':!leftIcon.length}">{{leftText}}</view>
                <slot name="left"></slot>
            </view>
            <view class="uni-navbar-container">
                <view v-if="title.length" class="uni-navbar-container-title">{{title}}</view>
				<view class="input-view" v-if="searchSok" @tap="onClickSearch">
					<uni-icon type="sousuo" color="#666666"></uni-icon>
					<input class="input" type="text" :placeholder="placeholder" :disabled="disabled" />
				</view>
                <!-- 标题插槽 -->
                <slot></slot>
            </view>
            <view class="uni-navbar-btn uni-navbar-btn-right" @tap="onClickRight" :class="{'uni-nover':!rightIcon.length}">
                <view v-if="rightIcon.length" class="uni-navbar-btn-icon uni-navbar-btn-icon-right">
                    <uni-icon :type="rightIcon" :color="rightColor"></uni-icon>
					<view v-if="rightSup > 0" class="uni-navbar-hot">{{rightSup}}</view>
                </view>
                <!-- 优先显示图标 -->
                <view v-if="rightText.length&&!rightIcon.length" class="uni-navbar-btn-text">{{rightText}}</view>
                <slot name="right"></slot>
            </view>
        </view>
    </view>
</template>

<script>
    import uniStatusBar from './uni-status-bar.vue'
    import uniIcon from './uni-icon.vue'

    export default {
        components: {
            uniStatusBar,
            uniIcon
        },
        props: {
            /**
             * 标题文字
             */
            title: {
                type: String,
                default: ''
            },
            /**
             * 搜索默认文字
             */
            placeholder: {
                type: String,
                default: '搜索关键词'
            },
            /**
             * 角标提醒
             */
            rightSup: {
                type: String,
                default: ''
            },
            /**
             * 左侧按钮文本
             */
            leftText: {
                type: String,
                default: ''
            },
            /**
             * 右侧按钮文本
             */
            rightText: {
                type: String,
                default: ''
            },
            /**
             * 左侧按钮图标
             */
            leftIcon: {
                type: String,
                default: ''
            },
            /**
             * 右侧按钮图标
             */
            rightIcon: {
                type: String,
                default: ''
            },
            /**
             * 是否固定在顶部
             */
            fixed: {
                type: [Boolean, String],
                default: false
            },
            /**
             * 按钮图标和文字颜色
             */
            color: {
                type: String,
                default: '#000000'
            },
            leftColor: {
                type: String,
                default: '#000000'
            },
            rightColor: {
                type: String,
                default: '#000000'
            },
            /**
             * 背景颜色
             */
            backgroundColor: {
                type: String,
                default: '#FFFFFF'
            },
            /**
             * 是否包含状态栏，默认固定在顶部时包含
             */
            statusBar: {
                type: [Boolean, String],
                default: ''
            },
            /**
             * 是否启用搜索栏
             */
            searchTsok: {
                type: [Boolean, String],
                default: ''
            },
            /**
             * 是否启用输入
             */
            disabled: {
                type: String,
                default: 'true'
            },
            /**
             * 是否使用阴影，默认根据背景色判断
             */
            shadow: {
                type: String,
                default: ''
            }
        },
        computed: {
            isFixed() {
                return String(this.fixed) === 'true'
            },
            searchSok() {
                switch (String(this.searchTsok)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return false
                }
            },
            insertStatusBar() {
                switch (String(this.statusBar)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return this.isFixed
                }
            },
            hasShadow() {
                var backgroundColor = this.backgroundColor
                switch (String(this.shadow)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return backgroundColor !== 'transparent' && backgroundColor.indexOf('rgba') < 0
                }
            }
        },
        methods: {
            /**
             * 左侧按钮点击事件
             */
            onClickLeft() {
                this.$emit('clickLeft')
                this.$emit('click-left')
            },
            /**
             * 右侧按钮点击事件
             */
            onClickRight() {
                this.$emit('clickRight')
                this.$emit('click-right')
            },
            /**
             * 搜索点击事件
             */
            onClickSearch() {
                this.$emit('clickSearch')
                this.$emit('click-search')
            }
        }
    }
</script>

<style>
.uni-navbar {display: block;position: relative;width: 100%;background-color: #FFFFFF;overflow: hidden; font-size: 16px;}
.uni-navbar-shadow {box-shadow: 0 0.0625em 0.375em #ccc;}
.uni-navbar.uni-navbar-fixed {position: fixed;z-index: 9; left: 0; right: 0;}
.uni-navbar-header {display: flex;flex-direction: row;width: 100%;height: 2.75em;line-height: 2.75em;}
.uni-navbar-btn {position: relative;max-width: 4.125em; min-width: 2.625em; text-align: center;display: flex;flex-direction: row;padding: 0 0.125em;}
.uni-navbar-btn-icon {display: flex;flex-direction: column;justify-content: center;}
.uni-navbar-btn-icon-left {margin-left: 0.325em;}
.uni-navbar-btn-icon-right {margin-right: 0.325em;}
.uni-navbar-btn-text {padding: 0 0.25em;overflow: hidden;}
.uni-navbar-btn-left {padding: 0 0 0 0.125em;}
.uni-navbar-btn-right {padding: 0 0.125em 0 0;flex-direction: row-reverse;}
.uni-navbar-hot{position: absolute;top: 0.6em; right: 0.6em; height: 0.8em; font-size: 0.6em; line-height: 0.8em; background-color: #FF0036; color: #fff; padding:0.25em 0.35em; border-radius:0.8em ;}
.uni-navbar-container {position: relative;flex: 1; display: flex; justify-content: center; align-items: center;}
.uni-navbar-container-title {text-align: center;color: #000000;padding: 0 0.3125em;overflow: hidden;}
.input-view {position: absolute;width: 100%;top: 50%;transform: translateY(-50%);align-items: center;display: flex;flex-direction: row;background-color: #F8F8F8;height: 1.875em;border-radius: 0.78125em;padding: 0 0.3125em; font-size: 0.875em;box-sizing: border-box;}
.input {flex: 1;padding: 0 0.46875em;}
.uni-nover{min-width: 0.25em;}
</style>
