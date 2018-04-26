
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
      step:options.step,
      toView: options.toView
    });
    this._getDataList(this.data.step);
  },
  navTap: function (event) {
    console.dir(event);
   
    this.setData({
      toView: event.currentTarget.id
    });
    //服务端请求数据(发送用户id和订单的类型)
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
        page:0,
        step: 0,
        bid: app.globalData.sessionJdbBrandId,
        ukey: app.globalData.sessionJdbUkey
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      dataType: "json",
      success: function (res) {
        console.dir(res.data.list);
        that.setData({
          dataList: res.data.info
        })
      }
    })
  }









})