
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isNoData:false,
      isLoading:true,
      tabType:"",
      
      orderType:"",
      prevType:"",//记录上一次点击的是哪个类型
      page:1,
      dataInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   * tabType:xdd(新订单)，clz(处理中)，yjs(已结束)
   */
  onLoad: function (options) {
    console.dir(options);
    options.tabType="xdd";
      this.setData({
        tabType: options.tabType,
        orderType: options.tabType,
        prevType: options.tabType
      });
      this._getData();
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
  navMainHandle:function(e){
    //设置标签状态
    this.setData({
      prevType: this.data.orderType,
      tabType: e.currentTarget.dataset.tabtype,
      orderType: e.currentTarget.dataset.tabtype,
     
    });
    //页面滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration:0
    });
    //点击不是同一个标签，那么就不需要重新加载了
    if (this.data.prevType != this.data.orderType) {
      this.setData({
        dataInfo:"",
        page:1
      });
      //请求数据
      this._getData();
    }
   
    

     
  },



  _getData:function(){
    var that=this;
    this.setData({
      isLoading:true
    });
    wx.request({
      url: 'https://wnworld.com/api/JieDanBao/order_list.php',
      data: { "type": that.data.orderType, "page": that.data.page},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        console.dir(res);
        if(res.data.ok){
          for (var i = 0; i < res.data.data.length;i++){
            res.data.data[i].format_mobile = that._formatMobile(res.data.data[i].mobile);
          }
          //如果是同一个列表，数据直接加在后面，不是同一个列表就要重新赋值
          if(that.data.prevType==that.data.orderType){
            console.dir("ASdfasdf");
            that.data.dataInfo.push.apply(that.data.dataInfo, res.data.data);
          }else{
            that.data.dataInfo=res.data.data;
          }
          that.setData({
            page:that.data.page+1,
            dataInfo: that.data.dataInfo,
            isLoading:false
          });

        }else{
          console.dir("服务器端返回错误");
        }
      }
    })
  },

  _formatMobile:function(phoneNum){
    var phoneNum = String(phoneNum);
    return phoneNum.substring(0, 3) + "****" + phoneNum.substring(8, 11);
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
    console.dir("onReachBottom");
    this.setData({
      isLoading:true
    });
    this._getData();

      
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})