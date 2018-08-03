import React, { Component } from 'react'
import Data from './Data/Data.json'
import Layout from './Data/Applications/Components/Layout.js'
import './Stylesheets/Blog.css'


class Blog extends Component {
	render() {
		return (
			<div className="Blog">

				<Layout/>

				<div className="AppBox">
					Posts
					<hr style={{width:"100%"}}/>
					<div className="ScrollBox">
						{Data && Data.Blogs ? Data.Blogs.map((item)=>{
							if(item.Image === null) item.Image = "/Images/WIP.png"
							return(
								<a key={Data.Blogs.indexOf(item)} className="Link" style={{backgroundImage:"URL("+item.Image+")"}} href={document.location.origin+"/Blog/"+item.Name}>
									<div className="Info">
										<div className="Name">{item.Name}</div>
										<hr/>
										<div className="Date">{item.Date}</div>
										<div className="Description">{item.Paragraphs[0]}</div>
									</div>
								</a>)
						}) : <div>No Data</div>}
					</div>
				</div>
			</div>
		)
	}
}


export default Blog;
