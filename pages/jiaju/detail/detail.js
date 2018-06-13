import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepText: {dfw:'新订单',ylf:'已量房', sjz:'设计中', dbz:'已对比', yqy:'已签约', sgz:'施工中', ywg:'完成','void':'跑单'},
    stepKeyConfig:['dfw','ylf','sjz','dbz','yqy','sgz','ywg','void'],
    order:{},
    isIpx:app.globalData.isIpx,
    fromWhere:"",
    stepKey:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取页面传递过来的id,然后动过id获取订单详情
    that.setData({fromWhere: options.from});

    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {id: options.id}, function (res) {
      that.setData({ order: res.data, stepKey: that.data.stepKeyConfig.indexOf(res.data.step)})
    });
  },
  setStepHandler: function () {
    var that = this;
    if (this.data.step == 'void' || this.data.step=='ywg') {
      return false;
    }

    var next_step = this.data.stepKeyConfig[this.data.stepKey+1];
    wx.showActionSheet({itemList: [this.data.stepText[next_step], '停止服务'],
      success: function (res) {
        var step = res.tapIndex == 1 ? 'void' : next_step;
        that.tracking(step);
        //点击的是步骤,发送数据请求(用户id 订单id)
        if (step == 'sjz') {
          wx.redirectTo({
            url: '/pages/jiaju/cost/cost?id=' + that.data.order.id + "&step=" + step
          });
          return false;
        }

        wx.showLoading({ title: '加载中', mask: true });

        app.form.requestPost(app.form.API_CONFIG.jiaju.opt_order, {
          step: step,
          id: that.data.order.id
        }, function (res) {
          wx.hideLoading();
          wx.showModal({ content: res.msg, showCancel: false });
          if (res.status != 1) {
            return false;
          }

          that.data.order.step = step;
          that.data.stepKey    = that.data.stepKeyConfig.indexOf(step);

          that.setData({ order: that.data.order, stepKey: that.data.stepKey});
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  makeCallPhone: function () {
    wx.makePhoneCall({phoneNumber: this.data.order.mobile });
    
    var k = this.data.stepKeyConfig.indexOf(this.data.order.step);
    app.form.tracking('call', 'jdb_jieduan' + k, this.data.order.id);
  },

  tracking:function(opt){
    var config = { 
      ylf: 'liangfang', 
      sjz: 'sheji', 
      dbz: 'duibi', 
      yqy: 'qianyue', 
      sgz: 'shigong', 
      ywg: 'wancheng',
      'void':'stop'
    };
    var k = this.data.stepKeyConfig.indexOf(opt);
    app.form.tracking(config[opt], 'jdb_jieduan' + k, this.data.order.id);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})