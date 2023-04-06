// film.js（用于编写页面的逻辑代码）
Page({
  data: {
    films: [],
    loading: true
  },

  onLoad: function () {
    this.loadFilms()
  },

  loadFilms: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://m.maoyan.com/ajax/movieOnInfoList',
      success: function (res) {
        wx.hideLoading()
        var films = res.data.movieList
        that.setData({
          films: films,
          loading: false
        })
      }
    })
  },

  onFilmTap: function (e) {
    var filmId = e.currentTarget.dataset.film
    console.log(filmId)
    wx.navigateTo({
      url: '/pages/detail/detail?filmId=' + JSON.stringify(filmId),
    })
  },

  // 发送给朋友
  onShareAppMessage: function () {
    return {
      title: '吴同学看电影',
      path: 'pages/film/film'
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