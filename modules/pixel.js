import React from 'react'

const blackColor = "#cecac7";
const redColor = "#ff102d";
// const yellowColor = "#ffff31"; //More yellow color!!!!
const yellowColor = "#f78211";
const greenColor = "#8bff2c";
const colors = [blackColor, redColor, yellowColor, greenColor];

class Pixel extends React.Component{


        constructor(props) {
                super(props);
                this.state = {value: this.props.value};
        }

        onClick(event){
                event.preventDefault();
                if (event.altKey && event.ctrlKey)
                        this.state.value = 0;
                else if (event.altKey)
                        this.state.value = 1;
                else if (event.ctrlKey)
                        this.state.value = 2;
                else if (event.shiftKey)
                        this.state.value = 3;
                else
                        this.state.value = (this.state.value+1)%4;
                this.setState(this.state);
                this.props.onChange(this.props.x, this.props.y, this.state.value);
        }

        onEnter(event){
                event.preventDefault();
                if (event.altKey || event.ctrlKey || event.shiftKey) {
                        if (event.altKey && event.ctrlKey)
                                this.state.value = 0;
                        else if (event.altKey)
                                this.state.value = 1;
                        else if (event.ctrlKey)
                                this.state.value = 2;
                        else if (event.shiftKey)
                                this.state.value = 3;
                        this.setState(this.state);
                        this.props.onChange(this.props.x, this.props.y, this.state.value);
                }
        }
        render(){
                const divStyle = {
                        backgroundColor: colors[this.state.value]
                };

                return (
                        <div style={divStyle} className='pixel' onClick={this.onClick.bind(this)} onMouseEnter={this.onEnter.bind(this)}r>

                        </div>)
        }
}

module.exports = Pixel;
