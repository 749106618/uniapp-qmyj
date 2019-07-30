<template>
	<view class="comment-info">
		<view class="title">热门评论</view>
		<view class="item-list">
			<view class="nolist" v-if="!commentList.length">还没有评论，赶紧评论吧！</view>
			<view class="item flex flexrow" v-for="(item,index) in commentList" :key="index">
				<image class="pic" :src="item.member_avatar"></image>
				<view class="right flex flexcol">
					<view class="name flex flexrow flexJcs">
						<view class="">{{item.member_name}}</view>
						<view class="em">{{item.time}}</view>
					</view>
					<view class="up-msg flex flexcol" v-if="item.item">
						<view class="up-msg-name">Re:{{item.item[0].member_name}}</view>
						<view class="up-msg-comment">{{item.item[0].comment_message}}</view>
					</view>
					<view class="comment-msg">{{item.comment_message}}</view>
					<view class="btn flex flexrow">
						<view class="span" @click="Ding(item)">顶[{{item.comment_up}}]</view>
						<view class="span" @click="backComment(item)">回复</view>
					</view>
				</view>
			</view>
			<view class="showload" v-if="showLoad" @click="getComment">{{loadText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key: '',
				newsId: "",
				info: [],
				curpage: 1,
				hasmore: true,
				commentList: [],
				showLoad: false,
				loadText: '点击加载更多',
				comment: '',
				commentId: '',
				Retitle: '发表评论'
			}
		},
		onLoad(){
			this.getComment()
		},
		methods: {
			getComment: function(e) {
				if (!this.hasmore) {
					return;
				}
				this.wwiopt({
					url: "/index.php?app=tzx&wwi=comment_list",
					data: {
						page: 10,
						curpage: this.curpage,
						comment_object_id: 30,
						type: 'article'
					},
					success: res => {
						if (res.data.code == 200) {
							this.curpage += 1;
							if (e) {
								res.data.datas.comment_list.forEach(item => {
									this.commentList.push(item);
								});
								if (!res.data.hasmore) {
									this.loadText = "没有更多数据了";
								}

							} else {
								this.commentList = res.data.datas.comment_list;
								if (res.data.hasmore) {
									this.showLoad = true;
								}
							}
							this.hasmore = res.data.hasmore;
						}

						//console.log(this.commentList)
					}
				});
			},
		}
	}
</script>

<style>
	.comment-info .title {
		font-size: 32upx;
		font-weight: bold;
		display: flex;
		align-items: center;
		height: 100upx;
	}

	.item-list {
		padding-top: 20upx;
	}

	.item-list .item {
		border-bottom: 2upx solid #eee;
	}

	.item-list .item .pic {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.item-list .item .right {
		background: #FFFFFF;
		flex: 1;
		padding: 15upx;
		min-height: 120upx;
		margin-left: 20upx;
	}

	.item-list .item .right .name {
		color: #2782D7;
		font-size: 28upx;
	}

	.item-list .item .right .name .em {
		color: #777;
		font-size: 24upx;
	}

	.item-list .item .right .btn {
		font-size: 26upx;
		color: #2782D7;
		display: flex;
		justify-content: flex-end;
	}

	.item-list .item .right .btn .span {
		margin-left: 20upx;
	}

	.item-list .item .right .comment-msg {
		font-size: 28upx;
		color: #333;
	}
</style>
