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
  }
})