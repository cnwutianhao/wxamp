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

interface WeatherPageData {
  value: Value;
}

Page({
  data: {
    value: {} as Value,
  },

  onLoad: function () {
    this.loadData();
  },

  loadData: function () {
    wx.request({
      url: "https://aider.meizu.com/app/weather/listWeather?cityIds=101070201",
      success: (res) => {
        const data = res.data as { code: string; value: Value[] };
        if (data.code === "200") {
          const value: Value = data.value[0];
          this.setData({
            value: value,
          });
        }
      },
      fail: (err) => {
        console.error("API request failed: ", err);
      },
    });
  },
});