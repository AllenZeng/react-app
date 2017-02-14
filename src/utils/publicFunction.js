export function fromArrayDelObj(array, key, val) {
  const len = array.length;
  for (let i = 0; i < len; i++) {
    if (array[i][key] === val) {
      array.splice(i, 1);
      break;
    }
  }
}

export function scrollToTop(scrollHeight = 0) {
  const intervalID = setInterval(() => {
    const scrollTop = document.body.scrollTop;
    if (scrollTop > scrollHeight) {
      window.scrollTo(0, scrollTop - 50);
    } else {
      clearInterval(intervalID);
    }
  }, 10);
}

export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return unescape(r[2]);
  }
  return null;
}

export function putBase64ToQiniu(data, upToken, callback) {
  let pic;
  const pics = data.split(',');
  if (pics.length > 1) {
    pic = pics[1];
  } else {
    pic = pics[0];
  }
  const url = 'https://up.qbox.me/putb64/-1';
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      let json,
        err;
      try {
        json = JSON.parse(xhr.responseText);
      } catch (e) {
        err = e;
      }
      callback(err, json);
    }
  };
  try {
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('Authorization', `UpToken ${upToken}`); // 七牛要求有一空格
    xhr.send(pic);
  } catch (e) {
    callback(e);
  }
}

export function preloadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = path;
  });
}

export function browser() {
  const u = navigator.userAgent;

  return {
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i) === 'qq', // 是否QQ
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
  };
}

export function imgIsComplete(url) {
  const img = new Image();
  img.src = url;

  return img.complete;
}

export function createAjax() {
  let xmlhttp = {};
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  return xmlhttp;
}

/*
 * {@params} file
 * {@return} object {width、height、size}
 */
export function getImageSize(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target.result;
    // 加载图片获取图片真实宽度和高度
    const image = new Image();
    image.onload = () => {
      const width = image.width;
      const height = image.height;

      callback({ width, height, size: file.size });
    };
    image.src = data;
  };
  reader.readAsDataURL(file);
}

/*
 * {@params} js file src
 */
export function insertModulJsFile(src) {
  const scripts = document.body.getElementsByTagName('script');
  const len = scripts.length;

  // 遍历是否已经添加
  for (let i = 0; i < len; i++) {
    if (scripts[i].src === src) {
      return;
    }
  }
  const cityScriptElement = document.createElement('script');
  cityScriptElement.src = src;
  document.body.appendChild(cityScriptElement);
}

export function getWechatLoginPath(redirect) {
  const APPId = 'wxb608a3d149e3b38a';
  // const APPId='wx1f7ae02f8d5e238e';
  const state = 'wechat';
  redirect = encodeURIComponent(redirect);
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${
    APPId
    }&redirect_uri=${
    redirect
    }&response_type=code&scope=snsapi_login&state=${
    state
    }#wechat_redirect`;
}
