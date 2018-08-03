//Required react and react-routing imports
import React, {Component} from 'react'
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

class Routes extends Component{
	findGreatest(dates){
		let greatestYear = null
		let greatestMonth = null
		let greatestDay = null
		dates.forEach(item=>{
			let year = item[6]+item[7]+item[8]+item[9]
			let month = item[3]+item[4]
			let day = item[0]+item[1]
			if(year >= greatestYear) {
				greatestYear = year
				greatestMonth = month
				greatestDay = day
				if(month >= greatestMonth){
					greatestMonth = month
					greatestDay = day
					if(day >= greatestDay){
						greatestDay = day
					}
				}
			}
		})
		return(greatestDay+"/"+greatestMonth+"/"+greatestYear)
	}

	componentDidMount(){
		if(Data){
			let ComponentsInfo = [...Data.Designs, ...Data.Applications]
			let dates = ComponentsInfo.map(item =>{
				return item.Date
			})

			let find = this.findGreatest(dates)
			let greatestIndex = dates.findIndex(item=>{
				if(item === find) return(dates.indexOf(item))
				return(0)
			})

			let ComponentsLocal = {}
			let SketchesLocal = {}
			Data.Applications.forEach(item=>{
				ComponentsLocal[item.Name] = require('./Data/Applications/'+item.Name+'.js').default
			})

			Data.Designs.forEach(item=>{
				SketchesLocal[item.Name] = require('./Data/Designs/'+item.Name+'.js').default
			})

			Data.Pages.forEach(item=>{
				ComponentsLocal[item.Name] = require('./'+item.Name+'.js').default
			})

			this.setState({
				MostRecent:ComponentsInfo[greatestIndex],
				Components:ComponentsLocal,
				Sketches:SketchesLocal
			})
		}
	}

	render(){
		return(
		  	<Router>
			  	<div className="Main">
				 	<Switch>
			 			<Route exact path="/" component={Home}/>

						{/*Main pages path management based on data*/}
						{Data
							? Data.Pages.map(item=>{
								return(
									<Route key={Data.Pages.indexOf(item)} exact path={'/'+item.Name} component={
										this.state
										? this.state.Components[item.Name]
										: NotFound
									}/>
								)
							})
							: ""
						}

						{/*Applications path management from Data*/}
					  	{Data
							? Data.Applications.map(item => {
							  	return(
							  		<Route key={Data.Applications.indexOf(item)} exact path={"/Applications/"+item.Name} component={this.state
										? this.state.Components[item.Name]
										: NotFound}/>
						  			)
				  				})
				  			: ""}

						{/*Designs path management from Data*/}
					  	{Data
							? Data.Designs.map(item=>{
						  	return(
							  	<Route key={Data.Designs.indexOf(item)} exact path={"/Designs/"+item.Name} render={()=>
									<div className={item.Name}>

										<Layout/>
										<div className="Sketch" style={{position:"absolute", left:"12.5vw", top:"10vh", zIndex:"1", fontSize:"2.25vh", background:"rgba(10,10,10,0.25)"}}>
											{item.Name}
											<hr/>
											{this.state ? <P5Wrapper sketch={this.state.Sketches[item.Name]}/> : ""
										}
										</div>

									</div>
								}/>
						  	)
					  	})
					  	: ""}

						{Data
							? Data.Blogs.map(item=>{
								return(
									<Route key={Data.Blogs.indexOf(item)} exact path={"/Blog/"+item.Name} render={()=>
										<div className={"Blogpost "+item.Name}>

											<Layout/>
											<div className="Post" style={{position:"absolute", left:"12.5vw", top:"10vh", zIndex:"1", fontSize:"2.25vh", background:"rgba(10,10,10,0.25)"}}>
												{item.Name}
												<hr/>
												{item.Paragraphs.map(para=>{
													return(<p key={item.Paragraphs.indexOf(para)}>{para}</p>)
												})}
											</div>

										</div>
									}/>
								)
							}) : ""}

					  	{/*Most recent path from Data*/}
					  	{this.state
							? <Route exact path={"/MostRecent"} component={this.state
								? this.state.Components[this.state.MostRecent.Name]
								: NotFound}/>
							: ""
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
