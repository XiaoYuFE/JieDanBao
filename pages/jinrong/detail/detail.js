import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    //订单步骤文字在这里
    stepText: {'dfw':'新订单','void':'完成'},
    stepKeyConfig: ['dfw','wancheng','void'],
    isIpx:app.globalData.isIpx,
    fromWhere:"",
    order:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取页面传递过来的id,然后动过id获取订单详情
    that.setData({
      fromWhere: options.from,
      id:options.id
    });

    app.form.requestPost(app.form.API_CONFIG.jinrong.order_info, {id:options.id}, function (res) {
       that.setData({order: res.data})
    });
  },
  setStepHandler: function () {
    var that = this;
    if (this.data.order.step == 'void' || this.data.order.step == 'ywc' ) {
      return false;
    }

    //底部弹出来的操作
    wx.showActionSheet({
      itemList: ['服务完成', '停止服务'],
      success: function (res) {
        if (res.tapIndex === undefined) return false;
        //发送uid orderid  step 给后端
        wx.showLoading({
          title: '加载中',
          mask: true
        });
        var step = res.tapIndex == 0 ? 'ywc' : 'void';
        that.tracking(res.tapIndex == 1);

        app.form.requestPost(app.form.API_CONFIG.jinrong.opt_order, {
          step: step,id: that.data.id
        }, function (res) {
          wx.hideLoading();
          if(res.status == 1){
            that.data.order.step = step;
            that.setData({order: that.data.order});
          }else{
            wx.showModal({ content: res.msg, showCancel: false });
          }
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  makeCallPhone: function () {
    wx.makePhoneCall({phoneNumber: this.data.order.mobile });
    var k = ['dfw','ywc','void'].indexOf(this.data.order.step);
    app.form.tracking('call', 'jdb_jieduan' + k, this.data.order.id);
  },

  tracking: function (stop = false) {
    var config = {'dfw': 'wancheng', 'void': 'stop'};
    var k = this.data.stepKeyConfig.indexOf(this.data.order.step);
    var step = stop ? 'stop' : config[this.data.order.step];

    app.form.tracking(step, 'jdb_jieduan' + k, this.data.order.id);
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




















