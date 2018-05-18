
const app = getApp();
// var order = ['orderall', 'orderxdd', 'orderylf', 'orderysj', 'orderyqy', 'orderysx']

Page({
  data: {
    toView: "",
    step: "",
    loadMoreData:"加载更多...",
    scrollHeight:"",
    dataList: "",
    stepCurrObj:"",

    stepall: {
      currentPage: 1,
      isLast:false,
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
    console.dir(event);
    var step;
    var id = event.currentTarget.id;
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
    this._getDataList(step, id);
  },
  onShow: function () {
    this._getDataList(this.data.step, this.data[this.data.toView]);
  },
  _getDataList: function (listType, obj) {
    var that = this;
    wx.request({
      // url: app.globalData.server + "/welcome/wechatapp?callback=Jiaju.dlist",
      url: "https://wnworld.com/api/JieDanBang/list01.php",
      data: {
        page: obj.currentPage,
        step: listType,
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
        if (!res.data.data.info || !res.data.data.info.length){
          obj.isLast=true;
        }
        obj.currentPage++;
        obj.list = obj.list.concat(res.data.data.info);
        console.dir(obj);
        that.setData({
          stepCurrObj: obj,
          dataList: obj.list
        })


      }
    })
  },
  lower:function(){
    if (this.data.isLast) {
      this.setData({
        loadMoreData: '已经到顶'
      });
      return;
    } else {
      //  this._getDataList(this.data.step, this.data[this.data.toView]);
    }
  }









})