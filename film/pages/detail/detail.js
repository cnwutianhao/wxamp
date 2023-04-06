// detail.js（用于编写页面的逻辑代码）
Page({
  // 页面初始数据
  data: {
    detailMovie: {}, // 初始化页面中电影详细信息为空对象
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 从 URL 参数 options 中获取电影 ID
    var filmId = JSON.parse(options.filmId)
    // 在控制台输出电影 ID，方便调试
    console.log(filmId)
    // 显示加载中提示框
    wx.showLoading({
      title: '加载中',
    })

    // 构造请求的 URL
    const url = `https://m.maoyan.com/ajax/detailmovie?movieId=${filmId}`
    // 存储 this 对象，方便在回调函数中访问组件内部状态
    var that = this;

    // 发起网络请求
    wx.request({
      url,
      success: function (res) {
        // 隐藏加载中提示框
        wx.hideLoading()
        // 获取电影详细信息
        var movie = res.data.detailMovie
        // 更新组件内部状态，显示电影详细信息
        that.setData({
          detailMovie: movie,
        })
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '吴同学看电影', // 分享标题
      path: 'pages/detail/detail' // 分享路径
    }
  },

  // 用户点击右上角分享到朋友圈
  onShareTimeline: function (res) {
    return {
      title: '吴同学看电影', // 分享标题
      imageUrl: 'http://n.sinaimg.cn/sinacn20190816s/300/w700h400/20190816/c196-ichcymv8367951.jpg' // 分享图片 URL
    }
  }
})