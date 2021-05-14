import React from 'react';
import './Trello.css';
import Board from "./Board";

class Trello extends React.Component{

	constructor(props){
		super(props);
		window.document.title = "Dashboard - Trello-Clone";
	}

	render(){
		return (
			<div className="trlMain">
				<Board/>
			</div>
		);
	}
}

export default Trello;