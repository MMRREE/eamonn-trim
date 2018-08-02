//Required react and react-routing imports
import React, {Component} from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'

//Custom routing using the datastores
import Data from './Data/Data.json'

//Routings for the pages with special properties
import Home from './Home'
import NotFound from './NotFound'

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
			Data.Applications.forEach(item=>{
				ComponentsLocal[item.Name] = require('./Data/Applications/'+item.Name+'.js').default
			})

			Data.Designs.forEach(item=>{
				ComponentsLocal[item.Name] = require('./Data/Designs/'+item.Name+'.js').default
			})

			Data.Pages.forEach(item=>{
				ComponentsLocal[item.Name] = require('./'+item.Name+'.js').default
			})

			this.setState({
				MostRecent:ComponentsInfo[greatestIndex],
				Components:ComponentsLocal
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
							  	<Route key={Data.Designs.indexOf(item)} exact path={"/Designs/"+item.Name} component={this.state
									? this.state.Components[item.Name]
									: NotFound}/>
						  	)
					  	})
					  	: ""}

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
