import React, { Component } from 'react';
import NavBar from './NavBar.js'

class Layout extends Component{
	render() {
		return (
			<div className="Layout">
				<div className="Background" style={{backgroundImage:"URL(/Images/HomeBackground.jpg)"}}/>
				<img className="Logo" alt="logo" src="/Images/Logo.png"/>
				<span className="Copyright">© Eamonn Trim 2018</span>
				<NavBar/>
			</div>
		)
	}
}

export default Layout;
