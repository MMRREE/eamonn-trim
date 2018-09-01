import React, { Component } from 'react';

class UserProfile extends Component {
	render() {
		return (
			<div className="UserProfile" style={{gridArea:"UserProfile"}}>

				<p className="Name">{this.props.UserData.Name}</p>

				<img className="Picture" src={this.props.UserData.Img} alt="Users"/>

				<p className="Premium" >Premium: {this.props.UserData.Type === "premium" ? "True" : "False"}</p>

				<p className="Country">{this.props.UserData.Country} - {this.props.UserData.Birthday}</p>

			</div>
		);
	}
}

export default UserProfile
