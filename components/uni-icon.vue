<template>
    <view class="nav-top-icon wwi-icon" :class="['wwi-icon-'+type]" :style="{color:color,'font-size':fontSize}" @click="onClick()"></view>
</template>

<script>
    export default {
        props: {
            /**
             * 图标类型
             */
            type: String,
            /**
             * 图标颜色
             */
            color: String,
            /**
             * 图标大小
             */
            size: Number
        },
        computed: {
            fontSize() {
                return `${this.size}em`
            }
        },
        methods: {
            onClick() {
                this.$emit('click')
            }
        }
    }
</script>

<style>
.nav-top-icon{font-size: 1.825em;}
</style>
