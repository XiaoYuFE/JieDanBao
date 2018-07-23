import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    xyUserInfo: {},
    dataInfo: {},
    wxTimerList: {},
    wxTimerInstance: {},
    newDiaToggle:false,
    resultDiaToggle:false,
    tipDiaToggle:false
  },

  onLoad: function() {
    console.group("onLoad事件");
    console.dir(app.globalData.sessionJdbUserInfo);
    var that = this;
    //获取配置信息
    that.setData({
      xyUserInfo: app.globalData.sessionJdbUserInfo
    });
    app.form.tracking('jdb_index', 'jdb_index', '');

    this._getData();
    
  },

  onReady: function() {
    console.group("onReady事件");
  },

  onShow: function() {
    console.group("onShow事件");
    var that = this;
  },

  _getData:function(){
    var that=this;
    //请求数据
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_total, {}, function (res) {
      //判断是否登陆
      
      if (!!res.data.new_order){
        //保存住当前的时间
        res.data.format_mobile = that._formatMobile(res.data.new_order.mobile);
        that._countDown(res.data.new_order);
      }
      that.setData({
        dataInfo: res.data
      });
        
    })
  },
  _formatMobile: function (phoneNum) {
    var phoneNum = String(phoneNum);
    return phoneNum.substring(0, 3) + "****" + phoneNum.substring(8, 11);
  },
  _countDown: function (item) {
    var that = this;
    var wxTimerName = "wxTimer" + item.id;
    wxTimerName = new timer({
      beginTime: item.d_time,
      formatType: "MS",
      name: item.id,
      complete: function () {
        console.log("完成了")
      },
      interval: 1,
      intervalFn: function () {

      }
    })
    wxTimerName.start(that);
    that.data.wxTimerInstance[item.id] = wxTimerName;
  },

  openNewDialog:function(){
    //请求数据
    var that=this;
    wx.showLoading();
   
    app.form.requestPost(app.form.API_CONFIG.jiaju.opt_orders, {
      id: that.data.dataInfo.new_order.id,
      step:"wjd"
    }, function (res) {
        if(!!res.status){
          that.setData({
            resultDiaToggle:true
          });
        }
    });
  },
  resultDialogBtn:function(){
    //隐藏弹出框
    this.setData({
      resultDiaToggle: false
    });
    //跳转到详细页
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + this.dataInfo.new_order.id,
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


  closeDialogNew:function(){
      
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