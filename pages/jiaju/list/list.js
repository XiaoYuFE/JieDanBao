
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabType:""
  },

  /**
   * 生命周期函数--监听页面加载
   * tabType:xdd(新订单)，clz(处理中)，yjs(已结束)
   */
  onLoad: function (options) {
    console.dir(options);
    options.tabType="xdd";
      this.setData({
        tabType: options.tabType
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
  navMainHandle:function(e){
    //设置标签状态
    this.setData({
      tabType: e.currentTarget.dataset.tabtype
    });
    //请求数据
    

     
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
        console.dir("ASdfasdfasdf");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})