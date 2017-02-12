import React , { Component, PropTypes } from 'react'
import { browserHistory} from 'react-router'
import About from './about'

class Navbar extends React.Component{
        constructor(props) {
                super(props);
                this.state = {showAbout:false};
        }

        componentDidMount(){
        }

        componentWillUnmount(){
        }

        onAbout(event){
                event.preventDefault();
                this.state.showAbout = true;
                this.setState(this.state);
        }

        render(){
                return (
                        <div className='navbar'>
                                <img className='logo' src='res/drawables/datamatrix.png' />
                                <div className='profile-icon material-icons' onClick={this.onAbout.bind(this)}>face</div>
                                <About show={this.state.showAbout} />
                        </div>)
        }
}

Navbar.contextTypes = {
  router: PropTypes.object.isRequired
};
module.exports = Navbar;
