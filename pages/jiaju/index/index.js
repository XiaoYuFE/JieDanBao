import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    xyUserInfo: {},
    dataInfo: {},
    wxTimerList: {},
    fromWhere:"",
    fromId:"",
    fromDataInfo:{},
    fromDisabled:false,
    wxTimerInstance: {},
    newDiaToggle: false,
    tipDiaToggle: false
  },

  onLoad: function(options) {
    var that = this;
    //获取配置信息
    this.setData({
      xyUserInfo: app.globalData.sessionJdbUserInfo,
      fromWhere:options.fromWhere ? options.from :"",
      fromId: options.id ? options.id :"",
     
    });
    app.form.tracking('jdb_index', 'jdb_index', '');
    //如果是从推送消息来的，要去请求
    if(this.data.fromWhere){
      this.setData({
        newDiaToggle:true
      });
      app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
        id:this.data.fromId
      }, function (res) {
          that.setData({
            fromDataInfo:res.data
          });

        var fromSendwxTimer = new timer({
          beginTime: res.data.d_time,
          
          formatType: "HMS",
          name: "fromSendwxTimer",
          complete: function () {
            that.setData({
              fromDisabled:true
            })
          },
          interval: 1,
          intervalFn: function () {

          }
        })
        fromSendwxTimer.start(that);

     
      });

    }

    this._getData();
  },

  onReady: function() {
    console.group("onReady事件");
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this._getData("onPullDownRefresh");
  },

  newDiaClose:function(){
    this.setData({
      newDiaToggle: false,
      tipDiaToggle:true
    })
  },

  newTipDiaClose:function(){
    this.setData({
      tipDiaToggle: false
    });
  },
  _getData: function(typeStr) {
    var that = this;
    //请求数据
    
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_total, {}, function(res) {
      //判断是否登陆
      if (typeStr ="onPullDownRefresh"){
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
      }
      if (!!res.data.new_order) {
        //保存住当前的时间
        res.data.format_mobile = that._formatMobile(res.data.new_order.mobile);
        that._countDown(res.data.new_order);
      }
      that.setData({
        dataInfo: res.data
      });

    })
  },
  _formatMobile: function(phoneNum) {
    var phoneNum = String(phoneNum);
    return phoneNum.substring(0, 3) + "****" + phoneNum.substring(8, 11);
  },
  _countDown: function(item) {
    var that = this;
    var wxTimerName = "wxTimer" + item.id;
    wxTimerName = new timer({
      beginTime: item.d_time,
      formatType: "MS",
      name: item.id,
      complete: function() {
        console.log("完成了");
        that._getData();
      },
      interval: 1,
      intervalFn: function() {

      }
    })
    wxTimerName.start(that);
    that.data.wxTimerInstance[item.id] = wxTimerName;
  },

  ljjdHandleBtn: function(e) {
    //请求数据
    if (this.data.fromDisabled) return;
    var that = this;
    var id = e.target.dataset.id;
    wx.showLoading();

    app.form.requestPost(app.form.API_CONFIG.jiaju.opt_orders, {
      id: id,
      step: "wjd"
    }, function(res) {
      wx.hideLoading();
      if (!!res.status) {
        wx.navigateTo({
          url: '/pages/jiaju/detail/detail?fromWhere=dialog&id=' + that.data.dataInfo.new_order.id,
        })
      }
    });
  },
  
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