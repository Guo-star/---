# selectCity
微信小程序省市区三级联动 使用了腾讯地图api


在.json引入组件
<pre>
  <code>
    {
      "usingComponents": {
        "provinceinp": "../../components/provinceinp/provinceinp"
      }
    }
  </code>
</pre>

在.wxml中直接使用 upPcValue传入初始值 bind:cleckEvent接受选择值

在.js中 接受组件传入值
<pre>
  <code>
    /**
     *  选择户籍
     */
    _cleckEvent(e) {
      //获取户籍选择组件值
      this.setData({
        pcValue: e.detail
      })
    },
  </code>
</pre>
