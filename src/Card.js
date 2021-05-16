import React from 'react';
import './Card.css';

class Card extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			data : this.props.data.data,
			type : this.props.data.type,
		};

	}

	render(){
		switch(this.state.type){
			case "text": return (<div className="cardMain"><span className="cardText">{this.state.data}</span></div>);
			case "image": return (<div className="cardMain"><img className="cardImage" src={this.state.data}/></div>);
			default: return (<div className="cardMain"><span className="cardText">Unknown card type '{this.state.type}'</span></div>);
		}
	}
}

export default Card;