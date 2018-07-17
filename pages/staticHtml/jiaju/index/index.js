

Page({
  data: {
   
  },

  onLoad: function () {
   
  },

  onShow: function () {
    
  },

  //获取页面数据（登录以后才执行此步骤）
  

  //拨打电话
  makeCallPhone: function () {
    var that = this;
    wx.makePhoneCall({phoneNumber: that.data.kf_tel })
  },

  onShareAppMessage: function () {
    return {
      title: '小鱼接单宝',
      path: '/pages/login/login',
      imageUrl: "http://m3.xiaoyu.com/img/jiedanbao_share.png",
      success: function (res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {

      }
    }
  }
})