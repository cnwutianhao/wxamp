// detail.js（用于编写页面的逻辑代码）
Page({
  data: {
    detailMovie: {},
  },

  onLoad: function (options) {
    var filmId = JSON.parse(options.filmId)
    console.log(filmId)
    wx.showLoading({
      title: '加载中',
    })

    // 构造请求的 URL
    const url = `https://m.maoyan.com/ajax/detailmovie?movieId=${filmId}`
    var that = this;

    wx.request({
      url,
      success: function (res) {
        wx.hideLoading()
        var movie = res.data.detailMovie
        that.setData({
          detailMovie: movie,
        })
      },
      fail: (err) => {
        console.log(err)
      },
    })
  }
})