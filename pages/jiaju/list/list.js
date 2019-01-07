import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    step: "all",
    isNoData: false,
    loadMoreData: "加载中...",
    scrollHeight: "",
    dataList: [],
    currentPage: 1,
    isLast: false,
  },

  onLoad: function (options) {
    var that = this;
    this.setData({ step: options.toView ? options.toView : 'all'});
    console.dir(options)

    wx.getSystemInfo({
      success: function (res) {
        that.setData({scrollHeight: res.windowHeight});
      }
    });

    const query = wx.createSelectorQuery()
    query.select('#ylf').boundingClientRect()
    query.exec(function (res) {
      console.dir(res);
    })
    
  },
  navTap:function (event) {
    var step = event.currentTarget.dataset.type;
    if (this.data.step == step) {
      return false;
    }

    this.setData({
      isLast: false,
      isNoData: false,
      dataList: [],
      currentPage: 1,
      step: step
    });
    this._getDataList();
  },
  onShow: function () {
    this.setData({
      isLast: false,
      isNoData: false,
      dataList: [],
      currentPage: 1
    });
    this._getDataList();
  },
  _getDataList: function (listType, obj, isClear) {
    var that = this;
    app.form.requestPost(app.form.API_CONFIG.jiaju.orders, {
      page: that.data.currentPage,
      step: that.data.step,
    }, function (res) {
      if(res.status !==1)return false;
      if (res.data.total < 1) {
        that.setData({ isNoData: true });
        that.setData({ isLast: true });
        return false;
      }

      if (res.data.orders.length < res.data.size) {
        that.setData({isLast: true})
      }

      that.data.currentPage++;
      that.data.dataList.push.apply(that.data.dataList, res.data.orders);
      that.setData({ dataList: that.data.dataList });
    });
  },
  lower: function () {
    if (this.data.isLast) {
      return false;
    } 
    this._getDataList();
  }
})