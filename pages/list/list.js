
const app = getApp();
// var order = ['orderall', 'orderxdd', 'orderylf', 'orderysj', 'orderyqy', 'orderysx']

Page({
  data: {
    toView: "",
    dataList: ""
  },

  onLoad: function (options) {
    this.setData({
      toView: options.toView
    });
    this._getDataList(app.globalData.sessionJdbId, this.data.toView);
  },
  navTap: function (event) {
    console.dir(event);
   
    this.setData({
      toView: event.currentTarget.id
    });
    //服务端请求数据(发送用户id和订单的类型)
    this._getDataList(app.globalData.sessionJdbId, this.data.toView);
  },
  _getDataList: function (uid, listType) {
    var that=this;
    wx.request({
      url: app.globalData.server + "/order1.php",
      data: { "uid": uid, "type": listType},
      method: 'get',
      header: {
        'content-type': 'application/json' // 默认值
      },
      dataType: "json",
      success: function (res) {
        console.dir(res.data.list);
        that.setData({
          dataList: res.data.list
        })
      }
    })
  }









})