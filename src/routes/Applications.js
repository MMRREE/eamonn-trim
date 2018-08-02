import React, { Component } from 'react'
import Data from './Data/Data.json'
import Layout from './Data/Designs/Components/Layout.js'


let backendURL = ""
class Applications extends Component {
	componentDidMount(){
		if(window.location.href.includes("localhost"))backendURL = "http://localhost:8888/"
		else if (window.location.href.includes("heroku")) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
	}

	render() {
		return (
			<div className="Applications">

				<Layout/>

				<div className="AppBox">
					Applications
					<hr style={{width:"100%"}}/>
					<div className="ScrollBox">
						{Data ? Data.Applications.map((item)=>{
							if(item.Image === null) item.Image = "/Images/WIP.png"
							return(
								<a key={Data.Applications.indexOf(item)} className="Link" style={{backgroundImage:"URL("+item.Image+")"}} href={backendURL+"Applications/"+item.Name}>
									<div className="Info">
										<div className="Name">{item.Name}</div>
										<hr/>
										<div className="Date">{item.Date}</div>
										<div className="Description">{item.Description}</div>
									</div>
								</a>)
						}) : <div>No Data</div>}
					</div>
				</div>
			</div>
		)
	}
}


export default Applications;
