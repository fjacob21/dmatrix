import React from 'react'
import Pixel from './pixel'
import Service from './service'

class Home extends React.Component{
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
                s.isActive().then(function (){this.state.active = true; this.setState(this.state);}.bind(this));
                this.state = {color: "#FF0000", matrix: matrix, active: false, service: s};

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
                 var uploadbt = "";
                 if (this.state.active)
                        uploadbt = <button onClick={this.upload.bind(this)}>Upload</button>;
                return (
                        <div className='home'>
                                <div className='matrix'>
                                {matrix}
                                </div>
                                <textarea className='result' rows="4" cols="50" value={result} onChange={this.onTextChange.bind(this)}/>
                                {uploadbt}
                        </div>)
        }
}

module.exports = Home;
