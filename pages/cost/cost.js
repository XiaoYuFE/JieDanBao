import WxValidate from '../../static/js/plugin/WxValidate'
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

    this.setData({
      step: parseInt(options.step) + 1,
      sid: options.sid
    });

    this._initValidate();
  },
  formSubmit: function (e) {
    var that = this;
    this.setData({
      submiting: true
    })

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        validateMsg: error.msg,
        submiting: false
      })
      return false
    } else {
      //验证通过进行后端请求

      app.form.requestPost(app.form.API_CONFIG['upstep'], {
        sid: that.data.sid,
        step: that.data.step,
        price: e.detail.value.totalprice,
        bid: app.globalData.sessionJdbBrandId,
        ukey: app.globalData.sessionJdbUkey
      }, function (res) {
        that.setData({
          submiting: false
        });
        //如果提交不成功
        if (res.status == "0") {
          that.setData({
            validateMsg: res.msg
          })
        } else {
          //如果提交成功
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.redirectTo({
                url: '/pages/detail/detail?sid=' + that.data.sid
              })
            }
          })
        }
      })

      // wx.request({
      //   url: app.globalData.server + "/welcome/wechatapp?callback=Jiaju.upstep",
      //   data: {
      //     sid: that.data.sid,
      //     step: that.data.step,
      //     price: e.detail.value.totalprice,
      //     bid: app.globalData.sessionJdbBrandId,
      //     ukey: app.globalData.sessionJdbUkey
      //   },
      //   method: 'post',
      //   header: {
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   dataType: "json",
      //   success: function (res) {
      //     //设置提交按钮状态
      //     that.setData({
      //       submiting: false
      //     });
      //     //如果提交不成功
      //     if (res.data.status == "0") {
      //       that.setData({
      //         validateMsg: res.data.msg
      //       })
      //     } else {
      //       //如果提交成功
      //       wx.showToast({
      //         title: '提交成功',
      //         icon: 'success',
      //         duration: 2000,
      //         success: function () {
      //           wx.redirectTo({
      //             url: '/pages/detail/detail?sid=' + that.data.sid
      //           })
      //         }
      //       })
      //     }

      //   }
      // });
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