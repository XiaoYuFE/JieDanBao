
const app = getApp();
// var order = ['orderall', 'orderxdd', 'orderylf', 'orderysj', 'orderyqy', 'orderysx']

Page({
  data: {
    toView: "",
    step:"",
    dataList: ""
  },

  onLoad: function (options) {
    this.setData({
      step:options.type,
      toView: options.toView
    });
    this._getDataList(this.data.step);
  },
  navTap: function (event) {
    console.dir(event);
    var step;
    var id=event.currentTarget.id;
    if (id =="stepall"){
      step="";
    } else if (id == "step0"){
      step=0;
    } else if (id == "step1") {
      step = 1;
    } else if (id == "step2") {
      step = 2;
    } else if (id == "step3") {
      step =3;
    } else if (id == "step4") {
      step =4;
    } else if (id == "step6") {
      step =6;
    } else if (id =="stepsx"){
      step =-1;
    }
    this.setData({
      step:step,
      toView: event.currentTarget.id
    });
    //服务端请求数据(发送用户id和订单的类型)
    this._getDataList(step);
  },
  onShow: function () {
    this._getDataList(this.data.step);
  },
  _getDataList: function (listType) {
    console.dir(listType);
    var that=this;
    console.dir(app.globalData.sessionJdbBrandId);
    console.dir(app.globalData.sessionJdbUkey);
    wx.request({
      url: app.globalData.server + "/welcome/wechatapp?callback=Jiaju.dlist",
      data: {
        
        step:listType,
        bid: app.globalData.sessionJdbBrandId,
        ukey: app.globalData.sessionJdbUkey
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: "json",
      success: function (res) {
        console.dir(res.data.data.info);
        that.setData({
          dataList: res.data.data.info
        })

       
      }
    })
  }









})