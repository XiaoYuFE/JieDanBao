
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
    wxTimerList: {}, //存放倒计时
    wxTimerInstance: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.group("detail页面onLoad事件");
    console.dir(options);
    this.setData({
      id: options.id,
      fromWhere: options.fromWhere ? options.fromWhere :""
    })
  },

  _clearIntervalWxtimer: function () {
    this.data.wxTimerInstance.stop();
  },

  _countDown: function (item) {
    var that = this;
    var wxTimerName = new timer({
      beginTime: item,
      formatType: "HMS",
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
  

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
      id: that.data.id
    }, function (res) {
        console.dir(res);
        var stepObj = that._formatStepName(res.data.step);
        res.data.format_stepname = stepObj.stepName;
        res.data.format_steptip = stepObj.tip;
        that._countDown(res.data.d_time)
        that.setData({
          dataInfo:res.data
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})