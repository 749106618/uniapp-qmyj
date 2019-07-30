<template>
	<view class="wwi-popup">
		<view :class="{'popupMask':showPicker}" @click="maskClick" catchtouchmove="true"></view>
    <view class="wwi-popup-content " :class="{'wwi-popup-view-show':showPicker}">
      <view class="wwi-popup__hd" catchtouchmove="true">
        <view class="wwi-popup__action" @click="pickerCancel">取消</view>
        <view class="wwi-popup__action" :style="{color:themeColor}" @click="pickerConfirm">确定</view>
      </view>
      <picker-view indicator-style="height: 40px;" class="wwi-popup-view" :value="pickerValue" @change="pickerChange">
        <block>
          <picker-view-column>
            <view class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.area_name}}</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.area_name}}</view>
          </picker-view-column>
          <picker-view-column>
            <view class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.area_name}}</view>
          </picker-view-column>
        </block>
      </picker-view>
    </view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      pickerValue: [0, 0, 0],
      provinceDataList: [],
      cityDataList: [],
      areaDataList: [],
			showPicker:false
    };
  },
  created() {
  	this.pickerValue = this.pickerValueDefault;
  },
  props: {

    /* 默认值 */
    pickerValueDefault: {
      type: Array,
      default: [0, 0, 0]
    },
    /* 主题色 */
    themeColor: String
  },
  methods: {
	  getCity(e,id){
		  if(e!=1 || this.provinceDataList.length<1){
		  uni.request({
		  	url: this.ApiUrl+'/index.php?app=area&wwi=area_list',
		  	data: {area_id:id},
		  	success: res => {
				if(res.data.datas.area_list.length == 0){ return false;}
				if(e==1){
					this.provinceDataList=res.data.datas.area_list;
					this.getCity(2,res.data.datas.area_list[this.pickerValueDefault[0]].area_id);
				}else if(e==2){
					this.cityDataList=res.data.datas.area_list;
					this.getCity(3,res.data.datas.area_list[this.pickerValueDefault[1]].area_id);
				}else if(e==3){
					this.areaDataList=res.data.datas.area_list;
				}
			}
		  });
		  }
	  },
    show() {
      setTimeout(() => {
        this.showPicker = true;
		this.getCity(1,0);
      }, 0);
    },
    maskClick() {
      this.pickerCancel();
    },
    pickerCancel() {
      this.showPicker = false;
      this._$emit('onCancel');
    },
    pickerConfirm(e) {
      this.showPicker = false;
      this._$emit('onConfirm');
    },
    showPickerView() {
      this.showPicker = true;
    },
    pickerChange(e) {
      let changePickerValue = e.mp.detail.value;
      if (this.pickerValue[0] !== changePickerValue[0]) {
        // 第一级发生滚动
		this.getCity(2,this.provinceDataList[changePickerValue[0]].area_id);
        changePickerValue[1] = 0;
        changePickerValue[2] = 0;
      } else if (this.pickerValue[1] !== changePickerValue[1]) {
        // 第二级滚动
		this.getCity(3,this.cityDataList[changePickerValue[1]].area_id);
        changePickerValue[2] = 0;
      }
      this.pickerValue = changePickerValue;
      this._$emit('onChange');
    },
    _$emit(emitName) {
      let pickObj = {
        label: this._getLabel(),
        value: this.pickerValue,
        cityCode: this._getCityCode(),
		areaCode: this._getAreaCode()
      };
      this.$emit(emitName, pickObj);
    },
    _getLabel() {
      let pcikerLabel =
        this.provinceDataList[this.pickerValue[0]].area_name +
        ' ' +
        this.cityDataList[this.pickerValue[1]].area_name +
        ' ' +
        this.areaDataList[this.pickerValue[2]].area_name;
      return pcikerLabel;
    },
    _getCityCode() {
      return this.cityDataList[this.pickerValue[1]].area_id;
    },
    _getAreaCode() {
      return this.areaDataList[this.pickerValue[2]].area_id;
    }
  }
}
</script>

<style>

</style>
