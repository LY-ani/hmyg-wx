// pages/user/index.js
Page({
  data: {
    userInfo: {},
    collectNums: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      userInfo,
      collectNums: collect.length
    })
  },
  handleLogout() {
    console.log('13');
    wx.clearStorageSync();
    wx.showToast({
      title: '退出成功',
      icon: 'none',
      duration: 1500,
      mask: true,
    });
    wx.navigateTo({
      url: '/pages/user/index',
    });
  }

})