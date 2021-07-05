import React from 'react';
import './PopUp.css';

class Popup extends React.Component{

	constructor(props){
		super(props);

		this.state = {

		};
	}

	renderPopup(){
		
	}

	render(){
		<div id="pupBacking">
			<div id="pupWindow">
				{this.renderPopup()}
			</div>
		</div>
	}
}

export default Popup;