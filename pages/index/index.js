
const app = getApp();


Page({
  data: {
    xyUserInfo: "",
    orderCount: "",
    orderNew: ""
  },
  onLoad: function () {
    var that = this;
    //判断是否登录，如果没有登录，那么就要跳转
    if (!app.globalData.sessionJdbId) {
      //检车本地sessionId
      wx.getStorage({
        key: 'sessionJdbId',
        success: function (res) {
          //向后端请求(发送数据sessionJdbId)
          that._getUserInfo(res.data);
        },
        fail: function () {
          //没有本地sessionId证明都没有登陆过，直接跳转到登录页面
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      })
    }else{
      this.setData({
        xyUserInfo: app.globalData.sessionJdbUserInfo,
      });
      this._getPageData();
    }



  },
  //根据id 获取用户信息
  _getUserInfo: function (uid) {
    var that = this;
    wx.request({
      url: app.globalData.server + "login.php",
      data: { "id": uid },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: "json",
      success: function (res) {
        
        //如果用户不存在或则错误
        if (res.data.error) {
          wx.redirectTo({
            url: '/pages/login/login'
          })
        } else {
          app.globalData.sessionJdbId = res.data.XyUserInfo["id"];
          app.globalData.sessionJdbUserInfo = res.data.XyUserInfo;
          //设置用户的信息
          that.setData({
            xyUserInfo: res.data.XyUserInfo
          });
          //本地存储id
          wx.setStorage({
            key: "sessionJdbId",
            data: res.data.XyUserInfo["id"]
          });

          that._getPageData();
        }
      }
    });
  },
  //获取页面数据（登录以后才执行此步骤）
  _getPageData: function () {
    var that=this;
    wx.request({
      url: app.globalData.server + "order1.php",
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: "json",
      success: function (res) {
        console.dir(res);
        that.setData({
          orderCount: res.data.orderCount,
          orderNew: res.data.list
        })
      }
    })
  },
  //拨打电话
  makeCallPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '18559160494' //仅为示例，并非真实的电话号码
    })
  }
})