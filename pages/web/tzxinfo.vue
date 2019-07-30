<template>
	<view>
		<view class="info flex flexcol">
		<view class="tzx-title">{{info.article_title}}</view>
		<view class="flex flexrow flexJcs tzx-stit">
			<view class="flex flexrow"><view class="span">{{info.article_time}}</view><view class="span">{{info.article_author}}</view></view>
			<view class="flex flexrow"><view class="wwi-icon wwi-icon-yanjing_xianshi"></view>{{info.article_click}}</view>
		</view>
		<view class="tzx-content"><rich-text :nodes="info.article_content"></rich-text></view>
		<view class="comment-info">
			<view class="title">热门评论</view>
			<view class="item-list">
				<view class="nolist" v-if="!commentList.length">还没有评论，赶紧评论吧！</view>
				<view class="item flex flexrow" v-for="(item,index) in commentList" :key="index">
					<image class="pic" :src="item.member_avatar" ></image>
					<view class="right flex flexcol">
						<view class="name flex flexrow flexJcs"><view class="">{{item.member_name}}</view><view class="em">{{item.time}}</view></view>
						<view class="up-msg flex flexcol" v-if="item.item">
							<view class="up-msg-name">Re:{{item.item[0].member_name}}</view>
							<view class="up-msg-comment">{{item.item[0].comment_message}}</view>
						</view>
						<view class="comment-msg">{{item.comment_message}}</view>
						<view class="btn flex flexrow"><view class="span" @click="Ding(item)">顶[{{item.comment_up}}]</view><view class="span" @click="backComment(item)">回复</view></view>
					</view>
				</view>
				<view class="showload" v-if="showLoad" @click="getComment">{{loadText}}</view>
			</view>
		</view>
		</view>
		<view class="info-bottom flex flexrow flexJcs">
			<view class="btn"  @click="backComment">发表评论({{info.article_comment_count}})</view>
			<view class="ding" @click="Zan"><view class="wwi-icon wwi-icon-zan"></view>{{info.article_attitude_1}}</view>
		</view>
		<wwi-mask-up themeColor="#ff0036" :title="Retitle"  bottomText="确定" ref="wwiMaskUp" @onConfirm="onConfirm">
			<view class="uni-textarea">
				<textarea v-model="comment" maxlength="300" placeholder="请输入评论内容.." auto-height />
			</view>
		</wwi-mask-up>
	</view>
</template>

<script>
	import wwiMaskUp from '../../components/wwi-mask-up.vue'
	export default {
		components:{
			wwiMaskUp
		},
		data() {
			return {
				key:'',
				newsId:"",
				info:[],
				curpage:1,
				hasmore:true,
				commentList:[],
				showLoad:false,
				loadText:'点击加载更多',
				comment:'',
				commentId:'',
				Retitle:'发表评论'
			};
		},
		methods:{
			Inlimine:function(){
				this.wwiopt({
					url: "/index.php?app=tzx&wwi=tzx_show",
					data: {article_id:this.newsId},
					success: res => {
						res.data.datas.article_content=res.data.datas.article_content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;vertical-align: middle" ');
						this.info = res.data.datas;
					}
				});
			 },
			 getComment:function(e){
				 if(!this.hasmore){
					 return;
				 }
				 this.wwiopt({
				 	url: "/index.php?app=tzx&wwi=comment_list",
				 	data: {page:10,curpage:this.curpage,comment_object_id:this.newsId ,type:'article'},
				 	success: res => {
						if(res.data.code==200){
							this.curpage += 1;
							if(e){
								res.data.datas.comment_list.forEach(item=>{
									this.commentList.push(item);
								});
								if (!res.data.hasmore) {
									this.loadText = "没有更多数据了";
								}

							}else{
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
			 Ding:function(e){
				if (!this.key) {
					uni.navigateTo({
						url: '/pages/web/login/login'
					});
				}
				 uni.request({
				 	url: this.ApiUrl+"/index.php?app=tzx&wwi=comment_up",
				 	method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
				 	data: {key:this.key,comment_id:e.comment_id},
				 	success: res => {
						if(res.data.datas.status==1){
							uni.showToast({
								title: '点赞成功',icon:"none"
							});
							e.comment_up = Number(e.comment_up)+ Number(1);
						}else{
							uni.showToast({
								title:res.data.datas.message,icon:"none"
							});
						}
						
					}
				 });
				 
			 },
			 Zan:function(){
				if (!this.key) {
					uni.navigateTo({
						url: '/pages/web/login'
					});
				}
				 uni.request({
				 	url: this.ApiUrl+"/index.php?app=tzx&wwi=article_up",
				 	method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
				 	data: {key:this.key,article_id:this.newsId},
				 	success: res => {
						if(res.data.datas.status==1){
							uni.showToast({
								title: '点赞成功',icon:"none"
							});
							this.info.article_attitude_1 += 1;
						}else{
							uni.showToast({
								title:res.data.datas.message,icon:"none"
							});
						}
						
					}
				 });
			 },
			 backComment:function(e){
				 if(e.comment_id){
					 this.commentId = e.comment_id;
					 this.Retitle = '回复：'+e.member_name;
				 }else{
					 this.commentId = '';
					 this.Retitle = '发表评论';
				 }
				 this.$refs.wwiMaskUp.showPickerView();
			 },
			 onConfirm:function(){
				 if(this.comment.length < 5){
					uni.showToast({
						title: '内容不得低于5个字符',icon:"none"
					});
					return;
				 }
				uni.request({
					url: this.ApiUrl+"/index.php?app=tzx&wwi=comment_save",
					method: 'POST',
					header: {'content-type': 'application/x-www-form-urlencoded'},
					data: {key:this.key,comment_object_id:this.newsId,comment_id:this.commentId,comment_message: this.comment,comment_type:'article'},
					success: res => {
						if (res.data.datas.status == 1) {
							     this.hasmore = true;
								 this.curpage = 1;
							     this.getComment();
							     this.comment = '';
							uni.showToast({
								title:'评论成功',icon:"none"
							});
							}else{
							uni.showToast({
								title:res.data.datas.message,icon:"none"
							});
							}

					}
				});
			 }
		},
		onLoad: function(e) {
			this.key = uni.getStorageSync('key');
			if (e.id) {
				this.newsId = e.id;
				this.Inlimine();
				this.getComment()
			} else {
				uni.showToast({
					title: '文章不存在',
					icon: "none",
					success() {
						setTimeout(function() {
							uni.navigateBack();
						}, 1000);
					}
				});

			}
		},
		onShow:function(){
			this.key = uni.getStorageSync('key');
		}
		
	}
</script>

<style>
page{background: #f8f8f8;}
.tzx-title{font-size: 32upx; font-weight: bold; margin-bottom: 10upx;}
.info{width: 750upx; margin: 0 auto; padding: 20upx; box-sizing: border-box; margin-bottom: 80upx;}
.tzx-stit{color: #777; font-size: 28upx; margin-bottom: 10upx;}
.tzx-stit .span{margin-right: 20upx;}
.tzx-stit .wwi-icon{margin-right: 10upx;}
.tzx-content{background: #FFFFFF; padding: 20upx;}
.comment-info .title{font-size: 32upx; font-weight: bold; display: flex; align-items: center; height: 100upx;}
.item-list{padding-top: 20upx;}
.item-list .item{border-bottom: 2upx solid #eee;}
.item-list .item .pic{width: 100upx; height: 100upx; border-radius:50% ;}
.item-list .item .right{background: #FFFFFF; flex: 1; padding: 15upx; min-height: 120upx; margin-left: 20upx;}
.item-list .item .right .name{color: #2782D7; font-size: 28upx;}
.item-list .item .right .name .em{color: #777; font-size: 24upx;}
.item-list .item .right .btn{font-size: 26upx; color:#2782D7 ; display: flex; justify-content: flex-end;}
.item-list .item .right .btn .span{margin-left: 20upx;}
.item-list .item .right .comment-msg{font-size: 28upx; color: #333;}
.nolist{height: 200upx;display: flex; align-items: center; justify-content: center;}
.showload{height: 100upx;display: flex; align-items: center; justify-content: center; color: #666;}
.up-msg{border: 2upx #cbe9f3 dotted; padding: 10upx; font-size: 24upx; color:#cbe9f3; border-radius:35upx 0 35upx 0 ;}
.info-bottom{height: 80upx; background: #FFFFFF; bottom: 0; position: fixed; width: 100%; box-sizing: border-box ; padding: 15upx}
.info-bottom .btn{background: #f8f8f8; flex: 1; display: flex; align-items: center; justify-content: center; font-size: 28upx; border-radius:15upx ;}
.info-bottom .ding{margin-left: 15upx;display: flex; align-items: center; justify-content: center; color: #f30;}
.uni-textarea{padding: 20upx; background: #f8f8f8;}
.uni-textarea textarea{width: 100%;}
</style>
