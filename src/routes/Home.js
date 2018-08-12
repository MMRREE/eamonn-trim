import React, { Component } from 'react'
import Layout from './Data/Applications/Components/Layout.js'
import './Stylesheets/Home.css'


class Home extends Component {
	render() {
		return (
			<div className="Home">

				<Layout/>

				<div className="Title">EAMONN TRIM</div>
				<div className="MainLinks">
					<a href={document.location.origin+"/About"}><span className="Link BoldLink">About</span></a>
					<a href={document.location.origin+"/MostRecent"}><span className="Link BoldLink">Most Recent App</span></a>
				</div>
			</div>
		)
	}
}


export default Home;
