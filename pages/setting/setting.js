import form from '../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    switchChecked: ""
  },
  onLoad: function (options) {
    var that = this;
    app.form.requestPost(app.form.API_CONFIG['setting'], {
      ukey: app.globalData.sessionJdbUkey,
      bid: app.globalData.sessionJdbBrandId,
      unionid: app.globalData.sessionJdbUnionid
    }, function (res) {
      if (!!res.data && res.data !== "0") {
        that.setData({
          switchChecked: true
        })
      } else {
        that.setData({
          switchChecked: false
        })
      }
    })
  },
  switch1Change: function (e) {
    var that=this;
    app.form.requestPost(app.form.API_CONFIG['setting'], {
      ukey: app.globalData.sessionJdbUkey,
      bid: app.globalData.sessionJdbBrandId,
      unionid: app.globalData.sessionJdbUnionid,
      notice: e.detail.value ? 1 : 0
    }, function (res) {
      if (!res.status && res.status == "0") {
        that.setData({
          switchChecked: !e.detail.value
        })
      }
    })
  },
  logout: function () {
    app.clearStorage(function () {
      wx.showToast({
        title: '成功退出',
        icon: 'success',
        duration: 2000
      });
      setTimeout(function(){
        wx.redirectTo({
          url: '/pages/login/login'
        });
      },1500)
    });
  }
})