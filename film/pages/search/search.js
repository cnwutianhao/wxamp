// search.js
Page({
  data: {
    inputValue: '', // 存储搜索框的值
    searchResult: [], // 存储搜索结果
  },

  // 监听搜索框输入事件
  onInput(event) {
    const value = event.detail.value.trim()
    this.setData({
      inputValue: value,
    })
  },

  // 监听搜索按钮点击事件
  onSearch() {
    const value = this.data.inputValue
    if (!value) return // 如果搜索框为空，直接返回

    // 构造请求的 URL
    const url = `https://m.maoyan.com/searchlist/movies?keyword=${value}&ci=55&offset=1&limit=100`

    // 发起网络请求获取搜索结果
    wx.request({
      url,
      success: (res) => {
        const data = res.data || {}
        const movies = data.movies || []

        // 将结果存储到 data 中，触发页面重新渲染
        this.setData({
          searchResult: movies,
        })
      },
      fail: (err) => {
        console.log(err)
      },
    })
  },
})