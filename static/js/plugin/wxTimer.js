var wxTimer = function(initObj) {
  initObj = initObj || {};
  this.beginTime = initObj.beginTime; //开始时间
  this.interval = initObj.interval || 0; //间隔时间
  this.complete = initObj.complete; //结束任务
  this.name = initObj.name; //当前计时器在计时器数组对象中的名字
  this.intervalFn = initObj.intervalFn; //间隔任务
  this.formatType = initObj.formatType || "HMS";
  this.intervarID; //计时ID
}

//日期秒转成分秒
wxTimer._formatDateHMS = function(mss) {
  var hours = parseInt(mss / (60 * 60));
  //扣去小时以后 剩下的就是分钟
  var minutes = parseInt(mss % (60 * 60) / 60);
  var seconds = mss % 60;
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return {
    hours:hours,
    minutes: minutes,
    seconds: seconds
  };
}
wxTimer._formatDateMS = function(mss) {
  var minutes = parseInt(mss / 60);
  var seconds = mss % 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return {
    minutes: minutes,
    seconds: seconds
  };
};

wxTimer.prototype = {
  //开始
  start: function(self) { 
    var that=this;
    var hmsTime, msTime;
    var wxSeconds = that.beginTime;
    //开始倒计时
    var count = 0; //这个count在这里应该是表示s数，js中获得时间是ms，所以下面*1000都换成ms
    function begin() {
      count++;
      wxSeconds--;
      var wxTimerList = self.data.wxTimerList;
      delete wxTimerList[that.name];
      
      if (that.formatType=="HMS"){
        hmsTime = wxTimer._formatDateHMS(wxSeconds);
        wxTimerList[that.name] = {
          formatHour: hmsTime.hours,
          formatMinute: hmsTime.minutes,
          formatSecond: hmsTime.seconds
        }
      } else if (that.formatType == "MS"){
        msTime = wxTimer._formatDateMS(wxSeconds);
        wxTimerList[that.name] = {
          formatMinute: msTime.minutes,
          formatSecond: msTime.seconds
        }
      }
     
      self.setData({
        wxTimerList: wxTimerList
      })
     

     

      //时间间隔执行函数
      if (that.intervalFn) {
        that.intervalFn();
      }
      //结束执行函数
      if (wxSeconds <= 0) {
        if (that.complete) {
          that.complete();
        }
        that.stop();
      }
    }
    begin();
    this.intervarID = setInterval(begin, 1000);
  },
  //结束
  stop: function() {
    clearInterval(this.intervarID);
  }
}

module.exports = wxTimer;