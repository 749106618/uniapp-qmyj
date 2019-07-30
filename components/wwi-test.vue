<template>
	<view>
		<view class="a">
			<block v-for="(item,index) in subitemdata" :key="index">
			<slot :name="item.id"></slot>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
            subitemdata: {
                type: Object,
                default: function () {
	              return [];
                }
            }
		}
	}
</script>

<style>

</style>
