/* 
3 点击加入购物车
 1 先绑定点击事件
 2 获取缓存中的购物车数据 数组格式
 3 先判断 当前的商品是否已经存在于购物车
 4 已存在 修改商品数据 执行购物车数量++ 重新把购物车主句填充会缓存中
 5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上购买数量属性num 重新把购物车数组填充会缓存中
 6 弹出提示
*/
import {
  request
} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({

  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;

    const {
      goods_id
    } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    });
    this.GoodsInfo = goodsObj;
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机不识别webp图片格式
        // 临时修改 确保后台存在
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        // goods_introduce: goodsObj.goods_introduce,
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  // 轮播图放大预览
  handlePreviewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },
  // 加入购物车
  handleCartAdd() {
    const userInfo = wx.getStorageSync("userInfo");
    // 判断有没有登录
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
    // 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      //已存在
      cart[index].num++;
    }
    // 把购物车重新添加到缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });
  },
  // 加入收藏
  handleCollect() {
    const userInfo = wx.getStorageSync("userInfo");
    // 判断有没有登录
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      });
      return;
    }
    let isCollect = false;
    // 获取收藏缓存
    let collect = wx.getStorageSync("collect") || [];
    // 判断是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 当index！=-1 表示已经被收藏
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中的属性
    this.setData({
      isCollect
    })
  }
})