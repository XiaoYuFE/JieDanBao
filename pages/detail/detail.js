
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    step:"",
    sid:"",
    stepText: ['新订单', '已量房', '设计中', '已对比', '已签约', '施工中', '完成'],
    dataList:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取页面传递过来的id,然后动过id获取订单详情
    that.setData({
      sid:options.sid
    });

    
    console.dir(app.globalData.sessionJdbBrandId);
    console.dir(app.globalData.sessionJdbUkey);
    wx.request({
      url: app.globalData.server + "/welcome/wechatapp?callback=Jiaju.detail",
      data:{
        sid:options.sid,
        bid: app.globalData.sessionJdbBrandId,
        ukey: app.globalData.sessionJdbUkey
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
      
        console.dir(res);
       
        that.setData({
          step: parseInt(res.data.data.step),
          dataList: res.data.data
        })
      }
    });



  },
  setStepHandler: function () {
    var that = this;
    if (this.data.step >= 6) {
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
            wx.request({
              url: app.globalData.server + "/welcome/wechatapp?callback=Jiaju.upstep",
              data: {
                step:that.data.step+1,
                sid: that.data.sid,
                bid: app.globalData.sessionJdbBrandId,
                ukey: app.globalData.sessionJdbUkey
              },
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                //关闭加载层
                wx.hideLoading();
                if (res.data.status=="1"){
                    that.setData({
                      step: that.data.step + 1
                    });
                }
                
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