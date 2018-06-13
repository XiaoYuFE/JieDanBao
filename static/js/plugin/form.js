class form {
  API_SERVER = 'https://m3.xiaoyu.com/jiedanbao/';
  API_CONFIG = {
    jiaju:{
      order_total: 'order_total',
      orders: "orders",
      order_info: 'order_info',
      opt_order: 'opt_order',
      config: 'config',
      notice: 'notice',
    },
    auto: {
      order_total: 'order_total',
      orders: "orders",
      order_info: 'order_info',
      opt_order: 'opt_order',
      config: 'config',
      notice: 'notice',
    },
    jinrong:{
      order_total:'order_total',
      orders:"orders",
      order_info: 'order_info',
      opt_order: 'opt_order',
      config: 'config',
      notice: 'notice',
    },
    common:{
      login:'login',
      notice: 'notice',
      bind:'bind',
      tracking:'tracking'
    }
  };

  constructor(app) {
    Object.assign(this, {
      app: app
    });
    this.__initMethods();
  }

  __request(api, data = {}, callback = function () { }, header = {}, method = 'post') {
    var that = this;
    data = Object.assign({}, { 
      bid: that.app.globalData.sessionJdbBrandId || '', 
      ukey: that.app.globalData.sessionJdbUkey || '' 
    }, data);
    
    Object.assign(header, { "Content-Type": "application/x-www-form-urlencoded" });

    wx.request({
      url: that.API_SERVER + api,
      data: data,
      method: 'post',
      header: header,
      dataType: "json",
      success: function (res) {
        if (typeof (res.data) != 'object' && (res.data == 404 || res.data.indexOf('A PHP Error was encountered') > -1)) {
          wx.showModal({
            title: '服务错误',
            content: '',
            showCancel: false
          });
          return false;
        }

        if (res.data.status==403){
          that.app.clearStorage();
          wx.redirectTo({url: '/pages/login/login'});
          return false;
        }


        if (typeof callback === 'function' && callback.call(that, res.data, res.header, res.statusCode, res.errMsg) === false) {
          return false;
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
    };

    this.tracking = function (a, k, order_id){
      var data = { a: a, k: k, order_id: order_id, openid: this.app.globalData.sessionJdbOpenid};
      this.__request(this.API_CONFIG.common.tracking, data);
    };
  }
}
export default form