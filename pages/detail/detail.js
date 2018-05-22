import form from '../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:"",
    sid:"",
    stepText: ['新订单', '已量房', '设计中', '已对比', '已签约', '施工中', '完成'],
    dataList:"",
    isIpx:app.globalData.isIpx,
    fromWhere:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.isLogin();
    var that = this;
    //获取页面传递过来的id,然后动过id获取订单详情
    that.setData({
      fromWhere: options.from,
      sid:options.sid
    });

    app.form.requestPost(app.form.API_CONFIG['detail'], {sid: options.sid}, function (res) {
      that.setData({
        step: parseInt(res.data.step),
        dataList: res.data
      })
    });
  },
  setStepHandler: function () {
    var that = this;
    if (this.data.step >= 6 || this.data.step==-1) {
      return;
    }
    wx.showActionSheet({
      itemList: [this.data.stepText[this.data.step+1], '停止服务'],
      success: function (res) {
        if (res.tapIndex == 0) {
          //点击的是步骤,发送数据请求(用户id 订单id)
          if (that.data.step == 3) {
            wx.redirectTo({
              url: '/pages/cost/cost?sid='+that.data.sid+"&step="+that.data.step
            });
          } else {
            //发送uid orderid  step 给后端
            wx.showLoading({
              title: '加载中',
              mask: true
            });

            app.form.requestPost(app.form.API_CONFIG['upstep'], { 
              step: that.data.step + 1,
              sid: that.data.sid,
              bid: app.globalData.sessionJdbBrandId,
              ukey: app.globalData.sessionJdbUkey
            }, function (res) {
              wx.hideLoading();
              if (res.status == "1") {
                that.setData({
                  step: that.data.step + 1
                });
              }
            });
          }
        } else if (res.tapIndex == 1) {
          //点击的是停止服务
          app.form.requestPost(app.form.API_CONFIG['upstep'], {
            step: -1,
            sid: that.data.sid,
            bid: app.globalData.sessionJdbBrandId,
            ukey: app.globalData.sessionJdbUkey
          }, function (res) {   
            wx.hideLoading();
            if (res.status == "1") {
              that.setData({
                step: -1
              })
            }
          });
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
      phoneNumber: that.data.dataList.signinfo.mobile //仅为示例，并非真实的电话号码
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