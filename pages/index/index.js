
const app = getApp();


Page({
  data: {
    xyUserInfo: "",
    dataList:"",
    
  },
  
  onLoad: function () {
    var that = this;
    setTimeout(function(){
      that._getPageData();
    },100)
    
  },

  onShow:function(){
    this._getPageData();
  },
  
  //获取页面数据（登录以后才执行此步骤）
  _getPageData: function () {
    var that=this;
    
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
      phoneNumber: '0592-6799988' //仅为示例，并非真实的电话号码
    })
  },
  onShareAppMessage: function () {
    return {
      title: '小鱼接单宝',
      path: '/pages/index/index',
      imageUrl:"http://m3.xiaoyu.com/img/jiedanbao_share.png",
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
  },
  handAuthority:function(){
    wx.navigateTo({
      url: '/pages/authority/authority?id=10'
    })
    
   
  }
})