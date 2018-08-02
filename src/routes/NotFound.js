import React, { Component } from 'react'
import Layout from './Data/Designs/Components/Layout.js'


class NotFound extends Component {
	render() {
		return (
			<div className="NotFound">
				<Layout/>
				<div className="ErrorMessage">
						<div>Error 404:</div>
						<div>Page Not Found</div>
						<a className="Link" href={document.location.origin}>Click here to go home</a>
				</div>
			</div>
		)
	}
}


export default NotFound;
