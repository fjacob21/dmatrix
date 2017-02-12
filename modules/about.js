import React from 'react'

export default class About extends React.Component{

        constructor(props) {
                super(props);
		this.hideOnOuterClick = this.hideOnOuterClick.bind(this);
		var opacity = 0;
		if(this.props.show)
			opacity = 1;
		this.state = {
		      show: this.props.show,
		      opacity: opacity
		}
        }

	componentWillReceiveProps(props) {
		var opacity = 0;
		this.setState({
		      show: props.show,
		      opacity: opacity
	      	}, ()=>{setTimeout(()=>{
		      this.state.opacity = 1;
		      this.setState(this.state);
	      },10)});

  	}

	hideOnOuterClick(event) {
		this.state.show = false;
		this.state.opacity = 0;
		this.setState(this.state);
	}

	render(){
		if(!this.state.show) return null;
		var style = {opacity:this.state.opacity};
                return (
                        <div className='about' style={style} onClick={this.hideOnOuterClick} data-modal="true">
				<div className='container'>
				<h1>About</h1>
				<table>
				    <tbody>
				    <tr style={{height:'2px'}}><th style={{backgroundColor:'red'}}></th><th style={{backgroundColor:'orange'}}></th><th style={{backgroundColor:'green'}}></th><th style={{backgroundColor:'purple'}}></th></tr>
				    <tr><th>Frederic Jacob Eng. </th><th>| Hacker  </th><th>| <a href='https://github.com/fjacob21/dmatrix'>GitHub </a></th><th>|🐎</th></tr>
				    </tbody>
				</table>
				<br/>
				<span className="copyright">&copy;Frederic Jacob Eng.</span>
				</div>
                        </div>)
        }
}
