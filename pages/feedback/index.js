// pages/feedback/index.js
Page({
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 被选中的图片路劲
    chooseImgs: [],
    textVal: ""

  },
  // 外网的图片路径数组
  UpLoadImgs: [],
  handleTabsItemChange(e) {
    const {
      index
    } = e.detail;
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  // 点击 + 选择图片
  handleChooseImg() {
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片来源 
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 拼接路劲数组
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },
  // 点击自定义图片组件
  handleRemoveImg(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let {
      chooseImgs
    } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮
  handleFormSubmit() {
    const {
      textVal,
      chooseImgs
    } = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 上传图片到专门的图片服务器
    // 上传文件的api不支持多个文件同时上传 遍历数组
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
    // 判断有没有图片上传
    if (chooseImgs.length != 0) {
      wx.hideLoading();
      console.log("提交了图片和文本");
      this.setData({
        textVal: "",
        chooseImgs: []
      })
      wx.navigateBack({
        delta: 1
      });
      /* chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 没找图床，不搞路径了
          url: '',
          filePath: v,
          name: "file",
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).url;
            this.UpLoadImgs.push(url);
            // 所有图片上传完毕后才触发
            if (i === chooseImgs.length - 1) {
              // 重置页面
              wx.hideLoading();
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          },
        });
      }) */
    } else {
      wx.hideLoading();
      console.log("只提交了文本");
      this.setData({
        textVal: "",
        chooseImgs: []
      })
      wx.navigateBack({
        delta: 1
      });
    }

  }


})