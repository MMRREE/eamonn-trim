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
let backendURL = ""

let startCount = 0;

function SpotifyPlayerStartMusic( uri, context_uri, accessToken ) {
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

			// Ready, get recently played and then start to play based on this song and context
			player.addListener( 'ready', ( { device_id } ) => {
				if ( window.location.href.includes( "localhost" ) ) backendURL = "http://localhost:8888/"
				else if ( window.location.href.includes( "heroku" ) ) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
				else backendURL = "http://" + window.location.hostname + ":8888/"
				GlobalPlayer.DeviceId = device_id
				fetch( backendURL + "spotify/recentlyPlayed", {
						method: "POST",
						headers: { 'content-type': 'application/json' },
						mode: 'cors',
						body: JSON.stringify( { "access_token": token } )
					} )
					.then( response => response.json() )
					.then( rp => {
						if ( rp ) {
							fetch( rp.Song.Context, {
									method: "GET",
									headers: {
										'Content-Type': 'application/json',
										'Authorization': 'Bearer ' + token
									}
								} )
								.then( response => response.json() )
								.then( ret => {
									fetch( 'https://api.spotify.com/v1/me/player/play?device_id=' + GlobalPlayer.DeviceId, {
											method: 'PUT',
											body: JSON.stringify( {
												"context_uri": ret.uri,
												"offset": { "uri": rp.Song.Uri }
											} ),
											headers: {
												'Content-Type': 'application/json',
												'Authorization': 'Bearer ' + token
											},
										} )
										.then( response => {
											if ( response.status === 204 ) {
												GlobalPlayer.Render = true
												GlobalPlayer.FirstStart = true
											}
											return response.json()
										} )
										.then( info => {
											if ( info.error.message === "Non supported context uri" ) {
												GlobalPlayer.PlaybackError = 1
											}
										} )
								} )
							this.props.playerObjectUpdate( GlobalPlayer );
							this.forceUpdate();
						}
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
		// Making sure the first login pauses the player once it has loaded properly
		if ( GlobalPlayer.FirstStart && GlobalPlayer.IsPlaying && startCount > 750 ) {
			GlobalPlayer.PlayerObject.togglePlay()
			GlobalPlayer.FirstStart = false
		} else if ( GlobalPlayer.FirstStart ) startCount += 50

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
							<div>
							<p style={{gridArea:"SongName"}}>{GlobalPlayer.Song.Name}</p>
							</div>
							<div><p style={{gridArea:"Artist"}}>By {GlobalPlayer.Song.Artists}</p></div>


							<div className="Album">

								<p>{GlobalPlayer.Song.Album}</p>

								<img src={GlobalPlayer.Song.AlbumImg} alt={GlobalPlayer.Song.Album}/>
							</div>

							<div className="Repeat">
								<p>{GlobalPlayer.RepeatContext}</p>
								<button onClick={()=>{
									this.repeat()
									}}>
									<img alt="Repeat" src='https://cdn2.iconfinder.com/data/icons/game-center-mixed-icons/512/repeat.png'/>
								</button>
							</div>



							<button className="Previous" style={{gridArea: "Previous"}} onClick={()=>{
									GlobalPlayer.PlayerObject.previousTrack()//.then(() => console.log("Set to previous track!"));
								}}>
								<img alt="Previous Track" style={{transform:"rotate(180deg)"}} src='https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_8-512.png'/>
							</button>


							<button style={{gridArea: "PausePlay"}} onClick={()=>{
									GlobalPlayer.PlayerObject.togglePlay()//.then(()=>console.log("Paused/Played!"));
								}}>
								{GlobalPlayer.IsPlaying
									? <img alt="Pause"  src='https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_4-512.png'/>
								: <img alt="Play"  src='https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_3-512.png'/>
							}
							</button>


							<button className="NextTrack" style={{gridArea: "Next"}} onClick={()=>{
									GlobalPlayer.PlayerObject.nextTrack()//.then(()=>console.log("Set to next track!"));
								}}>
								<img alt="Next Track" src='https://cdn2.iconfinder.com/data/icons/media-and-navigation-buttons-square/512/Button_8-512.png'/>
							</button>

							<div className="Shuffle">
								<p>{GlobalPlayer.Shuffle ? "On" : "Off"}</p>
								<button onClick={()=>{
									this.shuffle()
									}}>
									<img alt="Shuffle" src='https://cdn2.iconfinder.com/data/icons/arrows-set-2/512/17-512.png'/>
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
										// console.log(GlobalPlayer.Song.CurrentPosition/GlobalPlayer.Song.Duration*100)
										this.forceUpdate();
			 						}}
									onMouseUp={(e) =>{
											let val = e.target.value
											GlobalPlayer.PlayerObject.seek(val/100*GlobalPlayer.Song.Duration)
											this.forceUpdate();
										}}
									readOnly="false"
									/>
									<span>{Math.floor((GlobalPlayer.Song.CurrentPosition/GlobalPlayer.Song.Duration)*100*GlobalPlayer.Song.Duration/6000000)}:{('00'+Math.floor((GlobalPlayer.Song.CurrentPosition/GlobalPlayer.Song.Duration)*100*GlobalPlayer.Song.Duration/100000)%60).slice(-2)}</span>
			 				</div>
						</div>
				: GlobalPlayer.PlaybackError === 0
					? <p>Not enough information to display player controls</p>
					: <p>Non supported context uri, select a track from below to start player</p>}
			</div>
		)
	}
}

export { SpotifyPlayer, SpotifyPlayerStartMusic }
