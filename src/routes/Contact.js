import React, { Component } from 'react'
import Layout from './Data/Designs/Components/Layout.js'


let inputAuthor = ""
let inputComment = ""
let Comments = []
let backendURL = ""

class Contact extends Component {
	postComment() {
		return fetch( backendURL+'contact/comments', {
				method: "POST",
				body: JSON.stringify( {
					"Comment": {
						"Author": inputAuthor,
						"Comment": inputComment,
						"Approved": true
					}
				} ),
				headers: { 'content-type': 'application/json' },
				mode: "cors"
			} )
			.then( response => response.json() )
	}

	componentDidMount() {
		console.log(window.location.href)
		if(window.location.href.includes("localhost"))backendURL = "http://localhost:8888/"
		else if (window.location.href.includes("heroku")) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
		console.log(backendURL)
		fetch( backendURL+'contact/comments', {
				method: "GET",
				headers: { 'content-type': 'application/json' },
				mode: "cors"
			} )
			.then( response => response.json() )
			.then( data => {
				Comments = data.Comments
				if ( Comments !== null ) this.setState( { Comments: Comments } )
				else this.setState( { Comments: null } )
				console.log( this.state )
			} )
	}

	render() {
		return (
			<div className="Contact">

				<Layout/>

				<div className="DisplayCommentBox">
				<div style={{textAlign:"center", fontSize:"5.5vmin"}}>Comments</div>
					<div className="DisplayBoxScroll">
					{this.state ?
						this.state.Comments.map(item => {
							console.log(item)
						if(item.Approved) return(
							<div style={{display:"grid"}} key={this.state.Comments.indexOf(item)}>
								<hr style={{margin:"0 0 0.75vh 0", width:"100%"}}/>
								<div className="Author">{item.Author}</div>
								<div className="Comment">{item.Comment}</div>
							</div>
						)
						else return null
					}) : ""}
					</div>
				</div>


				<div className="ContactMethods">
					<div style={{textAlign:"center", fontSize:"5.5vmin"}}>Submit A Comment!</div>
					<div className="WriteCommentBox">
						<hr style={{margin:"0 0 0.75vh 0", width:"100%", gridArea:"hr"}}/>
						<div style={{gridArea:"AuthorTag"}}>Author:</div>
						<input className="Input InputText" maxLength="70" style={{gridArea:"AuthorInput"}} type="text" placeholder="Author" onKeyUp={event => inputAuthor = event.target.value}/>
						<div style={{gridArea:"CommentTag"}}>Comment:</div>
						<textarea className="Input InputText" maxLength="340" style={{gridArea:"CommentInput", height:"12em"}} type="text" placeholder="Comment" onKeyUp={event => inputComment = event.target.value}/>
						<input className="Input" style={{gridArea:"Submit"}} type="button" value="Submit" onClick={event => {
										if(inputAuthor !== "" && inputComment !== "") {
											this.postComment().then(data => {
												this.setState({"Comments":data.Comments})
												console.log(this.state)
												this.forceUpdate()
											})
										}
										else alert("Must fill out both inputs")
									}}/>
					</div>
					<hr/>
					<a className="Link" href="mailto:eamonntrim@gmail.com?subject=Contact%20Me%20Page%20Submission&body=Dear%20Eamonn,"><div style={{textAlign:"center", fontSize:"5.5vmin"}}>Email Me!</div></a>
				</div>

			</div>
		)
	}
}


export default Contact;
