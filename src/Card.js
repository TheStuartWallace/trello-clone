import React from 'react';
import './Card.css';

class Card extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			title : this.props.data.title,
		};

	}

	render(){
		return (
			<div className="cardMain">
				<span className="cardTitle">{this.state.title}</span>
			</div>
		);
	}
}

export default Card;