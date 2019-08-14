// pages/movie-detail/movie-detail.js
const innerAudioContext = wx.createInnerAudioContext();
const db = require('../../utils/db')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail: {},
    reviewDetail: {},
    playing: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReviewDetail(options.id)
    innerAudioContext.src = this.data.reviewDetail.content
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
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    })
    this.getOpenid()
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
    innerAudioContext.destroy
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
  getReviewDetail(id){
    db.getReviewDetail(id).then(res => {
      this.setData({
        reviewDetail: res.data[0]
      })
      this.getMovieDetail(this.data.reviewDetail.movieId)
    })
  },
  getMovieDetail(id) {
    db.getMovieDetail(id).then(res => {
      this.setData({
        movieDetail: res.data[0]
      })
    })
  },
  //cloud
  add() {
    innerAudioContext.pause()
    wx.showLoading({
      title: '收藏中...',
    })
    db.addToFavour({
      user: this.data.openid,
      reviewId: this.data.reviewDetail._id,
      movieId: this.data.movieDetail._id
    }).then(result => {
          wx.hideLoading()
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
            appid: 'wx6a5d06b450ff0ed5', secret: 'a06d8a3f7d8af248a092eac4ad13981d', code: res.code
          }, success: function (response) {
            var openid = response.data.openid; console.log('请求获取openid:' + openid);      //可以把openid存到本地，方便以后调用
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
  choose() {
    let that = this;
    util.isAuthenticated().then(userInfo => {
      wx.showActionSheet({
        itemList: ['文字', '語音'],
        success(res) {
          console.log(res.tapIndex)
          wx.navigateTo({
            url: '../../pages/review-edit/review-edit?selected=' + res.tapIndex + '&id=' + that.data.movieDetail._id
          })
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '請先登陸！'
      })
    })
  },
    play() {
    let that = this;
    innerAudioContext.onError((res) => {
      console.log(res)
    })
    innerAudioContext.src = this.data.reviewDetail.content; // 这里可以是录音的临时路径
    innerAudioContext.play()
    this.setData({
        playing: 1 ,
        duration: "緩存中(沒回應請再試一次)"
      })
    setTimeout(() => {
        innerAudioContext.currentTime
      if (this.data.duration == "緩存中(沒回應請再試一次)")this.play()
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
      innerAudioContext.destroy
    })
  },
  stop: function () {
    this.setData({ playing: 0 })
    innerAudioContext.stop()
    innerAudioContext.destroy
  },
})
