
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
    dataInfo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    this.setData({
      id: options.id,
      fromWhere: options.fromWhere ? options.fromWhere :""
    })
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
        that.setData({
          dataInfo:res.data
        })
    });
  },

  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
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
        step.stepName = "签约待完成";
        step.tip = "设置签约信息，及时提醒不跑单";
        break;
      case "yqy":
        step.stepName = "已签约";
        step.tip = "";
        break;
      case "void":
        step.stepName = "未成单";
        step.tip = "";
        break;
      case "ysx":
        step.stepName = "已失效";
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