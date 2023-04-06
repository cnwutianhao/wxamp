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
  },

  // 发送给朋友
  onShareAppMessage: function () {
    return {
      title: '吴同学看电影',
      path: 'pages/detail/detail'
    }
  },

  // 分享到朋友圈
  onShareTimeline: function (res) {
    return {
      title: '吴同学看电影',
      imageUrl: 'http://n.sinaimg.cn/sinacn20190816s/300/w700h400/20190816/c196-ichcymv8367951.jpg'
    }
  }
})