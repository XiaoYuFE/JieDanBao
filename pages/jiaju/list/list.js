

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
      wxTimerList: {},//存放倒计时
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

    //设置标签状态
    this.setData({
      orderType: e.currentTarget.dataset.ordertype,
      orderSubType: "all",//订单子集分类
      dataInfo:[],
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
    //设置标签状态
    this.setData({
      orderSubType: e.currentTarget.dataset.ordersubtype,
      dataInfo: [],

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
            //保存住当前的时间
            var wxTimerStr = "wxTimer"+i;
            wxTimerStr = new timer({
              beginTime: res.data.data[i].d_time,
              formatType: "MS",
              name: i,
              complete: function () {
                console.log("完成了")
              },
              interval: 1,
              intervalFn: function () {
                console.dir("asdfasdf");
              }
            })
            wxTimerStr.start(that);
          }
          //如果是同一个列表，数据直接加在后面，不是同一个列表就要重新赋值
          that.data.dataInfo.push.apply(that.data.dataInfo, res.data.data);
          that.setData({
            page:that.data.page+1,
            dataInfo: that.data.dataInfo,
            isLoading:false
          });

        }else{
          console.dir("服务器端返回错误");
        }
      }
    })
  },

  _formatMobile:function(phoneNum){
    var phoneNum = String(phoneNum);
    return phoneNum.substring(0, 3) + "****" + phoneNum.substring(8, 11);
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