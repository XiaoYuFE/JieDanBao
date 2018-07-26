

import form from '../../../static/js/plugin/form'
const app = getApp();
app.form = new form(app);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:"",
    id:"",
    hxList: [["0室", "1室", "2室", "3室", "4室"], ["0厅", "1厅", "2厅"], ["0厨", "1厨", "2厨", "3厨"], ["0卫", "1卫", "2卫", "3卫", "4卫", "5卫", "6卫"], ["0阳台", "1阳台", "2阳台", "3阳台", "4阳台", "5阳台", "6阳台"]],
    dType: [{ did: 1, name: "全包" }, { did: 2, name: "半包" }],
    hxIndex:[0,0,0,0,0],
    hxIndexStr:"0|0|0|0|0",
    ysIndex:0,
    fsIndex:0,
    fwqkIndex:0,
    zxfgIndex:0,
    configInfo:""
  },

  bindPickerYsChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ysIndex: e.detail.value
    })
  },
  bindPickerFsChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      fsIndex: parseInt(e.detail.value)
    })
  },

  bindMultiPickerChangeHX: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hxIndex: e.detail.value,
      hxIndexStr:this.data.hxIndex.join("|")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    this.setData({
      id:509
    });
    var that=this;

    app.form.requestPost(app.form.API_CONFIG.jiaju.edit_config, {}, function (res) {
      console.dir(res);
      that.setData({
        configInfo: res.data
      });
    });
    
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
        id:that.data.id
    },function(res){
        
      res ={ "data": { "id": 509, "c_time": "2018-07-26 11:23:25", "l_time": "0000-00-00 00:00:00", "sj_time": "0000-00-00 00:00:00", "step": "dlf", "order_no": "180726010012", "d_time": "", "mobile": "18606005002", "realname": "\u59dc\u5148\u751f", "d_type":"", "fwqk": null, "d_style": "", "price": "", "unit": "", "d_date": "", "community": "", "remark": "", "area": "" }, "status": 1, "msg": "success", "redict": "" }
        if (res.data.d_type==1){
          res.data.format_d_type="全包"
        } else if (res.data.d_type==2){
          res.data.format_d_type = "半包"
        }else{
          res.data.format_d_type = ""
        }
        that.setData({
          dataInfo:res.data
        });
      
    });
   

    
  },

  goBack:function(){
    wx.navigateBack();
  },

  formSubmit:function(e){
      wx.showLoading();
      app.form.requestPost(app.form.API_CONFIG.jiaju.edit_signup,e, function (res) {
        console.dir(res);
        that.setData({
          configInfo: res.data
        });

      });

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})