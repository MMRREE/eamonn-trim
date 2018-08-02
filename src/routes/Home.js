import React, { Component } from 'react'
import Layout from './Data/Designs/Components/Layout.js'


class Home extends Component {
	render() {
		return (
			<div className="Home">

				<Layout/>

				<div className="Title">EAMONN TRIM</div>
				<div className="MainLinks">
					<a href={document.location.origin+"/About"}><span className="Link BoldLink">About</span></a>
					<a href={document.location.origin+"/MostRecent"}><span className="Link BoldLink">Most Recent</span></a>
					{//<a href={location.origin"/random"}><span className="Link BoldLink">Random</span></a>
				}
				</div>
			</div>
		)
	}
}


export default Home;
