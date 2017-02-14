import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import io from 'socket.io-client';
import { Button } from 'antd';

const styles = {
  firstScreen: {
    height: '700px',
    position: 'relative',
    color: '#fff',
    paddingTop: 120,
  },
  mainWrap: {
    width: '1055px',
    margin: '0 auto',
    overflow: 'hidden',
    marginTop: '78px',
  },
  qrcode: {
    textAlign: 'center',
    padding: '64px 82px 0 82px',
    width: '416px',
    height: '456px',
    background: '#fff',
    float: 'left',
  },
  QRcodeItem: {
    width: '220px',
    height: '220px',
    margin: '0 auto',
  },
  tips: {
    fontSize: '22px',
    padding: '35px 0 25px 0',
    color: '#212121',
  },
  tipsDetail: {
    fontSize: '14px',
    width: '200px',
    margin: '0 auto',
    color: '#757474',
  },
  descriptionWrap: {
    width: '480px',
    color: '#fff',
    float: 'right',
  },
  titleItem: {
    width: '100%',
    height: '100px',
    borderBottom: '1px solid #fff',
    textAlign: 'center',
    marginTop: '65px',
  },
  title: {
    width: '100%',
    height: '100%',
  },
  startTitle: {
    fontSize: '40px',
  },
  subTitle: {
    fontSize: '30px',
  },
  canItem: {
    padding: '40px 0 30px 0',
    fontSize: '18px',
  },
  serviceItem: {
    fontSize: '18px',
    paddingBottom: '30px',
  },
  btnItem: {
    width: '206px',
    height: '55px',
    textAlign: 'center',
    lineHeight: '55px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '5px',
    border: '1px solid rgba(255,255,255,.5)',
    display: 'inline-block',
  },
  uploadItem: {
    fontSize: '22px',
    color: '#fff',
  },
  iconItem: {
    fontSize: '22px',
    marginRight: '15px',
    color: '#fff',
  },
  btnItemAndroid: {
    width: '206px',
    height: '55px',
    textAlign: 'center',
    lineHeight: '55px',
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '5px',
    border: '1px solid rgba(255,255,255, 0.5)',
    display: 'inline-block',
  },
  uploadItemAndroid: {
    fontSize: '22px',
    color: 'rgba(255,255,255,0.2)',
  },
  iconItemAndroid: {
    fontSize: '22px',
    marginRight: '15px',
    color: 'rgba(255,255,255,0.2)',
  },
};

let socket = '';

export default class ScanQRCode extends Component {
  componentWillMount() {
    window.scrollTo(0, 0);

    this.socketInit();
  }

  socketInit() {
    socket = '';
    socket = io('', { reconnection: false });

    socket.on('connect', () => {
      socket.emit('getToken', {
        type: 'getToken',
      });
    });

    socket.on('getToken', (message) => {
      //
    });

    socket.on('result', (message) => {
      socket.disconnect();
    });
  }

  componentWillUnMount() {
    socket.disconnect();
  }

  refreshCode() {
    this.socketInit();
  }

  render() {
    return (
      <div style={styles.firstScreen}>
        <div style={styles.mainWrap}>
          <div style={styles.qrcode}>
            <div style={styles.QRcodeItem}>
              <QRCode
                value="this is test" size={220} bgColor="#ffffff"
                fgColor="#000000" level="H"
              />
            </div>
            <p style={styles.tips}>扫描二维码登录</p>
            <Button onClick={() => this.refreshCode()}>刷新二维码</Button>
          </div>
        </div>
      </div>
    );
  }
}
