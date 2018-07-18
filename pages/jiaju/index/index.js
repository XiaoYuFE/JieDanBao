import form from '../../../static/js/plugin/form'

const app = getApp();
app.form = new form(app);



Page({
  data: {
    xyUserInfo: {},
    dataInfo: {},
    wxTimerList: []
  },

  onLoad: function () {
    console.dir("onLoad");
    var that = this;
    //获取配置信息
    that.setData({ xyUserInfo: app.globalData.sessionJdbUserInfo });
    app.form.tracking('jdb_index', 'jdb_index', '');

    var timer = require('../../../static/js/plugin/wxTimer.js');
    var wxTimer = new timer({
      beginTime: "00:00:05",
      complete: function () {
        console.log("完成了")
      }
    })
    wxTimer.start(this);


  },

  onShow: function () {
    console.dir("onShow");
    this._getPageData();
  },


  setting: function () {
    wx.redirectTo({
      url: '/pages/setting/setting'
    })
  },

  //拨打电话
  makeCallPhone: function () {
    var that = this;
    wx.makePhoneCall({ phoneNumber: that.data.kf_tel })
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
  },
  //日期秒转成分秒
  _formatDateHMS:function(mss) {

    var hours = parseInt((mss % (60 * 60)) / (60 * 60));
    var minutes = parseInt((mss % (60 * 60)) / (60));
    var seconds = mss % 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes + ":" + seconds;
  },
  _formatDateMS: function (mss) {
    var minutes = parseInt(mss / 60);
    var seconds = mss % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return minutes + " 分 " + seconds + " 秒";
  },

  //获取页面数据（登录以后才执行此步骤）
  _getPageData: function () {
    var that = this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_total, {}, function (res) {
      //判断是否登陆
      var res = {
        "data": {
          "wjd": 1,
          "dlf": 0,
          "dsj": 0,
          "dqy": 0,
          "yqy": 0,
          "void": 0,
          "ysx": 10,
          "month": 2,
          "total": 13,
          "new_order": {
            "id": "59",
            "name": "test",
            "mobile": "13111112222",
            "community": "万达",
            "price": "20-30万",
            "d_time": 135547
          }
        },
        "status": 1,
        "msg": "success",
        "redict": ""
      };
      res.data.new_order.d_time = that._formatDateHMS(60*60*3);
      that.setData({ dataInfo: res.data });
    })
  },
})