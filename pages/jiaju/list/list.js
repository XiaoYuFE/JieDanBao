

import timer from '../../../static/js/plugin/wxTimer.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isNoData:false,
      isLoading:true,
     
      
      orderType: "",//订单大分类
      orderSubType:"all",//订单子集分类
      page:1,
      wxTimerList:{},//存放倒计时
      wxTimerInstance:{},
      dataInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   * tabType:xdd(新订单)，clz(处理中)，yjs(已结束)
   */
  onLoad: function (options) {
    console.dir(options);
    options.orderType="xdd";
      this.setData({
        orderType: options.orderType
      });
      this._getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  navMainHandle:function(e){
    //点击的是同一个选项返回
    if (!!e.currentTarget.dataset.active) return;
    this._clearIntervalWxtimer();
    //设置标签状态
    this.setData({
      orderType: e.currentTarget.dataset.ordertype,
      orderSubType: "all",//订单子集分类
      dataInfo:[],
      isNoData: false,
      page: 1
    });
    //页面滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    });
    //点击不是同一个标签，那么就不需要重新加载了
    this._getData();
  },

  navSubHandle:function(e){
    if (!!e.currentTarget.dataset.active) return;
    this._clearIntervalWxtimer();
    //设置标签状态
    this.setData({
      orderSubType: e.currentTarget.dataset.ordersubtype,
      dataInfo: [],
      isNoData: false,
      page: 1
    });
   
    //页面滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    //点击不是同一个标签，那么就不需要重新加载了
    this._getData();
  },
  makePhoneCall:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone, 
    })
  },
  _clearIntervalWxtimer:function(){
    var that=this;
    for (var i in that.data.wxTimerInstance) {
      this.data.wxTimerInstance[i].stop();
    }
  },



  _getData:function(){
    var that=this;
    this.setData({
      isLoading:true
    });
    wx.request({
      url: 'https://wnworld.com/api/JieDanBao/order_list.php',
      data: { "type": that.data.orderType, "page": that.data.page,"subType":that.data.orderSubType},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        console.dir(res);
        if(res.data.ok){
          for (var i = 0; i < res.data.data.length;i++){
            res.data.data[i].format_mobile = that._formatMobile(res.data.data[i].mobile);
            res.data.data[i].format_stepname = that._formatStepName(res.data.data[i].steptype);
            that._countDown(res.data.data[i]);
          }

         

         
          //如果是同一个列表，数据直接加在后面，不是同一个列表就要重新赋值
          that.data.dataInfo.push.apply(that.data.dataInfo, res.data.data);
          that.setData({
            page:that.data.page+1,
            dataInfo: that.data.dataInfo,
            isLoading:false
          });

          if (that.data.dataInfo.length ==0) {
            that.setData({ isNoData:true})
          }
        }else{
          console.dir("服务器端返回错误");
        }
      }
    })
  },

  _formatStepName:function(stepType){
       var stepName="";
        switch(stepType){
          case "dlf":
            stepName ="上门量房待完成";
            break;
          case "dsj":
            stepName = "设计方案待完成";
            break;
          case "dqy":
            stepName = "签约待完成";
            break;
          case "yqy":
            stepName = "已签约";
            break;
          case "wcd":
            stepName = "未成单";
            break;
          case "ysx":
            stepName = "已失效";
            break;
        }
        return stepName;
  },
  _formatMobile:function(phoneNum){
    var phoneNum = String(phoneNum);
    return phoneNum.substring(0, 3) + "****" + phoneNum.substring(8, 11);
  },

  _countDown:function(item){
   
    var that=this;
     
    var wxTimerName = "wxTimer" + item.id;
    wxTimerName = new timer({
      beginTime: item.d_time,
      formatType: "MS",
      name: item.id,
      complete: function () {
        console.log("完成了")
      },
      interval: 1,
      intervalFn: function () {

      }
    })
    wxTimerName.start(that);
    that.data.wxTimerInstance[item.id] = wxTimerName;
     
    
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.dir("onReachBottom");
    this.setData({
      isLoading:true
    });
    this._getData();

      
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})