import {
  request
} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的菜单选项
    currentIndex: 0,
    // 右侧菜单距离顶部的距离
    scrollTop: 0
  },
  // 接口返回数据
  Cates: [],
  //options(Object)
  onLoad: function (options) {
    /* 
    0 web中的本地存储和小程序中的本地存储的区别
      1 写代码的方式不一样
        web：localStorage.setItem("key","value") localStorage.getItem("key")
        小程序中：wx.setStorageSync("key","value") wx.getStorageSync("key")
      2 存储的时候，有没有做类型转换
        web：不管存入的是什么类型是数据，最终都会先调用一下 toString()，把数据变成字符串，在存入进去
        小程序中：不存在类型转换这个操作，存什么类型的数据进去，获取的时候就是什么类型
    1 先判断本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2 没有旧数据 直接发送新请求
    3 有旧数据 同时旧数据没有过期 就使用本地存储中的旧数据
    */

    // 1 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 有旧数据，定义过期时间 
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧数据
        // console.log('111');
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // request({
    //     url: "/categories"
    //   })
    //   .then(res => {
    //     // console.log(res);
    //     this.Cates = res.data.message;

    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", {
    //       time: Date.now(),
    //       data: this.Cates
    //     });

    //     // 构造左侧的菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children;

    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    // 1 使用es7的async await来发送请求
    const res = await request({
      url: "/categories"
    });
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }

});