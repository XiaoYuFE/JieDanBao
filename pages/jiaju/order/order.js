// pages/staticHtml/jiaju/order/order.js
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
    stepName:"",
    step:"",
  
    dataInfo:"",
    isDownRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.dir(options);
      var that=this;
      this.setData({
        id:options.id,
        step:options.step,
        stepName: this._formatStepName(options.step)
      });
  },

  _formatStepName: function (stepType) {
    var step;
    switch (stepType) {
      case "dlf":
        step = "待量房";
        break;
      case "dsj":
        step = "待设计";
        break;
      case "dqy":
        step = "待签约";
        break;
      case "yqy":
        step = "已签约";
        break;
      case "void":
        step =  "未成单";
        break;
      case "ysx":
        step= "已失效";
        break;
    }
    return step;
  },

  _getData:function(typeStr){
    var that=this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.process_order, {
      id: that.data.id
    }, function (res) {
      if (typeStr) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          isDownRefresh: false
        });
      }
      that.setData({
        dataInfo: res.data
      });
    });
  },

  previewFaImg: function (e) {
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.dataInfo.sj_img // 需要预览的图片http链接列表
    })
  },
  previewHtImg: function (e) {
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.dataInfo.ht_img // 需要预览的图片http链接列表
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
    this._getData();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this._getData("onPullDownRefresh");
    this.setData({
      isDownRefresh: true
    });
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