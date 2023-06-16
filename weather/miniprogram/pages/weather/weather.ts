interface Weather {
  date: string;
  img: string;
  sun_down_time: string;
  sun_rise_time: string;
  temp_day_c: string;
  temp_day_f: string;
  temp_night_c: string;
  temp_night_f: string;
  wd: string;
  weather: string;
  week: string;
  ws: string;
}

interface Weather3HoursDetailsInfo {
  endTime: string;
  highestTemperature: string;
  img: string;
  isRainFall: string;
  lowerestTemperature: string;
  precipitation: string;
  startTime: string;
  wd: string;
  weather: string;
  ws: string;
}

interface WeatherDetailsInfo {
  publishTime: string;
  weather3HoursDetailsInfos: Weather3HoursDetailsInfo[];
}

interface Realtime {
  sD: string;
  sendibleTemp: string;
  temp: string;
  time: string;
  wD: string;
  wS: string;
  weather: string;
}

interface PM25 {
  advice: string;
  aqi: string;
  citycount: number;
  cityrank: number;
  co: string;
  color: string;
  level: string;
  no2: string;
  o3: string;
  pm10: string;
  pm25: string;
  quality: string;
  so2: string;
  timestamp: string;
  upDateTime: string;
}

interface Index {
  abbreviation: string;
  alias: string;
  content: string;
  level: string;
  name: string;
}

interface Alarm {
  alarmContent: string;
  alarmDesc: string;
  alarmId: string;
  alarmLevelNo: string;
  alarmLevelNoDesc: string;
  alarmType: string;
  alarmTypeDesc: string;
  precaution: string;
  publishTime: string;
}

interface Value {
  alarms: Alarm[];
  city: string;
  cityid: number;
  indexes: Index[];
  pm25: PM25;
  provinceName: string;
  realtime: Realtime;
  weatherDetailsInfo: WeatherDetailsInfo;
  weathers: Weather[];
}

interface Location {
  province: string;
  city: string;
}

interface WeatherPageData {
  location: Location;
  value: Value;
}

Page({
  data: {
    value: {} as Value,
    image: ""
  },

  onLoad: function () {
    this.getLongitudeAndLatitude();
  },

  // 获取经纬度
  getLongitudeAndLatitude: function () {
    var that = this;
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
                  console.log(`latitude: ${latitude}, longitude: ${longitude}`);
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
              console.log(`latitude: ${latitude}, longitude: ${longitude}`);
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
        console.log(province);
        console.log(city);
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
    let jsonData = require('../../data/cities');
    const provinces = jsonData.cities.provinces;
    for (const province of provinces) {
      if (province.provinceName === p) {
        const citys = province.citys;
        for (const city of citys) {
          if (city.cityName === c) {
            console.log(city.cityId);
            that.loadData(p, c, city.cityId);
            break;
          }
        }
        break;
      }
    }
  },

  // 获取天气数据
  loadData: function (province: string, city: string, cityId: string) {
    const url = `https://aider.meizu.com/app/weather/listWeather?cityIds=${cityId}`;

    var that = this;
    wx.request({
      url: url,
      success: (res) => {
        const data = res.data as { code: string; value: Value[] };
        if (data.code === "200") {
          const location: Location = { province: province, city: city, };
          const value: Value = data.value[0];

          if (value.realtime.weather.indexOf("晴") != -1) {
            that.data.image = "../../images/weather_sun.png"
          } else if (value.realtime.weather.indexOf("云") != -1) {
            that.data.image = "../../images/weather_cloud.png"
          } else if (value.realtime.weather.indexOf("阴") != -1) {
            that.data.image = "../../images/weather_overcast.png"
          } else if (value.realtime.weather.indexOf("雨") != -1) {
            that.data.image = "../../images/weather_rain.png"
          } else if (value.realtime.weather.indexOf("雪") != -1) {
            that.data.image = "../../images/weather_snow.png"
          } else {
            that.data.image = "../../images/weather_sun.png"
          }

          this.setData({
            location: location,
            value: value,
            image: that.data.image
          });
        }
      },
      fail: (err) => {
        console.error("API request failed: ", err);
      },
    });
  },
});