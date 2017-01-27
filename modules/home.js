import React from 'react'
import Pixel from './pixel'

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

                this.state = {color: "#FF0000", matrix: matrix};
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
                var result = "const uint16_t bitmap[8][8] = {\n";
                this.state.matrix.map(function (row, i) {
                        result += "{";
                        var matrixRow = row.map(function (item, j) {
                        result += item + ", ";
                        }.bind(this));
                        result += "},\n";
                 }.bind(this));
                 result += "};";
                 var data = {bitmap: result};
                 $.ajax({
                 type: 'POST',
                 url: "/upload" ,
                 data: JSON.stringify (data),
                 success: this.success.bind(this),
                 error: this.error.bind(this),
                 contentType: "application/json",
                 dataType: 'json'
                 });
        }

        render(){
                var result = "const uint16_t bitmap[8][8] = {\n";
                var matrix = this.state.matrix.map(function (row, i) {
                        result += "{";
                        var matrixRow = row.map(function (item, j) {
                        result += item + ", ";
                        return (
                                <Pixel key={String(i)+String(j)} x={j} y={i} value={item} onChange={this.onChange.bind(this)}/>
                        );
                        }.bind(this));
                        result += "},\n";
                        return (
                                <div key={i} className='matrix-row'>
                                {matrixRow}
                                </div>
                        );
                 }.bind(this));
                 result += "};";
                return (
                        <div className='home'>
                                <div className='matrix'>
                                {matrix}
                                </div>
                                <textarea className='result' rows="4" cols="50" value={result} onChange={this.onTextChange.bind(this)}/>
                                <button onClick={this.upload.bind(this)}>Upload</button>
                        </div>)
        }
}

module.exports = Home;
