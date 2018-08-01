
import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    fromWhere:"",
    dataInfo:"",
    lftimeEmty:true,
    wxTimerList: {}, //存放倒计时
    wxTimerInstance: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.group("detail页面onLoad事件");
   
    this.setData({
      id: options.id,
      fromWhere: options.fromWhere ? options.fromWhere :""
    })
    
  },

  _clearIntervalWxtimer: function () {
    this.data.wxTimerInstance && this.data.wxTimerInstance.stop();
  },

  _countDown: function (item) {
    var that = this;
    var wxTimerName = new timer({
      beginTime: item,
      formatType: "DHMS",
      name: "wxTimer",
      complete: function () {
        console.log("完成了")
      },
      interval: 1,
      intervalFn: function () {

      }
    })
    wxTimerName.start(that);
    that.data.wxTimerInstance = wxTimerName;
  },
  

 
  onPullDownRefresh: function () {
    console.group("onPullDownRefresh");
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this._getData("onPullDownRefresh");
  },
  onShow:function(){
    this._getData();
  },



  _getData:function(typeStr){
    var that=this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
      id: that.data.id
    }, function (res) {
      that._clearIntervalWxtimer();
      if (typeStr = "onPullDownRefresh") {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
      var stepObj = that._formatStepName(res.data.step);
      res.data.format_stepname = stepObj.stepName;
      res.data.format_steptip = stepObj.tip;
      that._countDown(res.data.d_time)
      that.setData({
        dataInfo: res.data
      });

      if (res.data.l_time.indexOf("0000") < 0) {
        that.setData({
          lftimeEmty: false
        })
      }
    });
  },


  openTipDialog:function(){
    wx.showModal({
      content: '为了保证服务效率与质量，提升用户体验，一些环节会设置服务剩余时间。请在剩余时间内及时完成服务，否则该订单有可能会失效，不能再联系客户。',
      showCancel:false
    })
  },

  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },

  openMap:function(){
    var that = this;
    console.dir(that.data)
    if (that.data.dataInfo.community){
      wx.redirectTo({
        url: '/pages/map/map?title=' + that.data.dataInfo.community,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  _formatStepName: function (stepType) {
    var step={};
    switch (stepType) {
      case "dlf":
        step.stepName = "上门量房待完成";
        step.tip ="设置量房时间，及时提醒不跑单";
        break;
      case "dsj":
        step.stepName = "设计方案待完成";
        step.tip = "设置设计方案时间，及时提醒不跑单";
        break;
      case "dqy":
        step.stepName = "合同签约待完成";
        step.tip = "请及时更新订单";
        break;
      case "yqy":
        step.stepName = "合同签约已完成";
        step.tip = "";
        break;
      case "void":
        step.stepName = "已终止服务";
        step.tip = "";
        break;
      case "ysx":
        step.stepName = "订单已失效";
        step.tip = "";
        break;
    }
    return step;
  },

  resultDialogBtn:function(){
      this.setData({
        fromWhere:""
      })
  },

  
  
})