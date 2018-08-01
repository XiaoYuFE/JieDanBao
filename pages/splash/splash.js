import form from '../../static/js/plugin/form'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.form.requestPost(app.form.API_CONFIG.common.shops,{}, function (res) {
		  that.setData({shops: res.data	});
    });
  },
  
  splashEntrance:function(){
    var user = app.globalData.sessionJdbUserInfo;
    if (user) {
      console.log('login', user);
      wx.redirectTo({ url: '/pages/' + user.category + '/index/index' });
    }
    //微信自动登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          app.form.requestPost(app.form.API_CONFIG.common['login'], { code: res.code }, function (res) {
            if (res.status === 1) {
              //动态全局赋值
              app.globalData.sessionJdbUkey = res.data["ukey"];
              app.globalData.sessionJdbBrandId = res.data["brand_id"];
              app.globalData.sessionJdbUserInfo = res.data;
              app.globalData.sessionJdbUnionid = res.data.unionid;
              app.globalData.sessionJdbOpenid = res.data.openid;
              //本地存储id
              wx.setStorage({
                key: "sessionJdbUkey",
                data: app.globalData.sessionJdbUkey
              });

              wx.setStorage({
                key: "sessionJdbBrandId",
                data: app.globalData.sessionJdbBrandId
              });

              wx.setStorage({
                key: "sessionJdbUserInfo",
                data: app.globalData.sessionJdbUserInfo
              });

              wx.setStorage({
                key: "sessionJdbUnionid",
                data: ''
              });
              wx.setStorage({
                key: "sessionJdbOpenid",
                data: ''
              });
              wx.setStorage({
                key: "sessionJdbUnionid",
                data: app.globalData.sessionJdbUnionid
              });
              wx.setStorage({
                key: "sessionJdbOpenid",
                data: app.globalData.sessionJdbOpenid
              });
              var category = res.data.category;
              wx.redirectTo({ url: '/pages/' + category + '/index/index' });
            }else{
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          });
        }
      }
    });
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    app.form.requestPost(app.form.API_CONFIG.common.shops, {}, function (res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.setData({ shops: res.data });

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