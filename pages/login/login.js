import WxValidate from '../../static/js/plugin/WxValidate'
import form from '../../static/js/plugin/form'
const app = getApp();
Page({
  data: {
    validateMsg: false,
    submiting:false,
    isPhoneActive:false,
    isPwdActive:false
  },
  onLoad: function () {
    this._initValidate();
  },
  formSubmit: function (e) {
    var that=this;
    const params = e.detail.value;
    
    //按钮禁用
    this.setData({
      submiting:true
    });
    
    //表单验证
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      this.setData({
        validateMsg: error.msg,
        submiting:false
      })
      return false
    } else {
      //验证通过进行后端请求
      that.form.requestPost(that.form.API_CONFIG['login'], params,function(res,header){
        //设置提交按钮状态
        that.setData({
          submiting: false
        });

       
 
        //如果用户不存在或则错误
        if (res.status != '1') {
          that.setData({validateMsg: res.msg})
        } else {
          //动态全局赋值
          console.dir(res.data["ukey"]);
          app.globalData.sessionJdbUkey     = res.data["ukey"];
          app.globalData.sessionJdbBrandId  = res.data["brand_id"];
          app.globalData.sessionJdbUserInfo = res.data;

          wx.login({
            success:function(res){
              if(res.code){
                that.form.requestPost(that.form.API_CONFIG['bind'], { code: res.code, ukey: app.globalData.sessionJdbUkey, bid: app.globalData.sessionJdbBrandId}, function (res) {
                  console.dir(res);
                  if(res.status == '1'){
                    //本地存储id
                    app.globalData.sessionJdbUnionid = res.data["unionid"];
                    wx.setStorage({
                      key: "sessionJdbUkey",
                      data: app.globalData.sessionJdbUkey
                    });

                    wx.setStorage({
                      key: "sessionJdbBrandId",
                      data: app.globalData.sessionJdbBrandId
                    });

                    wx.setStorage({
                      key: "sessionJdbUserInfo",
                      data: app.globalData.sessionJdbUserInfo
                    });

                    wx.setStorage({
                      key: "sessionJdbUnionid",
                      data: app.globalData.sessionJdbUnionid
                    });
                   

                    //跳转到相关页面
                    wx.redirectTo({
                      url: '/pages/index/index'
                    })
                  }else{
                    that.setData({ validateMsg: res.msg })
                  }
                });
              }else{
                that.setData({ validateMsg: '授权失败' })
              }
            }
          });
        }
      })
    }
  },
  //账号输入框事件
  bindInputTap: function () {
    this.setData({
      validateMsg: false
    })
  },
  //初始化验证插件
  _initValidate() {
    const rules = {
      username: {
        required: true
      },
      password: {
        required: true
      }
    }

    const messages = {
      username: {
        required: "请输入账号"
      },
      password: {
        required: "请输入密码"
      }
    }

    this.WxValidate = new WxValidate(rules, messages);
    this.form = new form(app); 

  },
  usernameFoucs:function(){
      this.setData({
        isPhoneActive:true
      });
  },
  usernameBlur: function () {
    this.setData({
      isPhoneActive:false
    });
  },
  pwdFoucs:function(){
    this.setData({
      isPwdActive: true
    });
  },
  pwdBlur:function(){
    this.setData({
      isPwdActive: false
    });
  }
})