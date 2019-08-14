// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main =　async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID

  await db.collection('favour').add({
    data: {
      user:event.userInfo.openId,
      movieId: event.movieId,
      reviewId: event.movieId,
      createTime: +new Date(),
    },
  })

  return event
}