const db = require('../../utils/db')
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    favourList:[],
    editList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        selected: options.selected
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
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    })
    this.getOpenid()
    if (this.data.selected == 0) this.getFavourList(this.data.openid)
    if (this.data.selected == 1) this.getEditList(this.data.openid)
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
    if(this.data.selected==0){
    this.getFavourList(this.data.openid, () => {
      wx.stopPullDownRefresh()
    })}
    else {///getEditList
      this.getEditList(this.data.openid, () => {
        wx.stopPullDownRefresh()
      })
    }
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
  getFavourList(user,callback) {
    db.getFavourList(user).then(res => {
      this.setData({
        favourList: res.data
      })
      for (var i = 0; i < this.data.favourList.length;i++)
      {this.getReviewDetail(this.data.favourList[i],i)}
      callback && callback()
    })
  },
  getEditList(user, callback) {
    db.getEditList(user).then(res => {
      this.setData({
        editList: res.data
      })
      for (var i = 0; i < this.data.editList.length; i++) 
      { this.getEditDetail(this.data.editList[i], i) }
      callback && callback()
    })
  },
  getReviewDetail(list,i){
        db.getReviewDetail(list.reviewId).then(res => {
        var username = 'favourList[' + i + '].username';
          var avater = 'favourList[' + i  + '].avater';
          var content = 'favourList[' + i + '].content';
          var isVoice = 'favourList[' + i + '].isVoice';
        this.setData({
          [username]: res.data[0].username,
          [avater]: res.data[0].avater,
          [content]: res.data[0].content,
          [isVoice]: res.data[0].isVoice
        })
      })
      db.getMovieDetail(list.movieId).then(res => {
          var image = 'favourList[' + i + '].image';
          var name = 'favourList[' + i + '].name';
          this.setData({
            [image]: res.data[0].image,
            [name]: res.data[0].name
          })
        })
  },
  getEditDetail(list, i) {
    db.getReviewDetail(list._id).then(res => {
      var content = 'editList[' + i + '].content';
      var isVoice = 'editList[' + i + '].isVoice';
      this.setData({
        [content]: res.data[0].content,
        [isVoice]: res.data[0].isVoice
      })
    })
    db.getMovieDetail(list.movieId).then(res => {
      var image = 'editList[' + i + '].image';
      var name = 'editList[' + i + '].name';
      this.setData({
        [image]: res.data[0].image,
        [name]: res.data[0].name
      })
    })
  },
  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
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
  choose() {
      wx.showActionSheet({
        itemList: ['已收藏影評', '已發佈影評'],
        success(res) {
          console.log(res.tapIndex)
          wx.navigateTo({
            url: '../../pages/me/me?selected=' + res.tapIndex
          })
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
  },
})