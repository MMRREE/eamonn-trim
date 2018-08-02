import React, { Component } from 'react'
import Layout from './Components/Layout.js'
import P5Wrapper from 'react-p5-wrapper'

import sketch from './3DSinWaveSketch.js'

class ThreeDSinWave extends Component {
	render() {
		return (
			<div className="3DSinWave">

				<Layout/>
				<div className="Sketch" style={{position:"absolute", left:"12.5vw", top:"10vh", zIndex:"1", fontSize:"2.25vh", background:"rgba(10,10,10,0.25)"}}>
					3DSinWave
					<hr/>
					<P5Wrapper sketch={sketch}/>
				</div>

			</div>
		)
	}
}


export default ThreeDSinWave;
