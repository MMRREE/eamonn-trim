import React, { Component } from 'react'
import Data from './Data/Data.json'
import Layout from './Data/Applications/Components/Layout.js'
import './Stylesheets/Applications.css'

class Applications extends Component {
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
								<a key={Data.Applications.indexOf(item)} className="Link" style={{backgroundImage:"URL("+item.Image+")"}} href={document.location.origin+"/Applications/"+item.Name}>
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
