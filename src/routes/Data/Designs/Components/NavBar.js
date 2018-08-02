import React, { Component } from 'react';

class NavBar extends Component {
	render() {
		return (
			<span className="NavBar">
				<a className="Link BoldLink" href={document.location.origin+"/Contact"}>Contact</a>
				<a className="Link" href={document.location.origin+"/Designs"}>Designs</a>
				<a className="Link" href={document.location.origin+"/Applications"}>Applications</a>
				<a className="Link" href={document.location.origin}>Home</a>
			</span>
		)
	}
}

export default NavBar;
