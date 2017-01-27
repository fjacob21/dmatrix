import React , { Component, PropTypes } from 'react'
import { browserHistory} from 'react-router'
import Navbar from './navbar'

class App extends React.Component{
        constructor(props) {
                super(props);
        }

        componentDidMount(){
                this.context.router.push('/home');
        }

        componentWillUnmount(){
        }

        render(){
                return (
                        <div className='app'>
                                <Navbar prev='' next=''></Navbar>
                                {this.props.children}
                        </div>)
        }
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};
module.exports = App;
