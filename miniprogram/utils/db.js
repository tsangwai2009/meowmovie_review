const util = require('util.js')

const db = wx.cloud.database({
  env: 'movie-2hovl'
})

module.exports = {
  getMovieList() {
    return db.collection('movie').get()
  },
  getReviewList(movieId) {
    return db.collection('review').where({
      movieId,
    }).get()
  },
  getFavourList(user){
    return db.collection('favour').where({
      user,
    }).get()
  },
  getEditList(user) {
    return db.collection('review').where({
      user,
    }).get()
  },
  //specific Movie 
  getMovieDetail(id) {
    return db.collection('movie').where({
      _id: id
    }).get()
  },
  //specific Review
  getReviewDetail(id) {
    return db.collection('review').where({
      _id: id
    }).get()
  },
  addReview(data) {
    console.log(data)
    return util.isAuthenticated()
      .then(() => {
        return db.collection('review').add({
          data: {
            user: data.user,
            username: data.username,
            avater: data.avater,
            content: data.content,
            movieId: data.movieId,
            user:data.user,
            isVoice:data.isVoice
          },
        })
      }).catch(() => {
        wx.showToast({
          icon: 'none',
          title: '請先登錄'
        })
        return {}
      })
  },
  addToFavour(data){
    console.log(data)
    return util.isAuthenticated()
      .then(() => {
        db.collection('favour').where({
          user:data.user,
          reviewId:data.reviewId,
        }).get({
          success: function (res) {
            // res.data 包含该记录的数据
            console.log(res.data)
            if(res.data.length==0){
              db.collection('favour').add({
                data: {
                  user: data.user,
                  movieId: data.movieId,
                  reviewId: data.reviewId,
                },
              })
              wx.showToast({
                title: '成功收藏'
              })
            } else wx.showToast({
              icon: 'none',
              title: '已收藏過'
            })
          }
        })
      })
      .catch(() => {
        wx.showToast({
          icon: 'none',
          title: '請先登錄'
        })
        return {}
      })
  },
}
