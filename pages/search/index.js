import regeneratorRuntime from "../../lib/runtime/runtime";
import {
  request
} from "../../request/index.js"

Page({
  data: {
    goods: [],
    isFocus: false
  },
  TimeId: -1,
  handleInput(e) {
    const {
      value
    } = e.detail;
    // 检验合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false,
        inputValue: ""
      })
      return;
    }
    this.setData({
      isFocus: true
    })
    // 准备发送请求获取数据
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000);
  },
  // 发送请求
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    });
    this.setData({
      goods: res
    })
  },

  // 点击取消
  handleCancel() {
    this.setData({
      inputValue: "",
      goods: [],
      isFocus: false
    })
  }

})