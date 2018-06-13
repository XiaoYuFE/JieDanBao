import form from '../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    switchChecked: ""
  },
  onLoad: function (options) {
    var that = this;
    if (!app.globalData.sessionJdbUnionid){
      that.setData({ switchChecked: false });
    }
    app.form.requestPost(app.form.API_CONFIG.common.notice,{unionid:app.globalData.sessionJdbUnionid}, function (res) {
      that.setData({ switchChecked: res.data});
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
  }
})