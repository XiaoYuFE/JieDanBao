import form from '../../../static/js/plugin/form'
import WxValidate from '../../../static/js/plugin/WxValidate'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    validateMsg: "",
    step: "",
    stepName: "",
    isValidElemShow: false,
    animationData: {},
    ht_img: [],
    ht_img_str: "",
    ht_img_server: [],
    ht_img_str_server: "",
    radioVal: "void",

    rules: {},
    messages: {},

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._initValidate();
    console.dir(options);
    this.setData({
      id: options.id,
      step: options.step,
      stepName: options.stepname
    });
  },
  onReady: function() {

  },

  radioChange: function(e) {
   
    this.setData({
      radioVal: e.detail.value
    });
    this._initValidate();
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
              var imgServer=that.data.ht_img_server;
              res.data = JSON.parse(res.data);
              imgArr.push(res.data.data["full_url"]);
              imgServer.push(res.data.data["url"]);
              that.setData({
                ht_img: imgArr,
                ht_img_str: imgArr.join(","),
                ht_img_server: imgServer,
                ht_img_str_server: imgServer.join(","),
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
    var ht_img_server = this.data.ht_img_server;
    ht_img.splice(index, 1);
    ht_img_server.splice(index, 1);
    this.setData({
      ht_img: ht_img,
      ht_img_str: ht_img.join(","),
      ht_img_server: ht_img_server,
      ht_img_str_server: ht_img_server.join(","),
    });
  },


  formSubmit: function(e) {
   
    var that = this;
    const params = e.detail.value;

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0];
      this.setData({
        validateMsg: error.msg,
        isValidElemShow: true
      });
      setTimeout(function() {
        that.setData({
          isValidElemShow: false
        });
      }, 2000)
      return false
    } else {
      //验证通过提交到服务端
      wx.showLoading({
        title: '加载中'
      })

     

      app.form.requestPost(app.form.API_CONFIG.jiaju.opt_orders, params, function(res) {
        wx.hideLoading();
        console.dir(res);
        if (!!res.status) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function() {
                setTimeout(function(){
                  wx.navigateTo({
                    url: '/pages/jiaju/detail/detail?id=' + that.data.id,
                  })
                },800)
            },
            fail: function() {
               
            }
          })
        } else {
          wx.showToast({
            title: '提交失败！',
            icon: "none",
            duration: 2000
          })
        }

      })
    }
  },

  _initValidate() {
    var rules,messages;
    console.dir(this.data.radioVal);
    if (this.data.radioVal == "void") {
      
      rules = {
        step: {
          required: true
        },
        reason: {
          required: true
        }
      };
      messages = {
        step: {
          required: "请选择终止原因"
        },
        reason: {
          required: "请填写详细原因描述"
        }
      };
    } else {
      console.dir("sadfasdfasdf");
      rules = {
        price: {
          required: true
        },
        imgs: {
          required: true
        }
      };
      messages = {
        price: {
          required: "请填写价格"
        },
        imgs: {
          required: "请上传合同照片"
        }
      };
    }
    
    // this.setData({
    //   rules:rules,
    //   messages:messages
    // });

    this.WxValidate = new WxValidate(rules, messages);


  },


})