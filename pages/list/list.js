
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
    if (id =="orderall"){
      step="";
    } else if (id == "orderxdd"){
      step=0;
    } else if (id == "orderylf") {
      step = 1;
    } else if (id == "orderysj") {
      step = 2;
    } else if (id == "orderyqy") {
      step = 4;
    } else if (id == "orderysx") {
      step = -1;
    }
    this.setData({
      step:step,
      toView: event.currentTarget.id
    });
    //服务端请求数据(发送用户id和订单的类型)
    this._getDataList(step);
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