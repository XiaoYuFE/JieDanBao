import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepText: { dfw: '新订单', ylf: '已量房', ybj: '已报价', yqy: '已签约', azz: '安装中', ywg:'已完工'},
    stepKeyConfig: ['dfw', 'ylf', 'ybj', 'yqy', 'azz','ywg'],
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
    that.setData({fromWhere: !!options.from});

    app.form.requestPost(app.form.API_CONFIG.jiancai.order_info, { id: options.id}, function (res) {
      that.setData({ order: res.data, stepKey: that.data.stepKeyConfig.indexOf(res.data.step)})
    });
  },
  setStepHandler: function () {
    var that = this;
    if (this.data.order.step == 'void' || this.data.order.step=='ywg') {
      return false;
    }

    var next_step = this.data.stepKeyConfig[this.data.stepKey+1];
    wx.showActionSheet({itemList: [this.data.stepText[next_step], '停止服务'],
      success: function (res) {
        if (res.tapIndex === undefined) {
          return false;
        }

        var step = res.tapIndex == 1 ? 'void' : next_step;
        that.tracking(res.tapIndex == 1);

        //点击的是步骤,发送数据请求(用户id 订单id)
        if (step == 'ybf') {
          wx.redirectTo({
            url: '/pages/jiancai/cost/cost?id=' + that.data.order.id + "&step=" + step
          });
          return false;
        }

        wx.showLoading({ title: '加载中', mask: true });

        app.form.requestPost(app.form.API_CONFIG.jiancai.opt_order, {
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

  tracking:function(stop = false){
    var k = this.data.stepKeyConfig.indexOf(this.data.order.step);
    console.dir(k)
    var config = {
      dfw: 'liangfang', 
      ylf: 'yibaojia', 
      ybj: 'yiqianyue', 
      yqy: 'anzhuangzhong', 
      azz: 'yiwancheng', 
      'void':'stop'
    };
   
    var step = stop ? 'stop' : config[this.data.order.step];
    app.form.tracking(step, 'jdb_jieduan' + k, this.data.order.id);
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