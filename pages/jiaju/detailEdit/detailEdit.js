

import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:"",
    id:"",
    hxList: [["0室", "1室", "2室", "3室",], ["0厅", "1厅", "2厅", "3厅"], ["0厨", "1厨", "2厨"], ["0卫", "1卫", "2卫"], ["0阳台", "1阳台", "2阳台"]],
    hxIndex:[0,0,0,0,0],
    ysIndex:0,
    fwqkIndex:0,
    zxfgIndex:0,
    configInfo:""
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ysIndex: e.detail.value
    })
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hxIndex: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    this.setData({
      id:482
    });
    var that=this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
        id:that.data.id
    },function(res){
        console.dir(res);
        that.setData({
          dataInfo:res.data
        });
      
    });
   

    app.form.requestPost(app.form.API_CONFIG.jiaju.edit_config, {}, function (res) {
      console.dir(res);
      that.setData({
        configInfo: res.data
      });
     
    });
  },

  goBack:function(){
    wx.navigateBack();
  },

  formSubmit:function(e){
      wx.showLoading();
      console.dir(e.detail.value);

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