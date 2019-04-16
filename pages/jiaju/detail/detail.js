import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepText: ['新订单', '已量房', '设计中', '已签约', '完成', '跑单'],
    stepTextRemain: [],
    stepKey: ['dfw', 'ylf', 'sjz', 'yqy', 'ywg', 'void'],
    stepKeyRemain:[],
    stepKeyIndex: 0,
    
    currStepKey:"",
    isValidStep: false,
    tArea:"",
    order: {},
    isIpx: app.globalData.isIpx,
    fromWhere: "",
    isSfShow: false
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取页面传递过来的id,然后动过id获取订单详情
    that.setData({
      fromWhere: !!options.from
    });
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
      id: options.id
    }, function(res) {
      that.setData({
        order: res.data,
        currStepKey: res.data.step,
        stepKeyIndex: that.data.stepKey.indexOf(res.data.step)
      });
      that.setData({
        stepTextRemain: that.getNewShowText(that.data.stepKeyIndex),
        stepKeyRemain: that.getNewShowKey(that.data.stepKeyIndex),
      })
    });
  },
  getNewShowText(index) {
    var arr = [];
    for (var i = index+1; i < this.data.stepText.length; i++) {
      arr.push(this.data.stepText[i]);
    }
    return arr;
  },
  getNewShowKey(index) {
    var arr = [];
    for (var i = index + 1; i < this.data.stepKey.length; i++) {
      arr.push(this.data.stepKey[i]);
    }
    return arr;
  },
  // setStepHandler: function () {
  //   var that = this;
  //   if (this.data.order.step == 'void' || this.data.order.step=='ywg') {
  //     return false;
  //   }

  //   var next_step = this.data.stepKeyConfig[this.data.stepKey+1];

  //   wx.getSystemInfo({
  //     success: function (result) {
  //       let itemList;
  //       if (result.platform == 'android') {
  //         itemList = [that.data.stepText[next_step], '停止服务', "取消"]
  //       } else {
  //         itemList = [that.data.stepText[next_step], '停止服务']
  //       }
  //       wx.showActionSheet({
  //         itemList: itemList,
  //         success: function (res) {
  //           if (res.tapIndex === undefined) {
  //             return false;
  //           }

  //           if (res.tapIndex === 2) {
  //             return false;
  //           }

  //           var step = res.tapIndex == 1 ? 'void' : next_step;
  //           that.tracking(res.tapIndex == 1);

  //           //点击的是步骤,发送数据请求(用户id 订单id)
  //           if (step == 'sjz') {
  //             wx.redirectTo({
  //               url: '/pages/jiaju/cost/cost?id=' + that.data.order.id + "&step=" + step
  //             });
  //             return false;
  //           }

  //           wx.showLoading({ title: '加载中', mask: true });

  //           app.form.requestPost(app.form.API_CONFIG.jiaju.opt_order, {
  //             step: step,
  //             id: that.data.order.id
  //           }, function (res) {
  //             wx.hideLoading();
  //             wx.showModal({ content: res.msg, showCancel: false });
  //             if (res.status != 1) {
  //               return false;
  //             }

  //             that.data.order.step = step;
  //             that.data.stepKey = that.data.stepKeyConfig.indexOf(step);

  //             that.setData({ order: that.data.order, stepKey: that.data.stepKey });
  //           });
  //         },
  //         fail: function (res) {
  //           console.log(res.errMsg)
  //         }
  //       })
  //     }
  //   });


  // },
  // makeCallPhone: function () {
  //   wx.makePhoneCall({phoneNumber: this.data.order.mobile });

  //   var k = this.data.stepKeyConfig.indexOf(this.data.order.step);
  //   app.form.tracking('call', 'jdb_jieduan' + k, this.data.order.id);
  // },

  // tracking:function(stop = false){
  //   var k = this.data.stepKeyConfig.indexOf(this.data.order.step);
  //   var config = {
  //     dfw: 'dfw', 
  //     ylf: 'ylf', 
  //     sjz: 'sjz', 
  //     yqy: 'yqy', 
  //     ywc: 'ywc', 
  //     'void':'stop'
  //   };

  //   var step = stop ? 'stop' : config[this.data.order.step];
  //   app.form.tracking(step, 'jdb_jieduan' + k, this.data.order.id);
  // },
  //更新订单
  updateStep: function() {
    this.setData({
      isSfShow: true
    })
  },
  closeDialog: function() {
    this.setData({
      isSfShow: false
    })
  },
  //
  changeStep: function(event) {
    var oldStepKeyIndex = this.data.stepKey.indexOf(this.data.order.step);
    var oldStepKey = this.data.order.step;


    
    
    var currStepKey = event.currentTarget.dataset.step;

    if (currStepKey == 'sjz') {
      wx.redirectTo({
        url: '/pages/jiaju/cost/cost?id=' + this.data.order.id + "&step=" + currStepKey
      });
      return false;
    }
    //点击的是当前选中的值,取消选中
    // console.log("------------");
    // console.log("oldStepKeyIndex:"+oldStepKeyIndex);
    // console.log("oldStepKey:"+oldStepKey);
    // console.log("currStepKey:"+currStepKey);
   

   
    if (currStepKey == this.data.currStepKey){
      // console.log("xxxx点击同一个")
      this.setData({
        isValidStep:false,
        stepKeyIndex: oldStepKeyIndex,
        currStepKey: oldStepKey
      })
    }else{
      this.setData({
        isValidStep:true,
        stepKeyIndex: this.data.stepKey.indexOf(currStepKey),
        currStepKey: currStepKey
      })
    }

    // console.log("stepKeyIndex:" + oldStepKeyIndex);
    
    // console.log("currStepKey:" + this.data.currStepKey);

    
    

    wx.showModal({
      title: '提示',
      content: '订单状态将切换到 "' + this.data.stepText[this.data.stepKeyIndex] + '"',
      showCancel: false,
      confirmText: "我知道了"
    })
  
  },
  markContent:function(e){
    this.setData({
      tArea: e.detail.value
    })
  },
  formSubmit: function(e) {
    var value = e.detail.value;
    var that=this;
    wx.showLoading({ title: '加载中', mask: true });
    app.form.requestPost(app.form.API_CONFIG.jiaju.opt_order, value, function(res) {
      wx.hideLoading();
     
      wx.showModal({
        content: res.msg,
        showCancel: false
      });
      if (res.status != 1) {
        return false;
      }

      that.setData({
        isSfShow:false
      })

      console.dir(value);

      that.data.order.step = value.step;
      that.data.currStepKey = that.data.stepKey.indexOf(value.step);

      that.setData({
        order: that.data.order
      });
      that.setData({
        stepKeyIndex: that.data.stepKey.indexOf(that.data.order.step)
      });

      that.setData({
        stepTextRemain: that.getNewShowText(that.data.stepKeyIndex),
        stepKeyRemain: that.getNewShowKey(that.data.stepKeyIndex)
      });

      
    });

  }
})