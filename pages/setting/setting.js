import form from '../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    switchChecked: "",
    bind_title:"",
    is_bind:""
  },
  onLoad: function (options) {
    var that = this;
    if (!app.globalData.sessionJdbUnionid){
      that.setData({ switchChecked: false });
    }
    app.form.requestPost(app.form.API_CONFIG.common.setting,{unionid:app.globalData.sessionJdbUnionid}, function (res) {
      that.setData({ switchChecked: res.data.jiaju_notice, bind_title: res.data.bind_title, is_bind: res.data.is_bind});
    });
  },
  switch1Change: function (e) {
    var that=this;
    app.form.requestPost(app.form.API_CONFIG.common.notice, {unionid: app.globalData.sessionJdbUnionid,notice: e.detail.value ? 1 : 0}, function (res) {
      if (res.status !== 1) {
        wx.showModal({ content: res.msg, showCancel: false})
        that.setData({ switchChecked: !e.detail.value})
      }
    })
  },
  bind_login: function () {
    var that = this;
    app.form.requestPost(app.form.API_CONFIG.common.bind_setting, { unionid: app.globalData.sessionJdbUnionid, uid: app.globalData.sessionJdbUserInfo.user_id, bind: that.data.is_bind}, function (res) {
      if (res.status !== 1) {
        wx.showModal({ content: res.msg, showCancel: false })
      }else{
        wx.showModal({ content: res.data.show_title, showCancel: false })
        that.setData({ bind_title: res.data.bind_title, is_bind: res.data.is_bind})
      }
    })
  },
  logout: function () {
    app.form.requestPost(app.form.API_CONFIG.common.notice,{unionid: app.globalData.sessionJdbUnionid, notice: 0},function(){});
    
    app.clearStorage(function () {
      wx.showToast({title: '成功退出',icon: 'success',duration: 2000});
      setTimeout(function(){
        wx.redirectTo({
          url: '/pages/login/login'
        });
      },1500)
    });
  },
})