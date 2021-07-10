import React from 'react';
import 'Style/PopUp.css';

export default class BasePopup extends React.Component{

	constructor(props, small){
		super(props);

		this.state = {
			small : small,
		};
	}

	renderPopup(){
		
	}

	render(){
		if(!this.props.show) return (<div></div>)

		return (

		<div id="pupBacking">
			<div id={this.state.small ? "pupWindowSmall" : "pupWindow"}>
				<div className="clmRemove" onClick={()=>{this.props.close();}}>x</div>
				{this.renderPopup()}
			</div>
		</div>
		);
	}
}