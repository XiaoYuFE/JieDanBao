
import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isNoData:false,
      isLoading:true,
     
      
      orderType: "",//订单大分类
      orderStep:"all",//订单子集分类
      page:1,
      wxTimerList:{},//存放倒计时
      wxTimerInstance:{},
      dataInfo:[],
      isDownRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   * type:wjd(新订单)，clz(处理中)，yjs(已结束)
   * step: 所有的步骤
   */
  onLoad: function (options) {
    console.dir(options);
      this.setData({
        orderType: options.ordertype,
        orderStep: options.step,
      });
    this._getData();
  },


  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      isNoData:false,
      isDownRefresh: true
    });
    this._getData("onPullDownRefresh");
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
      orderStep: e.currentTarget.dataset.ordertype=="wjd" ? "wjd":"all",
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
    console.dir(e.currentTarget);
    this.setData({
      orderStep: e.currentTarget.dataset.orderstep,
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



  _getData:function(typeStr){
    var that=this;
    if (!typeStr){
      this.setData({
        isLoading: true
      });
    }
    app.form.requestPost(app.form.API_CONFIG.jiaju.orders, {
      ordertype:that.data.orderType,
      step: that.data.orderStep,
      page: !typeStr ? that.data.page:1
    }, function (res) {
      if (typeStr) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({ isDownRefresh: false })
      }
      if (res.data.orders){
        for (var i = 0; i < res.data.orders.length; i++) {
          res.data.orders[i].format_mobile = that._formatMobile(res.data.orders[i].mobile);
          res.data.orders[i].format_stepname = that._formatStepName(res.data.orders[i].step);
          res.data.orders[i].d_time = parseInt(res.data.orders[i].d_time);
          that._countDown(res.data.orders[i]);
        }
        if (!typeStr) {
          that.data.dataInfo.push.apply(that.data.dataInfo, res.data.orders);
        }else{
          that.data.dataInfo = res.data.orders;
        }
        
        that.setData({
          page:!typeStr ? (that.data.page + 1) :1,
          dataInfo: that.data.dataInfo,
          isLoading: false
        });
        if (that.data.dataInfo.length == 0 && !that.data.isDownRefresh) {
          that.setData({ isNoData: true })
        }
      }
      
      //如果是同一个列表，数据直接加在后面，不是同一个列表就要重新赋值
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
          case "void":
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
    var formatType="";
    if (that.data.orderStep=="wjd"){
      formatType="MS";
    }else{
      formatType = "DHMS";
    }

    wxTimerName = new timer({
      beginTime: item.d_time,
      formatType: formatType,
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
  ljjdHandleBtn: function (e) {
    //请求数据
    var that = this;
    wx.showLoading();
    app.form.requestPost(app.form.API_CONFIG.jiaju.opt_orders, {
      id: e.target.dataset.id,
      step: "wjd"
    }, function (res) {
      wx.hideLoading();
      if (!!res.status) {
        wx.navigateTo({
          url: '/pages/jiaju/detail/detail?fromWhere=dialog&id=' + e.target.dataset.id,
        })
      }
    });
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