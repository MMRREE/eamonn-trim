import React, { Component } from 'react';

class UserProfile extends Component {
	render() {
		return (
			<div className="UserProfile" style={{gridArea:"UserProfile"}}>

				<div style={{background:"rgba(10,10,10,0.4)"}}>

					<p>{this.props.UserData.Name}</p>

					<img style={{borderRadius:"50%"}} src={this.props.UserData.Img} alt="Users"/>

					<p>Premium: {this.props.UserData.Type === "premium" ? "True" : "False"}</p>

					<p>{this.props.UserData.Country} - {this.props.UserData.Birthday}</p>

				</div>

			</div>
		);
	}
}

export default UserProfile
