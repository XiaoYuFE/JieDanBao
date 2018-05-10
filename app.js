//app.js
App({
  
  //获取小鱼家装用户信息
  getXyUserInfo:function(callback){
    console.log("getXyUserInfo");
    var that=this;
     //判断app.globalData.xyUserInfo是否存在
    wx.getStorage({
      key: 'sessionJdbUserInfo',
      success: function (res) {
        //如果获取到sessionId,证明用户登录过了,直接读取本地存储res.data
        that.globalData.xyUserInfo=res.data;
      },
      fail:function(){
        //如果没有本地存储，那么就要获取去登录了
        wx.navigateTo({
          url: 'pages/login/login'
        })
      }
    })
    
     
  },
  isLogin: function (status){
    if (status=="0"){
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  },
  globalData: {
    server: "https://m3.xiaoyu.com",
    sessionJdbUserInfo:"",//存放小鱼用户的信息
    sessionJdbUkey:"Ak2w6PK11ENaWhIZzxf2BHTrDz9vckNYhHYvaNohHlc6H3bZ+vDM8sFEopCcJhVMKmI7EIpEGBYbreIbN4TrjQ==", //存放小鱼ukey
    sessionJdbBrandId: 784
  }
})