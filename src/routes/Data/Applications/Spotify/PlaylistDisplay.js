import React, { Component } from 'react';
import { SpotifyPlayerStartMusic } from './SpotifyPlayer.js'


class PlaylistDisplay extends Component {
	render() {
		let playlist = this.props.playlist;
		return (
			<div className="Playlist" style={{gridArea:"Playlists"+this.props.index, backgroundImage:"url("+playlist.ImageUrl+")", backgroundSize:"cover"}}>
				<p>{playlist.Name}</p>
				<div className="SongArea">
					<div>
						<ul>
							{playlist.Songs.map(song => {
								return(
									<div key={playlist.Songs.indexOf(song)}>
										<hr style={{margin:"0"}}/>
										<button onClick={() =>{
											SpotifyPlayerStartMusic(song.Uri ? null : song.Uri, playlist.ContextUri, this.props.token);
										}} className="songButton">{song.Name}</button>
									</div>
								)
							})}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

export default PlaylistDisplay
