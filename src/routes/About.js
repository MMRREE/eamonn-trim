import React, { Component } from 'react'
import Layout from './Data/Designs/Components/Layout.js'


class About extends Component {
	render() {
		return (
			<div className="About">

				<Layout/>

				<div className="AboutWebsiteBox">
					<h1>About This Website</h1>
					<hr/>
					<div>Welcome to the first ever developmental website designed by Eamonn Trim. Having started my course in electrical and electronic engineering in the September 2017, I decided to take up trying to develop a website in the summer of 2018. The reasons for this are the following:
						<ol>
							<li>I was interested in learning html and css and other web design languages and other ways to develop a website.</li>
							<li>To be able to host a website to show off some of the coding applications that I develop throughout my time are University of Southampton, my career and any small projects I decide to take up in the meanwhile.</li>
							<li>To find something to do during the summer to keep my mind sharp on the content of my first year.</li>
						</ol>
					At this start my idea was to have this website run off some html pages and some react pages, but the more I started to develop the more I realised this was unfeasible. As such this whole website runs form the reactjs framework and react-router add-on. As of now this will be hosted on heroku.com but at some point I hope to be able to host it on my own domain.</div>
				<hr/>
				<a className="Link" href={document.location.origin+"/MostRecent"}>Check out my most recent work here!</a>
				</div>

				<div className="AboutAuthorBox">
					<h1>About The Creator</h1>
					<hr/>
					<div>
						I was born in Epsom, England, grew up in Switzerland. Whilst at high school, although I wasn't offered any classes in technology or computer science I had a keen interest in this area, teaching myself to code and building my own computer. Coming to pick my unviersity course I decided to follow that route and pick Electrical and Electronic Engineering at University of Southampton. I am looking to develop this website for myself but also to demonstrate how even though at University I was not formally taught HTML, Javascript or CSS, it is all easy to learn and able to build a professional looking website on self taught knowledge.
						<br style={{marginBottom:"15px"}}/>
						I was educated in Switzerland at Haut-Lac International Billingual School, from primary through to secondary school and still have permanent residence there outside of term time. Witin term time I am studying and living in Southampton. To read more about the website read the paragraph on the right. Otherwise, please enjoy the website!
						{//'
					}
					</div>
				<hr/>
				<a className="Link" href={document.location.origin+"/Contact"}>Check out the contact page here!</a>
				</div>

			</div>
		)
	}
}


export default About;
