import React, { Component } from 'react';

class PlaylistCounter extends Component {
	render() {
		let string = this.props.playlists.length + " Playlists"
		return (
			<div className="Aggregate" style={{gridArea:"PlaylistList"}}>
				<h2>{string}</h2>
			</div>
		);
	}
}

export default PlaylistCounter
