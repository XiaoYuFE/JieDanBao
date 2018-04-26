
const app = getApp();


Page({
  data: {
    xyUserInfo: "",
    dataList:"",

  },
  onLoad: function () {
    var that = this;
    if (!app.globalData.sessionJdbUkey){
      wx.getStorage({
        key: 'sessionJdbUkey',
        success: function (res) {
          app.globalData.sessionJdbUkey=res.data;
        }
      })
      wx.getStorage({
        key: 'sessionJdbBrandId',
        success: function (res) {
          app.globalData.sessionJdbBrandId = res.data;
        }
      })
    }

    setTimeout(function(){
      that._getPageData();
    },100)
    
  },
  
  //获取页面数据（登录以后才执行此步骤）
  _getPageData: function () {
    var that=this;
    console.dir(app.globalData.sessionJdbBrandId)
    wx.request({
      url: app.globalData.server + "/welcome/wechatapp?callback=Jiaju.index",
      data:{
        bid: app.globalData.sessionJdbBrandId,
        ukey: app.globalData.sessionJdbUkey
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: "json",
      success: function (res) {
        app.isLogin(res.data.islogin);
        that.setData({
          dataList: res.data.data
        });

       
      }
    })
  },

  // navDetail: function (event){
  //   var url = event.currentTarget.dataset.url;
  //   console.dir(url);
  // },
  //拨打电话
  makeCallPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '18559160494' //仅为示例，并非真实的电话号码
    })
  }
})