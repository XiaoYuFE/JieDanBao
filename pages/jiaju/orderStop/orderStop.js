
import form from '../../../static/js/plugin/form'
import WxValidate from '../../../static/js/plugin/WxValidate'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    validateMsg:"",
    step:"",
    stepName:"",
    isValidElemShow:false,
    animationData: {}
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._initValidate();
    this.setData({
      step:options.step,
      stepName:options.stepname
    });
  },
  onReady: function () {
   
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