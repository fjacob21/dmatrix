import React from 'react'
import Pixel from './pixel'
import Service from './service'

var code = `#include <Adafruit_LEDBackpack.h>
Adafruit_BicolorMatrix matrix = Adafruit_BicolorMatrix();

<bitmap>

void displayBitmap(const uint16_t bit[8][8]){
  for (int i=0; i<8; i++)
    for (int j=0; j<8; j++)
      matrix.drawPixel(i, j, bit[j][i]);
}

void setup() {
  matrix.begin();
  displayBitmap(bitmap);
  matrix.writeDisplay();
}`;

class Home extends React.Component {
        constructor(props) {
                super(props);
                var matrix = localStorage.getItem('data');
                if (!matrix) {
                        matrix = new Array();

                        for (var i=0;i<8;i++) {
                                matrix[i]=new Array();
                                for (var j=0;j<8;j++)
                                        matrix[i][j]=0;//(j+i)%4;
                        }
                }
                else {
                        matrix = JSON.parse(matrix);
                }
                var s = new Service();
                s.isActive().then(function (data){this.state.active = data.active; this.setState(this.state);}.bind(this));
                this.state = {color: "#FF0000", matrix: matrix, active: false, service: s, connected: false};
                this.device = null;
                this.service = null;
                this.tx = null;
                this.rx = null;
        }

        copyToClipboard(text) {
                if (window.clipboardData && window.clipboardData.setData) {
                        return clipboardData.setData("Text", text);
                } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                        var textarea = document.createElement("textarea");
                        textarea.textContent = text;
                        textarea.style.position = "fixed";
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                                return document.execCommand("copy");
                        } catch (ex) {
                                console.warn("Copy to clipboard failed.", ex);
                                return false;
                        } finally {
                                document.body.removeChild(textarea);
                        }
                }
        }

        buildBitmap() {
                var result = "const uint16_t bitmap[8][8] = {\n";
                this.state.matrix.map(function (row, i) {
                        result += "{";
                        var matrixRow = row.map(function (item, j) {
                        result += item + ", ";
                        }.bind(this));
                        result += "},\n";
                 }.bind(this));
                result += "};";
                return result;
        }

        onChange(x, y, value){
                this.state.matrix[y][x]=value;
                localStorage.setItem('data', JSON.stringify(this.state.matrix));
                this.setState(this.state);
        }

        onTextChange(event){
                console.debug(event, event.target.value);
        }

        success(data){
                console.debug('Cool', data);
        }

        error(){
                console.debug(':()');
        }

        upload(event){
                 this.state.service.upload(this.buildBitmap()).fail(function (){alert('error')}.bind(this));
        }

        onBLEUpload(event){
                var enc = new TextEncoder("utf-8");
                 var bmp = this.buildBitmap();
                 this.tx.writeValue(enc.encode("!B11:")).then( () => {this.tx.writeValue(enc.encode("!B10;"));});
                 //writeValue(enc.encode("!B10;"));
        }

        onConnect(event){
                navigator.bluetooth.requestDevice({
                  filters: [{
                    name: "Fred's Friendly robot"
                  }],
                  optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
                })
                .then(device => {
                   this.device = device;
                   device.ongattserverdisconnected = this.bluetoothDisconnect.bind(this);
                  return device.gatt.connect();
                })
                .then(server => {
                      console.debug('Getting Services...', server);
                      return server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
                })
                .then(service => {
                      this.service = service;
                      console.debug('Getting Characteristics...', service);
                      return service.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e");
                })
                .then(tx => {
                        console.debug(tx);
                        this.tx = tx;
                        return this.service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
                })
                .then(rx => {
                        console.debug(rx);
                        this.rx = rx;
                        this.state.connected = true;
                        this.setState(this.state);
                })
                .catch(error => { console.log(error); });
        }

        bluetoothDisconnect(){
                console.debug('disconnection');
                this.state.connected = false;
                this.device = null;
                this.setState(this.state);
        }

        onDisconnect(event){
                if (this.device != null)
                        this.device.gatt.disconnect();
        }

        render(){
                var matrix = this.state.matrix.map(function (row, i) {
                        var matrixRow = row.map(function (item, j) {
                        return (
                                <Pixel key={String(i)+String(j)} x={j} y={i} value={item} onChange={this.onChange.bind(this)}/>
                        );
                        }.bind(this));
                        return (
                                <div key={i} className='matrix-row'>
                                {matrixRow}
                                </div>
                        );
                 }.bind(this));
                 var result = this.buildBitmap();
                 var dcode = code.replace('<bitmap>', result);
                 var uploadbt = "";
                 if (this.state.active)
                        uploadbt = <button onClick={this.upload.bind(this)}>Upload</button>;
                var bluetoothbt = "";
                if (this.device == null)
                        bluetoothbt = (<button onClick={this.onConnect.bind(this)}>Connect</button>);
                else
                        bluetoothbt = (<div><button onClick={this.onDisconnect.bind(this)}>Disconnect</button><button onClick={this.onBLEUpload.bind(this)}>Upload BLE</button></div>);

                return (
                        <div className='home'>
                                <div>
                                        <div className='matrix-label'>Matrix</div>
                                        <div className='display-row'>
                                                <div className='matrix'>
                                                {matrix}
                                                </div>
                                                <div className='result-box'>
                                                        <pre className='result'>
                                                                <code className="c+">
                                                                        {result}
                                                                </code>
                                                        </pre>
                                                        {uploadbt}
                                                        {bluetoothbt}
                                                </div>
                                        </div>
                                        <div className='examples-label'>Examples</div>
                                        <div className='examples-row'>
                                                <pre className='drawBitmapCode'>
                                                        <code className="c++">
                                                                {dcode}
                                                        </code>
                                                </pre>
                                        </div>
                                </div>
                        </div>)
        }
}

module.exports = Home;
