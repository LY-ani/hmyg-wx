/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置api获取用户的收货地址 wx.chooseAddress
2 获取用户对小程序授予的获取地址权限状态 scope
  1 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
    scope 值 true
  2 假设 用户 从来没有调用过 收货地址api
    scope undefined 直接调用 获取收货地址
  2 假设 用户 点击获取收货地址的提示框 取消 authSetting scope.address
    scope 值 false
    1 诱导用户自己打开授权界面 进行授权
    2 获取收货地址
*/

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime";

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },
  async handleChooseAddress() {
    try {
      const userInfo = wx.getStorageSync("userInfo");
      // 判断有没有登录
      if (!userInfo) {
        wx.navigateTo({
          url: '/pages/login/index',
        });
        return;
      }
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      const address = await chooseAddress();
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id == goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 封装计算总价、
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
  // 购物车全选
  handleItemAllCheck() {
    let {
      cart,
      allChecked
    } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  // 商品数量编辑
  async handleItemNumEdit(e) {
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({
        content: "您是否要删除？"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 阶段
  async handlePay() {
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: "您还有有添加收货地址"
      });
      return;
    }
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }



  // handleChooseAddress() {
  //   // 获取 权限状态
  //   wx.getSetting({
  //     success: (result) => {
  //       // 获取权限状态 主要发现一些属性名怪异的时候，都要用[]形式来获取属性值
  //       const scopeAddress = result.authSetting["scope.address"];
  //       if (scopeAddress === true || scopeAddress === undefined) {
  //         wx.chooseAddress({
  //           success: (result1) => {
  //             console.log(result1);
  //           },
  //         });
  //       } else {
  //         // 用户以前拒绝过授权 先诱导用户打开授权页面
  //         wx.openSetting({
  //           success: (result2) => {
  //             // 可以调用收货地址
  //             wx.chooseAddress({
  //               success: (result3) => {
  //                 console.log(result3);
  //               },
  //             });
  //           },
  //         });
  //       }
  //     },
  //   });
  // }
})