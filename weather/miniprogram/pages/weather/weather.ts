interface CitySearchItem {
  cityId: string;
  name: string;
  pname: string;
}

interface CitySearchData {
  city_list: CitySearchItem[];
}

interface Temperature {
  value: number;
  unit: string;
}

interface WindDescription {
  value: string;
  unit: string;
  winddir: string;
}

interface WeatherData {
  weather_desc: string;
  weather_desc_id: string;
  temp: Temperature;
  wind_desc: WindDescription;
  direction: number;
  humidity: string;
  aqi: number;
  aqi_desc: string;
  aqi_num: number;
  alerts: Alert[];
  forecast_day: ForecastDay[];
  hourly: Hourly[];
  hourly_8: Hourly[];
  sunset: {
    cityid: number;
    date: string;
    sunrise: string;
    sundown: string;
    sunrise_hour: string;
    sundown_hour: string;
    is_day: number;
  };
}

interface Alert {
  update_time: string;
  port_defense_id: string;
  land_defense_id: string;
  pub_time: string;
  name: string;
  title: string;
  level: string;
  infoid: number;
  content: string;
  rel_time: string;
  type: string;
  id: string;
  name_num: number;
  level_num: number;
  date: string;
  time: string;
}

interface ForecastDay {
  weather_desc_day: string;
  weather_desc_night: string;
  temp_high: Temperature;
  temp_low: Temperature;
  icon_day: string;
  icon_night: string;
  wind_desc_day: WindDescription;
  wind_desc_night: WindDescription;
  predict_date: string;
  predict_week: string;
  aqi: {
    pubTime: number;
    value: number;
    aqi_num: number;
    aqi_name: string;
  };
}

interface Hourly {
  temperature: {
    temp: Temperature;
    icon: number;
    hour: number;
    condition: string;
  };
  wind: {
    hour: number;
    wind_desc: WindDescription;
    direction: number;
  };
}

Page({
  data: {
    image: "",
    loading: true
  },

  onLoad: function () {
    this.getLongitudeAndLatitude();
  },

  // 获取经纬度
  getLongitudeAndLatitude: function () {
    var that = this;
    wx.showLoading({ title: '加载中' });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意获取地理位置信息
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  const latitude = res.latitude;    // 纬度，浮点数，范围为90 ~ -90
                  const longitude = res.longitude;  // 经度，浮点数，范围为180 ~ -180。
                  that.getLocation(latitude, longitude);
                }
              });
            },
            fail() {
              // 用户拒绝了授权请求
              console.log('用户拒绝了获取地理位置信息的授权请求');
            }
          });
        } else {
          // 用户已经同意获取地理位置信息
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              const latitude = res.latitude;    // 纬度，浮点数，范围为90 ~ -90
              const longitude = res.longitude;  // 经度，浮点数，范围为180 ~ -180。
              that.getLocation(latitude, longitude);
            }
          });
        }
      }
    });
  },

  // 获取当前位置
  getLocation: function (latitude: number, longitude: number) {
    var that = this;
    const ak = 'FpGacYmfVbQhNHO51YYGS4v3LR7cgS8P';
    const url = `https://api.map.baidu.com/geocoder/v2/?ak=${ak}&location=${latitude},${longitude}&output=json&pois=1`;

    wx.request({
      url: url,
      success(res: { data: { result: { addressComponent: { province: string, city: string } } } }) {
        const province = res.data.result.addressComponent.province;
        const city = res.data.result.addressComponent.city;
        that.getCityId(province, city);
      },
      fail: (err) => {
        console.error("API request failed: ", err);
      },
    });
  },

  // 获取城市ID
  getCityId: function (p: string, c: string) {
    var that = this;
    const url = `https://co.moji.com/api/scity/citySearch?name=${c}&platform=moji`;

    wx.request({
      url: url,
      method: 'GET',
      success(res: { data: CitySearchData }) {
        const data = res.data;
        const cityList = data.city_list;
        for (const city of cityList) {
          const cityId = city.cityId;
          const cityName = city.name;
          const provinceName = city.pname;
          if (provinceName === p && cityName === c) {
            that.loadCurrentWeatherData(cityName, cityId);
            break;
          }
        }
      },
      fail: (err) => {
        console.error("API request failed: ", err);
      },
    });
  },

  // 获取天气
  loadCurrentWeatherData: function (city: string, cityId: string) {
    const url = `https://co.moji.com/api/weather2/weather?city=${cityId}`;

    var that = this;
    wx.request({
      url: url,
      success(res: { data: { data: WeatherData } }) {
        const currentWeatherData = res.data.data;
        that.showData(city, currentWeatherData);
      },
      fail: (err) => {
        console.error("API request failed: ", err);
      },
    });
  },

  // 显示天气
  showData: function (city: string, currentWeatherData: WeatherData) {
    var that = this;

    wx.hideLoading();

    // 天气预警
    const alerts = currentWeatherData.alerts;
    // 6日天气
    const forecast_day = currentWeatherData.forecast_day;
    // 24小时天气
    const hourly = currentWeatherData.hourly;
    // 日出日落
    const sunset = currentWeatherData.sunset;

    // 天气背景
    if (currentWeatherData.sunset.is_day === 1) {
      that.data.image = `https://h5tq.moji.com/tianqi/assets/images/skin/day_${currentWeatherData.weather_desc_id}.jpg`;
    } else {
      that.data.image = `https://h5tq.moji.com/tianqi/assets/images/skin/night_${currentWeatherData.weather_desc_id}.jpg`;
    }

    this.setData({
      city: city,
      weather: currentWeatherData,
      alerts: alerts,
      forecastDay: forecast_day,
      hourly: hourly,
      sunset: sunset,
      image: that.data.image,
      loading: false
    });
  },

  // 发送给朋友
  onShareAppMessage: function () {
    return {
      title: '吴同学观天气',
      path: 'pages/weather/weather'
    }
  },
});