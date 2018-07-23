class form {
  API_SERVER = 'https://m3.xiaoyu.com/jiedanbao/';
  // API_SERVER = 'https://wnworld.com/api/JieDanBao/';
  API_CONFIG = {
    jiaju:{
      order_total: 'order_total/2',
      opt_orders:'opt_orders/2',
      orders: "orders/2",
      order_info: 'order_info/2',
      process_order:'process_order/2',
      upload_img:'upload_img/2',
      edit_config:'edit_config/2/',
      opt_order: 'opt_order',
      config: 'config',
      notice: 'notice',
      order_stop:"order_stop.php"
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
      tracking:'tracking',
	  shops:'shops'
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
        wx.hideLoading();
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