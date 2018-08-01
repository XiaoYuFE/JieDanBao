
import dateTimePicker from '../../../static/js/plugin/dateTimePicker.js'
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
    qwfgIndex:0,
    qwfgObj:{},
    qwfgObjIdStr:"",
    qwfgObjNameStr: "",
    configInfo:"",

    zxrqData:"",


    date: "",
    dateTimeArray1: null,
    
    startYear: 2010,
    endYear: 2050
  },

  _getQwfgName:function(id){
    
   
    for (var i = 0; i < this.data.configInfo.d_style.length;i++){
      if (this.data.configInfo.d_style[i].id==id){
        return this.data.configInfo.d_style[i].name;
      }
    }
   
  },

  bindPickerChangeQwfg: function (e) {
    
    var index = parseInt(e.detail.value)+1;
    var qwfgObj = Object.assign({}, this.data.qwfgObj);
    var qwfgObjId=[];
    var qwfgObjName=[];
    
    if (!qwfgObj.index){
      qwfgObj[index] = this._getQwfgName(index);
    }
   
    this.setData({
      qwfgObj: qwfgObj
    });
    for(var i in qwfgObj){
      qwfgObjId.push(i);
      qwfgObjName.push(qwfgObj[i]);
    }
    console.dir(qwfgObjName)
    this.setData({
      qwfgObjIdStr:qwfgObjId.join("|"),
      qwfgObjNameStr: qwfgObjName.join(",")
    });
  
  },

  bindPickerYsChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ysIndex: e.detail.value
    })
  },
  bindPickerChangeFs: function (e) {
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

  bindPickerChangeQk:function(e){
    this.setData({
      fwqkIndex: parseInt(e.detail.value)
    })
  },

  //确认以后会触发这个事件
  changeDateTime1(e) {
    var that = this;
    var eVal = e.detail.value;

    var timeVal = that.data.dateTimeArray1[0][eVal[0]] + "-" + that.data.dateTimeArray1[1][eVal[1]] + "-" + that.data.dateTimeArray1[2][eVal[2]];
   
    this.setData({
      zxrqData: timeVal
    });
  },

  changeDateTimeColumn1(e) {
    console.dir("changeDateTimeColumn1")
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    console.dir(e.detail.value);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    this.setData({
      id: options.id
    });
    var that=this;

    app.form.requestPost(app.form.API_CONFIG.jiaju.edit_config, {}, function (res) {
      console.dir(res);
      that.setData({
        configInfo:res.data
      });
    });
    
    app.form.requestPost(app.form.API_CONFIG.jiaju.order_info, {
        id:that.data.id
    },function(res){
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

    var obj1 = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, that.data.date);
    var lastArray = obj1.dateTimeArray.splice(3,3);
    var lastTime = obj1.dateTime.pop();
    that.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
   

    
  },
  changeDateTimeColumn1(e) {
    console.dir("changeDateTimeColumn1")
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  goBack:function(){
    wx.navigateBack();
  },

  formSubmit:function(e){
    var that=this;
      wx.showLoading();
      app.form.requestPost(app.form.API_CONFIG.jiaju.edit_signup,e.detail.value, function (res) {
        console.dir(res);
        if(res.status==1){
          wx.showToast({
            title: '信息更新成功！',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack();
          },1500)
        }else{
          wx.showToast({
            title: '信息更新失败！',
            duration: 2000
          })
        }
        

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