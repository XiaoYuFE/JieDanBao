import dateTimePicker from '../../../static/js/plugin/dateTimePicker.js'
import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({

  data: {
    id:"", //481待设计  488 未接单  482待量房  480 待签约
    dataInfo: "",


    radioVal: "",



    wxTimerList: {}, //存放倒计时
    wxTimerInstance: null,

    sjFinshTime: "", //设计完成时间
    sj_img: [],
    sj_img_str:"",
    isDownRefresh: false,
    sj_img_server: [],
    sj_img_str_server: "",

    ht_img: [],
    ht_img_str:"",

    ht_img_server: [],
    ht_img_str_server: "",
    nextStep:"",
    step: "",
    stepName: "",
    lfTime: "", //判断量房时间，然后显示提示文字
    date: "",
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2010,
    endYear: 2050
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.dir(options);
    var that=this;
    this.setData({
      id: options.id
    })
  },

  _getData:function(typeStr){
    var that=this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.process_order, {
      id: that.data.id
    }, function (res) {
      if (typeStr) {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        that.setData({
          isDownRefresh: false
        });
      }
      that.setData({
        dataInfo: res.data,
        sjFinshTime: res.data.sj_time
      });
      that._getStepName(res.data);

      that._countDown(res.data.sj_d_time)

      //量房时间为空的时候

      if (res.data.l_time.indexOf("0000") < 0) {
        that.setData({
          isLftimerEmpty: false,
          lfTime: res.data.l_time,
          date: res.data.l_time
        });
        console.dir(that.data.date)
        var obj1 = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, that.data.date);
        that.setData({
          dateTimeArray1: obj1.dateTimeArray,
          dateTime1: obj1.dateTime
        });
      }

    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      isDownRefresh: true
    });
    this._getData("onPullDownRefresh");
  },


  openDiaSjfaTip:function(){
    wx.showModal({
      content: '为了保证服务效率与质量，提升用户体验，一些环节会设置服务剩余时间。请在剩余时间内及时完成服务，否则该订单有可能会失效，不能再联系客户。',
      showCancel: false
    })
  },

  previewFaImg:function(e){
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.sj_img // 需要预览的图片http链接列表
    })
  },
  previewHtImg: function (e) {
   
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.ht_img // 需要预览的图片http链接列表
    })
  },

  formSubmit: function(e) {
    console.dir(e.detail.value);
    var that = this;
    wx.showLoading();
    app.form.requestPost(app.form.API_CONFIG.jiaju.opt_orders, e.detail.value, function(res) {
      console.dir(res);
      wx.hideLoading();
      if (res.status == 1) {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 1000,
          success:function(){
            setTimeout(function(){
              wx.navigateTo({
                url: '/pages/jiaju/order/order?id=' + that.data.id + "&step=" + that.data.stepNext+"&stepName=" + that.data.stepName
              })
            },1000)
          }
        })
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
 
  //单选按钮改变的时候
  radioChange: function(e) {
    console.dir("radioChange");
    this.setData({
      radioVal: e.detail.value
    });
    if (this.data.step == "dlf") {
        //待量房的时候，选择单选按钮，那么步骤要跟着改变
        this.setData({
          step:this.data.radioVal
        })
    }
  },

  _clearIntervalWxtimer: function() {
    this.data.wxTimerInstance.stop();
  },

  _countDown: function(item) {
    var that = this;
    var wxTimerName = new timer({
      beginTime: item,
      formatType: "DHMS",
      name: "wxTimer",
      complete: function() {
        console.log("完成了")
      },
      interval: 1,
      intervalFn: function() {

      }
    })
    wxTimerName.start(that);
    that.data.wxTimerInstance = wxTimerName;



  },

  _getStepName: function(data) {
    var that = this;
    var step = "",
    stepNext,
      stepName = "";
    if (data.wjd == 0) {
      step = "wjd";
      stepName = "未接单";
      stepNext="dlf";
    } else if (data.wjd == 1 && data.dlf == 0) {
      step = "dlf";
      stepName = "待量房";
      stepNext = "dsj";
    } else if (data.wjd == 1 && data.dlf == 1 && data.dsj == 0) {
      step = "dsj";
      stepName = "待设计";
      stepNext = "dqy";
    } else if (data.wjd == 1 && data.dlf == 1 && data.dsj == 1 && data.dqy == 0) {
      step = "dqy";
      stepName = "待签约";
      stepNext = "yqy";
    }
    that.setData({
      step: step,
      stepName: stepName,
      stepNext: stepNext
    })

  },
  delSjUpload: function(e) {
    var index = e.target.dataset.index;
    const sj_img = this.data.sj_img;
    var sj_img_server = this.data.sj_img_server;
    sj_img.splice(index, 1);
    sj_img_server.splice(index, 1);
    this.setData({
      sj_img: sj_img,
      sj_img_str: sj_img.join(","),
      sj_img_server: sj_img_server,
      sj_img_str_server: sj_img_server.join(",")
    });
  },

  uploadFangAn: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
      
        for (var i in tempFilePaths) {
          wx.uploadFile({
            url: app.form.API_SERVER + app.form.API_CONFIG.jiaju.upload_img,
            filePath: tempFilePaths[i],
            name: 'img',
            formData: {
              bid: app.globalData.sessionJdbBrandId,
              ukey: app.globalData.sessionJdbUkey
            },
            success: function(res) {
             
              var imgArr = that.data.sj_img;
              var imgServer = that.data.sj_img_server;
              res.data = JSON.parse(res.data);
              imgArr.push(res.data.data["full_url"]);
              imgServer.push(res.data.data["url"]);
             
              that.setData({
                sj_img: imgArr,
                sj_img_str:imgArr.join(","),
                sj_img_server: imgServer,
                sj_img_str_server: imgServer.join(","),
              });

            }
          });
        }
      }
    })
  },

  delHtUpload: function(e) {
    var index = e.target.dataset.index;
    const ht_img = this.data.ht_img;
    const ht_img_server = this.data.ht_img_server;
    ht_img.splice(index, 1);
    ht_img_server.splice(index, 1);
    this.setData({
      ht_img: ht_img,
      ht_img_str: ht_img.join(","),
      ht_img_server: ht_img_server,
      ht_img_server_str: ht_img_server.join(",")
    });
  },

  uploadHeTong: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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
            success: function(res) {
              const imgArr = that.data.ht_img;
              var imgServer = that.data.ht_img_server;
              res.data = JSON.parse(res.data);
              imgArr.push(res.data.data["full_url"]);
              imgServer.push(res.data.data["url"]);
              that.setData({
                ht_img: imgArr,
                ht_img_str: imgArr.join(","),
                sj_img_server: imgServer,
                sj_img_str_server: imgServer.join(","),
              });

            }
          });
        }
      }
    })
  },




  //确认以后会触发这个事件
  changeDateTime1(e) {
    var that = this;
    wx.showLoading();
    var eVal = e.detail.value;

    var timeVal = that.data.dateTimeArray1[0][eVal[0]] + "-" + that.data.dateTimeArray1[1][eVal[1]] + "-" + that.data.dateTimeArray1[2][eVal[2]] + " " + that.data.dateTimeArray1[3][eVal[3]] + ":" + that.data.dateTimeArray1[4][eVal[4]];
    this.setData({
      dateTime1: eVal,
      lfTime: timeVal,
    });
    app.form.requestPost(app.form.API_CONFIG.jiaju.get_sj_time, {
      time: timeVal
    }, function(res) {
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

  goBack: function() {
    wx.navigateBack()
  }
})