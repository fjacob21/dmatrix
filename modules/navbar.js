import React , { Component, PropTypes } from 'react'
import { browserHistory} from 'react-router'

class Navbar extends React.Component{
        constructor(props) {
                super(props);
                this.state = {color: "#FF0000"};
        }

        componentDidMount(){
        }

        componentWillUnmount(){
        }

        onAbout(event){
                event.preventDefault();
                this.context.router.push("/about")
        }

        render(){
                return (
                        <div className='navbar'>
                                <img className='logo' src='res/drawables/mididec.png' />
                                <div className='profile-icon material-icons' onClick={this.onAbout.bind(this)}>face</div>
                        </div>)
        }
}

Navbar.contextTypes = {
  router: PropTypes.object.isRequired
};
module.exports = Navbar;
