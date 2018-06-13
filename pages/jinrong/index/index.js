import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);

Page({
  data: {
    xyUserInfo: "",
    dataList: "",
    kf_tel: ""
  },

  onLoad: function () {
    var that = this;
    //获取配置信息
    app.form.requestPost(app.form.API_CONFIG.jinrong.config, {}, function (res) {
      that.setData({ kf_tel: res.data.kf_tel });
    });
    that.setData({ xyUserInfo: app.globalData.sessionJdbUserInfo });

    app.form.tracking('jdb_index', 'jdb_index', '');
  },

  onShow: function () {
    this._getPageData();
  },

  //获取页面数据（登录以后才执行此步骤）
  _getPageData: function () {
    var that = this;
    app.form.requestPost(app.form.API_CONFIG.jinrong.order_total, {}, function (res) {
      //判断是否登陆
      app.isLogin(res.islogin);
      that.setData({
        dataList: res.data
      });
    })
  },
  setting: function () {
    wx.redirectTo({
      url: '/pages/setting/setting'
    })
  },

  //拨打电话
  makeCallPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.kf_tel //仅为示例，并非真实的电话号码
    })
  },

  onShareAppMessage: function () {
    return {
      title: '小鱼接单宝',
      path: '/pages/login/login',
      imageUrl: "http://m3.xiaoyu.com/img/jiedanbao_share.png",
      success: function (res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {

      }
    }
  }
})