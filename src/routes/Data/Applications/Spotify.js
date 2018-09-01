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
	handleScriptLoad(){
		//script for running for the wed playback SDK
		return new Promise(resolve =>{
			if(window.Spotify){
				resolve()
			} else{
				window.onSpotifyWebPlaybackSDKReady = resolve;
			}
		})
	}

	async componentWillMount() {
		this.handleScriptLoad()

		this.setState({
			FilterString:"",
			FavoritesClicked:false,
			SearchAlbums:null,
			localTime:0
		})

		if ( window.location.href.includes( "localhost" ) ) backendURL = "http://localhost:8888/"
		else if ( window.location.href.includes( "heroku" ) ) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
		else backendURL = "http://" + window.location.hostname + ":8888/"
		redirect_uri = document.location.origin + '/Applications/Spotify/'

		if ( queryString.parse( window.location.search )
			.code ) {
			let tokenPayload = await(
				await fetch(
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
				)).json()
			if(tokenPayload.error === "invalid_grant"){
				let redirect = await this.login()
				window.location.href = redirect
			}
			else{
				await this.setUpState(tokenPayload.AccessToken, tokenPayload.RefreshToken, true)
				this.interval = setInterval(()=>this.tick(), 1000)
			}
			if(this.state.ServerData.UserName !== "") console.log(this.state)
		}
	}

	async setUpState( accessToken = null, refreshToken = null, refresh = false ) {
		if ( accessToken ) {
			if(refresh) {
				let playlistData = await(
					await fetch( backendURL + 'spotify/playlistData', {
						method: "POST",
						headers: { 'content-type': 'application/json' },
						mode: 'cors',
						body: JSON.stringify( { "access_token": accessToken } )
					} )).json()
				this.setState({
					ServerData: playlistData,
					AccessToken: accessToken,
					RefreshToken: refreshToken
				})
			} else{
				this.setState({
					AccessToken: accessToken,
					RefreshToken: refreshToken
				})
			}
			if(this.state.ServerData.Playlists) this.setState({
				"UserPlaylists": this.state.ServerData.Playlists
			})
		}
	}


	async tick() {
		this.setState( { localTime: this.state.localTime + 1 } )

		if ( this.state.localTime >= 3600 ) {
			let refreshTokenPayload = await(
				await fetch(
				backendURL + 'spotify/token', {
					method: "POST",
					body: JSON.stringify( {
						"grant_type": "refresh_token",
						"refresh_token": this.state.RefreshToken
					} ),
					headers: { 'content-type': 'application/json' },
					mode: 'cors'
				}
			)).json()
			if(refreshTokenPayload.RefreshToken){
				console.log("new RT", refreshTokenPayload.RefreshToken)
				this.setUpState( refreshTokenPayload.AccessToken, refreshTokenPayload.RefreshToken )
			} else{
				this.setUpState( refreshTokenPayload.AccessToken, this.state.RefreshToken )
			}
			this.setState( { localTime: 0 } )
		}
	}

	componentWillUnmount() {
		clearInterval( this.interval )
	}

	login( callback ) {
		let url_login = 'https://accounts.spotify.com/en/authorize?' +
			queryString.stringify( {
				response_type: 'code',
				client_id: client_id,
				scope: scopes,
				redirect_uri: redirect_uri
			}, {
				encode: false,
				strict: false
			} )
		if ( callback ) {
			return callback( url_login );
		} else {
			return new Promise( ( resolve ) => {
				resolve( url_login );
			} );
		}
	}

	render() {
		let filteredPlaylists = this.state && this.state.ServerData && this.state.ServerData.Playlists ? this.state.ServerData.Playlists.filter( Playlist => {
			let filter = this.state.FilterString.toLowerCase()

			let matchesPlaylist = Playlist.Name.toLowerCase()
				.includes( filter )

			let matchesTrack = Playlist.Songs.find( Song => Song.Name.toLowerCase()
				.includes( filter ) )

			return matchesPlaylist || matchesTrack
		} ) : [];

		let filteredFavArtists = this.state && this.state.ServerData && this.state.ServerData.FavArtists ? this.state.ServerData.FavArtists.filter( Playlist => {
			let filter = this.state.FilterString.toLowerCase()

			let matchesPlaylist = Playlist.Name.toLowerCase()
				.includes( filter )

			let matchesTrack = Playlist.Songs.find( Song => Song.Name.toLowerCase()
				.includes( filter ) )

			return matchesPlaylist || matchesTrack
		} ) : []

		let playlistToRender = this.state && this.state.SearchAlbums ? this.state.SearchAlbums : filteredPlaylists


		playlistToRender = this.state && this.state.FavoritesClicked ? filteredFavArtists : playlistToRender

		let title = this.state && this.state.ServerData && this.state.ServerData.User && this.state.ServerData.User.Name && this.state.ServerData.Playlists ? this.state.ServerData.User.Name + "'s playList" : "";
		title ? document.title = title : document.title = "Spotify Playlists"
		return (
			<div className="Spotify">
				{this.state && this.state.ServerData && this.state.ServerData.Playlists ?
					// if signed in show the whole applicaiton
					<div className="Display">
						<NavBar style={{gridArea:"NavBar"}}/>
						<UserProfile UserData={this.state.ServerData.User}/>
						<SpotifyPlayer className="Player" playerObjectUpdate={player =>
									this.setState({PlayerInfo: player})
							} accessToken={this.state.AccessToken}/>
						<PlaylistCounter playlists={playlistToRender}/>
						{!this.state.FavoritesClicked ? <HourCounter playlists={playlistToRender}/> : null}
						<input type="button" value="Favorites" className="FavoriteButton" style={{gridArea:"FavoriteButton"}} onClick={()=>{
							this.setState({"FavoritesClicked": true})
							console.log(this.state)
						}}/>
						<input type="button" value="Playlists" className="PlaylistsButton" style={{gridArea:"PlaylistsButton"}} onClick={()=>{
							this.setState({"FavoritesClicked": false})
							console.log(this.state)
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
												this.setState({"SearchAlbums": data})
												console.log(this.state)
											})}
										else{
											playlistToRender = this.state.UserPlaylists
											this.setState({"SearchAlbums": null})
										}
									}}/>
						{playlistToRender.map(Playlist =>
							{
								return(
								<PlaylistDisplay key={playlistToRender.indexOf(Playlist)} token={this.state.AccessToken} index={playlistToRender.indexOf(Playlist)} playlist={Playlist}/>
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
