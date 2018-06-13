import WxValidate from '../../../static/js/plugin/WxValidate'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submiting: false,
    validateMsg: "",
    sid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({step: options.step,id: options.id});
    this._initValidate();
  },
  formSubmit: function (e) {
    var that = this;
    this.setData({submiting: true})

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        validateMsg: error.msg,
        submiting: false
      })
      return false
    } else {
      //验证通过进行后端请求

      app.form.requestPost(app.form.API_CONFIG.jiaju.opt_order, {
        id: that.data.id,step: that.data.step,price: e.detail.value.totalprice
      }, function (res) {
        that.setData({submiting: false});
        //如果提交不成功
        if (res.status != 1) {
          that.setData({validateMsg: res.msg});
          return false;
        } 

        //如果提交成功
        wx.showToast({title: '提交成功',duration: 2000,success: function () {
            wx.redirectTo({url: '/pages/jiaju/detail/detail?id=' + that.data.id})
        }});
      })

      
    }
  },
  //初始化验证插件
  _initValidate() {
    const rules = {
      totalprice: {
        required: true,
        number: true
      }
    }

    const messages = {
      totalprice: {
        required: "请输入造价",
        number: "造价价格必须是数字"
      },

    }

    this.WxValidate = new WxValidate(rules, messages);
  }


})