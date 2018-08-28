import React, { Component } from 'react';

class HourCounter extends Component {
	HoursCounterStringGenerator( allSongs ) {
		let totalDuration = allSongs.reduce( ( sum, eachSong ) => {
			return sum + eachSong.Duration;
		}, 0 );
		let hours = ( Math.round( totalDuration / 36000 ) );
		let minutes = ( Math.round( totalDuration / 60 ) % 60 );
		let seconds = ( Math.round( totalDuration % 60 ) );
		let string = ""
		if ( ( hours !== 0 ) && ( minutes !== 0 ) && ( seconds !== 0 ) ) string = hours + " hours and " + minutes + " minutes and " + seconds + " seconds";
		else if ( ( hours !== 0 ) && ( minutes !== 0 ) ) string = hours + " hours and " + minutes + " minutes";
		else if ( ( hours !== 0 ) && ( seconds !== 0 ) ) string = hours + " hours and " + seconds + " seconds";
		else if ( ( minutes !== 0 ) && ( seconds !== 0 ) ) string = minutes + " minutes and " + seconds + " seconds";
		else if ( ( hours !== 0 ) || ( minutes !== 0 ) || ( seconds !== 0 ) ) {
			if ( hours !== 0 ) {
				string = hours + " hours";
			} else if ( minutes !== 0 ) {
				string = minutes + " minutes";
			} else if ( seconds !== 0 ) {
				string = seconds + " seconds";
			}
		} else {
			string = "Press enter to search!"
		}
		return string;
	}

	render() {
		let allSongs = this.props.playlists.reduce( ( songs, eachPlaylist ) => {
			return songs.concat( eachPlaylist.Songs );
		}, [] );

		let hours = this.HoursCounterStringGenerator( allSongs );

		return (
			<div className="Aggregate" style={{gridArea:"Hours"}}>
				<h2>{hours}</h2>
			</div>
		)
	}
}

export default HourCounter
