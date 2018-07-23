
import form from '../../../static/js/plugin/form'
import timer from '../../../static/js/plugin/wxTimer.js'
const app = getApp();
app.form = new form(app);

// var DataTimer=(function(){
//   let date = new Date//当前日期
//   let year = date.getFullYear()//当前年
//   let month = date.getMonth() + 1//当前月份
//   let day = date.getDate()//当天
  
//   let monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]//月份列表
//   let nowMonthList = []//本年剩余年份


//   for (let i = month; i < 13; i++) {
//     nowMonthList.push(i)
//   }
 
//   let yearList = [year]//年份最大可能
//   for (let i = 0; i < 10; i++) {
//     yearList.push(year + i + 1)
//   }

//   let leapYear = function (Year) {//判断是否闰年 
//     if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
//       return (true);
//     } else { return (false); }
//   }

//   let monthAll=[];
//   let dayAll=[];
//   for (let i = 0; i < yearList.length; i++) {//遍历年
//     let mList
//     if (yearList[i] == year) {//判断当前年份
//       mList = nowMonthList
//     } else {
//       mList = monthList
//     }
//     monthAll.push(mList)
//     for (let j = 0; j < mList.length; j++) {//循环月份
//       let t_days = [31, 28 + leapYear(yearList[i]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
//       let t_days_thisYear = []
//       if (yearList[i] == year) {
//         for (let m = 0; m < nowMonthList.length; m++) {
//           t_days_thisYear.push(t_days[mList[m] - 1])
//         }
//         t_days = t_days_thisYear
//       } else {
//         t_days = [31, 28 + leapYear(yearList[i]), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
//       }
//       for (let k = 0; k < t_days[j]; k++) {//循环每天
//         let days = k + 1;
//         if (days < 10) {
//           days = "0" + days
//         }
//       }
//     }
//   }
//   return {
//     years: yearList,
//     months: monthAll,
//     days: dayAll
//   }

// })();

// console.dir(DataTimer);


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:488,
    dataInfo:"",
    radioVal:"",


    items: [
      { value: '1', name: '已完成'},
      { value: '0', name: '待完成', checked: 'true'}
    ],
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
    multiIndex: [0, 0, 0],
  },


  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        console.log(data.multiIndex);
        break;
    }
    this.setData(data);
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.dir(options);
    var that=this;

    app.form.requestPost(app.form.API_CONFIG.jiaju.process_order, {
     id:that.data.id
    }, function (res) {
        console.dir(res);
        that.setData({
          dataInfo:res.data
        })
    });
  },

  radioChange:function(e){
    this.setData({
      radioVal: e.detail.value
    });
  },

  uploadFangAn:function(){
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.form.API_CONFIG.jiaju.orders, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          formData: {

          },
          success: function (res) {
            var data = res.data
            console.dir(data);
            //do something
          }
        })
      }
    })
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