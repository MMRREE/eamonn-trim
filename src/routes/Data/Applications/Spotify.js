// NPM stuff
import React, { Component } from 'react'
import queryString from 'query-string'

// App required js
import { SpotifyPlayer } from './Spotify/SpotifyPlayer.js'
import PlaylistDisplay from './Spotify/PlaylistDisplay.js'
import UserProfile from './Spotify/UserProfile.js'
import Filter from './Spotify/Filter.js'
import HourCounter from './Spotify/HourCounter.js'
import PlaylistCounter from './Spotify/PlaylistCounter.js'
import NavBar from './Components/NavBar.js'

// Stylesheet
import './Spotify.css'

let client_id = '5a9c856a23c24627a23d5a0c06b4aec7'
let redirect_uri = ""
let scopes = 'user-library-read user-library-modify playlist-read-private playlist-modify-public playlist-modify-private playlist-read-collaborative user-read-recently-played user-top-read user-read-private user-read-email user-read-birthdate streaming user-modify-playback-state user-read-currently-playing user-read-playback-state user-follow-modify user-follow-read app-remote-control'
let backendURL = ""
var typingTimer

class SpotifyApp extends Component {
	constructor() {
		super();

		// let templatePlaylist = {
		// 	Name: '',
		// 	PlaylistImg: '',
		// 	ContextUri: '',
		// 	Songs: {
		// 		template: {
		// 			Name: '',
		// 			Duration: '',
		// 			Uri: '',
		// 			ExternalUrl: ''
		// 		}
		// 	}
		// }

		this.state = {
			FilterString: '',
			ServerData: {
				UserName: '',
			},
			PlayerInfo: {
				PlayerObject: '',
				DeviceId: '',
				Volume: '',
				Song: {
					Name: '',
					Artists: '',
					Album: '',
					AlbumImg: '',
					Duration: '',
					Uri: ''
				}
			}
		}
	}

	componentDidMount() {
		if ( window.location.href.includes( "localhost" ) ) backendURL = "http://localhost:8888/"
		else if ( window.location.href.includes( "heroku" ) ) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
		else backendURL = "http://" + window.location.hostname + ":8888/"
		console.log( backendURL )
		redirect_uri = document.location.origin + '/Applications/Spotify/'
		console.log( redirect_uri )

		if ( queryString.parse( window.location.search )
			.code ) {
			fetch(
					backendURL + "spotify/token", {
						method: "POST",
						body: JSON.stringify( {
							"code": queryString.parse( window.location.search )
								.code,
							"grant_type": 'authorization_code',
							"redirect_uri": redirect_uri
						} ),
						headers: { 'Content-Type': 'application/json' },
						mode: 'cors'
					}
				)
				.then( response => response.json() )
				.then( data => {
					console.log( data )
					if ( data.error === "invalid_grant" ) {
						this.login()
							.then( url => {
								window.location.href = url
							} )
					}
					this.setUpState( data.AccessToken, data.RefreshToken )
					this.interval = setInterval( () => this.tick(), 1000 )
				} )
		}

		//script for running for the wed playback SDK
		const script = document.createElement( "script" );
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;
		document.body.appendChild( script );
		this.setState( {
			count: 0,
			localTime: 0
		} )
	}

	tick() {
		this.setState( { localTime: this.state.localTime + 1 } )
		// console.log(this.state.localTime)
		if ( this.state.localTime >= 3600 ) {

			fetch(
					backendURL + 'spotify/token', {
						method: "POST",
						body: JSON.stringify( {
							"grant_type": "refresh_token",
							"refresh_token": this.state.RefreshToken
						} ),
						headers: { 'content-type': 'application/json' },
						mode: 'cors'
					}
				)
				.then( response => response.json() )
				.then( data => {
					if ( data.RefreshToken ) {
						// console.log("new RT", data.RefreshToken)
						this.fetchAppData( data.AccessToken, data.RefreshToken )
					} else { this.fetchAppData( data.AccessToken, this.state.RefreshToken ) }
					this.setState( { localTime: 0 } )
				} )
		}
	}

	componentWillUnmount() {
		clearInterval( this.interval )
	}

	setUpState( accessToken = null, refreshToken = null ) {
		if ( accessToken ) {
			fetch( backendURL + 'spotify/playlistData', {
					method: "POST",
					headers: { 'content-type': 'application/json' },
					mode: 'cors',
					body: JSON.stringify( { "access_token": accessToken } )
				} )
				.then( response => response.json() )
				.then( data => {
					this.setState( {
						ServerData: data,
						AccessToken: accessToken
					} )
					this.state.ServerData && this.state.ServerData.User &&
						this.state.ServerData.User.Name && this.state.ServerData.Playlists ? this.setState( { "UserPlaylists": this.state.ServerData.Playlists } ) : this.Nada()
					console.log( this.state )
				} )
		}
	}

	login( callback ) {
		let url_login = 'https://accounts.spotify.com/en/authorize?' +
			queryString.stringify( {
				response_type: 'code',
				client_id: client_id,
				scope: scopes,
				redirect_uri: redirect_uri
			} )
		if ( callback ) {
			return callback( url_login );
		} else {
			return new Promise( ( resolve ) => {
				resolve( url_login );
			} );
		}
	}

	Nada() {

	}

	render() {
		let count = 0;
		let filteredPlaylists = this.state.ServerData && this.state.ServerData.Playlists ? this.state.ServerData.Playlists.filter( Playlist => {
			let filter = this.state.FilterString.toLowerCase()

			let matchesPlaylist = Playlist.Name.toLowerCase()
				.includes( filter )

			let matchesTrack = Playlist.Songs.find( Song => Song.Name.toLowerCase()
				.includes( filter ) )

			return matchesPlaylist || matchesTrack
		} ) : [];

		let filteredFavArtists = this.state.ServerData && this.state.ServerData.FavArtists ? this.state.ServerData.FavArtists.filter( Playlist => {
			let filter = this.state.FilterString.toLowerCase()

			let matchesPlaylist = Playlist.Name.toLowerCase()
				.includes( filter )

			let matchesTrack = Playlist.Songs.find( Song => Song.Name.toLowerCase()
				.includes( filter ) )

			return matchesPlaylist || matchesTrack
		} ) : []

		let playlistToRender = this.state.SearchAlbums ? this.state.SearchAlbums : filteredPlaylists


		playlistToRender = this.state.FavoritesClicked ? filteredFavArtists : playlistToRender

		let title = this.state.ServerData && this.state.ServerData.User && this.state.ServerData.User.Name && this.state.ServerData.Playlists ? this.state.ServerData.User.Name + "'s playList" : "";
		title ? document.title = title : document.title = "Spotify Playlists"

		return (
			<div className="Spotify">
				{this.state.ServerData.Playlists ?
					// if signed in show the whole applicaiton
					<div className="Display">
						<NavBar style={{gridArea:"NavBar"}}/>
						{/*<h1 className="Header">{title}</h1>*/}
						<UserProfile UserData={this.state.ServerData.User}/>
						<SpotifyPlayer className="Player" playerObjectUpdate={player =>
									this.setState({PlayerInfo: player})
							} accessToken={this.state.AccessToken}/>
						<PlaylistCounter playlists={playlistToRender}/>
						{!this.state.FavoritesClicked ? <HourCounter playlists={playlistToRender}/> : ""}
						<input type="button" value="Favorites" className="FavoriteButton" style={{gridArea:"FavoriteButton"}} onClick={()=>{
							// console.log("Favorites")
							this.setState({"FavoritesClicked": true})
						}}/>
						<input type="button" value="Playlists" className="PlaylistsButton" style={{gridArea:"PlaylistsButton"}} onClick={()=>{
							// console.log("Playlists")
							this.setState({"FavoritesClicked": false})
						}}/>
						<Filter onFilterChange={text =>{
											this.setState({FilterString: text})
											clearTimeout(typingTimer)
											typingTimer = setTimeout(()=>{
												if(filteredPlaylists.length === 0 & text !== ""){
													fetch(backendURL + 'spotify/AlbumSearch',{
														method: "POST",
														headers: { 'content-type': 'application/json' },
														mode: 'cors',
														body: JSON.stringify( {
															"access_token": this.state.AccessToken,
															"search": text
													 } )
													}).then(response => response.json()).then(data=>{
														console.log(data)
														this.setState({"SearchAlbums": data})
													})}
												else{
													playlistToRender = this.state.UserPlaylists
													this.setState({"SearchAlbums": null})
												}
											}, 750)
											if(filteredPlaylists.length > 0) this.setState({"SearchAlbums":null})
										}}
										onDown={(text)=>{
											clearTimeout(typingTimer)
										}}
									onEnter={(text)=>{
										if(playlistToRender.length === 0) {fetch(backendURL + 'spotify/AlbumSearch',{
												method: "POST",
												headers: { 'content-type': 'application/json' },
												mode: 'cors',
												body: JSON.stringify( {
													"access_token": this.state.AccessToken,
													"search": text
											 } )
											}).then(response => response.json()).then(data=>{
												console.log(data)
												this.setState({"SearchAlbums": data})
											})}
										else{
											playlistToRender = this.state.UserPlaylists
											this.setState({"SearchAlbums": null})
										}
									}}/>
						{playlistToRender.map(Playlist =>
							{
								return(
								<PlaylistDisplay key={count++} token={this.state.AccessToken} index={count} playlist={Playlist}/>
							)}
						)
						}
					</div>
				: queryString.parse( window.location.search )
					.code
					? 	<div>
							<NavBar/>
							<div className="Loading">Loading...</div>
						</div>
					:
					// otherwise show a log in button
					<div>
						<NavBar/>
						<button className="Login" onClick={() =>{
						   this.login().then((url)=>{
								 window.location.href = url;
								})
							}}>
							Please sign in with spotify
						</button>
					</div>


					}
			</div>
		);
	};
}
export default SpotifyApp;
