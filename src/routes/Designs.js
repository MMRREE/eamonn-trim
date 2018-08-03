import React, { Component } from 'react'
import Data from './Data/Data.json'
import Layout from './Data/Designs/Components/Layout.js'
import './Stylesheets/Designs.css'


class Designs extends Component {
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
								<a key={Data.Designs.indexOf(item)} className="Link" style={{backgroundImage:"url("+item.Image+")"}} href={document.location.origin+"/Designs/"+item.Name}>
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
