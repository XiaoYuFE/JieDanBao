var QQMapWX = require('../../static/js/plugin/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({

  /**
    * 页面的初始数据
    */
  data: {
    title: "",
    lat:"",
    lng: "",
    markers:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'ZP6BZ-APURI-RPAGT-5QPN4-U4EP3-AGFR4'
    });
    this.setData({
      title: options.title
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    qqmapsdk.search({
      keyword: that.data.title,
      success: function (res) {
        if(res.data['0']){
          console.log(res.data)
          that.setData({
            'lat': res.data['0']['location']['lat'],
            'lng': res.data['0']['location']['lng'],
            'markers': [{
              id: 1,
              latitude: res.data['0']['location']['lat'],
              longitude: res.data['0']['location']['lng'],
              name: res.data['0']['title']
            }]
          });
        }
        console.log(res.data);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
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