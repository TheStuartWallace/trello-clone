import React from 'react';
import 'Style/Trello.css';
import Board from "Components/Main/Board";
import AuthProvider from "Components/Auth/AuthProvider";
import {HashRouter as Router, Route} from 'react-router-dom';

class Trello extends React.Component{

	constructor(props){
		super(props);
		window.document.title = "Dashboard - Trello-Clone";
	}

	render(){
		return (
			<AuthProvider>
				<Router>
					<Route path="/:id" exact component={Board} />
				</Router>
			</AuthProvider>
		);	
	}
}

export default Trello;