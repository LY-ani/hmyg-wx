// 同时发送异步请求的次数
let ajaxTimes = 0;
export const request = params => {
  /* // 判断url中是否带有 /my/ 请求的是私有的路径 带上header token
  // 在发送带header的请求时不用加header
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接header带上token
    header["Authorization"]=wx.getStorageSync('token');
  } */
  ajaxTimes++;
  // 显示加载中的效果
  wx.showLoading({
    title: "加载中",
    mask: true,
  });

  // 定义公共的url
  const baseURL = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      // header: header,
      url: baseURL + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    })
  })
}