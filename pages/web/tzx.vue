	<template>
	<view class="index">
		<view class="mask" v-show="showMask" @click="hide"></view>
		<view class="wwi-scroll-tab">
			<view class="hd">
			<view class="lt">
			<scroll-view id="tab-bar" class="tab" scroll-x :scroll-left="scrollLeft">
			<block v-for="(tab,index) in tabs" :key="tab.class_id">
				<view :class="['tab-li',currentTab==index ? 'on' : '']" :id="'s'+tab.class_id" :data-current="index" @tap="swichNav(index)">
					<view class="p">{{tab.class_name}}</view>
				</view>
			</block>
				</scroll-view>
				</view>
			<view class="rt" id="listMore" @click="hide"><view class="wwi-icon wwi-icon-xuanzeqizhankai"></view></view>
			</view>
			<view class="bd" v-show="showMask">
          <view class="all-tab J-show">
			  <block v-for="(tab,index) in tabs" :key="tab.class_id">
			  <view :class="['li',currentTab==index ? 'on' : '']" :data-current="index" @tap="swichSNav(index)">
				  <view class="a">{{tab.class_name}}</view>
			  </view>
			  </block>
		</view>
		</view>
		<view class="clear"></view>
		</view>
		<swiper :current="currentTab" class="swiper-box" duration="300" @change="bindChange" v-if="newsitems.length > 0">
			<block v-for="(tab,index1) in newsitems" :key="index1">
				<swiper-item>
					<scroll-view class="index-bd" scroll-y @scrolltolower="loadMore(index1)">
						<view class="wwi-news-list">
							<navigator :url="'/pages/web/tzxinfo?id='+newsitem.article_id" class="li flex flexcol" v-for="(newsitem,index2) in tab" :key="index2">
								<view class="title">{{newsitem.article_title}}</view>
								<view class="newsImg flex flexJcc">
									<image :src="newsitem.img" mode="widthFix"></image>
									<view class="span">{{newsitem.class_name}}</view>
								</view>
								<view class="stitle">{{newsitem.article_abstract}}</view>
								<view class="floor flex flexrow flexJcs">
									<view class="fl flex flexrow flexAic"><view class="wwi-icon wwi-icon-shijian"></view>{{newsitem.time}}</view>
									<view class="fr">阅读全文</view>
								</view>
							</navigator>
						</view>
					</scroll-view>
				</swiper-item>
			</block>
		</swiper>
		
	</view>
	</template>

<script>
	export default {
		data() {
			return {
				scrollLeft: 0,
				tabs:[],
				currentTab: 0,
				isClickChange: false,
				newsitems:[],
				showMask: false,
				loadpage:[]
			};
		},
		methods: {

			Inlimine() {
				uni.request({
					url: this.ApiUrl + "/index.php?app=tzx&wwi=class_list",
					data: {},
					success: res => {
						if(res.data.code==200){
							this.tabs=res.data.datas.article_class_list;
							this.tabs.unshift({class_id:0,class_name:'全部'});
							let loadpage = [];
							for(let i = 0; i < this.tabs.length; i++){
								loadpage.push({page:1,more:true});
							}
							this.loadpage = loadpage;
							this.loadMore(this.currentTab);
							this.newsitems = this.randomfn()
						}
					}
				});
			},
			hide() {
				if(this.showMask){
					this.showMask = false
				}else{
					this.showMask = true
				}
			},
			bindChange: async function (e) {
				let index = e.target.current;
				if (this.isClickChange) {
					this.currentTab = index;
					this.isClickChange = false;
					return;
				}
				let tabBar = await this.getWidth("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;

				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getWidth('s'+this.tabs[i].class_id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getWidth('s'+this.tabs[index].class_id),
					nowWidth = nowElement.width,
					navElet = await this.getWidth('listMore'),
					navWidth = navElet.width,
					navWin= winWidth-navWidth;

				if (width + nowWidth - tabBarScrollLeft > navWin) {
					this.scrollLeft = width + nowWidth - navWin;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.currentTab = index; //一旦访问data就会出问题
				this.loadMore(index);
			},
			getWidth: function (id) { //得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			swichNav: async function (e) { //点击tab-bar
				if (this.currentTab === e) {
					return false;
				} else {
					let tabBar = await this.getWidth("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.currentTab = e;
					this.loadMore(e);
					
				}
			},
			swichSNav: async function (e) { //点击tab-bar
				if (this.currentTab === e) {
					return false;
				} else {
				let tabBar = await this.getWidth("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;

				let width = 0;

				for (let i = 0; i < e; i++) {
					let result = await this.getWidth('s'+this.tabs[i].class_id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getWidth('s'+this.tabs[e].class_id),
					nowWidth = nowElement.width,
					navElet = await this.getWidth('listMore'),
					navWidth = navElet.width,
					navWin= winWidth-navWidth;
					

				if (width + nowWidth - tabBarScrollLeft > navWin) {
					this.scrollLeft = width + nowWidth - navWin;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
					this.isClickChange = true;
					this.currentTab = e;
					this.loadMore(e);
					
				}
			},
			loadMore: function (e) {
				if(this.loadpage[e].more){
				this.wwiopt({
					url: "/index.php?app=tzx&wwi=article_list" ,
					data: {page:10,curpage:this.loadpage[e].page,class_id:this.tabs[e].class_id},
					success: res => {
						res.data.datas.article_list.forEach(item=>{
								this.newsitems[e].push({
						            article_id:item.article_id,
									article_title:item.article_title,
									article_abstract:item.article_abstract,
									img:item.img,
									time:item.time,
									class_name:item.class_name
					           })
						});
						this.loadpage[e]={
							page:this.loadpage[e].page+1,more:res.data.hasmore
						}
					}
				});
				}

			},
			randomfn() {
				let ary = [];
				for (let i = 0, length = this.tabs.length; i < length; i++) {
					let aryItem = [];
					ary.push(aryItem);
				}
				return ary;
			}
			
		},
		onLoad: function(e) {
			this.Inlimine();
		},
		onUnload: function() {
			this.scrollLeft = 0,
				this.isClickChange = false,
				this.currentTab = 0;
		}
	}
</script>

<style>
page{background-color: #F8F8F8; display: flex;}
.index {display: flex;flex: 1;flex-direction: column;}
.swiper-box {flex: 1;width: 100%;height: calc(100% - 102upx);}
.index-bd {width: 100%;height: 100%;}
.swiper-box view {text-align: center;}
.mask {position: fixed;z-index: 998;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(255, 255, 255, .01);}
.wwi-news-list{}
.wwi-news-list .li{background: #FFFFFF; margin-bottom: 20upx; padding: 20upx;}
.wwi-news-list .li .title{font-size: 32upx;  text-align: left; line-height: 50upx;}
.wwi-news-list .li .stitle{font-size: 28upx; text-align: left; color: #888; text-overflow: ellipsis; overflow: hidden; max-height: 80upx; margin-top: 20upx;}
.wwi-news-list .li .floor{margin-top: 20upx;font-size: 28upx;color: #888;}
.wwi-news-list .li .newsImg{width: 100%; height: 100%; position: relative; margin-top: 20upx;}
.wwi-news-list .li .newsImg image{width: 100%; vertical-align: middle;}
.wwi-news-list .li .newsImg .span{position: absolute;font-size: 28upx; right: 0; bottom: 0; background: rgba(0,0,0,0.6); color: #fff; padding: 10upx 40upx;}
</style>
