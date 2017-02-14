const URL = window.URL || window.webkitURL;
const MyWorker = require('worker-loader!./jpeg-web-worker.js');
const EXIF = require('./exif.js');

class Html5ImgCompress {
  constructor(file, options = {}) {
    const DEFAULTE = Html5ImgCompress.DEFAULTE;

    this.file = file;
    this.options = {};
    this.canvas = document.createElement('canvas');

    for (const key in DEFAULTE) {
      this.options[key] = (options[key] == null) ? DEFAULTE[key] : options[key];
    }

    this.init();
  }

  init() {
    if (URL && File && this.canvas.getContext) {
      this.read();
    } else {
      // 浏览器不支持
      this.options.notSupport();
    }
  }

  read() {
    const self = this;
    const img = new Image();
    const file = this.file;
    const fileURL = URL.createObjectURL(file);
    const canvas = this.canvas;

    if (self.options.before(file) === false) return;

    img.src = fileURL;

    img.onload = () => {
      const handler = (orientation) => {
        const quality = self.options.quality;
        const size = self.getSize(img, orientation);
        canvas.width = size.width;
        canvas.height = size.height;

        const ctx = canvas.getContext('2d');
        switch (orientation) { // 根据方向在画布不同的位置画图
          case 3:
            ctx.rotate(180 * Math.PI / 180);
            ctx.drawImage(img, -canvas.width, -canvas.height, canvas.width, canvas.height);
            break;
          case 6:
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(img, 0, -canvas.width, canvas.height, canvas.width);
            break;
          case 8:
            ctx.rotate(270 * Math.PI / 180);
            ctx.drawImage(img, -canvas.height, 0, canvas.height, canvas.width);
            break;
          default:
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const worker = new MyWorker();

        worker.postMessage({
          image: imageData,
          quality,
        });

        worker.onmessage = (e) => {
          const blob = new Blob([e.data.data], { type: 'image/jpeg' });

          const reader = new FileReader();
          reader.onload = () => {
            self.handler('done', fileURL, reader.result, { ...size, size: blob.size });
            worker.terminate();
          };
          reader.readAsDataURL(blob);
        };

        worker.onerror = () => {
          self.handler('fail', fileURL);
          worker.terminate();
        };
      };

      EXIF.getData(img, function () {
        handler(EXIF.getTag(this, 'Orientation'));
      });
    };

    img.onerror = () => {
      self.handler('fail', fileURL);
    };
  }

  handler(action, fileURL, base64, size) {
    URL.revokeObjectURL(fileURL);

    this.options[action](this.file, base64, size);
    this.options.complate(this.file);
  }

  getSize(img, orientation) {
    const options = this.options;
    const mW = options.maxWidth;
    const mH = options.maxHeight;
    let w = img.width;
    let h = img.height;

    if (~'68'.indexOf(orientation)) { // 90，270度则高宽互换
      w = img.height;
      h = img.width;
    }

    const scale = w / h;

    if (mW && mH) {
      if (scale >= mW / mH) {
        if (w > mW) {
          h = mW / scale;
          w = mW;
        }
      } else if (h > mH) {
        w = mH * scale;
        h = mH;
      }
    } else if (mW) {
      if (mW < w) {
        h = mW / scale;
        w = mW;
      }
    } else if (mH) {
      if (mH < h) {
        w = mH * scale;
        h = mH;
      }
    }

    return { width: w, height: h };
  }
}

// 默认参数
Html5ImgCompress.DEFAULTE = {
  maxWidth: 1000,
  maxHeight: 1000,
  quality: 60,
  before: () => {},
  done: () => {},
  fail: () => {},
  complate: () => {},
  notSupport: () => {},
};

export default (file, option) => new Html5ImgCompress(file, option);
