import WxValidate from '../../static/js/plugin/WxValidate'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      submiting:false,
      validateMsg:"",
      uid:"",
      orderid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        uid: options.uid,
        orderid: options.orderid
      });
      this._initValidate();
  },
  formSubmit:function(e){
    var that=this;
    this.setData({
      submiting:true
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
      wx.request({
        url: app.globalData.server + "price.php",
        data:{"uid":that.data.uid,"orderid":that.data.orderid},
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        dataType: "json",
        success: function (res) {
          //设置提交按钮状态
          that.setData({
            submiting: false
          });
          //如果提交不成功
          if (res.data.error) {
            that.setData({
              validateMsg: res.data.msg
            })
          } else {
            //如果提交成功
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000,
              success:function(){
                wx.redirectTo({
                  url: '/pages/detail/detail?id='+that.data.id
                })
              }
            })
          }

        }
      });
    }
  },
  //初始化验证插件
  _initValidate() {
    const rules = {
      totalprice: {
        required: true,
        number:true
      }
    }

    const messages = {
      totalprice: {
        required:"请输入造价",
        number:"造价价格必须是数字"
      },
      
    }

    this.WxValidate = new WxValidate(rules, messages);
  }

  
})