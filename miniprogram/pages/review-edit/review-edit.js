// pages/review-edit/review-edit.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const db = require('../../utils/db')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    recording:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isVoice: options.selected
    })
    this.getMovieDetail(options.id)
  },
  start () {
    this.setData({ id: util.getId() })
    const options = {
      duration: 20000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'aac',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    this.setData({ recording: 1 })
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  stop () {
    const id = this.data.id
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.setData({ 
        content: res.tempFilePath,
        recording:0
      })
      console.log('停止录音', res.tempFilePath)
    })
  },
  getMovieDetail(id) {
    db.getMovieDetail(id).then(res => {
      this.setData({
        movieDetail: res.data[0]
      })
    })
  },
  onInput(event) {
    this.setData({
      content: event.detail.value.trim()
    })
  },
  addReview(event){
    wx.navigateTo({
      url: '../../pages/review-preview/review-preview?id=' + this.data.movieDetail._id + '&isVoice=' + this.data.isVoice + '&content=' + encodeURIComponent(this.data.content)
    })
  },

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
    wx.stopPullDownRefresh()
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

  },
})