import React, { Component } from 'react';

let GlobalPlayer = {
	Name: "",
	PlayerObject: "",
	DeviceId: "",
	Volume: "",
	IsPlaying: false,
	Shuffle: false,
	RepeatContext: "Off",
	NextRepeatContext: "Context",
	PlaybackError: 0,
	Song: {
		Name: 'Roses',
		Artists: 'wüsh',
		Album: 'For Her',
		AlbumImg: 'https://i.scdn.co/image/fb095962893f70496c6ee315e292f36f82e61ee8',
		Duration: 95374,
		CurrentPosition: 0,
		Uri: 'spotify:track:3rDtYwyfZNfTfxjyivntg5'
	}
}

let PlayBackIcons = []

function SpotifyPlayerStartMusic( uri, context_uri, accessToken ) {
	if ( uri ) {
		fetch( 'https://api.spotify.com/v1/me/player/play?device_id=' + GlobalPlayer.DeviceId, {
				method: 'PUT',
				body: JSON.stringify( {
					"context_uri": context_uri,
					"offset": { "uri": uri }
				} ),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + accessToken
				},
			} )
			.then( response => {
				GlobalPlayer.Render = true
				GlobalPlayer.IsPlaying = true
			} )
	} else {
		fetch( 'https://api.spotify.com/v1/me/player/play?device_id=' + GlobalPlayer.DeviceId, {
				method: 'PUT',
				body: JSON.stringify( {
					"context_uri": context_uri
				} ),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + accessToken
				},
			} )
			.then( response => {
				GlobalPlayer.Render = true
				GlobalPlayer.IsPlaying = true
			} )
	}
}

class SpotifyPlayer extends Component {
	async waitForSpotifyWebPlaybackSDKToLoad() {
		return new Promise( resolve => {
			if ( window.Spotify ) {
				resolve( window.Spotify );
			} else {
				window.onSpotifyWebPlaybackSDKReady = () => {
					resolve( window.Spotify );
				};
			}
		} );
	};

	componentDidMount() {
		( async () => {
			//Img source locations for the various icons to be displayed within the player
			PlayBackIcons[ 'Pause' ] = "https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_4-512.png"
			PlayBackIcons[ 'Play' ] = "https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_3-512.png"
			PlayBackIcons[ 'Previous' ] = "https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_8-512.png"
			PlayBackIcons[ 'Next' ] = "https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_8-512.png"
			PlayBackIcons[ 'Shuffle' ] = "https://cdn2.iconfinder.com/data/icons/arrows-set-2/512/17-512.png"
			PlayBackIcons[ 'Repeat' ] = "https://cdn2.iconfinder.com/data/icons/arrows-set-2/512/14-512.png"


			const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();
			const token = this.props.accessToken
			const player = new Player( {
				name: "Eamonn's web sdk testing",
				getOAuthToken: cb => { cb( token ); },
				volume: 0.5
			} );

			// Error handling
			player.addListener( 'initialization_error', ( { message } ) => { console.error( message ); } );
			player.addListener( 'authentication_error', ( { message } ) => { console.error( message ); } );
			player.addListener( 'account_error', ( { message } ) => { console.error( message ); } );
			player.addListener( 'playback_error', ( { message } ) => { console.error( message ); } );

			// Playback status updates the local data
			player.addListener( 'player_state_changed', state => {
				if ( state !== null ) {
					GlobalPlayer.Render = true
					GlobalPlayer.Song.Name = state.track_window.current_track.name
					GlobalPlayer.Song.Duration = state.duration
					GlobalPlayer.Song.Artists = state.track_window.current_track.artists[ 0 ].name
					GlobalPlayer.Song.Album = state.track_window.current_track.album.name
					GlobalPlayer.Song.AlbumImg = state.track_window.current_track.album.images[ 0 ].url
					GlobalPlayer.Song.Uri = state.track_window.current_track.uri
					GlobalPlayer.Song.CurrentPosition = state.position
					GlobalPlayer.IsPlaying = !state.paused;
					if ( state.repeat_mode === 0 ) {
						GlobalPlayer.RepeatContext = "Off"
						GlobalPlayer.NextRepeatContext = "Context"
					} else if ( state.repeat_mode === 1 ) {
						GlobalPlayer.RepeatContext = "Context"
						GlobalPlayer.NextRepeatContext = "Track"
					} else if ( state.repeat_mode === 2 ) {
						GlobalPlayer.RepeatContext = "Track"
						GlobalPlayer.NextRepeatContext = "Off"
					}

					console.log( "state update:", GlobalPlayer )
					this.props.playerObjectUpdate( GlobalPlayer );
					this.forceUpdate();
				}
			} );

			// Ready, transfer song playback
			player.addListener( 'ready', ( { device_id } ) => {
				GlobalPlayer.DeviceId = device_id
				let backendURL = ""
				if ( window.location.href.includes( "localhost" ) ) backendURL = "http://localhost:8888/"
				else if ( window.location.href.includes( "heroku" ) ) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
				else backendURL = "http://" + window.location.hostname + ":8888/"
				fetch( backendURL + "spotify/transferPlay", {
						method: "POST",
						body: JSON.stringify( {
							"device_id": device_id,
							"access_token": token
						} ),
						headers: { 'Content-Type': 'application/json' },
						mode: 'cors'
					} )
					.then( response => {
						if ( response.status === 204 ) GlobalPlayer.Render = true
						console.log( response )
					} )
			} );

			// Not Ready
			player.addListener( 'not_ready', ( { device_id } ) => {
				console.error( 'Device ID has gone offline', device_id );
			} );

			// Event errors to listen for
			player.on( 'initialization_error', ( { message } ) => {
				console.error( 'Failed to initialize', message );
			} );

			player.on( 'authentication_error', ( { message } ) => {
				console.error( 'Failed to authenticate', message );
			} );

			player.on( 'account_error', ( { message } ) => {
				console.error( 'Failed to validate Spotify account', message );
			} );

			player.on( 'playback_error', ( { message } ) => {
				console.error( 'Failed to perform playback', message );
			} );


			// Connect to the player!
			player.connect()
				.then( () => console.log( "Connected to the sdk server" ) );

			GlobalPlayer.PlayerObject = player
			GlobalPlayer.Name = GlobalPlayer.PlayerObject._options.name
			GlobalPlayer.DeviceId = GlobalPlayer.PlayerObject._options.id
			GlobalPlayer.Volume = GlobalPlayer.PlayerObject._options.volume
			this.props.playerObjectUpdate( GlobalPlayer );
			this.setState( { localTime: 0 } )
			this.interval = setInterval( () => this.tick(), 50 )
		} )();
	}

	tick() {

		// If playing, keep a local counter in order to make sure the timer ticks along
		if ( GlobalPlayer.IsPlaying === true ) {
			GlobalPlayer.Song.CurrentPosition += 50;
			this.setState( { localTime: this.state.localTime + 50 } );
			this.forceUpdate();
		}

		// If the player has been going for 10 seconds and is still playing, sync up to the server to make sure the timings are right
		if ( this.state.localTime % 10000 === 0 && GlobalPlayer.IsPlaying ) fetch( 'https://api.spotify.com/v1/me/player/currently-playing', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.props.accessToken
				}
			} )
			.then( response => response.json() )
			.then( data => {
				if ( data.progress_ms !== GlobalPlayer.Song.CurrentPosition && data.progress_ms ) {
					GlobalPlayer.Song.CurrentPosition = data.progress_ms;
					this.setState( { localTime: ( data.progress_ms - data.progress_ms % 50 ) } )
				}


			} );

	}

	// Cleanup code
	componentWillUnmount() {
		clearInterval( this.interval );
	}

	shuffle() {
		fetch( 'https://api.spotify.com/v1/me/player/shuffle?state=' + !GlobalPlayer.Shuffle, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.props.accessToken
				},
			} )
			.then( response => {
				GlobalPlayer.Shuffle = !GlobalPlayer.Shuffle
			} )
	}

	repeat() {
		fetch( 'https://api.spotify.com/v1/me/player/repeat?state=' + GlobalPlayer.NextRepeatContext.toLowerCase(), {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + this.props.accessToken
				},
			} )
			.then( response => {
				GlobalPlayer.RepeatContext = GlobalPlayer.NextRepeatContext
				if ( GlobalPlayer.RepeatContext === "Off" ) GlobalPlayer.NextRepeatContext = "Context"
				else if ( GlobalPlayer.RepeatContext === "Context" ) GlobalPlayer.NextRepeatContext = "Track"
				else if ( GlobalPlayer.RepeatContext === "Track" ) GlobalPlayer.NextRepeatContext = "Off"
			} )

	}

	render() {
		return (
			<div className="SpotifyPlayer">
				{GlobalPlayer.Render ?
						<div className="PlayerDisplay">

							<p style={{gridArea:"SongName"}}>{GlobalPlayer.Song.Name}</p>

							<p style={{gridArea:"Artist"}}>By {GlobalPlayer.Song.Artists}</p>

							<img className="AlbumImg" style={{gridArea:"AlbumImg"}} src={GlobalPlayer.Song.AlbumImg} alt={GlobalPlayer.Song.Album}/>

							<p style={{gridArea:"AlbumName"}}>{GlobalPlayer.Song.Album}</p>

							<div className="Repeat">
								<p>{GlobalPlayer.RepeatContext}</p>
								<button onClick={()=>{
									this.repeat()
									}}>
									<img alt="Repeat" src={PlayBackIcons['Repeat']}/>
								</button>
							</div>

							<button className="Previous" style={{gridArea: "Previous"}} onClick={()=>{
									GlobalPlayer.PlayerObject.previousTrack()
								}}>
								<img alt="Previous Track" style={{transform:"rotate(180deg)"}} src={PlayBackIcons['Previous']}/>
							</button>

							<button style={{gridArea: "PausePlay"}} onClick={()=>{
									GlobalPlayer.PlayerObject.togglePlay()
								}}>
								{GlobalPlayer.IsPlaying
									? <img alt="Pause"  src={PlayBackIcons['Pause']}/>
									: <img alt="Play"  src={PlayBackIcons['Play']}/>
								}
							</button>


							<button className="NextTrack" style={{gridArea: "Next"}} onClick={()=>{
									GlobalPlayer.PlayerObject.nextTrack()
								}}>
								<img alt="Next Track" src={PlayBackIcons['Next']}/>
							</button>

							<div className="Shuffle">
								<p>{GlobalPlayer.Shuffle ? "On" : "Off"}</p>
								<button onClick={()=>{
									this.shuffle()
									}}>
									<img alt="Shuffle" src={PlayBackIcons['Shuffle']}/>
								</button>
							</div>

							<div className="Volume">
								<input type="range" min="0" max="100" defaultValue="50" step="1" onInput={(e) => {
										let val = e.target.value;
										GlobalPlayer.PlayerObject.setVolume(val/100).then(()=>{GlobalPlayer.Volume = val/100;});
									}}/>
								<span>{Math.floor(GlobalPlayer.Volume*100)}%</span>
							</div>

							<div className="Timebar">
								<input type="range" min="0" max="100" step="0.01"
									value={GlobalPlayer.Song.CurrentPosition/GlobalPlayer.Song.Duration*100}
									onInput={(e)=>{
										GlobalPlayer.Song.CurrentPosition = GlobalPlayer.Song.Duration*e.target.value/100;
										this.forceUpdate();
			 						}}
									onMouseUp={(e) =>{
											let val = e.target.value
											GlobalPlayer.PlayerObject.seek(val/100*GlobalPlayer.Song.Duration)
											this.forceUpdate();
										}}
									readOnly="false"
								/>
									<span>
										{Math.floor((GlobalPlayer.Song.CurrentPosition/GlobalPlayer.Song.Duration)*100*GlobalPlayer.Song.Duration/6000000)}:{('00'+Math.floor((GlobalPlayer.Song.CurrentPosition/GlobalPlayer.Song.Duration)*100*GlobalPlayer.Song.Duration/100000)%60).slice(-2)}
									</span>
			 				</div>
						</div>
				: GlobalPlayer.PlaybackError === 0
					? <p>Please select a song from below to start playback</p>
					: <p>Non supported context uri, select a track from below to start player</p>}
			</div>
		)
	}
}

export { SpotifyPlayer, SpotifyPlayerStartMusic }
