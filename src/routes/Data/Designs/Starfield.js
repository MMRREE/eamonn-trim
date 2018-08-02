import React, { Component } from 'react'
import Layout from './Components/Layout.js'
import P5Wrapper from 'react-p5-wrapper'

import sketch from './StarfieldSketch.js'

class Starfield extends Component {
	render() {
		return (
			<div className="Starfield">

				<Layout/>

				<div className="Sketch" style={{position:"absolute", left:"12.5vw", top:"10vh", zIndex:"1", fontSize:"2.25vh", background:"rgba(10,10,10,0.25)"}}>
					Starfield
					<hr/>
					<P5Wrapper sketch={sketch}/>
				</div>

			</div>
		)
	}
}


export default Starfield;
