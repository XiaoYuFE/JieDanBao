import form from '../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({
  data: {
    toView: "",
    step: "",
    isNoData: false,
    loadMoreData: "加载中...",
    scrollHeight: "",
    dataList: "",

    stepall: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step0: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step1: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step2: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step3: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step4: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step5: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    step6: {
      currentPage: 1,
      isLast: false,
      list: []
    },
    stepsx: {
      currentPage: 1,
      isLast: false,
      list: []
    }

  },

  onLoad: function (options) {
    console.dir(options);
    var that = this;
    this.setData({
      step: options.type,
      toView: options.toView
    });

    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    // this._getDataList(this.data.step, this.data.dataAll[options.toView]);
  },
  navTap: function (event) {
    var step;
    var id = event.currentTarget.id;
    if (this.data.toView == id) {
      return;
    }
    this.setData({
      isLast: false,
      isNoData: false,
      dataList: ""
    });
    
    
    if (id == "stepall") {
      step = "";
    } else if (id == "step0") {
      step = 0;
    } else if (id == "step1") {
      step = 1;
    } else if (id == "step2") {
      step = 2;
    } else if (id == "step3") {
      step = 3;
    } else if (id == "step4") {
      step = 4;
    } else if (id == "step5") {
      step = 5;
    } else if (id == "step6") {
      step = 6;
    } else if (id == "stepsx") {
      step = -1;
    }
    this.setData({
      step: step,
      toView: event.currentTarget.id
    });

    //服务端请求数据(发送用户id和订单的类型)
    this._getDataList(step, this.data[this.data.toView], true);
  },
  onShow: function () {
    this._getDataList(this.data.step, this.data[this.data.toView], true);
  },
  _getDataList: function (listType, obj, isClear) {
    var that = this;
    if (isClear) {
      obj.currentPage=1;
    }
    app.form.requestPost(app.form.API_CONFIG['list'], {
      page: obj.currentPage,
      step: listType,
      bid: app.globalData.sessionJdbBrandId,
      ukey: app.globalData.sessionJdbUkey
    }, function (res) {
      if (!res.data.info.length || res.data.info.length < 20) {
        that.setData({
          isLast: true
        })
      } else {
        obj.currentPage++;
      }
      if (obj.currentPage == 1 && !res.data.info.length) {
        that.setData({
          isNoData: true
        })
      }
      if (isClear) {
        obj.list = res.data.info;
      } else {
        obj.list = obj.list.concat(res.data.info);
      }
      that.setData({
        dataList: obj.list,

      })
    });
  },
  lower: function () {
    if (this.data.isLast) {
      return;
    } else {
      this._getDataList(this.data.step, this.data[this.data.toView]);
    }
  }
})