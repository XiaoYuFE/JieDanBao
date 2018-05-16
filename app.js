//app.js
App({
  //微信上面关闭删除后，进来就会触发这个事件，如果只是关闭没有删除小程序，那么不会触发该事件
  onLaunch:function(){
   
  },
  //每次关闭后在进来（不管有没有删除都会触发这个事件）
  onShow:function(){
   
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
    sessionJdbUkey:"",
    sessionJdbBrandId:""
    // sessionJdbUkey:"Ak2w6PK11ENaWhIZzxf2BHTrDz9vckNYhHYvaNohHlc6H3bZ+vDM8sFEopCcJhVMKmI7EIpEGBYbreIbN4TrjQ==", //存放小鱼ukey
    // sessionJdbBrandId: 784
  }
})