import React, { Component } from 'react'
import Data from './Data/Data.json'
import Layout from './Data/Designs/Components/Layout.js'



let backendURL = ""
class Designs extends Component {
	componentDidMount(){
		if(window.location.href.includes("localhost"))backendURL = "http://localhost:8888/"
		else if (window.location.href.includes("heroku")) backendURL = "https://eamonn-trim-backend.herokuapp.com/"
	}

	render() {
		return (
			<div className="Designs">

				<Layout/>

				<div className="DesignBox">
					Designs
					<hr style={{width:"100%"}}/>
					<div className="ScrollBox">
						{Data ? Data.Designs.map((item)=>{
							if(item.Image === null) item.Image = "/Images/WIP.png"
							return(
								<a key={Data.Designs.indexOf(item)} className="Link" style={{backgroundImage:"url("+item.Image+")"}} href={backendURL+"Designs/"+item.Name}>
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


export default Designs;
