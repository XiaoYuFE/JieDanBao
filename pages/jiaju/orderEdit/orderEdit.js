import dateTimePicker from '../../../static/js/plugin/dateTimePicker.js'
import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({

  data: {
    id:482,
    dataInfo:"",
    radioVal:"",


    date: '2018-10-01 12:00',
    time: '',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },



  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    var that=this;

    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, this.data.time);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });

   


    app.form.requestPost(app.form.API_CONFIG.jiaju.process_order, {
     id:that.data.id
    }, function (res) {
        console.dir(res);
        that.setData({
          dataInfo:res.data
        })
    });
  },

  radioChange:function(e){
    this.setData({
      radioVal: e.detail.value
    });
  },

  uploadFangAn:function(){
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.form.API_CONFIG.jiaju.orders, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          formData: {

          },
          success: function (res) {
            var data = res.data
            console.dir(data);
            //do something
          }
        })
      }
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