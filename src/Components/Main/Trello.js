import React from 'react';
import 'Style/Trello.css';

import AuthProvider from "Components/Auth/AuthProvider";

import Board from "Components/Main/Board";
import SignIn from "Components/SignIn/SignIn";
import Profile from "Components/Profile/Profile";

import {BrowserRouter as Router, Route} from 'react-router-dom';

class Trello extends React.Component{

	constructor(props){
		super(props);
		window.document.title = "Dashboard - Trello-Clone";
	}

	render(){
		return (
			<AuthProvider>
				<Router>
					<Route path="/b/:id" exact component={Board} />
					<Route path="/u/:id" exact component={Profile} />
					<Route path="/signin" exact component={SignIn} />
				</Router>
			</AuthProvider>
		);	
	}
}

export default Trello;