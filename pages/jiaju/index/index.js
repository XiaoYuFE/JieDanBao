import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);




Page({
  data: {
    
    xyUserInfo: {},
    dataInfo: {},
    wxTimerList: {},
   
  },

  onLoad: function() {
    console.group("onLoad事件");
    var that = this;
    //获取配置信息
    that.setData({
      xyUserInfo: app.globalData.sessionJdbUserInfo
    });
    app.form.tracking('jdb_index', 'jdb_index', '');

    
  },

  onReady: function() {
    console.group("onReady事件");
  },

  onShow: function() {
   
   
    console.group("onShow事件");
   
    var that=this;

    //请求数据
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
      //保存住当前的时间
     
      that.setData({
        dataInfo: res.data
      });

      console.dir(that.data.wxTimerList)

      var wxTimer1 = new timer({
        beginTime: 60,
        name: 'wxTimer1',
        formatType:"MS",
        complete: function () {
          console.log("完成了")
        },
        interval: 1,
        intervalFn: function () {
          console.dir("xxx")
        }
      })

     

      wxTimer1.start(that);

    })
  },

  onHide: function() {
    console.group("onHide事件");
    
  },
  onUnload: function() {
    console.group("onUnload事件");
  },


  //获取页面数据（登录以后才执行此步骤）
 


  setting: function() {
    wx.redirectTo({
      url: '/pages/setting/setting'
    })
  },





  onShareAppMessage: function() {
    return {
      title: '小鱼接单宝',
      path: '/pages/login/login',
      imageUrl: "http://m3.xiaoyu.com/img/jiedanbao_share.png",
      success: function(res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {

      }
    }
  }
  


})