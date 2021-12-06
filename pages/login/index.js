// pages/login/index.js
Page({
  handleGetUserProfile() {
    wx.getUserProfile({
      desc: '登录注册',
      success: (res) => {
        const {
          userInfo
        } = res;
        wx.setStorageSync("userInfo", userInfo);
        wx.navigateBack({
          delta: 1
        });
      },
      fail: (err) => {
        console.log('授权失败');
      }
    });
  }
})