import {
  request
} from "../../request/index.js"

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 分类导航数组
    catesList: [],
    // 楼层数组
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   },
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  getCatesList() {
    request({
        url: "/home/catitems"
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  getFloorList() {
    request({
        url: "/home/floordata"
      })
      .then(result => {
        let data = JSON.stringify(result);
        data = data.replace(/goods_list/g, 'goods_list/index');
        data = JSON.parse(data)
        this.setData({
          floorList: data
        })
      })
  },
});