	<template>
	<view class="index">
		<view class="mask" v-show="showMask" @click="hide"></view>
		<view class="wwi-scroll-tab">
			<view class="hd">
			<view class="lt">
			<scroll-view id="tab-bar" class="tab" scroll-x :scroll-left="scrollLeft">
			<block v-for="(tab,index) in tabs" :key="tab.ac_id">
				<view :class="['tab-li',currentTab==index ? 'on' : '']" :id="'s'+tab.ac_id" :data-current="index" @tap="swichNav(index)">
					<view class="p">{{tab.ac_name}}</view>
				</view>
			</block>
				</scroll-view>
				</view>
			<view class="rt" id="listMore" @click="hide"><view class="wwi-icon wwi-icon-xuanzeqizhankai"></view></view>
			</view>
			<view class="bd" v-show="showMask">
          <view class="all-tab J-show">
			  <block v-for="(tab,index) in tabs" :key="tab.ac_id">
			  <view :class="['li',currentTab==index ? 'on' : '']" :data-current="index" @tap="swichSNav(index)">
				  <view class="a">{{tab.ac_name}}</view>
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
						<view class="wwi-default-list">
						<view class="li border" v-for="(newsitem,index2) in tab" :key="index2">
							<navigator v-if="newsitem.article_url"  :url="'/pages/web/tourl?url='+newsitem.article_url" class="a">
								<view class="h4">{{newsitem.article_title}}</view>
								<view class="right">
									<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
								</view>
							</navigator>
							<navigator v-if="!newsitem.article_url"  :url="'/pages/web/newsinfo?newid='+newsitem.article_id" class="a">
								<view class="h4">{{newsitem.article_title}}</view>
								<view class="right">
									<view class="wwi-icon wwi-icon-jiantou_liebiaoxiangyou"></view>
								</view>
							</navigator>
						</view></view>
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
					url: this.ApiUrl + "/index.php?app=document&wwi=class_list",
					data: {},
					success: res => {
						if(res.data.code==200){
							this.tabs=res.data.datas.class_list;
							this.tabs.unshift({ac_id:0,ac_name:'全部'});
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
					let result = await this.getWidth('s'+this.tabs[i].ac_id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getWidth('s'+this.tabs[index].ac_id),
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
						console.log(tabBar)
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
					let result = await this.getWidth('s'+this.tabs[i].ac_id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getWidth('s'+this.tabs[e].ac_id),
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
					url: "/index.php?app=document&wwi=list" ,
					data: {page:20,curpage:this.loadpage[e].page,ac_id:this.tabs[e].ac_id},
					success: res => {
						for(let i=0; i < res.data.datas.artice_list.length; i++){
							this.newsitems[e].push({
						            article_id:res.data.datas.artice_list[i].article_id,
									article_title:res.data.datas.artice_list[i].article_title,
									article_url:res.data.datas.artice_list[i].article_url
					           })
						}
						this.loadpage[e]={
							page:this.loadpage[e].page+1,more:res.data.hasmore
						}
					}
				});
				}

			},
			randomfn() {
				console.log(this.tabs.length);
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
</style>
