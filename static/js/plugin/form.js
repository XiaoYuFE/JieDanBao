class form {
  API_SERVER = 'https://m3.xiaoyu.com/welcome/wechatapp?callback=';
  API_CONFIG = {
    index:'Testjiaju.index',
    list:"Testjiaju.dlist",
    login: 'Testjiaju.check_login',
    bind: 'Testjiaju.bind',
    detail:'Testjiaju.detail',
    config:'Testjiaju.config',
    setting: 'Testjiaju.ispush',
    upstep:'Testjiaju.upstep'
  };

  constructor(app) {
    Object.assign(this, {
      app: app
    });
    this.__initMethods();
  }

  __request(api, data = {}, callback = function () { }, header = {}, method = 'post') {
    var that = this;
    data = Object.assign({}, { bid: that.app.globalData.sessionJdbBrandId || '', ukey: that.app.globalData.sessionJdbUkey || '' }, data);
    Object.assign(header, { "Content-Type": "application/x-www-form-urlencoded" });

    wx.request({
      url: that.API_SERVER + api,
      data: data,
      method: 'post',
      header: header,
      dataType: "json",
      success: function (res) {
        if (typeof callback === 'function' && callback.call(that, res.data, res.header, res.statusCode, res.errMsg) === false) {
          return false;
        }

        if (typeof (res.data) != 'object' && (res.data == 404 || res.data.indexOf('A PHP Error was encountered') > -1)) {
          wx.showModal({
            title: '服务错误',
            content: '',
            showCancel: false
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '服务错误',
          content: '',
          showCancel: false
        })
      },
      complete: function () {

      }
    });
  }

  /**
   * 初始化默认验证方法
   */
  __initMethods() {
    this.requestGet = function (api, data = {}, callback = function () { }, header = {}) {
      this.__request(api, data, callback, header, 'get');
    };

    this.requestPost = function (api, data = {}, callback = function () { }, header = {}) {
      this.__request(api, data, callback, header, 'post');
    }

  }
}
export default form