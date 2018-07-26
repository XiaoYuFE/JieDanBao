
import form from '../../../static/js/plugin/form'
import WxValidate from '../../../static/js/plugin/WxValidate'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    validateMsg:"",
    step:"",
    stepName:"",
    isValidElemShow:false,
    animationData: {},
    ht_img: [],
    ht_img_str: "",
    radioVal: "void"
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initValidate();
    this.setData({
      id:509,
      step:options.step,
      stepName:options.stepname
    });
  },
  onReady: function () {
   
  },

  radioChange:function(e){
    this.setData({
      radioVal: e.detail.value
    });
  },

  uploadHeTong: function () {
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
                ht_img: imgArr,
                ht_img_str: imgArr.join(",")
              });

            }
          });
        }
      }
    })
  },
  

  formSubmit: function (e) {
    console.dir(e);
    var that=this;
    const params = e.detail.value;

    if (!this.WxValidate.checkForm(e)) { 
       const error = this.WxValidate.errorList[0];
       this.setData({
         validateMsg: error.msg,
         isValidElemShow:true
       });
       setTimeout(function(){
         that.setData({
           isValidElemShow: false
         });
       },2000)
       return false
    }else{
       //验证通过提交到服务端
      wx.showLoading({
        title: '加载中'
      })

      app.form.requestPost(app.form.API_CONFIG.jiaju.order_stop, params,function(res){
        wx.hideLoading();
        console.dir(res);
        if (!!res.OK){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success:function(){
                console.dir("Asdfasdfas");
            },
            fail:function(){
              console.dir("cccc")
            }
          })
        }else{
          wx.showToast({
            title: '提交失败！',
            icon:"none",
            duration: 2000,
            success: function () {
              console.dir("Asdfasdfas");
            },
            fail: function () {
              console.dir("cccc")
            }
          })
        }

      })
    }
  },

  _initValidate() {
    const rules = {
      reasonRadio: {
        required: true
      },
      reasonTextarea: {
        required: true
      }
    };

    const messages = {
      reasonRadio: {
        required: "请选择终止原因"
      },
      reasonTextarea: {
        required: "请填写详细原因描述"
      }
    };

    this.WxValidate = new WxValidate(rules, messages);
   

  },

 
})