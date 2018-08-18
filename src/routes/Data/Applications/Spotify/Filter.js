import React, { Component } from 'react';

class Filter extends Component {
	render() {
		return (
			<div className="Filter" style={{gridArea:"Filter"}}>
				<input type="text" placeholder="Search..." onKeyUp={(event) =>{
					this.props.onFilterChange(event.target.value)
					if(event.keyCode === 13){
						this.props.onEnter(event.target.value)
					}
				}
				}/>
			</div>
		);
	}
}

export default Filter
