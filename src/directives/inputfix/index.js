/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 处理H5键盘兼容性指令
 * @Date: 2019-02-28 17:40:05
 * @LastEditTime: 2019-06-29 17:31:25
 * 差异:在android平台,键盘弹起会压缩webview高度,ios中键盘弹起整个webview会往上滚
 */

function getClientHeight() {
  const originHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  return originHeight;
}

// 查找input标签
function findInputTag(el) {
  if (el.getElementsByTagName("input").length > 0) {
    return el.getElementsByTagName("input")[0];
  } else if (el.getElementsByTagName("textarea").length > 0) {
    return el.getElementsByTagName("textarea")[0];
  } else {
    return el;
  }
}
// 获取设备类型
const device = (function () {
  const ua = window.navigator.userAgent.toLocaleLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  return {
    isIOS: isIOS,
    isAndroid: isAndroid
  };
})();

// ios键盘事件处理
const iosHandler = {
  timer: null,
  // 键盘弹起
  keyboardShow(target, originHeight, val) {
    clearTimeout(this.timer)
  },

  // 键盘收起
  keyboardHide(target, originHeight) {
    target.blur();
    //处理微信浏览器版本6.7.4+IOS12会出现键盘收起后，视图被顶上去了没有下来
    var wechatInfo = window.navigator.userAgent.match(
      /MicroMessenger\/([\d\.]+)/i
    );
    if (!wechatInfo) return;
    console.log("微信浏览器版本6.7.4+IOS12");
    var wechatVersion = wechatInfo[1];
    var version = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (+wechatVersion.replace(/\./g, "") >= 674 && +version[1] >= 12) {
      this.timer = setTimeout(() => {
        window.scrollBy(0, 0);
      }, 100)
    }
  }
};

// android键盘事件处理
const androidHandler = {
  // 键盘弹起
  keyboardShow(target, originHeight, $event) {
    // console.log("android keyBoard show", window);
    setTimeout(function () {
      target.scrollIntoViewIfNeeded();
      // window.scrollTo(0, originHeight);
    }, 100);
  },
  //键盘收起
  keyboardHide(target, originHeight) {
    //安卓手机在键盘收起时不会失去焦点
    target.blur();
    window.scrollTo(0, originHeight);
  }
};

export default {
  inserted: (el, binding, vnode) => {
    // 获取节点对象
    const target = findInputTag(el, binding, vnode);
    const { value } = binding;
    if (device.isIOS) {
      let originHeight = getClientHeight();
      //ios键盘弹起
      target.addEventListener(
        "focus",
        () => {
          iosHandler.keyboardShow(target, originHeight, value);
        },
        false
      );

      //ios键盘收起
      target.addEventListener(
        "blur",
        () => {
          iosHandler.keyboardHide(target, originHeight);
        },
        false
      );
    } else if (device.isAndroid) {
      /*获取初始化页面高度*/
      let originHeight = getClientHeight();
      window.addEventListener(
        "resize",
        $event => {
          /*键盘弹出或者收起都会引起页面高度变化,获取变化后的高度*/
          let resizeHeight = getClientHeight();
          //变化后的高度小于原始高度,此时为键盘弹起的操作
          if (resizeHeight < originHeight) {
            androidHandler.keyboardShow(
              target,
              originHeight,
              $event
            );
          } else {
            //此处处理键盘收起起所后所需的页面逻辑
            androidHandler.keyboardHide(
              target,
              originHeight,
              $event
            );
          }
        },
        false
      );
    }
  }
};
