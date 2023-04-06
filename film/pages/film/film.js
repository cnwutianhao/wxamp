// film.js（用于编写页面的逻辑代码）
Page({
  // 页面初始数据
  data: {
    films: [], // 初始化页面中电影列表为空数组
    loading: true // 初始化页面显示加载状态
  },

  // 生命周期函数--监听页面加载
  onLoad: function () {
    // 加载电影列表
    this.loadFilms()
  },

  // 加载电影列表
  loadFilms: function () {
    // 存储 this 对象，方便在回调函数中访问组件内部状态
    var that = this
    // 显示加载中提示框
    wx.showLoading({
      title: '加载中',
    })
    // 发起网络请求获取电影列表
    wx.request({
      url: 'https://m.maoyan.com/ajax/movieOnInfoList',
      success: function (res) {
        // 隐藏加载中提示框
        wx.hideLoading()
        // 获取电影列表
        var films = res.data.movieList
        // 更新组件内部状态，显示电影列表
        that.setData({
          films: films,
          loading: false
        })
      }
    })
  },

  // 处理电影列表项点击事件
  onFilmTap: function (e) {
    // 获取当前电影 ID
    var filmId = e.currentTarget.dataset.film
    // 在控制台输出电影 ID，方便调试
    console.log(filmId)
    // 跳转到电影详情页，并将电影 ID 作为参数传递过去
    wx.navigateTo({
      url: '/pages/detail/detail?filmId=' + JSON.stringify(filmId),
    })
  },

  // 发送给朋友
  onShareAppMessage: function () {
    return {
      title: '吴同学看电影', // 分享标题
      path: 'pages/film/film' // 分享路径
    }
  },

  // 分享到朋友圈
  onShareTimeline: function (res) {
    return {
      title: '吴同学看电影', // 分享标题
      imageUrl: 'http://n.sinaimg.cn/sinacn20190816s/300/w700h400/20190816/c196-ichcymv8367951.jpg' // 分享图片 URL
    }
  }
})