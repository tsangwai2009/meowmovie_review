// pages/movie-detail/movie-detail.js
const db = require('../../utils/db')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.getMovieDetail(options.id).then(res => {
      console.log(res.data[0])
      this.setData({
        movieDetail:res.data[0]
      })
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

  },
  choose() {
    let that=this;
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
})