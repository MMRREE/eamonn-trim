//Required react and react-routing imports
import React, { Component } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'
import P5Wrapper from 'react-p5-wrapper'

//Custom routing using the datastores
import Data from './Data/Data.json'

//Routings for the pages with special properties
import Home from './Home'
import NotFound from './NotFound'

//Required layout item to be able to render in this dom element
import Layout from './Data/Applications/Components/Layout.js'

class Routes extends Component {
	findGreatestDate( dates ) {
		let greatestYear = null
		let greatestMonth = null
		let greatestDay = null
		dates.forEach( date => {
			let year = date[6] + date[7] + date[8] + date[9]
			let month = date[3] + date[4]
			let day = date[0] + date[1]
			if (year >= greatestYear) {
				greatestYear = year
				greatestMonth = month
				greatestDay = day
				if (month >= greatestMonth) {
					greatestMonth = month
					greatestDay = day
					if (day >= greatestDay) {
						greatestDay = day
					}
				}
			}
		} )
		return (greatestDay + "/" + greatestMonth + "/" + greatestYear)
	}

	componentDidMount() {
		if (Data) {
			let applicationDates = Data.Applications.map( application => {
				return application.Date
			} )
			let queryDate = this.findGreatestDate( applicationDates )
			let greatestIndex = applicationDates.findIndex( application => {
				if (application === queryDate) return applicationDates.indexOf( application )
				return null
			} )
			if (applicationDates.length === 1) greatestIndex = 0

			let localComponents = {}
			let localSketches = {}
			Data.Applications.forEach( application => {
				localComponents[application.Name] = require('./Data/Applications/' + application.Name + '.js').default
			} )

			Data.Designs.forEach( design => {
				localSketches[design.Name] = require('./Data/Designs/' + design.Name + '.js').default
			} )

			Data.Pages.forEach( page => {
				localComponents[page.Name] = require('./' + page.Name + '.js').default
			} )

			this.setState( {
				MostRecent: Data.Applications[greatestIndex],
				Components: localComponents,
				Sketches: localSketches
			} )
		}
	}

	render() {
		return (
			<Router>
			  	<div className="Main">
				 	<Switch>
			 			<Route exact path="/" component={Home}/>

						{/*Main pages path management based on data*/}
						{Data ?
							Data.Pages.map(page=>{
								return(
									<Route key={Data.Pages.indexOf(page)} exact path={'/'+page.Name} component={
										this.state
										? this.state.Components[page.Name]
										: NotFound
									}/>
								)
							})
							: null
						}

						{/*Applications path management from Data*/}
					  	{Data ?
							Data.Applications.map(app=>{
							  	return(
							  		<Route key={Data.Applications.indexOf(app)} exact path={"/Applications/"+app.Name} component={this.state
										? this.state.Components[app.Name]
										: NotFound
									}/>
								)
							})
				  			: null
						}

						{/*Designs path management from Data*/}
					  	{Data ?
							Data.Designs.map(design=>{
							  	return(
								  	<Route key={Data.Designs.indexOf(design)} exact path={"/Designs/"+design.Name} render={()=>
										<div className={design.Name}>
											<Layout/>
											<div className="Sketch" style={{position:"absolute", left:"12.5vw", top:"10vh", zIndex:"1", fontSize:"2.25vh", background:"rgba(10,10,10,0.25)"}}>
												{design.Name}
												<hr/>
												{this.state ? <P5Wrapper sketch={this.state.Sketches[design.Name]}/> : ""
											}
											</div>

										</div>
									}/>
							  	)
						  	})
						  	: null
						}

						{Data ?
							Data.Blogs.map(blog=>{
								return(
									<Route key={Data.Blogs.indexOf(blog)} exact path={"/Blog/"+blog.Name} render={()=>
										<div className={"Blogpost "+blog.Name}>
											<Layout/>
											<div className="Post">
												<div className="ScrollBox">
													<img className="Image" alt={blog.Name} src={blog.Image}/>
													<div className="Name">
														<h1>{blog.Name}</h1>
														<hr/>
													</div>
													{blog.Paragraphs.map(para=>{
														return(<p key={blog.Paragraphs.indexOf(para)}>{para}</p>)
													})}
													<hr/>
													<h1>Sources</h1>
													{blog.Sources.map(source=>{
														return(<div key={blog.Sources.indexOf(source)}>{source.Name+": "}<a href={source.Link}>{source.Link}</a></div>)
													})}
													<div className="Spacing"/>
												</div>
											</div>
										</div>
									}/>
								)
							}) 
							: null
						}

					  	{/*Most recent path from Data*/}
					  	{this.state
							? <Route exact path={"/MostRecent"} component={this.state
								? this.state.Components[this.state.MostRecent.Name]
								: NotFound}/>
							: null
						}

						{/*Not Found route for any undefined locations*/}
			  			<Route path="*" component={NotFound}/>
		 			</Switch>
				</div>
			</Router>
		)
	}

}

export default Routes;
