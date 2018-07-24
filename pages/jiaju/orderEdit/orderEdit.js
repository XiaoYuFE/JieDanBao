import dateTimePicker from '../../../static/js/plugin/dateTimePicker.js'
import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({

  data: { 
    id: 480, //481待设计  488 未接单  482待量房  480 待签约
    dataInfo: "",
    radioVal: "",

    wxTimerList: {},//存放倒计时
    wxTimerInstance: null,

    sjFinshTime:"",//设计完成时间
    sj_img:[],

    ht_img:[],

    date:"",
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2010,
    stepName:"",
    endYear: 2050
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.dir(options);
    var that = this;


    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear,this.data.date);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    console.dir(obj1.dateTime);

    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });




    app.form.requestPost(app.form.API_CONFIG.jiaju.process_order, {
      id: that.data.id
    }, function(res) {
      console.dir(res);
      that.setData({
        dataInfo: res.data,
        sjFinshTime: res.data.sj_time
      });
      res.data.sj_d_time="3600"
      if (res.data.sj_d_time){
        that._countDown(res.data.sj_d_time);
      }
    });
  },

  radioChange: function(e) {
    console.dir("radioChange");
    this.setData({
      radioVal: e.detail.value
    });
  },

  _clearIntervalWxtimer: function () {
      this.data.wxTimerInstance.stop();
  },

  _countDown: function (item) {
    var that = this;
    var wxTimerName = new timer({
      beginTime: item,
      formatType: "HMS",
      name:"wxTimer",
      complete: function () {
        console.log("完成了")
      },
      interval: 1,
      intervalFn: function () {

      }
    })
    wxTimerName.start(that);
    that.data.wxTimerInstance=wxTimerName;



  },

  _setStepName:function(step,val){
     
  },
  delSjUpload:function(e){
    var index=e.target.dataset.index;
    const sj_img = this.data.sj_img;
    sj_img.splice(index, 1);
    this.setData({
      sj_img:sj_img
    });  
  },

  uploadFangAn: function() {
    var that=this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.dir(app.form.API_CONFIG.jiaju.upload_img);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.dir(app.globalData.sessionJdbUkey)
        for (var i in tempFilePaths) {
          wx.uploadFile({
            url: app.form.API_SERVER+app.form.API_CONFIG.jiaju.upload_img,
            filePath: tempFilePaths[i],
            name: 'img',
            formData: {
              bid: app.globalData.sessionJdbBrandId,
              ukey: app.globalData.sessionJdbUkey
            },
            success: function (res) {
              const imgArr=that.data.sj_img; 
              res.data = JSON.parse(res.data); 
              imgArr.push(res.data.data["full_url"]);
             
              that.setData({
                sj_img: imgArr
              });
             
            }
          });
        }
      }
    })
  },

  delHtUpload: function (e) {
    var index = e.target.dataset.index;
    const ht_img = this.data.ht_img;
    ht_img.splice(index, 1);
    this.setData({
      ht_img: ht_img
    });  
  },

  uploadHeTong:function(){
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.dir(app.form.API_CONFIG.jiaju.upload_img);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.dir(app.globalData.sessionJdbUkey)
        for (var i in tempFilePaths) {
          wx.uploadFile({
            url: app.form.API_SERVER + app.form.API_CONFIG.jiaju.upload_img,
            filePath: tempFilePaths[i],
            name: 'img',
            formData: {
              bid: app.globalData.sessionJdbBrandId,
              ukey: app.globalData.sessionJdbUkey
            },
            success: function (res) {
              const imgArr = that.data.ht_img;
              res.data = JSON.parse(res.data);
              imgArr.push(res.data.data["full_url"]);

              that.setData({
                ht_img: imgArr
              });

            }
          });
        }
      }
    })
  },

 
  
  
  //确认以后会触发这个事件
  changeDateTime1(e) {
    var that=this;
    wx.showLoading();
    
    var eVal = e.detail.value;
  
    this.setData({ dateTime1: eVal});
    var timeVal = that.data.dateTimeArray1[0][eVal[0]] + "-" + that.data.dateTimeArray1[1][eVal[1]] + "-" + that.data.dateTimeArray1[2][eVal[2]] + " " + that.data.dateTimeArray1[3][eVal[3]] + ":" + that.data.dateTimeArray1[4][eVal[4]];
    app.form.requestPost(app.form.API_CONFIG.jiaju.get_sj_time, {
      time: timeVal
    }, function (res) {
      console.dir(res);
      wx.hideLoading();
      that.setData({
        sjFinshTime: res.data.time
      });
      
    });
  },
  changeDateTimeColumn1(e) {
    console.dir("changeDateTimeColumn1")
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  goBack:function(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})