// pages/review-preview/review-preview.jsc
const innerAudioContext = wx.createInnerAudioContext();
const db = require('../../utils/db')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options.content)
    this.setData({
      isVoice: options.isVoice,
      content: decodeURIComponent(options.content)
    })
    this.getOpenid()
    this.getMovieDetail(options.id)
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
       })
     }).catch(err => {
       console.log('Not Authenticated yet')
     })
  },
  getMovieDetail(id) {
    db.getMovieDetail(id).then(res => {
      this.setData({
        movieDetail: res.data[0]
      })
    })
  },
  play () {
    let that=this;
    console.log(this.data.content)
    innerAudioContext.src = this.data.content; // 这里可以是录音的临时路径
    innerAudioContext.onError((res) => {
      console.log(res)
    })
    innerAudioContext.play()
    innerAudioContext.onPlay((res) => {
      this.setData({ playing: 1 })
    })
    this.setData({
      duration: "緩存中"
    })
      setTimeout(() => {
        innerAudioContext.currentTime
         innerAudioContext.onTimeUpdate(() => {
           console.log(innerAudioContext.currentTime)
          this.setData({ 
            duration: ("0" + Math.floor(parseFloat(innerAudioContext.currentTime / 60))).slice(-2)
             + ":" + ("0" + Math.ceil((parseFloat(innerAudioContext.currentTime % 60)))).slice(-2)
           })
         })
       }, 800)
    innerAudioContext.onEnded((res) => {
      innerAudioContext.stop()
      this.setData({
        playing: 0,
        duration: "播放"
      })
    })
  },
  stop: function () {
    this.setData({ playing: 0 })
    innerAudioContext.stop()
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
    innerAudioContext.stop()
    innerAudioContext.destroy()
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
  uploadRecord(){
    innerAudioContext.stop()
    innerAudioContext.destroy()
    wx.showLoading({
      title: '提交中...'
    })
      wx.cloud.uploadFile({
        cloudPath: `record/${util.getId()}`,
        filePath: this.data.content,
        success: res => {
          console.log(res)
          this.setData({ content: res.fileID })
          this.addReview()
        },
        fail: res => { console.log(res) }
      })
  },
  addReview() {
    let that=this;
    if (!this.data.content) return
    if (this.data.isVoice==0){wx.showLoading({
      title: '提交中...'
    })}
    db.addReview({
      username: this.data.userInfo.nickName,
      avater: this.data.userInfo.avatarUrl,
      content: this.data.content,
      movieId: this.data.movieDetail._id,
      user: this.data.openid,
      isVoice:this.data.isVoice
    }).then(result => {
      wx.hideLoading()
      if (result) {
        wx.showToast({
          title: '成功發佈'
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '../../pages/review-list/review-list?&id=' + this.data.movieDetail._id
          })
          // wx.navigateBack()
        }, 1500)
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: 'Failed'
      })
    })
  },
  getOpenid: function () {
    let that = this;  //获取openid不需要授权
    wx.login({
      success: function (res) {    //请求自己后台获取用户openid
        wx.request({
          url: 'https://30paotui.com/user/wechat', data: {
            appid: 'wx6a5d06b450ff0ed5', secret: 'a06d8a3f7d8af248a092eac4ad13981d',
            code: res.code
          }, success: function (response) {
            var openid = response.data.openid; console.log('请求获取openid:' + openid);
            wx.setStorageSync('openid', openid);
            console.log(openid)
            that.setData({
              openid: openid
            })
          }
        })
      }
    })
  }, 
  back(){
    wx.navigateBack()
  }
})