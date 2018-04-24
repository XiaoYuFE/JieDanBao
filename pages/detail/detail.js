
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: "",
    orderId:"",
    stepText: ['新订单', '已量房', '已设计', '已签约', '成功'],
    customerInfo: "",
    orderInfo: "",
    decorateInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取页面传递过来的id,然后动过id获取订单详情
    that.setData({
      orderId:options.id
    });
    wx.request({
      url: app.globalData.server + "detail.php",
      data: options,
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          step: res.data.step,
          customerInfo: res.data.customerInfo,
          orderInfo: res.data.orderInfo,
          decorateInfo: res.data.decorateInfo
        })
      }
    });



  },
  setStepHandler: function () {
    var that = this;
    if (this.data.step >= 5) {
      return;
    }
    wx.showActionSheet({
      itemList: [this.data.stepText[this.data.step], '停止服务'],
      success: function (res) {
        if (res.tapIndex == 0) {
          //点击的是步骤,发送数据请求(用户id 订单id)
          if (that.data.step == 3) {
            wx.redirectTo({
              url: '/pages/cost/cost?uid=' + app.globalData.sessionJdbId + "&orderid=" + that.data.orderId
            });
          } else {
            //发送uid orderid  step 给后端
            wx.showLoading({
              title: '加载中',
              mask: true
            });
            wx.request({
              url: app.globalData.server + "detail.php",
              data: { 'uid': app.globalData.sessionJdbId },
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                //关闭加载层
                wx.hideLoading();
                that.setData({
                  step: that.data.step + 1
                });
              }
            });
          }
        } else if (res.tapIndex == 1) {
          //点击的是停止服务

        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  makeCallPhone: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.customerInfo.phone //仅为示例，并非真实的电话号码
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