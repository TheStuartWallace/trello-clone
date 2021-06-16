import React from 'react';
import 'Style/Trello.css';
import Board from "Components/Main/Board";
import {HashRouter as Router, Route} from 'react-router-dom';

class Trello extends React.Component{

	constructor(props){
		super(props);
		window.document.title = "Dashboard - Trello-Clone";
	}

	render(){
		return (
			<Router>
				<Route path="/:id" exact component={Board} />
			</Router>
		);	
	}
}

export default Trello;