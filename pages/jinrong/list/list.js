import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    toView: "",
    step: "",
    isNoData: false,
    loadMoreData: "加载中...",
    scrollHeight: "",
    dataList: [],

    currentPage: 1,
    pagesize: 10,
    isLast: false,
  },

  onLoad: function (options) {
    var that = this;
    this.setData({ step: options.toView });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ scrollHeight: res.windowHeight });
      }
    });
  },
  navTap: function (event) {
    var step = event.currentTarget.dataset.step;
    if (this.data.step == step) {
      return false;
    }

    this.setData({
      isLast: false,
      isNoData: false,
      dataList: [],
      currentPage:1,
      step:step
    });
    this._getDataList();
  },
  onShow: function () {
    this._getDataList();
  },
  _getDataList: function () {
    var that = this;
    app.form.requestPost(
      app.form.API_CONFIG.jinrong.orders,
      { page: that.data.currentPage, step: that.data.step },
      function (res) {
        if (res.data.total < 1) {
          that.setData({ isNoData: true });
          that.setData({ isLast: true });
          return false;
        }

        if (!res.data.orders.length || res.data.orders.length < res.data.size) {
          that.setData({isLast: true});
        }

        that.data.currentPage++;
       
        that.data.dataList.push.apply(that.data.dataList, res.data.orders);
        that.setData({ dataList: that.data.dataList})
      });
  },

  lower: function () {
    this.data.isLast || this._getDataList();
  }
})