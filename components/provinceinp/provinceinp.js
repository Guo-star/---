

const city = require('./city.js')
const QQMapWX = require('./qqmap-wx-jssdk.min.js');
const qqData = new QQMapWX({
  key: 'T6VBZ-HKGCF-LPCJ5-NJZJJ-4DKZV-U7BP2' // 必填
});

// 获取到的province["上海市", "江苏省", "浙江省", "安徽省", "北京市", "重庆市", ...]
let province = (city.province || []).map(v => {
  return v.fullname
});

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    upPcValue:{//修改时的值
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //默认值 户籍
    p_c: [["上海市"], ["黄浦区"], ["南京东路街道"]],
    //对应的数组下标
    pcIndex: [0, 0, 0],
    pcValue: '',//选择值
    city: [],//2级城市
  },
  ready: function () {
    if (this.data.upPcValue){
      this.setData({
        pcValue: this.data.upPcValue
      })
    }
    //户籍默认上海
    this.data.p_c[0] = province;
    Promise.all([this.getcitys('310000'), this.getcitys('310101')]).then(res => {
      this.setData({
        city: res[0]
      })
      this.data.p_c[1] = (res[0] || []).map(v => {
        return v.fullname
      });
      this.data.p_c[2] = (res[1] || []).map(v => {
        return v.fullname
      });

      this.setData({ p_c: this.data.p_c })
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getcitys: function (val) {
      //获取下级城市
      return new Promise(function (resolve, reject) {
        qqData.getDistrictByCityId({
          id: val,
          success: function (res) {
            resolve(res.result[0]);
          }
        })
      })
    },
    pkIndex: function (e) {
      //确认选择户籍
      let selectValue = e.detail.value;

      let province = this.data.p_c[0][selectValue[0]];
      let city = this.data.p_c[1][selectValue[1]];
      let district = this.data.p_c[2][selectValue[2]] ? this.data.p_c[2][selectValue[2]]:"";
      let dir = "";

      if (district){
        dir = province + ',' + city + ',' + district;
      }else{
        dir = province + ',' + city;
      }

      this.setData({
        pcIndex: selectValue,
        pcValue: dir
      })

      this.triggerEvent("cleckEvent", this.data.pcValue);
    },
    pkCol: function (e) {
      //不同列选择事件
      let id, arritem;

      switch (e.detail.column) {//操作列
        case 0:
          for (arritem of city.province) {
            if (arritem.fullname == province[e.detail.value]) {
              id = arritem.id;
              break;
            }
          }
          this.getcitys(id).then(res => { //选择第一列 获取2 3列数据；并默认1
            this.getcitys(res[0].id).then(res1 => {
              this.setData({
                city: res,
                "p_c[2]": (res1 || []).map(v => { return v.fullname }),
                "p_c[1]": (res || []).map(v => { return v.fullname }),
                "pcIndex[0]": e.detail.value,
                "pcIndex[1]": 0,
                "pcIndex[2]": 0,
              })
            })
          })

          break;
        case 1:
          for (arritem of this.data.city) {
            if (arritem.fullname == this.data.p_c[1][e.detail.value]) {
              id = arritem.id;
              break;
            }
          }
          this.getcitys(id).then(res => {
            this.setData({
              "pcIndex[1]": e.detail.value,
              "p_c[2]": (res || []).map(v => { return v.fullname }),
              "pcIndex[2]": 0,
            })
          })
          break;
        case 2:
          this.setData({
            "pcIndex[2]": e.detail.value
          })
          break;
      }
    },
  }
})
