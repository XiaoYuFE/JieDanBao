//app.js


App({
  //微信上面关闭删除后，进来就会触发这个事件，如果只是关闭没有删除小程序，那么不会触发该事件
  onLaunch:function(){
    console.dir("App-onLaunch");
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var name = 'iPhone X'
        if (res.model.indexOf(name) > -1) {
          that.globalData.isIpx = true;
        }
      }
    });
    wx.redirectTo({ url: '/pages/splash/splash' });
  },
  //每次关闭后在进来（不管有没有删除都会触发这个事件）
  onShow: function (options){
    console.dir("App-onShow");
    this.globalData.sessionJdbUkey    = wx.getStorageSync('sessionJdbUkey');
    this.globalData.sessionJdbBrandId = wx.getStorageSync('sessionJdbBrandId');
    this.globalData.sessionJdbUnionid = wx.getStorageSync('sessionJdbUnionid');
    this.globalData.sessionJdbOpenid = wx.getStorageSync('sessionJdbOpenid');
    !this.globalData.sessionJdbUserInfo && (this.globalData.sessionJdbUserInfo = wx.getStorageSync('sessionJdbUserInfo'));
    console.dir(options);
    if (options.path !=='pages/splash/splash'){
      this.isLogin();
    }
  },

  isLogin: function (status){
    var that = this;
    if (status && status=="0"){
      wx.redirectTo({url: '/pages/login/login'});
    } else if(!this.globalData.sessionJdbUkey){
      wx.redirectTo({ url: '/pages/login/login' });
    };
  },

  clearStorage:function(callback){
    wx.removeStorage({ key: 'sessionJdbUkey'});
    wx.removeStorage({ key: 'sessionJdbBrandId'});
    wx.removeStorage({ key: 'sessionJdbUnionid' });
    wx.removeStorage({ key: 'sessionJdbUserInfo' });
    wx.removeStorage({ key: 'sessionJdbOpenid' });

    this.globalData.sessionJdbUkey     = "";
    this.globalData.sessionJdbBrandId  = "";
    this.globalData.sessionJdbUnionid  = "";
    this.globalData.sessionJdbUserInfo = "";
    this.globalData.sessionJdbOpenid   = "";

    !!callback && callback();
  },
  
  globalData: {
    server: "https://m3.xiaoyu.com/",
    
    sessionJdbUserInfo:"",//存放小鱼用户的信息
    sessionJdbUkey:"",
    sessionJdbBrandId:"",//商家id
    sessionJdbUnionid: "",//对于拥有多个账号的企业来说，unionid可以帮助识别不同公众账号下的用户是否是同一个人
    sessionJdbOpenid: '' //在不同的公众账号下openid是不一样的，而他们的unionid却是一样的。
  }
})